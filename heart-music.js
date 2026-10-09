(() => {
const audio=document.getElementById("loveMusic"),button=document.getElementById("musicToggle");
const key="sb_publishable_PoY_xXp55Iz0ho4gg0cIhw_JUdGt7Yh";
fetch("https://sflilptubekduvxqpiiw.supabase.co/rest/v1/heart_site_settings?id=eq.1&select=music_url,music_volume",{headers:{apikey:key}})
.then(r=>r.ok?r.json():[]).then(rows=>{const item=rows[0];if(!item?.music_url||!item.music_url.startsWith("https://"))return;
audio.src=item.music_url;audio.volume=Math.min(1,Math.max(0,Number(item.music_volume??.35)));button.hidden=false;
button.onclick=async()=>{if(audio.paused){try{await audio.play();button.textContent="❚❚ Music"}catch(e){button.textContent="Music unavailable"}}else{audio.pause();button.textContent="▶ Music"}}}).catch(()=>{});
})();