
let Point = function(x, y) {
	this.x = x;
	this.y = y;
} 

let Line = function(x1, y1, x2, y2) {
	this.p1 = new Point(min(x1, x2), min(y1, y2));
	this.p2 = new Point(max(x1, x2), max(y1, y2));

	this.draw = function() {
		stroke(255);
		line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
	}
}

let line = new Line(100, 100, 500, 500);

function setup() {
	createCanvas(600, 600);
}

function draw() {
	background(57);
	line.draw();
}

