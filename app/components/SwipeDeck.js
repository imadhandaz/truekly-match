"use client";
import { useState, useRef } from "react";
import MatchModal from "./MatchModal";
import { recordSwipe } from "@/lib/db";

const MY_PRODUCT = { title:"Tu producto", photos:["https://images.unsplash.com/photo-1556656793-08538906a9f8?w=900&q=80"], owner:"Tú" };

export default function SwipeDeck({ items, onMatch, onOpenChat, onSwipe, outOfSwipes, onUpgrade, userId }) {
  const [index,setIndex]=useState(0);const [photoIdx,setPhotoIdx]=useState(0);const [drag,setDrag]=useState({x:0,y:0});
  const [dragging,setDragging]=useState(false);const [decision,setDecision]=useState(null);const [expanded,setExpanded]=useState(false);
  const [matchedProduct,setMatchedProduct]=useState(null);const startRef=useRef({x:0,y:0,t:0});
  const current=items[index];const next1=items[index+1];const next2=items[index+2];
  const onPointerDown=(e)=>{setDragging(true);startRef.current={x:e.clientX,y:e.clientY,t:Date.now()};e.currentTarget.setPointerCapture(e.pointerId);};
  const onPointerMove=(e)=>{if(!dragging)return;setDrag({x:e.clientX-startRef.current.x,y:e.clientY-startRef.current.y});};
  const onPointerUp=(e)=>{
    if(!dragging)return;setDragging(false);
    const dt=Date.now()-startRef.current.t;const moved=Math.abs(drag.x)+Math.abs(drag.y);
    if(drag.x>110){commit("yes");}else if(drag.x<-110){commit("no");}else if(moved<8&&dt<250){handleTap(e);setDrag({x:0,y:0});}else{setDrag({x:0,y:0});}
  };
  const handleTap=(e)=>{
    const rect=e.currentTarget.getBoundingClientRect();const x=e.clientX-rect.left;const w=rect.width;
    if(x<w/3&&current.photos.length>1){setPhotoIdx((p)=>(p-1+current.photos.length)%current.photos.length);}
    else if(x>(w*2)/3&&current.photos.length>1){setPhotoIdx((p)=>(p+1)%current.photos.length);}
    else{setExpanded((v)=>!v);}
  };
  const commit=(choice)=>{
    if(outOfSwipes){onUpgrade?.();setDrag({x:0,y:0});return;}
    setDecision(choice);onSwipe?.(current,choice);
    const positive=choice==="yes"||choice==="super";
    const swipePromise=positive&&userId&&current?.id?recordSwipe(userId,current.id,choice).catch(()=>null):Promise.resolve(null);
    setTimeout(()=>{swipePromise.then((matchId)=>{
      let shouldMatch=false;
      if(positive){if(userId){shouldMatch=matchId!==null;}else{const chance=choice==="super"?Math.min(1,(current.matchChance||0.5)+0.3):current.matchChance||0.5;shouldMatch=Math.random()<chance;}}
      if(shouldMatch){const matchData={...current,matchId:matchId||null};setMatchedProduct(matchData);onMatch?.(matchData);}
      setIndex((i)=>i+1);setPhotoIdx(0);setExpanded(false);setDrag({x:0,y:0});setDecision(null);
    });},250);
  };
  const closeMatch=()=>setMatchedProduct(null);
  const angle=drag.x/18;
  const yesOpacity=Math.min(Math.max(drag.x/110,0),1);
  const noOpacity=Math.min(Math.max(-drag.x/110,0),1);
  const exitTransform=decision==="yes"?"translate(600px,-80px) rotate(25deg)":decision==="no"?"translate(-600px,-80px) rotate(-25deg)":decision==="super"?"translate(0,-700px) scale(0.6)":`translate(${drag.x}px,${drag.y}px) rotate(${angle}deg)`;
  if(!current)return(
    <div className="flex flex-col items-center justify-center text-center px-6 py-20">
      <div className="w-28 h-28 rounded-full flex items-center justify-center mb-6 text-6xl" style={{background:"linear-gradient(135deg,rgba(16,185,129,0.15),rgba(14,165,233,0.15))",border:"2px solid rgba(16,185,129,0.2)"}}>🎉</div>
      <h2 className="text-3xl font-black mb-2 bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">¡Has visto todo!</h2>
      <p className="text-foreground/60">Vuelve más tarde a por nuevos productos.</p>
    </div>
  );
  return(<>
    <div className="relative w-full max-w-sm mx-auto" style={{aspectRatio:"3/4.6"}}>
      {next2&&<Card item={next2} depth={2} photoIdx={0}/>}
      {next1&&<Card item={next1} depth={1} photoIdx={0}/>}
      <div onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
        className="absolute inset-0 select-none touch-none cursor-grab active:cursor-grabbing"
        style={{transform:exitTransform,transition:dragging?"none":"transform 250ms cubic-bezier(0.2,0.8,0.2,1)"}}>
        <Card item={current} depth={0} yesOpacity={yesOpacity} noOpacity={noOpacity} photoIdx={photoIdx} expanded={expanded}/>
      </div>
      <div className="absolute -bottom-28 left-0 right-0 flex justify-center items-end gap-5">
        <ActionBtn onClick={()=>commit("no")} label="Paso">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#ef4444" strokeWidth="2.8" strokeLinecap="round"/></svg>
        </ActionBtn>
        <ActionBtn onClick={()=>commit("yes")} label="¡Me interesa!" big>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="white"/></svg>
        </ActionBtn>
        <ActionBtn onClick={()=>commit("super")} label="Super">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#6366f1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        </ActionBtn>
      </div>
    </div>
    {matchedProduct&&(<MatchModal myProduct={MY_PRODUCT} theirProduct={matchedProduct} onClose={closeMatch} onChat={()=>{const p=matchedProduct;closeMatch();onOpenChat?.(p);}}/>)}
  </>);
}

function ActionBtn({children,onClick,label,big=false}){
  const size=big?72:58;
  const bg=big?"linear-gradient(135deg,#10b981,#0ea5e9)":"rgba(255,255,255,0.9)";
  const shadow=big?"0 8px 32px rgba(16,185,129,0.5)":"0 4px 16px rgba(0,0,0,0.1)";
  const border=big?"none":"1.5px solid rgba(0,0,0,0.08)";
  return(
    <div className="flex flex-col items-center gap-1.5">
      <button onClick={onClick} className="flex items-center justify-center rounded-full transition-all active:scale-90 hover:scale-110"
        style={{width:size,height:size,background:bg,boxShadow:shadow,border}}>
        {children}
      </button>
      <span style={{fontSize:10,fontWeight:700,color:"rgba(0,0,0,0.38)",letterSpacing:"0.04em",textTransform:"uppercase"}}>{label}</span>
    </div>
  );
}

function Card({item,depth,yesOpacity=0,noOpacity=0,photoIdx=0,expanded=false}){
  const scale=1-depth*0.045;const translateY=depth*14;const opacity=depth===0?1:0.95-depth*0.18;
  const photos=(item.photos||[]).filter(Boolean);
  const photo=photos[photoIdx]||"https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=1100&fit=crop";
  const initials=(item.owner||"?").substring(0,2).toUpperCase();
  const avatarBg=item.gold?"linear-gradient(135deg,#f59e0b,#f97316)":"linear-gradient(135deg,#10b981,#0ea5e9)";
  return(
    <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl" style={{transform:`scale(${scale}) translateY(${translateY}px)`,opacity,zIndex:10-depth}}>
      <div className="absolute inset-0 bg-cover bg-center transition-all duration-300" style={{backgroundImage:`url('${photo}')`,backgroundColor:"#111"}}/>
      <div className="absolute top-0 left-0 right-0" style={{height:"28%",background:"linear-gradient(to bottom,rgba(0,0,0,0.58),transparent)"}}/>
      <div className="absolute bottom-0 left-0 right-0" style={{height:"70%",background:"linear-gradient(to top,rgba(0,0,0,0.97) 0%,rgba(0,0,0,0.6) 42%,transparent 100%)"}}/>
      {depth===0&&photos.length>1&&(
        <div className="absolute top-3 left-3 right-3 flex gap-1 z-20">
          {photos.map((_,i)=>(<div key={i} className="flex-1 rounded-full" style={{height:3,background:i===photoIdx?"white":"rgba(255,255,255,0.3)"}}/>))}
        </div>
      )}
      {depth===0&&(
        <>
          <div className="absolute z-20 px-4 py-2 rounded-2xl font-black text-lg" style={{top:54,left:16,opacity:yesOpacity,border:"3px solid #10b981",background:"rgba(16,185,129,0.15)",color:"#10b981",transform:"rotate(-14deg)",backdropFilter:"blur(8px)"}}>✓ ME INTERESA</div>
          <div className="absolute z-20 px-4 py-2 rounded-2xl font-black text-lg" style={{top:54,right:16,opacity:noOpacity,border:"3px solid #ef4444",background:"rgba(239,68,68,0.15)",color:"#ef4444",transform:"rotate(14deg)",backdropFilter:"blur(8px)"}}>✕ PASO</div>
        </>
      )}
      {depth===0&&item.category&&(
        <div className="absolute z-10" style={{top:14,right:14}}>
          <span className="px-3 py-1.5 rounded-full font-bold text-white" style={{fontSize:10,letterSpacing:"0.08em",background:"rgba(0,0,0,0.52)",backdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,0.2)"}}>{(item.category||"").toUpperCase()}</span>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-5 pb-5 text-white">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0" style={{background:avatarBg,boxShadow:"0 2px 12px rgba(0,0,0,0.4)",border:"2px solid rgba(255,255,255,0.3)"}}>{initials}</div>
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <span className="text-sm font-bold truncate drop-shadow">{item.owner}</span>
            {item.verified&&<span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 font-black" style={{background:"linear-gradient(135deg,#10b981,#0ea5e9)",fontSize:8}}>✓</span>}
            {item.gold&&<span className="flex-shrink-0 font-black" style={{color:"#fbbf24",fontSize:13}}>✦</span>}
          </div>
          {(item.neighborhood||item.location)&&<span className="flex items-center gap-0.5 flex-shrink-0" style={{fontSize:11,color:"rgba(255,255,255,0.58)"}}>📍{item.neighborhood||item.location}</span>}
        </div>
        <h3 className="font-black leading-tight mb-2 drop-shadow-lg" style={{fontSize:27}}>{item.title}{item.storage&&<span className="font-light ml-2" style={{fontSize:18,color:"rgba(255,255,255,0.65)"}}>{item.storage}</span>}</h3>
        {expanded&&item.description&&<p className="text-sm mb-3 leading-relaxed" style={{color:"rgba(255,255,255,0.82)"}}>{item.description}</p>}
        {expanded&&item.tags?.length>0&&(
          <div className="flex flex-wrap gap-1.5 mb-3">{item.tags.map(tag=>(<span key={tag} className="px-2.5 py-1 rounded-full text-xs" style={{background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.2)"}}>{tag}</span>))}</div>
        )}
        <div className="rounded-2xl p-3.5 flex items-center gap-3" style={{background:"rgba(255,255,255,0.1)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.18)"}}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:"linear-gradient(135deg,#10b981,#059669)"}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M7 16l-4-4 4-4M17 8l4 4-4 4M3 12h18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                const shareUrl = "https://truekly-match.vercel.app/p/" + item.id;
                if (typeof navigator !== "undefined" && navigator.share) {
                  navigator.share({ title: item.title, text: "Mira este trueque", url: shareUrl });
                } else if (typeof navigator !== "undefined" && navigator.clipboard) {
                  navigator.clipboard.writeText(shareUrl).then(() => alert("Link copiado!"));
                }
              }}
              className="mt-1 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 border border-white/20 text-xs text-white/80 hover:bg-white/25 transition"
            >
              Compartir
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black uppercase tracking-wider mb-0.5" style={{fontSize:9,color:"#34d399"}}>Busca a cambio</p>
            <p className="font-bold text-sm text-white truncate">{item.wants||"Sórprendeme"}</p>
          </div>
        </div>
        {!expanded&&<p className="text-center mt-2.5" style={{fontSize:11,color:"rgba(255,255,255,0.32)"}}>Toca para ver detalles · Desliza para cambiar foto</p>}
      </div>
    </div>
  );
}