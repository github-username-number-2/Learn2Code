import{encodeHTMLEntities}from"/js/functions.js";import initializeUI from"./initializeUI.js";import initializeTutorialFunctions from"./tutorialFunctions.js";export default async function initializeEditor(){var t=window.location.hash.substring(1);if(t.startsWith("tutorial")){var i=decodeURIComponent(t.substring(9));let e;try{e=(await import(`/data/tutorials/${i}.js`)).default}catch{return alertCustom("Error: Could not load tutorial<br><br>Tutorials can be accessed from the main page under the tutorials tab<br><br>You will be redirected automatically in 15 seconds"),void setTimeout(()=>window.location.href="//"+window.location.host,15e3)}if(e.info.id=i,"actionString"in e&&(e.actionList=function(e){var e=e.split("---").map(e=>e.trim()),t=JSON.parse(e.shift()),i=[["beginTutorial"],["loadFileSystem",t],["setRequiredFileSystem",t]];for(var o of e){const n=[0,0,0].map(()=>Math.random().toString().slice(2)).join("");if(o=r(o=o.replaceAll("\n",n),"`","`",e=>`<code class="highlightInline">${e}</code>`),">>>"===(o=r(o,"<[","]>",e=>{var[e,t]=e.split(new RegExp(n+"(.*)","s"));return`<pre data-lang="${e}">${encodeHTMLEntities(t).replaceAll(n,"\n").trim()}</pre>`})).slice(-3))i.push(["instructCodeExecution",o.replaceAll(n,"<br>").slice(0,-7)]);else if(~o.indexOf("<{")){const s=[];o=a(o=r(o,"<{","}>",e=>{var e=e.split(new RegExp(n+"(.*)","s")),[e,t]=[e[0].split(" "),e[1].replaceAll(n,"\n").slice(0,-1)];e.splice(3,0,"s"===e[1]?[t,"utf-8"]:t);let i=1;return"f"===e[0]&&(i=0),s.push([{f:"addRequiredFile",s:"setRequiredFileCode",a:"appendRequiredFileCode",i:"insertRequiredFileCode"}[e[i]],...e.slice(i+1)]),""}),n);for(const l of s)i.push(["instructCodeAction",o.replaceAll(n,"<br>"),...l])}else o=a(o,n),i.push(["info",o.replaceAll(n,"<br>").trim()])}return i.push(["createCheckpoint"],["endTutorial"]),i;function r(e,t,i,o){let r,a="";for(;~(r=e.indexOf(t));){a+=e.slice(0,r);var n=(e=e.slice(r+t.length)).indexOf(i);if(!~n)throw new Error(`Start markup sequence is never closed. End sequence: ${i} Current parsed string: `+a);a+=o(e.slice(0,n)),e=e.slice(n+i.length)}return a+=e}function a(e,t){for(;e.endsWith(t);)e=e.slice(0,-t.length);for(;~e.indexOf("</pre>"+t);)e=e.replace("</pre>"+t,"</pre>");for(;~e.indexOf("<p>"+t);)e=e.replace("<p>"+t,"<p>");return e}}(e.actionString)),localStorage.getItem("devMode"))alert("dev mode enabled");else for(const o of(await import("/data/tutorials/tutorialIndex.js")).default.tutorialList[i].prerequisites)if(!(await storageManager.getTutorialProgress(o)).completedOnce)return alertCustom("This tutorial has not been unlocked yet. You will be redirected to home in 15 seconds."),void setTimeout(()=>window.location.href="//"+window.location.host,15e3);!async function(e){window.tutorial=!0,window.tutorialFunctions=initializeTutorialFunctions(e),initializeUI("tutorial");let t=0;var i=e.info.id,o=await storageManager.getTutorialData(i);{var r;o&&({actionIndex:t}=o,{lastCheckPointFileSystem:o,requiredFileSystem:r}=o,await tutorialFunctions.loadFileSystem(o),tutorialFunctions.setRequiredFileSystem(r))}var o=e.actionList,a=o.length;for(;t<a;t++){var n=e.actionList[t];await tutorialFunctions[n[0]](...n.slice(1),t),await storageManager.setTutorialProgress(i,{progressPercent:(t+1)/a*100})}}(e)}else if(t.startsWith("editor")){i=decodeURIComponent(t.substring(7)),t=await storageManager.getProjectData(i);if(void 0!==t){i=t;window.project=!0,initializeUI("main");const{name:r,fileSystem:a}=i,n=(document.getElementById("headerText").innerText=document.title="Project: "+r,history.pushState(null,""),fileSystemManager.loadFileSystem(a),document.getElementById("saveIcon"));let e;fileSystemManager.fileSystemChangeListeners.saveListener=()=>{n.style.animationName="fade",clearTimeout(e),e=setTimeout(async()=>{await storageManager.setProjectData({name:r,fileSystem:fileSystemManager.getFileSystem()}),n.style.animationName=null},600)}}else alertCustom("Error: Could not load project<br><br>Projects can be accessed from the main page under the projects tab<br><br>You will be redirected automatically in 15 seconds"),setTimeout(()=>window.location.href="//"+window.location.host,15e3)}else window.location.href="//"+window.location.host}