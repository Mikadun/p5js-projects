
// Figure object

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

let Figure = function() {

	this.p = [];
	this.min = createVector(-width, -height);

	this.show = function() {
		noFill();
		stroke(150);
		textSize(10);
		for (let i = 0; i < this.p.length; i++)
			ellipse(this.p[i].x, this.p[i].y, 3, 3);

		fill(255);
		stroke(0, 255, 0);
		ellipse(this.min.x, this.min.y, 4, 4);

		if (false && this.p.length) {
			let step = 30;
			stroke(255);
			for (let x = 0; x < width; x += step) {
				for (let y = 0; y < height; y += step) {
					text(this.sum_dist(x, y), x, y);
				}
			}
		}

	}

	this.add = function(x, y) {
		this.p.push(createVector(x, y));
		EPS = map(this.p.length, 1, 100, 0.1, 5);
		this.min = this.find_min();
	}

	this.sum_dist = function(x, y) {
		let result = 0;
		for (let i = 0; i < this.p.length; i++) {
			result += dist(x, y, this.p[i].x, this.p[i].y);
		}
		return int(result);
	}

	this.find_min = function() {
		min_point = createVector(width * height, 0);
		for (let y = 0; y < height; y += EPS) {
			let x = min_ternary_search((x) => this.sum_dist(x, y), 0, width);
			let local_result = this.sum_dist(x, y);
			if (local_result < this.sum_dist(min_point.x, min_point.y)) {
				min_point = createVector(x, y);
			}
		}
		return min_point;
	}
}

let figure;

function setup() {
	createCanvas(600, 600);
	figure = new Figure();
}

function draw() {
	background(57);
	figure.show();
}

function mousePressed() {
	if (mouseButton === LEFT)
		figure.add(mouseX, mouseY);
}