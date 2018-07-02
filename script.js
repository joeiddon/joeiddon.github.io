/*

*/

let projects       = document.getElementById('projects');
let dropdown       = document.getElementById('dropdown');
let main           = document.getElementById('main');
let main_container = document.getElementById('main_container');

//if on phone, dropdown menu buttons require click instead of mouse hover to show
if (/android|webos|iphone|ipad|ipod|blackberry/i.test(navigator.userAgent) ) {
    projects.onclick = function(){
        if (dropdown.style.display == 'block'){
            window.location.href = this.getAttribute('href');
        } else {
            dropdown.style.display = 'block';
        }
    }
} else {
    projects.onmouseover = function(){
        dropdown.style.display = 'block';
    }
    projects.onmouseout = dropdown.onmouseout = function(e){
        if (e.relatedTarget.className != 'nav_dropdown'){
            dropdown.style.display = 'none';
        }
    }
}

//resize any <iframe> elements to be the size of the main_container
let iframes = document.getElementsByTagName('iframe');
for (let i = 0; i < iframes.length; i++){
    iframes[i].width  = main_container.clientWidth;
    iframes[i].height = main_container.clientWidth/16*9;
}

//resize any <script> elements to be the size of the main_container
let scripts = document.getElementsByTagName('script');
for (let i = 0; i < scripts.length; i++){
    scripts[i].width  = main_container.clientWidth;
    scripts[i].height = main_container.clientWidth/16*9;
}


//google analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');ga('create', 'UA-103594964-1', 'auto');ga('send', 'pageview');
