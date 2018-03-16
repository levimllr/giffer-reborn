var bannedVars = ["Serial", "LOW", "HIGH", "INPUT", "OUTPUT",
                  "pinMode", "digitalWrite", "analogWrite",
                  "analogRead", "delay", "main"];
var Range = ace.require('ace/range').Range;


function Debugger(editor) {
  
  //Breakpoints
  this.breakpoints = []; 
  this.toggleBreakpoint = function(line) {
    if (this.breakpoints.includes(line)) {
      editor.session.clearBreakpoint(line);
      this.breakpoints.remove(line);
    } else {
      editor.session.setBreakpoint(line);
      this.breakpoints.push(line);
    }
    this.sendUpdatedBreakpoints();
  }
  this.sendUpdatedBreakpoints = function() {
    try {
      var breakpointsCopy = this.breakpoints.slice();
      var fixedBreakpoints = breakpointsCopy.map((x) => aceToJSCPP(x));
      jscpp.postMessage({type: "breakpoints", breakpoints: fixedBreakpoints});
    } catch (e) {
    
    }
  }
  
  this.stopDebuggingSession = function() {
    jscpp.postMessage({type: "debugger", action: "enabled", state: false});
    this.doContinue();
  }
  
  //Enabled
  this.isEnabled = function() {
    return document.getElementById("debugging-enabled").checked;
  }
  this.sendUpdateEnabled = function () {
    try {
      jscpp.postMessage({type: "debugger", action: "enabled", state: this.isEnabled()});
    } catch (e) {
      console.log(e);
    }
  }
  this.handleMessage = function(message) {
    var line = JSCPPToAce(message.node.sLine);
    if (line < 0 || line >= editor.getSession().getLength()) {
      this.doStep();
      return;
    }
    markedLine = editor.getSession().addMarker(
      new Range(line, 0, line, 1),
      "current-line",
      "fullLine",
      false);
    this.showVariables(message.variables);
    var fm = makeFrameManager(message.frameManager);
    this.renderState(fm);
  }
  
  //Marker
  this.markedLine = null;
  this.removeMarker = function() {
    if (markedLine !== null) {
      editor.getSession().removeMarker(markedLine);
    }
  }
  
  //Stepping
  this.doContinue = function() {
    try {
      jscpp.postMessage({type: "debugger", action: "continue"});
      this.cleanup();
    } catch (e) {
  
    }
  }
  this.doStep = function() {
    try {
      jscpp.postMessage({type: "debugger", action: "stepInto"});
      this.cleanup();
    } catch (e) {
  
    }
  }
  this.cleanup = function() {
    this.removeMarker();
    hideGif();
  }
  
  //Render
  this.showVariables = function(vars) {
    $("#control-tabs a[href=\"#debug\"]").tab("show");
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
  this.renderState = function(frameManager) {
    
    var date = new Date();
    var dateString = date.toDateString();
    var timeString = date.toLocaleTimeString();
    
    var name = nameField.value;
    var exerciseNumber = exerciseField.value;
    currentBoard.setContext({
      isCorrect: undefined,
      dateString: dateString,
      timeString: timeString,
      exerciseNumber: exerciseNumber,
      name: name
    });
    
    canvas.height = currentBoard.canvasHeight;
    canvas.width = currentBoard.canvasWidth;
    
    frameManager.frames.forEach(currentBoard.advance.bind(currentBoard));
    
    currentBoard.draw(canvas.getContext("2d"));
    
    setStatus("Current State:", "");
    
    showCanvas();
  }
  
  //Editor
  editor.on("gutterclick", function(e) {
    debug.toggleBreakpoint(e.getDocumentPosition().row);
    e.stop();
  });
  editor.on("guttermousedown", function(e) {
    e.stop();
  });
}

//return Array.from(editor.session.getBreakpoints().keys()).filter((x) => editor.session.getBreakpoints().hasOwnProperty(x));
