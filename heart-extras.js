/* Public presentation settings; no authentication or personal tracking. */
(() => {
  const url="https://sflilptubekduvxqpiiw.supabase.co/rest/v1/heart_site_settings?id=eq.1&select=messages,anniversary_date,heart_size,particle_speed,heart_color";
  const key="sb_publishable_PoY_xXp55Iz0ho4gg0cIhw_JUdGt7Yh";
  const defaults={messages:["Every heartbeat is for you ❤️","You make my world brighter ✨","Forever LF ❤️ LM"],anniversary_date:null,heart_size:1,particle_speed:1,heart_color:"#c878ff"};
  window.heartOptions={...defaults};
  let current=0;
  const msg=document.getElementById("loveMessage"), counter=document.getElementById("loveCounter");
  function render() {
    const messages=window.heartOptions.messages;
    msg.textContent=Array.isArray(messages)&&messages.length?String(messages[current++%messages.length]):"";
    const date=window.heartOptions.anniversary_date;
    if(!date){counter.textContent="";return;}
    const start=new Date(date+"T00:00:00");
    if(Number.isNaN(start.getTime())) {counter.textContent="";return;}
    const days=Math.floor((Date.now()-start.getTime())/86400000);
    counter.textContent=days>=0?"❤️ Together for "+days.toLocaleString()+" days":"❤️ "+Math.ceil(-days)+" days until our special date";
  }
  render();setInterval(render,6500);
  fetch(url,{headers:{apikey:key}}).then(r=>{if(!r.ok)throw Error("Settings unavailable");return r.json()})
  .then(rows=>{if(rows[0]){window.heartOptions={...defaults,...rows[0]};current=0;render();}})
  .catch(()=>{});
})();
