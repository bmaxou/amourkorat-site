(function(){
"use strict";
var R=document.documentElement, ROOT=R.getAttribute('data-root')||'./';
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
function $(s,c){return (c||document).querySelector(s)}
function $$(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))}
function el(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e}
/* normalisation sans accents, caractère par caractère (même longueur que l'original) */
var MAP={'œ':'o','æ':'a','ß':'s','y':'i'};
function norm1(s){var o='';for(var i=0;i<s.length;i++){var c=s.charAt(i).toLowerCase();var d=MAP[c]||c.normalize('NFD').charAt(0);o+=/[a-z0-9]/.test(d)?d:' '}return o}
function norm(s){return norm1(s||'').replace(/\s+/g,' ').trim()}
function stem(w){if(w.length>4){var r=w.replace(/(ent|er|ez|es|e|s|x)$/,'');if(r.length>=4)return r;if(/[sx]$/.test(w))return w.slice(0,-1)}return w}

/* ---------- Thème et taille du texte */
function setTheme(t){if(t==='auto'){R.removeAttribute('data-theme')}else{R.setAttribute('data-theme',t)}ls('ak-theme',t);$$('[data-theme-set]').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-theme-set')===t)})}
function setScale(s){s=Math.max(.85,Math.min(1.5,Math.round(s*100)/100));R.style.setProperty('--scale',s);ls('ak-scale',String(s));var o=$('#scale-val');if(o)o.textContent=Math.round(s*100)+' %'}
setTheme(ls('ak-theme')||'auto');setScale(parseFloat(ls('ak-scale'))||1);
$$('[data-theme-set]').forEach(function(b){b.addEventListener('click',function(){setTheme(b.getAttribute('data-theme-set'))})});
$$('[data-scale]').forEach(function(b){b.addEventListener('click',function(){var d=b.getAttribute('data-scale');var cur=parseFloat(getComputedStyle(R).getPropertyValue('--scale'))||1;setScale(d==='0'?1:cur+parseFloat(d))})});

/* ---------- Panneaux, menu */
function closePanels(){$$('.panel.open').forEach(function(x){x.classList.remove('open')});$$('[data-panel]').forEach(function(b){b.setAttribute('aria-expanded','false')})}
$$('[data-panel]').forEach(function(b){b.addEventListener('click',function(e){e.stopPropagation();var p=document.getElementById(b.getAttribute('data-panel'));var o=!p.classList.contains('open');closePanels();closeMenus();if(o){p.classList.add('open');b.setAttribute('aria-expanded','true')}})});
function closeMenus(){$$('.dd.open').forEach(function(x){x.classList.remove('open');$('button',x).setAttribute('aria-expanded','false')})}
document.addEventListener('click',function(e){if(!e.target.closest('.panel'))closePanels();if(!e.target.closest('.dd'))closeMenus()});
var mb=$('.menu-btn'),nav=$('.nav');
if(mb&&nav)mb.addEventListener('click',function(e){e.stopPropagation();closePanels();var o=nav.classList.toggle('open');mb.setAttribute('aria-expanded',o);document.body.classList.toggle('nav-open',o)});
$$('.dd>button').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();var d=b.parentNode;var o=!d.classList.contains('open');closeMenus();closePanels();if(o){d.classList.add('open');b.setAttribute('aria-expanded','true')}})});

/* ---------- Traduction Google, chargée à la demande */
var tr=false;window.googleTranslateElementInit=function(){new google.translate.TranslateElement({pageLanguage:'fr',autoDisplay:false},'google_translate_element')};
$$('[data-panel="p-lang"]').forEach(function(b){b.addEventListener('click',function(){if(tr)return;tr=true;var s=document.createElement('script');s.src='https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';document.body.appendChild(s)})});

/* ---------- Progression de lecture, retour en haut, apparitions */
var pg=$('#progress'),tt=$('.totop'),hd=$('.site-header');
function onScroll(){var y=window.scrollY||0,h=R.scrollHeight-R.clientHeight;if(pg)pg.style.width=(h>0?y/h*100:0)+'%';if(tt)tt.classList.toggle('show',y>700);if(hd)hd.classList.toggle('scrolled',y>10)}
window.addEventListener('scroll',onScroll,{passive:true});onScroll();
if(tt)tt.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})});
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -40px 0px'});$$('.reveal').forEach(function(x){io.observe(x)})}else{$$('.reveal').forEach(function(x){x.classList.add('in')})}

/* ---------- Visionneuse de photos : suivante, précédente, loupe */
var lb=el('div');lb.id='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-label','Photo agrandie');
lb.innerHTML='<button class="lb-x" aria-label="Fermer">&times;</button><button class="lb-p" aria-label="Photo précédente">&#8249;</button><img alt=""><button class="lb-n" aria-label="Photo suivante">&#8250;</button><span class="lb-c"></span>';
document.body.appendChild(lb);
var lbi=$('img',lb),lbc=$('.lb-c',lb),set=[],cur=0;
function lbShow(i){cur=(i+set.length)%set.length;var im=set[cur];lbi.classList.remove('z');lbi.src=im.currentSrc||im.src;lbi.alt=im.alt||'';lbc.textContent=set.length>1?(cur+1)+' / '+set.length:'';lb.classList.toggle('multi',set.length>1)}
function lbClose(){lb.classList.remove('open');document.body.classList.remove('noscroll')}
$$('.prose img, .gal img, .fiche-img img, img.zoom').forEach(function(im){if(im.closest('.yt')||im.closest('a'))return;im.setAttribute('tabindex','0');
  function open(){var box=im.closest('.gal')||im.closest('.prose')||document;set=$$('img',box).filter(function(x){return !x.closest('.yt')&&!x.closest('a')&&(x.closest('.gal')||x.closest('.prose')||x===im)});if(set.indexOf(im)<0)set=[im];lbShow(set.indexOf(im));lb.classList.add('open');document.body.classList.add('noscroll')}
  im.addEventListener('click',open);im.addEventListener('keydown',function(e){if(e.key==='Enter')open()})});
lbi.addEventListener('click',function(e){e.stopPropagation();lbi.classList.toggle('z')});
$('.lb-p',lb).addEventListener('click',function(e){e.stopPropagation();lbShow(cur-1)});
$('.lb-n',lb).addEventListener('click',function(e){e.stopPropagation();lbShow(cur+1)});
lb.addEventListener('click',lbClose);
var tx=null;lb.addEventListener('touchstart',function(e){tx=e.touches[0].clientX},{passive:true});
lb.addEventListener('touchend',function(e){if(tx===null||lbi.classList.contains('z'))return;var d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>50&&set.length>1)lbShow(cur+(d<0?1:-1));tx=null});
document.addEventListener('keydown',function(e){if(e.key==='Escape'){lbClose();closeSearch();closePanels();closeMenus()}if(lb.classList.contains('open')){if(e.key==='ArrowRight')lbShow(cur+1);if(e.key==='ArrowLeft')lbShow(cur-1)}});

/* ---------- Glossaire : définition au survol, au clavier ou au toucher */
var tip=null,tipFor=null;
function hideTip(){if(tip){tip.remove();tip=null;tipFor=null}}
function showTip(a){hideTip();tip=el('div','gl-tip');tip.setAttribute('role','tooltip');tip.appendChild(el('b',null,a.getAttribute('data-t')));tip.appendChild(el('span',null,a.getAttribute('data-d')));var m=el('em',null,'Voir le glossaire');tip.appendChild(m);document.body.appendChild(tip);tipFor=a;
  var r=a.getBoundingClientRect();var x=Math.min(window.innerWidth-tip.offsetWidth-12,Math.max(12,r.left));var y=r.bottom+8;if(y+tip.offsetHeight>window.innerHeight-8)y=Math.max(8,r.top-tip.offsetHeight-8);tip.style.left=(x+window.scrollX)+'px';tip.style.top=(y+window.scrollY)+'px'}
$$('a.gl').forEach(function(a){
  a.addEventListener('mouseenter',function(){showTip(a)});a.addEventListener('mouseleave',hideTip);a.addEventListener('focus',function(){showTip(a)});a.addEventListener('blur',hideTip);
  a.addEventListener('touchend',function(e){if(tipFor!==a){e.preventDefault();showTip(a)}});
});
document.addEventListener('touchstart',function(e){if(tip&&!e.target.closest('a.gl'))hideTip()},{passive:true});
/* mot du glossaire ou question ouverte d'après l'adresse */
function openTarget(){var id=decodeURIComponent(location.hash.slice(1));if(!id)return;var t=document.getElementById(id);if(!t)return;if(t.tagName==='DETAILS')t.open=true;var d=t.closest('details');if(d)d.open=true;t.classList.add('target');setTimeout(function(){t.scrollIntoView({block:'center'})},60)}
window.addEventListener('hashchange',openTarget);openTarget();
$$('sup.ref a').forEach(function(a){a.addEventListener('click',function(){var d=$('details.refs');if(d)d.open=true})});

/* ---------- Films : le lecteur ne se charge qu'au clic */
$$('.yt').forEach(function(y){function play(){var id=y.getAttribute('data-yt');var f=document.createElement('iframe');f.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0';f.title=($('.yt-t',y)||{}).textContent||'Vidéo';f.allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';f.allowFullscreen=true;y.innerHTML='';y.classList.add('on');y.appendChild(f)}
  var b=$('button',y);if(b)b.addEventListener('click',play);var im=$('img',y);if(im)im.addEventListener('click',play)});

/* ---------- Recherche */
var IDX=null,SYN={},VOCAB=null,sr=null,sel=-1,filt='';
var STOP={};'le la les l de du des d un une et ou a au aux en pour avec mon ma mes son sa ses est ce cet cette ces que qu qui quel quelle quels quelles comment pourquoi dans sur chez il elle on je tu nous vous y ne pas plus se s si par mais donc or ni car quoi dont où ou faut peut peux faire fait avoir etre mon ton votre notre leur chat chats chatte korat korats ai as ont suis es sont trouve trouver situe veux voudrais savoir ils elles the du'.split(' ').forEach(function(w){STOP[w]=1});
var GROUPS=[['','Tout'],['Plantes','Plantes'],['Voyager','Pays'],['Le Korat','La race'],['levage','Élevage'],['Guide','Guide'],['Glossaire','Glossaire']];
function lev(a,b,max){if(Math.abs(a.length-b.length)>max)return 9;var d=[],i,j;for(i=0;i<=a.length;i++){d[i]=[i]}for(j=1;j<=b.length;j++)d[0][j]=j;
  for(i=1;i<=a.length;i++){var mn=9;for(j=1;j<=b.length;j++){var c=a.charAt(i-1)===b.charAt(j-1)?0:1;var v=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+c);if(i>1&&j>1&&a.charAt(i-1)===b.charAt(j-2)&&a.charAt(i-2)===b.charAt(j-1))v=Math.min(v,d[i-2][j-2]+1);d[i][j]=v;if(v<mn)mn=v}if(mn>max)return 9}return d[a.length][b.length]}
function prep(j){IDX=j.pages;VOCAB={};IDX.forEach(function(it){if(it.f&&!it.x)it.x=it.f.slice(0,420);it.T=norm(it.t).split(' ').map(stem);it.K=norm((it.k||'')+' '+(it.s||'')).split(' ').map(stem);it.X=norm(it.x||'');it.Xs={};it.X.split(' ').forEach(function(o){var w=stem(o);it.Xs[w]=1;if(!VOCAB[w])VOCAB[w]=o});norm(it.t+' '+(it.k||'')+' '+(it.s||'')).split(' ').forEach(function(o){var w=stem(o);if(!VOCAB[w]||VOCAB[w].length>o.length)VOCAB[w]=o});it.nt=norm(it.t)});
  (j.syn||[]).forEach(function(fam){fam.forEach(function(w){SYN[stem(w)]=fam.map(stem)})});prepFull()}
/* le texte intégral des pages est préparé par petits lots, sans bloquer la saisie */
function prepFull(){var i=0;(function step(){var n=0;while(i<IDX.length&&n<20){var it=IDX[i++];if(!it.f)continue;n++;var bag={};norm(it.f).split(' ').forEach(function(o){if(o.length<2)return;var w=stem(o);if(!bag[w]){bag[w]=1;if(!VOCAB[w])VOCAB[w]=o}});it.Fs=bag}
  if(i<IDX.length){setTimeout(step,0)}else if(sr&&sr._render){var inp=$('input',sr);if(inp&&norm(inp.value))sr._render(inp.value,true)}})()}
function findAt(n,words){for(var i=0;i<words.length;i++){if(words[i].length<2)continue;var k=n.indexOf(' '+words[i]);if(k>-1)return k+1;if(n.indexOf(words[i])===0)return 0}return -1}
function fuzzy(w){var max=w.length>=8?2:(w.length>=4?1:0);if(!max)return[];var out=[],best=9;for(var v in VOCAB){if(v.length<3||(v.charAt(0)!==w.charAt(0)&&max<2))continue;var d=lev(w,v,max);if(d<=max){if(d<best)best=d;out.push([v,d])}}return out.filter(function(o){return o[1]===best}).map(function(o){return o[0]}).slice(0,6)}
function search(q){
  var nq=norm(q.replace(/(^|\s)où(\s|$)/gi,' lieu ')),raw=nq.split(' ').filter(function(w){return w&&!STOP[w]});if(!raw.length&&nq)raw=nq.split(' ');var toks=raw.map(stem);if(!toks.length)return{res:[],fix:null};
  var plan=[],fixed=[],changed=false,N=IDX.length;
  function field(list,w,ex,pr){var s=0;for(var i=0;i<list.length;i++){var v=list[i];if(v===w){s=Math.max(s,ex)}else if(pr&&w.length>=3&&v.indexOf(w)===0){s=Math.max(s,pr)}}return s}
  toks.forEach(function(w,ti){var alt=[],known=VOCAB[w];if(!known){var pre=false;if(w.length>=3){for(var v in VOCAB){if(v.indexOf(w)===0){pre=true;break}}}if(!pre){if(SYN[w]){alt=SYN[w].filter(function(x){return x!==w}).slice(0,5)}else{alt=fuzzy(w);if(alt.length)changed=true}}}
    var key=alt.length&&!SYN[w]?alt[0]:w,df=0;IDX.forEach(function(it){if(field(it.T,key,1,1)||field(it.K,key,1,1)||it.Xs[key]||(it.Fs&&it.Fs[key]))df++});
    fixed.push(key!==w?(VOCAB[key]||key):raw[ti]);plan.push({w:w,alt:alt,idf:Math.max(.25,Math.log(N/(1+df))/Math.log(N)*1.6),syn:(SYN[key]||[]).filter(function(s){return s!==w&&s!==key})})});
  var sumIdf=0;plan.forEach(function(p){sumIdf+=p.idf});
  function score(it){var tot=0,got=0,direct=0;for(var i=0;i<plan.length;i++){var p=plan[i],s=0;
      s=Math.max(field(it.T,p.w,10,7),field(it.K,p.w,5,3.5),it.Xs[p.w]?3:(p.w.length>=3&&(it.X.indexOf(' '+p.w)>-1||it.X.indexOf(p.w)===0)?2:0));
      if(!s&&it.Fs&&it.Fs[p.w])s=1.3;
      if(!s){for(var a=0;a<p.alt.length;a++){s=Math.max(s,field(it.T,p.alt[a],8,0),field(it.K,p.alt[a],4,0),it.Xs[p.alt[a]]?2:0,it.Fs&&it.Fs[p.alt[a]]?1.2:0)}}
      if(s)direct+=p.idf;
      if(s<3){for(var y=0;y<p.syn.length;y++){s=Math.max(s,field(it.T,p.syn[y],3,0),field(it.K,p.syn[y],2,0),it.Xs[p.syn[y]]?.7:0)}}
      if(s){got+=p.idf;tot+=s*p.idf}}
    var cov=got/sumIdf;if(cov<.45||direct/sumIdf<.35)return 0;
    if(it.nt===nq)tot+=14;else if(it.nt.indexOf(nq)===0)tot+=8;else if(nq.length>3&&it.nt.indexOf(nq)>-1)tot+=5;if(!it.p)tot+=1;tot+=Math.max(0,1.5-it.T.length*.2);return tot*cov*cov*(it.b||1)}
  var res=[];IDX.forEach(function(it){var s=score(it);if(s)res.push([s,it])});
  res.sort(function(a,b){return b[0]-a[0]});
  var top=res.length?res[0][0]:0,seen={},dup={},out=[];res.forEach(function(r){if(r[0]<top*.3)return;var it=r[1],base=it.u.split('#')[0],k=it.nt+'|'+it.s;if(dup[k])return;dup[k]=1;seen[base]=(seen[base]||0)+1;if(seen[base]<=2)out.push(it)});
  var words=[];plan.slice().sort(function(a,b){return b.idf-a.idf}).forEach(function(p){words.push(p.w);p.alt.forEach(function(a){words.push(a)})});
  return{res:out,fix:changed?fixed.join(' '):null,words:words}}
function hl(node,text,words){var n=norm1(text),marks=[];words.forEach(function(w){if(w.length<2)return;var i=0;while((i=n.indexOf(w,i))>-1){if(i===0||n.charAt(i-1)===' '){var e=i+w.length;while(e<n.length&&n.charAt(e)!==' ')e++;marks.push([i,e])}i+=w.length}});
  marks.sort(function(a,b){return a[0]-b[0]});var pos=0;marks.forEach(function(m){if(m[0]<pos)return;node.appendChild(document.createTextNode(text.slice(pos,m[0])));node.appendChild(el('mark',null,text.slice(m[0],m[1])));pos=m[1]});node.appendChild(document.createTextNode(text.slice(pos)))}
function snippet(x,words,pos){if(!x)return'';var at=pos==null?findAt(norm1(x),words):pos;if(at<0)at=0;var st=Math.max(0,at-45);if(st>0){var sp=x.indexOf(' ',st);if(sp>-1&&sp<at)st=sp+1}var out=x.slice(st,st+135);return(st>0?'… ':'')+out+(st+135<x.length?' …':'')}
function closeSearch(){if(sr&&sr.classList.contains('open')){sr.classList.remove('open');document.body.classList.remove('noscroll')}}
function openSearch(q){
  if(!sr){sr=el('div');sr.id='sr';sr.setAttribute('role','dialog');sr.setAttribute('aria-label','Recherche sur le site');
    sr.innerHTML='<div class="box"><div class="sr-top"><input class="field" type="search" placeholder="Une plante, un pays, une question…" aria-label="Rechercher" autocomplete="off"><button class="sr-x" aria-label="Fermer la recherche">&times;</button></div><div class="sr-f"></div><div class="sr-m" aria-live="polite"></div><ul></ul><div class="hint">Flèches pour parcourir, Entrée pour ouvrir, Échap pour fermer</div></div>';
    document.body.appendChild(sr);
    var inp=$('input',sr),ul=$('ul',sr),msg=$('.sr-m',sr),ff=$('.sr-f',sr);
    sr.addEventListener('click',function(e){if(e.target===sr)closeSearch()});$('.sr-x',sr).addEventListener('click',closeSearch);
    GROUPS.forEach(function(g){var b=el('button','pill',g[1]);b.type='button';b.setAttribute('aria-pressed',g[0]===''?'true':'false');b.addEventListener('click',function(){filt=g[0];$$('.pill',ff).forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});render(inp.value)});ff.appendChild(b)});
    var SUG=[['Chatons disponibles','chatons disponibles'],['Prix d\'un Korat','prix'],['Muguet','muguet'],['Lys','lys'],['Partir au Japon','japon'],['Vaccins','vaccins'],['Allergie','allergie'],['Yeux verts','yeux verts'],['Pedigree','pedigree']];
    function home(){ul.innerHTML='';msg.innerHTML='';ff.style.display='none';var w=el('div','sr-sug');var rec=[];try{rec=JSON.parse(ls('ak-rech')||'[]')}catch(e){}
      if(rec.length){w.appendChild(el('h5',null,'Vos dernières recherches'));var r=el('div','pills');rec.forEach(function(t){var b=el('button','pill',t);b.type='button';b.addEventListener('click',function(){inp.value=t;render(t);inp.focus()});r.appendChild(b)});w.appendChild(r)}
      w.appendChild(el('h5',null,'Souvent cherché'));var p=el('div','pills');SUG.forEach(function(s){var b=el('button','pill',s[0]);b.type='button';b.addEventListener('click',function(){inp.value=s[1];render(s[1]);inp.focus()});p.appendChild(b)});w.appendChild(p);msg.appendChild(w)}
    function render(q,keep){if(!keep)sel=-1;ul.innerHTML='';msg.innerHTML='';if(!norm(q)){home();return}if(!IDX){msg.textContent='Chargement…';return}
      ff.style.display='';var r=search(q),list=r.res;if(filt)list=list.filter(function(it){return (it.s||'').indexOf(filt)>-1});
      if(r.fix&&r.res.length){var d=el('p','sr-fix','Résultats pour ');d.appendChild(el('b',null,r.fix));msg.appendChild(d)}
      if(!list.length){var n=el('div','sr-none');n.appendChild(el('b',null,'Aucun résultat pour « '+q.trim()+' »'+(filt?' dans cette rubrique.':'.')));n.appendChild(el('span',null,'Essayez un autre mot, ou posez-nous directement la question.'));var a=el('a','btn btn-ghost','Nous écrire');a.href=ROOT+'contact.html';n.appendChild(a);msg.appendChild(n);return}
      var c=el('p','sr-count',list.length+(list.length>1?' résultats':' résultat'));msg.appendChild(c);
      list.slice(0,40).forEach(function(it){var li=el('li'),a=el('a');a.href=ROOT+it.u;var t=el('b');hl(t,it.t,r.words);a.appendChild(t);var X=it.x||'',at=findAt(norm1(X),r.words),sec=null;
        if(at<0&&it.f){if(!it.Fn)it.Fn=norm1(it.f);var k=findAt(it.Fn,r.words);if(k>-1){X=it.f;at=k;(it.h||[]).forEach(function(h){if(h[0]<=k+2)sec=h})}}
        if(sec){a.href=ROOT+it.u+'#'+sec[1]}
        var s=el('small',null,(it.s||'').split(' · ').slice(0,2).join(' · ')+(sec&&sec[2]?' · '+sec[2]:''));a.appendChild(s);var sn=snippet(X,r.words,at);if(sn){var p=el('span');hl(p,sn,r.words);a.appendChild(p)}
        a.addEventListener('click',function(){remember(q)});li.appendChild(a);ul.appendChild(li)})}
    function remember(q){q=q.trim();if(q.length<3)return;var rec=[];try{rec=JSON.parse(ls('ak-rech')||'[]')}catch(e){}rec=[q].concat(rec.filter(function(x){return norm(x)!==norm(q)})).slice(0,5);ls('ak-rech',JSON.stringify(rec))}
    var tmr=null;inp.addEventListener('input',function(){clearTimeout(tmr);tmr=setTimeout(function(){render(inp.value)},70)});
    inp.addEventListener('keydown',function(e){var as=$$('ul a',sr);if(e.key==='ArrowDown'){sel=Math.min(as.length-1,sel+1);e.preventDefault()}else if(e.key==='ArrowUp'){sel=Math.max(0,sel-1);e.preventDefault()}else if(e.key==='Enter'){if(as.length){remember(inp.value);location.href=as[Math.max(0,sel)].href}return}else return;as.forEach(function(a,i){a.classList.toggle('sel',i===sel)});if(as[sel])as[sel].scrollIntoView({block:'nearest'})});
    sr._render=render;home();
    fetch(ROOT+'assets/search.json').then(function(r){return r.json()}).then(function(j){prep(j);render(inp.value)}).catch(function(){msg.textContent='La recherche est momentanément indisponible.'});
  }
  closePanels();sr.classList.add('open');document.body.classList.add('noscroll');var i=$('input',sr);if(q){i.value=q;sr._render(q)}setTimeout(function(){i.focus();i.select()},30);
}
$$('[data-search]').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();openSearch()})});
document.addEventListener('keydown',function(e){var tag=((document.activeElement||{}).tagName||'').toLowerCase();if((e.key==='/'&&tag!=='input'&&tag!=='textarea')||((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k')){e.preventDefault();openSearch()}});
var qp=/[?&]q=([^&]+)/.exec(location.search);if(qp)openSearch(decodeURIComponent(qp[1].replace(/\+/g,' ')));

/* ---------- Formulaire de contact */
$$('form.contact').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();var st=$('.status',f),btn=$('button[type=submit]',f),em=$('input[type=email]',f),ms=$('textarea',f);st.className='status';
  if(!em.value||!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em.value)){st.className='status err';st.textContent='Merci d\'indiquer une adresse e-mail valide, pour que nous puissions vous répondre.';em.focus();return}
  if(!ms.value.trim()){st.className='status err';st.textContent='Votre message est vide.';ms.focus();return}
  btn.disabled=true;btn.textContent='Envoi en cours…';
  fetch('/contact.php',{method:'POST',body:new FormData(f)}).then(function(r){return r.json()}).then(function(j){if(j.ok){st.className='status ok';st.textContent='Merci, votre message est bien parti. Nous vous répondons rapidement.';f.reset()}else{st.className='status err';st.textContent=j.error||"L'envoi a échoué."}}).catch(function(){st.className='status err';st.textContent="L'envoi a échoué. Vous pouvez écrire directement à contact@amourkorat.com."}).then(function(){btn.disabled=false;btn.textContent='Envoyer le message'})})});

/* ---------- Quiz */
$$('.quiz[data-quiz]').forEach(function(box){
  var data=JSON.parse(document.getElementById(box.getAttribute('data-quiz')).textContent);
  var mode=data.mode||'score',qs,i,score,tally;
  function pick(){qs=data.questions.slice();if(data.shuffle){for(var k=qs.length-1;k>0;k--){var r=Math.floor(Math.random()*(k+1));var t=qs[k];qs[k]=qs[r];qs[r]=t}qs=qs.slice(0,data.count||qs.length)}i=0;score=0;tally={}}
  function draw(){
    if(i>=qs.length)return end();
    var q=qs[i];box.innerHTML='';var bar=el('div','bar');var bi=el('i');bi.style.width=(i/qs.length*100)+'%';bar.appendChild(bi);box.appendChild(bar);
    box.appendChild(el('span','kicker','Question '+(i+1)+' sur '+qs.length));
    if(q.img){var im=el('img','q-img');im.src=ROOT+q.img;im.alt='';box.appendChild(im)}
    var qq=el('div','q',q.q);qq.setAttribute('tabindex','-1');box.appendChild(qq);var opts=el('div','opts');box.appendChild(opts);var ex=el('div','expl');ex.setAttribute('aria-live','polite');box.appendChild(ex);
    var foot=el('div','foot');var chip=el('span','chip',mode==='score'?'Score : '+score:'Prenez votre temps');foot.appendChild(chip);var nx=el('button','btn btn-primary next');nx.type='button';nx.style.display='none';foot.appendChild(nx);box.appendChild(foot);
    q.o.forEach(function(o,k){var b=el('button','opt',o.t||o);b.type='button';b.addEventListener('click',function(){
      if(mode==='profil'){Object.keys(o.p||{}).forEach(function(c){tally[c]=(tally[c]||0)+o.p[c]});i++;draw();return}
      $$('.opt',box).forEach(function(x){x.disabled=true});var ok=k===q.a;if(ok)score++;b.classList.add(ok?'good':'bad');$$('.opt',box)[q.a].classList.add('good');
      ex.appendChild(el('b',null,ok?'Exact. ':'Pas tout à fait. '));ex.appendChild(document.createTextNode(q.e||''));if(q.l){ex.appendChild(document.createTextNode(' '));var a=el('a',null,'En savoir plus');a.href=ROOT+q.l;ex.appendChild(a)}ex.style.display='block';
      chip.textContent='Score : '+score;nx.style.display='inline-flex';nx.textContent=i+1<qs.length?'Question suivante':'Voir mon résultat';nx.onclick=function(){i++;draw();var f=$('.q',box);if(f)f.focus()};nx.focus()
    });opts.appendChild(b)});
  }
  function end(){box.innerHTML='';var foot=el('div','foot');var again=el('button','btn btn-ghost',mode==='profil'?'Recommencer':'Rejouer');again.type='button';again.addEventListener('click',function(){pick();draw()});
    if(mode==='profil'){var best=null;Object.keys(tally).forEach(function(c){if(best===null||tally[c]>tally[best])best=c});var r=data.results[best]||data.results[Object.keys(data.results)[0]];box.appendChild(el('span','kicker','Votre résultat'));box.appendChild(el('div','q',r.t));var p=el('p','res',r.d);box.appendChild(p);foot.appendChild(again);var a=el('a','btn btn-primary','Rencontrer nos Korats');a.href=ROOT+'chatons.html';foot.appendChild(a)}
    else{var pc=score/qs.length;box.appendChild(el('span','kicker','Votre résultat'));box.appendChild(el('div','score',score+' / '+qs.length));box.appendChild(el('p','res',pc>=.8?data.top:pc>=.5?data.mid:data.low));foot.appendChild(again);if(data.more){var m=el('a','btn btn-primary',data.more[1]);m.href=ROOT+data.more[0];foot.appendChild(m)}}
    box.appendChild(foot)}
  pick();draw();
});

/* ---------- Listes filtrables : plantes, pays, glossaire, questions */
$$('[data-filter-list]').forEach(function(wrap){
  var list=document.getElementById(wrap.getAttribute('data-filter-list'));if(!list)return;var items=$$('[data-k]',list);var q=$('input[type=search]',wrap);var lvl='',letter='';var cnt=$('.count',wrap),empty=$('.empty',wrap);
  items.forEach(function(it){it._k=norm(it.getAttribute('data-k'));it._w=it._k.split(' ')});
  function match(it,ws){for(var i=0;i<ws.length;i++){var w=ws[i],ok=it._k.indexOf(w)>-1;if(!ok&&w.length>=4){var mx=w.length>=8?2:1;for(var j=0;j<it._w.length&&!ok;j++){var v=it._w[j];if(v.length>=w.length-mx&&lev(w,v.slice(0,w.length+mx>v.length?v.length:w.length),mx)<=mx)ok=true}}if(!ok)return false}return true}
  function apply(){var ws=norm(q?q.value:'').split(' ').filter(Boolean).map(stem);var n=0;items.forEach(function(it){var ok=(!ws.length||match(it,ws))&&(!lvl||it.getAttribute('data-l')===lvl)&&(!letter||it._k.charAt(0)===letter);it.hidden=!ok;if(ok)n++;if(it.tagName==='DETAILS'&&ws.length&&ok&&n===1&&items.length>3){}});
    $$('[data-zone]',list).forEach(function(z){z.hidden=!$$('[data-k]',z).some(function(x){return !x.hidden})});
    $$('h2.sub,p.lead.small',list).forEach(function(h){var nx=h.nextElementSibling;while(nx&&!nx.querySelector('[data-k]')&&!/H2/.test(nx.tagName))nx=nx.nextElementSibling;if(/H2/.test(h.tagName)&&nx&&nx.querySelector)h.hidden=!$$('[data-k]',nx).some(function(x){return !x.hidden})});
    if(cnt)cnt.textContent=(ws.length||lvl||letter)?n+(n>1?' résultats':' résultat'):'';if(empty)empty.hidden=n>0}
  if(q)q.addEventListener('input',apply);
  $$('[data-lvl]',wrap).forEach(function(b){b.addEventListener('click',function(){lvl=b.getAttribute('data-lvl');$$('[data-lvl]',wrap).forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});apply()})});
  $$('[data-letter]',wrap).forEach(function(b){b.addEventListener('click',function(){var l=b.getAttribute('data-letter');letter=letter===l?'':l;$$('[data-letter]',wrap).forEach(function(x){x.setAttribute('aria-pressed',x.getAttribute('data-letter')===letter?'true':'false')});apply()})});
  apply();
});

/* ---------- Calcul de la date de mise bas */
$$('.calc[data-gest]').forEach(function(c){var d=$('input[type=date]',c),o=$('.out',c);d.addEventListener('input',function(){o.innerHTML='';if(!d.value)return;var t=new Date(d.value+'T12:00:00');function add(n){var x=new Date(t);x.setDate(x.getDate()+n);return x.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
  o.appendChild(el('p','big','Mise bas la plus probable entre le '+add(63)+' et le '+add(65)+'.'));o.appendChild(el('p','src','Fourchette possible : du '+add(58)+' au '+add(72)+'.'))})});
})();
