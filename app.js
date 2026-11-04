(function(){
'use strict';
const $=s=>document.querySelector(s), el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e};
const SOL='DERDIAMANTLIEGTIMUHRWERK', WORDS=[3,7,5,2,7]; // DER DIAMANT LIEGT IM UHRWERK
const params=new URLSearchParams(location.search);
const KEY='kz_krimi_v1';
if(params.get('reset')==='1'&&params.get('probe')){try{localStorage.removeItem(KEY)}catch(e){}history.replaceState(null,'',location.pathname+location.search.replace(/[?&]reset=1/,'').replace(/^&/,'?'))}
let st={done:{},open:{},sound:true};
try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s)st=Object.assign(st,s)}catch(e){}
if(st.sound===false&&!st.soundSet)st.sound=true;
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}};

/* ---------- Geschenk ---------- */
let gift=null,giftOk=false;
try{const g=params.get('g');if(g){gift=kzDec(g)}}catch(e){}
const ready=(async()=>{if(gift&&gift.an&&gift.k){const sec=gift.s?kzShow(gift.s):'';giftOk=(await kzSig(gift.an,gift.von||'',kzMsg(gift.m||'',sec)))===gift.k;if(giftOk)gift.sec=sec}
 if(giftOk){$('#giftline').textContent='Ein Fall für '+gift.an+(gift.von?'. Überreicht von '+gift.von+'.':'.');if(gift.m){const m=$('#giftmsg');m.textContent=gift.m+(gift.von?'\n\n'+gift.von:'');m.style.display='block'}st.act=1;save()}
 if(!st.act)$('#codebox').style.display='block'})();
async function access(){await ready;if(st.act)return true;const v=kzNormCode($('#code').value);if(v&&await kzSha(v)===KZ_H){st.act=1;save();$('#codebox').style.display='none';return true}
 SFX.no();toast(v?'Dieser Code stimmt nicht. Schau noch einmal in dein PDF.':'Bitte gib zuerst deinen Zugangscode ein.');$('#code').focus();return false}

/* ---------- Datum ---------- */
let TOFF=0;
(async()=>{try{const r=await fetch(location.pathname+'?t='+Date.now(),{method:'HEAD',cache:'no-store'});const d=Date.parse(r.headers.get('date'));if(d){TOFF=d-Date.now();if($('#s-desk').classList.contains('on'))renderDesk()}}catch(e){}})();
function berlin(){const p=new Intl.DateTimeFormat('de-DE',{timeZone:'Europe/Berlin',year:'numeric',month:'numeric',day:'numeric'}).formatToParts(new Date(Date.now()+TOFF));const o={};p.forEach(x=>o[x.type]=+x.value);return o}
let PROBE=false;(async()=>{const q=params.get('probe');if(q&&await kzSha(q)==='c7f21b727a843753621d0398c133d25f15a97a8884ce156576bbbed47e6c17c9'){PROBE=true;window.__kz={openCase:d=>openCase(d)};if($('#s-desk').classList.contains('on'))renderDesk()}})();
function unlocked(d){if(PROBE)return true;const b=berlin();if(b.month===12)return b.day>=d;if(b.month===1&&b.day<=31)return true;return false}
function todayNr(){const b=berlin();return b.month===12&&b.day<=24?b.day:0}

/* ---------- Audio ---------- */
let AC=null,master=null,amb=null;
function ac(){if(!AC){AC=new (window.AudioContext||window.webkitAudioContext)();master=AC.createGain();master.gain.value=st.sound?1:0;master.connect(AC.destination)}if(AC.state!=='running'){try{AC.resume()}catch(e){}}return AC}
function tone(f,d,type,v,t0){const c=ac(),o=c.createOscillator(),g=c.createGain();o.type=type||'sine';o.frequency.value=f;const t=c.currentTime+(t0||0);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v||.2,t+.01);g.gain.exponentialRampToValueAtTime(.0005,t+d);o.connect(g);g.connect(master);o.start(t);o.stop(t+d+.05)}
function noise(d,f,q,v,t0,type){const c=ac(),n=c.sampleRate*d,b=c.createBuffer(1,n,c.sampleRate),x=b.getChannelData(0);for(let i=0;i<n;i++)x[i]=Math.random()*2-1;const s=c.createBufferSource();s.buffer=b;const bf=c.createBiquadFilter();bf.type=type||'bandpass';bf.frequency.value=f;bf.Q.value=q||1;const g=c.createGain();const t=c.currentTime+(t0||0);g.gain.setValueAtTime(v||.2,t);g.gain.exponentialRampToValueAtTime(.0005,t+d);s.connect(bf);bf.connect(g);g.connect(master);s.start(t);return {s,bf}}
const SFX={
 tap(){tone(900,.05,'triangle',.06)},
 paper(){noise(.35,2500,.7,.25);noise(.25,5000,.8,.12,.12)},
 ribbon(){const c=ac();const r=noise(.7,800,2,.25);r.bf.frequency.exponentialRampToValueAtTime(4000,c.currentTime+.6)},
 seal(){tone(90,.35,'sine',.6);noise(.2,300,1,.4)},
 ok(){[523,659,784,1047].forEach((f,i)=>tone(f,.6,'triangle',.15,i*.09))},
 no(){tone(140,.3,'sawtooth',.12);tone(110,.35,'sawtooth',.1,.08)},
 key(){noise(.04,3000,3,.18);tone(1800,.02,'square',.03)},
 hoof(){noise(.08,900,4,.4);noise(.08,700,4,.3,.18)},
 tick(){noise(.03,4500,6,.12)},
 chime(){[0,.5,1,1.5].forEach((t,i)=>tone([392,330,294,196][i],1.8,'sine',.15,t))},
 flip(){noise(.5,1800,.6,.2)}
};
// Echte Geräusche (ElevenLabs), Fallback auf Synth
const SBUF={},SNAMES=['paper','seal','wrong','success','click','hoof','crown','key','squeak','chess','stamp','snow'];let sLoaded=false;
function sload(){if(sLoaded)return;sLoaded=true;const c=ac();SNAMES.forEach(n=>fetch('a/s/'+n+'.mp3').then(r=>r.arrayBuffer()).then(b=>c.decodeAudioData(b)).then(buf=>{SBUF[n]=buf}).catch(()=>{}))}
function smp(n,v,rate){const c=ac();if(!SBUF[n]){sload();return false}const src=c.createBufferSource();src.buffer=SBUF[n];if(rate)src.playbackRate.value=rate;const g=c.createGain();g.gain.value=v||.8;src.connect(g);g.connect(master);src.start();return true}
(function(){const o=Object.assign({},SFX);
 SFX.paper=()=>smp('paper',.7,.95+Math.random()*.1)||o.paper();
 SFX.flip=()=>smp('paper',.6,.85)||o.flip();
 SFX.seal=()=>smp('seal',.8)||o.seal();
 SFX.no=()=>smp('wrong',.5)||o.no();
 SFX.ok=()=>{if(!smp('success',.55))o.ok();setTimeout(()=>smp('stamp',.9),120)};
 SFX.key=()=>smp('key',.7,.95+Math.random()*.1)||o.key();
 SFX.hoof=()=>smp('hoof',.8,.9+Math.random()*.2)||o.hoof();
 SFX.tap=()=>smp('click',.35,1.1)||o.tap();
 SFX.crown=()=>smp('crown',.5,1.3)||o.tick();
 SFX.chess=()=>smp('chess',.8)||o.tap();
 SFX.snow=()=>smp('snow',.7)||o.tap();
 SFX.squeak=()=>smp('squeak',.6)||o.tap();
 SFX.stamp=()=>smp('stamp',.9)||o.seal();})();
// Atmosphäre: Kaminknistern, Uhrticken, Wind
let ambOn=false,ambTimer=null;
function startAmb(){if(ambOn)return;ambOn=true;const c=ac();
 const n=c.sampleRate*4,b=c.createBuffer(1,n,c.sampleRate),x=b.getChannelData(0);let l=0;for(let i=0;i<n;i++){l=l*.995+(Math.random()*2-1)*.02;x[i]=l}
 const s=c.createBufferSource();s.buffer=b;s.loop=true;const f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=320;const g=c.createGain();g.gain.value=.12;s.connect(f);f.connect(g);g.connect(master);s.start();amb=g;
 ambTimer=setInterval(()=>{if(Math.random()<.5)noise(.02+Math.random()*.03,2000+Math.random()*3000,2,.04+Math.random()*.05);SFX.tick()},1000)}
const music=$('#music');music.volume=.07;
/* iOS und Android: Ton auch bei Stummschalter, ohne extra Antippen */
try{if(navigator.audioSession)navigator.audioSession.type='playback'}catch(e){}
let kzSil=null;function kzUnlock(){try{ac();sload()}catch(e){}if(kzSil&&kzSil.paused){kzSil.play().catch(()=>{})}if(!kzSil){try{kzSil=new Audio('data:audio/wav;base64,UklGRmQGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YUAGAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA');kzSil.loop=true;kzSil.setAttribute('x-webkit-airplay','deny');kzSil.play().catch(()=>{kzSil=null})}catch(e){kzSil=null}}}
['touchstart','touchend','pointerdown','click','keydown'].forEach(ev=>document.addEventListener(ev,kzUnlock,{capture:true,passive:true}));
document.addEventListener('visibilitychange',()=>{if(!document.hidden){if(AC&&AC.state!=='running')AC.resume();if(kzSil&&kzSil.paused)kzSil.play().catch(()=>{});if(st.sound&&music.paused&&!$('#s-start').classList.contains('on')){music.play().catch(()=>{})}}});
const MOUSE=['a/v/maus1.mp3','a/v/maus2.mp3'].map(x=>{const m=new Audio(x);m.preload='auto';return m});const KV=new Audio('a/v/k1.mp3');KV.preload='auto';
document.addEventListener('pointerdown',()=>{if(st.sound&&$('#s-desk').classList.contains('on')&&music.paused){music.muted=false;music.play().catch(()=>{})}},{capture:true,passive:true});

const voice=new Audio('a/stimmen.mp3');voice.preload='auto';let vStop=null;
function vDone(){clearTimeout(vStop);try{voice.pause()}catch(e){}try{for(const k in vf)if(vf[k]&&vf[k].pause)vf[k].pause()}catch(e){}music.volume=.07;$('#btn-say')&&$('#btn-say').classList.remove('on');document.querySelectorAll('.wchip.on,.grim.on').forEach(x=>x.classList.remove('on'))}
const VOXF={spuren:'a/spuren.mp3',cert:'a/urkunde.mp3'};const vf={};
function say(k){vDone();if(VOXF[k]){if(!st.sound||st.voice===false)return;const au=vf[k]||(vf[k]=new Audio(VOXF[k]));try{au.currentTime=0}catch(e){}music.volume=.02;au.onended=()=>{music.volume=.07;$('#btn-say')&&$('#btn-say').classList.remove('on')};vStop=null;au.play().catch(()=>{});vf._cur=au;return}
 if(!st.sound||st.voice===false||!window.VOX||!VOX[k])return;const [s,d]=VOX[k];const go=()=>{voice.currentTime=s;music.volume=.02;voice.play().then(()=>{$('#btn-say')&&$('#btn-say').classList.add('on');vStop=setTimeout(vDone,d*1000+250)}).catch(()=>{})};if(voice.readyState>=1)go();else{voice.load();voice.addEventListener('loadedmetadata',go,{once:true})}}
function hush(){vDone()}
/* Zeugen, Grimsby Reaktion, Ortsgeräusche */
const WIT={4:[['crane','Mrs. Crane']],5:[['kutscher','Der Kutscher']],6:[['hobbs6','Mr. Hobbs'],['mary6','Mary Finch'],['rowe6','Captain Rowe']],9:[['hobbs9','Mr. Hobbs']],12:[['rowe12','Captain Rowe']],15:[['crane15','Mrs. Crane']],16:[['silas','Silas Tolliver']],17:[['mary17','Mary Finch']],19:[['nachbar','Der Nachbar']],22:[['kutscher22','Der Kutscher']]};
for(let i=1;i<=24;i++)VOXF['r'+i]='a/v/r'+i+'.mp3';
Object.values(WIT).forEach(a=>a.forEach(([k])=>{VOXF['c_'+k]='a/v/c_'+k+'.mp3'}));
function sayBtn(k,b){if(b.classList.contains('on')){hush();return}if(!st.sound){toast('Schalte oben den Ton ein, dann hörst du die Stimme.');return}if(st.voice===false){st.voice=true;save()}say(k);const au=vf._cur;if(!au)return;b.classList.add('on');au.addEventListener('ended',()=>b.classList.remove('on'),{once:true})}
function witRow(d){const old=document.querySelector('#s-case .wits');if(old)old.remove();const L=WIT[d];if(!L)return;const r=el('div','wits');r.appendChild(el('span','wlab',L.length>1?'Zeugenaussagen anhören':'Zeugenaussage anhören'));
 L.forEach(([k,n])=>{const pp=porOf(n);const ic=pp?'<img src="'+pp+'" alt="">':(n.indexOf('Kutscher')>=0?KI.horse:KI.hat);const b=el('button','wchip','<span class="wpor">'+ic+'</span><span class="wn">'+n+'</span><span class="wsp">'+KI.say+'</span>');b.onclick=()=>sayBtn('c_'+k,b);r.appendChild(b)});
 $('#c-story').after(r)}
const AMBMAP={2:'schnee',4:'kueche',5:'strasse',9:'strasse',11:'strasse',19:'strasse',22:'strasse',12:'bahnhof'},AMBV=.5,ABUF={};let ambSrc=null,ambG2=null,ambTok=0;
function ambLoad(n){if(!ABUF[n]){const c=ac();ABUF[n]=fetch('a/o/'+n+'.mp3').then(r=>r.arrayBuffer()).then(b=>new Promise((res,rej)=>c.decodeAudioData(b,res,rej)))}return ABUF[n]}
function placeAmb(n){const c=ac(),tok=++ambTok;if(ambSrc){const s=ambSrc,g=ambG2;g.gain.setTargetAtTime(0,c.currentTime,.35);setTimeout(()=>{try{s.stop()}catch(e){}},1800);ambSrc=null;ambG2=null}
 if(amb)amb.gain.setTargetAtTime(n?.04:.12,c.currentTime,.5);if(!n)return;
 ambLoad(n).then(buf=>{if(tok!==ambTok)return;const s=c.createBufferSource();s.buffer=buf;s.loop=true;s.loopStart=.03;s.loopEnd=buf.duration-.03;const g=c.createGain();g.gain.value=0;s.connect(g);g.connect(master);s.start(0,.03);g.gain.setTargetAtTime(AMBV,c.currentTime,.6);ambSrc=s;ambG2=g}).catch(()=>{})}
function setSound(on){st.sound=on;save();if(!on)hush();if(master)master.gain.value=on?1:0;music.muted=!on;$('#btn-sound').innerHTML=on?KI.sound:KI.mute}

/* ---------- Schnee ---------- */
(function(){const cv=$('#snow'),cx=cv.getContext('2d');let W,H,fl=[];function rs(){W=cv.width=innerWidth*devicePixelRatio;H=cv.height=innerHeight*devicePixelRatio}rs();addEventListener('resize',rs);
 for(let i=0;i<70;i++)fl.push({x:Math.random(),y:Math.random(),r:Math.random()*2+.6,s:Math.random()*.4+.2,w:Math.random()*6});
 (function loop(t){cx.clearRect(0,0,W,H);cx.fillStyle='rgba(255,255,255,.75)';fl.forEach(p=>{p.y+=p.s/600;if(p.y>1.02)p.y=-.02;const x=(p.x+Math.sin(t/2000+p.w)*.01)*W;cx.beginPath();cx.arc(x,p.y*H,p.r*devicePixelRatio,0,7);cx.fill()});requestAnimationFrame(loop)})(0)})();

/* ---------- Navigation ---------- */
function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('on'));const s=$(id);s.classList.add('on');s.scrollTop=0;$('#snow').style.display=(id==='#s-case'||id==='#s-akte'||id==='#s-final')?'none':'block'}
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('on'),2600)}

/* ---------- Start und Intro ---------- */
$('#btn-start').onclick=()=>{ac();try{music.muted=true;music.play().catch(()=>{});voice.muted=true;voice.play().then(()=>{voice.pause();voice.muted=false}).catch(()=>{voice.muted=false})}catch(e){}if(st.act)beginIntro();else access().then(ok=>ok&&beginIntro())};
function beginIntro(){SFX.paper();show('#s-intro');const v=$('#intro');v.currentTime=0;v.muted=!st.sound;v.play().catch(()=>{v.muted=true;v.play().catch(goDesk)});
 const lines=[[0.9,'London, Dezember 1891.'],[4.9,'Dichter Nebel liegt über der Stadt.'],[7.5,'Der Weihnachtsdiamant ist verschwunden.'],[12.3,'Sechs Verdächtige.'],[13.8,'24 Beweisstücke.'],[16.2,'Und ich brauche deine Hilfe, Ermittler.'],[19.6,'']];
 const it=$('#intro-text');v.ontimeupdate=()=>{let txt='';lines.forEach(l=>{if(v.currentTime>=l[0])txt=l[1]});if(it.textContent!==txt)it.textContent=txt};
 v.onended=goDesk}
$('#btn-skip').onclick=goDesk;
function goDesk(){const v=$('#intro');v.pause();renderDesk();show('#s-desk');music.muted=!st.sound;if(st.sound){music.play().catch(()=>{})}startAmb()}
$('#btn-sound').onclick=()=>{ac();st.soundSet=1;setSound(!st.sound);if(st.sound)music.play().catch(()=>{})};
setSound(st.sound);
$('#btn-akte').onclick=()=>{SFX.paper();renderAkte();show('#s-akte')};
$('#btn-akte-back').onclick=()=>{SFX.paper();show('#s-desk')};

/* ---------- Schreibtisch ---------- */
const PERM=[17,3,22,9,14,1,20,6,11,24,4,16,8,19,2,13,23,7,10,21,5,15,18,12];
function renderReport(box,big){box.innerHTML='';
 if(!big){const n=Object.keys(st.done).length;
  box.appendChild(el('div','rep-head','<i class="pin"></i><span>Ermittlungsbericht</span><i class="pin"></i>'));
  const ln=el('div','rep-line','<em>Das Versteck des Diamanten:</em>');const wr=el('div','rep-words');WORDS.forEach(w=>{const g=el('span','rep-w');for(let k=0;k<w;k++)g.appendChild(el('i'));wr.appendChild(g)});ln.appendChild(wr);box.appendChild(ln);
  const kb=el('div','keyboard');for(let r=0;r<3;r++){const row=el('div','krow');PERM.slice(r*8,r*8+8).forEach(d=>{const k=el('span','tkey'+(st.done[d]?' on':''),st.done[d]?'<b>'+SOL[d-1]+'</b>':'');k.dataset.d=d;row.appendChild(k)});kb.appendChild(row)}box.appendChild(kb);
  box.appendChild(el('div','poollab',n?'Gesammelte Spuren · '+n+' von 24':'Gesammelte Spuren · noch keine'));return}
 let i=0;const wr=el('div','words');WORDS.forEach(w=>{const g=el('div','word');for(let k=0;k<w;k++){const s=el('div','slot','');s.dataset.i=i;g.appendChild(s);i++}wr.appendChild(g)});box.appendChild(wr)}
function kCount(){const n=Object.keys(st.mice||{}).length;const e=$('#kcount');if(e)e.querySelector('span').textContent='Krümel gefunden: '+n+' von 24'}
function renderDesk(){kCount();renderReport($('#report'));const g=$('#grid');g.innerHTML='';const td=todayNr();
 for(let d=1;d<=24;d++){const b=el('button','env');b.style.setProperty('--r',((d*37)%7-3)*.6+'deg');b.style.setProperty('--i',d);const u=unlocked(d);
  if(st.done[d])b.classList.add('open');else if(!u)b.classList.add('locked');if(d===td&&!st.done[d])b.classList.add('today');
  b.appendChild(el('span','num',d));b.appendChild(el('span','wax'+(st.done[d]?'':' seal'),st.done[d]?'<b class="solvedmark">'+KI.check+'</b>':'<img src="a/siegel.svg" alt="">'+(u?'':'<i>'+KI.lock+'</i>')));
  b.onclick=()=>{if(!unlocked(d)){SFX.no();toast('Dieser Umschlag ist bis zum '+d+'. Dezember versiegelt.');return}SFX.tap();if(st.done[d]||st.open[d])openCase(d);else openEnv(d)};g.appendChild(b)}
 mailDrop(td);const n=Object.keys(st.done).length;$('#deskfoot').textContent=n===24?'Alle Beweisstücke gelöst. Öffne Umschlag 24 für das Finale.':n+' von 24 Beweisstücken gelöst. Jeden Tag im Dezember öffnet sich ein neuer Umschlag.'}


/* ---------- Briefschlitz: Umschläge flutschen herein ---------- */
function dropSounds(n){const c=ac();const go=()=>{const t0=c.currentTime+.05;const step=n>1?.045:0;const cnt=Math.min(n,24);
 for(let i=0;i<cnt;i++){const t=t0+(n>1?.15:.15)+i*step;if(SBUF.paper){const src=c.createBufferSource();src.buffer=SBUF.paper;src.playbackRate.value=1.15+Math.random()*.35;const g=c.createGain();g.gain.value=n>1?.32:.75;src.connect(g);g.connect(master);src.start(t,.02,.35)}else{noise(.12,3000+Math.random()*1500,.8,n>1?.12:.25,t-c.currentTime)}}};
 if(c.state!=='running'){c.resume().then(go).catch(go)}else go()}
let dropDone=false,dropAt=0,mdT=null;
function mailDrop(td){const door=$('#door'),flap=$('#slotflap');if(!door||!flap)return;
 clearTimeout(mdT);mdT=setTimeout(()=>{if(!$('#s-desk').classList.contains('on'))return;const envs=[...document.querySelectorAll('#grid .env')];const fr=flap.getBoundingClientRect();const sx=fr.left+fr.width/2,sy=fr.top+fr.height*.9;
  const fresh=!dropDone||performance.now()-dropAt<2500;let list=fresh?envs:envs.filter((e,i)=>i+1===td&&!st.done[td]&&!st.open[td]);if(!dropDone){dropDone=true;dropAt=performance.now()}if(!list.length)return;
  flap.classList.add('open');if(st.sound)dropSounds(list.length);
  list.forEach((e,i)=>{const r=e.getBoundingClientRect();const dx=sx-(r.left+r.width/2),dy=sy-(r.top+r.height/2);const rot=parseFloat(getComputedStyle(e).getPropertyValue('--r'))||0;e.style.animation='none';
   e.animate([{transform:`translate(${dx}px,${dy}px) scale(.42,.18) rotate(0deg)`,opacity:0,offset:0},{transform:`translate(${dx}px,${dy+14}px) scale(.5,.5) rotate(${rot*3}deg)`,opacity:1,offset:.18},{transform:`translate(${dx*.4}px,${dy*.55}px) scale(.9) rotate(${-rot*4}deg)`,opacity:1,offset:.55},{transform:`rotate(${rot}deg)`,opacity:1,offset:1}],{duration:list.length>1?760:1100,delay:(list.length>1?i*45:150),easing:'cubic-bezier(.35,.9,.4,1.05)',fill:'backwards'})});
  setTimeout(()=>flap.classList.remove('open'),(list.length>1?list.length*45:150)+700)},140)}
/* ---------- Umschlag mit Schleife ---------- */
let curDay=0;
const RB={C:[200,150],k:[200,150],p:null,t:0,free:false};
function rbDraw(){const [cx,cy]=RB.C,[kx,ky]=RB.k,set=(id,d)=>document.getElementById(id).setAttribute('d',d);
 const v1=`M200 -14 Q${(200+kx)/2} ${ky*0.45} ${kx} ${ky}`,v2=`M${kx} ${ky} Q${(200+kx)/2} ${ky+(314-ky)*0.55} 200 314`,h1=`M-14 150 Q${kx*0.45} ${(150+ky)/2} ${kx} ${ky}`,h2=`M${kx} ${ky} Q${kx+(414-kx)*0.55} ${(150+ky)/2} 414 150`;
 set('bv1',v1);set('bv2',v2);set('bh1',h1);set('bh2',h2);set('sv1',v1);set('sv2',v2);set('sh1',h1);set('sh2',h2);set('ev1',v1);set('ev2',v2);set('eh1',h1);set('eh2',h2);set('gv1',v1);set('gv2',v2);set('gh1',h1);set('gh2',h2);
 const t=RB.t,tc=Math.min(1,t),sc=1-0.78*Math.pow(tc,1.8);document.getElementById('loops').setAttribute('transform',`scale(${sc}) rotate(${tc*18})`);
 document.getElementById('bowg').setAttribute('transform',`translate(${kx} ${ky})`);document.getElementById('sealg').setAttribute('transform',`translate(${kx} ${ky})`);
 const p=RB.p||[kx+42,ky+92];const px=p[0]-kx,py=p[1]-ky;const tR=`M0 0 Q${px*0.4+10} ${py*0.6+18} ${px} ${py}`,lx=-36+t*16,ly=80-t*30,tL=`M0 0 Q${-18+t*6} ${36-t*10} ${lx} ${ly}`;set('tailR',tR);set('teR',tR);set('tailL',tL);set('teL',tL);
 const notch=(x,y,ax,ay)=>{const L=Math.hypot(ax,ay)||1,ux=ax/L,uy=ay/L,nx=-uy*10,ny=ux*10;return `M${x+nx} ${y+ny} L${x+ux*2} ${y+uy*2} L${x-nx} ${y-ny} L${x+ux*12+nx} ${y+uy*12+ny} L${x+ux*12-nx} ${y+uy*12-ny}Z`};
 set('tnR',`M${px} ${py} m0 0`);set('tnL',`M${lx} ${ly} m0 0`)}
function openEnv(d){curDay=d;kzUnlock();if(st.sound&&music.paused){music.muted=false;music.play().catch(()=>{})}const e=$('#envelope');e.className='envelope';$('#rib').setAttribute('class','rib');RB.k=[200,150];RB.p=null;RB.t=0;RB.free=false;rbDraw();
 $('#env-hint').style.visibility='visible';$('#env-date').textContent=d==='secret'?'Persönlich für '+(gift&&gift.an||'dich'):d+'. Dezember 1891';document.querySelector('#env-card .mini-stamp').textContent=d==='secret'?'Persönlich':'Beweisstück';$('#env-addr').innerHTML=d==='secret'?'Für '+((gift&&gift.an)||'dich')+'<small>Erst an Heiligabend öffnen</small>':'An den Ermittler'+((gift&&gift.an)?' '+gift.an:'')+'<small>Beweisstück Nr. '+d+'</small>';show('#s-env')}
(function(){const sv=$('#rib');let drag=false,last=0,lp=null;
 const toV=e=>{const r=sv.getBoundingClientRect(),p=e.touches?e.touches[0]:e;return [(p.clientX-r.left)/r.width*400,(p.clientY-r.top)/r.height*300]};
 const start=e=>{if(RB.free)return;ac();drag=true;sv.classList.add('dragging');move(e);e.preventDefault()};
 function move(e){if(!drag)return;const v=toV(e);const dx=v[0]-200,dy=v[1]-150,dist=Math.hypot(dx,dy);RB.t=Math.max(0,(dist-60)/150);
  const pull=Math.min(1,RB.t);RB.k=[200+dx*0.12*pull,150+dy*0.12*pull];RB.p=v;rbDraw();
  const now=performance.now();if(lp&&now-last>70){const sp=Math.hypot(v[0]-lp[0],v[1]-lp[1]);if(sp>3)noise(.07,500+dist*6,3,Math.min(.25,.04+sp/200));last=now}lp=v;
  if(navigator.vibrate&&RB.t>.7&&Math.random()<.08)navigator.vibrate(8);
  if(RB.t>=1)untie(v);e.preventDefault&&e.preventDefault()}
 function end(){if(!drag||RB.free)return;drag=false;sv.classList.remove('dragging');const k0=RB.k.slice(),p0=RB.p?RB.p.slice():null,t0=RB.t,T0=performance.now();
  (function spring(n){const u=Math.min(1,(n-T0)/550),o=1-Math.pow(1-u,3)*Math.cos(u*9)*1,w=Math.max(0,1-o);RB.k=[200+(k0[0]-200)*w,150+(k0[1]-150)*w];RB.t=t0*w;RB.p=p0?[RB.k[0]+42+(p0[0]-RB.k[0]-42)*w,RB.k[1]+92+(p0[1]-RB.k[1]-92)*w]:null;rbDraw();if(u<1)requestAnimationFrame(spring);else{RB.p=null;rbDraw()}})(T0)}
 function untie(v){if(RB.free)return;RB.free=true;drag=false;const e=$('#envelope');sv.classList.remove('dragging');sv.classList.add('free');$('#env-hint').style.visibility='hidden';
  SFX.ribbon();if(navigator.vibrate)navigator.vibrate([30,40,60]);
  const r=e.getBoundingClientRect();for(let i=0;i<16;i++){const s=el('div','sparkle');s.style.left=(r.left+r.width/2)+'px';s.style.top=(r.top+r.height/2)+'px';const a=Math.random()*6.28,d=60+Math.random()*90;s.style.setProperty('--dx',Math.cos(a)*d+'px');s.style.setProperty('--dy',Math.sin(a)*d+'px');document.body.appendChild(s);setTimeout(()=>s.remove(),1000)}
  setTimeout(()=>SFX.seal(),300);setTimeout(()=>{SFX.paper();e.classList.add('opened')},1000);setTimeout(()=>{if(curDay==='secret'){showSecret();return}st.open[curDay]=1;save();openCase(curDay)},2500)}
 sv.addEventListener('touchstart',start,{passive:false});sv.addEventListener('mousedown',start);
 addEventListener('touchmove',move,{passive:false});addEventListener('mousemove',move);addEventListener('touchend',end);addEventListener('mouseup',end);})();
$('#btn-env-back').onclick=()=>{if(curDay==='secret'){show('#s-final');return}renderDesk();show('#s-desk')};

/* ---------- Beweisstück ---------- */
let typer=null;
function typeText(node,txt,cb){clearInterval(typer);node.innerHTML='';let i=0;const cur=el('span','cur','&nbsp;');node.appendChild(cur);
 typer=setInterval(()=>{if(i>=txt.length){clearInterval(typer);cur.remove();cb&&cb();return}cur.before(txt[i]);if(txt[i]!==' '&&i%2===0)SFX.key();i++},22);
 node.onclick=()=>{if(i<txt.length){clearInterval(typer);node.textContent=txt;cb&&cb()}}}
const norm=s=>(s||'').toUpperCase().replace(/Ä/g,'AE').replace(/Ö/g,'OE').replace(/Ü/g,'UE').replace(/ß/g,'SS').replace(/[^A-Z0-9]/g,'');
function openCase(d){curDay=d;const D=DAYS[d-1];show('#s-case');setTimeout(()=>say('d'+d+'a'),350);placeAmb(AMBMAP[d]);
 $('#c-date').textContent=d+'. Dezember 1891';$('#c-nr').textContent=d;$('#c-title').textContent=D.t;$('#c-q').textContent=D.q;$('#c-hint').textContent='';
 $('#c-stamp').classList.remove('on');const sv=$('#c-solved');sv.style.display='none';
 const W=$('#c-widget');W.innerHTML='';const A=$('#c-answer');A.innerHTML='';
 const ctx={d,D,submit:check,W,A,solved:!!st.done[d]};
 typeText($('#c-story'),D.s);witRow(d);
 (WIDGETS[D.w.k]||WIDGETS.none)(ctx);placeMouse(d);
 if(D.a&&!ctx.noInput){const inp=el('input');inp.placeholder=D.num?'Zahl':'Lösung';if(D.num)inp.inputMode='numeric';inp.autocomplete='off';inp.setAttribute('autocapitalize','characters');
  const b=el('button','btn','Prüfen');b.onclick=()=>check(inp.value);inp.onkeydown=e=>{if(e.key==='Enter')check(inp.value)};A.append(inp,b);ctx.input=inp}
 $('#btn-h1').onclick=()=>{SFX.paper();$('#c-hint').textContent='Inspektor Grimsby: '+D.h[0];say('d'+d+'h1')};
 $('#btn-say').onclick=()=>{if(!voice.paused){hush();return}else{if(st.voice===false){st.voice=true;save()}say('d'+d+'a')}};
 $('#btn-h2').onclick=()=>{SFX.paper();$('#c-hint').textContent='Inspektor Grimsby: '+D.h[1];say('d'+d+'h2')};
 if(st.done[d])showSolved(false);
 function check(v){const ok=(D.a||[]).some(a=>norm(a)===norm(v))||(D.loose||[]).some(a=>norm(v).includes(norm(a)));
  if(ok){showSolved(true)}else{SFX.no();const p=$('.paper');p.classList.remove('shake');void p.offsetWidth;p.classList.add('shake');if(navigator.vibrate)navigator.vibrate([40,40,40]);toast('Das passt noch nicht. Schau dir die Spur noch einmal an.')}}
 ctx.check=check;
 function showSolved(fresh){const L=D.L;sv.innerHTML='<span class="stamp2">GELÖST</span>Dein Buchstabe:<b>'+L+'</b><br><span style="font-size:14px">'+D.how+'. Er wandert in deine Spurensammlung. Am Heiligabend setzt du alle Spuren zusammen.</span>';sv.style.display='block';
  if(fresh){st.done[d]=1;save();SFX.seal();const fl=el('div','flyletter',L);document.body.appendChild(fl);setTimeout(()=>fl.remove(),1700);setTimeout(SFX.ok,250);if(navigator.vibrate)navigator.vibrate([20,60,20]);setTimeout(()=>sv.scrollIntoView({behavior:'smooth',block:'center'}),400)}
  const rOk=d!==24||Object.keys(st.done).length===24;if(rOk){const gb=el('button','grim','<img src="a/m/p_grimsby.webp" alt=""><span>Inspektor Grimsby</span>'+KI.say);gb.onclick=()=>sayBtn('r'+d,gb);sv.appendChild(gb);if(fresh&&st.sound&&st.voice!==false)setTimeout(()=>{if(curDay===d&&$('#s-case').classList.contains('on')&&!gb.classList.contains('on'))sayBtn('r'+d,gb)},1500)}
  if(d===24&&Object.keys(st.done).length===24){const fb=el('button','btn','Zum Finale');fb.style.marginTop='12px';fb.onclick=finale;sv.appendChild(el('br'));sv.appendChild(fb)}}}
$('#btn-case-back').onclick=()=>{hush();placeAmb(null);SFX.paper();renderDesk();show('#s-desk');setTimeout(()=>{const s=document.querySelector('#report .tkey[data-d="'+curDay+'"]');if(s&&st.done[curDay]){s.classList.add('new')}},300)};


/* ---------- Krümel, die Detektivmaus ---------- */
const KPOSE=['m_wave','m_lupe','m_read','m_lantern','m_sleep','m_peek'];
function placeMouse(d){const P=$('.paper');P.querySelectorAll('.krumel').forEach(x=>x.remove());if(st.mice&&st.mice[d])return;
 const pose=KPOSE[(d*5)%6],m=el('div','krumel');m.style.backgroundImage='url(a/m/'+pose+'.webp)';
 if(pose==='m_peek'){m.style.width='66px';m.style.height='40px';m.style.top='72px';m.style.left=(22+(d*17)%46)+'%'}
 else if(pose==='m_lantern'){m.style.top='34px';m.style.right='86px';m.style.width='44px';m.style.height='54px'}
 else if(pose==='m_sleep'){m.style.bottom='10px';m.style.right='12px';m.style.width='62px';m.style.height='44px'}
 else{m.style.bottom='12px';m.style.right='12px';m.style.width='48px';m.style.height='58px';if(d%2)m.style.transform='scaleX(-1)'}
 m.onclick=e=>{e.stopPropagation();st.mice=st.mice||{};st.mice[d]=1;save();m.classList.add('found');
  const n=Object.keys(st.mice).length;if(st.sound){const q=MOUSE[n%2];try{q.currentTime=0}catch(e){}q.play().catch(()=>SFX.squeak());if(st.voice!==false&&n===1){try{KV.muted=true;KV.currentTime=0;KV.play().catch(()=>{});setTimeout(()=>{try{KV.currentTime=0}catch(e){}KV.muted=false;music.volume=.02;KV.onended=()=>{music.volume=.07}},900)}catch(e){}}}
  toast('Krümel gefunden! '+n+' von 24');setTimeout(()=>m.remove(),600)};
 P.appendChild(m)}
/* ---------- Widgets ---------- */
function svgEl(t,a){const e=document.createElementNS('http://www.w3.org/2000/svg',t);for(const k in a)e.setAttribute(k,a[k]);return e}
const PORS=[['Edmund','p_edmund'],['Mary','p_mary'],['Hobbs','p_hobbs'],['Silas','p_silas'],['Tolliver','p_silas'],['Crane','p_crane'],['Rowe','p_rowe'],['Grimsby','p_grimsby']];
function porOf(t){for(const [k,v] of PORS)if(t.indexOf(k)>=0)return 'a/m/'+v+'.webp';return ''}
function choice(ctx,opts,cols,render){const g=el('div','opts');g.style.gridTemplateColumns='repeat('+(cols||1)+',1fr)';opts.forEach(o=>{const b=el('button','opt');if(render)render(b,o);else{const pp=porOf(String(o[1]).split(':')[0]);b.innerHTML=(pp?'<img class="opor" src="'+pp+'" alt="">':'')+'<span class="lab">'+o[0]+'</span>'+o[1];if(pp)b.classList.add('hasp')}b.onclick=()=>{SFX.tap();g.querySelectorAll('.opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');ctx.check(o[0])};g.appendChild(b)});ctx.noInput=true;return g}
const WIDGETS={
 none(){},
 acro(ctx){const b=el('div','box news');b.appendChild(el('div','mast','THE EVENING CHRONICLE'));ctx.D.w.lines.forEach(l=>{const s=el('span','ln','<b>'+l[0]+'</b>'+l.slice(1));s.onclick=()=>{SFX.tap();s.classList.toggle('hl')};b.appendChild(s)});ctx.W.appendChild(b)},
 tracks(ctx){const s=svgEl('svg',{viewBox:'0 0 300 260',width:'100%'});s.style.background='#eef3fa url(a/schnee.jpg) center/cover';s.style.borderRadius='8px';s.style.boxShadow='inset 0 0 0 1px rgba(60,80,110,.25),0 6px 16px rgba(0,0,0,.18)';
  s.appendChild(svgEl('rect',{x:110,y:4,width:80,height:22,fill:'#3b2a1e'}));const t=svgEl('text',{x:150,y:19,'text-anchor':'middle',fill:'#fff','font-size':11,'font-family':'Special Elite'});t.textContent='SALONFENSTER';s.appendChild(t);
  const paths=[['R','M60 240 C 40 170, 120 150, 90 90 S 40 40, 30 20'],['E','M150 240 C 280 200, 290 120, 220 110 S 120 80, 150 30'],['A','M240 240 C 200 180, 130 190, 160 140 S 280 60, 270 20']];
  const gate=svgEl('rect',{x:20,y:236,width:260,height:6,fill:'#6b4a2e'});s.appendChild(gate);
  paths.forEach(([L,d])=>{const p=svgEl('path',{d,fill:'none',stroke:'#7d8ca3','stroke-width':6,'stroke-dasharray':'2 9',opacity:.85,'stroke-linecap':'round'});p.style.cursor='pointer';s.appendChild(p);
   const x=+d.split(' ')[0].slice(1),lab=svgEl('text',{x,y:256,'text-anchor':'middle','font-size':16,'font-family':'Special Elite',fill:'#8f1c20'});lab.textContent=L;s.appendChild(lab);
   const hit=svgEl('path',{d,fill:'none',stroke:'transparent','stroke-width':26});hit.style.cursor='pointer';s.appendChild(hit);
   hit.onclick=()=>{SFX.tap();const len=p.getTotalLength();const dot=svgEl('circle',{r:6,fill:'#8f1c20'});s.appendChild(dot);let t0=null;const step=ts=>{if(!t0)t0=ts;const k=Math.min(1,(ts-t0)/1800);const pt=p.getPointAtLength(len*k);dot.setAttribute('cx',pt.x);dot.setAttribute('cy',pt.y);if(Math.floor(k*6)!==dot._k){dot._k=Math.floor(k*6);SFX.snow()}if(k<1)requestAnimationFrame(step);else setTimeout(()=>dot.remove(),900)};requestAnimationFrame(step)}});
  ctx.W.appendChild(s)},
 morse(ctx){const M={A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',R:'.-.',S:'...',T:'-',U:'..-',W:'.--'};
  const b=el('div','box');const lamp=el('div','lamp');const pb=el('button','btn',KI.play+' Telegramm abspielen');pb.style.display='block';pb.style.margin='0 auto';
  pb.onclick=()=>{const c=ac();let t=0;const u=.12;ctx.D.w.word.split('').forEach(ch=>{M[ch].split('').forEach(sym=>{const d=sym==='.'?u:u*3;tone(640,d,'sine',.22,t);setTimeout(()=>lamp.classList.add('on'),t*1000);setTimeout(()=>lamp.classList.remove('on'),(t+d)*1000);t+=d+u});t+=u*3})};
  const tab=el('div','morse-tab');Object.keys(M).forEach(k=>tab.appendChild(el('div','',k+' '+M[k].replace(/\./g,'•').replace(/-/g,'–'))));
  b.append(lamp,pb,tab);ctx.W.appendChild(b)},
 clock(ctx){const w=ctx.D.w;let hh=12,mm=0;const s=svgEl('svg',{viewBox:'-150 -235 300 390',class:'clock pw'});
  s.appendChild(svgEl('image',{href:'a/uhr_offen.webp',x:-145.3,y:-230.1,width:291,height:381.7}));
  s.appendChild(svgEl('circle',{r:103,fill:'none',stroke:'rgba(122,90,38,.45)','stroke-width':1.2}));s.appendChild(svgEl('circle',{r:78,fill:'none',stroke:'rgba(122,90,38,.55)','stroke-width':1}));
  for(let i=0;i<60;i++){const a=i*Math.PI/30,r0=i%5?100:97;s.appendChild(svgEl('line',{x1:Math.sin(a)*r0,y1:-Math.cos(a)*r0,x2:Math.sin(a)*103,y2:-Math.cos(a)*103,stroke:'#5a4020','stroke-width':i%5?.6:1.4}))}
  const rom=['XII','I','II','III','IV','V','VI','VII','VIII','IX','X','XI'];const ringEls=[];
  for(let i=0;i<12;i++){const a=i*Math.PI/6;const r1=svgEl('text',{x:Math.sin(a)*91,y:-Math.cos(a)*91+6,'text-anchor':'middle','font-size':17,'font-family':'Special Elite',fill:'#8f1c20'});r1.textContent=RING[i];s.appendChild(r1);ringEls.push(r1);
   const r2=svgEl('text',{x:Math.sin(a)*64,y:-Math.cos(a)*64+5,'text-anchor':'middle','font-size':12,'font-family':'Playfair Display',fill:'#2a1d14'});r2.textContent=rom[i];s.appendChild(r2)}
  const hH=svgEl('path',{d:'M-3.5 8 L-2.2 -30 L0 -46 L2.2 -30 L3.5 8 Z',fill:'#1f1a2e'}),mH=svgEl('path',{d:'M-2.4 10 L-1.4 -60 L0 -78 L1.4 -60 L2.4 10 Z',fill:'#1f1a2e'});
  s.append(hH,mH,svgEl('circle',{r:6,fill:'#b8913f'}));const lab=el('div','clockctl');
  function draw(){const ma=mm*6,ha=(hh%12)*30+mm*.5;mH.setAttribute('transform','rotate('+ma+')');hH.setAttribute('transform','rotate('+ha+')');ringEls.forEach((r,i)=>r.setAttribute('font-weight',i===mm/5?'700':'400'));ringEls.forEach((r,i)=>r.setAttribute('font-size',i===mm/5?22:17));lab.querySelector('span').textContent=(hh)+':'+String(mm).padStart(2,'0')+' Uhr'}
  lab.innerHTML='<button class="btn sm" data-a="h-">'+KI.left+' h</button><span></span><button class="btn sm" data-a="h+">h '+KI.right+'</button>';
  const lab2=el('div','clockctl');lab2.innerHTML='<button class="btn sm" data-a="m-">'+KI.left+' min</button><button class="btn sm" data-a="m+">min '+KI.right+'</button>';
  [lab,lab2].forEach(x=>x.onclick=e=>{const a=e.target.dataset.a;if(!a)return;if(a==='h+')hh=hh%12+1;if(a==='h-')hh=(hh+10)%12+1;if(a==='m+'){mm=(mm+5)%60;if(mm===0)hh=hh%12+1}if(a==='m-'){mm=(mm+55)%60;if(mm===55)hh=(hh+10)%12+1}SFX.crown();draw()});
  // Minutenzeiger ziehen
  let drag=false;const pos=e=>{const r=s.getBoundingClientRect(),p=e.touches?e.touches[0]:e;const x=p.clientX-(r.left+r.width/2),y=p.clientY-(r.top+r.height*235/390);let ang=Math.atan2(x,-y)*180/Math.PI;if(ang<0)ang+=360;const nm=Math.round(ang/30)%12*5;if(nm!==mm){if(mm>=45&&nm<=10)hh=hh%12+1;else if(mm<=10&&nm>=45)hh=(hh+10)%12+1;mm=nm;SFX.crown();draw()}};
  s.addEventListener('pointerdown',e=>{drag=true;pos(e)});addEventListener('pointermove',e=>{if(drag)pos(e)});addEventListener('pointerup',()=>drag=false);
  const go=el('button','btn','Buchstabe eintragen');go.style.display='block';go.style.margin='10px auto 0';go.onclick=()=>{if(hh===w.hh&&mm===w.mm)ctx.check('__OK__');else ctx.check('x')};
  ctx.D.a=['__OK__'];ctx.noInput=true;ctx.W.append(s,lab,lab2,go);draw()},
 coach(ctx){const w=ctx.D.w,g=el('div','coachgrid');let r=4,c=0;const cells=[];w.grid.forEach((row,ri)=>row.split('').forEach((ch,ci)=>{const d=el('div','',ch==='*'?KI.star:ch);g.appendChild(d);cells.push(d)}));
  const draw=()=>{cells.forEach(x=>x.classList.remove('car'));cells[r*5+c].classList.add('car')};
  const ar=el('div','arrows');ar.innerHTML='<span></span><button data-m="n" aria-label="Norden">'+KI.up+'</button><span></span><button data-m="w" aria-label="Westen">'+KI.left+'</button><button data-m="s" aria-label="Süden">'+KI.down+'</button><button data-m="e" aria-label="Osten">'+KI.right+'</button>';
  ar.onclick=e=>{const m=e.target.dataset.m;if(!m)return;if(m==='n'&&r>0)r--;if(m==='s'&&r<4)r++;if(m==='w'&&c>0)c--;if(m==='e'&&c<4)c++;SFX.hoof();draw()};
  const stop=el('button','btn','Hier halten');stop.style.display='block';stop.style.margin='10px auto 0';stop.onclick=()=>ctx.check(r===w.target[0]&&c===w.target[1]?'__OK__':'x');
  const rs=el('button','btn ghost sm','Zurück zum Start');rs.style.color='#2a1d14';rs.style.display='block';rs.style.margin='8px auto 0';rs.onclick=()=>{r=4;c=0;draw()};
  ctx.D.a=['__OK__'];ctx.noInput=true;ctx.W.append(g,ar,stop,rs);draw()},
 choice(ctx){ctx.W.appendChild(choice(ctx,ctx.D.w.opts,ctx.D.w.cols))},
 prints(ctx){const mk=(open,scar,whorl)=>{const s=svgEl('svg',{viewBox:'-30 -36 60 72',width:'100%'});s.appendChild(svgEl('ellipse',{rx:26,ry:33,fill:'#f2e6cf',stroke:'#c9b48a'}));
   const cid='fp'+Math.random().toString(36).slice(2);const cp=svgEl('clipPath',{id:cid});cp.appendChild(svgEl('ellipse',{rx:25,ry:32}));s.appendChild(cp);const gw=svgEl('g',{'clip-path':'url(#'+cid+')'});s.appendChild(gw);const g=svgEl('g',{transform:whorl?'':'rotate('+(open>0?-90:90)+') scale(.95)'});gw.appendChild(g);
   for(let i=1;i<=7;i++){const k=i*3.4;if(whorl)g.appendChild(svgEl('ellipse',{rx:k,ry:k*1.25,fill:'none',stroke:'#3b2a1e','stroke-width':1.3}));else g.appendChild(svgEl('path',{d:`M ${-k} ${k*1.9} L ${-k} ${-k*.2} A ${k} ${k} 0 0 1 ${k} ${-k*.2} L ${k} ${k*1.9}`,fill:'none',stroke:'#3b2a1e','stroke-width':1.3}))}
   if(scar)g.appendChild(svgEl('line',{x1:scar[0],y1:scar[1],x2:scar[0]+14,y2:scar[1]+9,stroke:'#f2e6cf','stroke-width':6,'stroke-linecap':'round'}));
   const clip=svgEl('ellipse',{rx:26,ry:33,fill:'none',stroke:'#c9b48a','stroke-width':3});s.appendChild(clip);return s};
  const v=el('div','box');v.style.textAlign='center';v.innerHTML='<div class="kick" style="color:#8f1c20">Abdruck von der Vitrine</div>';const vs=mk(1,[-14,-6]);vs.style.width='90px';v.appendChild(vs);ctx.W.appendChild(v);
  const P=[['K',mk(-1,[-14,-6])],['M',mk(1,[-14,-6])],['S',mk(1,null)],['L',mk(0,null,1)],['P',mk(1,[6,10])],['B',mk(-1,null)]];
  const g=choice(ctx,P,3,(b,o)=>{b.style.textAlign='center';b.appendChild(o[1]);b.appendChild(el('div','lab',o[0]))});g.style.marginTop='10px';ctx.W.appendChild(g)},
 mirror(ctx){const w=el('div','mirror-wrap'),t=el('div','mirror-text',ctx.D.w.text);w.appendChild(t);const b=el('button','btn sm',KI.mirror+' Spiegel davorhalten');b.style.display='block';b.style.margin='10px auto 0';b.onclick=()=>{SFX.flip();t.classList.toggle('flip')};ctx.W.append(w,b)},
 scytale(ctx){const rows=ctx.D.w.rows,n=rows.length,L=rows[0].length;let band='';for(let c=0;c<L;c++)for(let r=0;r<n;r++)band+=rows[r][c];
  const bd=el('div','band',band);const stick=el('div','stick');const lab=el('div','kick','');lab.style.color='#2a1d14';lab.style.margin='10px 0 2px';const rg=el('input');rg.type='range';rg.min=2;rg.max=7;rg.value=2;
  const draw=()=>{const k=+rg.value;lab.textContent='Stockdicke: '+k;let out=[];for(let r=0;r<k;r++){let s='';for(let i=r;i<band.length;i+=k)s+=band[i];out.push('<span class="'+(r===0?'r0':'')+'">'+s+'</span>')}stick.innerHTML=out.join('\n')};
  rg.oninput=()=>{noise(.06,500,2,.15);draw()};ctx.W.append(el('div','kick','Das Papierband'),bd,lab,rg,stick);ctx.W.firstChild.style.color='#2a1d14';draw()},
 receipt(ctx){const r=el('div','receipt');r.innerHTML='<b>PFANDHAUS J. MORLEY</b><br><small>Drury Lane · London · Quittung Nr. 2417</small>';ctx.D.w.items.forEach(i=>r.appendChild(el('div','','<span>'+i[0]+'</span><span>'+i[1]+' Schilling</span>')));r.appendChild(el('div','','<span><b>Summe</b></span><span>?</span>'));ctx.W.append(r,numtab())},
 timetable(ctx){const t=el('table','tt');t.innerHTML='<tr><td colspan=3>ABFAHRT · Bahnhof Victoria</td></tr>';ctx.D.w.rows.forEach(r=>{const tr=el('tr');tr.innerHTML='<td>'+r[0]+'</td><td>'+r[1]+'</td><td>Gleis '+r[2]+'</td>';tr.onclick=()=>{SFX.tap();t.querySelectorAll('tr').forEach(x=>x.classList.remove('sel'));tr.classList.add('sel');ctx.check(r[0]==='9:15'&&r[1]==='Brighton'?'9':'x')};t.appendChild(tr)});ctx.noInput=true;ctx.W.append(t,numtab())},
 stretch(ctx){const w=el('div','stretch-wrap'),t=el('div','stretch-text',ctx.D.w.text);w.appendChild(t);const rg=el('input');rg.type='range';rg.min=0;rg.max=100;rg.value=0;
  const set=v=>{const k=1+(1-v/100)*7;t.style.transform='scaleX('+(1/k*1.0)+') scaleY('+k+')';t.style.filter='blur('+((1-v/100)*1.5)+'px)'};rg.oninput=()=>set(+rg.value);set(0);
  const tilt=el('button','btn ghost sm',KI.phone+' Handy kippen');tilt.style.color='#2a1d14';tilt.onclick=async()=>{try{if(DeviceOrientationEvent.requestPermission)await DeviceOrientationEvent.requestPermission()}catch(e){}addEventListener('deviceorientation',e=>{const b=Math.max(0,Math.min(90,e.beta||0));const v=Math.max(0,Math.min(100,(b-10)/60*100));rg.value=v;set(v)})};
  ctx.W.append(w,el('div','kick','Blickwinkel'),rg,tilt);ctx.W.children[1].style.color='#2a1d14'},
 chess(ctx){const b=el('div','chess');const P={e4:KI.chess('knight',1),f6:KI.chess('pawn',1),h7:KI.chess('king',0),e1:KI.chess('king',1),a7:KI.chess('pawn',0),b7:KI.chess('pawn',0)};const files='abcdefgh';
  for(let r=8;r>=1;r--)for(let f=0;f<8;f++){const sq=files[f]+r;const d=el('div',(r+f)%2?'d':'l',P[sq]||'');d.appendChild(el('small','',sq));d.onclick=()=>{SFX.chess();b.querySelectorAll('div').forEach(x=>x.classList.remove('sel'));d.classList.add('sel');ctx.check(sq)};b.appendChild(d)}
  ctx.noInput=true;ctx.W.appendChild(b)},
 plan(ctx){const g=el('div','plan');ctx.D.w.rooms.forEach(([n,l])=>{const b=el('button','','<span>'+n+'</span><b>'+l+'</b>');if(n==='Halle')b.innerHTML='<span>'+n+'</span><b>'+l+'</b><span class="startmk">'+KI.star+' Start</span>';b.onclick=()=>{SFX.tap();g.querySelectorAll('button').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');ctx.check(n)};g.appendChild(b)});ctx.noInput=true;ctx.W.appendChild(g)},
 search(ctx){const w=ctx.D.w,g=el('div','ws'),cells=[];w.grid.forEach((row,r)=>row.split('').forEach((ch,c)=>{const d=el('div','',ch);d.dataset.r=r;d.dataset.c=c;g.appendChild(d);cells.push(d)}));
  const wl=el('div','wl');const spans={};w.words.forEach(x=>{const s=el('span','',x);spans[x]=s;wl.appendChild(s)});let first=null;
  g.onclick=e=>{const d=e.target;if(!d.dataset.r)return;SFX.tap();if(!first){first=d;d.classList.add('a');return}
   const r1=+first.dataset.r,c1=+first.dataset.c,r2=+d.dataset.r,c2=+d.dataset.c;first.classList.remove('a');let word='',path=[];
   if(r1===r2||c1===c2){const dr=Math.sign(r2-r1),dc=Math.sign(c2-c1);let r=r1,c=c1;while(true){path.push(cells[r*8+c]);word+=w.grid[r][c];if(r===r2&&c===c2)break;r+=dr;c+=dc}}
   first=null;const hit=w.words.find(x=>x===word||x===word.split('').reverse().join(''));if(hit&&!spans[hit].classList.contains('x')){path.forEach(p=>p.classList.add('f'));spans[hit].classList.add('x');SFX.ok()}else SFX.no()};
  ctx.W.append(g,wl)},
 order(ctx){const ev=ctx.D.w.ev,g=el('div','opts order');let seq=[];const built=el('div','built','');
  ev.forEach(e=>{const b=el('button','opt','<span class="n"></span><span style="flex:1">'+e[1]+'</span><small>'+e[2]+'</small>');b.onclick=()=>{if(b.dataset.u)return;SFX.paper();b.dataset.u=1;seq.push(e[0]);b.querySelector('.n').textContent=seq.length;b.classList.add('sel');built.textContent=seq.join('');if(seq.length===ev.length){setTimeout(()=>{ctx.check(seq.join(''));if(seq.join('')!=='RUSS'){seq=[];built.textContent='';g.querySelectorAll('.opt').forEach(x=>{delete x.dataset.u;x.classList.remove('sel');x.querySelector('.n').textContent=''})}},400)}};g.appendChild(b)});
  ctx.noInput=true;ctx.W.append(g,built)},
 seals(ctx){const mk=n=>{const s=svgEl('svg',{viewBox:'-40 -40 80 80',width:90});s.appendChild(svgEl('circle',{r:36,fill:'#8f1c20'}));s.appendChild(svgEl('circle',{r:26,fill:'none',stroke:'#c8585c','stroke-width':2}));const t=svgEl('path',{d:'M0 -11 L3.2 -3.6 L11 -3.4 L5 1.7 L6.9 9.4 L0 5.2 L-6.9 9.4 L-5 1.7 L-11 -3.4 L-3.2 -3.6Z',fill:'#f2c2b0'});s.appendChild(t);for(let i=0;i<n;i++){const a=i*2*Math.PI/5-Math.PI/2;s.appendChild(svgEl('circle',{cx:Math.cos(a)*31,cy:Math.sin(a)*31,r:3,fill:'#f2c2b0'}))}return s};
  const g=el('div','seals');[['O',5],['W',4],['F',5],['H',5]].forEach(([L,n])=>{const b=el('button');b.append(mk(n),el('span','',L));b.onclick=()=>{SFX.seal();g.querySelectorAll('button').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');ctx.check(L)};g.appendChild(b)});ctx.noInput=true;ctx.W.appendChild(g)},
 anagram(ctx){const w=ctx.D.w,n=w.letters.length,box=el('div','letters'),built=el('div','built','');let cur='';
  const map=el('div','stadtplan','<div class="sp-k">Stadtplan · Bahnhöfe im Norden</div><div class="sp-l"><span>Marylebone</span><span>Euston</span><span>King\'s Cross</span><span>St Pancras</span></div>');
  const show=()=>{built.textContent=cur+'_'.repeat(n-cur.length)+w.suffix};
  const reset=()=>{cur='';show();box.querySelectorAll('button').forEach(x=>x.classList.remove('used'))};
  w.letters.split('').forEach(L=>{const b=el('button','',L);b.onclick=()=>{if(b.classList.contains('used'))return;SFX.key();b.classList.add('used');cur+=L;show();if(cur.length===n){setTimeout(()=>{ctx.check(cur);if(cur!=='EUSTON')reset()},500)}};box.appendChild(b)});
  const rb=el('button','btn ghost sm','Neu legen');rb.style.color='#2a1d14';rb.style.margin='4px auto 0';rb.style.display='block';rb.onclick=()=>{SFX.tap();reset()};
  show();ctx.noInput=true;ctx.W.append(map,box,built,rb)},
 notes(ctx){const w=ctx.D.w;const F={C:262,D:294,E:330,F:349,G:392,A:440,H:494,c:523};const Y={C:130,D:125,E:120,F:115,G:110,A:105,H:100,c:95};
  const s=svgEl('svg',{viewBox:'0 50 320 90',class:'staff'});for(let i=0;i<5;i++)s.appendChild(svgEl('line',{x1:10,x2:310,y1:80+i*10-0,y2:80+i*10,stroke:'#3b2a1e'}));
  const clef=svgEl('text',{x:14,y:112,'font-size':52,fill:'#3b2a1e'});clef.textContent='𝄞';s.appendChild(clef);
  w.melody.forEach((n,i)=>{const x=80+i*48,y=Y[n]+0;if(n==='C')s.appendChild(svgEl('line',{x1:x-12,x2:x+12,y1:130,y2:130,stroke:'#3b2a1e'}));const g=svgEl('g',{});g.style.cursor='pointer';g.appendChild(svgEl('ellipse',{cx:x,cy:y,rx:8,ry:6,fill:'#3b2a1e',transform:'rotate(-20 '+x+' '+y+')'}));g.appendChild(svgEl('line',{x1:x+7,x2:x+7,y1:y,y2:y-32,stroke:'#3b2a1e','stroke-width':2}));g.appendChild(svgEl('rect',{x:x-16,y:50,width:32,height:90,fill:'transparent'}));g.onclick=()=>tone(F[n],1,'triangle',.3);s.appendChild(g)});
  const pl=el('button','btn sm',KI.play+' Melodie spielen');pl.onclick=()=>w.melody.forEach((n,i)=>tone(F[n],.7,'triangle',.3,i*.45));
  const tab=el('div','notetab');w.table.forEach(([n,L])=>{const yy=Y[n];const mini='<svg viewBox="0 72 34 64" class="mininote">'+[80,90,100,110,120].map(v=>'<line x1="2" x2="32" y1="'+v+'" y2="'+v+'" stroke="#3b2a1e" stroke-width="1.2"/>').join('')+(n==='C'?'<line x1="8" x2="26" y1="130" y2="130" stroke="#3b2a1e" stroke-width="1.2"/>':'')+'<ellipse cx="17" cy="'+yy+'" rx="6.5" ry="5" fill="#3b2a1e" transform="rotate(-20 17 '+yy+')"/></svg>';const d=el('div','',mini+'<b>'+L+'</b>');d.onclick=()=>tone(F[n],.8,'triangle',.3);tab.appendChild(d)});
  ctx.W.append(s,pl,el('div','kick','Notentafel: Buchstabe und Ton'),tab);ctx.W.children[2].style.cssText='color:#2a1d14;margin-top:10px'},
 watch(ctx){const box=el('div','watch pw');const s=svgEl('svg',{viewBox:'-150 -235 300 390'});s.appendChild(svgEl('image',{href:'a/uhr_offen.webp',x:-145.3,y:-230.1,width:291,height:381.7}));s.appendChild(svgEl('circle',{r:106,fill:'#2b241c',stroke:'#6a4a1c','stroke-width':2}));
  const gear=(x,y,r,t,cls)=>{const g=svgEl('g',{class:'gear '+(cls||'')});let d='';for(let i=0;i<t;i++){const a=i/t*Math.PI*2,a2=(i+.5)/t*Math.PI*2;d+=(i?'L':'M')+(x+Math.cos(a)*r)+' '+(y+Math.sin(a)*r)+' L'+(x+Math.cos(a)*(r+7))+' '+(y+Math.sin(a)*(r+7))+' L'+(x+Math.cos(a2)*(r+7))+' '+(y+Math.sin(a2)*(r+7))+' L'+(x+Math.cos(a2)*r)+' '+(y+Math.sin(a2)*r)}g.appendChild(svgEl('path',{d:d+'Z',fill:'#d8b46a',stroke:'#7a5a26'}));g.appendChild(svgEl('circle',{cx:x,cy:y,r:r*.35,fill:'#2b241c'}));return g};
  s.append(gear(-30,-20,34,14),gear(38,-28,20,10,'r'),gear(28,40,26,12),gear(-36,50,12,9,'r'));
  
  const lid=svgEl('svg',{viewBox:'-150 -235 300 390',class:'lid'});lid.appendChild(svgEl('image',{href:'a/uhr_deckel.webp',x:-145.5,y:-219.4,width:291,height:371}));const lt=svgEl('text',{y:6,'text-anchor':'middle','font-family':'Special Elite','font-size':15,fill:'#6a4614',opacity:.85});lt.textContent='FAIRBANK & CO.';lid.appendChild(lt);
  const seal=svgEl('rect',{x:-42,y:112,width:84,height:16,rx:2,fill:'#8f1c20',stroke:'#5a0f12'});lid.appendChild(seal);
  box.append(s,lid);const b=el('button','btn','Siegel brechen und aufklappen');b.style.display='block';b.style.margin='12px auto 0';b.onclick=()=>{SFX.seal();setTimeout(()=>{SFX.flip();box.classList.add('open');setTimeout(SFX.chime,1500)},300);b.remove()};
  if(ctx.solved){box.classList.add('open');b.remove()}ctx.W.append(box,b)}
};
function numtab(){const t=el('div','numtab');'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach((c,i)=>t.appendChild(el('div','',c+'<br>'+(i+1))));t.style.marginTop='12px';return t}

/* ---------- Akte ---------- */
function renderAkte(){const s=$('#suspects');s.innerHTML='';SUSPECTS.forEach(x=>s.appendChild(el('div','','<span class="ic por"><img src="'+porOf(x.n)+'" alt=""></span><b>'+x.n+'</b>'+x.r)));const n=$('#numtab');n.replaceWith(Object.assign(numtab(),{id:'numtab'}))}

/* ---------- Finale ---------- */
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let finRun=0;
async function finale(){const run=++finRun;hush();placeAmb(null);show('#s-final');['#scene-clock','#verdict','#cert-wrap'].forEach(x=>$(x).classList.remove('on'));$('#gclock').className='gclock';
 const box=$('#final-report');renderReport(box,true);const slots=[...box.querySelectorAll('.slot')];
 const acc=$('#accuse');acc.style.opacity=0;acc.style.pointerEvents='none';acc.style.display='none';const l=$('#accuse-list');l.innerHTML='';l.classList.remove('done');
 SUSPECTS.forEach(x=>{const b=el('button','scard','<span class="ic por"><img src="'+porOf(x.n)+'" alt=""></span><b>'+x.n+'</b>'+x.r+'<span class="sstamp"></span>');b.onclick=()=>accuse(b,x);l.appendChild(b)});
 const pool=$('#final-pool');pool.innerHTML='';const tiles=PERM.map(d=>{const t=el('button','tile',SOL[d-1]);t.dataset.l=SOL[d-1];pool.appendChild(t);return t});
 const help=$('#final-help');help.style.display='flex';$('#final-hint').style.display='block';let done=false;
 const put=(t,s)=>{s.textContent=t.dataset.l;s._t=t;t.classList.add('used');s.classList.remove('wrong')};
 const take=s=>{if(!s._t||s.classList.contains('lock'))return;s._t.classList.remove('used');s._t=null;s.textContent=''};
 const check=()=>{if(done||slots.some(s=>!s._t))return;const w=slots.map(s=>s.textContent).join('');
  if(w===SOL){done=true;solvedReport()}else{SFX.no();slots.forEach((s,i)=>{if(s.textContent!==SOL[i])s.classList.add('wrong')});setTimeout(()=>slots.forEach(s=>s.classList.remove('wrong')),900);toast('Da stimmt noch etwas nicht. Tipp auf einen Buchstaben im Bericht, um ihn zurückzulegen.')}};
 tiles.forEach(t=>t.onclick=()=>{if(done||t.classList.contains('used'))return;const s=slots.find(x=>!x._t);if(!s)return;SFX.key();put(t,s);check()});
 slots.forEach(s=>s.onclick=()=>{if(done)return;if(s._t){SFX.tap();take(s)}});
 const reveal=()=>{const i=slots.findIndex((s,k)=>s.textContent!==SOL[k]||!s._t);if(i<0)return false;const s=slots[i];if(s._t)take(s);
  let t=tiles.find(x=>!x.classList.contains('used')&&x.dataset.l===SOL[i]);
  if(!t){const o=slots.find((x,k)=>k!==i&&x._t&&x.textContent===SOL[i]&&x.textContent!==SOL[k]);if(o){t=o._t;take(o)}}
  if(!t)return false;put(t,s);s.classList.add('lock','new');return true};
 $('#btn-reveal').onclick=()=>{if(done)return;SFX.paper();reveal();check()};
 $('#btn-order').onclick=async()=>{if(done)return;SFX.paper();help.style.pointerEvents='none';while(!done&&reveal()){SFX.key();await sleep(70)}help.style.pointerEvents='';check()};
 function solvedReport(){help.style.display='none';$('#final-hint').style.display='none';slots.forEach(s=>s.classList.add('ok'));SFX.ok();tone(1760,.5,'sine',.12);
  setTimeout(()=>{acc.style.display='block';acc.style.transition='opacity .8s';acc.style.opacity=1;acc.style.pointerEvents='auto';setTimeout(()=>acc.scrollIntoView({behavior:'smooth',block:'center'}),150)},700)}
 await sleep(400);if(run!==finRun)return;say('spuren')}
function accuse(b,x){if(b.classList.contains('alibi')||$('#accuse-list').classList.contains('done'))return;
 if(x.n!=='Silas Tolliver'){SFX.no();b.querySelector('.sstamp').textContent='ALIBI';b.classList.add('alibi');if(navigator.vibrate)navigator.vibrate([30,30,30]);toast(x.n+' hat ein Alibi. Lies deinen Bericht noch einmal.');return}
 $('#accuse-list').classList.add('done');b.querySelector('.sstamp').textContent='SCHULDIG';b.classList.add('guilty');tone(70,.6,'sine',.7);noise(.35,250,1,.6);if(navigator.vibrate)navigator.vibrate([60,40,120]);
 const c=$('#f-report-card');c.classList.remove('quake');void c.offsetWidth;c.classList.add('quake');setTimeout(clockScene,1500)}
async function clockScene(){const sc=$('#scene-clock'),g=$('#gclock'),cap=$('#clock-cap'),btn=$('#clock-btn');sc.classList.add('on');g.className='gclock swing';cap.textContent='Die kaputte Standuhr im Flur tickt wieder … Tipp auf die Tür, um sie zu öffnen.';setTimeout(()=>sc.scrollIntoView({behavior:'smooth',block:'center'}),100);
 let ticking=true;(async()=>{let i=0;while(ticking){tone(i%2?1500:1300,.06,'square',.05);noise(.04,4000,5,.15);i++;await sleep(560)}})();
 await new Promise(res=>{const door=$('.gc-door');const go=()=>{door.removeEventListener('click',go);res()};door.addEventListener('click',go);btn.textContent='Tür öffnen';btn.style.display='inline-block';btn.onclick=go});
 ticking=false;g.classList.remove('swing');g.classList.add('stop');
 try{if(window.DeviceMotionEvent&&typeof DeviceMotionEvent.requestPermission==='function')DeviceMotionEvent.requestPermission().catch(()=>{})}catch(e){}
 const c=ac(),n=noise(1.2,300,6,.25);n.bf.frequency.exponentialRampToValueAtTime(900,c.currentTime+1.1);g.classList.add('open');await sleep(1200);
 cap.textContent='Im Uhrwerk klemmt etwas … Schüttle dein Handy oder wisch schnell hin und her!';btn.textContent='Uhr schütteln';
 await new Promise(res=>{let k=0,last=0,lx=null,dir=0;const NEED=5;
  const hit=()=>{const now=performance.now();if(now-last<220)return;last=now;k++;g.classList.remove('rattle');void g.offsetWidth;g.classList.add('rattle');noise(.12,900+k*150,3,.35);tone(2200+k*120,.05,'triangle',.06);if(navigator.vibrate)navigator.vibrate(40);
   const p=$('.gc-prog');p.style.width=Math.min(100,k/NEED*100)+'%';if(k>=NEED){cleanup();res()}};
  const mo=e=>{const a=e.accelerationIncludingGravity||e.acceleration;if(!a)return;const m=Math.hypot(a.x||0,a.y||0,a.z||0);if(m>22)hit()};
  const pm=e=>{const x=e.touches?e.touches[0].clientX:e.clientX;if(lx!==null){const d=x-lx;if(Math.abs(d)>6){const nd=Math.sign(d);if(nd!==dir&&dir!==0)hit();dir=nd}}lx=x};
  const pe=()=>{lx=null;dir=0};
  const cleanup=()=>{removeEventListener('devicemotion',mo);g.removeEventListener('touchmove',pm);g.removeEventListener('mousemove',pm);g.removeEventListener('touchend',pe);g.removeEventListener('mouseleave',pe);btn.onclick=null};
  addEventListener('devicemotion',mo);g.addEventListener('touchmove',pm,{passive:true});g.addEventListener('mousemove',pm);g.addEventListener('touchend',pe);g.addEventListener('mouseleave',pe);btn.onclick=hit});
 btn.style.display='none';g.classList.remove('rattle');g.classList.add('roll');SFX.paper();setTimeout(()=>{tone(1200,.08,'triangle',.08);tone(900,.08,'triangle',.06,.25);tone(700,.08,'triangle',.05,.5)},500);
 await sleep(1500);SFX.chime();sparkleAt($('.gc-roll'),24);cap.textContent='… da kullert der Weihnachtsdiamant heraus!';await sleep(1800);verdict()}
function sparkleAt(node,n){const r=node.getBoundingClientRect();for(let i=0;i<n;i++){const s=el('div','sparkle');s.style.left=(r.left+r.width/2)+'px';s.style.top=(r.top+r.height/2)+'px';const a=Math.random()*6.28,d=50+Math.random()*120;s.style.setProperty('--dx',Math.cos(a)*d+'px');s.style.setProperty('--dy',Math.sin(a)*d+'px');s.style.animationDelay=(Math.random()*.3)+'s';document.body.appendChild(s);setTimeout(()=>s.remove(),1400)}}
function verdict(){const v=$('#verdict');say('fin');
 v.innerHTML='<div class="stamp-big">FALL GELÖST</div><p class="story">Der Täter ist <b>Silas Tolliver</b>, der Uhrmacher. In der Nacht kam er mit seiner Werkzeugtasche zurück, öffnete die kaputte Standuhr und versteckte den Weihnachtsdiamanten im Uhrwerk. Darum tickte sie am Morgen wieder.</p><p class="story">Lady Ashcombe hält ihren Diamanten wieder in den Händen, und Inspektor Grimsby lässt ausrichten: Ohne dich hätte er diesen Fall nie gelöst.</p><p class="story center"><b>Frohe Weihnachten, Ermittler!</b></p>'+(gift&&gift.von?'<p class="story center small2">Diesen Fall hat dir '+esc(gift.von)+' geschenkt.</p>':'');
 v.classList.add('on');setTimeout(()=>v.scrollIntoView({behavior:'smooth',block:'start'}),200);
 for(let i=0;i<10;i++)setTimeout(()=>tone(900+Math.random()*900,.5,'sine',.05),i*140);
 setTimeout(showCert,(window.VOX&&VOX.fin?VOX.fin[1]*1000:9000)+800)}
function certName(){return (st.name||(gift&&gift.an)||'').trim()}
function showCert(){const w=$('#cert-wrap');w.classList.add('on');const n=certName();$('#cert-name').textContent=n||'Ermittler';$('#cert-edit').style.display=n?'none':'flex';SFX.paper();sealState();setTimeout(()=>{w.scrollIntoView({behavior:'smooth',block:'start'});say('cert')},300)}
function sealState(){const s=$('.cert-seal'),ok=!!st.sealed;s.classList.toggle('empty',!ok);$('.cert-btns').style.display=ok?'flex':'none';$('#cert').classList.toggle('sealed',ok);
 $('.cert-tap').textContent=ok?'Tipp auf die Urkunde, um sie groß anzusehen und als PDF zu speichern.':'Halte deinen Finger auf das leere Siegelfeld, um deine Urkunde zu besiegeln.';
 if(ok)secretState()}
(function(){const s=$('.cert-seal');let t0=0,raf=0,on=false;const H=1300;
 const stop=()=>{on=false;cancelAnimationFrame(raf);if(!st.sealed){s.style.setProperty('--p','0');s.classList.remove('pressing')}};
 const step=n=>{if(!on)return;const p=Math.min(1,(n-t0)/H);s.style.setProperty('--p',p.toFixed(3));if(Math.random()<.25)noise(.03,300+p*600,2,.05);if(p>=1){on=false;stamp();return}raf=requestAnimationFrame(step)};
 const start=e=>{if(st.sealed||!$('#cert-wrap').classList.contains('on'))return;e.preventDefault();e.stopPropagation();ac();on=true;t0=performance.now();s.classList.add('pressing');if(navigator.vibrate)navigator.vibrate(15);raf=requestAnimationFrame(step)};
 function stamp(){st.sealed=1;save();s.classList.remove('pressing');s.classList.add('stamped');SFX.seal();tone(60,.5,'sine',.7);if(navigator.vibrate)navigator.vibrate([20,30,90]);sparkleAt(s,18);setTimeout(()=>{s.classList.remove('stamped');sealState()},700)}
 s.addEventListener('pointerdown',start);s.addEventListener('pointerup',stop);s.addEventListener('pointerleave',stop);s.addEventListener('pointercancel',stop);s.addEventListener('click',e=>e.stopPropagation());s.addEventListener('contextmenu',e=>e.preventDefault())})();
function secretState(){const w=$('#secret-wrap');if(!gift||!gift.sec){w.classList.remove('on');return}
 $('#secret-from').textContent=gift.von?'Von '+gift.von:'Von jemandem, der dich lieb hat';$('#secret-open').textContent=st.secretRead?'Botschaft noch einmal lesen':'Umschlag öffnen';
 if(!w.classList.contains('on')){setTimeout(()=>{w.classList.add('on');SFX.chime();setTimeout(()=>w.scrollIntoView({behavior:'smooth',block:'center'}),200)},st.secretRead?0:1200)}}
$('#secret-open').onclick=()=>{SFX.tap();openEnv('secret')};
function showSecret(){st.secretRead=1;save();show('#s-secret');$('#secret-to').textContent='Für '+(gift.an||'dich');$('#secret-text').textContent=gift.sec;$('#secret-sign').textContent=gift.von||'';
 SFX.chime();const l=$('#secret-letter');l.classList.remove('in');void l.offsetWidth;l.classList.add('in');setTimeout(()=>sparkleAt(l,30),500);
 for(let i=0;i<14;i++)setTimeout(()=>tone(700+Math.random()*1100,.7,'sine',.04),i*170)}
$('#secret-back').onclick=()=>{SFX.tap();show('#s-final');secretState();setTimeout(()=>$('#cert-wrap').scrollIntoView({block:'start'}),50)};
$('#cert-set').onclick=()=>{const v=$('#cert-input').value.trim();if(!v){toast('Bitte trag einen Namen ein.');return}st.name=v;save();$('#cert-name').textContent=v;$('#cert-edit').style.display='none';SFX.seal();sparkleAt($('#cert-name'),10)};
async function certCanvas(){try{await document.fonts.ready}catch(e){}const W=1600,H=1130,cv=document.createElement('canvas');cv.width=W;cv.height=H;const x=cv.getContext('2d');
 const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#f3e8cf');g.addColorStop(1,'#e2cfa6');x.fillStyle=g;x.fillRect(0,0,W,H);
 x.strokeStyle='#8f1c20';x.lineWidth=10;x.strokeRect(40,40,W-80,H-80);x.strokeStyle='#b8913f';x.lineWidth=3;x.strokeRect(62,62,W-124,H-124);
 const t=(s,y,font,col,ls)=>{x.font=font;x.fillStyle=col;x.textAlign='center';x.fillText(s,W/2,y)};
 t('ABTEILUNG FÜR BESONDERE FÄLLE · LONDON',170,'28px "Special Elite"','#8f1c20');
 t('Urkunde',300,'800 110px "Playfair Display"','#2a1d14');t('Hiermit wird',380,'italic 34px "Playfair Display"','#5a3e2a');
 t($('#cert-name').textContent,480,'800 84px "Playfair Display"','#8f1c20');t('zum',550,'italic 34px "Playfair Display"','#5a3e2a');
 t('MEISTERDETEKTIV',640,'800 78px "Playfair Display"','#2a1d14');
 x.font='30px Lora';x.fillStyle='#3b2a1e';const txt='ernannt. In 24 Tagen wurden alle Beweisstücke gesichert, der Fall des Weihnachtsdiamanten aufgeklärt und der Täter Silas Tolliver überführt.';
 let line='',y=730;txt.split(' ').forEach(wd=>{if(x.measureText(line+wd).width>1100){x.fillText(line,W/2,y);line='';y+=44}line+=wd+' '});x.fillText(line,W/2,y);
 x.textAlign='center';x.font='italic 52px "Playfair Display"';x.fillStyle='#2a1d14';x.fillText('Grimsby',380,960);x.fillText('24.12.1891',1220,960);
 x.strokeStyle='#2a1d14';x.lineWidth=2;[[250,510],[1090,1350]].forEach(([a,b])=>{x.beginPath();x.moveTo(a,985);x.lineTo(b,985);x.stroke()});
 x.font='24px Lora';x.fillText('Inspektor Grimsby',380,1022);x.fillText('London',1220,1022);
 await new Promise(res=>{const im=new Image();im.onload=()=>{x.drawImage(im,700,860,200,200);res()};im.onerror=res;im.src='a/siegel.svg'});return cv}
$('#cert-save').onclick=async()=>{SFX.tap();const cv=await certCanvas();cv.toBlob(b=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='Urkunde_Meisterdetektiv.png';document.body.appendChild(a);a.click();setTimeout(()=>a.remove(),500);toast('Urkunde gespeichert')},'image/png')};
$('#cert-share').onclick=async()=>{SFX.tap();const cv=await certCanvas();cv.toBlob(async b=>{const f=new File([b],'Urkunde_Meisterdetektiv.png',{type:'image/png'});try{if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:'Fall gelöst!',text:'Ich habe den Fall des Weihnachtsdiamanten gelöst!'});return}}catch(e){if(e&&e.name==='AbortError')return}$('#cert-save').click()},'image/png')};
$('#final-back').onclick=()=>{hush();SFX.paper();renderDesk();show('#s-desk')};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

// Direkt zum Schreibtisch, wenn schon gespielt
if(Object.keys(st.open).length&&!params.get('intro')){$('#btn-start').textContent='Weiter ermitteln';$('#btn-start').onclick=()=>{ac();if(st.act)goDesk();else access().then(ok=>ok&&goDesk())}}

/* ---------- Urkunde groß anzeigen und als PDF ---------- */
function kzPdf(jpg,w,h){const enc=new TextEncoder(),parts=[],offs=[];let len=0;const add=x=>{const b=typeof x==='string'?enc.encode(x):x;parts.push(b);len+=b.length};
 const PW=842,PH=595,M=24,sc=Math.min((PW-2*M)/w,(PH-2*M)/h),dw=(w*sc).toFixed(2),dh=(h*sc).toFixed(2),dx=((PW-w*sc)/2).toFixed(2),dy=((PH-h*sc)/2).toFixed(2);
 const cs=`q ${dw} 0 0 ${dh} ${dx} ${dy} cm /Im0 Do Q`;
 add('%PDF-1.4\n');
 const obj=(n,body)=>{offs[n]=len;add(n+' 0 obj\n');add(body);add('\nendobj\n')};
 obj(1,'<< /Type /Catalog /Pages 2 0 R >>');
 obj(2,'<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
 obj(3,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PW} ${PH}] /Resources << /XObject << /Im0 5 0 R >> >> /Contents 4 0 R >>`);
 obj(4,`<< /Length ${cs.length} >>\nstream\n${cs}\nendstream`);
 offs[5]=len;add(`5 0 obj\n<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>\nstream\n`);add(jpg);add('\nendstream\nendobj\n');
 const x=len;let t='xref\n0 6\n0000000000 65535 f \n';for(let i=1;i<=5;i++)t+=String(offs[i]).padStart(10,'0')+' 00000 n \n';
 add(t+`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${x}\n%%EOF`);
 return new Blob(parts,{type:'application/pdf'})}
async function certOpen(){if(!st.sealed)return;SFX.paper();const cv=await certCanvas();$('#cert-big').src=cv.toDataURL('image/png');const m=$('#cert-modal');m.classList.add('on');m.setAttribute('aria-hidden','false')}
function certClose(){const m=$('#cert-modal');m.classList.remove('on');m.setAttribute('aria-hidden','true')}
$('#cert').addEventListener('click',certOpen);
$('#cert-close').onclick=()=>{SFX.tap();certClose()};
$('#cert-modal').addEventListener('click',e=>{if(e.target.id==='cert-modal')certClose()});
$('#cert-pdf').onclick=async()=>{SFX.tap();const cv=await certCanvas();const url=cv.toDataURL('image/jpeg',.94);const bin=atob(url.split(',')[1]);const jpg=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)jpg[i]=bin.charCodeAt(i);
 const blob=kzPdf(jpg,cv.width,cv.height),name='Urkunde_Meisterdetektiv.pdf';
 try{const f=new File([blob],name,{type:'application/pdf'});if(navigator.canShare&&navigator.canShare({files:[f]})&&/iPhone|iPad|Android/i.test(navigator.userAgent)){await navigator.share({files:[f],title:'Urkunde Meisterdetektiv'});return}}catch(e){if(e&&e.name==='AbortError')return}
 const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},2000);toast('Urkunde als PDF gespeichert')};

/* Icons einsetzen */
(function(){try{$('#btn-akte').innerHTML=KI.akte;$('#btn-sound').innerHTML=st.sound===false?KI.mute:KI.sound;$('#btn-say').innerHTML=KI.say;const h=document.getElementById('handicon');if(h)h.innerHTML=KI.handSvg;$('#gcgem').innerHTML=KI.diamond;$('#gcroll').innerHTML=KI.diamond}catch(e){console.error(e)}})();
window.KDEBUG={openCase,openEnv,st,save,renderDesk,show};
})();
