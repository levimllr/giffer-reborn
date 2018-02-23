"use strict";
var editor = ace.edit("editor");
editor.getSession().setMode("ace/mode/c_cpp");

var defaultCode = `
void setup() {
  pinMode(3, OUTPUT);
}

void loop() {
  digitalWrite(3, HIGH);
  delay(100);
  digitalWrite(3, LOW);
  delay(100);
}`;

var defaultBoard = new LEDBoard();

var nameField = document.getElementById("name");
var exerciseField = document.getElementById("exercise-number");
var boardField = document.getElementById("board");

var exerciseNumber = (typeof(localStorage.exerciseNumber) === "undefined") ? "" : localStorage.exerciseNumber;

var savedCode = (typeof(localStorage.savedCode) === "undefined" || localStorage.savedCode === "" || localStorage.savedBoards === "[]") ? {} : JSON.parse(localStorage.savedCode);
var savedBoards = (typeof(localStorage.savedBoards) === "undefined" || localStorage.savedBoards === "" || localStorage.savedBoards === "[]") ? {} : JSON.parse(localStorage.savedBoards);


function getCode(exercise){ //no need to test for undefined
  if(savedCode.hasOwnProperty(exercise)){
    return savedCode[exercise];
  } else {
    return defaultCode; //TODO: exercise has default code
  }
}
function getBoard(exercise){ //no need to test for undefined
  if(savedBoards.hasOwnProperty(exercise)){
    //TODO: var b = savedBoards[exercise];
    //b.__proto__ = Board.prototype;
    //return b;
    return defaultBoard;
  } else {
    return defaultBoard; //TODO: exercise has default board
  }
}


var code = getCode();
var currentBoard = getBoard(localStorage.exerciseNumber);

currentBoard.activate();

nameField.value = (typeof(localStorage.name) === "undefined") ? "" : localStorage.name;
exerciseField.value = (typeof(localStorage.exerciseNumber) === "undefined") ? "" : localStorage.exerciseNumber;
boardField.value = "LED Board";

editor.setValue(code);
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
      $("#console-output").text("Please generate a graded gif first.");
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
    out.innerHTML = lastContent.out.split("\n").slice(0, 30).join("\n");
    divWrapper.appendChild(out);
    output("Copied! Go to \"Prepare an answer\" on Neo, then click the \"<>\" button and paste by pressing Control + V ");
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

function loadFile(file) { //TODO: once saveFile is refactored
  document.getElementById("console-output").innerHTML = "Loading file . . .";
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
      }
      $("#analog-table-tbody").empty();
      if (typeof(obj.analogPins) !== "undefined") {
        var analogPins = obj.analogPins;
        for (var i = 0; i < analogPins.length; i++) {
          var pin = analogPins[i];
          addPin(pin.pin_number, pin.pin_value);
        }
      }
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
var lastContent = {frameManager: null, output: null};

function frameManagerFromJSON(string) {
  var data = JSON.parse(string);
  var f = Object.assign(new FrameManager(), data);
  for(var i in f.frames){
    f.frames[i] = Object.assign(new Frame(), data[i]);
  }
  return f;
}

function runCode() {
  saveCode();
  
  if (running) {
    return;
  }
  running = true;
  
  //TODO: ui element for this?
  var doGrade = exerciseField.value != "";
  
  var gifOutput = document.getElementById("gif-output");
  gifOutput.style.display = "none";
  
  var gifLoading = document.getElementById("gif-loading");
  gifLoading.style.display = "inline";
  
  var gifLoadingStatus = document.getElementById("gif-loading-status");
  
  var gifLoadingBar = document.getElementById("gif-loading-bar");
  gifLoadingBar.style.display = "block";
  
  gifLoadingBar.classList.add("progress-bar-animated");
  gifLoadingBar.classList.add("bg-info");
  gifLoadingBar.classList.remove("bg-danger");
  
  document.getElementById("console-output").innerHTML = "";
  
  var jscpp = new Worker("js/JSCPP-WebWorker.js");
  
  gifLoadingStatus.innerHTML = "Running your code . . .";
  
  jscpp.onmessage = function(e) {
    var message = JSON.parse(e.data);
    console.log(message);
    if (message.type === "frameManager") {
      var newFrameManager = frameManagerFromJSON(message.frameManager);
      lastContent.frameManager = newFrameManager;
      lastContent.output = $("#console-output")[0].innerHTML;
      
      newline(); newline();
      if (doGrade) {
        gradeFrameManager(newFrameManager);
      } else {
        
        gifLoadingStatus.innerHTML = "Generating gif . . .";
        
        gifLoadingBar.classList.remove("bg-info");
        gifLoadingBar.classList.add("bg-success");
        
        generateGif(newFrameManager);
      }
      
      gifLoading.style.display = "none";
      gifOutput.style.display = "inline";
      
    } else if (message.type === "output") {
      var parts = message.text.split("\n");
      for (var part of parts) {
        output(part);
        newline();
      }
    } else if (message.type === "newFrame") {
      //output("(Switching to frame " + message.newFrameNumber + " with a delay of " + message.delay + ")");
      //newline();
    }
  };
  
  var prefix = "#include \"Arduino.h\"\n"
           + "typedef unsigned char byte;\n"
           + "//Begin Student Code: \n";
  var code = prefix + editor.getValue() + "\n" 
           + "int main() { setup(); loop(); return 0;}\n";
           
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
      output("Error: " + errorObj.slice(errorObj.indexOf(matches[0]) + matches[0].length + 1));
      } else {
      output("Warning: Unusual error!\n\n" + errorObj);
    }
    running = false;
    gifLoadingStatus.innerHTML = "An error occurred!";
    gifLoadingBar.classList.remove("progress-bar-animated");
    gifLoadingBar.classList.remove("bg-info");
    gifLoadingBar.classList.add("bg-danger");
    return true;
  };
  
  currentBoard.updateInputs();
  
  
  
  jscpp.postMessage({code: code, analogPins: currentBoard.analogPins});
}

function gradeFrameManager(studentFM) {
  var xmlhttp = new XMLHttpRequest();
  var exerciseNum = $("#exercise-number")[0].valueAsNumber;
  $("#gif-output").text("Getting grading file . . .");
  if (isNaN(exerciseNum)) {
    output("Please input a valid exercise number to grade.");
    running = false;
    return;
  }
  xmlhttp.open("GET", "exercises/" + exerciseNum + "/Exercise_" + exerciseNum + ".FrameManager");
  var handleResponse = function () {
    try {
      if (this.status === 200) {
        $("#gif-output").text("Grading . . .");
        var correctFM = frameManagerFromJSON(this.responseText);
        generateGif(studentFM, compareFrameManagers(studentFM, correctFM));
        } else if (this.status === 404) {
        output("The grading file for exercise " + exerciseNum + " does not exist.");
        running = false;
        return;
        } else {
        output("An error occurred getting the grading file.");
        running = false;
        return;
      }
      } catch (e) {
      console.log(e);
      output("An error occurred parsing the grading file.");
      running = false;
    }
  };
  xmlhttp.addEventListener("load", handleResponse);
  var handleError = function () {
    output("An error occurred getting the grading file.");
    running = false;
  };
  xmlhttp.addEventListener("error", handleError);
  xmlhttp.addEventListener("abort", handleError);
  xmlhttp.send();
}

function compareFrameManagers(fm1, fm2) {
  if (fm1.frames.length !== fm2.frames.length) {
    output("Gifs are different lengths");
    return false;
  }
  var onewayFrameCompare = function (f1, f2) {
    if (!Object.keys(f1.ledStates).every(function (element) {
      if (!(f1.getPinState(element) === f2.getPinState(element))) {
        output("Found difference in pin states on pin " + element);
        return false;
      }
      if (!((f1.getPinState(element) === HIGH) ? (f1.getPinMode(element) === f2.getPinMode(element)) : true)) {
        output("Found difference in pin modes on pin " + element);
        return false;
      }
      return true;
      })) {
      return false;
    }
    if (!(f1.postDelay === f2.postDelay)) {
      output("Found difference in delays");
      return false;
    }
    if (f1.outputText.length !== f2.outputText.length) {
      output("Found difference in number of Serial prints");
      return false;
    }
    for (var i in f1.outputText) {
      if (f1.outputText[i].trim() !== f2.outputText[i].trim()) {
        output("Found difference in output text (\"" + f1.outputText[i].trim() + "\" vs \"" + f2.outputText[i].trim() + "\")");
        return false;
      }
    }
    return true;
  };
  
  if (!fm1.frames.every(function (element, key) {
    if (onewayFrameCompare(element, fm2.frames[key]) && onewayFrameCompare(fm2.frames[key], element)) {
      return true;
      } else {
      output(" in frame " + key);
      return false;
    }
    })) {
    return false;
  }
  if (!fm2.frames.every(function (element, key) {
    if (onewayFrameCompare(element, fm1.frames[key]) && onewayFrameCompare(fm1.frames[key], element)) {
      return true;
      } else {
      output(" in frame " + key);
      return false;
    }
    })) {
    return false;
  }
  return true;
}

function generateGif(frameManager, isCorrect) {
  
  var gifOutput = document.getElementById("gif-output");
  
  var board = null;
  try {
    board = new BOARDS[document.getElementById("board").value]();
  } catch(e) {
    gifOutput.innerHTML = "Please specify a valid board";
    return
  }
  
  var canvas = document.createElement("canvas");
  canvas.height = board.canvasHeight;
  canvas.width = board.canvasWidth;
  
  var gif = new GIF({workers: 4, quality: 10, workerScript: "js/gif/gif.worker.js", transparent: 0xFFFFFF, width: canvas.width, height: canvas.height});
  var ctx = canvas.getContext("2d");
  
  var onFinished = function(gif, e) {
    gifOutput.innerHTML = "";
    var img = document.createElement("img");
    var binString = "";
    e.forEach(function (element) {
      binString += String.fromCharCode(element);
    });
    img.src = "data:image/gif;base64," + btoa(binString);
    img.id = "output-image";
    gifOutput.appendChild(img);
  };
  gif.on("finished", onFinished);
  
  var date = new Date();
  var dateString = date.toDateString();
  var timeString = date.toLocaleTimeString();
  
  var name = document.getElementById("name").value;
  localStorage.name = name;
  var exerciseNumber = document.getElementById("exercise-number").value;
  localStorage.exerciseNumber = exerciseNumber;
  
  board.prepare();
  board.setContext({
    isCorrect: isCorrect,
    dateString: dateString,
    timeString: timeString,
    exerciseNumber: exerciseNumber,
    name: name
  });
  
  var drawFrame = function(frame, index, array) {
    ctx.globalAlpha = 1;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    board.draw(ctx, frame, index, frameManager);
    
    var realDelay = (frame.postDelay === 0) ? 15 : frame.postDelay;
    gif.addFrame(ctx, {copy: true, delay: realDelay});
  };
  
  frameManager.frames.forEach(drawFrame);
  gif.render();
  
  if ((isCorrect === true) || (isCorrect === false)) {
    generateConfirmationGif(isCorrect);
  }
  
  $("#copy-page").css("visibility", "visible");
  //$("#download-page").css("visibility", "visible");
  
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

function saveCode() {
  //localStorage.code = editor.getValue();
  //localStorage.analogPins = JSON.stringify(board);
  savedCode[exerciseNumber] = editor.getValue();
  savedBoards[exerciseNumber] = currentBoard;
  localStorage.savedCode = JSON.stringify(savedCode);
  localStorage.savedBoards = JSON.stringify(savedBoards);
}

function saveJSON(name, exercise, img) {
  var obj = {};
  obj.code = editor.getValue();
  obj.consoleOutput = document.getElementById("console-output").innerHTML;
  obj.name = nameField.value;
  obj.exercise = exerciseField.value;
  var image = document.getElementById("output-image");
  obj.img = (image !== null) ? image.src : null;
  obj.board = currentBoard;
  var jsonString = JSON.stringify(obj);
  saveAs(new Blob([jsonString], {type: "application/json;charset=utf-8"}), name.replace(/ /g,'') + "_Exercise" + exerciseNumber + ".giffer");
}

function saveFrameManager() {
  if (lastContent !== null && $("#exercise-number")[0].valueAsNumber !== NaN) {
    saveAs(new Blob([JSON.stringify(lastContent.frameManager)], {type: "application/json;charset=utf-8"}), "Exercise_" + $("#exercise-number")[0].value + ".FrameManager");
  }
}

//Utilities and general IO

//Simple hash function, thanks to http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
String.prototype.hashCode = function(){
	var hash = 0;
	if (this.length == 0) return hash;
	for (var i = 0; i < this.length; i++) {
		var char = this.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
};

function blobToDataURL(blob, callback) {
  var a = new FileReader();
  a.onload = function(e) {callback(e.target.result);};
  a.readAsDataURL(blob);
}

function t(text) {
  return document.createTextNode(text);
}

function output(text) {
  $("#console-output").append(t(text));
}

function newline() {
  $("#console-output").append(document.createElement("br"));
}

function makeHeading(heading) {
  var obj = document.createElement("h1");
  $(obj).text(heading);
  return obj;
}