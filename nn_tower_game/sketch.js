
let UIs = [];
let populationSize = 100;
let generationCount = 1;
let trains_per_loops;

function setup()
{
	createCanvas( 600, 600 );
	angleMode( DEGREES );

	for( let i = 0; i < populationSize; i++ )
	{
		UIs[i] = new UI();
	}
}

function train()
{
	let count = 0;

	for( let i = 0; i < UIs.length; i++ )
	{
		let ui = UIs[i];
		if( !ui.gameOver )
		{
			ui.think();
			ui.playerManager();
			ui.bulletsManager();
			ui.minesManager();
			count++;
		}
	}

	if( count == 0 )
	{
		generationCount++;
		print( 'generation: ' + generationCount );
		UIs = nextGeneration( UIs );
		bestUI.restart();
	}
}

function showMessage()
{
	fill( 57 );
	strokeWeight( 3 );
	stroke( 255 );

	textSize( 30 );
	textAlign( LEFT, BOTTOM );
	text( 'Generation: ' + generationCount, 15, height - 15 );
	strokeWeight( 1 );
}

let delay_count = 0;

function draw()
{
	background( 57 );
	trains_per_loops = floor( bestScore / 10 + 1 );

	for( let i = 0; i < trains_per_loops; i++ )
		train();

	if( bestUI )
	{
		if( !bestUI.gameOver )
		{
			bestUI.think();
			bestUI.playerManager();
			bestUI.bulletsManager();
			bestUI.minesManager();
			bestUI.show();
			showMessage();
		}
		else
		{
			bestUI.restart();
		}
	}
	else
	{
		bestUI = UIs[0];
	}
}