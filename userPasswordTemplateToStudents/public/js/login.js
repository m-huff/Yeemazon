


//Send username and password to server, and write an error or redirect to the session page 		
function userClicked(){

	$.ajax({
	    url: "/login",
	    data: {username:$("#username").val(),password:$("#password").val()}
	    type: "POST",
	    success: function(data){
	        if (!data)
	            $("#error").html("Login credentials are invalid");
	        else {

	        $("#error").html("");
	               
	        //redirect to session
	        }
	                
	    }
	},
	dataType: "json"
	});    

    return false;
}


$(document).ready(function(){ 

	//If user hits enter while focus is on username field, call userClicked()
  	$("#username").keydown( function(event) {
		if ( event.which == 13 ) {
			userClicked();
			event.preventDefault();
			return false;
		}
	});

  	//If user hits enter while focus is on password field, call userClicked()
	$("#password").keydown( function(event) {
		if ( event.which == 13 ) {
			userClicked();
			event.preventDefault();
			return false;
		}
	});


});  		
    


