

function logoutClicked(){
//add or modify.  Do a get request on /logout and have the callback
//                from the server redirect to /login.	
	$.ajax({
	    url: "/logout",
	    type: "GET",
	    success: function(data){
	        //TODO - redirect to /login
	        }
	                
	    }
	},
	dataType: "json"
	});

	return false;             
}


$(document).ready(function(){ 

//add or modify.  Do a get request on /userInfo to get user session data
//                about the currently logged in user.  Use that data to
//                modify the DOM to personalize the session.



//add or modify.  Call logoutClicked when logout button is pressed.

	$("#logout").click(logoutClicked);


});  		
    
