(() => {
const audio=document.getElementById("loveMusic"),button=document.getElementById("musicToggle");
if(!audio||!button)return;
const key="sb_publishable_PoY_xXp55Iz0ho4gg0cIhw_JUdGt7Yh";
const api="https://sflilptubekduvxqpiiw.supabase.co/rest/v1/heart_site_settings?id=eq.1&select=music_url,music_volume";
const isAudioUrl=url=>{try{const u=new URL(url,location.href);return (u.protocol==="https:"||u.origin===location.origin)&&!/(youtube\.com|youtu\.be)/i.test(u.hostname)}catch{return false}};
let wanted=false,retries=0,recoveryTimer=null;
audio.loop=true;
audio.preload="auto";
function label(message){button.textContent=message}
function recover(){
 if(!wanted||!audio.paused||retries>=2)return;
 retries++;
 clearTimeout(recoveryTimer);
 recoveryTimer=setTimeout(async()=>{
  if(!wanted||!audio.paused)return;
  try{await audio.play()}catch(e){label("Music interrupted — tap to retry");button.title=e.message||"Audio playback failed"}
 },800);
}
audio.addEventListener("playing",()=>{retries=0;label("❚❚ Pause Music");button.title=""});
audio.addEventListener("pause",()=>{if(wanted)recover();else label("▶ Play Music")});
audio.addEventListener("waiting",()=>{if(wanted)label("♪ Buffering…")});
audio.addEventListener("stalled",()=>{if(wanted)label("♪ Loading music…")});
audio.addEventListener("error",()=>{label("MP3 playback error — retry");button.title="Audio error code: "+(audio.error?.code||"unknown")});
audio.addEventListener("ended",()=>{if(wanted){audio.currentTime=0;recover()}});
fetch(api,{headers:{apikey:key}}).then(r=>r.ok?r.json():[]).then(rows=>{
 const settings=rows[0]||{},url=String(settings.music_url||"").trim();
 if(!isAudioUrl(url)){button.hidden=false;label("♪ Set up MP3");button.onclick=()=>location.assign("admin.html");return}
 audio.src=url;
 audio.volume=Math.max(0,Math.min(1,Number(settings.music_volume??.35)));
 button.hidden=false;label("▶ Play Music");
 button.onclick=async()=>{
  if(wanted&&!audio.paused){wanted=false;clearTimeout(recoveryTimer);audio.pause();return}
  wanted=true;retries=0;clearTimeout(recoveryTimer);
  try{await audio.play()}catch(e){label("MP3 playback error — retry");button.title=e.message||"Playback failed"}
 };
}).catch(()=>{button.hidden=false;label("Music settings unavailable")});
})();