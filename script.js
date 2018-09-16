/*

*/

let projects       = document.getElementById('projects');
let dropdown       = document.getElementById('dropdown');
let main           = document.getElementById('main');
let main_container = document.getElementById('main_container');

//if on phone
if (/android|webos|iphone|ipad|ipod|blackberry/i.test(navigator.userAgent) ) {
} else {
}

/*
//resize any <canvas> elements to be the size of the main_container
let scripts = document.getElementsByTagName('script');
for (let i = 0; i < scripts.length; i++){
    scripts[i].width  = main_container.clientWidth;
    scripts[i].height = main_container.clientWidth/16*9;
}
*/


//google analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');ga('create', 'UA-103594964-1', 'auto');ga('send', 'pageview');
