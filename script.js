projects = document.getElementById("projects");
dropdown = document.getElementById("dropdown");

//if on phone, requires click instead of mouse hover
if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	projects.onclick = function(){
		if (dropdown.style.display == "block"){
			window.location.href = this.getAttribute("href");
		} else {
			dropdown.style.display = "block";
		}
	}
} else {
	projects.onmouseover = function(){
		dropdown.style.display = "block";
	}

	projects.onmouseout = function(e){
		if (e.relatedTarget.parentNode != dropdown){
			dropdown.style.display = "none";
		}
	}

	dropdown.onmouseout = function(e){
		if (e.relatedTarget.parentNode != this && e.relatedTarget != this){
			this.style.display = "none";
		}
    }
}


//google analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');ga('create', 'UA-103594964-1', 'auto');ga('send', 'pageview');
