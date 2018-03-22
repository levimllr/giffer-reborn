importScripts("FrameManager.js");

var breakpoints = [];
var frameManager;

var load = function(rt) {

  // PIN FUNCTIONS ////////////////////////////////////////////////

  var gen_int_obj = function (val) {
    return {t: rt.unsignedintTypeLiteral, v: val, left: true};
  };

  rt.scope[0]["LOW"] = gen_int_obj(LOW);
  rt.scope[0]["HIGH"] = gen_int_obj(HIGH);

  rt.scope[0]["INPUT"] = gen_int_obj(INPUT);
  rt.scope[0]["OUTPUT"] = gen_int_obj(OUTPUT);
  
  rt.scope[0]["RISING"] = gen_int_obj(RISING);
  rt.scope[0]["FALLING"] = gen_int_obj(FALLING);
  rt.scope[0]["CHANGE"] = gen_int_obj(CHANGE);

  frameManager = new FrameManager();

  setAllInputPinsToTime(frameManager, 0);

  var pinMode = function (rt, _this, pinNumber, mode) {
    if (mode > 2) {
      rt.raiseException("Unknown mode " + mode.toString());
      return;
    }
    frameManager.setPinMode(pinNumber.v, mode.v);
  };
  rt.regFunc(pinMode, "global", "pinMode", [rt.unsignedintTypeLiteral, rt.unsignedintTypeLiteral], rt.voidTypeLiteral);

  var digitalWrite = function (rt, _this, pinNumber, state) {
    if (frameManager.getPinMode(pinNumber.v) !== OUTPUT) {
      rt.raiseException("Attempted to write to an input pin in digitalWrite.");
      return;
    }
    if (state.v > 1) {
      rt.raiseException("Unknown state " + state.v.toString() + " passed to digitalWrite.");
      return;
    }
    var val;
    if (state.v == HIGH) {
      val = ANALOG_MAX;
    } else {
      val = 0;
    }
    frameManager.setPinState(pinNumber.v, val);
  };
  rt.regFunc(digitalWrite, "global", "digitalWrite", [rt.unsignedintTypeLiteral, rt.unsignedintTypeLiteral], rt.voidTypeLiteral);

  var analogRead = function (rt, _this, pinNumber) {
    return {t: rt.intTypeLiteral, v: frameManager.getPinState(pinNumber.v, frameManager.currentFrame), left: true};
  };
  rt.regFunc(analogRead, "global", "analogRead", [rt.unsignedintTypeLiteral], rt.intTypeLiteral);

  var analogWrite = function (rt, _this, pinNumber, value) {
    if (frameManager.getPinMode(pinNumber.v) !== OUTPUT) {
      rt.raiseException("Attempted to write to an input pin in analogWrite.");
      return;
    }
    frameManager.setPinState(pinNumber.v, value.v);
  };
  rt.regFunc(analogWrite, "global", "analogWrite", [rt.unsignedintTypeLiteral, rt.unsignedintTypeLiteral], rt.voidTypeLiteral);

  // DELAY ////////////////////////////////////////////////////////

  var delay = function (rt, _this, ms) {
    frameManager.nextFrame(ms.v);

    setAllInputPinsToTime(frameManager, frameManager.elapsedTime);

    var message = {delay: ms.v, newFrameNumber: frameManager.currentFrame, type: "newFrame"};
    this.postMessage(JSON.stringify(message));
  };
  rt.regFunc(delay, "global", "delay", [rt.primitiveType("unsigned long")], rt.voidTypeLiteral);

  // INTERRUPT ////////////////////////////////////////////////////

  var attachInterrupt = function (rt, _this, pin, callback, trigger) {
    //pointer, pin, trigger, previous
    interrupts.push({callback, pin, trigger, getPinValueAtTime(frameManager.elapsedTime)});
  }
  rt.regFunc(attachInterrupt, "global", "attachInterrupt", [rt.unsignedintTypeLiteral, rt.functionPointerType(rt.voidTypeLiteral, []), rt.unsignedintTypeLiteral], rt.voidTypeLiteral);

  var detachInterrupt = function (rt, _this, pin) {
    for (var i = 0; i < interrupts.length; i++) {
      if (interrupts[i].pin === pin) {
	interrupts.remove(interrupts[i]);
      }
    }
  }
  rt.regFunc(detachInterrupt, "global", "detachInterrupt", [rt.unsignedintTypeLiteral], rt.voidTypeLiteral);
  
  
  
// STRING ///////////////////////////////////////////////////////
  //Define type
  var string_t = rt.newClass("String", [
    {
      type: rt.normalPointerType(rt.charTypeLiteral),
      name: "buffer"
    }, {
      type: rt.unsignedintTypeLiteral,
      name: "capacity"
    }, {
      type: rt.unsignedintTypeLiteral,
      name: "len"
    }
  ]);
  rt.types[rt.getTypeSignature(string_t)] = {
    "#father": "object"
  };
  var to_char_star = function(rt, _this) {
    return _this.v.members.buffer;
  };
  rt.regFunc(to_char_star, string_t, "c_str", [], rt.normalPointerType(rt.charTypeLiteral));


  // SERIAL ///////////////////////////////////////////////////////
  //Define types
  var print_t = rt.newClass("Print", []);
  rt.types[rt.getTypeSignature(print_t)] = {
    "#father": "object"
  };
  var stream_t = rt.newClass("Stream", []);
  rt.types[rt.getTypeSignature(stream_t)] = {
    "#father": "Print"
  };
  var hs_t = rt.newClass("HardwareSerial", []);
  rt.types[rt.getTypeSignature(hs_t)] = {
    "#father": "Stream"
  };

  var begin = function (rt, _this, rate) {
    if (_this.v.initialized) {
      rt.raiseException("Serial initialized twice.");
    }
    _this.v.initialized = true;
    _this.v.rate = rate.v;
  };
  rt.regFunc(begin, hs_t, "begin", [rt.unsignedintTypeLiteral], rt.voidTypeLiteral);

  var do_output = function(text) {
    frameManager.addOutputText(text);
    var message = {text: text, type: "output"};
    this.postMessage(JSON.stringify(message));
    };

  function get_string_for(rt, _this, thing) {
    if (rt.isStringType(thing.t)) {
      return rt.getStringFromCharArray(thing);
    } else {
      return "" + thing.v;
    }
  }
  
  var print = function (rt, _this, thing) {
    if (!_this.v.initialized) {
      rt.raiseException("Serial used before initialization.");
    }
    do_output("" + get_string_for(rt, _this, thing));
  };
  rt.regFunc(print, hs_t, "print", ["#default"], rt.voidTypeLiteral);

  var println = function(rt, _this, thing) {
    if (!_this.v.initialized) {
      rt.raiseException("Serial used before initialization.");
    }
    do_output("" + get_string_for(rt, _this, thing) + "\n");
  };
  rt.regFunc(println, hs_t, "println", ["#default"], rt.voidTypeLiteral);

  //Create serial object
  var serial_obj = {
    t: hs_t,
    v: {
      rate: 0,
      initialized: false,
      members: {}
    },
    left: false
  };
  rt.scope[0]["Serial"] = serial_obj;

};

arduino_h = {
  load: load
};

var interrupts = [];
// {pointer, pin, trigger, previous}
/**
    LOW to trigger the interrupt whenever the pin is low,
    CHANGE to trigger the interrupt whenever the pin changes value
    RISING to trigger when the pin goes from low to high,
    FALLING for when the pin goes from high to low.
    The Due, Zero and MKR1000 boards allows also:
    HIGH to trigger the interrupt whenever the pin is high.

**/
function fireInterrupts(time) {
  for (var i = 0; i < interrupts.length; i++) {
    var pin = interrupts[i].pin;
    var value = 0;
    var previous = interrupts[i].previous;
    var pointer = interrupts[i].pointer;
    if (frameManager.getMode(pin) === INPUT) {
      value = getPinValueAtTime(pin, time);
    } else if (frameManager.getMode(pin) === OUTPUT) {
      value = frameManager.getState(pin);
    }
    if (trigger === LOW) {
      if (value === LOW && previous !== LOW) {
	callPointer(pointer);
      }
    } else if (trigger === CHANGE) {
      if (value !== previous) {
	callPointer(pointer);
      }
    } else if (trigger === RISING) {
      if (value > previous) {
	callPointer(pointer);
      }
    } else if (trigger === FALLING) {
      if (value < previous) {
	callPointer(pointer);
      }
    } else if (trigger === HIGH) {
      if (value === HIGH && previous !== HIGH) {
	callPointer(pointer);
      }
    }
    interrupts[i].previous = value;
  }
}

function callPointer(pointer) {
  //for paul to do...
}


var pinKeyframes;
var sortedPinKeyframes;
function setPinKeyframes(pkfs){
  pinKeyframes = pkfs;
  sortedPinKeyframes = {};
  for(var frame of pinKeyframes){
    if(!sortedPinKeyframes[frame.pin]){
      sortedPinKeyframes[frame.pin] = [];
    }
    sortedPinKeyframes[frame.pin].push({time: frame.time, value: frame.value});
  }
  for(var pin in sortedPinKeyframes){
    sortedPinKeyframes[pin].sort(function(a, b){
      return a.time - b.time;
    });
  }
}

function getPinValueAtTime(pin, time){
  var values = sortedPinKeyframes[pin];
  var lastValue = 0;
  for(var pair of values){
    if(pair.time <= time){
      lastValue = pair.value;
    } else {
      return lastValue;
    }
  }
  return lastValue;
}

function setAllInputPinsToTime(frameManager, time){
  for (var pin in sortedPinKeyframes) {
    frameManager.setPinMode(pin, INPUT);
    frameManager.setPinState(pin, getPinValueAtTime(pin, time));
  }
}

var cppdebugger = null;
var lastLine = null;

function submitFrameManager() {
  var out = {frameManager: JSON.stringify(frameManager), type: "frameManager"};
  this.postMessage(JSON.stringify(out));
}

function submitDebuggerState() {
  this.postMessage(JSON.stringify({type: "debuginfo",
                                   variables: cppdebugger.variable(),
                                   node: cppdebugger.nextNode(),
                                   frameManager: frameManager}));
}

function qualifiedContinue() {
  if (cppdebugger.continue() === false) {
    submitDebuggerState();
  } else {
    submitFrameManager();
  }
}

function setLineByLine(state) {
  cppdebugger.stopConditions["lineChanged"] = state;
}

function disableAll() {
  cppdebugger.stopConditions["lineChanged"] = false;
  cppdebugger.stopConditions["breakpoints"] = false;
}

function enableAll() {
  cppdebugger.stopConditions["breakpoints"] = true;
}

function messageHandler(event) {
  if (event.data.type == "code") {
    var code = event.data.code;
    setPinKeyframes(event.data.pinKeyframes);
    var debugging = event.data.debugging;
    var config = {
      includes: {
        "Arduino.h": arduino_h //defined in Arduino.js
      },
      debug: debugging
    };
    cppdebugger = JSCPP.run(code, "", config);

    if (config.debug) {
      cppdebugger.conditions["breakpoints"] = function (prev, next) {
        var previous = lastLine;
        lastLine = next.sLine;
        if (breakpoints.includes(next.sLine) && previous !== next.sLine) {
          return true;
        } else {
          return false;
        }
      };

      cppdebugger.stopConditions["breakpoints"] = true;
      setLineByLine(false);

      qualifiedContinue();
    } else {
      submitFrameManager();
    }
  } else if (event.data.type == "breakpoints") {
    breakpoints = event.data.breakpoints;
  } else if (event.data.type == "debugger") {
    if (cppdebugger === null || cppdebugger.done) {
      return;
    }
    if (event.data.action == "continue") {
      setLineByLine(false);
      qualifiedContinue();
    }
    else if (event.data.action == "stepInto") {
      setLineByLine(true);
      cppdebugger.stopConditions["breakpoints"] = false;
      qualifiedContinue();
    }
    else if (event.data.action == "enabled") {
      if (event.data.state) {
        enableAll();
      } else {
        disableAll();
      }
    }
  }
}

this.addEventListener("message", messageHandler, false);

importScripts("JSCPP.js");
