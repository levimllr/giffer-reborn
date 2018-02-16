function Board() {
    this.canvasWidth = null;
    this.canvasHeight = null;
    this.context = null;
}

Board.imageURL = null;

Board.prototype.setContext = function(context){
    this.context = context;
}

Board.prototype.prepare = function(){
    //Not used
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

function LEDBoard() {
    this.shieldImg = IMAGES["LED Board"];
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
}

LEDBoard.prototype = Object.create(Board.prototype);

LEDBoard.imageURL = "/img/shield.gif";

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

var IMAGES = {};
var BOARDS = {
    "LED Board": LEDBoard
};

for(var b in BOARDS){
    if(BOARDS.hasOwnProperty(b)){
	IMAGES[b] = new Image;
	IMAGES[b].src = BOARDS[b].imageURL;
	console.log("Loaded background image for board: " + b);
    }
}
