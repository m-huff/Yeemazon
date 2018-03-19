     function success(data)
     {
     	if(data.message === "Error"){
            alert("Error");
            return;
        }
        else
            alert("completed");
        $("#index").val(data.item.index);
        $("#username").val(data.item.object);
        $("#color").val(data.item.color);
        $("#numRating").val(data.item.rating);
        $("#rating").val(data.item.rating);
        
     }

$(document).on('input', '#rating', function() {
    $('#numRating').val( $(this).val() );
 
});
$(document).on('input', '#numRating', function() {
    $('#rating').val( $(this).val() );
 
});

$(document).ready(function(){   
	
	$("#do").click(ondo);
	
});  		
function ondo()
{
    $.get("/getter", {index:$("#index").val()}, success)
}