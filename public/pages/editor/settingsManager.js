import{elementFromString}from"/js/functions.js";const settingsInfo={editorFontSize:{default:14,type:"number",display:"Code font size",description:"Font size of all editors (2-40)",min:2,max:40},editorLineNumbers:{default:!0,type:"toggle",display:"Line numbers",description:"Show line numbers in editor"},editorWrapText:{default:!1,type:"toggle",display:"Wrap text",description:"Allow long lines to continue off screen or place on next line"},tutorialDifferenceEditorStyle:{default:"sideBySide",type:"select",display:"Tutorial hint style",description:"Display tutorial hints side by side or inline",defaultDisplay:"Side by side",valueList:["sideBySide","inline"],displayList:{sideBySide:"Side by side",inline:"Inline"}}};export default async function initializeSettingsManager(){var e=await storageManager.getEditorSettings();window.userSettings={};for(const d in settingsInfo){var t=e.find(e=>e.name===d);userSettings[d]=settingsInfo[d].currentValue=t?t.currentValue:settingsInfo[d].default}const n=document.getElementById("settingsPanelContent"),a=document.getElementById("settingsReloadText");for(const c in settingsInfo){const g=settingsInfo[c],u=g.type;var i=elementFromString(`
				<div id="${c}Setting" class="setting ${u}">
					<h1>
						${g.display}
						<img src="/images/icons/resetIcon.png" title="Reset to default (${g.defaultDisplay||g.default})">
					</h1>
					<p>${g.description}</p>
				</div>
			`),s=(i.firstElementChild.firstElementChild.addEventListener("click",async()=>r(c,g,g.default)),g.currentValue);switch(u){case"number":{const m=elementFromString(`
					<input type="number" value="${s}" min="${g.min}" max="${g.max}">
				`);m.addEventListener("change",()=>{var e=parseInt(m.value);e<g.min||e>g.max?m.style.border="0.2vh solid #ff0000":(m.style.border=null,r(c,g,e))}),i.append(m)}break;case"toggle":{var l=elementFromString(`
					<div><div></div></div>
				`);s?l.firstElementChild.classList.add("settingToggleSliderTransformed"):l.classList.remove("settingToggleSliderTransformed");let e=s;l.addEventListener("click",()=>r(c,g,e=!e)),i.append(l)}break;case"select":{let e="";for(const f of g.valueList)e+=`<option value="${f}">${g.displayList[f]}</option>`;const p=elementFromString(`
					<select>
						${e}
					</select>
				`);p.value=s,p.addEventListener("change",()=>r(c,g,p.value)),i.append(p)}}n.append(i)}const o={};async function r(e,t,n){t={...t,name:e,currentValue:n},await storageManager.modifyEditorSetting(t);var i=document.getElementById(e+"Setting");switch(t.type){case"number":var s=i.querySelector("input");s.value=n,s.style.border=null;break;case"toggle":s=i.lastElementChild.firstElementChild;n?s.classList.add("settingToggleSliderTransformed"):s.classList.remove("settingToggleSliderTransformed");break;case"select":i.querySelector("select").value=n}o[e]=n;for(const l in o)o[l]===t.default&&await storageManager.deleteEditorSetting(l),o[l]===userSettings[l]&&delete o[l];Object.keys(o).length?a.style.display="block":a.style.display="none";for(const r of i.querySelectorAll(".updatedSettingText"))r.remove();e in o&&i.firstElementChild.prepend(elementFromString('<p class="updatedSettingText">*</p>'))}}