
let EPS = 0.1;

let min_ternary_search = function(f, l, r) {
	do {
		let first_third = l + (r - l) / 3;
		let second_third = r - (r - l) / 3;

		if (f(first_third) < f(second_third)) {
			r = second_third;
		}
		else {
			l = first_third;
		}
	} while(abs(r - l) > EPS);

	return (l + r) / 2;
}


let dist_to_line = function(k, b, p) {
	return abs(k * p.x - p.y + b) / sqrt(k * k + 1);
}

let Points = function() {

	this.p = [];

	this.show = function() {
		fill(255);
		stroke(150);
		textSize(10);
		for (let i = 0; i < this.p.length; i++)
			ellipse(this.p[i].x, this.p[i].y, 4, 4);
	}

	this.add = function(x, y) {
		this.p.push(createVector(x, y));
	}

	this.sum_dist = function(f) {
		let result = 0;
		for (let i = 0; i < this.p.length; i++) {
			result += f(this.p[i]);
		}
		return int(result);
	}

	this.find_min_line = function(lines) {
		let global_min = width * height;
		let line = new Line(0, 0);

		for (let k = -100; k < 100; k += EPS) {
			let b = min_ternary_search((b) => this.sum_dist((p) => dist_to_line(k, b, p)), -height, 2 * height);
			let local_min = this.sum_dist((p) => dist_to_line(k, b, p));
			if (local_min < global_min) {
				global_min = local_min;
				line.k = k;
				line.b = b;
			}
		}
		lines.add(line.k, line.b);
	}
}

let Line = function(k, b) {
	this.k = k;
	this.b = b;

	this.get_y = function(x) {
		return this.k * x + this.b;
	}

	this.show = function() {
		line(0, this.get_y(0), width, this.get_y(width));
	}

	this.dist = function(p) {
		return abs(this.k * p.x - p.y + this.b) / sqrt(this.k * this.k + 1);
	}
}

let Lines = function() {
	this.lines = [];

	this.add = function(k, b) {
		if (this.lines.length > 0)
			this.lines.pop();

		this.lines.push(new Line(k, b));
	}

	this.show = function() {
		for (let i = 0; i < this.lines.length; i++) {
			this.lines[i].show();
		}
	}

}

let points;
let lines;

function setup() {
	createCanvas(600, 600);
	points = new Points();
	lines = new Lines();
}

function draw() {
	background(57);
	points.show();
	lines.show();
}

function mousePressed() {
	if (mouseButton === LEFT) {
		points.add(mouseX, mouseY);
		points.find_min_line(lines);
	}
}