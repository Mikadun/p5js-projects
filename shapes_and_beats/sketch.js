
// Player class

let Player = function(x = 0, y = 0, width = 10, height = 10, speed = 5, col = palette.BLUE) {

	this.DIR = createVector(1, 0);
	this.WIDTH = width;
	this.SPEED = speed;
	this.HEIGHT = height;

	this.pos = createVector(x, y);
	this.col = [0, 255, 255, 255];
	this.temp_col = this.col;
	this.depth = 0;

	this.inv_time = 0;
	
	this.width = this.WIDTH;
	this.height = this.HEIGHT;
	this.dir = this.DIR;
	this.speed = this.SPEED;
	this.vel = createVector(0, 0);

	this.transformStage = 0;
	this.transformState = 0;
	this.MAX_TRANSFORM_STAGE = 4;
}

Player.prototype.draw = function() {
	push();
	rectMode(RADIUS);
	noStroke();
	fill(color(this.temp_col));
	translate(this.pos.x, this.pos.y);
	rotate(this.dir.heading());
	rect(0, 0, this.width, this.height);
	pop();
}

Player.prototype.transform = function(dir = null, change = false) {
	if (change) {
		this.transformStage = this.MAX_TRANSFORM_STAGE;
		this.transformState = 2;
		this.dir = dir;
	}
	else {
		this.dir = this.DIR;
	}
}

Player.prototype.applyTransform = function() {
	const TRANSFORM_SPEED = 15;

	if (this.transformState == 2) {
		this.width = this.WIDTH * (1 + this.transformStage / TRANSFORM_SPEED);
		this.height = this.HEIGHT * (1 - this.transformStage / TRANSFORM_SPEED);
	} else if (this.transformState == 1) {
		this.width = this.WIDTH * (1 - (this.transformStage - this.MAX_TRANSFORM_STAGE / 2) / TRANSFORM_SPEED);
		this.height = this.HEIGHT * (1 - (this.transformStage - this.MAX_TRANSFORM_STAGE / 2) / TRANSFORM_SPEED);
	} else {
		this.width = this.WIDTH;
		this.height = this.HEIGHT;
	}

	if (this.transformStage > 0)
		this.transformStage--;
	else if (this.transformState > 0)
		this.transformState--;
}

Player.prototype.update = function(force = null) {
	//this.col = palette.BLUE;
	this.temp_col = this.col;
	if (this.inv_time) {
		if (this.inv_time % 12 > 4)
			this.temp_col = [255, 255, 255, 255];
		else
			this.temp_col = this.col;
		this.inv_time--;
	}

	if (force) {
		this.pos.x += force.x * this.speed;
		if (this.pos.x < this.height || this.pos.x > width + this.height)
			this.pos.x -= force.x * this.speed;
		this.pos.y += force.y * this.speed;
			if (this.pos.y < this.height || this.pos.y > height + this.height)
			this.pos.y -= force.y * this.speed;
		this.transform(force, change = true);
	}
	this.applyTransform();
}

Player.prototype.intersect = function(obj) {
	let eps = 20
	if (this.inv_time)
		return;

	if (pow(this.pos.x - obj.pos.x, 2) + pow(this.pos.y - obj.pos.y, 2) < max(player.width, player.height) + obj.r + eps) {
		if (this.depth < 10) {
			this.col[0] += 25;
			this.col[2] -= 25;
			this.WIDTH *= 0.95;
			this.HEIGHT *= 0.95;
			this.depth++;
			this.inv_time = 36;
		}
	}
}

let applyForce = function(left = false, up = false, right = false, down = false) {
	return createVector(left * (-1) + right, up * (-1) + down);
}

// Objects

let Bullet = function(x, y, dir_x, dir_y, speed, r, shape = 'circle', col = palette.PINK) {
	this.pos = createVector(x, y);
	this.dir = createVector(dir_x, dir_y);
	this.speed = speed;
	this.r = r;
	this.shape = shape;
	this.col = col;
}

Bullet.prototype.draw = function() {
	push();
	noStroke();
	fill(this.col);
	translate(this.pos.x, this.pos.y);
	rotate(this.speed);
	if (this.shape == 'rect') {
		rectMode(RADIUS);
		rect(0, 0, this.r, this.r);
	}
	if (this.shape == 'circle') {
		ellipseMode(RADIUS);
		ellipse(0, 0, this.r, this.r);
	}
	pop();
}

Bullet.prototype.update = function() {
	this.pos.x += this.dir.x * this.speed;
	this.pos.y += this.dir.y * this.speed;
}

let BulletManager = function() {
	this.bullets = [];
}

BulletManager.prototype.draw = function() {
	for (let i = 0; i < this.bullets.length; i++) {
		this.bullets[i].draw();
	}
}

BulletManager.prototype.update = function() {
	let to_delete = 0;
	let b = this.bullets;
	for (let i = b.length - 1; i >= 0; i-- ) {
		b[i].update();
		if (!OnScreen(b[i])) {
			to_delete++;
			[b[i], b[b.length - to_delete]] = [b[b.length - to_delete], b[i]];
		}
	}

	for (let i = 0; i < to_delete; i++) {
		this.bullets.pop();
	}
}

BulletManager.prototype.generate = function() {
	const CHANCE = 0.2;
	if (random(0, 1) > CHANCE) 
		return;
	let x = width;
	let y = random(0, height);
	let dir_x = random(-1.1, -0.9);
	let dir_y = random(-0.1, 0.1);
	let speed = random(1, 5);
	let r = 5;
	this.bullets.push(new Bullet(x, y, dir_x, dir_y, speed, r));
}

BulletManager.prototype.intersect = function(p) {
	for (let i = 0; i < this.bullets.length; i++) {
		p.intersect(this.bullets[i]);
	}
}

//

let OnScreen = function(obj, D = 50) {
	if (obj.r) {
		return obj.pos.x + obj.r > -D && obj.pos.x - obj.r < width + D && obj.pos.y + obj.r > -D && obj.pos.y - obj.r < height + D;
	}

	if (obj.width && obj.height) {
		return obj.pos.x + obj.width > -D && obj.pos.x - obj.width < width + D && obj.pos.y + obj.height > -D && obj.pos.y - obj.height < height + D;
	}
}

// Global variables

let palette;
let player;
let bulletManager;

// Setup

function setup() {
	createCanvas(window.innerWidth, window.innerHeight + 5);

	palette = {
		BLACK: color("#1e1b1b"),
		PINK:  color("#ff2071"),
		BLUE:  color("#00FFFF"),
		YELLOW: color("#FFFF00"),
	}

	player = new Player(width / 2, height / 2);
	bulletManager = new BulletManager();
	//bulletManager.bullets.push(new Bullet(width / 2, height / 2, 0, 0, 0, 10))
}

// Draw

function KeyManager() {
	if (keyIsDown(LEFT_ARROW) || keyIsDown(UP_ARROW) || keyIsDown(RIGHT_ARROW) || keyIsDown(DOWN_ARROW)) {
		let force = applyForce(keyIsDown(LEFT_ARROW), keyIsDown(UP_ARROW), keyIsDown(RIGHT_ARROW), keyIsDown(DOWN_ARROW))
		player.update(force);
	}
}

function draw() {
	if (keyIsPressed) {
		KeyManager();
	}
	else {
		player.update();
	}

	background(palette.BLACK);

	bulletManager.generate();
	bulletManager.update();
	bulletManager.intersect(player);
	bulletManager.draw();
	player.draw();
}
