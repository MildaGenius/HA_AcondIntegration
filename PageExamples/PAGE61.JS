
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
if(x[0].getAttribute('VALUE') == '0') {
Input1.style.visibility = 'hidden';
} else {
Input1.style.visibility = 'visible';
}
var Input2 = document.getElementById('INPUT2');
if(x[1].getAttribute('VALUE') == '0') {
Input2.style.visibility = 'hidden';
} else {
Input2.style.visibility = 'visible';
}
var Input3 = document.getElementById('INPUT3');
if(x[2].getAttribute('VALUE') == '0') {
Input3.style.visibility = 'hidden';
} else {
Input3.style.visibility = 'visible';
}
var Input4 = document.getElementById('INPUT4');
if(x[3].getAttribute('VALUE') == '0') {
Input4.style.visibility = 'hidden';
} else {
Input4.style.visibility = 'visible';
}
var Input5 = document.getElementById('INPUT5');
if(x[1].getAttribute('VALUE') == '0') {
Input5.style.visibility = 'hidden';
} else {
Input5.style.visibility = 'visible';
}
var Input6 = document.getElementById('INPUT6');
if(x[4].getAttribute('VALUE') == '0') {
Input6.style.visibility = 'hidden';
} else {
Input6.style.visibility = 'visible';
}
var Input7 = document.getElementById('INPUT7');
if(x[5].getAttribute('VALUE') == '0') {
Input7.style.visibility = 'hidden';
} else {
Input7.style.visibility = 'visible';
}
var Input8 = document.getElementById('INPUT8');
if(x[6].getAttribute('VALUE') == '0') {
Input8.style.visibility = 'hidden';
} else {
Input8.style.visibility = 'visible';
}
var Input9 = document.getElementById('INPUT9');
if(x[7].getAttribute('VALUE') == '0') {
Input9.style.visibility = 'hidden';
} else {
Input9.style.visibility = 'visible';
}
var Input10 = document.getElementById('INPUT10');
if(x[8].getAttribute('VALUE') == '0') {
Input10.style.visibility = 'hidden';
} else {
Input10.style.visibility = 'visible';
}
var Input11 = document.getElementById('INPUT11');
if(x[9].getAttribute('VALUE') == '0') {
Input11.style.visibility = 'hidden';
} else {
Input11.style.visibility = 'visible';
}
var Input12 = document.getElementById('INPUT12');
if(x[10].getAttribute('VALUE') == '0') {
Input12.style.visibility = 'hidden';
} else {
Input12.style.visibility = 'visible';
}
var Input13 = document.getElementById('INPUT13');
if(x[11].getAttribute('VALUE') != '0') {
Input13.style.visibility = 'hidden';
} else {
Input13.style.visibility = 'visible';
}
var Input14 = document.getElementById('INPUT14');
if(x[12].getAttribute('VALUE') == '0') {
Input14.style.visibility = 'hidden';
} else {
Input14.style.visibility = 'visible';
}
var Input15 = document.getElementById('INPUT15');
Input15.value = x[13].getAttribute('VALUE');
if(x[1].getAttribute('VALUE') == '0') {
Input15.style.visibility = 'hidden';
} else {
Input15.style.visibility = 'visible';
}
var Input16 = document.getElementById('INPUT16');
Input16.value = x[14].getAttribute('VALUE');
var Input17 = document.getElementById('INPUT17');
Input17.value = x[15].getAttribute('VALUE');
var Input18 = document.getElementById('INPUT18');
Input18.value = x[16].getAttribute('VALUE');
var Input19 = document.getElementById('INPUT19');
Input19.value = x[17].getAttribute('VALUE');
var Input20 = document.getElementById('INPUT20');
Input20.value = x[18].getAttribute('VALUE');
var Input21 = document.getElementById('INPUT21');
if(x[2].getAttribute('VALUE') == '0') {
Input21.style.visibility = 'hidden';
} else {
Input21.style.visibility = 'visible';
}
var Input22 = document.getElementById('INPUT22');
if(x[19].getAttribute('VALUE') == '0') {
Input22.style.visibility = 'hidden';
} else {
Input22.style.visibility = 'visible';
}
var Input23 = document.getElementById('INPUT23');
Input23.value = x[20].getAttribute('VALUE');
if(x[2].getAttribute('VALUE') == '0') {
Input23.style.visibility = 'hidden';
} else {
Input23.style.visibility = 'visible';
}
var Input24 = document.getElementById('INPUT24');
if(x[3].getAttribute('VALUE') == '0') {
Input24.style.visibility = 'hidden';
} else {
Input24.style.visibility = 'visible';
}
var Input25 = document.getElementById('INPUT25');
if(x[21].getAttribute('VALUE') == '0') {
Input25.style.visibility = 'hidden';
} else {
Input25.style.visibility = 'visible';
}
var Input26 = document.getElementById('INPUT26');
Input26.value = x[22].getAttribute('VALUE');
if(x[3].getAttribute('VALUE') == '0') {
Input26.style.visibility = 'hidden';
} else {
Input26.style.visibility = 'visible';
}
var Input27 = document.getElementById('INPUT27');
if(x[10].getAttribute('VALUE') == '0') {
Input27.style.visibility = 'hidden';
} else {
Input27.style.visibility = 'visible';
}
var Input28 = document.getElementById('INPUT28');
if(x[23].getAttribute('VALUE') == '0') {
Input28.style.visibility = 'hidden';
} else {
Input28.style.visibility = 'visible';
}
var Input29 = document.getElementById('INPUT29');
Input29.value = x[24].getAttribute('VALUE');
if(x[10].getAttribute('VALUE') == '0') {
Input29.style.visibility = 'hidden';
} else {
Input29.style.visibility = 'visible';
}
var Input30 = document.getElementById('INPUT30');
if(x[11].getAttribute('VALUE') != '0') {
Input30.style.visibility = 'hidden';
} else {
Input30.style.visibility = 'visible';
}
var Input31 = document.getElementById('INPUT31');
if(x[25].getAttribute('VALUE') == '0') {
Input31.style.visibility = 'hidden';
} else {
Input31.style.visibility = 'visible';
}
var Input32 = document.getElementById('INPUT32');
Input32.value = x[26].getAttribute('VALUE');
if(x[11].getAttribute('VALUE') != '0') {
Input32.style.visibility = 'hidden';
} else {
Input32.style.visibility = 'visible';
}
var Input33 = document.getElementById('INPUT33');
if(x[12].getAttribute('VALUE') == '0') {
Input33.style.visibility = 'hidden';
} else {
Input33.style.visibility = 'visible';
}
var Input34 = document.getElementById('INPUT34');
if(x[27].getAttribute('VALUE') == '0') {
Input34.style.visibility = 'hidden';
} else {
Input34.style.visibility = 'visible';
}
var Input35 = document.getElementById('INPUT35');
Input35.value = x[28].getAttribute('VALUE');
if(x[12].getAttribute('VALUE') == '0') {
Input35.style.visibility = 'hidden';
} else {
Input35.style.visibility = 'visible';
}
var Input36 = document.getElementById('INPUT36');
Input36.value = x[29].getAttribute('VALUE');
var Input37 = document.getElementById('INPUT37');
Input37.value = x[30].getAttribute('VALUE');
var Input38 = document.getElementById('INPUT38');
if(x[31].getAttribute('VALUE') == '0') {
Input38.style.display = 'none';
} else {
Input38.style.display = 'block';
}
var Input39 = document.getElementById('INPUT39');
Input39.value = x[32].getAttribute('VALUE');
var Input40 = document.getElementById('INPUT40');
Input40.value = x[33].getAttribute('VALUE');
var Input41 = document.getElementById('INPUT41');
if(x[34].getAttribute('VALUE') == '0') {
Input41.style.visibility = 'hidden';
} else {
Input41.style.visibility = 'visible';
}
var Input42 = document.getElementById('INPUT42');
if(x[35].getAttribute('VALUE') != '0') {
Input42.style.visibility = 'hidden';
} else {
Input42.style.visibility = 'visible';
}
var Input43 = document.getElementById('INPUT43');
if(x[35].getAttribute('VALUE') != '0') {
Input43.style.visibility = 'hidden';
} else {
Input43.style.visibility = 'visible';
}
var Input44 = document.getElementById('INPUT44');
if(x[31].getAttribute('VALUE') == '0') {
Input44.style.visibility = 'hidden';
} else {
Input44.style.visibility = 'visible';
}
var Input45 = document.getElementById('INPUT45');
Input45.value = x[36].getAttribute('VALUE');
var Input46 = document.getElementById('INPUT46');
if(x[31].getAttribute('VALUE') == '0') {
Input46.style.display = 'none';
} else {
Input46.style.display = 'block';
}
var Input47 = document.getElementById('INPUT47');
if(x[0].getAttribute('VALUE') == '0') {
Input47.style.visibility = 'hidden';
} else {
Input47.style.visibility = 'visible';
}
var Input48 = document.getElementById('INPUT48');
if(x[37].getAttribute('VALUE') == '0') {
Input48.style.visibility = 'hidden';
} else {
Input48.style.visibility = 'visible';
}
var Input49 = document.getElementById('INPUT49');
Input49.value = x[38].getAttribute('VALUE');
if(x[0].getAttribute('VALUE') == '0') {
Input49.style.visibility = 'hidden';
} else {
Input49.style.visibility = 'visible';
}
var Input51 = document.getElementById('INPUT51');
if(x[39].getAttribute('VALUE') != '0') {
Input51.style.display = 'none';
} else {
Input51.style.display = 'block';
}
var Input56 = document.getElementById('INPUT56');
if(x[2].getAttribute('VALUE') == '0') {
Input56.style.display = 'none';
} else {
Input56.style.display = 'block';
}
var Input57 = document.getElementById('INPUT57');
if(x[3].getAttribute('VALUE') == '0') {
Input57.style.display = 'none';
} else {
Input57.style.display = 'block';
}
var Input58 = document.getElementById('INPUT58');
if(x[10].getAttribute('VALUE') == '0') {
Input58.style.display = 'none';
} else {
Input58.style.display = 'block';
}
var Input59 = document.getElementById('INPUT59');
if(x[11].getAttribute('VALUE') != '0') {
Input59.style.display = 'none';
} else {
Input59.style.display = 'block';
}
var Input60 = document.getElementById('INPUT60');
if(x[12].getAttribute('VALUE') == '0') {
Input60.style.display = 'none';
} else {
Input60.style.display = 'block';
}
var Input61 = document.getElementById('INPUT61');
if(x[0].getAttribute('VALUE') == '0') {
Input61.style.display = 'none';
} else {
Input61.style.display = 'block';
}
} else {document.location.reload(true); return;}
} catch(err) {console.log(err.message)}
if(pd!=''){setTimeout("GetXML('PAGE61.XML','"+pd+"')",1);}else{setTimeout("GetXML('PAGE61.XML')",1000);}}
function FunWatchDog() {
if(gWatchDog > 0 || g_postInProgress) {
gWatchDog = 0;
} else {
document.location.reload(true);
}
setTimeout("FunWatchDog()", 20000);
}

function PostXML38() {
PostXML('PAGE61.XML', encodeURIComponent('__R6866.5_BOOL_i=1')); 
SetBg('INPUT38', '48GRE.GIF');
setTimeout("SetBg('INPUT38', '48WHI.GIF');",500);
}
function PostXML46() {
PostXML('PAGE61.XML', encodeURIComponent('__R6866.5_BOOL_i=1')); 
SetBg('INPUT46', '48GRE.GIF');
setTimeout("SetBg('INPUT46', '48WHI.GIF');",500);
}
function PostXML50() {
PostXML('PAGE61.XML', encodeURIComponent('__R6495.7_BOOL_i=1')); 
SetBg('INPUT50', 'STOP.PNG');
setTimeout("SetBg('INPUT50', 'STOP.PNG');",500);
}
function PostXML51() {
PostXML('PAGE61.XML', encodeURIComponent('__R6496.0_BOOL_i=1')); 
SetBg('INPUT51', 'STOP.PNG');
setTimeout("SetBg('INPUT51', 'STOP.PNG');",500);
}
function PostXML52() {
PostXML('PAGE61.XML', encodeURIComponent('__R6495.6_BOOL_i=1')); 
SetBg('INPUT52', 'STOP.PNG');
setTimeout("SetBg('INPUT52', 'STOP.PNG');",500);
}
function PostXML53() {
PostXML('PAGE61.XML', encodeURIComponent('__R6496.1_BOOL_i=1')); 
SetBg('INPUT53', 'STOP.PNG');
setTimeout("SetBg('INPUT53', 'STOP.PNG');",500);
}
function PostXML54() {
PostXML('PAGE61.XML', encodeURIComponent('__R6496.2_BOOL_i=1')); 
SetBg('INPUT54', 'STOP.PNG');
setTimeout("SetBg('INPUT54', 'STOP.PNG');",500);
}
function PostXML55() {
PostXML('PAGE61.XML', encodeURIComponent('__R6495.5_BOOL_i=1')); 
SetBg('INPUT55', 'STOP.PNG');
setTimeout("SetBg('INPUT55', 'STOP.PNG');",500);
}
function PostXML56() {
PostXML('PAGE61.XML', encodeURIComponent('__R6496.4_BOOL_i=1')); 
SetBg('INPUT56', 'STOP.PNG');
setTimeout("SetBg('INPUT56', 'STOP.PNG');",500);
}
function PostXML57() {
PostXML('PAGE61.XML', encodeURIComponent('__R6496.5_BOOL_i=1')); 
SetBg('INPUT57', 'STOP.PNG');
setTimeout("SetBg('INPUT57', 'STOP.PNG');",500);
}
function PostXML58() {
PostXML('PAGE61.XML', encodeURIComponent('__R6496.6_BOOL_i=1')); 
SetBg('INPUT58', 'STOP.PNG');
setTimeout("SetBg('INPUT58', 'STOP.PNG');",500);
}
function PostXML59() {
PostXML('PAGE61.XML', encodeURIComponent('__R6496.7_BOOL_i=1')); 
SetBg('INPUT59', 'STOP.PNG');
setTimeout("SetBg('INPUT59', 'STOP.PNG');",500);
}
function PostXML60() {
PostXML('PAGE61.XML', encodeURIComponent('__R6497.0_BOOL_i=1')); 
SetBg('INPUT60', 'STOP.PNG');
setTimeout("SetBg('INPUT60', 'STOP.PNG');",500);
}
function PostXML61() {
PostXML('PAGE61.XML', encodeURIComponent('__R6497.1_BOOL_i=1')); 
SetBg('INPUT61', 'STOP.PNG');
setTimeout("SetBg('INPUT61', 'STOP.PNG');",500);
}

function PostGlobal() {
}
