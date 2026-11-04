// Eigene gezeichnete Icons im Stil der Ermittlungsakte (keine Emojis)
(function(){
const S=(d,vb)=>'<svg class="ki" viewBox="'+(vb||'0 0 24 24')+'" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+d+'</svg>';
const F=(d,vb)=>'<svg class="ki" viewBox="'+(vb||'0 0 24 24')+'" aria-hidden="true">'+d+'</svg>';
window.KI={
 sound:S('<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6"/><path d="M18 6.5a7.5 7.5 0 0 1 0 11"/>'),
 mute:S('<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>'),
 say:S('<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6"/>'),
 // Ermittlungsakte mit Schnur und Stempel
 akte:S('<path d="M3 6.5h6.5l1.8 2H21V19a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M3 10.5h18" opacity=".6"/><circle cx="15.5" cy="15" r="2.2"/><path d="M15.5 12.8V10.5M7 15h4M7 17.5h3" opacity=".75"/>'),
 lock:S('<rect x="5.5" y="11" width="13" height="9.5" rx="2"/><path d="M8.5 11V8a3.5 3.5 0 0 1 7 0v3"/><circle cx="12" cy="15.2" r="1.2" fill="currentColor"/><path d="M12 16.4v1.8"/>'),
 check:S('<path d="M4.5 12.5l4.5 4.5L19.5 6.5" stroke-width="2.6"/>'),
 play:F('<path d="M7 5.2v13.6a.8.8 0 0 0 1.2.7l11-6.8a.8.8 0 0 0 0-1.4l-11-6.8A.8.8 0 0 0 7 5.2z" fill="currentColor"/>'),
 left:S('<path d="M15 6l-6 6 6 6" stroke-width="2.2"/>'),right:S('<path d="M9 6l6 6-6 6" stroke-width="2.2"/>'),
 up:S('<path d="M6 15l6-6 6 6" stroke-width="2.4"/>'),down:S('<path d="M6 9l6 6 6-6" stroke-width="2.4"/>'),
 star:F('<path d="M12 2.5l2.6 6.2 6.7.5-5.1 4.4 1.6 6.5L12 16.6l-5.8 3.5 1.6-6.5-5.1-4.4 6.7-.5z" fill="currentColor"/>'),
 // Handspiegel mit Rahmen
 mirror:S('<ellipse cx="12" cy="9" rx="5.5" ry="6.5"/><ellipse cx="12" cy="9" rx="3.6" ry="4.6" opacity=".55"/><path d="M10.2 6.6c.6-.9 1.4-1.3 2.2-1.3" opacity=".8"/><path d="M12 15.5v6M10 21.5h4"/>'),
 phone:S('<rect x="7.5" y="3" width="9" height="18" rx="2"/><path d="M11 18h2"/><path d="M3.5 9c-.8 1-.8 5 0 6M20.5 9c.8 1 .8 5 0 6"/>'),
 // Verdächtige
 hat:S('<path d="M7 16V6.5c0-.8.6-1.5 1.5-1.5h7c.9 0 1.5.7 1.5 1.5V16"/><path d="M7 13.5h10" stroke-width="2.2"/><path d="M3 16.5c0 1.2 4 2.3 9 2.3s9-1.1 9-2.3c0-.6-1-1-2.5-1.3H5.5C4 15.5 3 15.9 3 16.5z"/>'),
 basket:S('<path d="M4 10.5h16l-1.8 9H5.8z"/><path d="M7.5 10.5c0-4 2-6 4.5-6s4.5 2 4.5 6"/><path d="M8 13v4M12 13v4M16 13v4" opacity=".6"/><path d="M4.6 13.3h14.8" opacity=".6"/>'),
 key:S('<circle cx="7.5" cy="12" r="3.8"/><circle cx="7.5" cy="12" r="1.2"/><path d="M11.3 12H21M18 12v3M21 12v2.2"/>'),
 gear:S('<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/><circle cx="12" cy="12" r="6.2"/>'),
 teapot:S('<path d="M6 10.5h11v4a5.5 5.5 0 0 1-11 0z"/><path d="M17 11.5c2.3 0 3 1.2 3 2.2s-1 2.1-3.3 2.4"/><path d="M6 12.2L2.8 9.6"/><path d="M8.5 10.5c0-1.6 1.4-2.8 3-2.8s3 1.2 3 2.8"/><circle cx="11.5" cy="6.6" r=".9" fill="currentColor"/>'),
 anchor:S('<circle cx="12" cy="5" r="1.8"/><path d="M12 6.8V20M8 10h8"/><path d="M4.5 13.5c0 3.7 3.4 6.5 7.5 6.5s7.5-2.8 7.5-6.5"/><path d="M3 15l1.5-1.5L6 15M18 15l1.5-1.5L21 15"/>'),
 // Räume
 violin:S('<path d="M10 9.5c-2.2 0-3.6 1.4-3.6 3 0 .9.5 1.4.5 2 0 .5-.6 1-.6 2 0 2 2 3.5 4.7 3.5s4.7-1.5 4.7-3.5c0-1-.6-1.5-.6-2 0-.6.5-1.1.5-2 0-1.6-1.4-3-3.6-3z" transform="rotate(-35 11 15)"/><path d="M14.2 10.2L20 4.4M19 3.4l2 2" /><path d="M9.8 14.6l1.6 1.6"/>'),
 pot:S('<path d="M4.5 10h15v5.5A4.5 4.5 0 0 1 15 20H9a4.5 4.5 0 0 1-4.5-4.5z"/><path d="M2.5 11.5h2M19.5 11.5h2M8 10V8.5h8V10"/><path d="M9 6c.6-.8.6-1.6 0-2.4M12 6c.6-.8.6-1.6 0-2.4M15 6c.6-.8.6-1.6 0-2.4" opacity=".7"/>'),
 candle:S('<path d="M12 3.2c1.7 1.9 1.9 3.4.9 4.8-.4.5-1.4.5-1.8 0-1-1.4-.8-2.9.9-4.8z" fill="currentColor" stroke="none"/><path d="M12 8.5v1.5"/><rect x="9" y="10" width="6" height="8.5" rx=".8"/><path d="M6 20.5h12M7 18.5h10"/>'),
 // Pferd für die Kutsche
 horse:F('<path d="M7.5 21v-4.2c-1.3-.7-2.2-2.1-2.2-3.9 0-2.6 1.6-4.4 3.3-5.6L7.9 4.6l2.4 1.6c.6-.2 1.3-.3 2-.3 1.2 0 2.3.4 3.2 1.1l3.4 3.2c.6.6.7 1.5.1 2.1l-.5.5c-.5.5-1.3.6-1.9.2l-1.9-1.3-.3 2.4c-.2 1.5.4 3 1.6 3.9V21z" fill="currentColor"/><circle cx="14.3" cy="8.4" r=".7" fill="#fffaf0"/>'),
 // zeigender Finger für den Hinweis an der Schleife (zentriert um 0,0)
 handSvg:'<path d="M-3 -16c0-2 3.4-2 3.4 0v11.2c.4-1.8 3.6-1.6 3.6.4v1.2c.5-1.7 3.5-1.5 3.5.5v1.4c.6-1.6 3.4-1.3 3.4.7v6.3c0 5.2-3.4 9.3-8.6 9.3h-1.6c-3 0-5-1.4-6.6-3.8l-4.2-6.4c-.9-1.4 1-3.2 2.4-1.9L-3 2.5z" fill="#fffaf0" stroke="#2a1d14" stroke-width="1.6" stroke-linejoin="round"/><path d="M.4 -3.6v5M4 -2.4v4.4M7.5 -.9v3.6" fill="none" stroke="#2a1d14" stroke-width="1.2" stroke-linecap="round" opacity=".55"/>',
 // Schachfiguren als Silhouetten (w=weiß, b=schwarz)
 chess:function(kind,white){const fill=white?'#fbf4e2':'#1d140e',st=white?'#1d140e':'#e9d7b0';
  const P={
   knight:'<path d="M9 36h22l-1.5-4.5H10.5zM12 31.5h16c0-6-2.5-9-2.5-13.5 0-4-1.7-7.5-6-9.5l-1.7-3-1.6 3.3c-3.6 2-6.2 5.4-7.4 9.4-.5 1.6.6 3 2.2 2.8l3.6-.5c-1.6 4.7-2.6 7.2-2.6 11z"/><circle cx="16.5" cy="14.5" r="1.1" fill="'+st+'"/>',
   pawn:'<path d="M11 36h18l-1.5-4.5h-15zM14 31.5h12c-.5-4-2.7-6.3-4.3-7.6 1.9-1 3.1-2.9 3.1-5.1a5.8 5.8 0 0 0-11.6 0c0 2.2 1.2 4.1 3.1 5.1-1.6 1.3-3.8 3.6-4.3 7.6z"/>',
   king:'<path d="M9 36h22l-1.5-4.5H10.5zM11.5 31.5h17c-.4-4.2-2.2-7.5-3-11.6h-11c-.8 4.1-2.6 7.4-3 11.6zM13 19.9h14l1.2-3.6H11.8z"/><path d="M20 4.5v9M16.5 7.8h7" stroke-width="2.4"/>'};
  return '<svg class="piece" viewBox="0 0 40 40" aria-hidden="true"><g fill="'+fill+'" stroke="'+st+'" stroke-width="1.4" stroke-linejoin="round">'+P[kind]+'</g></svg>'},
 // facettierter Diamant mit Glanz
 diamond:'<svg class="gem-svg" viewBox="0 0 120 100" aria-hidden="true"><defs><linearGradient id="gmA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#cfefff"/><stop offset="1" stop-color="#6fb4e6"/></linearGradient><linearGradient id="gmB" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9f8ff"/><stop offset="1" stop-color="#4f93c9"/></linearGradient></defs><g stroke="#e8f7ff" stroke-width="1.2" stroke-linejoin="round"><path d="M30 8h60l26 26H4z" fill="url(#gmA)"/><path d="M4 34h112L60 96z" fill="url(#gmB)"/><path d="M30 8l12 26 18-26 18 26 12-26M4 34l56 62 56-62M42 34l18 62 18-62" fill="none" opacity=".85"/></g><path d="M38 14l8 14" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".9"/><circle cx="92" cy="24" r="2.4" fill="#fff"/></svg>'
};
})();

// gemalte Bildicons (Higgsfield), ersetzen die gezeichneten Motive
(function(){const I=(n,c)=>'<img class="kimg'+(c?' '+c:'')+'" src="a/ic/'+n+'.webp" alt="" draggable="false">';
 Object.assign(window.KI,{hat:I('hat'),basket:I('basket'),key:I('key'),gear:I('gear'),teapot:I('teapot'),anchor:I('anchor'),violin:I('violin'),pot:I('pot'),candle:I('candle'),mirror:I('mirror','kimg-sm'),
  chess:function(kind,white){return I((white?'w':'b')+kind,'piece')},
  diamond:I('diamond','gem-img')});})();
