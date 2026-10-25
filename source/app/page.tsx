'use client';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import ExtendedScenes from './ExtendedScenes';
import { sceneTitles } from './sources';
import { projectClass, authorsLine } from './project';

function Arrow({left=false}:{left?:boolean}) { return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{transform:left?'rotate(180deg)':undefined}}><path d="M4 12h15M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function Leaf(){return <svg viewBox="0 0 32 36" fill="none" aria-hidden="true"><path d="M26 3C9 3 2 12 5 23c3 10 19 10 21-5 1-6 0-10 0-15Z" stroke="currentColor" strokeWidth="1.4"/><path d="M6 34c0-10 6-19 15-25M8 24l11-2M12 17l-1-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>}
export default function Home(){
 const [menu,setMenu]=useState(false);
 const [scene,setScene]=useState(0); const [split,setSplit]=useState(50); const [full,setFull]=useState(false); const [notice,setNotice]=useState('');
 const frame=useRef<HTMLDivElement>(null); const surface=useRef<HTMLElement>(null); const busy=useRef(false); const drag=useRef(false); const reduce=useRef(false); const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const go=useCallback((next:number)=>{ if(next<0||next>13||busy.current||next===scene)return;busy.current=true;gsap.to(surface.current,{opacity:0,y:reduce.current?0:-18,duration:reduce.current?0:0.38,ease:'power2.inOut',onComplete:()=>{setScene(next);setMenu(false);busy.current=false;}}); },[scene]);
 const fullscreen=useCallback(async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{setNotice('Полноэкранный режим недоступен. Используйте F11 в браузере.');}},[]);
 useEffect(()=>{reduce.current=window.matchMedia('(prefers-reduced-motion: reduce)').matches;const sync=()=>setFull(!!document.fullscreenElement);document.addEventListener('fullscreenchange',sync);return()=>document.removeEventListener('fullscreenchange',sync);},[]);
 useEffect(()=>{const key=(e:KeyboardEvent)=>{const el=e.target as HTMLElement;if(document.querySelector('dialog[open]')||el.tagName==='TEXTAREA'||el.tagName==='SELECT'||el.isContentEditable||el.tagName==='INPUT'||e.altKey||e.ctrlKey||e.metaKey)return;if(e.code==='Space'&&el.tagName==='BUTTON')return;if(e.key==='ArrowRight'||e.key==='PageDown'||e.code==='Space'){e.preventDefault();go(scene+1);}if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();go(scene-1);}if(e.key.toLowerCase()==='f'){e.preventDefault();fullscreen();}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);},[scene,go,fullscreen]);
 useLayoutEffect(()=>{const ctx=gsap.context(()=>{gsap.fromTo(surface.current,{opacity:0,y:reduce.current?0:22},{opacity:1,y:0,duration:reduce.current?0:0.85,ease:'power3.out'});gsap.fromTo('.reveal',{opacity:0,y:reduce.current?0:28},{opacity:1,y:0,stagger:0.11,delay:0.12,duration:reduce.current?0:0.95,ease:'power3.out'});if(scene===0&&!reduce.current)gsap.fromTo('.hero-photo',{scale:1.075},{scale:1,duration:9,ease:'power2.out'});},surface);return()=>ctx.revert();},[scene]);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
 const at=(e:React.PointerEvent)=>{const r=frame.current!.getBoundingClientRect();setSplit(Math.max(0,Math.min(100,((e.clientX-r.left)/r.width)*100)));};
 const preset=(n:number)=>{const value={p:split};gsap.to(value,{p:n,duration:reduce.current?0:0.65,ease:'power2.inOut',onUpdate:()=>setSplit(value.p)});};
 return <main className="presentation min-h-dvh flex flex-col">
 <header className="header flex items-center justify-between">
  <a href="#" className="brand flex items-center" aria-label="GREEN HAVEN — начало" onClick={e=>{e.preventDefault();go(0);}}><Leaf/><span>GREEN HAVEN<small>МАХАЛЛЯ БУДУЩЕГО</small></span></a>
  <nav className="scene-nav flex items-center" aria-label="Сцены презентации"><button className={scene===0?'active':''} onClick={()=>go(0)}><span>01</span> Идея</button><button className={scene===1?'active':''} onClick={()=>go(1)}><span>02</span> Преображение</button><button className="all-scenes" aria-expanded={menu} onClick={()=>setMenu(!menu)}>Все сцены <span>≡</span></button></nav>
  <div className="header-right flex items-center"><span className="project-label">ШКОЛЬНЫЙ ПРОЕКТ <i/> {projectClass} КЛАСС</span><button className="fullscreen icon-button" onClick={fullscreen} aria-label={full?'Выйти из полноэкранного режима':'На весь экран'} title="На весь экран · F"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true">{full?<path d="M9 3v6H3m12-6v6h6M9 21v-6H3m12 6v-6h6"/>:<path d="M9 4H4v5m11-5h5v5M4 15v5h5m11-5v5h-5"/>}</svg></button></div>
 </header>
 {menu&&<nav className="scene-directory" aria-label="Выбрать сцену">{sceneTitles.map((title,i)=><button key={title} onClick={()=>{if(i===scene)setMenu(false);else go(i);}} aria-current={i===scene?"step":undefined}><span>{String(i+1).padStart(2,"0")}</span>{title}</button>)}</nav>}
 <section ref={surface} className="scene" aria-label={"Сцена "+(scene+1)+". "+sceneTitles[scene]}>
 {scene===0?<div className="hero">
  <img className="hero-photo" src="/images/after.webp" alt="Визуализация GREEN HAVEN: светлые дома, зелёный двор и водный канал на фоне гор" fetchPriority="high"/>
  <div className="hero-shade"/>
  <div className="hero-content"><div className="eyebrow reveal"><span className="tiny-line"/> ПРИРОДА. ЛЮДИ. НОВЫЙ БАЛАНС.</div><h1 className="reveal">GREEN<br/><span>HAVEN</span></h1><p className="hero-subtitle reveal">Махалля будущего.<br/>Ближе к природе. Ближе друг к другу.</p><button className="hero-cta reveal inline-flex items-center" onClick={()=>go(1)}>Увидеть преображение <Arrow/></button></div>
  <div className="hero-note reveal"><span className="note-cross">+</span><p>Будущее начинается<br/>с нашего двора.</p><span className="note-line"/><small>КОНЦЕПЦИЯ УСТОЙЧИВОЙ МАХАЛЛИ</small></div>
  <div className="hero-authors"><span>ПРОЕКТ 10 «Ж» КЛАССА</span><p>{authorsLine}</p></div>
  <span className="image-credit">АРХИТЕКТУРНАЯ ВИЗУАЛИЗАЦИЯ · ВЫМЫШЛЕННЫЙ ПРОЕКТ</span>
 </div>:scene===1?<div className="transformation">
  <div className="compare-heading"><div><div className="eyebrow reveal"><span className="tiny-line"/> 02 — ПРЕОБРАЖЕНИЕ</div><h2 className="reveal">Один двор. <em>Другое будущее.</em></h2></div><p className="compare-intro reveal">Больше тени, зелени и места для жизни.<br/>Передвиньте границу — увидьте перемены.</p></div>
  <div ref={frame} className="compare-frame reveal" style={{'--split':split+'%'} as React.CSSProperties} onPointerDown={e=>{if(e.button!==0)return;drag.current=true;e.currentTarget.setPointerCapture(e.pointerId);at(e);}} onPointerMove={e=>{if(drag.current)at(e);}} onPointerUp={()=>drag.current=false} onPointerCancel={()=>drag.current=false}>
   <img className="compare-img" src="/images/after.webp" alt="После: тот же двор с деревьями, цветниками, тенистыми дорожками и водой"/>
   <div className="before-layer" style={{clipPath:'inset(0 '+(100-split)+'% 0 0)'}}><img className="compare-img" src="/images/before.webp" alt="До: тот же ракурс двора с изношенным покрытием и сухим грунтом"/></div>
   <span className="state-label label-before">ДО <span>Обычный двор</span></span><span className="state-label label-after"><i/> ПОСЛЕ <span>GREEN HAVEN</span></span>
   <div className="divider" style={{left:split+'%'}}><span className="drag-handle"><svg viewBox="0 0 40 20" fill="none" aria-hidden="true"><path d="m14 5-5 5 5 5m12-10 5 5-5 5M20 4v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span></div>
   <input className="compare-range" type="range" min="0" max="100" step="1" value={Math.round(split)} onChange={e=>setSplit(Number(e.target.value))} onPointerDown={e=>e.stopPropagation()} aria-label="Сравнение до и после" aria-valuetext={'Видно '+Math.round(split)+' процентов исходного двора'} />
   <div className="drag-hint" aria-hidden="true">↔ <span>ПОТЯНИТЕ, ЧТОБЫ СРАВНИТЬ</span></div>
  </div>
  <div className="compare-caption reveal"><p><span className="green-dot"/> Тот же ракурс. Новая среда для жизни.</p><div className="presets"><button onClick={()=>preset(100)}>До</button><button onClick={()=>preset(50)} aria-label="Разделить сравнение поровну">50 / 50</button><button onClick={()=>preset(0)}>После</button></div><span className="concept-note">Визуальная концепция озеленения</span></div>
 </div>:<ExtendedScenes scene={scene} onRestart={()=>go(0)}/>}
 </section>
 <footer className="footer flex items-center justify-between"><div className="footer-left"><span className="scene-number">{String(scene+1).padStart(2,"0")}<span> / 14</span></span><span className="footer-divider"/><span className="scene-title">{sceneTitles[scene].toUpperCase()}</span></div><nav className="deck-progress" aria-label="Прогресс презентации">{sceneTitles.map((title,i)=><button key={title} className={i===scene?"current":""} aria-label={"Перейти к сцене "+(i+1)+": "+title} aria-current={i===scene?"step":undefined} onClick={()=>go(i)}/>)}</nav><div className="footer-controls"><span className="keyboard-hint">← → ДЛЯ НАВИГАЦИИ</span><button className="icon-button" disabled={scene===0} onClick={()=>go(scene-1)} aria-label="Предыдущая сцена"><Arrow left/></button><button className="icon-button next-button" disabled={scene===13} onClick={()=>go(scene+1)} aria-label="Следующая сцена"><Arrow/></button></div></footer>
 {notice&&<div className="notice" role="status" onClick={()=>setNotice('')}>{notice}<button aria-label="Закрыть сообщение">×</button></div>}
 </main>;
}
