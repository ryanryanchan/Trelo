
var my_lists;
var list_boards;
var map = {};

$(function(){

	var currentCard;
	my_lists = $('#lists');
// populate from server
	$.ajax({
    	url: "http://localhost:3000/my_boards/",
 	    data: {},
 	    type: "GET",
 	    dataType : "json",
	})
	.done(function(json){
		list_boards = json;
		for (var i = 0; i < list_boards.length; i++) {
			var list = list_boards[i];
			var listIndex = i;
			console.log(i);

			var boardLi = $('<li/>').attr('id',list._id).html(list.title).addClass('something');
			boardLi.append(`<button class = "del">delete</button>`)
   			boardLi.insertBefore('#add_board');
		}
	});



		//navbar stuff
	$("#navboards").click(function(){
		if($('#boards-menu').css('display') === "block"){
			$('#boards-menu').css('display','none');
		}else{
			$('#boards-menu').css('display','block');
		}
	});

	$("#navmenu").click(function(){
		if($('#menu').css('display') === "block"){
			$('#menu').css('display','none');
		}else{
			$('#menu').css('display','block');
		}
	});


	//add a board
	$("#new_board").on('submit', function(event){
		event.preventDefault();
		var board_title = $("#new_board input[name=board_title]").val();
		$.ajax({
			url: "http://localhost:3000/my_boards/",
			data: {"title": board_title},
			type: "POST", 		
			dataType : "json" 		
		}).done(function( json ){
			var new_list = $("<li/>").attr('id', json._id).addClass('something');
			new_list.html(board_title);
			new_list.append(`<button class = "del">delete</button>`)
			new_list.insertBefore($('#add_board'));
		});	
		$(this)[0].reset();
	});


	//delete boards
	$('.board').on('click', '.del', function(event){
		event.stopPropagation();
		currentCard = $(event.target).parent();
		var board_id = currentCard.attr('id');
		console.log('delete-list');
		$.ajax({
			url: "http://localhost:3000/my_boards/" + board_id,
			data: {},
			type: "DELETE", 		
			dataType : "json" 	
		});
		currentCard.remove();
	});

	$('.board').on('click', '.something', function(event){
		currentCard = $(event.target);
		var board_id = currentCard.attr('id');

		window.location = '/board/' + board_id;
	});

});