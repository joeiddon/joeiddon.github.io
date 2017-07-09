nav_buttons = document.getElementsByClassName("nav_button");
for (var i=0;i<nav_buttons.length;i++){
	nav_buttons[i].onclick = function(){
		window.location.href=this.getAttribute("href");
	}
	nav_buttons[i].onmouseover = function(){
		this.style.backgroundColor = "#20B7BF";
		//this.style.color="#00979F";
	}
	nav_buttons[i].onmouseout = function(){
		this.style.backgroundColor = "";
		//this.style.color="";
	}
}

logo = document.getElementById("logo");
logo.onclick = function(){
	window.location.href=this.getAttribute("href");
}
logo.onmouseover = function(){
	this.style.backgroundColor = "#20B7BF";
	//this.style.color="#00979F";
	//document.getElementById("logo_img").src = "https://raw.githubusercontent.com/RoadKillCat/roadkillcat.github.io/master/images/logo_teal.png"
}
logo.onmouseout = function(){
	this.style.backgroundColor = "";
	//this.style.color="";
	//document.getElementById("logo_img").src = "https://raw.githubusercontent.com/RoadKillCat/roadkillcat.github.io/master/images/logo_white.png"
}