// Underscore.js 1.2.3
// (c) 2009-2011 Jeremy Ashkenas, DocumentCloud Inc.
// Underscore is freely distributable under the MIT license.
// Portions of Underscore are inspired or borrowed from Prototype,
// Oliver Steele's Functional, and John Resig's Micro-Templating.
// For all details and documentation:
// http://documentcloud.github.com/underscore
(function(){function r(a,c,d){if(a===c)return a!==0||1/a==1/c;if(a==null||c==null)return a===c;if(a._chain)a=a._wrapped;if(c._chain)c=c._wrapped;if(a.isEqual&&b.isFunction(a.isEqual))return a.isEqual(c);if(c.isEqual&&b.isFunction(c.isEqual))return c.isEqual(a);var e=l.call(a);if(e!=l.call(c))return false;switch(e){case "[object String]":return a==String(c);case "[object Number]":return a!=+a?c!=+c:a==0?1/a==1/c:a==+c;case "[object Date]":case "[object Boolean]":return+a==+c;case "[object RegExp]":return a.source==
c.source&&a.global==c.global&&a.multiline==c.multiline&&a.ignoreCase==c.ignoreCase}if(typeof a!="object"||typeof c!="object")return false;for(var f=d.length;f--;)if(d[f]==a)return true;d.push(a);var f=0,g=true;if(e=="[object Array]"){if(f=a.length,g=f==c.length)for(;f--;)if(!(g=f in a==f in c&&r(a[f],c[f],d)))break}else{if("constructor"in a!="constructor"in c||a.constructor!=c.constructor)return false;for(var h in a)if(m.call(a,h)&&(f++,!(g=m.call(c,h)&&r(a[h],c[h],d))))break;if(g){for(h in c)if(m.call(c,
h)&&!f--)break;g=!f}}d.pop();return g}var s=this,F=s._,o={},k=Array.prototype,p=Object.prototype,i=k.slice,G=k.concat,H=k.unshift,l=p.toString,m=p.hasOwnProperty,v=k.forEach,w=k.map,x=k.reduce,y=k.reduceRight,z=k.filter,A=k.every,B=k.some,q=k.indexOf,C=k.lastIndexOf,p=Array.isArray,I=Object.keys,t=Function.prototype.bind,b=function(a){return new n(a)};if(typeof exports!=="undefined"){if(typeof module!=="undefined"&&module.exports)exports=module.exports=b;exports._=b}else typeof define==="function"&&
define.amd?define("underscore",function(){return b}):s._=b;b.VERSION="1.2.3";var j=b.each=b.forEach=function(a,c,b){if(a!=null)if(v&&a.forEach===v)a.forEach(c,b);else if(a.length===+a.length)for(var e=0,f=a.length;e<f;e++){if(e in a&&c.call(b,a[e],e,a)===o)break}else for(e in a)if(m.call(a,e)&&c.call(b,a[e],e,a)===o)break};b.map=function(a,c,b){var e=[];if(a==null)return e;if(w&&a.map===w)return a.map(c,b);j(a,function(a,g,h){e[e.length]=c.call(b,a,g,h)});return e};b.reduce=b.foldl=b.inject=function(a,
c,d,e){var f=arguments.length>2;a==null&&(a=[]);if(x&&a.reduce===x)return e&&(c=b.bind(c,e)),f?a.reduce(c,d):a.reduce(c);j(a,function(a,b,i){f?d=c.call(e,d,a,b,i):(d=a,f=true)});if(!f)throw new TypeError("Reduce of empty array with no initial value");return d};b.reduceRight=b.foldr=function(a,c,d,e){var f=arguments.length>2;a==null&&(a=[]);if(y&&a.reduceRight===y)return e&&(c=b.bind(c,e)),f?a.reduceRight(c,d):a.reduceRight(c);var g=b.toArray(a).reverse();e&&!f&&(c=b.bind(c,e));return f?b.reduce(g,
c,d,e):b.reduce(g,c)};b.find=b.detect=function(a,c,b){var e;D(a,function(a,g,h){if(c.call(b,a,g,h))return e=a,true});return e};b.filter=b.select=function(a,c,b){var e=[];if(a==null)return e;if(z&&a.filter===z)return a.filter(c,b);j(a,function(a,g,h){c.call(b,a,g,h)&&(e[e.length]=a)});return e};b.reject=function(a,c,b){var e=[];if(a==null)return e;j(a,function(a,g,h){c.call(b,a,g,h)||(e[e.length]=a)});return e};b.every=b.all=function(a,c,b){var e=true;if(a==null)return e;if(A&&a.every===A)return a.every(c,
b);j(a,function(a,g,h){if(!(e=e&&c.call(b,a,g,h)))return o});return e};var D=b.some=b.any=function(a,c,d){c||(c=b.identity);var e=false;if(a==null)return e;if(B&&a.some===B)return a.some(c,d);j(a,function(a,b,h){if(e||(e=c.call(d,a,b,h)))return o});return!!e};b.include=b.contains=function(a,c){var b=false;if(a==null)return b;return q&&a.indexOf===q?a.indexOf(c)!=-1:b=D(a,function(a){return a===c})};b.invoke=function(a,c){var d=i.call(arguments,2);return b.map(a,function(a){return(c.call?c||a:a[c]).apply(a,
d)})};b.pluck=function(a,c){return b.map(a,function(a){return a[c]})};b.max=function(a,c,d){if(!c&&b.isArray(a))return Math.max.apply(Math,a);if(!c&&b.isEmpty(a))return-Infinity;var e={computed:-Infinity};j(a,function(a,b,h){b=c?c.call(d,a,b,h):a;b>=e.computed&&(e={value:a,computed:b})});return e.value};b.min=function(a,c,d){if(!c&&b.isArray(a))return Math.min.apply(Math,a);if(!c&&b.isEmpty(a))return Infinity;var e={computed:Infinity};j(a,function(a,b,h){b=c?c.call(d,a,b,h):a;b<e.computed&&(e={value:a,
computed:b})});return e.value};b.shuffle=function(a){var c=[],b;j(a,function(a,f){f==0?c[0]=a:(b=Math.floor(Math.random()*(f+1)),c[f]=c[b],c[b]=a)});return c};b.sortBy=function(a,c,d){return b.pluck(b.map(a,function(a,b,g){return{value:a,criteria:c.call(d,a,b,g)}}).sort(function(a,c){var b=a.criteria,d=c.criteria;return b<d?-1:b>d?1:0}),"value")};b.groupBy=function(a,c){var d={},e=b.isFunction(c)?c:function(a){return a[c]};j(a,function(a,b){var c=e(a,b);(d[c]||(d[c]=[])).push(a)});return d};b.sortedIndex=
function(a,c,d){d||(d=b.identity);for(var e=0,f=a.length;e<f;){var g=e+f>>1;d(a[g])<d(c)?e=g+1:f=g}return e};b.toArray=function(a){return!a?[]:a.toArray?a.toArray():b.isArray(a)?i.call(a):b.isArguments(a)?i.call(a):b.values(a)};b.size=function(a){return b.toArray(a).length};b.first=b.head=function(a,b,d){return b!=null&&!d?i.call(a,0,b):a[0]};b.initial=function(a,b,d){return i.call(a,0,a.length-(b==null||d?1:b))};b.last=function(a,b,d){return b!=null&&!d?i.call(a,Math.max(a.length-b,0)):a[a.length-
1]};b.rest=b.tail=function(a,b,d){return i.call(a,b==null||d?1:b)};b.compact=function(a){return b.filter(a,function(a){return!!a})};b.flatten=function(a,c){return b.reduce(a,function(a,e){if(b.isArray(e))return a.concat(c?e:b.flatten(e));a[a.length]=e;return a},[])};b.without=function(a){return b.difference(a,i.call(arguments,1))};b.uniq=b.unique=function(a,c,d){var d=d?b.map(a,d):a,e=[];b.reduce(d,function(d,g,h){if(0==h||(c===true?b.last(d)!=g:!b.include(d,g)))d[d.length]=g,e[e.length]=a[h];return d},
[]);return e};b.union=function(){return b.uniq(b.flatten(arguments,true))};b.intersection=b.intersect=function(a){var c=i.call(arguments,1);return b.filter(b.uniq(a),function(a){return b.every(c,function(c){return b.indexOf(c,a)>=0})})};b.difference=function(a){var c=b.flatten(i.call(arguments,1));return b.filter(a,function(a){return!b.include(c,a)})};b.zip=function(){for(var a=i.call(arguments),c=b.max(b.pluck(a,"length")),d=Array(c),e=0;e<c;e++)d[e]=b.pluck(a,""+e);return d};b.indexOf=function(a,
c,d){if(a==null)return-1;var e;if(d)return d=b.sortedIndex(a,c),a[d]===c?d:-1;if(q&&a.indexOf===q)return a.indexOf(c);for(d=0,e=a.length;d<e;d++)if(d in a&&a[d]===c)return d;return-1};b.lastIndexOf=function(a,b){if(a==null)return-1;if(C&&a.lastIndexOf===C)return a.lastIndexOf(b);for(var d=a.length;d--;)if(d in a&&a[d]===b)return d;return-1};b.range=function(a,b,d){arguments.length<=1&&(b=a||0,a=0);for(var d=arguments[2]||1,e=Math.max(Math.ceil((b-a)/d),0),f=0,g=Array(e);f<e;)g[f++]=a,a+=d;return g};
var E=function(){};b.bind=function(a,c){var d,e;if(a.bind===t&&t)return t.apply(a,i.call(arguments,1));if(!b.isFunction(a))throw new TypeError;e=i.call(arguments,2);return d=function(){if(!(this instanceof d))return a.apply(c,e.concat(i.call(arguments)));E.prototype=a.prototype;var b=new E,g=a.apply(b,e.concat(i.call(arguments)));return Object(g)===g?g:b}};b.bindAll=function(a){var c=i.call(arguments,1);c.length==0&&(c=b.functions(a));j(c,function(c){a[c]=b.bind(a[c],a)});return a};b.memoize=function(a,
c){var d={};c||(c=b.identity);return function(){var b=c.apply(this,arguments);return m.call(d,b)?d[b]:d[b]=a.apply(this,arguments)}};b.delay=function(a,b){var d=i.call(arguments,2);return setTimeout(function(){return a.apply(a,d)},b)};b.defer=function(a){return b.delay.apply(b,[a,1].concat(i.call(arguments,1)))};b.throttle=function(a,c){var d,e,f,g,h,i=b.debounce(function(){h=g=false},c);return function(){d=this;e=arguments;var b;f||(f=setTimeout(function(){f=null;h&&a.apply(d,e);i()},c));g?h=true:
a.apply(d,e);i();g=true}};b.debounce=function(a,b){var d;return function(){var e=this,f=arguments;clearTimeout(d);d=setTimeout(function(){d=null;a.apply(e,f)},b)}};b.once=function(a){var b=false,d;return function(){if(b)return d;b=true;return d=a.apply(this,arguments)}};b.wrap=function(a,b){return function(){var d=G.apply([a],arguments);return b.apply(this,d)}};b.compose=function(){var a=arguments;return function(){for(var b=arguments,d=a.length-1;d>=0;d--)b=[a[d].apply(this,b)];return b[0]}};b.after=
function(a,b){return a<=0?b():function(){if(--a<1)return b.apply(this,arguments)}};b.keys=I||function(a){if(a!==Object(a))throw new TypeError("Invalid object");var b=[],d;for(d in a)m.call(a,d)&&(b[b.length]=d);return b};b.values=function(a){return b.map(a,b.identity)};b.functions=b.methods=function(a){var c=[],d;for(d in a)b.isFunction(a[d])&&c.push(d);return c.sort()};b.extend=function(a){j(i.call(arguments,1),function(b){for(var d in b)b[d]!==void 0&&(a[d]=b[d])});return a};b.defaults=function(a){j(i.call(arguments,
1),function(b){for(var d in b)a[d]==null&&(a[d]=b[d])});return a};b.clone=function(a){return!b.isObject(a)?a:b.isArray(a)?a.slice():b.extend({},a)};b.tap=function(a,b){b(a);return a};b.isEqual=function(a,b){return r(a,b,[])};b.isEmpty=function(a){if(b.isArray(a)||b.isString(a))return a.length===0;for(var c in a)if(m.call(a,c))return false;return true};b.isElement=function(a){return!!(a&&a.nodeType==1)};b.isArray=p||function(a){return l.call(a)=="[object Array]"};b.isObject=function(a){return a===
Object(a)};b.isArguments=function(a){return l.call(a)=="[object Arguments]"};if(!b.isArguments(arguments))b.isArguments=function(a){return!(!a||!m.call(a,"callee"))};b.isFunction=function(a){return l.call(a)=="[object Function]"};b.isString=function(a){return l.call(a)=="[object String]"};b.isNumber=function(a){return l.call(a)=="[object Number]"};b.isNaN=function(a){return a!==a};b.isBoolean=function(a){return a===true||a===false||l.call(a)=="[object Boolean]"};b.isDate=function(a){return l.call(a)==
"[object Date]"};b.isRegExp=function(a){return l.call(a)=="[object RegExp]"};b.isNull=function(a){return a===null};b.isUndefined=function(a){return a===void 0};b.noConflict=function(){s._=F;return this};b.identity=function(a){return a};b.times=function(a,b,d){for(var e=0;e<a;e++)b.call(d,e)};b.escape=function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;").replace(/\//g,"&#x2F;")};b.mixin=function(a){j(b.functions(a),function(c){J(c,
b[c]=a[c])})};var K=0;b.uniqueId=function(a){var b=K++;return a?a+b:b};b.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};b.template=function(a,c){var d=b.templateSettings,d="var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('"+a.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(d.escape,function(a,b){return"',_.escape("+b.replace(/\\'/g,"'")+"),'"}).replace(d.interpolate,function(a,b){return"',"+b.replace(/\\'/g,
"'")+",'"}).replace(d.evaluate||null,function(a,b){return"');"+b.replace(/\\'/g,"'").replace(/[\r\n\t]/g," ")+";__p.push('"}).replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/\t/g,"\\t")+"');}return __p.join('');",e=new Function("obj","_",d);return c?e(c,b):function(a){return e.call(this,a,b)}};var n=function(a){this._wrapped=a};b.prototype=n.prototype;var u=function(a,c){return c?b(a).chain():a},J=function(a,c){n.prototype[a]=function(){var a=i.call(arguments);H.call(a,this._wrapped);return u(c.apply(b,
a),this._chain)}};b.mixin(b);j("pop,push,reverse,shift,sort,splice,unshift".split(","),function(a){var b=k[a];n.prototype[a]=function(){b.apply(this._wrapped,arguments);return u(this._wrapped,this._chain)}});j(["concat","join","slice"],function(a){var b=k[a];n.prototype[a]=function(){return u(b.apply(this._wrapped,arguments),this._chain)}});n.prototype.chain=function(){this._chain=true;return this};n.prototype.value=function(){return this._wrapped}}).call(this);
/*
 * Mentions Input
 * Version 1.0.2
 * Written by: Kenneth Auchenberg (Podio)
 *
 * Using underscore.js
 *
 * License: MIT License - http://www.opensource.org/licenses/mit-license.php
 */

(function ($, _, undefined) {

    // Settings
    var KEY = { BACKSPACE : 8, TAB : 9, RETURN : 13, ESC : 27, LEFT : 37, UP : 38, RIGHT : 39, DOWN : 40, COMMA : 188, SPACE : 32, HOME : 36, END : 35 }; // Keys "enum"

    //Default settings
    var defaultSettings = {
        triggerChar   : '@', //Char that respond to event
        onDataRequest : $.noop, //Function where we can search the data
        minChars      : 2, //Minimum chars to fire the event
        allowRepeat   : false, //Allow repeat mentions
        showAvatars   : false, //Show the avatars
        elastic       : true, //Grow the textarea automatically
        defaultValue  : '',
        onCaret       : false,
        classes       : {
            autoCompleteItemActive : "active" //Classes to apply in each item
        },
        templates     : {
            wrapper                    : _.template('<div class="mentions-input-box"></div>'),
            autocompleteList           : _.template('<div class="mentions-autocomplete-list"></div>'),
            autocompleteListItem       : _.template('<li data-ref-id="<%= id %>" data-ref-username="<%= username %>" data-ref-type="<%= type %>" data-display="<%= display %>"><a target="_blank" href="/profile/<%= username %>" style="color:<%- colour %> !important"><%= content %></a></li>'),
            autocompleteListItemAvatar : _.template('<img src="<%= avatar %>" />'),
            autocompleteListItemIcon   : _.template('<div class="icon <%= icon %>"></div>'),
            mentionsOverlay            : _.template('<div class="mentions"><div></div></div>'),
            mentionItemSyntax          : _.template('@[<%= value %>](<%= type %>:<%= id %>)'),
            mentionItemHighlight       : _.template('<strong><span><%= value %></span></strong>')
        }
    };

    //Class util
    var utils = {
	    //Encodes the character with _.escape function (undersocre)
        htmlEncode       : function (str) {
            return _.escape(str);
        },
        //Encodes the character to be used with RegExp
        regexpEncode     : function (str) {
            return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        },
	    highlightTerm    : function (value, term) {
            if (!term && !term.length) {
                return value;
            }
            return value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<b>$1</b>");
        },
        //Sets the caret in a valid position
        setCaratPosition : function (domNode, caretPos) {
            console.log(domNode.createTextRange);
            if (domNode.createTextRange) {
                var range = domNode.createTextRange();
                range.move('character', caretPos);
                range.select();
            } else {
                if (domNode.selectionStart) {
                    domNode.focus();
                    domNode.setSelectionRange(caretPos, caretPos);
                } else {
                    domNode.focus();
                    placeCaretAtEnd(domNode);
                }
            }
        },
	    //Deletes the white spaces
        rtrim: function(string) {
            return string.replace(/\s+$/,"");
        }
    };
    function placeCaretAtEnd(el) {
        el.focus();
        if (typeof window.getSelection != "undefined"
            && typeof document.createRange != "undefined") {
            var range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (typeof document.body.createTextRange != "undefined") {
            var textRange = document.body.createTextRange();
            textRange.moveToElementText(el);
            textRange.collapse(false);
            textRange.select();
        }
    }
    //Main class of MentionsInput plugin
    var MentionsInput = function (settings) {

        var domInput,
            elmInputBox,
            elmInputWrapper,
            elmAutocompleteList,
            elmWrapperBox,
            elmMentionsOverlay,
            elmActiveAutoCompleteItem,
            mentionsCollection = [],
            autocompleteItemCollection = {},
            inputBuffer = [],
            currentDataQuery = '';

	    //Mix the default setting with the users settings
        settings = $.extend(true, {}, defaultSettings, settings );

	    //Initializes the text area target
        function initTextarea() {
            elmInputBox = $(domInput); //Get the text area target

            //If the text area is already configured, return
            if (elmInputBox.attr('data-mentions-input') === 'true') {
                return;
            }

            elmInputWrapper = elmInputBox.parent(); //Get the DOM element parent
            elmWrapperBox = $(settings.templates.wrapper());
            elmInputBox.wrapAll(elmWrapperBox); //Wrap all the text area into the div elmWrapperBox
            elmWrapperBox = elmInputWrapper.find('> div.mentions-input-box'); //Obtains the div elmWrapperBox that now contains the text area

            elmInputBox.attr('data-mentions-input', 'true'); //Sets the attribute data-mentions-input to true -> Defines if the text area is already configured
            elmInputBox.bind('keydown', onInputBoxKeyDown); //Bind the keydown event to the text area
            elmInputBox.bind('keypress', onInputBoxKeyPress); //Bind the keypress event to the text area
            elmInputBox.bind('click', onInputBoxClick); //Bind the click event to the text area
            elmInputBox.bind('blur', onInputBoxBlur); //Bind the blur event to the text area

            if (navigator.userAgent.indexOf("MSIE 8") > -1) {
                elmInputBox.bind('propertychange', onInputBoxInput); //IE8 won't fire the input event, so let's bind to the propertychange
            } else {
                elmInputBox.bind('input', onInputBoxInput); //Bind the input event to the text area
            }
        }

        //Initializes the autocomplete list, append to elmWrapperBox and delegate the mousedown event to li elements
        function initAutocomplete() {
            elmAutocompleteList = $(settings.templates.autocompleteList()); //Get the HTML code for the list
            elmAutocompleteList.appendTo(elmWrapperBox); //Append to elmWrapperBox element
            elmAutocompleteList.delegate('li', 'mousedown', onAutoCompleteItemClick); //Delegate the event
        }

        //Initializes the mentions' overlay
        function initMentionsOverlay() {
            elmMentionsOverlay = $(settings.templates.mentionsOverlay()); //Get the HTML code of the mentions' overlay
            elmMentionsOverlay.prependTo(elmWrapperBox); //Insert into elmWrapperBox the mentions overlay
        }

	    //Updates the values of the main variables
        function updateValues() {
            var syntaxMessage = getInputBoxValue(); //Get the actual value of the text area

            _.each(mentionsCollection, function (mention) {
                var textSyntax = settings.templates.mentionItemSyntax(mention);
                syntaxMessage = syntaxMessage.replace(new RegExp(utils.regexpEncode(mention.value), 'g'), textSyntax);
            });

            var mentionText = utils.htmlEncode(syntaxMessage); //Encode the syntaxMessage

            _.each(mentionsCollection, function (mention) {
                var formattedMention = _.extend({}, mention, {value: utils.htmlEncode(mention.value)});
                var textSyntax = settings.templates.mentionItemSyntax(formattedMention);
                var textHighlight = settings.templates.mentionItemHighlight(formattedMention);

                mentionText = mentionText.replace(new RegExp(utils.regexpEncode(textSyntax), 'g'), textHighlight);
            });

            mentionText = mentionText.replace(/\n/g, '<br />'); //Replace the escape character for <br />
            mentionText = mentionText.replace(/ {2}/g, '&nbsp; '); //Replace the 2 preceding token to &nbsp;

            elmInputBox.data('messageText', syntaxMessage); //Save the messageText to elmInputBox
	        elmInputBox.trigger('updated');
            elmMentionsOverlay.find('div').html(mentionText); //Insert into a div of the elmMentionsOverlay the mention text
        }

        //Cleans the buffer
        function resetBuffer() {
            inputBuffer = [];
        }

	    //Updates the mentions collection
        function updateMentionsCollection() {
            var inputText = getInputBoxValue(); //Get the actual value of text area

	        //Returns the values that doesn't match the condition
            mentionsCollection = _.reject(mentionsCollection, function (mention, index) {
                return !mention.value || inputText.indexOf(mention.value) == -1;
            });
            mentionsCollection = _.compact(mentionsCollection); //Delete all the falsy values of the array and return the new array
        }

	    //Adds mention to mentions collections
        function addMention(mention) {

            var currentMessage = getInputBoxValue(),
                caretStart = elmInputBox[0].selectionStart,
                shortestDistance = false,
                bestLastIndex = false;

            // Using a regex to figure out positions
            var regex = new RegExp("\\" + settings.triggerChar + currentDataQuery, "gi"),
                regexMatch;

            while(regexMatch = regex.exec(currentMessage)) {
                if (shortestDistance === false || Math.abs(regex.lastIndex - caretStart) < shortestDistance) {
                    shortestDistance = Math.abs(regex.lastIndex - caretStart);
                    bestLastIndex = regex.lastIndex;
                }
            }

            var startCaretPosition = bestLastIndex - currentDataQuery.length - 1; //Set the start caret position (right before the @)
            var currentCaretPosition = bestLastIndex; //Set the current caret position (right after the end of the "mention")


            var start = currentMessage.substr(0, startCaretPosition);
            var end = currentMessage.substr(currentCaretPosition, currentMessage.length);
            var startEndIndex = (start + mention.value).length + 1;

            // See if there's the same mention in the list
            if( !_.find(mentionsCollection, function (object) { return object.id == mention.id; }) ) {
                mentionsCollection.push(mention);//Add the mention to mentionsColletions
            }

            // Cleaning before inserting the value, otherwise auto-complete would be triggered with "old" inputbuffer
            resetBuffer();
            currentDataQuery = '';
            hideAutoComplete();

            // Mentions and syntax message
            var updatedMessageText = start + '<a target="_blank" href="/profile/' + mention.username + '" style="color:' + mention.colour + ' !important">' + mention.value + '</a> ' + end;
            elmInputBox.html(updatedMessageText); //Set the value to the txt area
	        elmInputBox.trigger('mention');
            updateValues();
            // Set correct focus and selection
            elmInputBox.focus();
            utils.setCaratPosition(elmInputBox[0], startEndIndex);
        }

        //Gets the actual value of the text area without white spaces from the beginning and end of the value
        function getInputBoxValue() {
            return $.trim(elmInputBox.html());
        }

        // This is taken straight from live (as of Sep 2012) GitHub code. The
        // technique is known around the web. Just google it. Github's is quite
        // succint though. NOTE: relies on selectionEnd, which as far as IE is concerned,
        // it'll only work on 9+. Good news is nothing will happen if the browser
        // doesn't support it.
        function textareaSelectionPosition($el) {
            var a, b, c, d, e, f, g, h, i, j, k;
            if (!(i = $el[0])) return;
            if (!$(i).is("textarea")) return;
            if (i.selectionEnd == null) return;
            g = {
                position: "absolute",
                overflow: "auto",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                boxSizing: "content-box",
                top: 0,
                left: -9999
              }, h = ["boxSizing", "fontFamily", "fontSize", "fontStyle", "fontVariant", "fontWeight", "height", "letterSpacing", "lineHeight", "paddingBottom", "paddingLeft", "paddingRight", "paddingTop", "textDecoration", "textIndent", "textTransform", "width", "word-spacing"];
            for (j = 0, k = h.length; j < k; j++) e = h[j], g[e] = $(i).css(e);
            return c = document.createElement("div"), $(c).css(g), $(i).after(c), b = document.createTextNode(i.value.substring(0, i.selectionEnd)), a = document.createTextNode(i.value.substring(i.selectionEnd)), d = document.createElement("span"), d.innerHTML = "&nbsp;", c.appendChild(b), c.appendChild(d), c.appendChild(a), c.scrollTop = i.scrollTop, f = $(d).position(), $(c).remove(), f
        }

        //same as above function but return offset instead of position
        function textareaSelectionOffset($el) {
            var a, b, c, d, e, f, g, h, i, j, k;
            if (!(i = $el[0])) return;
            if (!$(i).is("textarea")) return;
            if (i.selectionEnd == null) return;
            g = {
                position: "absolute",
                overflow: "auto",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                boxSizing: "content-box",
                top: 0,
                left: -9999
            }, h = ["boxSizing", "fontFamily", "fontSize", "fontStyle", "fontVariant", "fontWeight", "height", "letterSpacing", "lineHeight", "paddingBottom", "paddingLeft", "paddingRight", "paddingTop", "textDecoration", "textIndent", "textTransform", "width", "word-spacing"];
            for (j = 0, k = h.length; j < k; j++) e = h[j], g[e] = $(i).css(e);
            return c = document.createElement("div"), $(c).css(g), $(i).after(c), b = document.createTextNode(i.value.substring(0, i.selectionEnd)), a = document.createTextNode(i.value.substring(i.selectionEnd)), d = document.createElement("span"), d.innerHTML = "&nbsp;", c.appendChild(b), c.appendChild(d), c.appendChild(a), c.scrollTop = i.scrollTop, f = $(d).offset(), $(c).remove(), f
        }

        //Scrolls back to the input after autocomplete if the window has scrolled past the input
        function scrollToInput() {
            var elmDistanceFromTop = $(elmInputBox).offset().top; //input offset
            var bodyDistanceFromTop = $('body').offset().top; //body offset
            var distanceScrolled = $(window).scrollTop(); //distance scrolled

            if (distanceScrolled > elmDistanceFromTop) {
                //subtracts body distance to handle fixed headers
                $(window).scrollTop(elmDistanceFromTop - bodyDistanceFromTop);
              }
        }

        //Takes the click event when the user select a item of the dropdown
        function onAutoCompleteItemClick(e) {
            var elmTarget = $(this); //Get the item selected
            var mention = autocompleteItemCollection[elmTarget.attr('data-uid')]; //Obtains the mention
            addMention(mention);
            scrollToInput();
            return false;
        }

        //Takes the click event on text area
        function onInputBoxClick(e) {
            resetBuffer();
        }

        //Takes the blur event on text area
        function onInputBoxBlur(e) {
            hideAutoComplete();
        }

        //Takes the input event when users write or delete something
        function onInputBoxInput(e) {
            updateValues();
            updateMentionsCollection();
            var triggerCharIndex = _.lastIndexOf(inputBuffer, settings.triggerChar); //Returns the last match of the triggerChar in the inputBuffer
            if (triggerCharIndex > -1) { //If the triggerChar is present in the inputBuffer array
                currentDataQuery = inputBuffer.slice(triggerCharIndex + 1).join(''); //Gets the currentDataQuery
                currentDataQuery = utils.rtrim(currentDataQuery); //Deletes the whitespaces
                _.defer(_.bind(doSearch, this, currentDataQuery)); //Invoking the function doSearch ( Bind the function to this)
            }
        }

        //Takes the keypress event
        function onInputBoxKeyPress(e) {
            if(e.keyCode !== KEY.BACKSPACE) { //If the key pressed is not the backspace
                var typedValue = String.fromCharCode(e.which || e.keyCode); //Takes the string that represent this CharCode
                inputBuffer.push(typedValue); //Push the value pressed into inputBuffer
            }
        }

	    //Takes the keydown event
        function onInputBoxKeyDown(e) {

            // This also matches HOME/END on OSX which is CMD+LEFT, CMD+RIGHT
            if (e.keyCode === KEY.LEFT || e.keyCode === KEY.RIGHT || e.keyCode === KEY.HOME || e.keyCode === KEY.END) {
                // Defer execution to ensure carat pos has changed after HOME/END keys then call the resetBuffer function
                _.defer(resetBuffer);

                // IE9 doesn't fire the oninput event when backspace or delete is pressed. This causes the highlighting
                // to stay on the screen whenever backspace is pressed after a highlighed word. This is simply a hack
                // to force updateValues() to fire when backspace/delete is pressed in IE9.
                if (navigator.userAgent.indexOf("MSIE 9") > -1) {
                  _.defer(updateValues); //Call the updateValues function
                }

                return;
            }

            //If the key pressed was the backspace
            if (e.keyCode === KEY.BACKSPACE) {
                inputBuffer = inputBuffer.slice(0, -1 + inputBuffer.length); // Can't use splice, not available in IE
                return;
            }

            //If the elmAutocompleteList is hidden
            if (!elmAutocompleteList.is(':visible')) {
                return true;
            }

            switch (e.keyCode) {
                case KEY.UP: //If the key pressed was UP or DOWN
                case KEY.DOWN:
                    var elmCurrentAutoCompleteItem = null;
                    if (e.keyCode === KEY.DOWN) { //If the key pressed was DOWN
                        if (elmActiveAutoCompleteItem && elmActiveAutoCompleteItem.length) { //If elmActiveAutoCompleteItem exits
                            elmCurrentAutoCompleteItem = elmActiveAutoCompleteItem.next(); //Gets the next li element in the list
                        } else {
                            elmCurrentAutoCompleteItem = elmAutocompleteList.find('li').first(); //Gets the first li element found
                        }
                    } else {
                        elmCurrentAutoCompleteItem = $(elmActiveAutoCompleteItem).prev(); //The key pressed was UP and gets the previous li element
                    }
                    if (elmCurrentAutoCompleteItem.length) {
                        selectAutoCompleteItem(elmCurrentAutoCompleteItem);
                    }
                    return false;
                case KEY.RETURN: //If the key pressed was RETURN or TAB
                case KEY.TAB:
                    if (elmActiveAutoCompleteItem && elmActiveAutoCompleteItem.length) { //If the elmActiveAutoCompleteItem exists
                        elmActiveAutoCompleteItem.trigger('mousedown'); //Calls the mousedown event
                        return false;
                    }
                break;
            }

            return true;
        }

        //Hides the autoomplete
        function hideAutoComplete() {
            elmActiveAutoCompleteItem = null;
            elmAutocompleteList.empty().hide();
        }

        //Selects the item in the autocomplete list
        function selectAutoCompleteItem(elmItem) {
            elmItem.addClass(settings.classes.autoCompleteItemActive); //Add the class active to item
            elmItem.siblings().removeClass(settings.classes.autoCompleteItemActive); //Gets all li elements in autocomplete list and remove the class active

            elmActiveAutoCompleteItem = elmItem; //Sets the item to elmActiveAutoCompleteItem
        }

	    //Populates dropdown
        function populateDropdown(query, results) {
            elmAutocompleteList.show(); //Shows the autocomplete list

            if(!settings.allowRepeat) {
                // Filter items that has already been mentioned
                var mentionValues = _.pluck(mentionsCollection, 'value');
                results = _.reject(results, function (item) {
                    return _.include(mentionValues, item.name);
                });
            }

            if (!results.length) { //If there are not elements hide the autocomplete list
                hideAutoComplete();
                return;
            }

            elmAutocompleteList.empty(); //Remove all li elements in autocomplete list
            var elmDropDownList = $("<ul>").appendTo(elmAutocompleteList).hide(); //Inserts a ul element to autocomplete div and hide it

            _.each(results, function (item, index) {
                var itemUid = _.uniqueId('mention_'); //Gets the item with unique id

                autocompleteItemCollection[itemUid] = _.extend({}, item, {value: item.name}); //Inserts the new item to autocompleteItemCollection

                var elmListItem = $(settings.templates.autocompleteListItem({
                    'id'      : utils.htmlEncode(item.id),
                    'display' : utils.htmlEncode(item.name),
                    'username' : utils.htmlEncode(item.username),
                    'colour' : utils.htmlEncode(item.colour),
                    'type'    : utils.htmlEncode(item.type),
                    'content' : utils.highlightTerm(utils.htmlEncode((item.display ? item.display : item.name)), query)
                })).attr('data-uid', itemUid); //Inserts the new item to list

                //If the index is 0
                if (index === 0) {
                    selectAutoCompleteItem(elmListItem);
                }

                //If show avatars is true
                if (settings.showAvatars) {
                    var elmIcon;

                    //If the item has an avatar
                    if (item.avatar) {
                        elmIcon = $(settings.templates.autocompleteListItemAvatar({ avatar : item.avatar }));
                    } else { //If not then we set an default icon
                        elmIcon = $(settings.templates.autocompleteListItemIcon({ icon : item.icon }));
                    }
                    elmIcon.prependTo(elmListItem); //Inserts the elmIcon to elmListItem
                }
                elmListItem = elmListItem.appendTo(elmDropDownList); //Insets the elmListItem to elmDropDownList
            });

            elmAutocompleteList.show(); //Shows the elmAutocompleteList div
	        if (settings.onCaret) {
		        positionAutocomplete(elmAutocompleteList, elmInputBox);
            }
	        elmDropDownList.show(); //Shows the elmDropDownList
        }

        //Search into data list passed as parameter
        function doSearch(query) {
            //If the query is not null, undefined, empty and has the minimum chars
            if (query && query.length && query.length >= settings.minChars) {
                //Call the onDataRequest function and then call the populateDropDrown
                settings.onDataRequest.call(this, 'search', query, function (responseData) {
                    populateDropdown(query, responseData);
                });
            } else { //If the query is null, undefined, empty or has not the minimun chars
                hideAutoComplete(); //Hide the autocompletelist
            }
        }

	    function positionAutocomplete(elmAutocompleteList, elmInputBox) {
            var elmAutocompleteListPosition = elmAutocompleteList.css('position');
            if (elmAutocompleteListPosition == 'absolute') {
                var position = textareaSelectionPosition(elmInputBox),
                    lineHeight = parseInt(elmInputBox.css('line-height'), 10) || 18;
                elmAutocompleteList.css('width', '15em'); // Sort of a guess
                elmAutocompleteList.css('left', position.left);
                elmAutocompleteList.css('top', lineHeight + position.top);

                //check if the right position of auto complete is larger than the right position of the input
                //if yes, reset the left of auto complete list to make it fit the input
                var elmInputBoxRight = elmInputBox.offset().left + elmInputBox.width(),
                    elmAutocompleteListRight = elmAutocompleteList.offset().left + elmAutocompleteList.width();
                if (elmInputBoxRight <= elmAutocompleteListRight) {
                    elmAutocompleteList.css('left', Math.abs(elmAutocompleteList.position().left - (elmAutocompleteListRight - elmInputBoxRight)));
                }
            }
            else if (elmAutocompleteListPosition == 'fixed') {
                var offset = textareaSelectionOffset(elmInputBox),
                    lineHeight = parseInt(elmInputBox.css('line-height'), 10) || 18;
                elmAutocompleteList.css('width', '15em'); // Sort of a guess
                elmAutocompleteList.css('left', offset.left + 10000);
                elmAutocompleteList.css('top', lineHeight + offset.top);
            }
        }

        //Resets the text area
        function resetInput(currentVal) {
            mentionsCollection = [];
            var mentionText = utils.htmlEncode(currentVal);
            var regex = new RegExp("(" + settings.triggerChar + ")\\[(.*?)\\]\\((.*?):(.*?)\\)", "gi");
            var match, newMentionText = mentionText;
            while ((match = regex.exec(mentionText)) != null) {
                newMentionText = newMentionText.replace(match[0], match[1] + match[2]);
                mentionsCollection.push({ 'id': match[4], 'type': match[3], 'value': match[2], 'trigger': match[1] });
            }
            elmInputBox.val(newMentionText);
            updateValues();
        }
        // Public methods
        return {
            //Initializes the mentionsInput component on a specific element.
	        init : function (domTarget) {

                domInput = domTarget;

                initTextarea();
                initAutocomplete();
                initMentionsOverlay();
                resetInput(settings.defaultValue);

                //If the autocomplete list has prefill mentions
                if( settings.prefillMention ) {
                    addMention( settings.prefillMention );
                }
            },

	        //An async method which accepts a callback function and returns a value of the input field (including markup) as a first parameter of this function. This is the value you want to send to your server.
            val : function (callback) {
                if (!_.isFunction(callback)) {
                    return;
                }
                callback.call(this, mentionsCollection.length ? elmInputBox.data('messageText') : getInputBoxValue());
            },

        	//Resets the text area value and clears all mentions
            reset : function () {
                resetInput();
            },

            //Reinit with the text area value if it was changed programmatically
            reinit : function () {
                resetInput(false);
            },

	        //An async method which accepts a callback function and returns a collection of mentions as hash objects as a first parameter.
            getMentions : function (callback) {
                if (!_.isFunction(callback)) {
                    return;
                }
                callback.call(this, mentionsCollection);
            }
        };
    };

    //Main function to include into jQuery and initialize the plugin
    $.fn.mentionsInput = function (method, settings) {

        var outerArguments = arguments; //Gets the arguments
        //If method is not a function
        if (typeof method === 'object' || !method) {
            settings = method;
        }

        return this.each(function () {
            var instance = $.data(this, 'mentionsInput') || $.data(this, 'mentionsInput', new MentionsInput(settings));

            if (_.isFunction(instance[method])) {
                return instance[method].apply(this, Array.prototype.slice.call(outerArguments, 1));
            } else if (typeof method === 'object' || !method) {
                return instance.init.call(this, this);
            } else {
                $.error('Method ' + method + ' does not exist');
            }
        });
    };

})(jQuery, _);

