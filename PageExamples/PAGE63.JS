
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
function ArrayToText(e,t){var n=[8364,65533,8218,65533,8222,8230,8224,8225,65533,8240,352,8249,346,356,381,377,65533,8216,8217,8220,8221,8226,8211,8212,65533,8482,353,8250,347,357,382,378,160,711,728,321,164,260,166,167,168,169,350,171,172,173,174,379,176,177,731,322,180,181,182,183,184,261,351,187,317,733,318,380,340,193,194,258,196,313,262,199,268,201,280,203,282,205,206,270,272,323,327,211,212,336,214,215,344,366,218,368,220,221,354,223,341,225,226,259,228,314,263,231,269,233,281,235,283,237,238,271,273,324,328,243,244,337,246,247,345,367,250,369,252,253,355,729];var r=e[t++];var i='';for(var s=0;s<r;s++){var o=e[t+s];if(o>127){i+=String.fromCharCode(n[o-128])}else{i+=String.fromCharCode(o)}}return i}
//160919.1
function decodeArrBase64(a){var d,e,f,g,h,i,j,b=[62,0,0,0,63,52,53,54,55,56,57,58,59,60,61,0,0,0,64,0,0,0,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,0,0,0,0,0,0,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51],c=[],k=0,l=0;for(a=a.replace(/[^A-Za-z0-9+\/=]/g,"");k<a.length;)g=b[a.charCodeAt(k++)-43],h=b[a.charCodeAt(k++)-43],i=b[a.charCodeAt(k++)-43],j=b[a.charCodeAt(k++)-43],d=g<<2|h>>4,e=(15&h)<<4|i>>2,f=(3&i)<<6|j,c[l++]=d,64!=i&&(c[l++]=e),64!=j&&(c[l++]=f);return c}
function getOffset(a){var b=0,c=0;do isNaN(a.offsetLeft)||(b+=a.offsetLeft),isNaN(a.offsetTop)||(c+=a.offsetTop);while(a=a.offsetParent);return{x:b,y:c}}
function GetReal(a,b){var c=128&a[b+3]?-1:1,d=((127&a[b+3])<<1)+(128&a[b+2]?1:0),e=((127&a[b+2])<<16)+(a[b+1]<<8)+a[b];return 0==d&&0==e?0:c*Math.pow(2,d-127)*parseFloat(1+e/8388608).toFixed(7)}
function GetWord(a,b){var c=a[b]+(a[b+1]<<8);return c>32767?-((65535&~c)+1):c}
function GetAngle(a,b){return GetReal(a,b)*Math.PI/180}
function SetCanvasFont(a,b){b.font=(1&a.s?"bold ":"")+(2&a.s?"italic ":"")+a.h+"px Verdana"}
function MultiLineText(a,b,c,d,e,f,g,h){for(var i=d.x,j=d.y,k=b.split("\n"),l=0,m=k.length*e,n=0;n<k.length;n++)l=Math.max(l,a.measureText(k[n]).width);64&c?(i-=l,d.x=i):128&c?(i-=l/2,256&c?d.y-=m:512&c||(d.y+=m)):d.x+=l,256&c&&(j-=m),512&c&&(j-=m/2);var o=i;16&c?(a.textAlign="right",o+=l):32&c?(a.textAlign="center",o+=l/2):a.textAlign="left",a.fillStyle=2&f?mGrad(a,h,{x:i,y:j},l,m):g,4&c&&(a.fillRect(i,j,l,m),1&f&&a.strokeRect(i,j,l,m)),a.save(),a.fillStyle=a.strokeStyle,a.textBaseline="top";for(var n=0;n<k.length;n++)a.fillText(k[n],o,j),j+=e;return a.restore(),d}
function DrawEllipse(a,b,c,d,e,f,g,h){function m(a){for(var b=a,e=0;b>Math.PI/2;)b-=Math.PI,e++;return Math.abs(b)>1.570796?a:Math.atan(c/d*Math.tan(b))+e*Math.PI}var j,k,l,i=[];e%=2*Math.PI,f=Math.max(Math.min(2*Math.PI,f),-2*Math.PI),e<0&&(e+=2*Math.PI),f<0&&(e+=f,f=-f),e<0&&(e+=2*Math.PI),l=m(e+f),e=m(e),h.beginPath(),a-=c,b-=d;for(var n=e;n<l;n+=.01)j=a+c*(1+Math.cos(n)),k=b+d*(1+Math.sin(n)),n==e?(i=[j,k,j,k],h.moveTo(j,k)):(i[0]=Math.min(j,i[0]),i[1]=Math.min(k,i[1]),i[2]=Math.max(j,i[2]),i[3]=Math.max(k,i[3]),h.lineTo(j,k));return g&&(f<6.283185&&(j=a+c,k=b+d,i[0]=Math.min(j,i[0]),i[1]=Math.min(k,i[1]),i[2]=Math.max(j,i[2]),i[3]=Math.max(k,i[3]),h.lineTo(j,k)),h.closePath()),i}
function DrawPolygon(a,b){var c=[];a.beginPath();var d=b.length;if(d){a.moveTo(b[0].x,b[0].y),c=[b[0].x,b[0].y,b[0].x,b[0].y];for(var e=1;e<d;e++)c[0]=Math.min(b[e].x,c[0]),c[1]=Math.min(b[e].y,c[1]),c[2]=Math.max(b[e].x,c[2]),c[3]=Math.max(b[e].y,c[3]),a.lineTo(b[e].x,b[e].y)}return a.closePath(),c}
function lStyle(a,b){16&b?a.lineCap="round":32&b?a.lineCap="square":a.lineCap="butt",64&b?a.lineJoin="round":128&b?a.lineJoin="bevel":a.lineJoin="miter";var c=2*a.lineWidth;if(a.setLineDash)switch(15&b){case 1:c*=2,a.setLineDash([c,c]);break;case 2:a.setLineDash([7*c,c,c,c]);break;case 3:a.setLineDash([c,c]);break;default:a.setLineDash([])}}
function cErr(a,b,c){b.save(),b.setTransform(1,0,0,1,0,0),b.fillStyle="white",b.strokeStyle="red",SetCanvasFont({s:0,h:13},b),b.lineWidth=1,lStyle(b,0),b.textBaseline="middle";var d=b.measureText(c).width+14,e=(a.width-d)/2,f=(a.height-26)/2,g=a.width/d;a.width<d&&(b.scale(g,g),e=0,f=(a.height-26)/2/g),b.strokeRect(e,f,d,26),b.fillRect(e,f,d,26),b.fillStyle="red",b.fillText(c,e+7,f+13),b.restore()}
function scX(a,b,c){var d=GetWord(a,b);return d>=16384?d=(d-16384)/100*c.w:d<=-16384?d=(d+16384)/100*c.w:d*=c.sx,Math.round(d)}
function scY(a,b,c){var d=GetWord(a,b);return d>=16384?d=(d-16384)/100*c.h:d<=-16384?d=(d+16384)/100*c.h:d*=c.sy,Math.round(d)}
function GetPos(a,b,c){var d={x:0,y:0};return d.x=GetWord(a,b),d.x>=16384?d.x=(d.x-16384)/100*c.w:d.x<=-16384?d.x=(d.x+16384)/100*c.w:d.x=d.x*c.sx+c.ox,d.y=GetWord(a,b+2),d.y>=16384?d.y=(d.y-16384)/100*c.h:d.y<=-16384?d.y=(d.y+16384)/100*c.h:d.y=d.y*c.sy+c.oy,d.x=Math.round(d.x),d.y=Math.round(d.y),d}
function rotPt(a,b,c,d){var e={x:(a*Math.cos(d)-b*Math.sin(d))*c.sx,y:(a*Math.sin(d)+b*Math.cos(d))*c.sy};return e}
function rndRect(a,b,c,d,e){function j(a,b){var c={x:a*Math.cos(e)-b*Math.sin(e),y:a*Math.sin(e)+b*Math.cos(e)};return c}var i,f=[],g=c/2,h=b/2;d=Math.min(h,g,Math.abs(d)),f[0]=j(-h+d,-g),f[1]=j(h,-g),f[2]=j(h,-g+d),f[3]=j(h,g),f[4]=j(h-d,g),f[5]=j(-h,g),f[6]=j(-h,g-d),f[7]=j(-h,-g),f[8]=f[0],a.beginPath(),a.moveTo(f[0].x,f[0].y);for(var k=1;k<8;k+=2)a.arcTo(f[k].x,f[k].y,f[k+1].x,f[k+1].y,d);i=[f[0].x,f[0].y,f[0].x,f[0].y];for(var k=1;k<8;k++)i[0]=Math.min(f[k].x,i[0]),i[1]=Math.min(f[k].y,i[1]),i[2]=Math.max(f[k].x,i[2]),i[3]=Math.max(f[k].y,i[3]);return i}
function GetPosRel(a,b,c,d){return rotPt(GetWord(a,b),GetWord(a,b+2),c,d)}
function rnd(a,b){return a<0?Math.ceil(a/b)*b:Math.floor(a/b)*b}
function log10(a){return Math.log(a)/Math.log(10)}
function pow10(a){return Math.pow(10,a)}
function DrawLScale(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q){function E(a){return v?e-(a-k)/(l-k)*e:(a-k)/(l-k)*e}function F(e,k,l){var m={x:d.x+(r?0:E(e)),y:d.y-(r?E(e):0)},n=a.lineWidth;switch(a.beginPath(),a.moveTo(m.x,m.y),k){case 1:a.lineTo(m.x+(r?-g:0),m.y+(r?0:g));break;case 2:a.lineWidth=2*n;case 3:l?a.lineTo(m.x+(r?-f:0),m.y+(r?0:f)):a.lineTo(m.x+(r?-u:0),m.y+(r?0:u))}if(a.stroke(),a.lineWidth=n,k>1&&0!=h&&(a.strokeStyle="rgba("+c[0]+","+c[1]+","+c[2]+","+c[3]/2+")",a.beginPath(),a.moveTo(m.x,m.y),a.lineTo(m.x+(r?h:0),m.y+(r?0:-h)),a.stroke(),a.strokeStyle="rgba("+c[0]+","+c[1]+","+c[2]+","+c[3]+")"),l){var o=parseFloat(e).toFixed(j);0==o&&(o=parseFloat(0).toFixed(j)),m=f<0?{x:m.x+(r?a.measureText(o).width/2+i-f:0),y:m.y+(r?0:f-b.h/2-i)}:{x:m.x-(r?a.measureText(o).width/2+i+f:0),y:m.y+(r?0:f+b.h/2+i)},MultiLineText(a,o,b.s&-321|640,m,1.35*b.h)}}var r=1&q,s=!(4&q),t=8&q?2:3,u=(f+g)/2,v=k>l;if(v){var w=k;k=l,l=w}p=Math.max(1,p);var x=(l-k)/Math.abs(e);if(l!=k)for(;0==m;){var y;y=r?Math.max(2,b.h)*x*1.2:Math.max(2,a.measureText(k.toFixed(j)+"0").width,a.measureText(l.toFixed(j)+"0").width)*x;var z=Math.ceil(log10(y)),A=pow10(z),B=A/y,C=A/x/(a.lineWidth*(2==t?4:2)+1),D=0;p=1,o=1,B>2?(D=-Math.min(0,Math.round(z-1)),B>5?(A/=5,C/=5,C>=10?(o=2,A/=2,p=5):C>=2&&(p=2)):(A/=2,C/=2,C>=5&&(p=5))):(D=-Math.min(0,Math.round(z)),C>=10?(o=2,A/=2,p=5):C>=5?p=5:C>=2&&(p=2)),(r||j>=D)&&(m=A),j=D}o=Math.max(1,o);var G=m/p,H=x/2,I=Math.ceil((k-H)/G)*G,J=Math.ceil((k-H-n)/G),K=Math.floor((l+H)/G)*G+G/2;for(2&q||(a.beginPath(),a.moveTo(d.x,d.y),a.lineTo(r?d.x:d.x+e,r?d.y-e:d.y),a.stroke());I<=K;)F(I,J%p?1:t,s&&!(J%(o*p))),J++,I+=G}
function DrawRScale(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q){function r(a){return(a-k)/(l-k)*(f-e)+e}function s(e,f,k){var l=r(e),m=a.lineWidth;switch(a.beginPath(),f<4&&a.moveTo(c.x+Math.cos(l)*d,c.y+Math.sin(l)*d),f){case 1:a.lineTo(c.x+Math.cos(l)*(d+h),c.y+Math.sin(l)*(d+h));break;case 2:a.lineWidth=2*m;case 3:a.lineTo(c.x+Math.cos(l)*(d+g),c.y+Math.sin(l)*(d+g));break;case 4:var n=g/2;a.arc(c.x+Math.cos(l)*(d+n),c.y+Math.sin(l)*(d+n),Math.abs(n),0,2*Math.PI),a.fill()}if(a.stroke(),a.lineWidth=m,k){var o=parseFloat(e).toFixed(j);0==o&&(o=parseFloat(0).toFixed(j));var p;p=g<0?{x:c.x+Math.cos(l)*(d-a.measureText(o).width/2-i+g),y:c.y+Math.sin(l)*(d-b.h/2-i+g)}:{x:c.x+Math.cos(l)*(d+a.measureText(o).width/2+i+g),y:c.y+Math.sin(l)*(d+b.h/2+i+g)},MultiLineText(a,o,b.s&-321|640,p,1.35*b.h)}}if(e=Math.max(Math.min(2*Math.PI,e),0),f=Math.max(Math.min(2*Math.PI,f),0),p=Math.max(1,p),o=Math.max(1,o),k>l){var t=e;e=f,f=t,t=k,k=l,l=t}var u=m/p;e>=f&&(f+=2*Math.PI);var v=rnd(k,u),w=Math.round((k-n)/u),x=rnd(l,u)+u/2;1&q&&(v+=u,w++),2&q&&(x-=u);var y=!(4&q),z=8&q?2:3;for(z=16&q?4:z,32&q&&(a.beginPath(),a.arc(c.x,c.y,d,e,f),a.stroke());v<=x;)s(v,w%p?1:z,y&&!(w%(o*p))),w++,v+=u}
function mGrad(a,b,c,d,e){var f;switch(15&b.s){case 0:f=128&b.s?a.createLinearGradient(c.x,c.y,c.x+d,c.y):a.createLinearGradient(c.x,c.y,c.x,c.y+e);break;case 1:f=a.createRadialGradient(c.x+d/2,c.y+e/2,0,c.x+d/2,c.y+e/2,Math.sqrt(d*d+e*e)/2);break;case 2:return f=128&b.s?a.createLinearGradient(c.x,c.y,c.x+d,c.y):a.createLinearGradient(c.x,c.y,c.x,c.y+e),f.addColorStop(0,b.f),f.addColorStop(1/3,b.b),f.addColorStop(1,b.f),f;case 3:f=a.createRadialGradient(c.x+d/3,c.y+e/3,0,c.x+d/2,c.y+e/2,Math.sqrt(d*d+e*e)/3*2)}return f.addColorStop(0,b.f),f.addColorStop(1,b.b),f}
function gpMark(a,b,c,d,e){switch(7&d){case 1:a.beginPath(),a.arc(b,c,3*e.sx,0,2*Math.PI),a.fill();break;case 2:a.beginPath(),a.moveTo(b-4*e.sx,c),a.lineTo(b+4*e.sx,c),a.moveTo(b,c-4*e.sy),a.lineTo(b,c+4*e.sy),a.stroke()}}//160919.1
function ProcessCanvas(a,b,c){function Q(a,b,c,d,e){for(var f=0;f<Z;f++){var g=f*f;ptsLine.push({x:a*Z+f,y:b+c*f+d*g+e*f*g})}}var d=b.getAttribute("VALUE"),e=decodeArrBase64(d),g=(GetWord(e,0),GetWord(e,2)+4),h=4,i=a.getContext("2d"),j=0,k=0,l={s:0,h:13},m={x:a.width/2,y:a.height/2},n=new Array(10),o=0,p=new Array(10),q=new Array(10),r=[],s={f:"#000000",b:"#FFFFFF",s:0},t="#000000",u=[0,0,0,1],v="#FFFFFF";gCI[c]||(gCI[c]={i:NullCI(),vc:{ox:0,oy:0,sx:1,sy:1,w:a.width,h:a.height},lt:0},gLCI[c]=gCI[c].i);var w=gCI[c].vc;for(w.ox=w.oy=0,w.sx=w.sy=1,w.w=a.width,w.h=a.height,i.clearRect(0,0,a.width,a.height),i.strokeStyle=t,SetCanvasFont(l,i),i.lineWidth=1,lStyle(i,j);h<g;)switch(e[h++]){case 1:2==e[h++]&&GetWord(e,h)+4==g||(h=g),h+=2;break;case 2:break;case 3:i.lineWidth=e[h++],lStyle(i,j);break;case 4:j=e[h++],lStyle(i,j);break;case 5:u=[e[h++],e[h++],e[h++],1-e[h++]/255],t="rgba("+u[0]+","+u[1]+","+u[2]+","+u[3]+")",i.strokeStyle=t;break;case 6:v="rgba("+e[h++]+","+e[h++]+","+e[h++]+","+(1-e[h++]/255)+")";break;case 7:l.h=Math.round(e[h++]*w.sy),SetCanvasFont(l,i);break;case 8:l.s=GetWord(e,h),h+=2,SetCanvasFont(l,i);break;case 9:s.f="rgba("+e[h++]+","+e[h++]+","+e[h++]+","+(1-e[h++]/255)+")",s.b="rgba("+e[h++]+","+e[h++]+","+e[h++]+","+(1-e[h++]/255)+")",s.s=e[h++];break;case 10:w.ox=m.x,w.oy=m.y;break;case 11:w.ox=0,w.oy=0;break;case 12:var x=GetWord(e,h),y=GetWord(e,h+2);if(0==x&&0==y)w.ox=0,w.oy=0,w.sx=1,w.sy=1,w.w=a.width,w.h=a.height;else{var z=a.width,A=a.height;0==x&&(x=y*z/A),0==y&&(y=x*A/z),w.sx=w.sy=Math.min(z/x,A/y),w.ox=(z-x*w.sx)/2,w.oy=(A-y*w.sy)/2}h+=4;break;case 13:k=e[h++];break;case 16:i.fillStyle=t,m=GetPos(e,h,w),i.fillRect(m.x,m.y,1,1),h+=4;break;case 17:i.beginPath(),m=GetPos(e,h,w),i.moveTo(m.x,m.y),m=GetPos(e,h+4,w),i.lineTo(m.x,m.y),i.stroke(),h+=8;break;case 18:m=GetPos(e,h,w),h+=4;break;case 19:i.beginPath(),i.moveTo(m.x,m.y),m=GetPos(e,h,w),i.lineTo(m.x,m.y),i.stroke(),h+=4;break;case 20:m=GetPos(e,h,w);var B=scX(e,h+4,w),C=scY(e,h+6,w);i.strokeRect(m.x,m.y,B,C),m.x+=B/2,m.y+=C/2,h+=8;break;case 21:m=GetPos(e,h,w);var B=scX(e,h+4,w),C=scY(e,h+6,w);i.fillStyle=2&k?mGrad(i,s,m,B,C):v,i.fillRect(m.x,m.y,B,C),1&k&&i.strokeRect(m.x,m.y,B,C),m.x+=B/2,m.y+=C/2,h+=8;break;case 22:var D=e[h++],E=[];if(D>0)for(var d=0;d<D;d++)E.push(GetPos(e,h,w)),h+=4;DrawPolygon(i,E),i.stroke();break;case 23:var D=e[h++],E=[];if(D>0)for(var d=0;d<D;d++)E.push(GetPos(e,h,w)),h+=4;var F=DrawPolygon(i,E),G={x:F[0],y:F[1]};i.fillStyle=2&k?mGrad(i,s,G,F[2]-F[0],F[3]-F[1]):v,i.fill(),1&k&&i.stroke();break;case 24:m=GetPos(e,h,w),i.beginPath(),i.arc(m.x,m.y,scX(e,h+4,w),0,2*Math.PI),i.stroke(),h+=6;break;case 25:m=GetPos(e,h,w),i.beginPath();var H=scX(e,h+4,w);i.arc(m.x,m.y,H,0,2*Math.PI);var G={x:m.x-H,y:m.y-H};i.fillStyle=2&k?mGrad(i,s,G,2*H,2*H):v,i.fill(),1&k&&i.stroke(),h+=6;break;case 26:m=GetPos(e,h,w),h+=4;case 61:DrawEllipse(m.x,m.y,scX(e,h,w),scY(e,h+2,w),GetAngle(e,h+4),GetAngle(e,h+8),0,i),i.stroke(),h+=12;break;case 27:m=GetPos(e,h,w),h+=4;case 35:var F=DrawEllipse(m.x,m.y,scX(e,h,w),scY(e,h+2,w),GetAngle(e,h+4),GetAngle(e,h+8),1,i),G={x:F[0],y:F[1]};i.fillStyle=2&k?mGrad(i,s,G,F[2]-F[0],F[3]-F[1]):v,i.fill(),1&k&&i.stroke(),h+=12;break;case 28:i.fillStyle=v;var I=ArrayToText(e,h);m=MultiLineText(i,I,l.s,m,1.35*l.h,k,v,s),h+=e[h]+1;break;case 29:var B=scX(e,h,w),C=scY(e,h+2,w);h+=4;var J=gcImg(ArrayToText(e,h));null!=J&&(B||(B=Math.round(J.width*w.sx)),C||(C=Math.round(J.height*w.sy)),i.drawImage(J,m.x,m.y,B,C),m.x+=B/2,m.y+=C/2),h+=e[h]+1;break;case 32:m.x+=scX(e,h,w),m.y+=scY(e,h+2,w),h+=4;break;case 33:i.save(),i.translate(m.x,m.y),i.rotate(o);var B=scX(e,h,w),C=scY(e,h+2,w);i.strokeRect(-B/2,-C/2,B,C),i.restore(),h+=4;break;case 34:i.save(),i.translate(m.x,m.y);var B=GetWord(e,h)/2,C=GetWord(e,h+2)/2,F=DrawPolygon(i,[rotPt(-B,-C,w,o),rotPt(-B,C,w,o),rotPt(B,C,w,o),rotPt(B,-C,w,o)]),G={x:F[0],y:F[1]};i.fillStyle=2&k?mGrad(i,s,G,F[2]-F[0],F[3]-F[1]):v,i.fill(),i.restore(),1&k&&i.stroke(),h+=4;break;case 36:i.fillStyle=v;var I=ArrayToText(e,h);m=MultiLineText(i,I,l.s&-321|640,m,1.35*l.h,k,v,s),h+=e[h]+1;break;case 37:var B=scX(e,h,w),C=scY(e,h+2,w);h+=4;var J=gcImg(ArrayToText(e,h));null!=J&&(B||(B=Math.round(J.width*w.sx)),C||(C=Math.round(J.height*w.sy)),B&&C&&i.drawImage(J,m.x-B/2,m.y-C/2,B,C)),h+=e[h]+1;break;case 38:i.beginPath(),i.arc(m.x,m.y,scX(e,h,w),0,2*Math.PI),i.stroke(),h+=2;break;case 39:i.beginPath();var H=scX(e,h,w);i.arc(m.x,m.y,H,0,2*Math.PI);var G={x:m.x,y:m.y};G.x-=H,G.y-=H,i.fillStyle=2&k?mGrad(i,s,G,2*H,2*H):v,i.fill(),1&k&&i.stroke(),h+=2;break;case 40:o=GetAngle(e,h),h+=4;break;case 41:o+=GetAngle(e,h),h+=4;break;case 42:i.beginPath(),i.moveTo(m.x,m.y);var K=GetWord(e,h);m.x+=K*w.sx*Math.cos(o),m.y+=K*w.sy*Math.sin(o),i.lineTo(m.x,m.y),h+=2,i.stroke();break;case 43:var K=GetWord(e,h);m.x+=K*w.sx*Math.cos(o),m.y+=K*w.sy*Math.sin(o),h+=2;break;case 44:var L=e[h++];0==L?(n.pop(),n.unshift({x:m.x,y:m.y})):L>0&&L<=10&&(n[L-1]={x:m.x,y:m.y});break;case 45:var L=e[h++];0==L?"undefined"!=typeof n[0]&&(m=n.shift(),n.push(void 0)):L>0&&L<=10&&(m={x:n[L-1].x,y:n[L-1].y});break;case 46:i.save(),i.translate(m.x,m.y);var D=e[h++],E=[];if(D>0)for(var d=0;d<D;d++)E.push(GetPosRel(e,h,w,o)),h+=4;DrawPolygon(i,E),i.stroke(),i.restore();break;case 47:i.save(),i.translate(m.x,m.y);var D=e[h++],E=[];if(D>0)for(var d=0;d<D;d++)E.push(GetPosRel(e,h,w,o)),h+=4;var F=DrawPolygon(i,E),G={x:F[0],y:F[1]};i.fillStyle=2&k?mGrad(i,s,G,F[2]-F[0],F[3]-F[1]):v,i.fill(),1&k&&i.stroke(),i.restore();break;case 48:var M=e[h++],N=GetWord(e,h+2),O=scX(e,h,w);Z=O/(N-1),pts=[],ptsLine=[],minY=0,maxY=0,h+=4,i.save(),i.translate(m.x,m.y),i.fillStyle=t;do{if(!N)break;for(;N--;){var P=-scY(e,h,w);pts.push(P),minY=Math.min(minY,P),maxY=Math.max(maxY,P),h+=2}if(N=pts.length,1==N){i.fillRect(0,pts[0],1,1),gpMark(i,0,pts[0],M,w);break}if(N<3&&(M&=-17),16&M){for(var T,V,W,R=N-1,S=R-1,U=pts[1]-pts[0],d=0;d<R;d++){V=d<S?pts[d+2]-pts[d+1]:0,W=U/Z,0==d?(cs1=W,cs1next=U*V<=0?0:2/(Z*(1/U+1/V))):d<S?(cs1=U*T<=0?0:2/(Z*(1/T+1/U)),cs1next=U*V<=0?0:2/(Z*(1/U+1/V))):(cs1=U*T<=0?0:2/(Z*(1/T+1/U)),cs1next=W);var X=cs1+cs1next-2*W;cs2=(W-cs1-X)/Z,cs3=X/(Z*Z),Q(d,pts[d],cs1,cs2,cs3),T=U,U=V}ptsLine.push({x:R*Z,y:pts[R]})}else for(var L=1;L<N;L++)ptsLine.push({x:Z*L,y:pts[L]});if(N=ptsLine.length,32&M){i.beginPath(),i.moveTo(0,pts[0]);for(var L=0;L<N;L++)i.lineTo(ptsLine[L].x,ptsLine[L].y);i.lineTo(ptsLine[N-1].x,0),i.lineTo(0,0),i.closePath(),i.fillStyle=2&k?mGrad(i,s,{x:0,y:minY},Z*(N-1),maxY-minY):v,i.fill(),1&k&&i.stroke()}if(!(8&M)){i.beginPath(),i.moveTo(0,pts[0]);for(var L=0;L<N;L++)i.lineTo(ptsLine[L].x,ptsLine[L].y);i.stroke()}for(var L=0;L<=N;L++)gpMark(i,Z*L,pts[L],M,w)}while(!1);i.restore();break;case 49:var M=e[h++],Y=scX(e,h+2,w),N=GetWord(e,h+4),Z=scX(e,h,w)/(N-1);if(h+=6,0==N)break;for(i.save(),i.translate(m.x-Y/2,m.y);N>0;){var $=-scY(e,h,w);h+=2,i.fillStyle=2&k?mGrad(i,s,{x:0,y:$},Y,-$):v,i.fillRect(0,0,Y,$),1&k&&i.strokeRect(0,0,Y,$),i.translate(Z,0),N--}i.restore();break;case 50:var L=e[h++];0==L?(p.pop(),p.unshift(o)):L>0&&L<=10&&(p[L-1]=o);break;case 51:var L=e[h++];0==L?"undefined"!=typeof p[0]&&(o=p.shift(),p.push(void 0)):L>0&&L<=10&&(o=p[L-1]);break;case 52:var L=e[h++],_=GetWord(e,h);if(h+=2,L>0&&L<=10&&(q[L-1]=h),h+=_,53!=e[h++]){cErr(a,i,"Bad macro "+L+" - missing MACRO_END"),h=g;break}break;case 53:h=r.pop(),"undefined"==typeof h&&(cErr(a,i,"Unexpected end of macro - stack underflow"),h=g);break;case 54:var L=e[h++];"undefined"!=typeof q[L-1]&&(r.push(h),h=q[L-1],r.length>10&&(cErr(a,i,"Stack overflow - macro endless loop"),h=g));break;case 55:var H=scX(e,h,w),G={x:m.x-H,y:m.y-H};i.fillStyle=2&k?mGrad(i,s,G,2*H,2*H):v,DrawRScale(i,l,m,H,GetAngle(e,h+2),GetAngle(e,h+6),scX(e,h+10,w),scX(e,h+12,w),e[h+14]*w.sx,e[h+15],GetReal(e,h+16),GetReal(e,h+20),GetReal(e,h+24),GetReal(e,h+28),e[h+32],e[h+33],GetWord(e,h+34)),h+=36;break;case 56:i.fillStyle=v,DrawLScale(i,l,u,m,scX(e,h,w),scX(e,h+2,w),scX(e,h+4,w),scX(e,h+6,w),e[h+8]*w.sx,e[h+9],GetReal(e,h+10),GetReal(e,h+14),GetReal(e,h+18),GetReal(e,h+22),e[h+26],e[h+27],GetWord(e,h+28)),h+=30;break;case 57:m=GetPos(e,h,w);var B=scX(e,h+4,w),C=scY(e,h+6,w);i.save(),m.x+=B/2,m.y+=C/2,i.translate(m.x,m.y),rndRect(i,B,C,scY(e,h+8,w),0),i.stroke(),i.restore(),h+=10;break;case 58:m=GetPos(e,h,w);var B=scX(e,h+4,w),C=scY(e,h+6,w);i.save(),m.x+=B/2,m.y+=C/2,i.translate(m.x,m.y);var F=rndRect(i,B,C,scY(e,h+8,w),0);i.fillStyle=2&k?mGrad(i,s,{x:F[0],y:F[1]},F[2]-F[0],F[3]-F[1]):v,i.fill(),1&k&&i.stroke(),i.restore(),h+=10;break;case 59:var B=scX(e,h,w),C=scY(e,h+2,w);i.save(),i.translate(m.x,m.y),rndRect(i,B,C,scY(e,h+4,w),o),i.stroke(),i.restore(),h+=6;break;case 60:var B=scX(e,h,w),C=scY(e,h+2,w);i.save(),i.translate(m.x,m.y);var F=rndRect(i,B,C,scY(e,h+4,w),o);i.fillStyle=2&k?mGrad(i,s,{x:F[0],y:F[1]},F[2]-F[0],F[3]-F[1]):v,i.fill(),1&k&&i.stroke(),i.restore(),h+=6;break;default:cErr(a,i,"Unknown function"),h=g}return""!=d}
function Ticks(){return(new Date).valueOf()}
function ChckLt(a){return a.i.x>=0&&Ticks()-a.lt>999}
function PostCanvas(a,b,c,d,e){var f=b.i,g=f.x<0?-32767:Math.round((f.x-b.vc.ox)/b.vc.sx),h=f.y<0?-32767:Math.round((f.y-b.vc.oy)/b.vc.sy);if(b.lt=Ticks(),""!=c||""!=d||""!=e)return(a?"&":"")+(""==c?"":encodeURIComponent(c)+"="+encodeURIComponent(g)+"&")+(""==d?"":encodeURIComponent(d)+"="+encodeURIComponent(h)+"&")+(""==e||f.x==-32767||f.y==-32767?"":encodeURIComponent(e)+"="+encodeURIComponent(f.c[0]+(f.c[1]<<8)+(f.c[2]<<16)+(255-f.c[3]<<24)))}
function NullCI(){return{x:-32767,y:-32767,c:[0,0,0,0],e:0}}
function CompCI(a,b){return void 0!=a&&void 0!=b&&a.x==b.x&&a.y==b.y&&a.c[0]==b.c[0]&&a.c[1]==b.c[1]&&a.c[2]==b.c[2]&&a.c[3]==b.c[3]&&a.e==b.e}
function GetCI(a,b,c){if(gCI[b]){var d=NullCI();if(a.touches){var e=a.touches;if(1==e.length){var f=getOffset(a.target);d.x=e[0].pageX-f.x,d.y=e[0].pageY-f.y,(d.x<0||d.y<0||d.x>a.target.width||d.y>a.target.height)&&(d.x=-32767,d.y=-32767),a.preventDefault()}}else a.offsetX||0==a.offsetX?(d.x=a.offsetX,d.y=a.offsetY):(a.layerX||0==a.layerX)&&(d.x=a.layerX,d.y=a.layerY);d.x>-1&&a.target.getContext&&(d.c=a.target.getContext("2d").getImageData(d.x,d.y,1,1).data),1==c?gCI[b].i=d:2==c?gCI[b].i.x>-1&&(d.x>-1?gCI[b].i==gLCI[b]&&CompCI(gLCI[b],d)?d=NullCI():d.e=1:gCI[b].i!=gLCI[b]&&(d.x=gCI[b].i.x,d.y=gCI[b].i.y,d.c=gCI[b].i.c,d.e=1),gCI[b].i=d):gCI[b].i.x>-1&&!gCI[b].i.e&&(gCI[b].i=d)}}function onResponse() {
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
var d=xmlhttpGET.responseXML.documentElement.getElementsByTagName('DATA');
if(x[0]&&d[0]) {
var Input1 = document.getElementById('INPUT1');
Input1.value = x[0].getAttribute('VALUE');
var Input2 = document.getElementById('INPUT2');
Input2.value = x[1].getAttribute('VALUE');
var Input3 = document.getElementById('INPUT3');
if(x[2].getAttribute('VALUE') != '0') {
Input3.style.visibility = 'hidden';
} else {
Input3.style.visibility = 'visible';
}
var Input4 = document.getElementById('INPUT4');
if(x[2].getAttribute('VALUE') != '0') {
Input4.style.visibility = 'hidden';
} else {
Input4.style.visibility = 'visible';
}
var Input5 = document.getElementById('INPUT5');
if(x[3].getAttribute('VALUE') == '0') {
Input5.style.visibility = 'hidden';
} else {
Input5.style.visibility = 'visible';
}
var Input6 = document.getElementById('INPUT6');
Input6.value = x[4].getAttribute('VALUE');
var Input7 = document.getElementById('INPUT7');
if(x[3].getAttribute('VALUE') == '0') {
Input7.style.display = 'none';
} else {
Input7.style.display = 'block';
}
var Input8 = document.getElementById('INPUT8');
Input8.value = x[5].getAttribute('VALUE');
var Input9 = document.getElementById('INPUT9');
Input9.value = x[6].getAttribute('VALUE');
var Input10 = document.getElementById('INPUT10');
if(x[7].getAttribute('VALUE') == '0') {
Input10.style.visibility = 'hidden';
} else {
Input10.style.visibility = 'visible';
}
var Input11 = document.getElementById('INPUT11');
ProcessCanvas(Input11, d[0],10);
if((gLCI[10]!=gCI[10].i)||ChckLt(gCI[10])){
pd+=PostCanvas(pd.length>0,gCI[10],'__R8919_INT_d','__R8921_INT_d','__R8923_UDINT_u');
gLCI[10]=gCI[10].i;
if(gCI[10].i.e==1)gCI[10].i=NullCI();}
var Input12 = document.getElementById('INPUT12');
var Input12h = document.getElementById('INPUT12h');
if(Input12h) { vz = x[8].getAttribute('VALUE') == '0'; iz = Input12h.value == '0';
if(vz == iz) {
if(vz) {
Input12h.value = '1';
Input12.style.backgroundImage = 'url("IMAGES/LED_GR_2.PNG")';
if(Input12.getAttribute('value') != null) {Input12.value = '';} else {}
} else {
Input12h.value = '0';
Input12.style.backgroundImage = 'url("IMAGES/LED_RE_4.PNG")';
if(Input12.getAttribute('value') != null) {Input12.value = '';
} else {}
}}} else {
if(x[8].getAttribute('VALUE') == '0') {
SetBg('INPUT12', 'LED_GR_2.PNG');
} else {
SetBg('INPUT12', 'LED_RE_4.PNG');
}}
var Input13 = document.getElementById('INPUT13');
if(x[9].getAttribute('VALUE') != '0') {
Input13.style.visibility = 'hidden';
} else {
Input13.style.visibility = 'visible';
}
var Input14 = document.getElementById('INPUT14');
if(x[9].getAttribute('VALUE') == '0') {
Input14.style.visibility = 'hidden';
} else {
Input14.style.visibility = 'visible';
}
var Input15 = document.getElementById('INPUT15');
if(x[9].getAttribute('VALUE') == '0') {
Input15.style.visibility = 'hidden';
} else {
Input15.style.visibility = 'visible';
}
var Input16 = document.getElementById('INPUT16');
var Input16h = document.getElementById('INPUT16h');
if(Input16h) { vz = x[10].getAttribute('VALUE') == '0'; iz = Input16h.value == '0';
if(vz == iz) {
if(vz) {
Input16h.value = '1';
Input16.style.backgroundImage = 'url("IMAGES/CHECK0.GIF")';
if(Input16.getAttribute('value') != null) {Input16.value = '';} else {}
} else {
Input16h.value = '0';
Input16.style.backgroundImage = 'url("IMAGES/CHECK1.GIF")';
if(Input16.getAttribute('value') != null) {Input16.value = '';
} else {}
}}} else {
if(x[10].getAttribute('VALUE') == '0') {
SetBg('INPUT16', 'CHECK0.GIF');
} else {
SetBg('INPUT16', 'CHECK1.GIF');
}}
var Input17 = document.getElementById('INPUT17');
var Input17h = document.getElementById('INPUT17h');
if(Input17h) { vz = x[11].getAttribute('VALUE') == '0'; iz = Input17h.value == '0';
if(vz == iz) {
if(vz) {
Input17h.value = '1';
Input17.style.backgroundImage = 'url("IMAGES/CHECK0.GIF")';
if(Input17.getAttribute('value') != null) {Input17.value = '';} else {}
} else {
Input17h.value = '0';
Input17.style.backgroundImage = 'url("IMAGES/CHECK1.GIF")';
if(Input17.getAttribute('value') != null) {Input17.value = '';
} else {}
}}} else {
if(x[11].getAttribute('VALUE') == '0') {
SetBg('INPUT17', 'CHECK0.GIF');
} else {
SetBg('INPUT17', 'CHECK1.GIF');
}}
var Input18 = document.getElementById('INPUT18');
var Input18h = document.getElementById('INPUT18h');
if(Input18h) { vz = x[12].getAttribute('VALUE') == '0'; iz = Input18h.value == '0';
if(vz == iz) {
if(vz) {
Input18h.value = '1';
Input18.style.backgroundImage = 'url("IMAGES/CHECK0.GIF")';
if(Input18.getAttribute('value') != null) {Input18.value = '';} else {}
} else {
Input18h.value = '0';
Input18.style.backgroundImage = 'url("IMAGES/CHECK1.GIF")';
if(Input18.getAttribute('value') != null) {Input18.value = '';
} else {}
}}} else {
if(x[12].getAttribute('VALUE') == '0') {
SetBg('INPUT18', 'CHECK0.GIF');
} else {
SetBg('INPUT18', 'CHECK1.GIF');
}}
if(x[9].getAttribute('VALUE') == '0') {
Input18.style.display = 'none';
} else {
Input18.style.display = 'block';
}
var Input19 = document.getElementById('INPUT19');
var Input19h = document.getElementById('INPUT19h');
if(Input19h) { vz = x[14].getAttribute('VALUE') == '0'; iz = Input19h.value == '0';
if(vz == iz) {
if(vz) {
Input19h.value = '1';
Input19.style.backgroundImage = 'url("IMAGES/CHECK0.GIF")';
if(Input19.getAttribute('value') != null) {Input19.value = '';} else {}
} else {
Input19h.value = '0';
Input19.style.backgroundImage = 'url("IMAGES/CHECK1.GIF")';
if(Input19.getAttribute('value') != null) {Input19.value = '';
} else {}
}}} else {
if(x[14].getAttribute('VALUE') == '0') {
SetBg('INPUT19', 'CHECK0.GIF');
} else {
SetBg('INPUT19', 'CHECK1.GIF');
}}
if(x[13].getAttribute('VALUE') == '0') {
Input19.style.display = 'none';
} else {
Input19.style.display = 'block';
}
var Input20 = document.getElementById('INPUT20');
if(x[13].getAttribute('VALUE') == '0') {
Input20.style.visibility = 'hidden';
} else {
Input20.style.visibility = 'visible';
}
var Input21 = document.getElementById('INPUT21');
if(x[13].getAttribute('VALUE') == '0') {
Input21.style.visibility = 'hidden';
} else {
Input21.style.visibility = 'visible';
}
var Input22 = document.getElementById('INPUT22');
var Input22h = document.getElementById('INPUT22h');
if(Input22h) { vz = x[15].getAttribute('VALUE') == '0'; iz = Input22h.value == '0';
if(vz == iz) {
if(vz) {
Input22h.value = '1';
Input22.style.backgroundImage = 'url("IMAGES/CHECK0.GIF")';
if(Input22.getAttribute('value') != null) {Input22.value = '';} else {}
} else {
Input22h.value = '0';
Input22.style.backgroundImage = 'url("IMAGES/CHECK1.GIF")';
if(Input22.getAttribute('value') != null) {Input22.value = '';
} else {}
}}} else {
if(x[15].getAttribute('VALUE') == '0') {
SetBg('INPUT22', 'CHECK0.GIF');
} else {
SetBg('INPUT22', 'CHECK1.GIF');
}}
if(x[9].getAttribute('VALUE') != '0') {
Input22.style.display = 'none';
} else {
Input22.style.display = 'block';
}
var Input23 = document.getElementById('INPUT23');
if(x[9].getAttribute('VALUE') != '0') {
Input23.style.visibility = 'hidden';
} else {
Input23.style.visibility = 'visible';
}
} else {document.location.reload(true); return;}
} catch(err) {console.log(err.message)}
if(pd!=''){setTimeout("GetXML('PAGE63.XML','"+pd+"')",1);}else{setTimeout("GetXML('PAGE63.XML')",1000);}}
function FunWatchDog() {
if(gWatchDog > 0 || g_postInProgress) {
gWatchDog = 0;
} else {
document.location.reload(true);
}
setTimeout("FunWatchDog()", 20000);
}

function PostXML7() {
PostXML('PAGE63.XML', encodeURIComponent('__R6866.5_BOOL_i=1')); 
SetBg('INPUT7', '48GRE.GIF');
setTimeout("SetBg('INPUT7', '48WHI.GIF');",500);
}
function PostXML12() {
var Input12h = document.getElementById('INPUT12h');
PostXML('PAGE63.XML', encodeURIComponent(Input12h.name+'='+Input12h.value));
}
function PostXML16() {
var Input16h = document.getElementById('INPUT16h');
PostXML('PAGE63.XML', encodeURIComponent(Input16h.name+'='+Input16h.value));
}
function PostXML17() {
var Input17h = document.getElementById('INPUT17h');
PostXML('PAGE63.XML', encodeURIComponent(Input17h.name+'='+Input17h.value));
}
function PostXML18() {
var Input18h = document.getElementById('INPUT18h');
PostXML('PAGE63.XML', encodeURIComponent(Input18h.name+'='+Input18h.value));
}
function PostXML19() {
var Input19h = document.getElementById('INPUT19h');
PostXML('PAGE63.XML', encodeURIComponent(Input19h.name+'='+Input19h.value));
}
function PostXML22() {
var Input22h = document.getElementById('INPUT22h');
PostXML('PAGE63.XML', encodeURIComponent(Input22h.name+'='+Input22h.value));
}

function PostGlobal() {
}
