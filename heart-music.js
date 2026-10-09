(() => {
const audio=document.getElementById("loveMusic"),button=document.getElementById("musicToggle");
const key="sb_publishable_PoY_xXp55Iz0ho4gg0cIhw_JUdGt7Yh";
const api="https://sflilptubekduvxqpiiw.supabase.co/rest/v1/heart_site_settings?id=eq.1&select=music_url,music_volume";
let player=null,playing=false,kind="none";
function videoId(url){try{const u=new URL(url);const host=u.hostname.toLowerCase().replace(/^www\./,"");let id=null;
if(host==="youtube.com"||host==="m.youtube.com"||host==="music.youtube.com"){id=u.searchParams.get("v");if(!id&&u.pathname.startsWith("/shorts/"))id=u.pathname.split("/")[2];if(!id&&u.pathname.startsWith("/embed/"))id=u.pathname.split("/")[2]}
if(host==="youtu.be")id=u.pathname.slice(1).split("/")[0];
return /^[a-zA-Z0-9_-]{11}$/.test(id||"")?id:null}catch{return null}}
function makePlayer(id,volume){
 const box=document.createElement("div");box.id="youtubeMusicPlayer";
 Object.assign(box.style,{position:"fixed",right:"12px",bottom:"12px",width:"min(340px,92vw)",height:"192px",zIndex:"8",borderRadius:"14px",overflow:"hidden",boxShadow:"0 8px 40px #000a",display:"none",background:"#160c22"});
 const close=document.createElement("button");close.textContent="✕ Close";close.setAttribute("aria-label","Close YouTube music player");
 Object.assign(close.style,{position:"absolute",right:"6px",top:"6px",zIndex:"9",background:"#29183b",color:"white",border:"1px solid #b987ea",borderRadius:"10px",padding:"5px 9px"});
 const frame=document.createElement("iframe");frame.title="YouTube music player";frame.allow="autoplay; encrypted-media; picture-in-picture";frame.referrerPolicy="strict-origin-when-cross-origin";frame.allowFullscreen=true;
 Object.assign(frame.style,{width:"100%",height:"100%",border:"0"});
 const src="https://www.youtube.com/embed/"+encodeURIComponent(id)+"?playsinline=1&enablejsapi=1&origin="+encodeURIComponent(location.origin);
 box.append(frame,close);document.body.append(box);
 function stop(){frame.src="about:blank";box.style.display="none";playing=false;button.textContent="▶ Music"}
 close.onclick=stop;
 button.onclick=()=>{if(playing){stop();return}box.style.display="block";frame.src=src+"&autoplay=1";playing=true;button.textContent="■ Stop music"};
 button.textContent="▶ YouTube Music";button.hidden=false;
}
fetch(api,{headers:{apikey:key}}).then(r=>r.ok?r.json():[]).then(rows=>{
 const settings=rows[0]||{};const url=settings.music_url||"";
 const id=videoId(url);
 if(id){kind="youtube";makePlayer(id,settings.music_volume);return}
 if(!url.startsWith("https://"))return;
 kind="audio";audio.src=url;audio.volume=Math.max(0,Math.min(1,Number(settings.music_volume??.35)));
 button.hidden=false;button.onclick=async()=>{if(audio.paused){try{await audio.play();button.textContent="❚❚ Music"}catch(e){button.textContent="Audio unavailable"}}else{audio.pause();button.textContent="▶ Music"}};
}).catch(()=>{});
})();