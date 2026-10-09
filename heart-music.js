(()=>{
const audio=document.getElementById("loveMusic"),toggle=document.getElementById("musicToggle");
const panel=document.getElementById("miniPlayer"),play=document.getElementById("miniPlay"),close=document.getElementById("miniClose");
const seek=document.getElementById("musicProgress"),volume=document.getElementById("miniVolume");
const elapsed=document.getElementById("musicElapsed"),duration=document.getElementById("musicDuration"),status=document.getElementById("miniStatus");
if(!audio||!toggle||!panel)return;
const key="sb_publishable_PoY_xXp55Iz0ho4gg0cIhw_JUdGt7Yh";
const api="https://sflilptubekduvxqpiiw.supabase.co/rest/v1/heart_site_settings?id=eq.1&select=music_url,music_volume";
const valid=url=>{try{const u=new URL(url,location.href);return u.protocol==="https:"&&!/(youtube\.com|youtu\.be)/i.test(u.hostname)}catch{return false}};
const clock=n=>Number.isFinite(n)?Math.floor(n/60)+":"+String(Math.floor(n%60)).padStart(2,"0"):"0:00";
let ready=false,trying=false;
audio.loop=true;audio.preload="metadata";
function show(open){panel.hidden=!open;toggle.setAttribute("aria-expanded",String(open))}
function update(){
 const playing=!audio.paused;
 play.textContent=playing?"❚❚":"▶";play.setAttribute("aria-label",playing?"Pause music":"Play music");
 toggle.textContent=playing?"♫ Playing":"♫ Music";
 elapsed.textContent=clock(audio.currentTime);duration.textContent=clock(audio.duration);
 if(!seek.matches(":active"))seek.value=Number.isFinite(audio.duration)&&audio.duration>0?Math.round(audio.currentTime/audio.duration*1000):0;
}
async function playPause(){
 if(!ready){show(true);status.textContent="Set an MP3 in Admin → Music Settings.";return}
 if(!audio.paused){audio.pause();return}
 if(trying)return;trying=true;
 try{status.textContent="Loading music…";await audio.play();status.textContent=""}
 catch(e){status.textContent="Playback unavailable. Check your MP3 upload or try again."}
 finally{trying=false;update()}
}
toggle.hidden=false;toggle.onclick=()=>show(panel.hidden);
close.onclick=()=>show(false);
play.onclick=playPause;
seek.addEventListener("input",()=>{if(Number.isFinite(audio.duration)&&audio.duration>0){audio.currentTime=Number(seek.value)/1000*audio.duration;update()}});
volume.addEventListener("input",()=>{audio.volume=Number(volume.value)});
for(const evt of ["play","pause","loadedmetadata","durationchange","timeupdate","ended"])audio.addEventListener(evt,update);
audio.addEventListener("waiting",()=>status.textContent="Buffering…");
audio.addEventListener("playing",()=>{status.textContent="";update()});
audio.addEventListener("error",()=>status.textContent="Unable to play MP3. Check Music Settings.");
fetch(api,{headers:{apikey:key}}).then(r=>{if(!r.ok)throw Error("Settings unavailable");return r.json()}).then(rows=>{
 const s=rows[0]||{},url=String(s.music_url||"").trim();
 if(!valid(url)){status.textContent="Add a direct MP3 URL in Admin → Music Settings.";return}
 audio.src=url;ready=true;audio.volume=Math.max(0,Math.min(1,Number(s.music_volume??.35)));volume.value=audio.volume;
 update();
}).catch(()=>status.textContent="Unable to load music settings.");
})();