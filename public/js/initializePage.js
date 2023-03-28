import{elementFromString}from"/js/functions.js";navigator.serviceWorker.register("/sw.js"),document.addEventListener("dragstart",e=>e.preventDefault()),document.addEventListener("selectstart",e=>e.preventDefault());const mask=document.createElement("div");mask.id="mask",document.body.appendChild(mask),document.getElementById("logo").addEventListener("click",()=>window.location=window.location.origin),window.loadPage=()=>{mask.innerHTML||(document.getElementById("mask").style.display="none"),document.getElementById("saveIcon").addEventListener("click",async()=>{await confirmCustom("Load existing save or create new save?",{confirmText:"Load save file",cancelText:"Create save file"})?storageManager.loadFromFile():storageManager.saveToFile()})},function(){function s(e,{left:t,right:n,top:o,bottom:s,width:i,height:a}){for(const v of mask.children)v.style.display="none";var l=elementFromString(e),c=window.innerWidth/100,d=window.innerHeight/100,r=["left","right","top","bottom","width","height"],p=[c,c,d,d,c,d];for(let e=0;e<6;e++){var u=r[e],m=arguments[1][u];m&&(l.style[u]=p[e]+m+"px")}return(t||n)&&(l.style.transform="none"),(o||s)&&(l.style.top="auto"),mask.appendChild(l),mask.style.display="block",f(l),l}function i(e){e.remove(),mask.innerHTML?f(mask.lastChild):mask.style.display="none"}function f(e){e.style.display="block",{alert:()=>e.lastElementChild.focus(),confirm:()=>e.lastElementChild.focus(),prompt:()=>e.children[2].focus()}[e.classList[1]]()}window.alertCustom=function(n,o={}){return new Promise(e=>{const t=s(`<div class="popup alert">
					<div class="popupHeader"></div>
					<p class="popupText">${n}</p>
					<button class="popupButton">Close</button>
				</div>`,o);setTimeout(()=>t.lastElementChild.addEventListener("click",()=>{i(t),e()}),10)})},window.confirmCustom=function(n,o={}){return new Promise(e=>{const t=s(`<div class="popup confirm">
					<div class="popupHeader"></div>
					<p class="popupText">${n}</p>
					<button class="popupButton confirm">${o.confirmText||"Confirm"}</button>
					<button class="popupButton cancel">${o.cancelText||"Cancel"}</button>
				</div>`,o);setTimeout(()=>{t.children[2].addEventListener("click",()=>{i(t),e(!0)}),t.children[3].addEventListener("click",()=>{i(t),e(!1)})},10)})},window.promptCustom=function(e,t={}){return new Promise(n=>{const o=s(`<div class="popup prompt">
					<div class="popupHeader"></div>
					<p class="popupText">${e}</p>
					<div class="inputContainer">


						<input class="popupInput" value="${t.defaultValue||""}" maxlength="${t.maxLength||""}" type="text">
						<button class="popupButton">Confirm</button>
						<button class="popupButton">Cancel</button>
					</div>
				</div>`,t);setTimeout(()=>{const e=o.children[2],t=e.children[0];t.addEventListener("keydown",e=>{"Enter"===e.key&&(i(o),n(t.value))}),e.children[1].addEventListener("click",()=>{i(o),n(t.value)}),e.children[2].addEventListener("click",()=>{i(o),n(null)}),t.focus(),t.select()},10)})}}();