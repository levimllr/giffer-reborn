function Board(setup) {
  //All boards must be able to recreate themselves based on this.getSetup()
}

Board.prototype.canvasWidth = null;
Board.prototype.canvasHeight = null;
Board.prototype.context = null;
Board.prototype.pinKeyframes = [];
/*Format:
[
{time: t, pin: #, value: t},
{time: t, pin: #, value: t},
{time: t, pin: #, value: t},
]
*/

Board.imageURL = null;

Board.prototype.setContext = function(context){
  this.context = context;
}

Board.prototype.prepare = function(){
  //Not used
}

Board.prototype.activate = function(){
  //Modifies HTML and edit-board tab
}

Board.prototype.updateInputs = function(){
  //Updates fields to match HTML and edit-board tab
}

Board.prototype.drawInfo = function(ctx, frame, index, frameManager){
  ctx.globalAlpha = 1;
  ctx.fillStyle = "black";
  ctx.font = "15px monospace";
  ctx.fillText("Frame: " + index, this.shieldImg.width + 10, 15);
  ctx.fillText("PostDelay: " + frame.postDelay, this.shieldImg.width + 10, 35);
  ctx.fillText("By " + this.context.name, this.shieldImg.width + 10, 55);
  ctx.fillText("Exercise " + this.context.exerciseNumber, this.shieldImg.width + 10, 75);
  
  ctx.fillText(this.context.dateString, this.shieldImg.width + 10, 115);
  ctx.fillText(this.context.timeString, this.shieldImg.width + 10, 135);
  
  ctx.font = "bold 15px monospace";
  ctx.fillStyle = ((typeof(this.context.isCorrect) === "undefined") || (this.context.isCorrect === false)) ? "red" : "green";
  var gradeText = (this.context.isCorrect === true) ? "Correct" : ((this.context.isCorrect === false) ? "Incorrect" : "Ungraded");
  ctx.fillText(gradeText, this.shieldImg.width + 10, 175);
}

Board.prototype.draw = function(ctx, frame, index, frameManager) {
  this.drawInfo();
}

function LEDBoard(setup) {
  this.ledLookup = {
    2: {x: 87, y: 165, color: "red"},
    3: {x: 87, y: 140, color: "green"},
    4: {x: 87, y: 115, color: "red"},
    5: {x: 87, y: 90, color: "green"},
    6: {x: 87, y: 65, color: "red"},
    7: {x: 87, y: 35, color: "green"},
    8: {x: 87, y: 10, color: "red"},
    
    9: {x: 5, y: 165, color: "orange"},
    10: {x: 5, y: 140, color: "orange"},
    11: {x: 5, y: 115, color: "orange"},
    12: {x: 5, y: 90, color: "blue"},
    13: {x: 5, y: 65, color: "blue"},
    14: {x: 5, y: 35, color: "yellow"},
    15: {x: 5, y: 7, color: "yellow"}
  };
  this.canvasWidth = 300;
  this.canvasHeight = 195;
  this.pinKeyframes = (setup === undefined || setup.pinKeyframes === undefined) ? [] : setup.pinKeyframes;
  this.DOMKeyframes = [];
}


LEDBoard.prototype = Object.create(Board.prototype);

LEDBoard.prototype.imageURL = "/img/shield.gif";
LEDBoard.prototype.type = "LED Board";

LEDBoard.prototype.getSetup = function(){
  this.updateInputs();
  return {pinKeyframes: this.pinKeyframes};
}


LEDBoard.prototype.draw = function(ctx, frame, index, frameManager){
  
  ctx.drawImage(this.shieldImg, 0, 0);
  
  for (var i = 2; i <= 15; i++) {
    if (frame.getPinState(i) >= 1) { //if it's on
      var alpha = (frame.getPinMode(i) === OUTPUT) ? 1 : 0.2; //Make sure it's an output, otherwise dim it
      alpha *= frame.getPinState(i) / ANALOG_MAX;
      alpha = Math.max(alpha, 0.3); //Clamp it for usability purposes
      var radius = 7;
      var ledDescriptor = this.ledLookup[i];
      ctx.globalAlpha = alpha;
      ctx.fillStyle = ledDescriptor.color;
      ctx.strokeStyle = ledDescriptor.color;
      ctx.beginPath();
      ctx.arc(ledDescriptor.x + radius, ledDescriptor.y + radius, radius, 0, 2 * Math.PI, false);
      ctx.closePath();
      ctx.fill();
    }
  }
  this.drawInfo(ctx, frame, index, frameManager);
}

LEDBoard.prototype.removeKeyframe = function (keyframe) {
  this.DOMKeyframes.remove($(keyframe).parent().parent()[0]);
  $(keyframe).parent().parent().remove();
  saveContext(); //runs updateInputs
}

LEDBoard.prototype.addKeyframe = function(time, pin, value) {
  var newContent = $(`<tr class="input-keyframe">
  <td><input type="number" class="form-control keyframe-time" value="0" min="0"/></td>
  <td><input type="number" class="form-control keyframe-pin" value="0" min="0" max="255"/></td>
  <td><input type="number" class="form-control keyframe-value" value="0" min="0" max="1023"/></td>
  <td><button class="btn btn-danger keyframe-remove" onclick="currentBoard.removeKeyframe(this)">-</button></td>
  </tr>`);
  $("#keyframe-table-tbody").append(newContent);
  
  if (time) {
    timeField = newContent.find(".keyframe-time")[0];
    timeField.valueAsNumber = Number(number);
  }
  
  if (pin) {
    pinField = newContent.find(".keyframe-pin")[0];
    pinField.valueAsNumber = Number(number);
  }
  
  if (value) {
    valueField = newContent.find(".keyframe-value")[0];
    valueField.valueAsNumber = Number(value);
  }
  
  this.DOMKeyframes.push(newContent[0]);
  saveContext(); //runs updateInputs
}


LEDBoard.prototype.activate = function(){
  var setup = $(`
          <table class="table" id="keyframe-table">
            <thead>
              <tr>
                <th>At time (ms)</th>
                <th>Change pin</th>
                <th>To value</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody id="keyframe-table-tbody"></tbody>
          </table>
          <button class="btn btn-success" id="add-keyframe" onclick="currentBoard.addKeyframe(); saveContext()">Add</button>`);
          
  $("#edit").append(setup);
          
  
  for (var i = 0; i < this.pinKeyframes.length; i++) {
    var keyframe = this.pinKeyframes[i];
    this.addKeyframe(keyframe.time, keyframe.pin, keyframe.value);
  }
}

LEDBoard.prototype.updateInputs = function(){
  var out = [];
  for (var i = 0; i < this.DOMKeyframes.length; i++) {
    var keyframe = $(this.DOMKeyframes[i]);
    var keyframeTime = keyframe.find(".keyframe-time")[0].valueAsNumber;
    var keyframePin = keyframe.find(".keyframe-pin")[0].valueAsNumber;
    var keyframeValue = keyframe.find(".keyframe-value")[0].valueAsNumber;
    out.push({time: keyframeTime, pin: keyframePin, value: keyframeValue});
  }
  this.pinKeyframes = out;
}


var BOARDS = {
  "LED Board": LEDBoard
};

for(var b in BOARDS){
  if(BOARDS.hasOwnProperty(b)){
    BOARDS[b].prototype.shieldImg = new Image;
    BOARDS[b].prototype.shieldImg.src = BOARDS[b].prototype.imageURL;
    console.log("Loaded background image for board: " + b);
  }
}

var defaultBoard = new LEDBoard();

function createBoard(type, setup){
  if(type === null || !(type in BOARDS)){
    console.log("Invalid board type -- loading defaultBoard");
    return defaultBoard;
  }
  var m;
  if(setup instanceof String){
    try {
      m = JSON.parse(setup);
    } catch (e) {
      console.log("Invalid setup -- loading with setup = {}");
      m = {};
    }
  } else {
    m = setup;
  }
  return new BOARDS[type](m);
}

