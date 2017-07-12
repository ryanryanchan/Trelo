var my_lists;
var list_lists;
var map = {};


$(function(){
	var currentCard;
	my_lists = $('#lists');
// populate from server
	$.ajax({
    	url: "http://localhost:3000/my_boards/" + boardid,
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

	      		var cardLi = $('<li/>').attr('id', card._id).attr('class', 'card').html(card.title);
	      		cardLi.append(`<button data-cardid="${cardId}" class="del-btn">X</button>`);
	     		cardsUl.append(cardLi);
    		}
			listLi.append(cardsUl).append(`<button class = "add">add card...</button>`);
   			listLi.insertBefore('#add_list');
		}


	});

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

	var editing = false;

	//modal stuff
	$("#lists").on("click", ".list .add", function(event){
		$('#comments').empty();
		$("#description").attr("value", "");
		$("#card_title").attr("value", "");
		$("#modal").css("display","block");
		$("#comments_box").css("display","none");
		editing = false;
		currentCard = event.target;
	});


	//click a card
	$('#lists').on('click', '.card', function(event){
		var thiscard = list_lists[map[this.id].listIndex].cards[map[this.id].cardIndex];
		console.log(thiscard);
		$("#comments_box").css("display","block");
		$("#description").attr("value", thiscard.description);
		$("#card_title").attr("value", thiscard.title);
		$("#modal").css("display","block");
		$('#comments').empty();
		for(var i = 0; i < thiscard.comments.length; i++){
			
			var new_comment = $("<li/>").addClass('box');
			new_comment.html(thiscard.comments[i]);
			console.log(thiscard)
			$('#comments').append(new_comment);

		}
		editing = true;
		currentCard = event.target;
	});

	//save a card
	$('#new_form').on("submit", function(event){
		event.preventDefault();

		var card_title = $("#new_form input[name=title]").val();
		var card_description = $("#new_form input[name=Description]").val();
		var card_comment = $("#new_form input[name=Comment]").val();

		
		var currentList = $(currentCard).parent();
		var listID = currentList.attr("id");
		var cardID;
		var cards;

		console.log(card_title + card_description + card_comment );

		var serverResponse;
		if(!editing){
			$.ajax({
				url: "http://localhost:3000/my_boards/"+ boardid + "/list/" + listID ,
				data: {
					"description": card_description,
					"title": card_title,
					"comment": card_comment
				},
				type: "POST",	 		
				dataType : "json" 	
			})
			.done(function(json){

				serverResponse = json;

				listID = findListIndex(listID);

				list_lists = serverResponse.lists;
				var num = list_lists[listID].cards.length - 1;
				cardID = list_lists[listID].cards[num]._id;
				
				var thiscard = list_lists[listID].cards[num]
				socket.emit('newcard', {for: 'everyone', thiscard });

				console.log(list_lists[listID].cards[num]);
				map[cardID] = {listIndex: listID, cardIndex: list_lists[listID].cards.length - 1};

				//create new element, fill in data
				var newLi = $("<li/>").addClass('card').attr('id',cardID).html(card_title);
				newLi.append(`<button data-cardid="${cardID}" class="del-btn">X</button>`);
				
				//get current list and insert
				var ul_cards = $(currentCard).siblings("ul.cards"); 
				ul_cards.append(newLi);
			});
		}else{
			var listIndex = map[currentCard.id].listIndex;

			$.ajax({
				url: "http://localhost:3000/my_boards/"+ boardid + 
						"/list/" + list_lists[listIndex]._id +
						"/card/" + currentCard.id,
				data: {
					"description": card_description,
					"title": card_title,
					"comment": card_comment
				},
				type: "PATCH",	 		
				dataType : "json" 	
			})
			.done(function(json){
				console.log(json);
				list_lists = json.lists;

			});
		}
		
		//reset form modal
		$("#modal").css("display","none");
		$(this)[0].reset();

	});

	// delete cards
	my_lists.on('click', '.del-btn', function(event) {
		event.stopPropagation();

		var currentButton = $(event.target);
		console.log(currentButton.parent());

    	var cardId = currentButton.parent().attr('id');
    	var listIndex = map[cardId].listIndex;
    	var cardIndex = map[cardId].cardIndex;

    	$.ajax({
    		url: ("http://localhost:3000/my_boards/" + boardid + 
    					"/list/"+ list_lists[listIndex]._id +
    					"/card/" + list_lists[listIndex].cards[cardIndex]._id),
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
			url: "http://localhost:3000/my_boards/" + boardid,
			data: {"title": list_title},
			type: "POST", 		
			dataType : "json" 		
		}).done(function( json ){
			console.log(json);
			list_lists = json.lists;
			
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
			url: "http://localhost:3000/my_boards/" + boardid + '/list/' + list_id,
			data: {},
			type: "DELETE", 		
			dataType : "json" 	
		});
		list_lists.splice(findListIndex(list_id), 1);
		currentCard.remove();

	});

	$('.dropdown-content li').on('click' , function(event){
		var newlabel = $("<li/>").addClass("member").attr('id', this.id);
		$('#labels ul').append(newlabel);
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
