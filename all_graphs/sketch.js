
// Points object

let Graph = function(size) {

	this.v = [];
	for (let i = 0; i < size; i++)
		this.v.push(i);

	this.all_pairs = [];
	for (let i = 0; i < size; i++) {
		for (let j = i + 1; j < size; j++) {
			this.all_pairs.push({from: this.v[i], to: this.v[j]});
		}
	}

	this.get_all_edges = function() {
		let size = this.all_pairs.length;
		let edges = [];
		for (let i = 0; i < pow(2, size); i++) {
			let edge = [];
			for (let j = 0; j < size; j++) {
				if (((1 << j) & i) != 0)
					edge.push(j);
			}
			edges.push(edge);
		}

		this.edges = edges;
	}

	let get_pair = index => this.all_pairs[index];

	this.filter_edges = function() {
		let edges = this.edges;
		let result = [];

		let equal = function(a, b) {
			for (let i = 0; i < a.length; i++) {
				if (a[i] != b[i])
					return false;
			}
			return true;
		}

		let unique_v = [];

		for (let i = 0; i < edges.length; i++) {
			let v = [0, 0, 0, 0, 0];
			let edge = edges[i];
			for (let j = 0; j < edge.length; j++) {
				let pair = get_pair(edge[j]);
				v[pair.from]++;
				v[pair.to]++;
			}

			v.sort();

			let unique = function() {
				for (let j = 0; j < unique_v.length; j++) {
					if (equal(v, unique_v[j]))
						return false;
				}
				return true;
			}();

			if (unique) {
				result.push(edge);
				unique_v.push(v);
			}
		}

		result.sort((a, b) => a.length - b.length)

		this.edges = result;

		console.log(result);
	}

	this.count = 0;

	this.p = [createVector(50, 100), createVector(100, 50), createVector(150, 100), createVector(150, 200), createVector(50, 200)];

	this.show = function() {
		let p = this.p;
		for (let i = 0; i < p.length; i++) {
			ellipse(p[i].x, p[i].y, 3, 3);
		}

		let pairs = this.edges[this.count];
		for (let i = 0; i < pairs.length; i++) {
			let v1 = this.all_pairs[pairs[i]].from;
			let v2 = this.all_pairs[pairs[i]].to;
			line(p[v1].x, p[v1].y, p[v2].x, p[v2].y);
		}
	}

}

let g;

function setup() {
	createCanvas(600, 600);
	g = new Graph(5);
	g.get_all_edges();
	g.filter_edges();
	stroke(255);
}

function draw() {
	background(57);
	g.show();
}

function mousePressed() {
	if (mouseButton === LEFT)
		g.count++;
}
