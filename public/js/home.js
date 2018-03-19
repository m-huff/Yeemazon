
     function success(data)
     {
     	if(data.message==="Error")
     	{
     		alert("Error");
     		return;
     	}
        else
     	  alert("Completed");
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
    $.post("/change", {item:{index:$("#index").val(), object:$("#username").val(), color:$("#color").val(), rating:$("#rating").val()}}, success);
  }