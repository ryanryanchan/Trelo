var password1 = document.querySelector('#password')
var password2 = document.querySelector('#password2')
var register_btn = document.querySelector('#register_btn')
var register_form = document.querySelector('#registration_form')

$(function(){
	registration_form.addEventListener('submit', function(e){
		if (password2.value !== password1.value){
			e.preventDefault();
			alert('Passwords do not match');
		}
		else{
			e.preventDefault();
			var username = $("#registration_form input[name=username]").val();
			var email = $("#registration_form input[name=email]").val();
			var password = $("#registration_form input[name=password]").val();

			$.ajax({
				url: "http://localhost:3000/users",
				data: {
					"username": username,
					"email": email,
					"password": password
				},
				type: "POST",	 		
				dataType : "json" 	
			})
			.done(function(json){
				serverResponse = json;
				window.location = "/login";
			});
		}
	});
});