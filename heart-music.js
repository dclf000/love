(() => {
const audio=document.getElementById("loveMusic"),button=document.getElementById("musicToggle");
if(!audio||!button)return;
const key="sb_publishable_PoY_xXp55Iz0ho4gg0cIhw_JUdGt7Yh";
const api="https://sflilptubekduvxqpiiw.supabase.co/rest/v1/heart_site_settings?id=eq.1&select=music_url,music_volume";
function isAudioUrl(url){try{const u=new URL(url,location.href);return (u.protocol==="https:"||u.origin===location.origin)&&!/(youtube\.com|youtu\.be)/i.test(u.hostname)}catch{return false}}
audio.addEventListener("play",()=>button.textContent="❚❚ Pause Music");
audio.addEventListener("pause",()=>button.textContent="▶ Play Music");
audio.addEventListener("error",()=>{button.textContent="MP3 unavailable";button.title="Check that Music Settings contains a public direct MP3 URL"});
fetch(api,{headers:{apikey:key}}).then(r=>r.ok?r.json():[]).then(rows=>{
 const settings=rows[0]||{};
 const url=String(settings.music_url||"").trim();
 if(!isAudioUrl(url)){button.hidden=false;button.textContent="♪ Set up MP3";button.title="Enter a direct MP3 URL in Admin → Music Settings";button.onclick=()=>location.assign("admin.html");return}
 audio.src=url;audio.volume=Math.max(0,Math.min(1,Number(settings.music_volume??.35)));
 button.hidden=false;button.textContent="▶ Play Music";
 button.onclick=async()=>{if(!audio.paused){audio.pause();return}try{await audio.play()}catch(e){button.textContent="MP3 unavailable";button.title="The file must be a publicly accessible MP3, not a YouTube page"}};
}).catch(()=>{button.hidden=false;button.textContent="Music settings unavailable"});
})();