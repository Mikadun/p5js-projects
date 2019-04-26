
var player = "";
var computer = "";
var turn = 0;
var is_end = true;

var lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
//var lines_ = [[4, 0, 2, 6, 8, 1, 3, 5, 7], [4, 8, 6, 2, 0, 7, 5, 3, 1], [4, 6, 2, 0, 8, 5, 3, 1, 7]];
var lines_ = [[4, 0, 2, 6, 8, 1, 3, 5, 7], [8, 3, 6, 2, 0, 7, 5, 4, 1], [1, 6, 5, 0, 8, 5, 3, 4, 2], [3, 0, 5, 1, 2, 4, 8, 7, 6]];

var cell = new Array(9);
cell.fill("td_empty");

// Interface //

$("td").click(function(){
	if(is_end || $(this).attr("class") != "td_empty") return;
	step($("td").index(this));
});

$(".button").click(function(){
	clear();
});

var re_draw = function(){
	for(let i = 0; i < cell.length; i++){
		$("td:eq(" + i + ")").attr("class", cell[i]);
	}
}

var show_winner = function(winner){
	let img = (winner == "td_cross" ? "cross.png" : "nought.png");
	$("div.result_container").css("background-image", "url(\"img/" + img + "\")");
	$("div.result_container").text("Win");
	return true;
}

var show_draw = function(){
	$("div.result_container").text("Draw");
	return true;
}

var clear_screen = function(img){
	$(".button").text("Again");
	$("div.result_container").css("background-image", "url(\"img/empty.png\")");
	$("td").attr("class", "td_empty");
	$("div.result_container").text("");
	$("img").attr("src", "img/" + img);
	$(".player_info_container").css("visibility", "visible");
}

// Application //

var random = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

var put = function(index, value){
	++turn;
	cell[index] = value;
}

var step = function(index){
	put(index, player);
	re_draw();
	if(win_check()) return; 
	setTimeout(function(){
		if(!can_win(computer))
			if(!can_win(player))
				put_();
		win_check();
		re_draw();
	}, 200);
}

var can_win = function(value){
	for(let i of lines){
		let empty_count = 0;
		let count = 0;
		for(let j of i){
			if(cell[j] == value) count++;
			if(cell[j] == "td_empty") empty_count++;
		}
		if(count == 2 && empty_count == 1){
			for(let j of i){
				if(cell[j] == "td_empty"){
					put(j, computer);
					return true;
				}
			}
		}
	}
	return false;
}

var put_ = function(){
	for(let i of lines_[random(0, lines_.length)]){
		if(cell[i] == "td_empty"){
			put(i, computer);
			return;
		}
	}
}

var win_check = function(){
	for(let i of lines){
		if(cell[i[0]] != "td_empty" && cell[i[0]] == cell[i[1]] && cell[i[0]] == cell[i[2]]){
			is_end = show_winner(cell[i[0]]);
		}
	}
	console.log(is_end);
	if(turn == 9 && !is_end){
		is_end |= show_draw();
	}
	return is_end;
}

var clear = function(){
	cell.fill("td_empty");
	turn = 0;
	is_end = false;
	if(random(0, 2) == 0){
		player = "td_nought";
		computer = "td_cross";
	} else {
		player = "td_cross";
		computer = "td_nought";
	}
	clear_screen(player == "td_cross" ? "cross.png" : "nought.png");
	if(computer == "td_cross"){
		setTimeout(function(){
			put_();
			re_draw();	
		}, 200);
	}
}
