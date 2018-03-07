"use strict";
var editor = ace.edit("editor");
editor.getSession().setMode("ace/mode/c_cpp");

function gutterClick(e) {
  toggleBreakpoint(e.getDocumentPosition().row);
  e.stop();
}

editor.on("gutterclick", gutterClick);

editor.on("guttermousedown", function(e) {
  e.stop();
});

editor.setOptions({
  maxLines: Infinity,
  minLines: 50
});

var Range = ace.require('ace/range').Range;
var prefix = "#include \"Arduino.h\"\ntypedef unsigned char byte;\n";

var defaultCode = `void setup() {
  pinMode(3, OUTPUT);
}

void loop() {
  digitalWrite(3, HIGH);
  delay(500);
  digitalWrite(3, LOW);
  delay(500);
}
`;

var defaultSuffix = `int main() {
  setup();
  loop();
  return 0;
}
`;


var STATUS_TYPES = ["info", "danger", "success"];

var nameField = document.getElementById("name");
var exerciseField = document.getElementById("exercise-number");
var boardField = document.getElementById("board");

function getFromStorage(item, ifEmpty) {
  var i = localStorage.getItem(item);
  if(i === null || i === undefined || i === "") {
    return (ifEmpty !== null && ifEmpty !== undefined) ? ifEmpty : "";
  } else {
    return i;
  }
}

function setToStorage(item, value) {
  localStorage.setItem(item, value);
}

function loadBoard() {
  loadBoardFromExercise({board: {type: boardField.value, setup: ""}});
}

function loadBoardFromExercise(exercise) {
  setStatus("Loading", "info", true);
  $("#edit").empty();
  currentBoard = createBoard(exercise.board.type, exercise.board.setup);
  currentBoard.activate();
  setStatus("Loaded board", "success", false);
}

var currentBoard = createBoard(getFromStorage("board-type"), getFromStorage("board-setup"));

currentBoard.activate();

nameField.value = getFromStorage("name");
exerciseField.value = getFromStorage("exercise-number");

boardField.value = getFromStorage("board-type");

editor.setValue(getFromStorage("code", defaultCode), -1);
editor.focus();

editor.commands.addCommand({
  name: "run",
  bindKey: {win: "Ctrl-Enter", mac: "Ctrl-Enter"},
  exec: runCode
});

new Clipboard("#copy-page", {
  text: function() {
    var outputGif = $("#confirmation-gif").clone()[0];
    if (typeof(outputGif) === "undefined") {
      println("Please generate a graded gif first.");
      return undefined;
    }
    var preDom = document.createElement("pre");
    var dom = $(preDom.appendChild(document.createElement("code")));
    dom[0].class = "cpp";
    dom.text(editor.getValue());
    hljs.highlightBlock(dom[0]);
    var highlightStorage = $("#highlight-storage");
    highlightStorage.empty();
    highlightStorage.append(preDom);
    dom.find("*").each(function (index) {
      $(this).css("color", window.getComputedStyle(this).getPropertyValue("color"));
    });
    var divWrapper = document.createElement("div");
    divWrapper.appendChild(makeHeading("Confirmation Gif"));
    divWrapper.appendChild(outputGif);
    divWrapper.appendChild(document.createElement("br"));
    divWrapper.appendChild(makeHeading("Code"));
    divWrapper.appendChild(preDom);
    divWrapper.appendChild(document.createElement("br"));
    divWrapper.appendChild(makeHeading("Serial Output"));
    var out = document.createElement("div");
    $(out).css("font-family", "monospace");
    out.innerHTML = lastContent.output.split("\n").slice(0, 30).join("\n");
    divWrapper.appendChild(out);
    println("Copied! Go to \"Prepare an answer\" on Neo, then click the \"<>\" button and paste by pressing Control + V ");
    return divWrapper.innerHTML;
  }
});

var fileInput = document.getElementById("input-file");
var currentFile = null;
var files = null;
fileInput.addEventListener("change", function(event) {
  currentFile = null;
  files = fileInput.files;
  if (files.length > 1) {
    document.getElementById("next-page-button").style = "";
    document.getElementById("num-remaining").style = "";
  }
  nextJSON();
}, false);

function nextJSON() {
  if (currentFile == null) {
    currentFile = -1;
  }
  if ((currentFile + 1) >= files.length) {
    return;
  }
  currentFile++;
  document.getElementById("num-remaining").innerHTML = "(" + ((files.length - 1) - currentFile) + ((((files.length - 1) - currentFile) === 1) ? " page remaining)" : " pages remaining)");
  if ((currentFile + 1) >= files.length) {
    document.getElementById("next-page-button").style = "visibility: hidden;";
    document.getElementById("num-remaining").style = "visibility: hidden;";
  }
  loadFile(files[currentFile]);
}

function loadFile(file) {
  setStatus("Loading file . . .", "info", "true");
  var reader = new FileReader();
  reader.onload = function(event) {
    try {
      var obj = JSON.parse(event.target.result);
      editor.setValue(obj.code);
      var gifOutput = document.getElementById("gif-output");
      gifOutput.innerHTML = "";
      if (obj.img !== null) {
        var img = document.createElement("img");
        img.src = obj.img;
        img.id = "output-image";
        gifOutput.appendChild(img);
        showGif();
      }
      //TODO: set board
      document.getElementById("console-output").innerHTML = obj.consoleOutput;
      document.getElementById("name").value = obj.name;
      document.getElementById("exercise-number").value = obj.exercise;
    }
    catch (e) {
      document.getElementById("console-output").innerHTML = "Error: File is corrupt.";
    }
  };
  reader.onerror = function(event) {
    document.getElementById("console-output").innerHTML = "Couldn't read " + file.name + " (Error: " + event.target.error.code + ")";
  };
  reader.readAsText(file);
}

var running = false;
var canvas = document.createElement("canvas");
var rendererTimeoutHandle = null;

var jscpp = null;
var lastContent = {frameManager: null, output: null};

function frameManagerFromJSON(string) {
  return frameManagerFromParsedJSON(JSON.parse(string));
}

function frameManagerFromParsedJSON(data) {
  //Modifying __proto__ is the same speed as manually copying everything
  //See: https://jsperf.com/parse-json-into-an-object-and-assign-a-prototype
  //(also, I couldn't get manual copying to work without hard-coding the fields like Paul was doing)

  data.__proto__ = FrameManager.prototype;
  for(var f of data.frames) {
    f.__proto__ = Frame.prototype;
  }
  return data;
}


function setStatus(blurb, type, isAnimated) {
  resetStatus();

  var gifLoadingStatus = document.getElementById("gif-loading-status");
  gifLoadingStatus.innerHTML = blurb;
  if(type !== "") {
    var gifLoadingBar = document.getElementById("gif-loading-bar");
    gifLoadingBar.classList.add("bg-" + type);
    gifLoadingBar.style.display = "flex";
    if(isAnimated) {
      gifLoadingBar.classList.add("progress-bar-animated");
    }
  }
}

function showGif() {
  var gifOutput = document.getElementById("gif-output");
  gifOutput.style.display = "inline";

  var gifLoading = document.getElementById("gif-loading");
  gifLoading.style.display = "none";

  $("#copy-page").css("visibility", "visible");
}

function resetStatus() {
  stopRendering();

  var gifOutput = document.getElementById("gif-output");
  gifOutput.style.display = "none";

  var gifLoading = document.getElementById("gif-loading");
  gifLoading.style.display = "inline";

  var gifLoadingStatus = document.getElementById("gif-loading-status");
  gifLoadingStatus.innerHTML = "Nothing to show . . .";

  var gifLoadingBar = document.getElementById("gif-loading-bar");
  gifLoadingBar.classList.remove("progress-bar-animated");
  gifLoadingBar.style.display = "none";
  for(var status of STATUS_TYPES) {
    gifLoadingBar.classList.remove("bg-" + status);
  }

  $("#copy-page").css("visibility", "hidden");

}

function getBreakpoints() {
  return Array.from(editor.session.getBreakpoints().keys()).filter((x) => editor.session.getBreakpoints().hasOwnProperty(x));
}

function toggleBreakpoint(line) {
  if (getBreakpoints().includes(line)) {
    editor.session.clearBreakpoint(line);
  }
  else {
    editor.session.setBreakpoint(line);
  }
  sendUpdatedBreakpoints();
}

function aceToJSCPP(line) {
  var offset = prefix.split("\n").length - 1 + 1;
  return offset + line;
}

function JSCPPToAce(line) {
  var offset = -(prefix.split("\n").length - 1 + 1);
  return offset + line;
}

function sendUpdatedBreakpoints() {
  try {
    var fixedBreakpoints = getBreakpoints().map((x) => aceToJSCPP(x));
    jscpp.postMessage({type: "breakpoints", breakpoints: fixedBreakpoints});
  } catch (e) {

  }
}

function removeMarker() {
  if (markedLine !== null) {
    editor.getSession().removeMarker(markedLine);
  }
}

function fixOutputContent() {
  var gifOutput = document.getElementById("gif-output");
  gifOutput.style.display = "none";

  var gifLoading = document.getElementById("gif-loading");
  gifLoading.style.display = "inline";
}

function debugCleanup() {
  removeMarker();
  fixOutputContent();
}

function debugContinue() {
  debugCleanup();
  try {
    jscpp.postMessage({type: "debugger", action: "continue"});
  } catch (e) {

  }
}

function debugStepInto() {
  debugCleanup();
  try {
    jscpp.postMessage({type: "debugger", action: "stepInto"});
  } catch (e) {

  }
}

var bannedVars = ["Serial", "LOW", "HIGH", "INPUT", "OUTPUT",
                  "pinMode", "digitalWrite", "analogWrite",
                  "analogRead", "delay", "main"];

function debugRenderVariables(vars) {
  var tbody = $("#variables-table-body");
  tbody.html("");
  vars.forEach(function(v) {
    if (bannedVars.includes(v.name)) {
      return;
    }
    var tr = $("<tr>");
    var type = $("<td>");
    var name = $("<td>");
    var value = $("<td>");

    type.text(v.type);
    name.text(v.name);
    value.text(v.value);

    tr.append(type);
    tr.append(name);
    tr.append(value);

    tbody.append(tr);
  });
}

function debugShowCurrentState(fm) {
  var date = new Date();
  var dateString = date.toDateString();
  var timeString = date.toLocaleTimeString();

  var name = document.getElementById("name").value;
  var exerciseNumber = document.getElementById("exercise-number").value;
  currentBoard.setContext({
    isCorrect: undefined,
    dateString: dateString,
    timeString: timeString,
    exerciseNumber: exerciseNumber,
    name: name
  });

  var canvas = document.createElement("canvas");
  canvas.height = currentBoard.canvasHeight;
  canvas.width = currentBoard.canvasWidth;

  fm.frames.forEach(currentBoard.advance.bind(currentBoard));

  currentBoard.draw(canvas.getContext("2d"));

  var gifOutput = document.getElementById("gif-output");
  gifOutput.innerHTML = "";
  gifOutput.append(canvas);

  gifOutput.style.display = "inline";

  var gifLoading = document.getElementById("gif-loading");
  gifLoading.style.display = "none";
}

var markedLine = null;

function runCode() {
  saveContext();

  if (running) {
    return;
  }
  running = true;

  document.getElementById("console-output").innerHTML = "";

  jscpp = new Worker("js/JSCPP-WebWorker.js");

  setStatus("Running your code . . .", "info", true);

  jscpp.onmessage = function(e) {
    var message = JSON.parse(e.data);
    if (message.type === "frameManager") {
      jscpp.terminate();
      var newFrameManager = frameManagerFromJSON(message.frameManager);
      lastContent.frameManager = newFrameManager;
      lastContent.output = $("#console-output")[0].innerHTML;

      if (currentExercise.number !== null) {
        setStatus("Grading . . .", "success", true);
        gradeFrameManager(newFrameManager);
      } else {
        setStatus("Generating gif . . .", "success", true);
        generateGif(newFrameManager);
      }
    } else if (message.type === "output") {
      print(message.text);
    } else if (message.type === "newFrame") {
      //output("(Switching to frame " + message.newFrameNumber + " with a delay of " + message.delay + ")");
      //newline();
    } else if (message.type === "debuginfo") {
      var line = JSCPPToAce(message.node.sLine);
      if (line < 0 || line >= editor.getSession().getLength()) {
        debugStepInto();
        return;
      }
      $("#control-tabs a[href=\"#debug\"]").tab("show");
      markedLine = editor.getSession().addMarker(
        new Range(line, 0, line, 1),
        "current-line",
        "fullLine",
        false);
      debugRenderVariables(message.variables);
      var fm = frameManagerFromParsedJSON(message.frameManager);
      debugShowCurrentState(fm);
    }
  };

  var prefix = `
#include \"Arduino.h\"
typedef unsigned char byte;
`;
  var suffix = currentExercise.suffix;
  var code = prefix + editor.getValue() + suffix;
  var debugging = document.getElementById("debugging-enabled").checked;

  jscpp.onerror = function(e) {
    console.log(e);
    var errorObj = e.message;
    var matches = /([0-9]+):([0-9]+)/.exec(errorObj); //Match the line:column in the error message
    if (matches != null && matches.length >= 2) {
      var line = Number(matches[1]) - (prefix.split("\n").length - 1) - 1;
      var column = Number(matches[2]) - 1;
      var aceDoc = editor.getSession().getDocument();
      var code = aceDoc.getValue();
      var startOfErrorObj = {row: line, column: column};
      var selectionRange = new ace.require("ace/range").Range.fromPoints(startOfErrorObj.row, startOfErrorObj.column, line, 0);
      selectionRange.start = startOfErrorObj;
      selectionRange.end = {row: line, column: 0};
      editor.getSession().getSelection().setSelectionRange(selectionRange);
      editor.getSession().setAnnotations([{
        row: startOfErrorObj.row,
        column: startOfErrorObj.colum,
        text: "Error!",
        type: "error"
      }]);
      editor.navigateTo(startOfErrorObj.row, startOfErrorObj.column);
      println("Error: " + errorObj.slice(errorObj.indexOf(matches[0]) + matches[0].length + 1));
      } else {
      println("Warning: Unusual error!\n\n" + errorObj);
    }
    running = false;
    setStatus("An error occurred!", "danger", false);
    return true;
  };

  currentBoard.updateInputs();

  sendUpdatedBreakpoints();
  jscpp.postMessage({type: "code", code: code, analogPins: currentBoard.analogPins, debugging: debugging});
}

var currentExercise = {number: null, suffix: defaultSuffix};
function loadExercise() {
  setStatus("Getting grading file . . .", "info", true);
  var exerciseNum = parseInt($("#exercise-number")[0].value);
  if (isNaN(exerciseNum)) {
    setStatus("Invalid exercise.  Gifs will not be graded.", "");
    currentExercise = {number: null, suffix: defaultSuffix};
    document.getElementById("run-button").innerHTML = "Run";
    return;
  }

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", "exercises/" + exerciseNum + "/Exercise_" + exerciseNum + ".FrameManager");

  var handleError = function() {
    currentExercise = {number: null, suffix: defaultSuffix};
    setStatus("Error fetching grading file . . .", "danger", false);
  };

  xmlhttp.onerror = handleError;
  xmlhttp.onabort = handleError;
  xmlhttp.ontimeout = handleError;
  xmlhttp.onload = function() {
    if (this.status === 200) {
        var data = JSON.parse(this.responseText);
        if(!data.board) {
          //This is a FrameManager--not an exercise.
          currentExercise.frameManager = frameManagerFromJSON(this.responseText);
          currentExercise.number = exerciseNum;
          currentExercise.suffix = defaultSuffix;

        } else {
          currentExercise.number = exerciseNum;
          currentExercise.board = data.board;
          currentExercise.startingCode = data.startingCode;
          currentExercise.suffix = data.suffix;
          currentExercise.frameManager = frameManagerFromParsedJSON(data.frameManager);

          document.getElementById("export-exercise-number").value = currentExercise.number;
          document.getElementById("export-exercise-starting").value = currentExercise.startingCode;
          document.getElementById("export-exercise-suffix").value = currentExercise.suffix;

          loadBoardFromExercise(currentExercise);

          if(confirm("Load Starting Code?  This will overwrite your existing code!!!")) {
            editor.setValue(currentExercise.startingCode);
          }
        }
        //set code to exercise start code?
        setStatus("Exercise " + exerciseNum + " loaded! Press Run and Grade to test your code.", "success", false);
        document.getElementById("run-button").innerHTML = "Run and Grade";
    } else {
        handleError();
    }
  };

  xmlhttp.send();
}

loadExercise();

function gradeFrameManager(studentFM) {
  if(currentExercise.number === null) {
    setStatus("Please load an exercise first", "danger", false);
    running = false;
    return;
  }
  println("Now grading according to exercise " + currentExercise.number);

  var isCorrect = compareFrameManagers(studentFM, currentExercise.frameManager);

  generateGif(studentFM, isCorrect);

  running = false;
}

function compareFrameManagers(fm1, fm2) {
  if (fm1.frames.length !== fm2.frames.length) {
    println("Gifs are different lengths");
    return false;
  }
  var onewayFrameCompare = function (f1, f2) {
    if (!Object.keys(f1.ledStates).every(function (element) {
      if (!(f1.getPinState(element) === f2.getPinState(element))) {
        println("Found difference in pin states on pin " + element);
        return false;
      }
      if (!((f1.getPinState(element) === HIGH) ? (f1.getPinMode(element) === f2.getPinMode(element)) : true)) {
        println("Found difference in pin modes on pin " + element);
        return false;
      }
      return true;
      })) {
      return false;
    }
    if (!(f1.postDelay === f2.postDelay)) {
      println("Found difference in delays");
      return false;
    }
    if (f1.outputText.length !== f2.outputText.length) {
      println("Found difference in number of Serial prints");
      return false;
    }
    for (var i = 0; i < f1.outputText.length; i++) {
      if (f1.outputText[i].trim() !== f2.outputText[i].trim()) {
        println("Found difference in output text (\"" + f1.outputText[i].trim() + "\" vs \"" + f2.outputText[i].trim() + "\")");
        return false;
      }
    }
    return true;
  };

  if (!fm1.frames.every(function (element, key) {
    if (onewayFrameCompare(element, fm2.frames[key]) && onewayFrameCompare(fm2.frames[key], element)) {
      return true;
      } else {
      println(" in frame " + key);
      return false;
    }
    })) {
    return false;
  }
  if (!fm2.frames.every(function (element, key) {
    if (onewayFrameCompare(element, fm1.frames[key]) && onewayFrameCompare(fm1.frames[key], element)) {
      return true;
      } else {
      println(" in frame " + key);
      return false;
    }
    })) {
    return false;
  }
  return true;
}

function stopRendering(){
  if (rendererTimeoutHandle !== null) {
    cancelAnimationFrame(rendererTimeoutHandle);
    rendererTimeoutHandle = null;
  }
}

function generateGif(frameManager, isCorrect) {

  var gifOutput = document.getElementById("gif-output");
  canvas.height = currentBoard.canvasHeight;
  canvas.width = currentBoard.canvasWidth;
  var ctx = canvas.getContext("2d");

  var date = new Date();
  var dateString = date.toDateString();
  var timeString = date.toLocaleTimeString();

  var name = document.getElementById("name").value;
  var exerciseNumber = document.getElementById("exercise-number").value;

  var drawFrame = function(frame, index, array, stdDelay, timeSinceLast, callTime, _) {
    var speed = document.getElementById("canvas-speed").value;
    var cumulativeTime = timeSinceLast + (performance.now() - callTime);
    var desiredWait = stdDelay / speed;
    var partial;

    if (speed === 0 || cumulativeTime < desiredWait) {
      partial = drawFrame.bind(null, array[index], index, array, stdDelay, cumulativeTime, performance.now());
    } else {
      if (index === 0) {
          currentBoard.setContext({
            isCorrect: isCorrect,
            dateString: dateString,
            timeString: timeString,
            exerciseNumber: exerciseNumber,
            name: name
          });
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      currentBoard.advance(frame, index, frameManager);
      currentBoard.draw(ctx);

      var nextIndex = (index + 1) % array.length;
      partial = drawFrame.bind(null, array[nextIndex], nextIndex, array, frame.postDelay, 0, performance.now());
    }

    rendererTimeoutHandle = requestAnimationFrame(partial);
  };

  stopRendering();
  drawFrame(frameManager.frames[0], 0, frameManager.frames);

  gifOutput.innerHTML = "";
  gifOutput.append(canvas);
  showGif();

  if ((isCorrect === true) || (isCorrect === false)) {
    generateConfirmationGif(isCorrect);
  }


  running = false;
}

function generateConfirmationGif(isCorrect) {
  var name = document.getElementById("name").value;
  var exercise = document.getElementById("exercise-number").value;

  var canvas = document.createElement("canvas");
  canvas.height = 110;
  canvas.width = 300;

  var gif = new GIF({workers: 4, quality: 10, workerScript: "js/gif/gif.worker.js", transparent: 0xFFFFFF, width: canvas.width, height: canvas.height});
  var ctx = canvas.getContext("2d");

  ctx.globalAlpha = 1;
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalAlpha = 1;
  ctx.fillStyle = "black";
  ctx.font = "15px monospace";
  ctx.fillText("Student: " + name, 5, 25);
  ctx.fillText("Exercise: " + exercise, 5, 45);
  ctx.fillText("Confirmation Hash: " + (name + exercise).hashCode(), 5, 65);

  gif.addFrame(ctx, {copy: true, delay: 500});

  ctx.font = "bold 15px monospace";
  ctx.fillStyle = ((typeof(isCorrect) === "undefined") || (isCorrect === false)) ? "red" : "green";
  var gradeText = (isCorrect === true) ? "Correct" : "Incorrect";
  ctx.fillText(gradeText, 5, 85);

  gif.addFrame(ctx, {copy: true, delay: 500});

  gif.on("finished", function(gif, e) {
    var container = $("#confirmation-gif-container")[0];
    container.innerHTML = "";
    var img = document.createElement("img");
    var binString = "";
    e.forEach(function (element) {
      binString += String.fromCharCode(element);
    });
    img.src = "data:image/gif;base64," + btoa(binString); //+ btoa(String.fromCharCode.apply(null, e));
    img.id = "confirmation-gif";
    container.appendChild(img);
  });

  gif.render();
}

function saveContext() {
  setToStorage("name", document.getElementById("name").value);
  setToStorage("board-type", document.getElementById("board").value);
  currentBoard.updateInputs();
  setToStorage("board-setup", JSON.stringify(currentBoard.getSetup()));
  setToStorage("code", editor.getValue());
  setToStorage("exercise-number", currentExercise.number === null ? "" : currentExercise.number);
}

function saveJSON() {
  var obj = {};
  obj.code = editor.getValue();
  obj.consoleOutput = document.getElementById("console-output").innerHTML;
  obj.name = nameField.value;
  obj.exercise = exerciseField.value;
  var image = document.getElementById("output-image");
  obj.img = (image !== null) ? image.src : null;
  obj.boardSetup = currentBoard.getSetup();
  obj.boardType = currentBoard.type;
  var jsonString = JSON.stringify(obj);
  saveAs(new Blob([jsonString], {type: "application/json;charset=utf-8"}), name.replace(/ /g,'') + "_Exercise" + exerciseNumber + ".giffer");
}

function saveFrameManager() {
  if (lastContent !== null && $("#exercise-number")[0].valueAsNumber !== NaN) {
    saveAs(new Blob([JSON.stringify(lastContent.frameManager)], {type: "application/json;charset=utf-8"}), "Exercise_" + $("#exercise-number")[0].value + ".FrameManager");
  }
}

function saveExercise() {

  $("#exercise-modal").modal('show');
}

function exportExercise() {
  var exercise = {};
  exercise.number = document.getElementById("export-exercise-number").value;
  exercise.startingCode = document.getElementById("export-exercise-starting").value;
  exercise.suffix = document.getElementById("export-exercise-suffix").value;
  exercise.board = {type: currentBoard.type, setup: currentBoard.getSetup()};
  exercise.frameManager = lastContent.frameManager;

  saveAs(new Blob([JSON.stringify(exercise)], {type: "application/json;charset=utf-8"}), "Exercise_" + exercise.number + ".FrameManager");

}

function updateSuffix() {
  currentExercise.suffix = document.getElementById("export-exercise-suffix").value;
}

//Simple hash function, thanks to http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
String.prototype.hashCode = function() {
	var hash = 0;
	if (this.length == 0) return hash;
	for (var i = 0; i < this.length; i++) {
		var char = this.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
};

Array.prototype.remove = function(element) {
  var index = this.indexOf(element);
  if (index > -1) {
    this.splice(index, 1);
  }
};

function blobToDataURL(blob, callback) {
  var a = new FileReader();
  a.onload = function(e) {callback(e.target.result);};
  a.readAsDataURL(blob);
}

function print(text, color) {
  if (text !== undefined) {
    while (text.includes("\n")) {
      var add = text.substring(0, text.indexOf("\n"));
      var s = document.createElement("span");
      s.append(document.createTextNode(add));
      if(color) {
        s.style.color = color;
      }
      $("#console-output").append(s);
      $("#console-output").append(document.createElement("br"));

      text = text.substring(text.indexOf("\n") + 1);
    }
    var s = document.createElement("span");
    s.append(document.createTextNode(text));
    if (color) {
      s.style.color = color;
    }
    $("#console-output").append(s);
  }
}

function println(text, color) {
  print(text);
  $("#console-output").append(document.createElement("br"));
}

function makeHeading(heading) {
  var obj = document.createElement("h1");
  $(obj).text(heading);
  return obj;
}
