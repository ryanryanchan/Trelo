var password = document.querySelector('#password')
var password2 = document.querySelector('#password2')
var register_btn = document.querySelector('#register_btn')
var register_form = document.querySelector('#registration_form')

registration_form.addEventListener('submit', function(e){
	if (password2.value !== password.value){
		e.preventDefault();
		alert('Passwords do not match');
	}
});