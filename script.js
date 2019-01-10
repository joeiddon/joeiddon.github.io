'use strict';

//if on phone
if (/android|webos|iphone|ipad|ipod|blackberry/i.test(navigator.userAgent) ) {
    //resize the top_bar and menu
    let menu = document.getElementById('menu');
    let top_bar = document.getElementById('top-bar');
    let main = document.getElementById('main');
    let es = document.getElementsByClassName('nav-but');
    let banner_height = es.length * es[0].clientHeight;
    top_bar.style.height = menu.style.height = main.style.top = banner_height;
    let mw = 0;
    for (let i = 0; i < es.length; i++){
        mw = Math.max(mw, es[i].clientWidth);
    }
    menu.style.width = mw;
} else {
    //...
}

/*
//resize any <canvas> elements to be the size of the main_container
let scripts = document.getElementsByTagName('script');
for (let i = 0; i < scripts.length; i++){
    scripts[i].width  = main_container.clientWidth;
    scripts[i].height = main_container.clientWidth/16*9;
}
*/

//joe's analytics :)
let xhr = new XMLHttpRequest();
xhr.open('POST', 'https://joe.iddon.com:8765');
xhr.send(window.location.href);

//google analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');ga('create', 'UA-103594964-1', 'auto');ga('send', 'pageview');
