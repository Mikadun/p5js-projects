
Array.prototype.swap = function(i, j) {
	let temp = this[i];
	this[i] = this[j];
	this[j] = temp;
}

let get_rotate = function(p_start, p_end, p) {
	return (p_end.x - p_start.x) * (p.y - p_end.y) - (p_end.y - p_start.y) * (p.x - p_end.x);
}

let Figure = function() {

	this.points = [];
	this.convex_hull = [];

	this.show = function() {

		if (this.convex_hull.length > 1) {

			stroke(200);
			fill(100);
			beginShape();

			for (let i = 0; i < this.convex_hull.length; i++)
				vertex(this.convex_hull[i].x, this.convex_hull[i].y);
			endShape();
		}

		noFill();
		stroke(255);
		for (let i = 0; i < this.points.length; i++)
			ellipse(this.points[i].x, this.points[i].y, 4, 4);
	}

	this.add = function(x, y) {
		this.points.push(createVector(x, y));
		this.update();
	}

	this.update = function() {

		if (this.points.length <= 3) {
			this.convex_hull = this.points;
			return;
		}

		p = this.points.slice(0);
		for (let i = 1; i < p.length; i++) {
			if (p[i].y < p[0].y) {
				p.swap(i, 0);
			}
		}

		let result = [p[0]];
		p.swap(0, p.length - 1);
		do {
			let right = 0;
			for (let i = 1; i < p.length; i++) {
				if (get_rotate(result[result.length - 1], p[right], p[i]) < 0)
					right = i;
			}
			result.push(p[right]);
			p.splice(right, 1);
		} while (result[0] != result[result.length - 1]);

		this.convex_hull = result;
	}
}

let figure = new Figure();

function setup() {
	createCanvas(600, 600);
}

function draw() {
	background(57);
	figure.show();
}

function mousePressed() {
	if (mouseButton === LEFT)
		figure.add(mouseX, mouseY);
}