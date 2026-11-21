
function RefreshCam(ipcamimg, elementid, url, t, d) {var o=document.getElementById(elementid);if(o){o.setAttribute("src",eval(ipcamimg+'.src'));if(o.parentNode.parentNode.style.visibility!='hidden')setTimeout(ipcamimg+".src = \""+url+d+Math.random()+"\"", t);}}
function SetBg(name, imag) {var obj = document.getElementById(name); obj.style.backgroundImage = imag == '' ? '' : 'url("IMAGES/'+imag+'")';}
function SetCond(obj, val) {if(obj != val) obj = val;}
function GetColor(val) {var tmp = '000000'+parseInt(parseInt(((val << 16) & 0xFF0000) | (val & 0xFF00) | ((val >> 16) & 0xFF))).toString(16); return '#'+tmp.substr(tmp.length-6,6);}
function GetDateByFormat(pstr,pf) {var isDel=new RegExp("^([-:]|\\s|\\.)");var isNotDel=new RegExp("^[YMDhmsz]");var strYY='', strMM='0', strDD='0', strhh='0', strmm='0', strss='0', strzz='0';var j = 0;for(var i = 0; i < pstr.length; i++, j++) {if(isNotDel.test(pstr.charAt(i))) {if(isDel.test(pf.charAt(j))) {j--;} else {switch(pstr.charAt(i)) {case 'Y' : strYY += pf.charAt(j); break;case 'M' : strMM += pf.charAt(j); break;case 'D' : strDD += pf.charAt(j); break;case 'h' : strhh += pf.charAt(j); break;case 'm' : strmm += pf.charAt(j); break;case 's' : strss += pf.charAt(j); break;case 'z' : strzz += pf.charAt(j); break;}}}}strzz = (strzz+'00').substr(0,4);  return new Date(strYY, strMM, strDD, strhh, strmm, strss, strzz);}
function CheckValueLimits(value,type,format,mmin,mmax) {switch(type) {case 0:value = parseFloat(value);mnin  = parseFloat(mmin);mmax  = parseFloat(mmax);break;case 1:value = parseInt(value, 16);mnin  = parseInt(mmin, 16);mmax  = parseInt(mmax, 16);break;case 2:value = GetDateByFormat(format, value);mmin  = GetDateByFormat(format, mmin);mmax  = GetDateByFormat(format, mmax);break;}return value >= mmin && value <= mmax;}
var xmlhttpGET  = null;
var xmlhttpPOST = null;
var gNewLoc='';function GetXML(e,t){if(window.XMLHttpRequest){xmlhttpGET=new XMLHttpRequest}else if(window.ActiveXObject){xmlhttpGET=new ActiveXObject("Microsoft.XMLHTTP")}if(xmlhttpGET!=null){xmlhttpGET.onreadystatechange=onResponse;if(t){xmlhttpGET.open("POST",e,true);xmlhttpGET.setRequestHeader("Content-type","application/x-www-form-urlencoded")}else{xmlhttpGET.open("GET",e,true)}xmlhttpGET.setRequestHeader("x-tecomat","data");xmlhttpGET.send(t)}else{alert("Your browser does not support XMLHTTP.")}}
function PostXML(e,t,l){if(window.XMLHttpRequest){xmlhttpPOST=new XMLHttpRequest}else if(window.ActiveXObject){xmlhttpPOST=new ActiveXObject("Microsoft.XMLHTTP")}if(xmlhttpPOST!=null){gNewLoc=l;xmlhttpPOST.onreadystatechange=onPostResponse;xmlhttpPOST.open("POST",e,true);xmlhttpPOST.setRequestHeader("Content-type","application/x-www-form-urlencoded");xmlhttpPOST.send(t)}else{alert("Your browser does not support XMLHTTP.")}}

var g_postInProgress=false;
var UpdateFileSubmit;
function TUpdateFileSubmit(div, name, size) {this.mDiv = div; this.mName = name; this.mSize = size; this.mNum = 0;this.refresh = function() {var sp = ['|','/','-','\\'];this.mDiv.innerHTML=this.mName+' '+sp[this.mNum%4]+' '+ this.mSize;this.mNum++;setTimeout("UpdateFileSubmit.refresh()", 500);};this.refresh();}
function postFileSubmit(sourceForm, colour) {g_postInProgress = true;for( var x = 0; sourceForm.childNodes[x]; x++ ){if(sourceForm.childNodes[x].style) {if(sourceForm.childNodes[x].style.display == 'none') {sourceForm.childNodes[x].style.display = 'block';if(sourceForm[0].files) {UpdateFileSubmit = new TUpdateFileSubmit(sourceForm.childNodes[x],sourceForm[0].files[0].name,sourceForm[0].files[0].size+'B',0);}else{UpdateFileSubmit = new TUpdateFileSubmit(sourceForm.childNodes[x],sourceForm[0].value.replace(/.*(\/|\\)/, ''),'');}} else sourceForm.childNodes[x].style.display = 'none';}}sourceForm.submit();}
function SetInputEdited(i, e){var keynum;if(window.event){keynum=e.keyCode;}else if(e.which){keynum=e.which;}InputFocused[i-1]=1;if(keynum!=9&&keynum!=11&&keynum!=16&&keynum !=17){if(keynum==27){InputEdited[i-1]=0; }else{InputEdited[i-1]=1;document.getElementById('INPUT'+i).style.color='#FF0000';}}}
var InputEdited=[];var InputFocused=[];var gCI=[];var gLCI=[]; var gIC=[];var gWatchDog = 0; var gTemp;
function UpdateValue(input, x, color) {
if(input.value != x.getAttribute('VALUE')) input.value = x.getAttribute('VALUE');
if(input.style.color != color) input.style.color = color;
}
function onPostResponse() {
if(!xmlhttpPOST) return;
if(xmlhttpPOST.readyState != 4) return;
if(!xmlhttpPOST.status) return;
if(xmlhttpPOST.status != 200){
alert('Problem posting XML data ' + xmlhttpPOST.statusText + '(' + xmlhttpPOST.status + ')');
}else{if(gNewLoc)document.location.href=gNewLoc;}
}
function BackToReferrer() {
r = document.referrer.toLowerCase();
if(r==''||r==document.location.href.toLowerCase()||r.search('login.xml')!=-1||r.search('logout.xml')!=-1) {
document.location.href='INDEX.XML';
} else {document.location.href=r;}}
function onResponse() {
try {
gWatchDog++;
if(!xmlhttpGET) return;
if(xmlhttpGET.readyState != 4) return;
if(!xmlhttpGET.status) return;
if(xmlhttpGET.status != 200){
alert('Problem retrieving XML data ' + xmlhttpGET.statusText + '(' + xmlhttpGET.status + ')');
document.location.reload(true)
return;}
var access = xmlhttpGET.responseXML.documentElement.getElementsByTagName('ACCESS')[0]; if(!access || access.getAttribute('UCID') != 1497350380) {document.location.reload(true); return;}
var pd = '';
var x=xmlhttpGET.responseXML.documentElement.getElementsByTagName('INPUT');
if(x[0]) {
var Input1 = document.getElementById('INPUT1');
Input1.value = x[0].getAttribute('VALUE');
var Input2 = document.getElementById('INPUT2');
Input2.value = x[1].getAttribute('VALUE');
var Input3 = document.getElementById('INPUT3');
Input3.value = x[2].getAttribute('VALUE');
var Input4 = document.getElementById('INPUT4');
Input4.value = x[3].getAttribute('VALUE');
var Input5 = document.getElementById('INPUT5');
Input5.value = x[4].getAttribute('VALUE');
var Input6 = document.getElementById('INPUT6');
Input6.value = x[5].getAttribute('VALUE');
var Input7 = document.getElementById('INPUT7');
Input7.value = x[6].getAttribute('VALUE');
var Input8 = document.getElementById('INPUT8');
Input8.value = x[7].getAttribute('VALUE');
var Input9 = document.getElementById('INPUT9');
Input9.value = x[8].getAttribute('VALUE');
var Input10 = document.getElementById('INPUT10');
Input10.value = x[9].getAttribute('VALUE');
var Input11 = document.getElementById('INPUT11');
Input11.value = x[10].getAttribute('VALUE');
var Input12 = document.getElementById('INPUT12');
if(!InputEdited[11]) {
UpdateValue(Input12, x[11], '#000000');}
var Input13 = document.getElementById('INPUT13');
if(!InputEdited[12]) {
UpdateValue(Input13, x[12], '#000000');}
var Input14 = document.getElementById('INPUT14');
if(!InputEdited[13]) {
UpdateValue(Input14, x[13], '#000000');}
var Input15 = document.getElementById('INPUT15');
if(!InputEdited[14]) {
UpdateValue(Input15, x[14], '#000000');}
var Input16 = document.getElementById('INPUT16');
Input16.value = x[0].getAttribute('VALUE');
var Input17 = document.getElementById('INPUT17');
Input17.value = x[15].getAttribute('VALUE');
var Input18 = document.getElementById('INPUT18');
if(x[16].getAttribute('VALUE') != '0') {
Input18.style.visibility = 'hidden';
} else {
Input18.style.visibility = 'visible';
}
var Input19 = document.getElementById('INPUT19');
if(x[16].getAttribute('VALUE') != '0') {
Input19.style.visibility = 'hidden';
} else {
Input19.style.visibility = 'visible';
}
var Input20 = document.getElementById('INPUT20');
if(x[17].getAttribute('VALUE') == '0') {
Input20.style.visibility = 'hidden';
} else {
Input20.style.visibility = 'visible';
}
var Input21 = document.getElementById('INPUT21');
Input21.value = x[18].getAttribute('VALUE');
var Input22 = document.getElementById('INPUT22');
if(x[17].getAttribute('VALUE') == '0') {
Input22.style.display = 'none';
} else {
Input22.style.display = 'block';
}
var Input23 = document.getElementById('INPUT23');
Input23.value = x[19].getAttribute('VALUE');
var Input24 = document.getElementById('INPUT24');
Input24.value = x[20].getAttribute('VALUE');
var Input25 = document.getElementById('INPUT25');
if(x[21].getAttribute('VALUE') == '0') {
Input25.style.visibility = 'hidden';
} else {
Input25.style.visibility = 'visible';
}
var Input26 = document.getElementById('INPUT26');
Input26.value = x[22].getAttribute('VALUE');
var Input27 = document.getElementById('INPUT27');
Input27.value = x[23].getAttribute('VALUE');
var Input28 = document.getElementById('INPUT28');
if(x[24].getAttribute('VALUE') == '0') {
Input28.style.visibility = 'hidden';
} else {
Input28.style.visibility = 'visible';
}
var Input29 = document.getElementById('INPUT29');
var Input29h = document.getElementById('INPUT29h');
if(Input29h) { vz = x[25].getAttribute('VALUE') == '0'; iz = Input29h.value == '0';
if(vz == iz) {
if(vz) {
Input29h.value = '1';
Input29.style.backgroundImage = 'url("IMAGES/CHECK1.GIF")';
if(Input29.getAttribute('value') != null) {Input29.value = '';} else {}
} else {
Input29h.value = '0';
Input29.style.backgroundImage = 'url("IMAGES/CHECK0.GIF")';
if(Input29.getAttribute('value') != null) {Input29.value = '';
} else {}
}}} else {
if(x[25].getAttribute('VALUE') == '0') {
SetBg('INPUT29', 'CHECK1.GIF');
} else {
SetBg('INPUT29', 'CHECK0.GIF');
}}
if(x[24].getAttribute('VALUE') == '0') {
Input29.style.display = 'none';
} else {
Input29.style.display = 'block';
}
var Input30 = document.getElementById('INPUT30');
if(x[24].getAttribute('VALUE') == '0') {
Input30.style.visibility = 'hidden';
} else {
Input30.style.visibility = 'visible';
}
var Input31 = document.getElementById('INPUT31');
var Input31h = document.getElementById('INPUT31h');
if(Input31h) { vz = x[26].getAttribute('VALUE') == '0'; iz = Input31h.value == '0';
if(vz == iz) {
if(vz) {
Input31h.value = '1';
Input31.style.backgroundImage = 'url("IMAGES/CHECK1.GIF")';
if(Input31.getAttribute('value') != null) {Input31.value = '';} else {}
} else {
Input31h.value = '0';
Input31.style.backgroundImage = 'url("IMAGES/CHECK0.GIF")';
if(Input31.getAttribute('value') != null) {Input31.value = '';
} else {}
}}} else {
if(x[26].getAttribute('VALUE') == '0') {
SetBg('INPUT31', 'CHECK1.GIF');
} else {
SetBg('INPUT31', 'CHECK0.GIF');
}}
if(x[24].getAttribute('VALUE') == '0') {
Input31.style.display = 'none';
} else {
Input31.style.display = 'block';
}
var Input32 = document.getElementById('INPUT32');
if(x[24].getAttribute('VALUE') == '0') {
Input32.style.visibility = 'hidden';
} else {
Input32.style.visibility = 'visible';
}
var Input33 = document.getElementById('INPUT33');
var Input33h = document.getElementById('INPUT33h');
if(Input33h) { vz = x[24].getAttribute('VALUE') == '0'; iz = Input33h.value == '0';
if(vz == iz) {
if(vz) {
Input33h.value = '1';
Input33.style.backgroundImage = 'url("IMAGES/145X40_T.PNG")';
if(Input33.getAttribute('value') != null) {Input33.value = 'Volba HDO';} else {Input33.innerHTML = 'Volba HDO';}
} else {
Input33h.value = '0';
Input33.style.backgroundImage = 'url("IMAGES/145X40_T.PNG")';
if(Input33.getAttribute('value') != null) {Input33.value = 'Volba HDO';
} else {Input33.innerHTML = 'Volba HDO';}
}}} else {
if(x[24].getAttribute('VALUE') == '0') {
SetBg('INPUT33', '145X40_T.PNG');
Input33.innerHTML = 'Volba HDO';
} else {
SetBg('INPUT33', '145X40_T.PNG');
Input33.innerHTML = 'Volba HDO';
}}
var Input34 = document.getElementById('INPUT34');
var Input34h = document.getElementById('INPUT34h');
if(Input34h) { vz = x[24].getAttribute('VALUE') == '0'; iz = Input34h.value == '0';
if(vz == iz) {
if(vz) {
Input34h.value = '1';
Input34.style.backgroundImage = 'url("IMAGES/ARROW1_1.PNG")';
if(Input34.getAttribute('value') != null) {Input34.value = '';} else {}
} else {
Input34h.value = '0';
Input34.style.backgroundImage = 'url("IMAGES/ARROW1_4.PNG")';
if(Input34.getAttribute('value') != null) {Input34.value = '';
} else {}
}}} else {
if(x[24].getAttribute('VALUE') == '0') {
SetBg('INPUT34', 'ARROW1_1.PNG');
} else {
SetBg('INPUT34', 'ARROW1_4.PNG');
}}
var Input35 = document.getElementById('INPUT35');
var Input35h = document.getElementById('INPUT35h');
if(Input35h) { vz = x[27].getAttribute('VALUE') == '0'; iz = Input35h.value == '0';
if(vz == iz) {
if(vz) {
Input35h.value = '1';
Input35.style.backgroundImage = 'url("IMAGES/CHECK1.GIF")';
if(Input35.getAttribute('value') != null) {Input35.value = '';} else {}
} else {
Input35h.value = '0';
Input35.style.backgroundImage = 'url("IMAGES/CHECK0.GIF")';
if(Input35.getAttribute('value') != null) {Input35.value = '';
} else {}
}}} else {
if(x[27].getAttribute('VALUE') == '0') {
SetBg('INPUT35', 'CHECK1.GIF');
} else {
SetBg('INPUT35', 'CHECK0.GIF');
}}
if(x[24].getAttribute('VALUE') == '0') {
Input35.style.display = 'none';
} else {
Input35.style.display = 'block';
}
var Input36 = document.getElementById('INPUT36');
if(x[24].getAttribute('VALUE') == '0') {
Input36.style.visibility = 'hidden';
} else {
Input36.style.visibility = 'visible';
}
} else {document.location.reload(true); return;}
} catch(err) {console.log(err.message)}
if(pd!=''){setTimeout("GetXML('PAGE53.XML','"+pd+"')",1);}else{setTimeout("GetXML('PAGE53.XML')",1000);}}
function FunWatchDog() {
if(gWatchDog > 0 || g_postInProgress) {
gWatchDog = 0;
} else {
document.location.reload(true);
}
setTimeout("FunWatchDog()", 20000);
}

function PostXML12() {
var Input12 = document.getElementById('INPUT12');
document.getElementById('INPUT12x').style.visibility = 'hidden';if(InputEdited[11]) {
PostXML('PAGE53.XML', encodeURIComponent(Input12.name+'='+Input12.value)); InputEdited[11] = 0;
}
}
function PostXML13() {
var Input13 = document.getElementById('INPUT13');
document.getElementById('INPUT13x').style.visibility = 'hidden';if(InputEdited[12]) {
PostXML('PAGE53.XML', encodeURIComponent(Input13.name+'='+Input13.value)); InputEdited[12] = 0;
}
}
function PostXML14() {
var Input14 = document.getElementById('INPUT14');
document.getElementById('INPUT14x').style.visibility = 'hidden';if(InputEdited[13]) {
PostXML('PAGE53.XML', encodeURIComponent(Input14.name+'='+Input14.value)); InputEdited[13] = 0;
}
}
function PostXML15() {
var Input15 = document.getElementById('INPUT15');
document.getElementById('INPUT15x').style.visibility = 'hidden';if(InputEdited[14]) {
PostXML('PAGE53.XML', encodeURIComponent(Input15.name+'='+Input15.value)); InputEdited[14] = 0;
}
}
function PostXML22() {
PostXML('PAGE53.XML', encodeURIComponent('__R6866.5_BOOL_i=1')); 
SetBg('INPUT22', '48GRE.GIF');
setTimeout("SetBg('INPUT22', '48WHI.GIF');",500);
}
function PostXML29() {
var Input29h = document.getElementById('INPUT29h');
PostXML('PAGE53.XML', encodeURIComponent(Input29h.name+'='+Input29h.value));
}
function PostXML31() {
var Input31h = document.getElementById('INPUT31h');
PostXML('PAGE53.XML', encodeURIComponent(Input31h.name+'='+Input31h.value));
}
function PostXML33() {
var Input33h = document.getElementById('INPUT33h');
PostXML('PAGE53.XML', encodeURIComponent(Input33h.name+'='+Input33h.value));
}
function PostXML34() {
var Input34h = document.getElementById('INPUT34h');
PostXML('PAGE53.XML', encodeURIComponent(Input34h.name+'='+Input34h.value));
}
function PostXML35() {
var Input35h = document.getElementById('INPUT35h');
PostXML('PAGE53.XML', encodeURIComponent(Input35h.name+'='+Input35h.value));
}

function PostGlobal() {
}
