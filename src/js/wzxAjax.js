var wzxAjax=function(opt){
	var opt1=opt||{};
	opt1.type=(opt.type||"GET").toUpperCase();
	opt1.dataType=opt.dataType||"json";
	var params=format(opt1.data);
	var xmrs;
	function format(data){
		var urlarr=[];
		for(var d in data){
			var addToUrl=encodeURIComponent(d)+"="+encodeURIComponent(data[d]);
			urlarr.push(addToUrl);
		}	
		urlarr.push(("v="+Math.random()).replace(".",""));
		return urlarr.join("&");
	}

	if (window.XMLHttpRequest) {
		xmrs=new XMLHttpRequest();
	}else{
		xmrs=new ActiveXObject('Microsoft.XMLHTTP');
	}

	xmrs.onreadystatechange=function(){
		if (xmrs.readyState==4&&xmrs.status==200){
			opt1.success&&opt1.success(xmrs.responseText);
			// console.log(JSON.stringify(JSON.parse(xmrs.responseText).items_ex1));
		}
	}

	if(opt1.type=="GET"){
		xmrs.open("GET",opt1.url+"?"+params,true);
		xmrs.send();
	}else if(opt1.type=="POST"){
		xmrs.open("POST",opt1.url,true);
		//必须带请求头,否则后台接收不到数据
		xmrs.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		console.log(params);
		console.log(decodeURIComponent(params));
		xmrs.send(params);
	}

}