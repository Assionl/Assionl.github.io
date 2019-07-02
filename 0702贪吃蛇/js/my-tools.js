//生成随机数
function randomNumber(a = 1, b = 10) {
	var min = Math.min(a, b);
	var max = Math.max(a, b);
	//console.log(min, max);
	if (isNaN(max) || isNaN(min)) {
		return; //类似break,结束本次函数的执行
	}
	return Math.floor(Math.random() * (max - min + 1) + min);
}

/* 
	定义个函数bind
	参数：
		obj：绑定事件的对象
		eventStr 事件的字符串(不要on)
		callback 回调函数
 */
function bind(obj, eventStr, callback) {
	if (obj.addEventListener) {
		//大部分浏览器兼容的模式
		obj.addEventListener(eventStr, callback, false);
	} else {
		/* 
			this是谁由调用方式决定
			callback.call(obj);
		 */
		//IE8以下
		obj.attachEvent("on" + eventStr, function() {
			//匿名函数中调用回调函数
			callback.call(obj);
		});
	}
}

//浏览器高度
function getClientHeight() {
	return window.innerHeight || document.documentElement.clientHeight;
}
//上滚动距离
function getScroolTop() {
	return document.documentElement.scrollTop;
}

//打乱顺序(洗牌)
//参数：打乱数组的名字
function randomArr(array) {
	array.sort(function(a, b) {
		return randomNumber(1, 10) - 5;
	})
}

function randomColor(obj) {
	var r = randomNumber(0, 255);
	var g = randomNumber(0, 255);
	var b = randomNumber(0, 255);
	var h = randomNumber(10, 200);
	obj.style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";
}

//定义一个函数,用来向一个元素中添加指定的class属性值
/* 
	参数：
		obj 要添加class属性的元素
		cn 要添加的class值
 */
function addClass(obj, cn) {
	//检查obj中是否含有cn
	if (!hasClass(obj, cn)) {
		obj.className += " " + cn;
	}
}

/* 
 *	判断一个元素中是否含有指定的class属性值
 *	如果有该class,则返回true,没有则返回false 
 */
function hasClass(obj, cn) {
	//var reg = /\bb2\b/;
	var reg = new RegExp("\\b" + cn + "\\b");
	return reg.test(obj.className);
}

//删除一个元素中指定的class属性
function removeClass(obj, cn) {
	var reg = new RegExp("\\b" + cn + "\\b");
	//删除class
	obj.className = obj.className.replace(reg, "")
}

/* 
	切换一个类
	如果元素中具有该类，则删除
	如果元素中没有该类，则添加
 */
function toggleClass(obj, cn) {
	if (hasClass(obj, cn)) {
		removeClass(obj, cn);
	} else {
		addClass(obj, cn);
	}
}

//获取指定元素距离页面最顶端的距离
function getOffectTop(obj) {
	// obj.offsetTop + obj.offsetParent.clientTop;
	var top = 0;
	while (true) {
		top += obj.offsetTop + obj.offsetParent.clientTop;
		//更新偏移父元素
		obj = obj.offsetParent;
		//body 的offsetParent为null
		if (obj.offsetParent == null) {
			break;
		}
	}
	return top;
};

// 以对象形式封装预加载................................
function loading(Obj) {
	//记录下载的个数
	var n = 0;
	//缓存所有图片
	Obj.imgArray.forEach(function(value, index) {
		//创建吐图片对象
		var imgObj = new Image();
		//指定地址开始缓存
		imgObj.src = value;
		//监听缓存过程
		imgObj.onload = function() {
			n++;
			//下载进度
			//progress.value = n / imgArray.length;
			var floatValue = n / Obj.imgArray.length;
			//函数回调的安全判断
			Obj.loadingCallback && Obj.loadingCallback(floatValue);

			//判断所有图片都下载完成
			if (n === Obj.imgArray.length) {
				//mask.style.display = "none";
				// successCallback();
				setTimeout(Obj.successCallback, 100)
			}
		};
	});
};

// 第三个参数单位是天， 几天后过期，给一个负数，就是删除它
function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toGMTString();
	document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i].trim();
		if (c.indexOf(name) == 0) return c.substring(name.length);
	}
	return "";
}

/* 
	提取专门用来拖拽的函数
	参数：obj 用来拖拽的元素
*/
function drag(obj) {
	obj.onmousedown = function(event) {
		if (obj.setCapture) {
			obj.setCapture();
		}
		var ol = event.clientX - obj.offsetLeft;
		var op = event.clientY - obj.offsetTop;
		document.onmousemove = function(event) {
			event = event || window.event;
			var left = event.clientX - ol;
			var top = event.clientY - op;
			obj.style.left = left + "px";
			obj.style.top = top + "px";
		};
		document.onmouseup = function() { //无论在哪都在document上
			document.onmousemove = null;
			document.onmouseup = null;
			if (obj.releaseCapture) {
				obj.releaseCapture();
			}

		};
		return false;
	};
};

//监听浏览器大小设置字体【移动端】
(function(doc, win) {
	var html = doc.getElementsByTagName("html")[0],
		// orientationchange->手机屏幕转屏事件
		// resize->页面大小改变事件(一边pc端有用)
		reEvt = "orientationchange" in win ? "orientationchange" : "resize",
		reFontSize = function() {
			var clientW = doc.documentElement.clientWidth || doc.body.clientWidth;
			//alert(clientW);
			if (!clientW) {
				return;
			}
			//假设在iphone6的375屏幕给html设置的字体大小是100px，通过比例计算其他屏幕的字体尺寸
			//f/320=100/375: 
			html.style.fontSize = 100 * (clientW / 375) + "px";
		}
	win.addEventListener(reEvt, reFontSize);
	// DOMContentLoaded->dom加载完就执行,onload要dom/css/js都加载完才执行
	doc.addEventListener("DOMContentLoaded", reFontSize);
})(document, window);
