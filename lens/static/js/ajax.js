var getData = function(e){
    var formData = new FormData();
    formData.append('username', username);
    formData.append('o_dist', oDist );
    formData.append('o_height', oHeight);
    formData.append('focus', focus);
    formData.append('hash', hash_id);
    formData.append('sign', sign);
    return formData;
};

var save = function(e){
    var req = new XMLHttpRequest();
    req.onreadystatechange = function(){
	if(this.readyState == 4 && this.status == 200){
	    console.log(this.responseText);
	}
    };
    var formData = getData(e);
    req.open('POST', "/save", true);
    req.send(formData);
};
