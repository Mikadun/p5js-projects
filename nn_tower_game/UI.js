let outWindow = function( min_x, min_y, max_x, max_y )
{
	//return this.pos.x < 0 || this.pos.y < 0 || this.pos.x > width || this.pos.y > height;
	return min_x < 0 || min_y < 0 || max_x > width || max_y > height;
}

let Bullet = function( pos, vel, speed )
{
	this.pos = pos;
	this.vel = vel;
	this.speed = speed || 4;

	this.R = 3;

	this.KOEF_SPEED = 0.1;
	this.R_INC_SPEED = 0.1;
	this.col = 255;

	this.update = function()
	{
		this.pos.add( p5.Vector.mult( this.vel, this.speed ) );

		this.speed += this.KOEF_SPEED;
		this.R += this.R_INC_SPEED;
		return outWindow( this.pos.x + this.R, this.pos.y + this.R, this.pos.x - this.R, this.pos.y - this.R );
	}

	this.show = function()
	{
		noStroke();
		fill( this.col );
		ellipse( this.pos.x, this.pos.y, this.R * 2, this.R * 2 );
	}

} // Bullet

let Mine = function( x, y, R, target, speed )
{
	this.pos = createVector( x, y );
	this.R = R;
	this.direction = p5.Vector.sub( target, this.pos ).normalize();
	this.speed = speed;

	this.show = function()
	{
		stroke( 255 );
		fill( 89 );
		ellipse( this.pos.x, this.pos.y, this.R * 2, this.R * 2 );
	}

	this.update = function()
	{
		this.pos.add( p5.Vector.mult( this.direction, this.speed ) );
	}

	this.intersect = function( target )
	{
		return ( abs( dist( target.pos.x, target.pos.y, this.pos.x, this.pos.y ) ) < this.R + target.R );
	}

} // Mine

let Player = function( x, y )
{
	this.pos = new createVector( x, y );
	this.direction = new createVector( 0, -1 );

	this.ROTATE_SPEED = 0.07;
	this.RELOAD_TIME = 30;
	this.R = 20;
	this.heat = 0;
	
	this.show = function()
	{
		stroke( 180 );
		fill( 57 );
		ellipse( this.pos.x, this.pos.y, this.R * 2, this.R * 2 );
		fill( 255 );

		beginShape();
		let dir_left = this.direction.copy();
		dir_left.rotate( -60 );
		let dir_right = this.direction.copy();
		dir_right.rotate( 60 );
		vertex( this.pos.x + this.direction.x * this.R, this.pos.y + this.direction.y * this.R );
		vertex( this.pos.x + dir_left.x * this.R, this.pos.y + dir_left.y * this.R );
		vertex( this.pos.x + dir_right.x * this.R, this.pos.y + dir_right.y * this.R );
		endShape();

	}

	this.update = function()
	{
		if( this.heat > 0 )
		{
			this.heat--;
		}
	}

	this.rotate = function( dir )
	{
		this.direction.rotate( dir * this.ROTATE_SPEED );
	}

	this.shoot = function()
	{
		if( this.heat == 0 )
		{
			this.heat = this.RELOAD_TIME;
			return new Bullet( p5.Vector.add( this.pos, p5.Vector.mult( this.direction, this.R ) ), this.direction.copy() );
		}
		else
			return undefined;
	}

} // Player

function mutate(x) 
{
	if (random(1) < 0.1) 
	{
		let offset = randomGaussian() * 0.5;
		let newx = x + offset;
		return newx;
	} 
	else 
	{
		return x;
	}
}

let UI = function()
{
	this.player = new Player( width / 2, height / 2 );

	this.current_mine_speed = 1;
	this.MINE_SPEED_INC = 0.0005;
	this.MAX_MINES = 3;

	this.playerManager = function()
	{
		if( this.gameOver )
			return;

		this.player.update();

		//this.playerRotate();
	}

	this.playerShoot = function()
	{
		let bullet = this.player.shoot();
		if( bullet )
			this.bullets.push( bullet );
	}

	this.playerRotate = function()
	{
		if( keyIsDown( LEFT_ARROW ) && !keyIsDown( RIGHT_ARROW ) )
			this.player.rotate( -1 );
		else if( keyIsDown( RIGHT_ARROW ) && !keyIsDown( LEFT_ARROW ) )
			this.player.rotate( 1 );
	}

	this.bulletsManager = function()
	{
		if( this.gameOver )
			return;

		for( let i = 0; i < this.bullets.length; i++ )
		{
			let bullet = this.bullets[i];
			if ( bullet.update() )
			{
				this.bullets.splice( i, 1 );
			}
		}
	}

	this.minesManager = function()
	{
		if( this.gameOver )
			return;

		for( let i = 0; i < this.mines.length; i++ )
		{
			let mine = this.mines[i];
			if( !this.gameOver )
			{
				mine.update();

				for( let j = 0; j < this.bullets.length; j++ )
				{
					if( mine.intersect( this.bullets[j] ) )
					{
						mine = undefined;
						this.score++;
						this.bullets.splice( j, 1 );
						break;
					}
				}

				if( mine && mine.intersect( this.player ) )
				{
					this.endGame();
				}

				if( !mine || outWindow( mine.pos.x + mine.R, mine.pos.y + mine.R, mine.pos.x - mine.R, mine.pos.y - mine.R ) )
				{
					this.mines.splice( i, 1 );
				}
			}
		}

		if( this.mines.length < this.MAX_MINES )
		{
			this.mines.push( this.addMine() );
		}

	} // minesManager

	this.endGame = function()
	{
		this.gameOver = true;

		//print( 'Game over' );
		//print( 'Score:', this.score );
	}

	this.showStats = function()
	{
		fill( 57 );
		strokeWeight( 3 );
		stroke( 255 );

		textSize( 30 );
		textAlign( RIGHT, BOTTOM );
		text( 'Score: ' + this.score, width - 15, height - 15 )

		if( this.gameOver )
		{
			textSize( 42 );
			textAlign( CENTER, CENTER );
			text( 'Game Over', width / 2, height / 2 );
		}
		strokeWeight( 1 );

	}

	this.addMine = function()
	{
		this.current_mine_speed += this.MINE_SPEED_INC;
		let BORDER = random( 30, 100 );
		let x;
		let y;
		if( random( 1 ) > 0.5 )
		{
			x = random( 1 ) > 0.5 ? -BORDER : width + BORDER;
			y = random( -BORDER, height + BORDER );
		}
		else
		{
			x = random( -BORDER, width + BORDER );
			y = random( 1 ) > 0.5 ? -BORDER : height + BORDER;
		}
		return new Mine( x, y, random( 20, 40 ), this.player.pos, this.current_mine_speed );
	}

	this.restart = function()
	{
		this.mines = [];
		this.bullets = [];
		this.score = 0;
		this.current_mine_speed = 1;
		
		this.gameOver = false;
	}

	this.show = function()
	{
		this.player.show();

		for( let i = 0; i < this.bullets.length; i++ )
		{
			this.bullets[i].show();
		}

		for( let i = 0; i < this.mines.length; i++ )
		{
			this.mines[i].show();
		}

		this.showStats();
	}

	this.createAI = function( brain )
	{
			if (brain instanceof NeuralNetwork) 
			{
				this.brain = brain.copy();
				this.brain.mutate(mutate);
			} 
			else 
			{
				this.brain = new NeuralNetwork(4, 8, 4);
			}
	}

	this.createAI();

	this.copy = function()
	{
		let newUI = new UI();
		newUI.createAI( this.brain );
		return newUI;
	}

	this.think = function()
	{
		let closest_mine = this.mines[0];
		let second_close_mine = this.mines[0];

		let min_dist = width + height;
		let s_min_dist = width + height;

		for( let i = 0; i < this.mines.length; i++ )
		{
			let mine = this.mines[i];
			let p = this.player;
			let d = dist( p.pos.x, p.pos.y, mine.pos.x, mine.pos.y );
			if( d < min_dist )
			{
				min_dist = d;
				closest_mine = mine;
			}
			else if( d < s_min_dist )
			{
				s_min_dist = d;
				second_close_mine = mine;
			}
		}

		if( closest_mine )
		{
			let inputs = [];
			let vec_1 = p5.Vector.sub( closest_mine.pos, createVector( width / 2, height / 2 ) );
			let vec_2 = p5.Vector.sub( second_close_mine.pos, createVector( width / 2, height / 2 ) );
			/*
			inputs[0] = closest_mine.pos.x / width;
			inputs[1] = closest_mine.pos.y / height;
			inputs[2] = closest_mine.speed / 10;
			inputs[3] = this.player.direction.x;
			inputs[4] = this.player.direction.y;
			*/

			inputs[0] = vec_1.angleBetween( this.player.direction ) / PI;
			inputs[1] = vec_2.angleBetween( this.player.direction ) / PI;
			inputs[2] = closest_mine.speed / 10;
			inputs[3] = this.player.heat / this.player.RELOAD_TIME;

			let output = this.brain.predict( inputs );

			let action = 0;
			for( let i = 0; i < output.length; i++ )
			{
				if( output[action] < output[i] )
					action = i;
			}
			// action == 0 is doing nothing
			if( action == 1 )
				this.player.rotate( 1 );
			if( action == 2 )
				this.player.rotate( - 1 );
			if( action == 3 )
				this.playerShoot();
		}
	}

	this.getMinesByDist = function()
	{
		let mines = [];
		for( let i = 0; i < this.mines.length; i++ )
		{
			let curr_min = Infinity;
			for( let j = i; j < this.mines.length; j++ )
			{
				if( curr_min > this.mines[j] )
					curr_min = 0;
			}
		}
	}

	this.restart();

} // UI