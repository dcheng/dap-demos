function get_random_color() {
    var back_letters = '0123456789ABCDEF'.split('');
    var front_letters = '456789ABC'.split('');
    var color = '#';
    for (var i = 0; i < 3; i++ ) {
        color += front_letters[Math.round(Math.random() * 9)];
    }
    for (i = 0; i < 3; i++ ) {
        color += back_letters[Math.round(Math.random() * 15)];
    }
    return color;
}

function changeTextColor(e){
	e.css('color',get_random_color());
}

function xmlDecode(value) {
   return value.replace(/&quot;/g, '"')
           .replace(/&gt;/g, '>')
           .replace(/&lt;/g, '<')
           .replace(/&amp;/g, '&');
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}