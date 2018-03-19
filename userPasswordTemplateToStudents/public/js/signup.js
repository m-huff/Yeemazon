function userClicked(){

	$.ajax({
	    url: "/signup",
	    data: {username:$("#username").val(),password:$("#password").val()}
	    type: "POST",
	    success: function(data){
	        if (!data)
	            $("#error").html("Insert a valid username and password to sign up");
	        else {

	        $("#error").html("");

	        //TODO - Say good sign up, then redirect to session
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
    

