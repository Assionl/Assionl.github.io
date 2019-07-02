var score = document.getElementById("score");
var areaMap = document.getElementById("area");
//定义食物的位置
var foodX = 0;
var foodY = 0;
//为了灵活创建地图，将地图的行数和列数存储到变量中
var rowNumber = 24;
var colNumber = 16;
var cellWidth = 20;
areaMap.style.width = cellWidth * colNumber + "px";
areaMap.style.height = cellWidth * rowNumber + "px";
//二维数组 用来存储地图上所有位置的表格	为了获取div所在的位置 [[2,4],[3,6]]
var divSnake = [];
var rowArr;
for (var i = 0; i < rowNumber; i++) {
	//创建行所在的div
	var rowDiv = document.createElement("div");
	rowDiv.style.height = cellWidth + "px";
	areaMap.appendChild(rowDiv);
	//创建一个数组，用来存储每一行的所有表格
	rowArr = [];
	for (var j = 0; j < colNumber; j++) {
		//创建每行中的小方格div
		var cell = document.createElement("div");
		cell.className = "cell";
		cell.style.width = cellWidth + "px";
		cell.style.height = cellWidth + "px";
		rowDiv.appendChild(cell);
		//将该行的表格添加到该行数组中
		rowArr.push(cell);
	}
	//最后将行数组里的div全部添加到二维数组中
	divSnake.push(rowArr);
	// console.log(divSnake);
}

//创建数组，存储蛇身所占的div 默认第一行前三个是蛇身体
var snakeBodys = [];
for (var i = 0; i < 3; i++) {
	snakeBodys.push(divSnake[0][i]);
	// snakeBodys[i] = divSnake[0][i];
	// 设置蛇身的颜色
	// divSnake[0][i].addClass = "moveSnake";
	addClass(divSnake[0][i], "moveSnake");
}
//设置一个变量，用来存储蛇移动的方向
//假设 left right up down 分别代表四个方向
var direction = "right";
//添加键盘事件
document.onkeydown = function(event){
	event = event || window.event;
	//为了合理性，蛇头和蛇尾不能交换方向
	//当蛇向右移动时，不能点击向上按钮
	if (direction == "right" && event.keyCode == 37) {
		return;
	} else if (direction == "down" && event.keyCode == 38) {
		return;
	} else if (direction == "left" && event.keyCode == 39){
		return;
	} else if (direction == "up" && event.keyCode == 40) {
		return;
	}
	//点击不同按键，重新设置蛇移动的方向
	switch (event.keyCode) {
	case 37:
		//alert("向左");left值减小
		direction = "left";
		break;
	case 38:
		//alert("向上");
		direction = "up";
		break;
	case 39:
		//alert("向右");
		direction = "right";
		break;
	case 40:
		//alert("向下");
		direction = "down";
		break;
	}
	console.log(direction);
}

//存储蛇头所在的位置坐标 --默认第一行，第三列单元格
var x = 2;
var y = 0;

//处理蛇的移动
var scoreNum = 0;//存储得分
var timerMove = setInterval(function(){
	//判断蛇移动的方向，从而设置移动的位置
	switch (direction){
		case "left":{
			x--;
			break;
		}
		case "right":{
			x++;
			break;
		}
		case "up":{
			y--;
			break;
		}
		case "down":{
			y++;
			break;
		}
		default:
			break;
	}
	//为了合理性，判断碰到墙壁就GAMEOVER
	if (x<0 || y<0 || x>=colNumber || y>= rowNumber) {
		clearInterval(timerMove);
		alert("gameover");
		return;
	}
	//如果蛇即将移动的位置div，是蛇之前的身体所在的div，则游戏结束
	for (var i = 0;i<snakeBodys.length;i++) {
		//此时蛇身div和移动蛇头div对比，如果是同一个，则吃到身体
		if (snakeBodys[i]== divSnake[y][x]) {
			clearInterval(timerMove);
			alert("gameover");
			return;
		}
	}
	//设置蛇身长度移动的过程
	//如果蛇迟到食物，则蛇头和食物位置一致
	if ( foodX == x && foodY == y) {	//吃到食物
		//蛇头所在div的颜色
		addClass(divSnake[y][x],"moveSnake");
		removeClass(divSnake[y][x],"food");
		//蛇头所在的div添加到蛇身数组中
		snakeBodys.push(divSnake[y][x]);
		randomFoods();
		scoreNum++;
		score.innerHTML = scoreNum;
	} else{//没有吃到
		//设置蛇尾的颜色
		removeClass(snakeBodys[0],"moveSnake");
		//删除头部第一个div
		snakeBodys.shift();
		//蛇头所在的div颜色
		addClass(divSnake[y][x],"moveSnake");
		//蛇头所在的div添加到蛇身数组中
		snakeBodys.push(divSnake[y][x]);
	}
},200);

touch.on(document,"touchstart",function(event){
	event = event ||window.event;
	event.preventDefault();
})

//右轻扫
touch.on(document,"swiperight",function(event){
	event = event ||window.event;
	if (direction=="left") {
		return;
	}
	direction = "right";
})

touch.on(document,"swipeleft",function(event){
	event = event ||window.event;
	if (direction=="right") {
		return;
	}
	direction = "left";
})

touch.on(document,"swipeup",function(event){
	event = event ||window.event;
	if (direction=="down") {
		return;
	}
	direction = "up";
})
touch.on(document,"swipedown",function(event){
	event = event ||window.event;
	if (direction=="up") {
		return;
	}
	direction = "down";
})

//随机食物
function randomFoods(){
	foodX = randomNumber(0,colNumber-1);
	foodY = randomNumber(0,rowNumber-1);
	//设置食物的去重
	if (hasClass(divSnake[foodY][foodX],"moveSnake")) {
		randomFoods();	//重新随机食物位置
	} else{
		addClass(divSnake[foodY][foodX],"food");
	}
}
randomFoods();