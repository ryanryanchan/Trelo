

$(function(){
	$('#fp_form').on('submit', function(e){

		e.preventDefault();

		var email = $("#fp_form input[name=email]").val();
		$.ajax({
			url: "http://localhost:3000/forgotpassword",
			data: {
				"email": email
			},
			type: "POST",
			error: function(){
				alert('user does not exist');
			},
			dataType : "json" 	
		}).done(function(json){
			console.log(json);
			window.location = '/passwordreset/' + json;
		});
	});
});