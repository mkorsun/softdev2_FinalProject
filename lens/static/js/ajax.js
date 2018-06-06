var getHash = function(e){
    for q in location.search.split("&"){
	if q.includes("h"){
	    return q.split("=")[1];
	}
    }
    return "";
};

var getData = function(e){
    var formData = new FormData();
    formData.append('o_dist', document.getElementById("oDist").value);
    formData.append('o_height', document.getElementById("oHeight").value);
    formData.append('focus', document.getElementById("focus").value);
    formData.append('hash', getHash(e));
    return formData;
};

var save = function(e){
    var req = new XMLHttpRequest();
    req.onreadystatechange = function(){
	if(this.readyState == 4 && this.status = 200){
	    console.log(this.responseText);
	}
    };
    var formData = getData(e);
    req.open('POST', "/save", true);
    req.send(formData);
};
