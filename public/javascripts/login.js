
$(function(){ 
	
	$('#login_form').on("submit", function(event){  
		event.preventDefault();
		var user = $("#login_form input[name=username]").val();
		var pw = $("#login_form input[name=password]").val();

		$.ajax({
			url: "http://localhost:3000/login",
			data: {
				"password": pw,
				"username": user
			},
			type: "POST",	 		
			dataType : "json" 	
		})
		.done(function(){
			window.location = "/board";
		})
		.fail(function(){
			 alert('login failed');
		});
	
	});

});