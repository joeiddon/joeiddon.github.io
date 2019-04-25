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

function rand_string(len){
    let str = '';
    for (let i = 0; i < len; i++)
        str += String.fromCharCode(Math.floor(97+Math.random()*26));
    return str;
}

function log_to_server(str){
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://joe.iddon.com');
    xhr.send(JSON.stringify({'type':'log_this','data':str}));
}

//joe's analytics :)
if (localStorage['name'] && localStorage['num_visits']) {
    log_to_server('Hi, its '+localStorage['name']+'. I have visited '+localStorage['num_visits']+' times before!');
    localStorage['num_visits'] = parseInt(localStorage['num_visits']) + 1; //converted back to a string
} else {
    let new_name = rand_string(4);
    log_to_server('This is my first time visiting! I am calling myself: '+new_name);
    localStorage['name'] = new_name;
    localStorage['num_visits'] = 0; //warning! converted to string immediately
}

log_to_server('--> '+window.location.href);

//google analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');ga('create', 'UA-103594964-1', 'auto');ga('send', 'pageview');
