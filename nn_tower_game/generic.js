// Daniel Shiffman
// Nature of Code: Intelligence and Learning
// https://github.com/shiffman/NOC-S17-2-Intelligence-Learning

// This flappy bird implementation is adapted from:
// https://youtu.be/cXgA1d_E-jY&


// This file includes functions for creating a new generation
// of birds.

// Start the game over

let savedUIs = [];
let bestUI = null;
let bestScore = 0;

function resetTraining( UIs ) 
{
	for( let i = 0; i < UIs.length; i++ )
	{
		savedUIs[i] = UIs[i];
		if( UIs[i].score > bestScore )
		{
			bestScore = UIs[i].score;
			bestUI = UIs[i];
			bestUI.restart();
		}
	}
	// Resetting best bird score to 0
}

// Create the next generation
function nextGeneration( UIs ) {
	resetTraining( UIs );
	// Normalize the fitness values 0-1
	normalizeFitness( savedUIs );
	// Generate a new set of birds
	activeUIs = generate( savedUIs );
	// Copy those birds to another array
	return activeUIs;
}

// Generate a new population of birds
function generate( oldUIs ) 
{
	let newUIs = [];
	for (let i = 0; i < oldUIs.length; i++) 
	{
		// Select a bird based on fitness
		newUIs[i] = poolSelection(oldUIs);
	}
	return newUIs;
}

// Normalize the fitness of all birds
function normalizeFitness( UIs ) 
{
	// Make score exponentially better?
	let sum = 0;
	for( let i = 0; i < UIs.length; i++ )
	{
		sum += UIs[i].score;
	}

	// Divide by the sum
	for (let i = 0; i < UIs.length; i++) 
	{
		UIs[i].fitness = UIs[i].score / sum;
	}
}


// An algorithm for picking one bird from an array
// based on fitness
function poolSelection( oldUIs ) 
{
	// Start at 0
	let index = 0;

	// Pick a random number between 0 and 1
	let r = random(1);

	// Keep subtracting probabilities until you get less than zero
	// Higher probabilities will be more likely to be fixed since they will
	// subtract a larger number towards zero
	while (r > 0) {
		r -= oldUIs[index].fitness;
		// And move on to the next
		index += 1;
	}

	// Go back one
	index -= 1;

	// Make sure it's a copy!
	// (this includes mutation)
	return oldUIs[index].copy();
}