nav_buttons = document.getElementsByClassName("nav_button");
for (var i=0;i<nav_buttons.length;i++){
	nav_buttons[i].onclick = function(){
		window.location.href=this.getAttribute("href");
	}
}

nav_dropdowns = document.getElementsByClassName("nav_dropdown");
for (var i=0;i<nav_dropdowns.length;i++){
	nav_dropdowns[i].onclick = function(){
		window.location.href=this.getAttribute("href");
	}
}

logo = document.getElementById("logo");
logo.onclick = function(){
	window.location.href=this.getAttribute("href");
}
logo_links = document.getElementsByClassName("logo_link");
for (var i=0;i<logo_links.length;i++){
	logo_links[i].onclick = function(){
		window.location.href=this.getAttribute("href");
	}
}

projects = document.getElementById("projects")
dropdown = document.getElementById("dropdown")

if(!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	projects.onmouseover = function(){
		dropdown.style.display = "block"
	}

	projects.onmouseout = function(e){
		if (e.relatedTarget.parentNode != dropdown){
			dropdown.style.display = "none"
		}
	}

	dropdown.onmouseout = function(e){
		if (e.relatedTarget.parentNode != this && e.relatedTarget != this){
			this.style.display = "none"
		}
	}
} else {
	projets.onclick = function(){
		if (dropdown.style.display="block"){
			window.location.href = this.getAttribute("href")
		else {
			dropdown.style.display = "block"
		}
	}
}
