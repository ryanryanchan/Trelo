
//dummy data
// var list_lists = [
// 	{
// 		id:1,
//     	title: 'List 1',
//     	cards: [
//     		{ id: 'card1', description: 'hello 1' },
//       		{ id: 'card2', description: 'hello 2' },
//       		{ id: 'card3', description: 'hello 3' },
//       		{ id: 'card4', description: 'hello 4' },
//     	]
//   	},
//   	{
//   		id:2,
//     	title: 'List 2',
//     	cards: []
//   	},
//   	{
//   		id:3,
//     	title: 'List 3',
//     	cards: [
//       		{ id: '3card1', description: 'hey1' },
//     	]
//   	}
// ];


var my_lists;
var list_lists;
var map = {};

$(function(){
	var currentCard;
	my_lists = $('#lists');
// populate from server
	$.ajax({
    	url: "http://localhost:3000/list",
 	    data: {},
 	    type: "GET",
 	    dataType : "json",
	})
	.done(function(json){
		list_lists = json;

		for (var i = 0; i < list_lists.length; i++) {

			var list = list_lists[i];
			var listIndex = i;
			console.log(i);
			var listLi = $('<li/>').addClass('list').attr('id',list._id).html(list.title);
			listLi.append(`<button class = "del">delete</button>`)
			var cardsUl = $('<ul/>').addClass('cards');


			for(var j = 0; j < list.cards.length; j++) {
	 	    	var cardIndex = j;
	      		var cardId = list.cards[j]._id;
	     		var card = list.cards[j];
	   		   	map[cardId] = { listIndex, cardIndex }; // { listIndex: listIndex, cardIndex: cardIndex }

	      		var cardLi = $('<li/>').attr('id', card._id).attr('class', 'card').html(card.description);
	      		cardLi.append(`<button data-cardid="${cardId}" class="del-btn">X</button>`);
	     		cardsUl.append(cardLi);
    		}
			listLi.append(cardsUl).append(`<button class = "add">add card...</button>`);
   			listLi.insertBefore('#add_list');
		}


	});


//local data load
	// my_lists = $('#lists');

	// for (var i = 0; i < list_lists.length; i++) {
	// 	var list = list_lists[i];
	// 	var listIndex = i;
 //  		var listLi = $('<li/>').addClass('list').attr('id',listIndex).html(list.title);
 //  		listLi.append(`<button class = "del">delete</button>`)
 //    	var cardsUl = $('<ul/>').addClass('cards');

 //    	for(var j = 0; j < list.cards.length; j++) {
 // 	    	var cardIndex = j;
 //      		var cardId = list.cards[j].id;
 //     		var card = list.cards[j];
 //   		   	map[cardId] = { listIndex, cardIndex }; // { listIndex: listIndex, cardIndex: cardIndex }
   	   
 //      		var cardLi = $('<li/>').attr('id', cardId).attr('class', 'card').html(card.description);
 //      		cardLi.append(`<button data-cardid="${cardId}" class="del-btn">X</button>`);
 //     		cardsUl.append(cardLi);
 //    	}
 //    	listLi.append(cardsUl).append(`<button class = "add">add card...</button>`);
 //   		my_lists.append(listLi);
	// }
	// my_lists.append(`<li class="list" id = "add_list">
	// 	<form id="new_list">
	// 		<input class="box" type="text" name="list_title" placeholder="Add a list...">
	// 		<input class="box" type="submit" name="submit_list" value ="Make list">
	// 	</form>
	// </li>`);

	//helper function
	function findListIndex(listID) {
	for (var i = 0; i < my_lists.children().length; i++){
		if (my_lists.children()[i].id == listID){
			return i;
			}
		};	
		return -1;
	};

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

	//modal stuff
	$("#lists").on("click", ".list .add", function(event){
		$("#modal").css("display","block");
		currentCard = event.target;
	});

	//save a card
	$('#new_form').on("submit", function(event){
		event.preventDefault();

		var card_title = $("#new_form input[name=Description]").val();
		var currentList = $(currentCard).parent();
		var listID = currentList.attr("id");
		var cardID;
		var cards;

		var serverResponse;
		$.ajax({
			url: "http://localhost:3000/list/"+ listID ,
			data: {
				"description": card_title
			},
			type: "POST",	 		
			dataType : "json" 	
		})
		.done(function(json){
			serverResponse = json;
			cards = serverResponse.cards;
			cardID = cards[cards.length - 1]._id;
			listID = findListIndex(listID);

			list_lists[listID] = serverResponse;
			map[cardID] = {listIndex: listID, cardIndex:cards.length - 1};

			//create new element, fill in data
			var newLi = $("<li/>").addClass('card').attr('id',cardID).html(card_title);
			newLi.append(`<button data-cardid="${cardID}" class="del-btn">X</button>`);
			
			//get current list and insert
			var ul_cards = $(currentCard).siblings("ul.cards"); 
			ul_cards.append(newLi);
		});

		//reset form modal
		$("#modal").css("display","none");
		$(this)[0].reset();

	});

	// delete cards
	my_lists.on('click', '.del-btn', function(event) {
		var currentButton = $(event.target);
		console.log(currentButton.parent());

    	var cardId = currentButton.parent().attr('id');
    	var listIndex = map[cardId].listIndex;
    	var cardIndex = map[cardId].cardIndex;

    	$.ajax({
    		url: ("http://localhost:3000/list/"+ list_lists[listIndex]._id +"/card/" + list_lists[listIndex].cards[cardIndex]._id),
			data: {},
			type: "DELETE",
			dataType : "html",
    	}).done(function(json){
    		delete map[cardId];
    		console.log('deleted')

    		list_lists[listIndex].cards.splice(cardIndex, 1);
    	});
    	$(this).parent().remove();

    	// Update map
   		console.log(map);
  	});

	//add a list
	$("#new_list").on('submit', function(event){
		event.preventDefault();
		var list_title = $("#new_list input[name=list_title]").val();
		var listID;
		$.ajax({
			url: "http://localhost:3000/list",
			data: {"title": list_title},
			type: "POST", 		
			dataType : "json" 		
		}).done(function( json ){
			list_lists[list_lists.length -1] = json;
			
			listID = list_lists[list_lists.length -1]._id;
			console.log(listID);
			var new_list = $("<li/>").addClass("list").attr('id', listID);
			new_list.html(list_title);
			new_list.append(`<button class = "del">delete</button>`)
			new_list.append($("<ul/>").addClass('cards'));
			new_list.append(`<button class = "add">add card...</button>`);
			new_list.insertBefore($('#add_list'));
		});		

		$(this)[0].reset();
	});

	//delete lists
	my_lists.on('click', '.del', function(event){
		currentCard = $(event.target).parent();
		var list_id = currentCard.attr('id');
		console.log(list_id);
		console.log('delete-list');
		$.ajax({
			url: "http://localhost:3000/list/" + list_id,
			data: {},
			type: "DELETE", 		
			dataType : "json" 	
		});
		list_lists.splice(findListIndex(list_id), 1);
		currentCard.remove();

	});


	console.log(map);
});



//modal exiting
var modal = document.getElementById("modal");
var close = document.getElementById("x");
close.onclick = function(){
	modal.style.display = "none";
}

window.onclick = function(event){

	if(event.target == modal){
		modal.style.display = "none";
	}

}
