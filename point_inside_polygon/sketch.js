
// Points object

let Points = function() {

	this.p = [];

	this.show = function() {
		noFill();
		stroke(255);
		for (let i = 0; i < p.length; i++)
			ellipse(p[i].x, p[i].y, 4, 4);
		if (p.length > 1) {

			stroke(200);
			fill(100);
			beginShape();

			for (let i = 0; i < p.length; i++)
				vertex(p[i].x, p[i].y);

			endShape();
		}
	}

	this.add = function(x, y) {
		p.push(createVector(x, y));
	}

	this.contain = function(point) {
		let j = p.length - 1;
		let result = false;

		for (let i = 0; i < p.length; i++) {
			let f_cond = p[i].y < point.y && p[j].y >= point.y || p[j].y < point.y && p[i].y >= point.y;
			let s_cond = p[i].x + (point.y - p[i].y) / (p[j].y - p[i].y) * (p[j].x - p[i].x) < point.x;
			if (f_cond && s_cond)
				result = !result;
			j = i;
		}

		return result;
	}

	return this;
}

let CheckPoint = function(x, y) {

	this.x = x;
	this.y = y;

	this.r = 3;

	this.is_inside = false;

	this.update = function(is_inside) {
		this.is_inside = is_inside;
	}

	this.show = function() {
		stroke(255);
		fill(this.is_inside ? 'rgb(201, 26, 37)' : 'rgb(13, 91, 216)');
		ellipse(this.x, this.y, this.r * 2, this.r * 2);
	}
}

let points;
let points_to_check;

function setup() {
	createCanvas(600, 600);
	points = Points();
	points_to_check = [];
	createSome(100);
}

function draw() {
	background(57);
	points.show();
	if(points_to_check.length) {
		for (let i = 0; i < points_to_check.length; i++) {
			points_to_check[i].update(points.contain(points_to_check[i]));
			points_to_check[i].show();
		}
	}
}

function createSome(amount) {
	for (let i = 0; i < amount; i++)
		points_to_check.push(new CheckPoint(random(width), random(height)));
}

function mousePressed() {
	if (mouseButton === LEFT)
		points.add(mouseX, mouseY);
}

function keyPressed() {
	if (keyCode == CONTROL)
		points_to_check.push(new CheckPoint(mouseX, mouseY));
	if (keyCode == ESCAPE) {
		points.clear();
	}
}
