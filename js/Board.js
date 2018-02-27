function Board(setup) {
  //All boards must be able to recreate themselves based on this.getSetup()
}

Board.prototype.canvasWidth = null;
Board.prototype.canvasHeight = null;
Board.prototype.context = null;
Board.prototype.analogPins = [];

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
  this.analogPins = (setup === undefined || setup.analogPins === undefined) ? [] : setup.analogPins;
  this.DOMPins = [];
}


LEDBoard.prototype = Object.create(Board.prototype);

LEDBoard.prototype.imageURL = "/img/shield.gif";
LEDBoard.prototype.type = "LED Board";

LEDBoard.prototype.getSetup = function(){
  this.updateInputs();
  return {analogPins: this.analogPins};
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

LEDBoard.prototype.removePin = function (pin) {
  console.log(pin);
  this.DOMPins.remove($(pin).parent().parent()[0]);
  $(pin).parent().parent().remove();
  saveContext();
}
LEDBoard.prototype.addPin = function addPin(number, value) {
    var newContent = $(`<tr class="input-pin">
    <td><input type="number" class="form-control pin-number" value="2" min="0" max="255"/></td>
    <td><input type="number" class="form-control pin-value" value="0" min="0" max="1023"/></td>
    <td><button class="btn btn-danger" style="width: 100%;" onclick="currentBoard.removePin(this)">Remove</button></td>
    </tr>`);
    $("#analog-table-tbody").append(newContent);
    numberField = newContent.find(".pin-number")[0];
    valueField = newContent.find(".pin-value")[0];
    if (number) {
      numberField.valueAsNumber = Number(number);
    }
    if (value) {
      valueField.valueAsNumber = Number(value);
    }
    this.DOMPins.push(newContent[0]);
  }


LEDBoard.prototype.activate = function(){
  var setup = $(`
          <table class="table table-bordered" id="analog-table">
            <thead>
              <tr>
                <th>Pin Num</th>
                <th>Value</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody id="analog-table-tbody"></tbody>
          </table>
          <button class="btn btn-success" id="add-pin" onclick="currentBoard.addPin(); saveContext()">Add pin</button>`);
          
  $("#edit").append(setup);
          
  
  for (var i = 0; i < this.analogPins.length; i++) {
    var pin = this.analogPins[i];
    this.addPin(pin.pin_number, pin.pin_value);
  }
}

LEDBoard.prototype.updateInputs = function(){
  var out = [];
  for (var i = 0; i < this.DOMPins.length; i++) {
  var pin = $(this.DOMPins[i]);
    var pin_number = pin.find(".pin-number")[0].valueAsNumber;
    var pin_value = pin.find(".pin-value")[0].valueAsNumber;
    out.push({pin_number: pin_number, pin_value: pin_value});
  }
  this.analogPins = out;
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