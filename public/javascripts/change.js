$(function(){
	$('#pwchange').on('submit', function(e){


		e.preventDefault();
		console.log(code);
		var p1 = $("#pwchange input[name=p1]").val();
		var p2 = $("#pwchange input[name=p2]").val();

		if (p1 !== p2){
			e.preventDefault();
			alert('Passwords do not match');
		}else{
			$.ajax({
				url: "http://localhost:3000/users/" + code,
				data: {
					password: p1
				},
				type: "PATCH",
				dataType : "json" 	
			}).done(function(json){
				alert('password changed!');
			});
		}
		
	});
});