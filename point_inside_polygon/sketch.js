
// Figure object

let Figure = function() {

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

	this.clear = function() {
		p = [];
	}

	return this;
}

let PointFigure = function(x, y) {

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

let figure;
let point;

function setup() {
	createCanvas(600, 600);
	figure = Figure();
	point = null;
}

function draw() {
	background(57);
	figure.show();
	if(point) {
		point.update(figure.contain(point));
		point.show();
	}
}

function mousePressed() {
	if (mouseButton === LEFT)
		figure.add(mouseX, mouseY);
}

function keyPressed() {
	if (keyCode == CONTROL)
		point = new PointFigure(mouseX, mouseY);
	if (keyCode == ESCAPE) {
		point = null;
		figure.clear();
	}
}
