$(document).ready(function() {
  var query = window.location.search;
  if ((query) && (query.length!==0)) {
    query = query.replace("?auth=","");
  }
 
  //populate with the latests Flickr images...
  if (!localStorage.getItem('authenticated')) {

    if ((!query) || (query.length===0)) {   
        console.log("requesting Flickr auth...");
        $.ajax({
  		     url: 'http://62.105.171.205:8082/request'
		    }).done(function(data) {});
      }
    else {
      console.log("saving authenticated");
      localStorage.setItem('authenticated', 'true');
    }
  } 
   
  else {
     console.log("api!!!");
      $.ajax({
           url: 'http://62.105.171.205:8082/api', 
           dataType: 'jsonp', 
           success: function (data) {
              for (i=0; i<data.length; i++) {
                 $('#flickrContainer').append('<img src="'+data[i].url+'" alt="'+ data[i].title+ '" class="flickr" />');
              }
           }
      });
  }
        
});