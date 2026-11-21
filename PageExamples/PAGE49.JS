
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
if(x[1].getAttribute('VALUE') != '0') {
Input2.style.visibility = 'hidden';
} else {
Input2.style.visibility = 'visible';
}
var Input3 = document.getElementById('INPUT3');
if(x[1].getAttribute('VALUE') != '0') {
Input3.style.visibility = 'hidden';
} else {
Input3.style.visibility = 'visible';
}
var Input4 = document.getElementById('INPUT4');
if(x[3].getAttribute('VALUE') == '0') {
SetBg('INPUT4', 'VENTIL_1.GIF');
} else {
SetBg('INPUT4', 'VENTIL_2.GIF');
}
if(x[2].getAttribute('VALUE') == '0') {
Input4.style.display = 'none';
} else {
Input4.style.display = 'block';
}
var Input5 = document.getElementById('INPUT5');
if(x[4].getAttribute('VALUE') == '0') {
SetBg('INPUT5', 'OBEHOV_2.GIF');
} else {
SetBg('INPUT5', 'OBEHOV_3.GIF');
}
var Input6 = document.getElementById('INPUT6');
if(x[5].getAttribute('VALUE') == '0') {
SetBg('INPUT6', 'KOMPRE_1.GIF');
} else {
SetBg('INPUT6', 'KOMPRE_2.GIF');
}
var Input7 = document.getElementById('INPUT7');
if(x[6].getAttribute('VALUE') == '0') {
SetBg('INPUT7', 'SNEHUL_1.GIF');
} else {
SetBg('INPUT7', 'SLUNIC_1.GIF');
}
var Input8 = document.getElementById('INPUT8');
Input8.value = x[7].getAttribute('VALUE');
var Input9 = document.getElementById('INPUT9');
Input9.value = x[9].getAttribute('VALUE');
if(x[8].getAttribute('VALUE') == '0') {
Input9.style.visibility = 'hidden';
} else {
Input9.style.visibility = 'visible';
}
var Input10 = document.getElementById('INPUT10');
if(x[10].getAttribute('VALUE') == '0') {
Input10.style.visibility = 'hidden';
} else {
Input10.style.visibility = 'visible';
}
var Input11 = document.getElementById('INPUT11');
Input11.value = x[11].getAttribute('VALUE');
var Input12 = document.getElementById('INPUT12');
if(x[10].getAttribute('VALUE') == '0') {
Input12.style.display = 'none';
} else {
Input12.style.display = 'block';
}
var Input13 = document.getElementById('INPUT13');
var Input13h = document.getElementById('INPUT13h');
if(Input13h) { vz = x[12].getAttribute('VALUE') == '0'; iz = Input13h.value == '0';
if(vz == iz) {
if(vz) {
Input13h.value = '1';
Input13.style.backgroundImage = 'url("IMAGES/48WHI.GIF")';
if(Input13.getAttribute('value') != null) {Input13.value = 'AT';} else {Input13.innerHTML = 'AT';}
} else {
Input13h.value = '0';
Input13.style.backgroundImage = 'url("IMAGES/48GRE.GIF")';
if(Input13.getAttribute('value') != null) {Input13.value = 'AT';
} else {Input13.innerHTML = 'AT';}
}}} else {
if(x[12].getAttribute('VALUE') == '0') {
SetBg('INPUT13', '48WHI.GIF');
Input13.innerHTML = 'AT';
} else {
SetBg('INPUT13', '48GRE.GIF');
Input13.innerHTML = 'AT';
}}
var Input14 = document.getElementById('INPUT14');
if(x[12].getAttribute('VALUE') == '0') {
SetBg('INPUT14', '48WHI.GIF');
Input14.innerHTML = 'x';
} else {
SetBg('INPUT14', '48GRE.GIF');
Input14.innerHTML = 'x';
}
if(x[13].getAttribute('VALUE') != '0') {
Input14.style.display = 'none';
} else {
Input14.style.display = 'block';
}
var Input15 = document.getElementById('INPUT15');
var Input15h = document.getElementById('INPUT15h');
if(Input15h) { vz = x[14].getAttribute('VALUE') == '0'; iz = Input15h.value == '0';
if(vz == iz) {
if(vz) {
Input15h.value = '1';
Input15.style.backgroundImage = 'url("IMAGES/48WHI.GIF")';
if(Input15.getAttribute('value') != null) {Input15.value = 'EKV';} else {Input15.innerHTML = 'EKV';}
} else {
Input15h.value = '0';
Input15.style.backgroundImage = 'url("IMAGES/48GRE.GIF")';
if(Input15.getAttribute('value') != null) {Input15.value = 'EKV';
} else {Input15.innerHTML = 'EKV';}
}}} else {
if(x[14].getAttribute('VALUE') == '0') {
SetBg('INPUT15', '48WHI.GIF');
Input15.innerHTML = 'EKV';
} else {
SetBg('INPUT15', '48GRE.GIF');
Input15.innerHTML = 'EKV';
}}
var Input16 = document.getElementById('INPUT16');
var Input16h = document.getElementById('INPUT16h');
if(Input16h) { vz = x[15].getAttribute('VALUE') == '0'; iz = Input16h.value == '0';
if(vz == iz) {
if(vz) {
Input16h.value = '1';
Input16.style.backgroundImage = 'url("IMAGES/48WHI.GIF")';
if(Input16.getAttribute('value') != null) {Input16.value = 'ST';} else {Input16.innerHTML = 'ST';}
} else {
Input16h.value = '0';
Input16.style.backgroundImage = 'url("IMAGES/48GRE.GIF")';
if(Input16.getAttribute('value') != null) {Input16.value = 'ST';
} else {Input16.innerHTML = 'ST';}
}}} else {
if(x[15].getAttribute('VALUE') == '0') {
SetBg('INPUT16', '48WHI.GIF');
Input16.innerHTML = 'ST';
} else {
SetBg('INPUT16', '48GRE.GIF');
Input16.innerHTML = 'ST';
}}
var Input17 = document.getElementById('INPUT17');
var Input17h = document.getElementById('INPUT17h');
if(Input17h) { vz = x[16].getAttribute('VALUE') == '0'; iz = Input17h.value == '0';
if(vz == iz) {
if(vz) {
Input17h.value = '1';
Input17.style.backgroundImage = 'url("IMAGES/48WHI.GIF")';
if(Input17.getAttribute('value') != null) {Input17.value = 'AUT';} else {Input17.innerHTML = 'AUT';}
} else {
Input17h.value = '0';
Input17.style.backgroundImage = 'url("IMAGES/48GRE.GIF")';
if(Input17.getAttribute('value') != null) {Input17.value = 'AUT';
} else {Input17.innerHTML = 'AUT';}
}}} else {
if(x[16].getAttribute('VALUE') == '0') {
SetBg('INPUT17', '48WHI.GIF');
Input17.innerHTML = 'AUT';
} else {
SetBg('INPUT17', '48GRE.GIF');
Input17.innerHTML = 'AUT';
}}
var Input18 = document.getElementById('INPUT18');
var Input18h = document.getElementById('INPUT18h');
if(Input18h) { vz = x[17].getAttribute('VALUE') == '0'; iz = Input18h.value == '0';
if(vz == iz) {
if(vz) {
Input18h.value = '1';
Input18.style.backgroundImage = 'url("IMAGES/48WHI.GIF")';
if(Input18.getAttribute('value') != null) {Input18.value = 'TČ';} else {Input18.innerHTML = 'TČ';}
} else {
Input18h.value = '0';
Input18.style.backgroundImage = 'url("IMAGES/48GRE.GIF")';
if(Input18.getAttribute('value') != null) {Input18.value = 'TČ';
} else {Input18.innerHTML = 'TČ';}
}}} else {
if(x[17].getAttribute('VALUE') == '0') {
SetBg('INPUT18', '48WHI.GIF');
Input18.innerHTML = 'TČ';
} else {
SetBg('INPUT18', '48GRE.GIF');
Input18.innerHTML = 'TČ';
}}
var Input19 = document.getElementById('INPUT19');
var Input19h = document.getElementById('INPUT19h');
if(Input19h) { vz = x[18].getAttribute('VALUE') == '0'; iz = Input19h.value == '0';
if(vz == iz) {
if(vz) {
Input19h.value = '1';
Input19.style.backgroundImage = 'url("IMAGES/48WHI.GIF")';
if(Input19.getAttribute('value') != null) {Input19.value = 'BIV';} else {Input19.innerHTML = 'BIV';}
} else {
Input19h.value = '0';
Input19.style.backgroundImage = 'url("IMAGES/48GRE.GIF")';
if(Input19.getAttribute('value') != null) {Input19.value = 'BIV';
} else {Input19.innerHTML = 'BIV';}
}}} else {
if(x[18].getAttribute('VALUE') == '0') {
SetBg('INPUT19', '48WHI.GIF');
Input19.innerHTML = 'BIV';
} else {
SetBg('INPUT19', '48GRE.GIF');
Input19.innerHTML = 'BIV';
}}
var Input20 = document.getElementById('INPUT20');
var Input20h = document.getElementById('INPUT20h');
if(Input20h) { vz = x[19].getAttribute('VALUE') == '0'; iz = Input20h.value == '0';
if(vz == iz) {
if(vz) {
Input20h.value = '1';
Input20.style.backgroundImage = 'url("IMAGES/48WHI.GIF")';
if(Input20.getAttribute('value') != null) {Input20.value = 'VYP';} else {Input20.innerHTML = 'VYP';}
} else {
Input20h.value = '0';
Input20.style.backgroundImage = 'url("IMAGES/48GRE.GIF")';
if(Input20.getAttribute('value') != null) {Input20.value = 'VYP';
} else {Input20.innerHTML = 'VYP';}
}}} else {
if(x[19].getAttribute('VALUE') == '0') {
SetBg('INPUT20', '48WHI.GIF');
Input20.innerHTML = 'VYP';
} else {
SetBg('INPUT20', '48GRE.GIF');
Input20.innerHTML = 'VYP';
}}
var Input21 = document.getElementById('INPUT21');
Input21.value = x[20].getAttribute('VALUE');
var Input22 = document.getElementById('INPUT22');
Input22.value = x[21].getAttribute('VALUE');
var Input23 = document.getElementById('INPUT23');
if(x[22].getAttribute('VALUE') == '0') {
Input23.style.visibility = 'hidden';
} else {
Input23.style.visibility = 'visible';
}
var Input24 = document.getElementById('INPUT24');
if(x[23].getAttribute('VALUE') == '0') {
Input24.style.visibility = 'hidden';
} else {
Input24.style.visibility = 'visible';
}
var Input25 = document.getElementById('INPUT25');
if(!InputEdited[24]) {
UpdateValue(Input25, x[24], '#000000');}
var Input25x = document.getElementById('INPUT25x');
if(x[23].getAttribute('VALUE') == '0') {
if(Input25x) Input25x.style.visibility = 'hidden';
Input25.style.display = 'none';
} else {
Input25.style.display = 'inline';
}
var Input26 = document.getElementById('INPUT26');
if(x[25].getAttribute('VALUE') == '0') {
Input26.style.visibility = 'hidden';
} else {
Input26.style.visibility = 'visible';
}
var Input27 = document.getElementById('INPUT27');
Input27.value = x[26].getAttribute('VALUE');
if(x[23].getAttribute('VALUE') == '0') {
Input27.style.visibility = 'hidden';
} else {
Input27.style.visibility = 'visible';
}
var Input28 = document.getElementById('INPUT28');
Input28.value = x[27].getAttribute('VALUE');
if(x[23].getAttribute('VALUE') == '0') {
Input28.style.visibility = 'hidden';
} else {
Input28.style.visibility = 'visible';
}
var Input29 = document.getElementById('INPUT29');
if(x[28].getAttribute('VALUE') == '0') {
Input29.style.visibility = 'hidden';
} else {
Input29.style.visibility = 'visible';
}
var Input30 = document.getElementById('INPUT30');
if(x[29].getAttribute('VALUE') == '0') {
Input30.style.visibility = 'hidden';
} else {
Input30.style.visibility = 'visible';
}
var Input31 = document.getElementById('INPUT31');
if(x[30].getAttribute('VALUE') != '0') {
Input31.style.visibility = 'hidden';
} else {
Input31.style.visibility = 'visible';
}
var Input32 = document.getElementById('INPUT32');
Input32.value = x[31].getAttribute('VALUE');
var Input33 = document.getElementById('INPUT33');
if(x[15].getAttribute('VALUE') == '0') {
Input33.style.visibility = 'hidden';
} else {
Input33.style.visibility = 'visible';
}
var Input34 = document.getElementById('INPUT34');
if(!InputEdited[33]) {
UpdateValue(Input34, x[32], '#000000');}
var Input34x = document.getElementById('INPUT34x');
if(x[15].getAttribute('VALUE') == '0') {
if(Input34x) Input34x.style.visibility = 'hidden';
Input34.style.display = 'none';
} else {
Input34.style.display = 'inline';
}
var Input35 = document.getElementById('INPUT35');
Input35.value = x[33].getAttribute('VALUE');
var Input36 = document.getElementById('INPUT36');
if(x[34].getAttribute('VALUE') == '0') {
Input36.style.visibility = 'hidden';
} else {
Input36.style.visibility = 'visible';
}
var Input37 = document.getElementById('INPUT37');
if(x[35].getAttribute('VALUE') == '0') {
Input37.style.visibility = 'hidden';
} else {
Input37.style.visibility = 'visible';
}
var Input38 = document.getElementById('INPUT38');
if(!InputEdited[37]) {
UpdateValue(Input38, x[36], '#000000');}
var Input38x = document.getElementById('INPUT38x');
if(x[35].getAttribute('VALUE') == '0') {
if(Input38x) Input38x.style.visibility = 'hidden';
Input38.style.display = 'none';
} else {
Input38.style.display = 'inline';
}
var Input39 = document.getElementById('INPUT39');
Input39.value = x[37].getAttribute('VALUE');
if(x[35].getAttribute('VALUE') == '0') {
Input39.style.visibility = 'hidden';
} else {
Input39.style.visibility = 'visible';
}
var Input40 = document.getElementById('INPUT40');
Input40.value = x[38].getAttribute('VALUE');
if(x[35].getAttribute('VALUE') == '0') {
Input40.style.visibility = 'hidden';
} else {
Input40.style.visibility = 'visible';
}
var Input41 = document.getElementById('INPUT41');
if(x[39].getAttribute('VALUE') == '0') {
Input41.style.visibility = 'hidden';
} else {
Input41.style.visibility = 'visible';
}
var Input42 = document.getElementById('INPUT42');
Input42.value = x[40].getAttribute('VALUE');
var Input43 = document.getElementById('INPUT43');
if(x[41].getAttribute('VALUE') == '0') {
Input43.style.visibility = 'hidden';
} else {
Input43.style.visibility = 'visible';
}
var Input44 = document.getElementById('INPUT44');
Input44.value = x[42].getAttribute('VALUE');
var Input45 = document.getElementById('INPUT45');
Input45.value = x[43].getAttribute('VALUE');
var Input46 = document.getElementById('INPUT46');
if(x[44].getAttribute('VALUE') == '0') {
Input46.style.visibility = 'hidden';
} else {
Input46.style.visibility = 'visible';
}
var Input47 = document.getElementById('INPUT47');
if(!InputEdited[46]) {
UpdateValue(Input47, x[45], '#000000');}
var Input48 = document.getElementById('INPUT48');
Input48.value = x[46].getAttribute('VALUE');
var Input49 = document.getElementById('INPUT49');
if(!InputEdited[48]) {
UpdateValue(Input49, x[47], '#000000');}
var Input50 = document.getElementById('INPUT50');
Input50.value = x[48].getAttribute('VALUE');
var Input51 = document.getElementById('INPUT51');
if(x[50].getAttribute('VALUE') == '0') {
SetBg('INPUT51', 'TIME_D_1.PNG');
} else {
SetBg('INPUT51', 'TIME.PNG');
}
if(x[49].getAttribute('VALUE') == '0') {
Input51.style.display = 'none';
} else {
Input51.style.display = 'block';
}
var Input52 = document.getElementById('INPUT52');
if(x[51].getAttribute('VALUE') == '0') {
Input52.style.visibility = 'hidden';
} else {
Input52.style.visibility = 'visible';
}
var Input53 = document.getElementById('INPUT53');
if(x[52].getAttribute('VALUE') == '0') {
Input53.style.visibility = 'hidden';
} else {
Input53.style.visibility = 'visible';
}
var Input54 = document.getElementById('INPUT54');
var Input54h = document.getElementById('INPUT54h');
if(Input54h) { vz = x[53].getAttribute('VALUE') == '0'; iz = Input54h.value == '0';
if(vz == iz) {
if(vz) {
Input54h.value = '1';
Input54.style.backgroundImage = 'url("IMAGES/CHECK0.GIF")';
if(Input54.getAttribute('value') != null) {Input54.value = '';} else {}
} else {
Input54h.value = '0';
Input54.style.backgroundImage = 'url("IMAGES/CHECK1.GIF")';
if(Input54.getAttribute('value') != null) {Input54.value = '';
} else {}
}}} else {
if(x[53].getAttribute('VALUE') == '0') {
SetBg('INPUT54', 'CHECK0.GIF');
} else {
SetBg('INPUT54', 'CHECK1.GIF');
}}
if(x[52].getAttribute('VALUE') == '0') {
Input54.style.display = 'none';
} else {
Input54.style.display = 'block';
}
var Input55 = document.getElementById('INPUT55');
if(x[54].getAttribute('VALUE') != '0') {
Input55.style.visibility = 'hidden';
} else {
Input55.style.visibility = 'visible';
}
var Input56 = document.getElementById('INPUT56');
var Input56h = document.getElementById('INPUT56h');
if(Input56h) { vz = x[55].getAttribute('VALUE') == '0'; iz = Input56h.value == '0';
if(vz == iz) {
if(vz) {
Input56h.value = '1';
Input56.style.backgroundImage = 'url("IMAGES/CHECK0.GIF")';
if(Input56.getAttribute('value') != null) {Input56.value = '';} else {}
} else {
Input56h.value = '0';
Input56.style.backgroundImage = 'url("IMAGES/CHECK1.GIF")';
if(Input56.getAttribute('value') != null) {Input56.value = '';
} else {}
}}} else {
if(x[55].getAttribute('VALUE') == '0') {
SetBg('INPUT56', 'CHECK0.GIF');
} else {
SetBg('INPUT56', 'CHECK1.GIF');
}}
var Input57 = document.getElementById('INPUT57');
if(x[56].getAttribute('VALUE') != '0') {
Input57.style.visibility = 'hidden';
} else {
Input57.style.visibility = 'visible';
}
var Input58 = document.getElementById('INPUT58');
if(x[23].getAttribute('VALUE') != '0') {
Input58.style.visibility = 'hidden';
} else {
Input58.style.visibility = 'visible';
}
var Input59 = document.getElementById('INPUT59');
if(x[23].getAttribute('VALUE') != '0') {
Input59.style.visibility = 'hidden';
} else {
Input59.style.visibility = 'visible';
}
var Input60 = document.getElementById('INPUT60');
if(x[23].getAttribute('VALUE') != '0') {
Input60.style.visibility = 'hidden';
} else {
Input60.style.visibility = 'visible';
}
var Input61 = document.getElementById('INPUT61');
if(x[35].getAttribute('VALUE') != '0') {
Input61.style.visibility = 'hidden';
} else {
Input61.style.visibility = 'visible';
}
var Input62 = document.getElementById('INPUT62');
if(x[35].getAttribute('VALUE') != '0') {
Input62.style.visibility = 'hidden';
} else {
Input62.style.visibility = 'visible';
}
var Input63 = document.getElementById('INPUT63');
if(x[35].getAttribute('VALUE') != '0') {
Input63.style.visibility = 'hidden';
} else {
Input63.style.visibility = 'visible';
}
var Input64 = document.getElementById('INPUT64');
if(x[58].getAttribute('VALUE') == '0') {
SetBg('INPUT64', 'BIVALE_2.GIF');
} else {
SetBg('INPUT64', 'RECT3839.PNG');
}
if(x[57].getAttribute('VALUE') == '0') {
Input64.style.display = 'none';
} else {
Input64.style.display = 'block';
}
var Input65 = document.getElementById('INPUT65');
if(x[60].getAttribute('VALUE') == '0') {
SetBg('INPUT65', 'BIVALE_2.GIF');
} else {
SetBg('INPUT65', 'RECT3839.PNG');
}
if(x[59].getAttribute('VALUE') == '0') {
Input65.style.display = 'none';
} else {
Input65.style.display = 'block';
}
var Input66 = document.getElementById('INPUT66');
if(x[30].getAttribute('VALUE') == '0') {
Input66.style.visibility = 'hidden';
} else {
Input66.style.visibility = 'visible';
}
var Input67 = document.getElementById('INPUT67');
if(x[56].getAttribute('VALUE') != '0') {
Input67.style.visibility = 'hidden';
} else {
Input67.style.visibility = 'visible';
}
var Input68 = document.getElementById('INPUT68');
if(x[54].getAttribute('VALUE') != '0') {
Input68.style.visibility = 'hidden';
} else {
Input68.style.visibility = 'visible';
}
var Input69 = document.getElementById('INPUT69');
if(x[61].getAttribute('VALUE') == '0') {
SetBg('INPUT69', 'OBEHOV_2.GIF');
Input69.innerHTML = '2';
} else {
SetBg('INPUT69', 'OB5235_1.GIF');
Input69.innerHTML = '2';
}
if(x[25].getAttribute('VALUE') == '0') {
Input69.style.display = 'none';
} else {
Input69.style.display = 'block';
}
var Input70 = document.getElementById('INPUT70');
if(x[62].getAttribute('VALUE') == '0') {
SetBg('INPUT70', 'OBEHOV_2.GIF');
Input70.innerHTML = '1';
} else {
SetBg('INPUT70', 'OB5235_1.GIF');
Input70.innerHTML = '1';
}
if(x[30].getAttribute('VALUE') == '0') {
Input70.style.display = 'none';
} else {
Input70.style.display = 'block';
}
var Input71 = document.getElementById('INPUT71');
if(x[63].getAttribute('VALUE') == '0') {
SetBg('INPUT71', 'RECT3252.PNG');
} else {
SetBg('INPUT71', 'RECT3251.PNG');
}
if(x[54].getAttribute('VALUE') == '0') {
Input71.style.display = 'none';
} else {
Input71.style.display = 'block';
}
var Input72 = document.getElementById('INPUT72');
if(!InputEdited[71]) {
UpdateValue(Input72, x[64], '#000000');}
var Input73 = document.getElementById('INPUT73');
if(!InputEdited[72]) {
UpdateValue(Input73, x[65], '#000000');}
var Input74 = document.getElementById('INPUT74');
var Input74h = document.getElementById('INPUT74h');
if(Input74h) { vz = x[66].getAttribute('VALUE') == '0'; iz = Input74h.value == '0';
if(vz == iz) {
if(vz) {
Input74h.value = '1';
Input74.style.backgroundImage = 'url("IMAGES/CHECK0.GIF")';
if(Input74.getAttribute('value') != null) {Input74.value = '';} else {}
} else {
Input74h.value = '0';
Input74.style.backgroundImage = 'url("IMAGES/CHECK1.GIF")';
if(Input74.getAttribute('value') != null) {Input74.value = '';
} else {}
}}} else {
if(x[66].getAttribute('VALUE') == '0') {
SetBg('INPUT74', 'CHECK0.GIF');
} else {
SetBg('INPUT74', 'CHECK1.GIF');
}}
var Input75 = document.getElementById('INPUT75');
if(x[67].getAttribute('VALUE') == '0') {
Input75.style.visibility = 'hidden';
} else {
Input75.style.visibility = 'visible';
}
var Input76 = document.getElementById('INPUT76');
var Input76h = document.getElementById('INPUT76h');
if(Input76h) { vz = x[69].getAttribute('VALUE') == '0'; iz = Input76h.value == '0';
if(vz == iz) {
if(vz) {
Input76h.value = '1';
Input76.style.backgroundImage = 'url("IMAGES/MENU-S_1.GIF")';
if(Input76.getAttribute('value') != null) {Input76.value = 'Solár';} else {Input76.innerHTML = 'Solár';}
} else {
Input76h.value = '0';
Input76.style.backgroundImage = 'url("IMAGES/MENU-S_1.GIF")';
if(Input76.getAttribute('value') != null) {Input76.value = 'Solár';
} else {Input76.innerHTML = 'Solár';}
}}} else {
if(x[69].getAttribute('VALUE') == '0') {
SetBg('INPUT76', 'MENU-S_1.GIF');
Input76.innerHTML = 'Solár';
} else {
SetBg('INPUT76', 'MENU-S_1.GIF');
Input76.innerHTML = 'Solár';
}}
if(x[68].getAttribute('VALUE') == '0') {
Input76.style.display = 'none';
} else {
Input76.style.display = 'block';
}
var Input77 = document.getElementById('INPUT77');
var Input77h = document.getElementById('INPUT77h');
if(Input77h) { vz = x[71].getAttribute('VALUE') == '0'; iz = Input77h.value == '0';
if(vz == iz) {
if(vz) {
Input77h.value = '1';
Input77.style.backgroundImage = 'url("IMAGES/MENU-S_1.GIF")';
if(Input77.getAttribute('value') != null) {Input77.value = 'Bazén';} else {Input77.innerHTML = 'Bazén';}
} else {
Input77h.value = '0';
Input77.style.backgroundImage = 'url("IMAGES/MENU-S_1.GIF")';
if(Input77.getAttribute('value') != null) {Input77.value = 'Bazén';
} else {Input77.innerHTML = 'Bazén';}
}}} else {
if(x[71].getAttribute('VALUE') == '0') {
SetBg('INPUT77', 'MENU-S_1.GIF');
Input77.innerHTML = 'Bazén';
} else {
SetBg('INPUT77', 'MENU-S_1.GIF');
Input77.innerHTML = 'Bazén';
}}
if(x[70].getAttribute('VALUE') == '0') {
Input77.style.display = 'none';
} else {
Input77.style.display = 'block';
}
var Input78 = document.getElementById('INPUT78');
if(x[2].getAttribute('VALUE') != '0') {
Input78.style.visibility = 'hidden';
} else {
Input78.style.visibility = 'visible';
}
var Input79 = document.getElementById('INPUT79');
Input79.value = x[72].getAttribute('VALUE');
if(x[2].getAttribute('VALUE') != '0') {
Input79.style.visibility = 'hidden';
} else {
Input79.style.visibility = 'visible';
}
var Input80 = document.getElementById('INPUT80');
if(x[73].getAttribute('VALUE') == '0') {
Input80.style.visibility = 'hidden';
} else {
Input80.style.visibility = 'visible';
}
var Input81 = document.getElementById('INPUT81');
if(x[74].getAttribute('VALUE') == '0') {
SetBg('INPUT81', 'OBEHOV_2.GIF');
} else {
SetBg('INPUT81', 'OBEHOV_5.GIF');
}
if(x[2].getAttribute('VALUE') != '0') {
Input81.style.display = 'none';
} else {
Input81.style.display = 'block';
}
var Input82 = document.getElementById('INPUT82');
if(x[25].getAttribute('VALUE') != '0') {
Input82.style.visibility = 'hidden';
} else {
Input82.style.visibility = 'visible';
}
var Input83 = document.getElementById('INPUT83');
if(x[3].getAttribute('VALUE') == '0') {
SetBg('INPUT83', 'VENTIL_1.GIF');
} else {
SetBg('INPUT83', 'VENTIL_2.GIF');
}
if(x[75].getAttribute('VALUE') == '0') {
Input83.style.display = 'none';
} else {
Input83.style.display = 'block';
}
var Input84 = document.getElementById('INPUT84');
if(x[76].getAttribute('VALUE') == '0') {
Input84.style.visibility = 'hidden';
} else {
Input84.style.visibility = 'visible';
}
var Input85 = document.getElementById('INPUT85');
if(x[76].getAttribute('VALUE') == '0') {
Input85.style.visibility = 'hidden';
} else {
Input85.style.visibility = 'visible';
}
var Input86 = document.getElementById('INPUT86');
if(x[71].getAttribute('VALUE') == '0') {
Input86.style.visibility = 'hidden';
} else {
Input86.style.visibility = 'visible';
}
var Input87 = document.getElementById('INPUT87');
if(x[71].getAttribute('VALUE') == '0') {
Input87.style.visibility = 'hidden';
} else {
Input87.style.visibility = 'visible';
}
var Input88 = document.getElementById('INPUT88');
var Input88h = document.getElementById('INPUT88h');
if(Input88h) { vz = x[71].getAttribute('VALUE') == '0'; iz = Input88h.value == '0';
if(vz == iz) {
if(vz) {
Input88h.value = '1';
Input88.style.backgroundImage = '';
if(Input88.getAttribute('value') != null) {Input88.value = 'x';} else {Input88.innerHTML = 'x';}
} else {
Input88h.value = '0';
Input88.style.backgroundImage = '';
if(Input88.getAttribute('value') != null) {Input88.value = 'x';
} else {Input88.innerHTML = 'x';}
}}} else {
if(x[71].getAttribute('VALUE') == '0') {
SetBg('INPUT88', '');
Input88.innerHTML = 'x';
} else {
SetBg('INPUT88', '');
Input88.innerHTML = 'x';
}}
if(x[71].getAttribute('VALUE') == '0') {
Input88.style.display = 'none';
} else {
Input88.style.display = 'block';
}
var Input89 = document.getElementById('INPUT89');
if(x[77].getAttribute('VALUE') == '0') {
SetBg('INPUT89', 'ODMRAZ_2.GIF');
} else {
SetBg('INPUT89', 'ODMRAZ_1.GIF');
}
if(x[76].getAttribute('VALUE') != '0') {
Input89.style.display = 'none';
} else {
Input89.style.display = 'block';
}
var Input90 = document.getElementById('INPUT90');
if(x[78].getAttribute('VALUE') == '0') {
SetBg('INPUT90', 'ODMRAZ_2.GIF');
} else {
SetBg('INPUT90', 'ODMRAZ_1.GIF');
}
if(x[75].getAttribute('VALUE') == '0') {
Input90.style.display = 'none';
} else {
Input90.style.display = 'block';
}
var Input91 = document.getElementById('INPUT91');
var Input91h = document.getElementById('INPUT91h');
if(Input91h) { vz = x[79].getAttribute('VALUE') == '0'; iz = Input91h.value == '0';
if(vz == iz) {
if(vz) {
Input91h.value = '1';
Input91.style.backgroundImage = '';
if(Input91.getAttribute('value') != null) {Input91.value = '';} else {}
} else {
Input91h.value = '0';
Input91.style.backgroundImage = 'url("IMAGES/ODMRAZ_1.GIF")';
if(Input91.getAttribute('value') != null) {Input91.value = '';
} else {}
}}} else {
if(x[79].getAttribute('VALUE') == '0') {
SetBg('INPUT91', '');
} else {
SetBg('INPUT91', 'ODMRAZ_1.GIF');
}}
if(x[76].getAttribute('VALUE') != '0') {
Input91.style.display = 'none';
} else {
Input91.style.display = 'block';
}
var Input92 = document.getElementById('INPUT92');
if(x[81].getAttribute('VALUE') == '0') {
SetBg('INPUT92', '3CEST__2.GIF');
} else {
SetBg('INPUT92', '3CEST__3.GIF');
}
if(x[80].getAttribute('VALUE') == '0') {
Input92.style.display = 'none';
} else {
Input92.style.display = 'block';
}
var Input93 = document.getElementById('INPUT93');
if(!InputEdited[92]) {
UpdateValue(Input93, x[83], '#000000');}
var Input93x = document.getElementById('INPUT93x');
if(x[82].getAttribute('VALUE') == '0') {
if(Input93x) Input93x.style.visibility = 'hidden';
Input93.style.display = 'none';
} else {
Input93.style.display = 'inline';
}
var Input94 = document.getElementById('INPUT94');
if(x[82].getAttribute('VALUE') == '0') {
Input94.style.visibility = 'hidden';
} else {
Input94.style.visibility = 'visible';
}
var Input95 = document.getElementById('INPUT95');
Input95.value = x[84].getAttribute('VALUE');
if(x[82].getAttribute('VALUE') == '0') {
Input95.style.visibility = 'hidden';
} else {
Input95.style.visibility = 'visible';
}
var Input96 = document.getElementById('INPUT96');
if(x[82].getAttribute('VALUE') == '0') {
Input96.style.visibility = 'hidden';
} else {
Input96.style.visibility = 'visible';
}
var Input97 = document.getElementById('INPUT97');
Input97.value = x[85].getAttribute('VALUE');
if(x[82].getAttribute('VALUE') == '0') {
Input97.style.visibility = 'hidden';
} else {
Input97.style.visibility = 'visible';
}
var Input98 = document.getElementById('INPUT98');
if(x[82].getAttribute('VALUE') == '0') {
Input98.style.visibility = 'hidden';
} else {
Input98.style.visibility = 'visible';
}
var Input99 = document.getElementById('INPUT99');
var Input99h = document.getElementById('INPUT99h');
if(Input99h) { vz = x[86].getAttribute('VALUE') == '0'; iz = Input99h.value == '0';
if(vz == iz) {
if(vz) {
Input99h.value = '1';
Input99.style.backgroundImage = 'url("IMAGES/48WHI.GIF")';
if(Input99.getAttribute('value') != null) {Input99.value = 'MAN';} else {Input99.innerHTML = 'MAN';}
} else {
Input99h.value = '0';
Input99.style.backgroundImage = 'url("IMAGES/48GRE.GIF")';
if(Input99.getAttribute('value') != null) {Input99.value = 'MAN';
} else {Input99.innerHTML = 'MAN';}
}}} else {
if(x[86].getAttribute('VALUE') == '0') {
SetBg('INPUT99', '48WHI.GIF');
Input99.innerHTML = 'MAN';
} else {
SetBg('INPUT99', '48GRE.GIF');
Input99.innerHTML = 'MAN';
}}
if(x[86].getAttribute('VALUE') == '0') {
Input99.style.display = 'none';
} else {
Input99.style.display = 'block';
}
var Input100 = document.getElementById('INPUT100');
if(x[87].getAttribute('VALUE') == '0') {
Input100.style.visibility = 'hidden';
} else {
Input100.style.visibility = 'visible';
}
var Input101 = document.getElementById('INPUT101');
if(x[71].getAttribute('VALUE') == '0') {
Input101.style.visibility = 'hidden';
} else {
Input101.style.visibility = 'visible';
}
var Input102 = document.getElementById('INPUT102');
Input102.value = x[88].getAttribute('VALUE');
if(x[71].getAttribute('VALUE') == '0') {
Input102.style.visibility = 'hidden';
} else {
Input102.style.visibility = 'visible';
}
var Input103 = document.getElementById('INPUT103');
var Input103h = document.getElementById('INPUT103h');
if(Input103h) { vz = x[89].getAttribute('VALUE') == '0'; iz = Input103h.value == '0';
if(vz == iz) {
if(vz) {
Input103h.value = '1';
Input103.style.backgroundImage = 'url("IMAGES/48WHI.GIF")';
if(Input103.getAttribute('value') != null) {Input103.value = 'VYP';} else {Input103.innerHTML = 'VYP';}
} else {
Input103h.value = '0';
Input103.style.backgroundImage = 'url("IMAGES/48GRE.GIF")';
if(Input103.getAttribute('value') != null) {Input103.value = 'ZAP';
} else {Input103.innerHTML = 'ZAP';}
}}} else {
if(x[89].getAttribute('VALUE') == '0') {
SetBg('INPUT103', '48WHI.GIF');
Input103.innerHTML = 'VYP';
} else {
SetBg('INPUT103', '48GRE.GIF');
Input103.innerHTML = 'ZAP';
}}
if(x[71].getAttribute('VALUE') == '0') {
Input103.style.display = 'none';
} else {
Input103.style.display = 'block';
}
var Input104 = document.getElementById('INPUT104');
if(x[90].getAttribute('VALUE') == '0') {
Input104.style.visibility = 'hidden';
} else {
Input104.style.visibility = 'visible';
}
var Input105 = document.getElementById('INPUT105');
if(x[71].getAttribute('VALUE') == '0') {
Input105.style.visibility = 'hidden';
} else {
Input105.style.visibility = 'visible';
}
var Input106 = document.getElementById('INPUT106');
if(x[91].getAttribute('VALUE') == '0') {
SetBg('INPUT106', 'OBEHOV_2.GIF');
} else {
SetBg('INPUT106', 'OBEHOV_1.GIF');
}
if(x[71].getAttribute('VALUE') == '0') {
Input106.style.display = 'none';
} else {
Input106.style.display = 'block';
}
var Input107 = document.getElementById('INPUT107');
if(!InputEdited[106]) {
UpdateValue(Input107, x[92], '#000000');}
var Input107x = document.getElementById('INPUT107x');
if(x[71].getAttribute('VALUE') == '0') {
if(Input107x) Input107x.style.visibility = 'hidden';
Input107.style.display = 'none';
} else {
Input107.style.display = 'inline';
}
var Input108 = document.getElementById('INPUT108');
if(x[93].getAttribute('VALUE') == '0') {
Input108.style.visibility = 'hidden';
} else {
Input108.style.visibility = 'visible';
}
var Input109 = document.getElementById('INPUT109');
if(x[94].getAttribute('VALUE') == '0') {
Input109.style.visibility = 'hidden';
} else {
Input109.style.visibility = 'visible';
}
var Input110 = document.getElementById('INPUT110');
if(x[25].getAttribute('VALUE') != '0') {
Input110.style.visibility = 'hidden';
} else {
Input110.style.visibility = 'visible';
}
var Input111 = document.getElementById('INPUT111');
if(x[25].getAttribute('VALUE') != '0') {
Input111.style.visibility = 'hidden';
} else {
Input111.style.visibility = 'visible';
}
var Input112 = document.getElementById('INPUT112');
if(x[95].getAttribute('VALUE') == '0') {
Input112.style.display = 'none';
} else {
Input112.style.display = 'block';
}
var Input113 = document.getElementById('INPUT113');
if(x[96].getAttribute('VALUE') == '0') {
Input113.style.visibility = 'hidden';
} else {
Input113.style.visibility = 'visible';
}
var Input114 = document.getElementById('INPUT114');
if(x[69].getAttribute('VALUE') == '0') {
Input114.style.visibility = 'hidden';
} else {
Input114.style.visibility = 'visible';
}
var Input115 = document.getElementById('INPUT115');
if(x[69].getAttribute('VALUE') == '0') {
Input115.style.visibility = 'hidden';
} else {
Input115.style.visibility = 'visible';
}
var Input116 = document.getElementById('INPUT116');
if(x[69].getAttribute('VALUE') == '0') {
Input116.style.visibility = 'hidden';
} else {
Input116.style.visibility = 'visible';
}
var Input117 = document.getElementById('INPUT117');
var Input117h = document.getElementById('INPUT117h');
if(Input117h) { vz = x[69].getAttribute('VALUE') == '0'; iz = Input117h.value == '0';
if(vz == iz) {
if(vz) {
Input117h.value = '1';
Input117.style.backgroundImage = '';
if(Input117.getAttribute('value') != null) {Input117.value = 'x';} else {Input117.innerHTML = 'x';}
} else {
Input117h.value = '0';
Input117.style.backgroundImage = '';
if(Input117.getAttribute('value') != null) {Input117.value = 'x';
} else {Input117.innerHTML = 'x';}
}}} else {
if(x[69].getAttribute('VALUE') == '0') {
SetBg('INPUT117', '');
Input117.innerHTML = 'x';
} else {
SetBg('INPUT117', '');
Input117.innerHTML = 'x';
}}
if(x[69].getAttribute('VALUE') == '0') {
Input117.style.display = 'none';
} else {
Input117.style.display = 'block';
}
var Input118 = document.getElementById('INPUT118');
var Input118h = document.getElementById('INPUT118h');
if(Input118h) { vz = x[97].getAttribute('VALUE') == '0'; iz = Input118h.value == '0';
if(vz == iz) {
if(vz) {
Input118h.value = '1';
Input118.style.backgroundImage = 'url("IMAGES/48WHI.GIF")';
if(Input118.getAttribute('value') != null) {Input118.value = 'VYP';} else {Input118.innerHTML = 'VYP';}
} else {
Input118h.value = '0';
Input118.style.backgroundImage = 'url("IMAGES/48GRE.GIF")';
if(Input118.getAttribute('value') != null) {Input118.value = 'ZAP';
} else {Input118.innerHTML = 'ZAP';}
}}} else {
if(x[97].getAttribute('VALUE') == '0') {
SetBg('INPUT118', '48WHI.GIF');
Input118.innerHTML = 'VYP';
} else {
SetBg('INPUT118', '48GRE.GIF');
Input118.innerHTML = 'ZAP';
}}
if(x[69].getAttribute('VALUE') == '0') {
Input118.style.display = 'none';
} else {
Input118.style.display = 'block';
}
var Input119 = document.getElementById('INPUT119');
Input119.value = x[98].getAttribute('VALUE');
if(x[69].getAttribute('VALUE') == '0') {
Input119.style.visibility = 'hidden';
} else {
Input119.style.visibility = 'visible';
}
var Input120 = document.getElementById('INPUT120');
if(x[99].getAttribute('VALUE') == '0') {
Input120.style.visibility = 'hidden';
} else {
Input120.style.visibility = 'visible';
}
var Input121 = document.getElementById('INPUT121');
if(x[100].getAttribute('VALUE') == '0') {
SetBg('INPUT121', 'OBEHOV_2.GIF');
} else {
SetBg('INPUT121', 'OBEHOV_5.GIF');
}
if(x[69].getAttribute('VALUE') == '0') {
Input121.style.display = 'none';
} else {
Input121.style.display = 'block';
}
var Input122 = document.getElementById('INPUT122');
if(x[94].getAttribute('VALUE') == '0') {
Input122.style.visibility = 'hidden';
} else {
Input122.style.visibility = 'visible';
}
var Input123 = document.getElementById('INPUT123');
if(x[94].getAttribute('VALUE') == '0') {
Input123.style.visibility = 'hidden';
} else {
Input123.style.visibility = 'visible';
}
var Input124 = document.getElementById('INPUT124');
if(x[94].getAttribute('VALUE') == '0') {
Input124.style.visibility = 'hidden';
} else {
Input124.style.visibility = 'visible';
}
} else {document.location.reload(true); return;}
} catch(err) {console.log(err.message)}
if(pd!=''){setTimeout("GetXML('PAGE49.XML','"+pd+"')",1);}else{setTimeout("GetXML('PAGE49.XML')",1000);}}
function FunWatchDog() {
if(gWatchDog > 0 || g_postInProgress) {
gWatchDog = 0;
} else {
document.location.reload(true);
}
setTimeout("FunWatchDog()", 20000);
}

function PostXML12() {
PostXML('PAGE49.XML', encodeURIComponent('__R6866.5_BOOL_i=1')); 
SetBg('INPUT12', '48GRE.GIF');
setTimeout("SetBg('INPUT12', '48WHI.GIF');",500);
}
function PostXML13() {
var Input13h = document.getElementById('INPUT13h');
PostXML('PAGE49.XML', encodeURIComponent(Input13h.name+'='+Input13h.value));
}
function PostXML15() {
var Input15h = document.getElementById('INPUT15h');
PostXML('PAGE49.XML', encodeURIComponent(Input15h.name+'='+Input15h.value));
}
function PostXML16() {
var Input16h = document.getElementById('INPUT16h');
PostXML('PAGE49.XML', encodeURIComponent(Input16h.name+'='+Input16h.value));
}
function PostXML17() {
var Input17h = document.getElementById('INPUT17h');
PostXML('PAGE49.XML', encodeURIComponent(Input17h.name+'='+Input17h.value));
}
function PostXML18() {
var Input18h = document.getElementById('INPUT18h');
PostXML('PAGE49.XML', encodeURIComponent(Input18h.name+'='+Input18h.value));
}
function PostXML19() {
var Input19h = document.getElementById('INPUT19h');
PostXML('PAGE49.XML', encodeURIComponent(Input19h.name+'='+Input19h.value));
}
function PostXML20() {
var Input20h = document.getElementById('INPUT20h');
PostXML('PAGE49.XML', encodeURIComponent(Input20h.name+'='+Input20h.value));
}
function PostXML25() {
var Input25 = document.getElementById('INPUT25');
document.getElementById('INPUT25x').style.visibility = 'hidden';if(InputEdited[24]) {
PostXML('PAGE49.XML', encodeURIComponent(Input25.name+'='+Input25.value)); InputEdited[24] = 0;
}
}
function PostXML34() {
var Input34 = document.getElementById('INPUT34');
document.getElementById('INPUT34x').style.visibility = 'hidden';if(InputEdited[33]) {
PostXML('PAGE49.XML', encodeURIComponent(Input34.name+'='+Input34.value)); InputEdited[33] = 0;
}
}
function PostXML38() {
var Input38 = document.getElementById('INPUT38');
document.getElementById('INPUT38x').style.visibility = 'hidden';if(InputEdited[37]) {
PostXML('PAGE49.XML', encodeURIComponent(Input38.name+'='+Input38.value)); InputEdited[37] = 0;
}
}
function PostXML47() {
var Input47 = document.getElementById('INPUT47');
document.getElementById('INPUT47x').style.visibility = 'hidden';if(InputEdited[46]) {
PostXML('PAGE49.XML', encodeURIComponent(Input47.name+'='+Input47.value)); InputEdited[46] = 0;
}
}
function PostXML49() {
var Input49 = document.getElementById('INPUT49');
document.getElementById('INPUT49x').style.visibility = 'hidden';if(InputEdited[48]) {
PostXML('PAGE49.XML', encodeURIComponent(Input49.name+'='+Input49.value)); InputEdited[48] = 0;
}
}
function PostXML54() {
var Input54h = document.getElementById('INPUT54h');
PostXML('PAGE49.XML', encodeURIComponent(Input54h.name+'='+Input54h.value));
}
function PostXML56() {
var Input56h = document.getElementById('INPUT56h');
PostXML('PAGE49.XML', encodeURIComponent(Input56h.name+'='+Input56h.value));
}
function PostXML72() {
var Input72 = document.getElementById('INPUT72');
document.getElementById('INPUT72x').style.visibility = 'hidden';if(InputEdited[71]) {
if(CheckValueLimits(Input72.value,2,'hh:mm','00:00','23:59')){PostXML('PAGE49.XML', encodeURIComponent(Input72.name+'='+Input72.value));} InputEdited[71] = 0;
}
}
function PostXML73() {
var Input73 = document.getElementById('INPUT73');
document.getElementById('INPUT73x').style.visibility = 'hidden';if(InputEdited[72]) {
if(CheckValueLimits(Input73.value,2,'hh:mm','00:00','23:59')){PostXML('PAGE49.XML', encodeURIComponent(Input73.name+'='+Input73.value));} InputEdited[72] = 0;
}
}
function PostXML74() {
var Input74h = document.getElementById('INPUT74h');
PostXML('PAGE49.XML', encodeURIComponent(Input74h.name+'='+Input74h.value));
}
function PostXML76() {
var Input76h = document.getElementById('INPUT76h');
PostXML('PAGE49.XML', encodeURIComponent(Input76h.name+'='+Input76h.value));
}
function PostXML77() {
var Input77h = document.getElementById('INPUT77h');
PostXML('PAGE49.XML', encodeURIComponent(Input77h.name+'='+Input77h.value));
}
function PostXML88() {
var Input88h = document.getElementById('INPUT88h');
PostXML('PAGE49.XML', encodeURIComponent(Input88h.name+'='+Input88h.value));
}
function PostXML91() {
var Input91h = document.getElementById('INPUT91h');
PostXML('PAGE49.XML', encodeURIComponent(Input91h.name+'='+Input91h.value));
}
function PostXML93() {
var Input93 = document.getElementById('INPUT93');
document.getElementById('INPUT93x').style.visibility = 'hidden';if(InputEdited[92]) {
PostXML('PAGE49.XML', encodeURIComponent(Input93.name+'='+Input93.value)); InputEdited[92] = 0;
}
}
function PostXML99() {
var Input99h = document.getElementById('INPUT99h');
PostXML('PAGE49.XML', encodeURIComponent(Input99h.name+'='+Input99h.value));
}
function PostXML103() {
var Input103h = document.getElementById('INPUT103h');
PostXML('PAGE49.XML', encodeURIComponent(Input103h.name+'='+Input103h.value));
}
function PostXML107() {
var Input107 = document.getElementById('INPUT107');
document.getElementById('INPUT107x').style.visibility = 'hidden';if(InputEdited[106]) {
if(CheckValueLimits(Input107.value,0,'(null)','0.0','45.0')){PostXML('PAGE49.XML', encodeURIComponent(Input107.name+'='+Input107.value));} InputEdited[106] = 0;
}
}
function PostXML112() {
PostXML('PAGE49.XML', encodeURIComponent('__R7292.6_BOOL_i=1')); 
SetBg('INPUT112', '');
setTimeout("SetBg('INPUT112', '');",500);
}
function PostXML117() {
var Input117h = document.getElementById('INPUT117h');
PostXML('PAGE49.XML', encodeURIComponent(Input117h.name+'='+Input117h.value));
}
function PostXML118() {
var Input118h = document.getElementById('INPUT118h');
PostXML('PAGE49.XML', encodeURIComponent(Input118h.name+'='+Input118h.value));
}

function PostGlobal() {
}
