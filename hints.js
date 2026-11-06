/* Hinweiskarten: Skizzen von Inspektor Grimsby, antippbar zum Vergrößern */
(function(){
const INK='#2a1d14',RED='#8f1c20',PAP='#f6ecd3',LINE='rgba(42,29,20,.35)';
const T=(x,y,s,o)=>`<text x="${x}" y="${y}" ${o||''}>${s}</text>`;
function card(title,body,note){return `<svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg" font-family="Lora,serif" fill="${INK}">`+
 `<defs><filter id="hp" x="0" y="0" width="1" height="1"><feTurbulence baseFrequency=".9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 .55 0 0 0 0 .42 0 0 0 0 .25 0 0 0 .08 0"/><feComposite in2="SourceGraphic" operator="in"/></filter></defs>`+
 `<rect x="3" y="3" width="314" height="234" rx="6" fill="${PAP}" stroke="${LINE}" stroke-width="1.5"/><rect x="3" y="3" width="314" height="234" rx="6" filter="url(#hp)"/>`+
 `<rect x="10" y="10" width="300" height="220" rx="3" fill="none" stroke="${LINE}" stroke-dasharray="2 3"/>`+
 `<text x="160" y="32" text-anchor="middle" font-family="'Special Elite',monospace" font-size="13" letter-spacing="1" fill="${RED}">${title}</text>`+
 `<line x1="70" y1="40" x2="250" y2="40" stroke="${RED}" stroke-width=".8" opacity=".6"/>`+body+
 (note?`<text x="160" y="222" text-anchor="middle" font-size="10.5" font-style="italic" fill="#5a3e2a">${note}</text>`:'')+`</svg>`}

/* Taschenuhr lesen */
const R=['XII','I','II','III','IV','V','VI','VII','VIII','IX','X','XI'];
let clk=`<circle cx="96" cy="122" r="66" fill="#fbf4e2" stroke="${INK}" stroke-width="2.5"/><circle cx="96" cy="122" r="60" fill="none" stroke="${LINE}"/>`;
for(let i=0;i<60;i++){const a=i*6*Math.PI/180,r1=i%5?57:53,x1=96+Math.sin(a)*r1,y1=122-Math.cos(a)*r1,x2=96+Math.sin(a)*60,y2=122-Math.cos(a)*60;clk+=`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${INK}" stroke-width="${i%5?.6:1.4}"/>`}
R.forEach((n,i)=>{const a=i*30*Math.PI/180;clk+=T((96+Math.sin(a)*44).toFixed(1),(125.5-Math.cos(a)*44).toFixed(1),n,`text-anchor="middle" font-family="'Playfair Display',serif" font-size="10" font-weight="600"`);
 const m=i*5,x=96+Math.sin(a)*77,y=125-Math.cos(a)*77;clk+=T(x.toFixed(1),y.toFixed(1),':'+(m<10?'0'+m:m),`text-anchor="middle" font-size="9" font-weight="600" fill="${RED}"`)});
clk+=`<line x1="96" y1="122" x2="96" y2="90" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><circle cx="96" cy="122" r="3.5" fill="${INK}"/>`;
const leg=[['halb acht','7:30'],['Viertel nach 10','10:15'],['Viertel vor','… :45'],['fünf nach halb 4','3:35'],['zehn vor','… :50']];
let lg=T(190,72,'Die roten Zahlen zeigen','font-size="10.5" font-style="italic"')+T(190,85,'die Minuten.','font-size="10.5" font-style="italic"');
leg.forEach(([a,b],i)=>{lg+=T(190,110+i*20,a,'font-size="10.5"')+T(304,110+i*20,b,`text-anchor="end" font-size="11" font-weight="600" fill="${RED}"`)+`<line x1="190" y1="${114+i*20}" x2="304" y2="${114+i*20}" stroke="${LINE}" stroke-width=".6"/>`});
const CLOCK=card('SO LIEST DU DIE TASCHENUHR',clk+lg,'Der lange Zeiger zeigt die Minuten, der kurze die Stunde.');

/* Kompass */
let cmp=`<g transform="translate(110 130)"><circle r="64" fill="#fbf4e2" stroke="${INK}" stroke-width="2"/><circle r="56" fill="none" stroke="${LINE}"/>`+
 `<path d="M0-52 L9 0 L0 52 L-9 0Z" fill="${INK}" opacity=".85"/><path d="M-52 0 L0 9 L52 0 L0-9Z" fill="${INK}" opacity=".45"/><path d="M0-52 L9 0 L-9 0Z" fill="${RED}"/>`+
 T(0,-68,'N','text-anchor="middle" font-family="\'Playfair Display\',serif" font-weight="800" font-size="15"')+T(74,5,'O','text-anchor="middle" font-family="\'Playfair Display\',serif" font-weight="800" font-size="15"')+
 T(0,82,'S','text-anchor="middle" font-family="\'Playfair Display\',serif" font-weight="800" font-size="15"')+T(-74,5,'W','text-anchor="middle" font-family="\'Playfair Display\',serif" font-weight="800" font-size="15"')+'</g>';
cmp+=T(200,90,'Norden ist oben.','font-size="12"')+T(200,110,'Osten ist rechts.','font-size="12"')+T(200,130,'Süden ist unten.','font-size="12"')+T(200,150,'Westen ist links.','font-size="12"');
cmp+=T(188,180,'Ein Block ist ein Feld.','font-size="11.5" font-style="italic" fill="'+RED+'"');
const COMPASS=card('DER KOMPASS DES KUTSCHERS',cmp,'Zähle die Blöcke Feld für Feld ab.');

/* Springer */
let ch='<g transform="translate(40 58)">';const S=26;
for(let r=0;r<5;r++)for(let c=0;c<5;c++)ch+=`<rect x="${c*S}" y="${r*S}" width="${S}" height="${S}" fill="${(r+c)%2?'#b98d5e':'#f3e4c3'}"/>`;
ch+=`<rect width="${5*S}" height="${5*S}" fill="none" stroke="${INK}" stroke-width="1.5"/>`;
[[1,0],[3,0],[0,1],[4,1],[0,3],[4,3],[1,4],[3,4]].forEach(([c,r])=>ch+=`<circle cx="${c*S+S/2}" cy="${r*S+S/2}" r="6" fill="${RED}" opacity=".85"/>`);
ch+=`<path d="M${2*S+S/2} ${2*S+S/2} V${0*S+S/2+6} M${2*S+S/2} ${S/2+3} H${3*S+S/2-6}" stroke="${RED}" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-dasharray="4 3"/>`;
ch+=`<text x="${2*S+S/2}" y="${2*S+S/2+8}" text-anchor="middle" font-size="30" fill="#1b130d">&#9822;</text></g>`;
ch+=T(176,80,'Der Springer springt','font-size="12"')+T(176,96,'immer wie ein L:','font-size="12"')+T(176,120,'zwei Felder geradeaus,','font-size="11.5" font-weight="600"')+T(176,136,'dann eins zur Seite.','font-size="11.5" font-weight="600"')+T(176,162,'Er darf über andere','font-size="11.5" font-style="italic"')+T(176,177,'Figuren springen.','font-size="11.5" font-style="italic"');
const KNIGHT=card('WIE DER SPRINGER ZIEHT',ch,'Die roten Punkte zeigen alle Felder, die er erreicht.');

/* London Stadtplan */
let ld=`<path d="M10 205 C70 180 110 215 160 196 S250 170 310 188 L310 230 L10 230Z" fill="#9fb3b5" opacity=".55"/>`+T(40,203,'Themse','font-size="10" font-style="italic" fill="#3f5a5c"');
ld+=`<path d="M20 88 L300 78" stroke="#d9c9a3" stroke-width="13" stroke-linecap="round"/><path d="M20 88 L300 78" stroke="${INK}" stroke-width=".8" fill="none" stroke-dasharray="6 4" opacity=".5"/>`;
ld+=T(176,73,'? ? ? ? ? ?  ROAD','text-anchor="middle" font-family="\'Special Elite\',monospace" font-size="11" fill="'+RED+'"');
ld+=`<path d="M60 92 L50 150 M140 86 L150 160 M235 82 L250 150 M100 120 L280 120" stroke="#e2d4b0" stroke-width="6"/>`;
const st=[[140,'Euston',100,15],[214,'St. Pancras',100,15],[272,'King’s Cross',100,27]];
st.forEach(([x,n,y,o])=>{ld+=`<g transform="translate(${x} ${y})"><rect x="-9" y="-9" width="18" height="11" fill="${RED}"/><path d="M-11 -9 L0 -16 L11 -9Z" fill="${RED}"/><rect x="-3" y="-5" width="6" height="7" fill="${PAP}"/></g>`+T(Math.min(x,268),y+o,n,'text-anchor="middle" font-size="9.5" font-weight="600"')});
ld+=`<ellipse cx="62" cy="62" rx="40" ry="11" fill="#8fa77a" opacity=".75"/>`+T(62,65.5,'Regent\u2019s Park','text-anchor="middle" font-size="9" font-style="italic" fill="#1f3b2c"');
ld+=`<circle cx="270" cy="162" r="3" fill="${INK}"/>`+T(270,176,'Clerkenwell','text-anchor="middle" font-size="9.5" font-style="italic"');
ld+=`<circle cx="150" cy="182" r="3" fill="${INK}"/>`+T(150,176,'Drury Lane','text-anchor="middle" font-size="9.5" font-style="italic"');
ld+=`<circle cx="70" cy="170" r="3" fill="${INK}"/>`+T(70,164,'Mayfair','text-anchor="middle" font-size="9.5" font-style="italic"');
ld+=`<g transform="translate(26 150)"><path d="M0-14 L4 0 L0 14 L-4 0Z" fill="${INK}"/><path d="M0-14 L4 0 L-4 0Z" fill="${RED}"/>`+T(0,-17,'N','text-anchor="middle" font-size="9" font-weight="800"')+'</g>';
const LONDON=card('LONDON 1891, DER NORDEN',ld,'Welcher Bahnhof passt zu den Buchstaben T S U N O E?');

/* Zahlentafel */
let zt='';'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach((c,i)=>{const col=i%9,row=Math.floor(i/9),x=26+col*30,y=62+row*50;
 zt+=`<rect x="${x}" y="${y}" width="27" height="42" rx="3" fill="#fbf4e2" stroke="${LINE}"/>`+T(x+13.5,y+18,c,`text-anchor="middle" font-family="'Playfair Display',serif" font-weight="800" font-size="15"`)+T(x+13.5,y+35,i+1,`text-anchor="middle" font-size="11" fill="${RED}" font-weight="600"`)});
const NUMS=card('ZAHLENTAFEL AUS DER AKTE',zt,'Jede Zahl gehört zu einem Buchstaben.');

/* Logiktabelle Tag 17 */
let lt='';const rooms=['Musikzimmer','Küche','Keller'],ppl=['Edmund','Mary','Mr. Hobbs'];
rooms.forEach((r,i)=>lt+=T(150+i*58,72,r,'text-anchor="middle" font-size="10.5" font-weight="600"'));
ppl.forEach((p,j)=>{lt+=T(108,104+j*36,p,'text-anchor="end" font-size="11.5" font-weight="600"');rooms.forEach((r,i)=>lt+=`<rect x="${124+i*58}" y="${82+j*36}" width="52" height="32" fill="#fbf4e2" stroke="${LINE}"/>`)});
lt+=`<path d="M${150+58-8} ${98+36} l6 7 l12 -15" stroke="${RED}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
[[1,0],[1,2],[0,1],[2,1]].forEach(([i,j])=>{const x=150+i*58,y=98+j*36;lt+=`<path d="M${x-8} ${y-8} l16 16 M${x+8} ${y-8} l-16 16" stroke="${INK}" stroke-width="2" opacity=".7"/>`});
lt+=T(160,212,'Hinweis 2 trägst du selbst ein.','text-anchor="middle" font-size="10.5" font-style="italic" fill="#5a3e2a"');
const LOGIC=card('WER WAR WO? SO HILFT EINE TABELLE',lt,'');

/* Zeitleiste Tag 20 */
let tl=`<line x1="24" y1="120" x2="296" y2="120" stroke="${INK}" stroke-width="2.5"/><path d="M296 120 l-8 -5 v10z" fill="${INK}"/>`;
const hrs=['18','19','20','21','22','23','0','1','2','3','4'];hrs.forEach((h,i)=>{const x=30+i*26;tl+=`<line x1="${x}" y1="${h==='0'?106:113}" x2="${x}" y2="${h==='0'?134:127}" stroke="${h==='0'?RED:INK}" stroke-width="${h==='0'?2.5:1.3}"/>`+T(x,148,h,'text-anchor="middle" font-size="10.5" font-weight="600"')});
tl+=`<rect x="24" y="76" width="152" height="22" rx="4" fill="#e9c98f" opacity=".7"/>`+T(100,91,'Abend','text-anchor="middle" font-size="11" font-weight="600"');
tl+=`<rect x="186" y="76" width="110" height="22" rx="4" fill="#3b3550" opacity=".85"/>`+T(241,91,'Nacht','text-anchor="middle" font-size="11" font-weight="600" fill="#f6ecd3"');
tl+=T(186,172,'Mitternacht','text-anchor="middle" font-size="11" font-weight="600" fill="'+RED+'"')+`<path d="M186 160 V138" stroke="${RED}" stroke-width="1" stroke-dasharray="2 2"/>`;
tl+=T(160,196,'Nach Mitternacht beginnt die Uhr wieder bei 0.','text-anchor="middle" font-size="10.5"');
const TIME=card('DIE NACHT VOM ABEND BIS ZUM MORGEN',tl,'3:35 Uhr kommt also nach 22:15 Uhr.');

window.HVIS={'4_1':CLOCK,'9_2':CLOCK,'15_2':CLOCK,'19_1':CLOCK,'5_1':COMPASS,'14_1':KNIGHT,'22_1':LONDON,'11_2':NUMS,'12_2':NUMS,'24_2':NUMS,'17_1':LOGIC,'20_1':TIME};
window.HVIS_WHO='Skizze von Inspektor Grimsby';
})();
