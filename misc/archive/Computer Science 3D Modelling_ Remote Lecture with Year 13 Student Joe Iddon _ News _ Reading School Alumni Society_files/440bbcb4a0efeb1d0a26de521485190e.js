var ttLangStrings={};function initTTLang(){ttLangStrings=JSON.parse($('#tt_langStrings').html());return true;}
$(function(){initTTLang();});function _getTTLangString(key){var parts=key.split(':');var result=ttLangStrings,i;for(i=0;i<parts.length;++i){if(parts[i]!=undefined){if(result[parts[i]]!=undefined){result=result[parts[i]];}}}
if(result==undefined){console.log('Missing lang key: '+key);return key;}else{return result;}}
function lang(key,params){var str=_getTTLangString(key);if(!params||Object.keys(params).length===0){return str;}else{var template=Handlebars.compile(str);return template(params);}}
