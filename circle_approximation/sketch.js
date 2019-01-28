
let EPS = 2;

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

let dist_to_circle = function(cx, cy, R, p) {
	return abs(dist(cx, cy, p.x, p.y) - R);
}

let Points = function() {

	this.p = [];
	this.circle = new Circle(0, 0, 0);

	this.show = function() {
		fill(255);
		stroke(150);
		for (let i = 0; i < this.p.length; i++)
			ellipse(this.p[i].x, this.p[i].y, 4, 4);
		this.circle.show();
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

	this.find_circle = function() {
		let global_min = width * height;
		let circle = new Circle(0, 0, 0);

		for (let cx = width / 4; cx < 3 * width / 4; cx += EPS) {
			for (let cy = height / 4; cy < 3 * height / 4; cy += EPS) {
				let R = min_ternary_search((R) => this.sum_dist((p) => dist_to_circle(cx, cy, R, p)), 0, max(height, width));
				let local_min = this.sum_dist((p) => dist_to_circle(cx, cy, R, p));
				if (local_min < global_min) {
					global_min = local_min;
					circle = new Circle(cx, cy, R);
				}
			}
		}
		this.circle = circle;
	}

	this.createPoints = function(cx, cy, R, count, noise) {
		let v = createVector(0, R);
		let angle = TWO_PI / count;
		for (let i = 0; i < count; i++) {
			v.rotate(angle);
			let x = cx + v.x + random(5, noise) * Math.sign(random(-100, 100));
			let y = cy + v.y + random(5, noise) * Math.sign(random(-100, 100));
			this.add(x, y);
		}
	}
}

let Circle = function(cx, cy, R) {
	this.cx = cx;
	this.cy = cy;
	this.R = R;

	this.show = function() {
		noFill();
		stroke(255);
		ellipseMode(CENTER);
		ellipse(this.cx, this.cy, 2 * this.R, 2 * this.R);
	}
}

let points;

function setup() {
	createCanvas(600, 600);
	points = new Points();
	points.createPoints(width / 2, height / 2, 200, 40, 20);
	points.find_circle();
}

function draw() {
	background(57);
	points.show();
}

function mousePressed() {
	if (mouseButton === LEFT) {
		points.add(mouseX, mouseY);
	}
}