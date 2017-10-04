
var imgCompileArr, 
	deleteBtn, 
	imgItem,
	viewPic,
	picFrame,
	column,
	header,
	content,
	footer;

window.onload = function () {
	if(window.orientation==90||window.orientation==-90){
		column = 4;
	}else {	
		column = 3;	
	}
	imgCompileArr = [];
	viewPic = document.getElementsByClassName('view-pic')[0];
	picFrame = viewPic.getElementsByClassName('pic-frame')[0];
	deleteBtn = document.getElementsByClassName('delete')[0];	
	header = document.getElementsByClassName('header')[0];
	content = document.getElementsByClassName('content')[0];
	footer = document.getElementsByClassName('footer')[0];
	rem = document.body.clientWidth/column;
	document.getElementsByTagName('html')[0].style.fontSize = rem + 'px';
	document.getElementsByClassName('delete')[0].style.display = 'none';
/***/ReadImgUrl();
	imgItem = document.getElementsByClassName('img-item-1');

	resetBodyHeight();

	viewPic.addEventListener('click',function(){
		this.style.display = 'none'; 
	});

	document.getElementsByClassName('select')[0].addEventListener('click',onCompile);
	deleteBtn.addEventListener('click',deleteImg);
	// toggleImgClick('bind');
}

var onCompile = function () {	
	if (this.style.backgroundColor!=='lightblue') {			
		this.style.backgroundColor = 'lightblue';
		toggleImgClick();
		imgCompileArr.length = 0;
		Array.prototype.forEach.call(imgItem,function(el,i) {
			el.index = i;
			el.addEventListener('click',selectImg);
		});
	} else {
		this.style.backgroundColor = '';
		toggleImgClick('bind');
		imgCompileArr.length = 0;
		Array.prototype.forEach.call(imgItem,function(el) {
			el.style.opacity = '1';
			el.removeEventListener('click',selectImg);
			deleteBtn.style.display = 'none';
		});
	}
}

var selectImg = function () {
	if (this.style.opacity === '1'||this.style.opacity === '') {
		this.style.opacity = '0.5';
		imgCompileArr.push(this);		
		deleteBtn.style.display = '';
	} else {
		this.style.opacity = '1';
		imgCompileArr.splice(imgCompileArr.indexOf(this),1);
		if (imgCompileArr.length === 0)
			deleteBtn.style.display = 'none';
	}
}

var deleteImg = function () {
	for (var i in imgCompileArr) {
		var imgURL = imgCompileArr[i].children[0].src.replace(/http\:\/\/[a-zA-Z0-9\.]*\:[0-9]{1,}\//,'');
		
		deleteImgInServer(imgURL);
		imgCompileArr[i].parentNode.removeChild(imgCompileArr[i]);	
	}
	document.getElementsByClassName('select')[0].click();
	refresh();
}

var refresh = function () {
	Array.prototype.forEach.call(imgItem,function(el,i) {
		el.style.transform = `translate3d(${i%column}rem,${Math.floor(i/column)}rem,0)`;
	});	
	resetBodyHeight();
}

//传输图片到服务器,采用base64编码
var deliverImgToServer = function (imgFile) {
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
	var img = new Image();
	img.src = window.URL.createObjectURL(imgFile);
	img.onload = function () {
		canvas.width = img.width;
		canvas.height = img.height;
		ctx.drawImage(img, 0, 0);
		var base64 = canvas.toDataURL();
		var opt = {
			url:'/addImg',
			type:'post',
			dataType:'json',
			data:{img:base64}
		}
		wzxAjax(opt);
	}
}

//请求服务器删除图片
var deleteImgInServer = function (imgURL) {
	var opt = {
		url:'/deleteImg',
		type:'post',
		dataType:'json',
		data:{imgURL:imgURL}
	}
	wzxAjax(opt);
}

var addImg = function (newImg) {
	var json = [];
	var nodeList = document.createDocumentFragment();
	for (var i = newImg.files.length - 1, len = imgItem.length; i >= 0; i--,len++) {
		var newImgNode = document.createElement('div');
		newImgNode.className = 'img-item-1'; 
		json.push({"src":window.URL.createObjectURL(newImg.files[i])});
		newImgNode.innerHTML = `<img src='${window.URL.createObjectURL(newImg.files[i])}' alt=''/>`
		nodeList.appendChild(newImgNode);
		newImgNode.style.transform = `translate3d(${len%column}rem,${Math.floor(len/column)}rem,0)`;
		deliverImgToServer(newImg.files[i]);
	}	
	
	document.getElementsByClassName('content')[0].appendChild(nodeList);

	toggleImgClick('bind');
	//重新渲染,刷新input节点,刷新onchange
	newImg.parentNode.innerHTML += '';
	resetBodyHeight();
}

var defaultImgClick = function () {
	var img = this.getElementsByTagName('img')[0];
	picFrame.innerHTML = `<img src='${img.src}'/>`;
	viewPic.style.display = 'flex';

	//阻止冒泡事件,点击图片时不会退出
	picFrame.addEventListener('click',function(e){
		e = e || window.event;
		e.stopPropagation();
	});
}


var toggleImgClick = function (command) {
	if(command === 'bind') {
		Array.prototype.forEach.call(imgItem,function (el) {
			el.addEventListener('click',defaultImgClick);
		});		
	} else {
		Array.prototype.forEach.call(imgItem,function (el) {
			el.removeEventListener('click',defaultImgClick);
		});	
	}
}

var resetBodyHeight = function () {
	setTimeout(function(){
		document.body.style.height = header.scrollHeight + Math.ceil(imgItem.length/column)*rem + footer.scrollHeight + 'px';
	},400)
}

var ReadImgUrl = function () {
	var opt = {
		url:'/getImgUrl',
		type:'get',
		dataType:'json',
		data:{},
		success:function (data) {			
			var html = '';
			var list = JSON.parse(data);
			for (var i = 0; i < list.length; i++) {
				// j = i % 4 + 1;//left:${i%3}rem;top:${Math.floor(i/3)}rem
				// html += `<img src="imgs/${j}.jpg" alt="hhh" class="img-item-1" style="left:${i%3}rem;top:${Math.floor(i/3)}rem">`;
				html += `<div class="img-item-1" style="transform:translate3d(${i%column}rem,${Math.floor(i/column)}rem,0)">
							<img src=${list[i].src} alt="">
						</div>
						`;
			}	
			document.getElementsByClassName('content')[0].innerHTML = html;
			toggleImgClick('bind');
		}
	};
	wzxAjax(opt);
}