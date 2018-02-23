//Utilities and general IO

//Simple hash function, thanks to http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
String.prototype.hashCode = function(){
	var hash = 0;
	if (this.length == 0) return hash;
	for (var i = 0; i < this.length; i++) {
		var char = this.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
};

function blobToDataURL(blob, callback) {
  var a = new FileReader();
  a.onload = function(e) {callback(e.target.result);};
  a.readAsDataURL(blob);
}

function t(text) {
  return document.createTextNode(text);
}

function output(text) {
  $("#console-output").append(t(text));
}

function newline() {
  $("#console-output").append(document.createElement("br"));
}

function makeHeading(heading) {
  var obj = document.createElement("h1");
  $(obj).text(heading);
  return obj;
}