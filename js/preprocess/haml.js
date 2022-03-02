var Haml;!function(){function html_escape(e){return(e+"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;")}function render_attribs(e){var t,n,s=[];for(t in e)if("?"!=t[t.length-1]){if("_content"!==t&&e.hasOwnProperty(t))switch(e[t]){case"undefined":case"false":case"null":case'""':break;default:try{n=JSON.parse("["+e[t]+"]")[0],n=n===!0?t:"string"==typeof n&&embedder.test(n)?'" +\n'+parse_interpol(html_escape(n))+' +\n"':html_escape(n),s.push(" "+t+'=\\"'+n+'\\"')}catch(r){s.push(" "+t+'=\\"" + '+escaperName+"("+e[t]+') + "\\"')}}}else n=escaperName+"("+e[t]+")",s.push('" + ('+e[t]+' ? " '+t.replace("?","")+'=\\"" + '+n+' + "\\"" : "") + "');return s.join("")}function parse_attribs(e){function t(){if("number"==typeof m.start&&"number"==typeof m.middle&&"number"==typeof m.end){var t=e.substr(m.start,m.middle-m.start).trim(),n=e.substr(m.middle+1,m.end-m.middle-1).trim();o[t]=n}m={start:null,middle:null,end:null}}var n,s,r,i,c,a,o={},l=e.length,u=1,h=!1,p=!1,m={start:1,middle:null,end:null};if(!(l>0)||"{"!==e.charAt(0)&&"("!==e.charAt(0))return{_content:" "===e[0]?e.substr(1,l):e};for(r=e.charAt(0),i="{"===r?"}":")",c="{"===r?":":"=",a="{"===r?",":" ",n=1;u>0;n+=1){if(n>l)throw"Malformed attribute block";s=e.charAt(n),p?p=!1:h?("\\"===s&&(p=!0),s===h&&(h=!1)):(('"'===s||"'"===s)&&(h=s),1===u&&(s===c&&(m.middle=n),(s===a||s===i)&&(m.end=n,t(),s===a&&(m.start=n+1))),(s===r||"("===s)&&(u+=1),(s===i||u>1&&")"===s)&&(u-=1))}return o._content=e.substr(n,e.length),o}function parse_interpol(e){for(var t,n=[],s=0,r=0;;){if(r=e.substr(s).search(embedder),0>r){s<e.length&&n.push(JSON.stringify(e.substr(s)));break}if(n.push(JSON.stringify(e.substr(s,r))),s+=r,t=e.substr(s).match(embedder),r=t[0].length,0>r)break;"#"===t[1]?n.push(escaperName+"("+(t[2]||t[3])+")"):n.push(t[2]||t[3]),s+=r}return n.filter(function(e){return e&&e.length>0}).join(" +\n")}function compile(e){var t=!1,n=[],s=[];"string"==typeof e&&(e=e.trim().replace(/\n\r|\r/g,"\n").split("\n")),e.forEach(function(e){var r,i=!1;if(t){if(r=t.check_indent.exec(e))return void t.contents.push(r[1]||"");n.push(t.process()),t=!1}matchers.forEach(function(n){i||(r=n.regexp.exec(e),r&&(t={contents:[],indent_level:r[1],matches:r,check_indent:new RegExp("^(?:\\s*|"+r[1]+"  (.*))$"),process:n.process,getIfConditions:function(){return s},pushIfCondition:function(e){s.push(e)},popIfCondition:function(){return s.pop()},render_contents:function(){return compile(this.contents)}},i=!0))}),i||n.push(function(){function t(){try{return escaperName+"("+JSON.stringify(JSON.parse(e))+")"}catch(t){return escaperName+"("+e+")"}}function n(){try{return parse_interpol(JSON.parse(e))}catch(t){return e}}return"\\"===e[0]?parse_interpol(e.substr(1,e.length)):"&="===e.substr(0,2)?(e=e.substr(2,e.length).trim(),t()):"!="===e.substr(0,2)?(e=e.substr(2,e.length).trim(),n()):"="===e[0]?(e=e.substr(1,e.length).trim(),escapeHtmlByDefault?t():n()):parse_interpol(e)}())}),t&&n.push(t.process());var r=n.filter(function(e){return e&&e.length>0}).join(" +\n");return 0==r.length&&(r='""'),r}function optimize(e){function t(){i.length>0&&(r.push(JSON.stringify(i.join(""))+s),i=[])}var n,s,r=[],i=[];return e.replace(/\n\r|\r/g,"\n").split("\n").forEach(function(e){if(n=e.match(/^(\".*\")(\s*\+\s*)?$/),!n)return t(),void r.push(e);s=n[2]||"",n=n[1];try{i.push(JSON.parse(n))}catch(c){t(),r.push(e)}}),t(),r.join("\n")}function render(e,t){t=t||{},e=e||"";var n=compile(e,t);return t.optimize&&(n=Haml.optimize(n)),execute(n,t.context||Haml,t.locals)}function execute(js,self,locals){return function(){with(locals||{})try{var _$output;return eval("_$output ="+js),_$output}catch(e){return"\n<pre class='error'>"+html_escape(e+"\n"+e.stack)+"</pre>\n"}}.call(self)}var matchers,self_close_tags,embedder,forceXML,escaperName="html_escape",escapeHtmlByDefault;embedder=/([#!])\{([^}]*)\}/,self_close_tags=["meta","img","link","br","hr","input","area","base"],matchers=[{name:"html tags",regexp:/^(\s*)((?:[.#%][a-z_\-][a-z0-9_:\-]*)+)(.*)$/i,process:function(){var e,t,n,s,r,i,c,a={};if(e=this.matches[2],n=e.match(/\.([a-z_\-][a-z0-9_\-]*)/gi),s=e.match(/\#([a-z_\-][a-z0-9_\-]*)/gi),t=e.match(/\%([a-z_\-][a-z0-9_:\-]*)/gi),t=t?t[0].substr(1,t[0].length):"div",r=this.matches[3]){if(r=parse_attribs(r),r._content){var o=r._content.charAt(0),l=r._content.charAt(1),u=0;"<"==o?(u++,a.inside=!0,">"==l&&(u++,a.around=!0)):">"==o&&(u++,a.around=!0,"<"==l&&(u++,a.inside=!0)),r._content=r._content.substr(u),this.contents.unshift(r._content.trim()),delete r._content}}else r={};if(n)if(n=n.map(function(e){return e.substr(1,e.length)}).join(" "),r["class"])try{r["class"]=JSON.stringify(n+" "+JSON.parse(r["class"]))}catch(h){r["class"]=JSON.stringify(n+" ")+" + "+r["class"]}else r["class"]=JSON.stringify(n);if(s&&(s=s.map(function(e){return e.substr(1,e.length)}).join(" "),r.id?r.id=JSON.stringify(s+" ")+r.id:r.id=JSON.stringify(s)),r=render_attribs(r),i=this.render_contents(),'""'===i&&(i=""),a.inside)if(0==i.length)i='"  "';else try{i='" '+JSON.parse(i)+' "'}catch(h){i='" "+\n'+i+'+\n" "'}return c=(forceXML?i.length>0:-1==self_close_tags.indexOf(t))?'"<'+t+r+'>"'+(i.length>0?" + \n"+i:"")+' + \n"</'+t+'>"':'"<'+t+r+' />"',a.around&&(c='" '+c.substr(1,c.length-2)+' "'),c}},{name:"each loop",regexp:/^(\s*)(?::for|:each)\s+(?:([a-z_][a-z_\-]*),\s*)?([a-z_][a-z_\-]*)\s+in\s+(.*)(\s*)$/i,process:function(){var e=this.matches[2]||"__key__",t=this.matches[3],n=this.matches[4],s="__result__";return this.matches[5]&&this.contents.unshift(this.matches[5]),"(function () { var "+s+" = [], "+e+", "+t+"; for ("+e+" in "+n+") { if ("+n+".hasOwnProperty("+e+")) { "+t+" = "+n+"["+e+"]; "+s+".push(\n"+(this.render_contents()||"''")+"\n); } } return "+s+'.join(""); }).call(this)'}},{name:"if",regexp:/^(\s*):if\s+(.*)\s*$/i,process:function(){var e=this.matches[2];return this.pushIfCondition([e]),"(function () { if ("+e+") { return (\n"+(this.render_contents()||"")+'\n);} else { return ""; } }).call(this)'}},{name:"else if",regexp:/^(\s*):else if\s+(.*)\s*$/i,process:function(){for(var e,t=this.matches[2],n=this.getIfConditions()[this.getIfConditions().length-1],s=[],r=0,i=n.length;i>r;r++)s.push("! ("+n[r]+")");return n.push(t),s.push(t),e="if ("+s.join(" && ")+") { ","(function () { "+e+"return (\n"+(this.render_contents()||"")+'\n);} else { return ""; } }).call(this)'}},{name:"else",regexp:/^(\s*):else\s*$/i,process:function(){for(var e,t=this.popIfCondition(),n=[],s=0,r=t.length;r>s;s++)n.push("! ("+t[s]+")");return e="if ("+n.join(" && ")+") { ","(function () { "+e+"return (\n"+(this.render_contents()||"")+'\n);} else { return ""; } }).call(this)'}},{name:"silent-comments",regexp:/^(\s*)-#\s*(.*)\s*$/i,process:function(){return'""'}},{name:"silent-comments",regexp:/^(\s*)\/\s*(.*)\s*$/i,process:function(){return this.contents.unshift(this.matches[2]),'"<!--'+this.contents.join("\\n").replace(/\"/g,'\\"')+'-->"'}},{name:"rawjs",regexp:/^(\s*)-\s*(.*)\s*$/i,process:function(){return this.contents.unshift(this.matches[2]),'"";'+this.contents.join("\n")+"; _$output = _$output "}},{name:"pre",regexp:/^(\s*):pre(\s+(.*)|$)/i,process:function(){return this.contents.unshift(this.matches[2]),'"<pre>"+\n'+JSON.stringify(this.contents.join("\n"))+'+\n"</pre>"'}},{name:"doctype",regexp:/^()!!!(?:\s*(.*))\s*$/,process:function(){var e="";switch((this.matches[2]||"").toLowerCase()){case"":e='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';break;case"strict":case"1.0":e='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">';break;case"frameset":e='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">';break;case"5":e="<!DOCTYPE html>";break;case"1.1":e='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">';break;case"basic":e='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd">';break;case"mobile":e='<!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.2//EN" "http://www.openmobilealliance.org/tech/DTD/xhtml-mobile12.dtd">';break;case"xml":e="<?xml version='1.0' encoding='utf-8' ?>";break;case"xml iso-8859-1":e="<?xml version='1.0' encoding='iso-8859-1' ?>"}return JSON.stringify(e+"\n")}},{name:"markdown",regexp:/^(\s*):markdown\s*$/i,process:function(){return parse_interpol(exports.Markdown.encode(this.contents.join("\n")))}},{name:"script",regexp:/^(\s*):(?:java)?script\s*$/,process:function(){return parse_interpol('\n<script type="text/javascript">\n//<![CDATA[\n'+this.contents.join("\n")+"\n//]]>\n</script>\n")}},{name:"css",regexp:/^(\s*):css\s*$/,process:function(){return JSON.stringify('<style type="text/css">\n'+this.contents.join("\n")+"\n</style>")}}],Haml=function(e,t){"object"!=typeof t&&(forceXML=t,t={});var n;t.customEscape?(n="",escaperName=t.customEscape):(n=html_escape.toString()+"\n",escaperName="html_escape"),escapeHtmlByDefault=t.escapeHtmlByDefault||t.escapeHTML||t.escape_html;var s=optimize(compile(e)),r="with(locals || {}) {\n  try {\n   var _$output="+s+";\n return _$output;  } catch (e) {\n    return \"\\n<pre class='error'>\" + "+escaperName+'(e + "\\n" + e.stack) + "</pre>\\n";\n  }\n}';try{var i=new Function("locals",n+r);return i}catch(c){throw"undefined"!=typeof console&&console.error(r),c}},Haml.compile=compile,Haml.optimize=optimize,Haml.render=render,Haml.execute=execute,Haml.html_escape=html_escape}(),"undefined"!=typeof module&&(module.exports=Haml);
