$(document).ready(function() {

	browse_action_types = {
	    'ObjectID': 0,
	    'BrowseFlag': 'BrowseDirectChildren',
	    'Filter': '*',
	    'StartingIndex': 0,
	    'RequestedCount': 100000,
	    'SortCriteria': ''
    };

	$support = $('#supported');
	$devices = $('#devices');
	var found_services;

	function createSoapMessage(type, action, args) {
		type = type.replace('upnp:', '');
		var msg = 
		'<?xml version="1.0" encoding="utf-8"?>' +
		'<s:Envelope s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">' +
		'  <s:Body>' +
		'    <u:' + action + ' xmlns:u="' + type + '">\n';
		for (var arg in args) {
			msg += '<' + arg + '>' + args[arg] + '</' + arg + '>\n';
		}
		msg += 
		'    </u:' + action + '>' +
		'  </s:Body>' +
		'</s:Envelope>';
		return msg;
	}

	function showBrowse(xml, index){
		$xml=$(xml);
		$parent = $('#li-'+index);
		$container=$xml.find('container');
		$parent.append('<p></p>');
		console.log("size of result:" + $container.length);

		//Listing folders or "containers"
		$.each($container, function() {
			var obj_id =$(this).attr('id');
			//console.log("original:" + obj_id);
			var str = this.innerHTML;
			var $str = $(str); var $title=$str.get(0);
			$title = $($title).text();
			var a;
			if ((obj_id.indexOf("/")!=-1) || (obj_id.indexOf(" ") != -1) || (obj_id.indexOf(".") != -1)) {
				var clean_id= obj_id.split('/').join('_');
				clean_id= clean_id.split(' ').join('_');
				clean_id= clean_id.split('.').join('_');
				$parent.append('<div><a id=' + clean_id + '>  <img src="img/folder.jpeg" alt="Click to browse folder" class="img-rounded icon" />  ' + $title  + '</a></div>');
				a= document.getElementById(""+clean_id);
			}

			else { 
				$parent.append('<div><a id=' + obj_id + '>  - ' + $title  + '</a></div>');
				a = document.getElementById("" + obj_id);
			}
						 
			$(a).bind ('click', {id : obj_id }, function(event) {
				
				//console.log("real id: " + event.data.id);
				doBrowse(index, event.data.id);
			});
		});

		//Listing loose items
		$items=$xml.find('item');
		$.each($items, function() {
			var str = this.innerHTML;
			$str = $(str); var $title=$str.get(0);
			$title = $($title).text();
			var obj_id = $(this).attr('id');
			$parent.append('<div><a id=' + obj_id + '>  <img src="img/file.png" alt="Click to play" class="img-rounded icon" /> ' + $title  + '</a></div>');
			
		});
	}         

	function doBrowse(index, id){

		var xhr = new XMLHttpRequest();

		var type = found_services[index].type.replace('upnp:', '');
		var url = "" + found_services[index].url;
		var action="Browse";

		if ((id) && (id.length!==0)) {
			browse_action_types.ObjectID = id;			
		}

		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					console.log(xmlDecode(xhr.responseText));
					showBrowse(xmlDecode(xhr.responseText), index);					
				} else {
					console.log('error');
					console.error('XHR Status: ' + xhr.status + ': ' + xhr.statusText);
				}
			}
		};
		

		xhr.open('POST', url, true);
		xhr.setRequestHeader('Content-Type', 'text/xml; charset="utf-8"');
		xhr.setRequestHeader('SOAPAction', '"' + type + '#' + action + '"');
		if ((id) && (id.length!==0)) {
			console.log(createSoapMessage(type, action, browse_action_types));
		}
		xhr.send(createSoapMessage(type, action, browse_action_types));

	}

	function showServices(services) {
		found_services = services;
      // Show a list of all the services found on the Local network

      $('#status').text("The following devices offering Content Directories where found:");
      for(var i = 0; i< services.length; i++) {
      	console.log(services[i].url);
      	$config = $(services[i].config);
      	$name=$config.find('friendlyName');
      	$devices.append('<li><a id=li-' + i + '>'+ $name.text() + '<button class="browsers" id="browse-' + i +'">Browse</button></a></li>');
      	$button = $('#browse-'+i);

      	$button.bind('click', { index: i }, function(event) {
      		doBrowse(event.data.index, null);
      	}); 
      }
  }

  function error( e ) {
  	console.log( "Error occurred: " + e.code );
  }



	if(navigator.getNetworkServices) {
	  	$support.html("This Browser supports the Network Service Discovery API :-)") ;
	  	$('#status').text("Searching ...");
	         // Query Content Directory Services in the Local Network. CDS describe the content on the server and contain 
	         // information about each of its objects, it allows us to enumarate/search all objects regardless of their type.
	         navigator.getNetworkServices('upnp:urn:schemas-upnp-org:service:ContentDirectory:1', showServices, error);
	     }
    else {
     	$support.html("Network Service Discovery NOT supported. Buggers! >:( ");
    }


 }); 