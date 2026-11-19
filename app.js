
(function(){
"use strict";
function appIcon(name){
 const skateboard='<svg class="sq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.1 11.5h15.8c1.2 0 1.8.8 1.4 1.8l-.5 1.2c-.2.5-.7.8-1.2.8H4.4c-.5 0-1-.3-1.2-.8l-.5-1.2c-.4-1 .2-1.8 1.4-1.8Z"/><path d="M7 15.4v1.1m10-1.1v1.1"/><circle cx="7" cy="18.5" r="1.6"/><circle cx="17" cy="18.5" r="1.6"/></svg>';
 if(name==="skate"||name==="skating"||name==="tricks")return skateboard;
 if(name==="music")return '<svg class="sq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 17V5l11-2v12"/><path d="M9 8l11-2"/><ellipse cx="5.5" cy="18" rx="3.5" ry="2.5" transform="rotate(-18 5.5 18)"/><ellipse cx="16.5" cy="15" rx="3.5" ry="2.5" transform="rotate(-18 16.5 15)"/></svg>';
 const icons={
  mark:"shield-check",
  fit:"biceps-flexed",
  workouts:"biceps-flexed",
  drums:"drum",
  guitar:"guitar-electric",
  home:"house",
  track:"list-checks",
  tricks:"trophy",
  calendar:"calendar-days",
  compass:"compass",
  milestones:"award",
  target:"target",
  profile:"user-round"
 };
 return '<i class="sq-icon" data-lucide="'+(icons[name]||"circle")+'" aria-hidden="true"></i>';
}
const categories=[
{id:"fitness",name:"Fitness",activities:["workout"]},
{id:"music",name:"Music",activities:["drums","guitar"]},
{id:"skateboarding",name:"Skateboarding",activities:["skate"]}
];
const A=[
{id:"workout",name:"Workouts",category:"fitness",icon:appIcon("workouts")},
{id:"drums",name:"Drums",category:"music",icon:appIcon("drums")},
{id:"guitar",name:"Guitar",category:"music",icon:appIcon("guitar")},
{id:"skate",name:"Skating",category:"skateboarding",icon:appIcon("skating")},
];
const tricks=["Ollie","Fakie Ollie","Nollie","Switch Ollie","Shuvit","Pop Shuvit","Fakie Shuvit","Frontside 180","Backside 180","Fakie 180","Nollie 180","Kickflip","Heelflip","Fakie Kickflip","Fakie Heelflip","Varial Kickflip","Varial Heelflip","Hardflip","Inward Heelflip","Frontside Pop Shuvit","Backside Pop Shuvit","Bigspin","360 Shuvit","Fakie Bigspin","Frontside Bigspin","Backside Bigspin","Tre Flip","Laser Flip","360 Flip","Fakie 360 Flip","Nollie Kickflip","Nollie Heelflip","Switch Kickflip","Switch Heelflip","Frontside Flip","Backside Flip","Half Cab","Half Cab Flip","Half Cab Heelflip","No Comply","Boneless","Manual","Nose Manual","Boardslide","50-50 Grind","5-0 Grind","Smith Grind","Feeble Grind","Crooked Grind","Nosegrind"];
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const monthKey=(y,m)=>y+"-"+String(m+1).padStart(2,"0"),key=(y,m,d)=>y+"-"+String(m+1).padStart(2,"0")+"-"+String(d).padStart(2,"0");
const today=new Date(),todayKey=key(today.getFullYear(),today.getMonth(),today.getDate());
let data={},storageRecoveryNeeded=false;try{const stored=localStorage.getItem("sq27");data=stored?JSON.parse(stored)||{}:{}}catch(e){storageRecoveryNeeded=true;data={};try{const raw=localStorage.getItem("sq27");if(raw&&!localStorage.getItem("sq27_recovery_backup"))localStorage.setItem("sq27_recovery_backup",raw)}catch(_){}}
data.activityDays=data.activityDays||{};data.tricks=data.tricks||{};data.targets=data.targets||{};data.sideQuests=Array.isArray(data.sideQuests)?data.sideQuests:[];delete data.questClaims;delete data.sideQuestClaims;data.startedMonth=data.startedMonth||monthKey(today.getFullYear(),today.getMonth());
data.mainQuestProgress=data.mainQuestProgress||{};data.questLogs=data.questLogs||{};data.questPhotos=data.questPhotos||{};data.strengthLogs=data.strengthLogs||[];data.sleepLogs=data.sleepLogs||{};data.questEvidence=data.questEvidence||[];data.profile=data.profile||{};data.dailyCheckins=data.dailyCheckins||{};data.monthlyCheckins=data.monthlyCheckins||{};
const spotifyPlaylistPrefsKey="sq27_spotify_playlists";
function restoreSpotifyPlaylistPrefs(target=data){
 target.profile=target.profile||{};
 let saved={},raw=null;try{raw=localStorage.getItem(spotifyPlaylistPrefsKey);saved=JSON.parse(raw||"{}")||{}}catch(e){}
 if(raw===null&&target.profile.spotifyPlaylists){saved=target.profile.spotifyPlaylists;try{localStorage.setItem(spotifyPlaylistPrefsKey,JSON.stringify(saved))}catch(e){}}
 target.profile.spotifyPlaylists={...(target.profile.spotifyPlaylists||{}),...saved};
 return target;
}
function persistSpotifyPlaylistPrefs(){
 try{localStorage.setItem(spotifyPlaylistPrefsKey,JSON.stringify(data.profile?.spotifyPlaylists||{}));return true}
 catch(e){toast("Could not save playlist choices on this device");return false}
}
restoreSpotifyPlaylistPrefs();
data.personalTasks=Array.isArray(data.personalTasks)?data.personalTasks:[];data.personalEvents=Array.isArray(data.personalEvents)?data.personalEvents:[];data.personalProjects=Array.isArray(data.personalProjects)?data.personalProjects:[];data.quickNotes=Array.isArray(data.quickNotes)?data.quickNotes:[];data.musicSongs=Array.isArray(data.musicSongs)?data.musicSongs:[];
let page="Overview",categoryId="",activityId="skate",viewYear=today.getFullYear(),showAllMonths=false,trickFilter="All",trickSearch="",questSection="Personal",progressCategory="Overview",checkinType="daily",checkinIndex=0;
const SYNC_URL="https://hdgpiwpvxlssyjzvtisx.supabase.co/functions/v1/sidequest-sync";
const SYNC_KEY="sb_publishable_RTTFMLdOZNKjhkk9Z0-A6w_N40eJOz9";
let syncConfig=null;try{syncConfig=JSON.parse(localStorage.getItem("sq27_sync")||"null")}catch(e){}
let syncReady=false,syncDirty=localStorage.getItem("sq27_sync_dirty")==="1",syncTimer=null,syncBusy=false;
async function syncRequest(action,extra={},config=syncConfig){
 const headers={"Content-Type":"application/json","apikey":SYNC_KEY};if(config?.deviceToken)headers.Authorization="Bearer "+config.deviceToken;
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),12000);
 try{const response=await fetch(SYNC_URL,{method:"POST",headers,body:JSON.stringify({action,vault_id:config?.vaultId||extra.vault_id,...extra}),signal:controller.signal});const result=await response.json().catch(()=>({}));if(!response.ok)throw new Error(result.error||"Sync request failed ("+response.status+")");return result}
 catch(e){if(e.name==="AbortError")throw new Error("Sync timed out");throw e}finally{clearTimeout(timeout)}
}
function normalizeAppData(source){
 if(!source||typeof source!=="object"||Array.isArray(source))throw new Error("Invalid sync data");
 const d={...source};
 ["activityDays","tricks","targets","mainQuestProgress","questLogs","questPhotos","sleepLogs","profile","dailyCheckins","monthlyCheckins"].forEach(k=>{if(!d[k]||typeof d[k]!=="object"||Array.isArray(d[k]))d[k]={}});
 ["sideQuests","strengthLogs","questEvidence","personalTasks","personalEvents","personalProjects","quickNotes","musicSongs"].forEach(k=>{if(!Array.isArray(d[k]))d[k]=[]});
 d.startedMonth=typeof d.startedMonth==="string"?d.startedMonth:monthKey(today.getFullYear(),today.getMonth());return d;
}
function mergeProgress(cloud,local){
 const merged={...(cloud||{}),...(local||{})};
 merged.collegeAssignmentStatus={...(cloud?.collegeAssignmentStatus||{}),...(local?.collegeAssignmentStatus||{})};
 merged.activityDays={...(cloud?.activityDays||{})};for(const [id,days] of Object.entries(local?.activityDays||{}))merged.activityDays[id]={...(merged.activityDays[id]||{}),...days};
 merged.tricks={...(cloud?.tricks||{}),...(local?.tricks||{})};const rank={"Not learnt":0,"Learning":1,"Learnt":2,"Learnt (flat)":2,"Rolling":3,"Learnt (rolling)":3};
 for(const [trick,value] of Object.entries(merged.tricks)){const a=cloud?.tricks?.[trick],b=local?.tricks?.[trick];if(a&&b)merged.tricks[trick]=(rank[b]??0)>=(rank[a]??0)?b:a}
 merged.targets={...(cloud?.targets||{})};for(const [id,target] of Object.entries(local?.targets||{}))merged.targets[id]={...(merged.targets[id]||{}),...target,months:{...(merged.targets[id]?.months||{}),...(target?.months||{})}};
 merged.sideQuests=[...(cloud?.sideQuests||[])];for(const quest of (local?.sideQuests||[])){const index=merged.sideQuests.findIndex(item=>item.id===quest.id);if(index<0)merged.sideQuests.push(quest);else merged.sideQuests[index]=quest}
 merged.startedMonth=local?.startedMonth||cloud?.startedMonth||merged.startedMonth;
 merged.mainQuestProgress={...(cloud?.mainQuestProgress||{}),...(local?.mainQuestProgress||{})};
 merged.questPhotos={...(cloud?.questPhotos||{})};for(const [id,items] of Object.entries(local?.questPhotos||{})){const combined=[...(merged.questPhotos[id]||[])];for(const item of items){if(!combined.some(x=>x.date===item.date&&x.src===item.src))combined.push(item)}merged.questPhotos[id]=combined}
 merged.sleepLogs={...(cloud?.sleepLogs||{}),...(local?.sleepLogs||{})};
 const mergeRecords=(a,b)=>{const out=[...(a||[])];for(const item of (b||[])){if(!out.some(x=>JSON.stringify(x)===JSON.stringify(item)))out.push(item)}return out};
 merged.strengthLogs=mergeRecords(cloud?.strengthLogs,local?.strengthLogs);merged.questEvidence=mergeRecords(cloud?.questEvidence,local?.questEvidence);
 return normalizeAppData(merged);
}
async function syncPush(){
 if(!syncConfig||!syncReady||syncBusy||!navigator.onLine)return false;syncBusy=true;const snapshot=JSON.stringify(data);
 try{await syncRequest("save",{data:JSON.parse(snapshot)});if(JSON.stringify(data)===snapshot){syncDirty=false;try{localStorage.removeItem("sq27_sync_dirty")}catch(_){}}else{syncDirty=true;try{localStorage.setItem("sq27_sync_dirty","1")}catch(_){}}return true}
 catch(e){syncDirty=true;try{localStorage.setItem("sq27_sync_dirty","1")}catch(_){}return false}finally{syncBusy=false}
}
function scheduleSync(){
 if(!syncConfig||!syncReady)return;syncDirty=true;try{localStorage.setItem("sq27_sync_dirty","1")}catch(_){}
 clearTimeout(syncTimer);syncTimer=setTimeout(()=>{syncPush().catch(()=>{})},1200);
}
async function syncPull(){
 if(!syncConfig||syncBusy||!navigator.onLine)return false;syncBusy=true;
 const previousData=data,previousRaw=(()=>{try{return localStorage.getItem("sq27")}catch(_){return null}})();
 try{
  const result=await syncRequest("load"),remote=normalizeAppData(result.data),next=restoreSpotifyPlaylistPrefs(syncDirty?mergeProgress(remote,previousData):remote);
  localStorage.setItem("sq27",JSON.stringify(next));data=next;render();
  if(syncDirty){syncBusy=false;await syncPush();return true}return true;
 }catch(e){data=previousData;if(previousRaw!==null){try{localStorage.setItem("sq27",previousRaw)}catch(_){}}try{render()}catch(_){}toast("Sync unavailable — your device data is safe. You can keep using the app.");return false}
 finally{syncBusy=false}
}
function save(){
 try{if(storageRecoveryNeeded){const raw=localStorage.getItem("sq27");if(raw&&!localStorage.getItem("sq27_recovery_backup"))localStorage.setItem("sq27_recovery_backup",raw);storageRecoveryNeeded=false}
 localStorage.setItem("sq27",JSON.stringify(data));scheduleSync();return true}
 catch(e){toast("Couldn’t save — device storage may be full. Your changes are only on this screen.");return false}
}
function showSyncModal(content){
 const root=$("modalRoot");
 root.innerHTML='<div class="modal-backdrop"><section class="modal sync-modal" role="dialog" aria-modal="true" aria-labelledby="syncTitle"><button class="modal-close" data-close-modal aria-label="Close">×</button>'+content+'</section></div>';
}
function syncDeviceName(){return /Android/i.test(navigator.userAgent)?"Android device":"PC"}
function showPairCode(code,heading){
 showSyncModal('<div class="sync-mark">↔</div><h2 id="syncTitle">'+heading+'</h2><p>On your other device, open Side Quest, tap the sync icon and choose <strong>Join an existing space</strong>. Enter this one-time code.</p><div class="pair-code" id="pairCode">'+code+'</div><div class="pair-expiry">This code expires in 10 minutes and can only be used once.</div><div class="sync-actions"><button class="sync-primary" id="copyPairCode">Copy code</button><button id="syncDone">Done</button></div>');
 $("copyPairCode").addEventListener("click",async()=>{
  try{await navigator.clipboard.writeText(code);toast("Pairing code copied")}
  catch(e){const el=$("pairCode"),range=document.createRange();range.selectNodeContents(el);const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);toast("Select and copy the code")}
 });
 $("syncDone").addEventListener("click",()=>$("modalRoot").innerHTML="");
}
async function createSharedSpace(){
 const vaultId=crypto.randomUUID();
 const result=await syncRequest("create",{vault_id:vaultId,data,device_name:syncDeviceName()},null);
 syncConfig={vaultId:result.vault_id,deviceToken:result.device_token};
 localStorage.setItem("sq27_sync",JSON.stringify(syncConfig));
 syncReady=true;syncDirty=false;localStorage.removeItem("sq27_sync_dirty");
 const pairResult=await syncRequest("pair");
 showPairCode(pairResult.code,"Your shared space is ready");
 toast("Cloud sync enabled");
}
async function joinSharedSpace(){
 const input=$("pairCodeInput"),code=(input?.value||"").replace(/\\s/g,"").toUpperCase();
 if(!/^[A-Z0-9]{8}$/.test(code)){toast("Enter the 8-character code");input?.focus();return}
 const joinButton=$("joinSpace");
 joinButton.disabled=true;joinButton.textContent="Pairing…";
 try{
  const result=await syncRequest("redeem",{code,device_name:syncDeviceName()},null);
  const localData=data;
  data=mergeProgress(result.data,localData);
  syncConfig={vaultId:result.vault_id,deviceToken:result.device_token};
  localStorage.setItem("sq27_sync",JSON.stringify(syncConfig));
  syncReady=true;syncDirty=true;localStorage.setItem("sq27_sync_dirty","1");
  localStorage.setItem("sq27",JSON.stringify(data));
  await syncPush();render();$("modalRoot").innerHTML="";toast("Device paired and synced");
 }catch(e){
  joinButton.disabled=false;joinButton.textContent="Join shared space";
  const error=$("pairError");if(error)error.textContent=e.message||"Check the code and try again";
 }
}
function escapeHtml(value){
 return String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}
async function showDeviceManager(){
 showSyncModal('<div class="sync-mark">✓</div><h2 id="syncTitle">Connected devices</h2><p>These devices are authorised to sync with this shared space. The date shows when each was linked.</p><div class="device-list" id="deviceList"><div class="device-loading">Loading devices…</div></div><div class="sync-actions device-actions"><button class="sync-primary" id="addDevice">Add another device</button><button id="syncNow">Sync now</button></div>');
 try{
  const result=await syncRequest("devices");
  const devices=result.devices||[];
  const list=$("deviceList");
  if(!list)return;
  list.innerHTML=devices.length?devices.map(d=>{
   const date=d.created_at?new Date(d.created_at).toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"}):"Date unavailable";
   return '<div class="device-row"><div class="device-info"><strong>'+escapeHtml(d.name)+'</strong><small>'+(d.current?"This device · ":"")+ 'Linked '+escapeHtml(date)+'</small></div><button class="device-disconnect" data-revoke-device="'+escapeHtml(d.id)+'" data-current="'+(d.current?"1":"0")+'">'+(d.current?"Disconnect":"Remove")+'</button></div>';
  }).join(""):'<div class="device-loading">No linked devices found.</div>';
  list.querySelectorAll("[data-revoke-device]").forEach(button=>button.addEventListener("click",async()=>{
   const current=button.dataset.current==="1";
   const message=current?"Disconnect this device from cloud sync? Your local progress will stay on this device.":"Remove this device's access to the shared space?";
   if(!window.confirm(message))return;
   button.disabled=true;button.textContent="Removing…";
   try{
    const result=await syncRequest("revoke",{device_id:button.dataset.revokeDevice});
    if(result.revoked_current){
     localStorage.removeItem("sq27_sync");localStorage.removeItem("sq27_sync_dirty");
     syncConfig=null;syncReady=false;syncDirty=false;clearTimeout(syncTimer);
     $("modalRoot").innerHTML="";toast("This device is disconnected");return;
    }
    toast("Device disconnected");await showDeviceManager();
   }catch(e){button.disabled=false;button.textContent=current?"Disconnect":"Remove";toast(e.message||"Couldn't disconnect device")}
  }));
  $("addDevice").addEventListener("click",async()=>{
   const button=$("addDevice");button.disabled=true;button.textContent="Creating code…";
   try{const pairResult=await syncRequest("pair");showPairCode(pairResult.code,"Pair another device")}
   catch(e){button.disabled=false;button.textContent="Add another device";toast("Couldn't create a pairing code: "+e.message)}
  });
  $("syncNow").addEventListener("click",async()=>{
   await syncPull();await showDeviceManager();toast("Sync checked");
  });
 }catch(e){
  const list=$("deviceList");if(list)list.innerHTML='<div class="device-loading device-error">Could not load devices. '+escapeHtml(e.message||"Try again.")+'</div>';
 }
}
async function handleSync(){
 if(syncBusy){toast("Sync is already running");return}
 if(!navigator.onLine){toast("Connect to the internet to manage sync");return}
 if(syncConfig){await showDeviceManager();return}
 showSyncModal('<div class="sync-mark">↔</div><h2 id="syncTitle">Sync your devices</h2><p>Connect your PC and Android so your progress stays up to date on both.</p><div class="sync-actions"><button class="sync-primary" id="joinSpaceStart">Join an existing space</button><button id="createSpace">Create a new shared space</button></div><p class="sync-help">Already set up Side Quest on your other device? Choose join and enter its pairing code.</p>');
 $("joinSpaceStart").addEventListener("click",()=>{
  showSyncModal('<div class="sync-mark">↔</div><h2 id="syncTitle">Enter pairing code</h2><p>On your other device, open the sync menu and choose Add another device. Enter the 8-character code shown there.</p><input class="sync-code-input" id="pairCodeInput" type="text" maxlength="8" autocomplete="one-time-code" autocapitalize="characters" spellcheck="false" placeholder="8-CHARACTER CODE"><div class="sync-error" id="pairError" role="status"></div><div class="sync-actions"><button class="sync-primary" id="joinSpace">Join shared space</button><button data-close-modal>Cancel</button></div>');
  const input=$("pairCodeInput");input.addEventListener("input",()=>{input.value=input.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,8)});input.focus();
  $("joinSpace").addEventListener("click",joinSharedSpace);
 });
 $("createSpace").addEventListener("click",async()=>{
  const button=$("createSpace");button.disabled=true;button.textContent="Creating…";
  try{await createSharedSpace()}
  catch(e){button.disabled=false;button.textContent="Create a new shared space";toast("Couldn't create shared space: "+e.message)}
 });
}

function getStatus(id,k){return Number(data.activityDays[id]?.[k]||0)}
function sessionCount(id,y,m){const prefix=monthKey(y,m)+"-";return Object.entries(data.activityDays[id]||{}).filter(([k,v])=>k.startsWith(prefix)&&v===1).length}
function totalSessions(id){return Object.values(data.activityDays[id]||{}).filter(v=>v===1).length}
function targetFor(id,y,m){
 const wanted=monthKey(y,m),base=Number(data.targets[id]?.base||8),overrides=data.targets[id]?.months||{},start=data.startedMonth;
 if(wanted<start)return Number(overrides[wanted]||base);
 let [sy,sm]=start.split("-").map(Number);sm--;
 let value=base,guard=0;
 while((sy<y||(sy===y&&sm<=m))&&guard++<180){
  const key=monthKey(sy,sm);
  if(overrides[key])value=Math.max(1,Number(overrides[key]));
  if(sy===y&&sm===m)return value;
  const count=sessionCount(id,sy,sm);
  if(count>=value)value++;
  else value=Math.max(1,value-1);
  sm++;if(sm>11){sm=0;sy++;}
 }
 return value;
}
function countWeek(id,start,end){return Object.entries(data.activityDays[id]||{}).filter(([k,v])=>v===1&&k>=start&&k<=end).length}
function monday(d){let x=new Date(d.getFullYear(),d.getMonth(),d.getDate());x.setDate(x.getDate()-(x.getDay()+6)%7);return x}
function dateKey(d){return key(d.getFullYear(),d.getMonth(),d.getDate())}
function weeklySummary(){
 const start=monday(today),end=new Date(start);end.setDate(end.getDate()+6);
 const prevStart=new Date(start);prevStart.setDate(prevStart.getDate()-7);
 const prevEnd=new Date(start);prevEnd.setDate(prevEnd.getDate()-1);
 let thisWeek=0,lastWeek=0,monthlyDone=0,monthlyTarget=0;
 A.forEach(a=>{
  thisWeek+=countWeek(a.id,dateKey(start),dateKey(end));
  lastWeek+=countWeek(a.id,dateKey(prevStart),dateKey(prevEnd));
  monthlyDone+=sessionCount(a.id,today.getFullYear(),today.getMonth());
  monthlyTarget+=targetFor(a.id,today.getFullYear(),today.getMonth());
 });
 const delta=thisWeek-lastWeek;
 const comparison=delta>0?"More":delta<0?"Fewer":"Same number of";
 const range=start.toLocaleDateString(undefined,{day:"numeric",month:"short"})+" – "+end.toLocaleDateString(undefined,{day:"numeric",month:"short"});
 return '<section class="section"><div class="section-head"><h2>This week</h2><small>'+range+'</small></div>'+
 '<div class="week-summary">'+
 '<div class="metric"><div class="metric-label">Sessions this week</div><div class="metric-value">'+thisWeek+'</div><div class="metric-note">Across all activities</div></div>'+
 '<div class="metric"><div class="metric-label">Monthly targets</div><div class="metric-value">'+monthlyDone+' / '+monthlyTarget+'</div><div class="metric-note">Sessions logged this month</div></div>'+
 '<div class="metric"><div class="metric-label">Vs previous week</div><div class="metric-value">'+(delta>0?"+":"")+delta+'</div><div class="metric-note">'+comparison+' sessions</div></div>'+
 '</div></section>';
}
function activityCard(a,interactive=true){
 const target=targetFor(a.id,today.getFullYear(),today.getMonth()),month=sessionCount(a.id,today.getFullYear(),today.getMonth());
 const inner='<span class="activity-icon">'+a.icon+'</span><span class="activity-copy"><span class="activity-name">'+a.name+'</span></span><span class="activity-meta">'+month+'/'+target+'</span>';
 return interactive?'<button class="activity-row" data-category="'+a.category+'" data-open-activity="'+a.id+'">'+inner+'</button>':'<div class="activity-row" data-category="'+a.category+'">'+inner+'</div>';
}
function categorySummary(c){
 const list=c.activities.map(id=>A.find(a=>a.id===id)),sum=list.reduce((n,a)=>n+sessionCount(a.id,today.getFullYear(),today.getMonth()),0),target=list.reduce((n,a)=>n+targetFor(a.id,today.getFullYear(),today.getMonth()),0);
 return '<div class="category-block cat-'+c.id+'"><div class="category-top"><span class="category-title">'+c.name+'</span><span class="category-meta">'+sum+'/'+target+'</span></div><div class="activity-list">'+list.map(a=>activityCard(a,false)).join("")+'</div></div>';
}

const DS26_B64="H4sIAHgH+2oC/8VdWXfbOJb+Kzh+cKfOkSsS5f1NlmRH1dpKiz01Pf1ASZCFDkWqudjRv597AW6STfFeJj3zUDlGUsEHgPe7O5B//OPspd4QF6LnrqJlqDxXvEj5/ax21pp3eiPRHT71ht1Jb/gkmuLbaD6Zwh9Zdev6on53Ub/JDRqNs1qjdjaT/lbAj2vbCeQ/a4XTD+bTXlv0hp35dDb5S1jimxf5wS+dfDwZdebtWW80hLVvfuH05mhm3fa34ag/eup1p7D+XwkwGvbh1MXTvDudiX63PZtPumLQms66k3a/Nf3VcNO/9/r9qXgcTcR03m53p7/qI4+7k+lo2OqLTve52x+NB93hjD+1BVNPw2ilPEAIfU9MZRAACk1IG5f5we1ZzSoGkcvQ8wPhrcU2CtRSbygI/T1FXhk4ehfJUYWe6HuvADaGnZ2LTutFvHj+97XjvdMkmbNBc4q7sHFvFlFLfqvtbXeeK90woMo3A/bRl9Kx3aXEPcK+pS/qjWpizkB9kc7S20o84Ol35TiB+CrmgXJfxdB+U692KMtE/yc+6bgD39L8v7jpf4FklfOBiNcEvO6PneP5uJmBWvrebgMfLxC2uxJTL4Jf2xvbt5eh9FUQqmVAo4rVyA+uzmrNQvzZRoq+epNiwCYKA2XQ6/SAlf+OpLvEvZ6L7kqF8BONGQyklBnWfe5ExWy/kyg3wU4ug68ilMuNq2A5ZJYwltD2HMdeeL6tZehdhRsFogTnnDvcCoxhrOAR/qqYRI7e3klmMCY9ZsbUXsvXyPZX5oOOffkGaqecHByxOZDJ+4wM4uLPyHbUWi3NIcOh26CbfPHl0fO38Hsg0B1prxzlyt8ADqXYCBecbe9piEuiHkPoR/GSLj85hYH6gfvvyOB7TFv16toO6oolWjct4hTK3iaDRv2ibp3VLj89FVzCJ3QVf3iLgMRZOkxLE2lgu2oXOeaY1x6IldzqLROZS8dLmdu8PzhVMkMZW+tpgfXWxv/QnwvkSi3lPdg4bwvaKYolK/R+lraMExi0JjMxs/1XGZYzlz4v2BgwW3o/2id6kBswnLBOAlm58tJ1X4FzEi3aPUgfmO34u1Zl5okFZMy8QmVhZObBBmIE2gkMRbTTnOz+SSAhzn+VH9yd1a4+3S2iTeTSM6qPbDJ5AM/KD0HHwfQwebRFjw6E1jgFwAvQMgQG8iBTBl7efzhN43DlDvIUG3mwD5Fy9EnaOQfT6LcH+BX8oaAC9XhrQE8dl4DWWozAWPunCcibfe6uYMIQRBExWp1vnRLm8aY3ZzVO7dK9mIE6+y5aoNn2gQoqca9kCRn3rou82FpGkpqmoZ/jTCLUWiv9TqNnw8oPrs9q158eyXVKT9G3FxLihS/azQUPJQBE0QuCSO+/lK4MQP0NgK6PSNBY1TLNJQ8wJevV/YEyyrSFQlfldyphGdApYdu+NFI1tv3QBRHfqJ3xgmL6+vBzRfIy1gMx7zZyE18wdrbTtcX6WclSRnOOwEGCfYOgzAPva+C54aac0sT5bw4JFTmhigmdfedZGsBQuXOXG1jNs9pNIXYbdoPukPmSMZNAbzgBiTN0oFxAmO0HjNxksw8325xCI5KHjgxe/IETj2d8Yc44NnwzXoTIg++rtURHzD5Q3dKvyBQ68JN6M9EafFVpfn6UcrWAjZeSg45yaO7gWKOtTWAHDeA2c/VQ64jZu2dUwM433rzx+NZrcHkp6ZJGQ7uV2QB4eVuI3PJD4DxGRfar3Jp4t4QSzPlBZZqZ4SulOmwi1dYGx5poSFiQicB7HlhKnVGkenksmEnkusbJy9vmKhLP2x1+KcT9C3Mi6OadFnTW5DPPkT66q2XSTZ71DmXZUaCHtDYCH+opUisZj0AkRm/SX0WLBS2xgFh3uUEDaHVXCHyUU8j7TF86vr0OD7zHcrE/gZy5j3eZCJ6j2fN8zAvGvpMj7UASJZ6xz0OJt+5F569ha9BrT8lyTwfLRTdxjsoGw5ol0M9F54+KLKAvInPUfG/hyC3Ekc6bEaHTXKBDxPk/HTRGjrM3s5exgjR/o44me7tzjF5sxRWknINAVPToc6UDq35Wa9QL8ToKncZFdOB/nJB2ztw6KEhyThA0TKPFVhnjhRoq2Hi7opiNwISTK0mJpxdyxITmfSYpxxa0hBGc7Rs9M4120n9TcQGwgvxzIA+SfRMZKEdJo7dPyj8HAnxK6bs6BgGMgXT/FoiOvS8nARUEK7MdCO5ycXQiLTTxR6cqG9wAUKMQSCv/aOEoiOkAyFRUKTzggHwotmUjLSM0eecgfhZBGaenM5kPxKTbHk06cHpUsedg5yyBYYCxBzUxBpu39hyFZeMxeM5agHTsXI0YvE8QW/t8kriMFhyAjtx6S9B0BCJQp8U67RN8uFC8eVp9ktsIYN5mPR1YF/VLALEKQVoB5lm10QFtha4JhQEcBF2uD5QW+ZxEovdTjQwc8AIygD/0PGrDV2KzgQMOpgcW8Kbke7UeAi5cEgfkXaF/xRbupLCzPqdjBwFsawdivzCNCSUyT50dy6GtpRdhF4CwTRSa2YH32A6QkkFWrl8HBrpfp1kIeioomEbbQhelkCAl8JmDkjQO1MDjC72tye7xSyC87RZwAjyj3hC2M8fPxyUGbwV4wkndA5NEx9n9KlzhrSCOU8Z2uHm39yUEYUqT59uOCkuNAX1WLD22N9ges4XAauytljZQ4+vHcmSRR03gS9bPg4NbWMtnVUi9lCQlDB/OiJJcHanvE8Q4iXO0Z5MpSkLlZ3AbYGuOrGQ2eMhmuj/nvf+mij9n9olcO3IZc30ow/e4MvcVvuUKj1X/vT4cs3STJOC+ognhrgytVZpLgoN+9U1t8iQ9WEer3NU6cuKSZwlDqBPnSrsjH8KeMOaD7lYxvw+iau8SP6rciNxc1BvaWGUDhE/Kg9YH+Bwrsu6VEkawQbIskgldq3lRbFiwhjvbT4ho56xycOSXFrOEDfpZJ6bFpgB/rwfRyekEEl9IpO2EG4hE7DDJBkp/qYLTXhQLBkt3j5HjiAUKP/73quOInCcl5XfkD4UBjUZ+cAWo14WoaNVzLIiNehpgU7jAgYvbK9MaAvyYmQj8KQ7zCFzgwB4H9LERTns9STzgAE69pdLZlpWy9fcEOmy9Sm4SGztnnM6PE0ymYU7Xw8sowtpuiBbnsPxUQg3q9DdpUJ25wNj9L6zfk6JDQLQMjdvcwAKYxk0hJH5ACQb8HJOgoh05YeRL8UWHGejIkZo12KjHVuE/kYstX1TmOd7kKNtKLLL5CAGZNpxT37tLOHKzdzRbj8rZfp09f32ytzKoSB0GfpoKM55Ukv8qpQoDQvd4PtrfJfD0PSDwhDj3bcqTh6w9IiVLM/VDaFSxrvKDO0C9LUSNJVVhMk20EmtCoQYH5UODcyojWsnSxJ61LeO2ZZ4oU+45WCbdhjlXk0WIy/nnMekq92GwF3JgLg76l8o4wJMY3UI6kXjtgWArqHNjva+1ekP/cyUgEPOlJ7bZZYuQ0ZwEUBDrN/IDtFF3hbj5ANvGj/bge7YO+kluFA8MzBDq/aV48RN/yjS3gJBKChV4cGNw6WtIiKR1Ut9+Qoc0/kMaJ3igj54j9xnvqsg+D7D9HAD/Nt47xjBBvs0FWaFO31pho/WfHmZ/9vLq8iQJyJNbdVMgkIGuD7yQ4wZLByjpAJsCrXohwoeY4VmtpPdpVhbdJWafRvlyUh9Fryafe0XziqJDpAFjzyjpRh51kSBJtoo/YE7Ql2QSMCA/6/qrQgMG5B/eQkyl7S83peLOmHXuLiHuWCovCsSDsgOCvBNnb8Tynom7dX+gNgiSb1n5wTVgNQqxjiLmTuvlbwFFnDkY3/YLX63EdGl6bQ8+P0GoOVC/SKg5kPkSm1VNoDlwqTbSwmHSYgSXhgcyDe29dhfttRQjF5VcuYhTAazjXVCkupm3GE1tMSzr0+mbHy1GeteNiHSbG2iuNk8h8YrXfIS0BHEuRqDHIChKP3gpe3hQh+wZ9P6LTR0eXsdzFhBkhVuvkiXggR0SJyuAnOYNFyPfnfTibUn9SSyYy4/ifckT78ZVfgDxh3VZiFToAfGL0uXYmRd0mToL+OSC3KL/2pEOwPn2wqEZDt5Gf4Xosw7WxoiuYiTAgzq4ddfGlrwwKBN6zvxJReEgHyu+TLyt7UJU91u57FPRrj7K/tV9PpeYBHfmS+ogr0hUCUTJGbSmMWhXnwkrrqod+T6uaQa/rsyVnsdIJ1l72529JBmFk3BHp3CUL/oPZVZZR3DIoO5zqz9v6VmZLOIcQ8UytlWNdJyVxX1Por2Ry+8XSrfUpP7BSepxUAqo92hvlbP/+oh16FVAICAV8zp5GMGEqPksJoVSl+nlPDNAoKRO0vwANNOPeYTyNX7jAz4nZhLXShej8E8cR71ig7GpZCSEI9YyeIuJu6k/vUun6/oUPvEg+73nrpiO5sOOGOsLQ/+O1C4uRxGYxAP7rNTdrEITHmyrp3VlR72qEJWXfnnoNEN4APg+i26IsN/LaECf+MYU6UH9blEU+qBPDdEP3xTSv4E6WlMGCxm0VO1lektPD7Bh17opXMhEBXqHve0WK86AZBtqSm0T8JLBj530dSd+QKIFA7y12+lLKKf4QWQGA/WAGda9TvJMPEdfazWlafOyAI0lHGB9nG/64vdP9Aqycecuur6B0iVcOHP0NRR8TlD3lAZCNt4U3H1bufZClbYRsua+Tc5Qd4Yk6cCNxOzTedp5G9BIYl3nBtjha90WgqJ96L55TpRYEiOvA8+VoQpswvUjNuQAc+whVmpyLtmXj3r2Nxo/TkJnntjtMT2a95jNeZXaP9OvrC03YrJfSf/32H1A18ReY3uAQtNJJg7nMHJOw+PoW75htBp5ONjzdmuav/MBxxHq/GopZVgoh6+PgKAF23LiUBHukjN8yIhDYcnVRb2ZH9wAwl0hwpPjLeCAEOJJur68eHQilTwz0Uf7BY6O/CwpEPte/MJIyQIzwb7Tt1zepOPtUnuDPUk2htHxorNrdfphB3KWjHdKZvvavnmO97rHtzBib0AT+1y0R8PZZNTvdydTGpmYC8hlnCv5aDy4Z1CbSTvracbw5o3jITpdyNM3sUbTxcjQ91ztluAjVcY50/eACbxp1PODy7Nas14IhQxI3LD4CUIl47YHCgU4WGMvuS2ISI8qfgaP+oYHGy93jEbw8So1irxWR/iKifyBNwGw6cORocyr+nG/NaQSgLMmY9Cy/jz9YeMukwfP+17RrPAWkT21kHs/6yQ5OLMP8NUmJ7HQrXcbXL6yfnUWSCO3BZQkbBWonCsDpJvcAB96bDY+0eLNRsWSSQnA0b4+CWYPQFN3jJ9VZu00R4XzgkXBNzXJzOM7xmV0YRxH7qlUWE/LWUTb2H5UZAkLO3nmqNKLUWy8+IEEbLtUARhnd0+gDHF+K1+bn8ggWui7Vjsx39FIYl3mB7cAZBUCnXCyKtVeStAzwU12+VEwCeTg7PAnpJ8DMx6MzWNF47/nU8Td+B3dCvLPQZ/ZP8oFnDMhtuOB4xsHrfr+RujLLZq+Z0XowaWjZa8sC3yW0pGJstybLJcNBp/1PAIAXqc3DvUA2+abzUL0lhOXU1HUWy+iBVo6pETqTJienl2/z0ERc+bs/Yf5wGRw43ZDcFyiNejESHc3EgSeCXg+yTtEcdC0rSjuPOy+8b7Eo+eDy7IS/xNZ9UZTDJOSuLn0GoBH7r+pky+DsKHb0pEL39zCGftqVdqxQp/+MmPCNGFCeqiMpsTr9DahGSD3LgsRTbe0jvfxYfcgy62CKWVQgYOJPEiITaMCa0cxFax79AuWchcab4TKAtZOci8L6af49CtXeLfHDuXrvhoVOAvQGXgdpFOqGty5V+pNrbDtvK8W0i/P0dLn1xdZP0q5vrJn0aTcauQH+ND7VTFUYkZ4Qs2ByN1DmmF99CL9J0PwEqtaYmlkT5N2Dmwi7c1U8bc9zOKDNOYudpIEnwNrHMeOHdo18zYxZtTjyxe6WNpzIRTahEE1CjAPXhfBEzc1MQd9lCvjNZ+kxEmszGPVDRgmLWh6XDb4umM5I6hbuf6g/s3VJIzR9XNNFEpk7V03+pnC5nUhVlwXYRKCA5A0H+k8TvLP6RAZwMCZPbTBz7adKH6qGXsgIHTR9wNocs/ZFMq9sgFm7lYsyvEAE4fDlFbc0uwob/bs+WfPXYM3U/b+JQvg5kNWIBZsRvdQqdDfpE+bm8EdLOfmM/7+itWU8OP/YS0nWPR/uhoC0VjrOchM1vDfjXIW0rQnH5aNUbnkn2CrZHBKlnYs0wklTzOx2qTxTdoyFtInv42zE7EvHNBIlWtSudFNKs1b6uylJPnpuU8K/U/MThJizvwfegKb1aSTg/kYuXgBd70uk07WpLoCpGNQmL9cOAlz//N/ASyVVZ3ncgAA";
let ds26Tasks=[],ds26Ready=false;
async function loadDS26(){
 const bytes=Uint8Array.from(atob(DS26_B64),c=>c.charCodeAt(0));
 let jsonText="";
 if(typeof DecompressionStream!=="undefined"){
  try{
   const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
   jsonText=await new Response(stream).text();
  }catch(err){console.warn("Native schedule decompression failed; using fallback",err)}
 }
 if(!jsonText||jsonText[0]!=="["){
  if(!window.pako){
   await new Promise((resolve,reject)=>{const script=document.createElement("script");script.src="https://cdn.jsdelivr.net/npm/pako@2.1.0/dist/pako.min.js";script.onload=resolve;script.onerror=reject;document.head.appendChild(script)});
  }
  if(!window.pako)throw new Error("Schedule decompression is unavailable");
  jsonText=new TextDecoder().decode(window.pako.ungzip(bytes));
 }
 const parsed=JSON.parse(jsonText);
 if(!Array.isArray(parsed)||parsed.length!==263)throw new Error("DS26 schedule data is incomplete");
 ds26Tasks=parsed;ds26Ready=true;
}
window.setCollegeTab=function(tab){window.collegeTab=["schedule","calendar"].includes(tab)?tab:"schedule";try{render()}catch(err){console.error("College tab render failed",err);toast("Could not open that College section. Try again.")}};
function collegeDashboard(){
 if(!ds26Ready)return '<div class="college-shell"><div class="page-head"><div class="eyebrow">CONFETTI · DS26 · 2026–2027</div><h1>College</h1><p>Preparing your 263 curriculum checkpoints…</p></div><div class="college-loading"><span class="college-spinner"></span><strong>Loading your planner</strong><small>Your saved completion records are safe.</small></div></div>';
 const p=data.collegeProgress||(data.collegeProgress={});
 const assignments=ds26Tasks.filter(t=>!!t[6]);
 const lessons=ds26Tasks.filter(t=>!t[6]&&!String(t[1]).toUpperCase().includes("ONLINE GUEST"));
 const glmTasks=ds26Tasks.filter(t=>String(t[1]).toUpperCase().includes("ONLINE GUEST"));
 const submitted=t=>p[t[1]+"|"+t[0]]==="submitted"||p[t[1]+"|"+t[0]]==="done";
 const done=assignments.filter(submitted).length;
 const modules=[...new Set(assignments.map(t=>t[1]))];
 const upcoming=assignments.filter(t=>t[3]>=todayKey).sort((a,b)=>a[3].localeCompare(b[3]));
 const upcomingAssessments=upcoming;
 const nextTask=upcoming[0]||null;
 const activeWeek=nextTask?nextTask[4]:null;
 const weekTasks=activeWeek===null?[]:assignments.filter(t=>t[4]===activeWeek).sort((a,b)=>a[3].localeCompare(b[3]));
 const validCollegeTabs=["schedule","calendar"];const tab=validCollegeTabs.includes(window.collegeTab)?window.collegeTab:"schedule";
 const taskTitle=t=>{const raw=String(t&&t[0]!=null?t[0]:"Untitled assignment");const parts=raw.split(" - ");return parts.length>1?parts.slice(1).join(" - "):raw};
 const dueLabel=iso=>{if(!iso)return "No due date";const due=new Date(iso+"T00:00:00");if(Number.isNaN(due.getTime()))return iso;const now=new Date();now.setHours(0,0,0,0);const days=Math.round((due-now)/86400000);return days===0?"Due today":days>0?"Due in "+days+" day"+(days===1?"":"s"):"Overdue by "+Math.abs(days)+" day"+(days===-1?"":"s")};
 const orderedAssignments=assignments.filter(t=>Array.isArray(t)).slice().sort((a,b)=>Number(submitted(a))-Number(submitted(b))||String(a[3]||"9999-12-31").localeCompare(String(b[3]||"9999-12-31"))||String(a[1]||"").localeCompare(String(b[1]||""))||taskTitle(a).localeCompare(taskTitle(b)));
 const taskCard=t=>{const isDone=submitted(t),key=String(t[1]||"")+"|"+String(t[0]||""),assigned=(data.collegeAssignmentStatus||{})[key]==="assigned";return '<article class="college-task assignment-task '+(isDone?"handed-in":"not-handed-in")+(assigned?" assignment-assigned":" assignment-unassigned")+(isDone?" completed-assignment":"")+'"><div class="college-task-copy"><strong>'+escapeHtml(taskTitle(t))+'</strong><small>'+escapeHtml(t[1]||"")+(t[4]!=null?' · Week '+escapeHtml(t[4]):"")+(t[5]?' · '+escapeHtml(t[5]):"")+'</small><small>'+escapeHtml(t[2]||"")+(t[3]?' · '+escapeHtml(dueLabel(t[3])):"")+'</small><button type="button" data-college-set="'+escapeHtml(key)+'" class="assignment-set-tag '+(assigned?"is-assigned":"is-unassigned")+'">'+(assigned?"Assigned":"Unassigned")+'</button></div><div class="assignment-actions"><button type="button" data-college-done="'+escapeHtml(key)+'" class="college-done '+(isDone?"active":"overdue-status")+'">'+(isDone?"✓ Handed in":"Mark complete")+'</button></div></article>'};
 const moduleCards=modules.map(m=>{const list=assignments.filter(t=>t[1]===m),n=list.filter(submitted).length;return '<button type="button" class="college-module" data-college-module="'+escapeHtml(m)+'"><span class="college-module-head"><strong>'+escapeHtml(m)+'</strong><b>'+n+'/'+list.length+'</b></span><span class="college-bar"><i style="width:'+(list.length?n/list.length*100:0)+'%"></i></span><small>'+Math.round(list.length?n/list.length*100:0)+'% handed in · '+list.length+' assignments</small></button>'}).join("");
 const datePlus=(iso,days)=>{const d=new Date(iso+"T12:00:00");d.setDate(d.getDate()+days);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
 const glmRows=glmTasks.slice().sort((a,b)=>a[2].localeCompare(b[2])).map(t=>{const day=datePlus(t[2],3);return '<article class="college-task glm-task"><div class="college-task-copy"><strong>'+escapeHtml(t[0].split(" - ").slice(1).join(" - "))+'</strong><small>Thursday · '+new Date(day+"T12:00:00").toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})+' · Week '+t[4]+'</small><small>'+escapeHtml(t[5])+' · GLM</small></div><span class="college-event-tag glm-tag">GLM</span></article>'}).join("");
 const monthBase=window.ds26CalendarMonth?new Date(window.ds26CalendarMonth+"-01T12:00:00"):new Date(new Date().getFullYear(),new Date().getMonth(),1,12);
 const monthKey=monthBase.getFullYear()+"-"+String(monthBase.getMonth()+1).padStart(2,"0");
 const monthTitle=monthBase.toLocaleDateString("en-GB",{month:"long",year:"numeric"});
 const monthDays=new Date(monthBase.getFullYear(),monthBase.getMonth()+1,0).getDate();
 const firstOffset=(new Date(monthBase.getFullYear(),monthBase.getMonth(),1).getDay()+6)%7;
 const weeklyLessons=[
  {day:1,title:"Music Production",lecturer:"Dan Woodward",location:"C007",time:"9:00 AM – 12:00 PM",start:"09:00"},
  {day:1,title:"Music Industry",lecturer:"Chris Goss",location:"C110",time:"1:00 PM – 3:00 PM",start:"13:00"},
  {day:1,title:"Audio Technologies",lecturer:"Chris Goss",location:"C110",time:"3:00 PM – 5:00 PM",start:"15:00"},
  {day:2,title:"Skills for Success",lecturer:"Lee Gilyon",location:"C107",time:"9:00 AM – 10:00 AM",start:"09:00"},
  {day:2,title:"Personal Development",lecturer:"Kevin Thomson",location:"C205",time:"10:00 AM – 11:00 AM",start:"10:00"},
  {day:2,title:"Audio Engineering",lecturer:"Kevin Thomson",location:"FE Studios",time:"12:00 PM – 3:00 PM",start:"12:00"}
 ];
 const calendarEvents=[];
 for(let day=1;day<=monthDays;day++){
  const d=new Date(monthBase.getFullYear(),monthBase.getMonth(),day,12),iso=monthKey+"-"+String(day).padStart(2,"0"),weekday=d.getDay();
  if(iso>="2026-09-01"&&iso<="2027-07-31"){
   weeklyLessons.filter(x=>x.day===weekday).forEach(x=>calendarEvents.push({date:iso,title:x.title,kind:"lesson",time:x.time,start:x.start,lecturer:x.lecturer,location:x.location}));
  }
 }
 ds26Tasks.forEach(t=>{
  if(t[6])calendarEvents.push({date:t[3],title:t[0].split(" - ").slice(1).join(" - "),kind:"assignment",meta:t[1],done:submitted(t),time:"Due date",start:"23:59"});
  else if(String(t[1]).toUpperCase().includes("ONLINE GUEST"))calendarEvents.push({date:datePlus(t[2],3),title:t[0].split(" - ").slice(1).join(" - "),kind:"glm",meta:"Thursday · Week "+t[4],time:"Scheduled GLM",start:"12:00"});
 });

 const eventMarkup=calendarEvents.filter(e=>e.date.startsWith(monthKey));
 const calendarMode=window.ds26CalendarMode||"week";
 const activeDate=window.ds26CalendarSelected||todayKey;
 const weekStart=new Date(activeDate+"T12:00:00");weekStart.setDate(weekStart.getDate()-((weekStart.getDay()+6)%7));
 const weekDates=Array.from({length:7},(_,i)=>{const d=new Date(weekStart);d.setDate(d.getDate()+i);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")});
 const weekTitle=weekStart.toLocaleDateString("en-GB",{day:"numeric",month:"short"})+" – "+new Date(weekDates[6]+"T12:00:00").toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});
 const calendarDays=calendarMode==="week"?weekDates:Array.from({length:monthDays},(_,i)=>monthKey+"-"+String(i+1).padStart(2,"0"));
 const calendarHeading=calendarMode==="week"?weekTitle:monthTitle;
 const selectedDate=window.ds26CalendarSelected|| (monthKey===todayKey.slice(0,7)?todayKey:monthKey+"-01");
 const selectedEvents=calendarEvents.filter(e=>e.date===selectedDate).sort((a,b)=>(a.start||"").localeCompare(b.start||""));
 const cells=[];
 if(calendarMode==="month")for(let i=0;i<firstOffset;i++)cells.push('<div class="college-calendar-empty"></div>');
 calendarDays.forEach(iso=>{const d=new Date(iso+"T12:00:00"),events=calendarEvents.filter(e=>e.date===iso),dots=events.map(e=>'<i class="calendar-dot '+e.kind+'"></i>').join("");
  cells.push('<button type="button" data-college-date="'+iso+'" class="college-calendar-day '+(iso===todayKey?"is-today":"")+' '+(iso===selectedDate?"is-selected":"")+'"><span class="college-calendar-date">'+(calendarMode==="week"?d.toLocaleDateString("en-GB",{weekday:"short"})+" "+d.getDate():d.getDate())+'</span><span class="college-calendar-dots">'+dots+'</span></button>');
 });
 const selectedDateLabel=new Date(selectedDate+"T12:00:00").toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"});
 const selectedDayRows=selectedEvents.map(e=>'<article class="college-day-event '+e.kind+(e.kind==="assignment"&&!e.done?" not-handed-in":"")+'"><div class="college-day-event-top"><strong>'+escapeHtml(e.title)+'</strong><span class="college-event-tag '+(e.kind==="glm"?"glm-tag":e.kind==="assignment"?(e.done?"handed-in-tag":"assignment-tag"):"lesson-tag")+'">'+(e.kind==="glm"?"GLM":e.kind==="assignment"?"Assignment":"Lesson")+'</span></div><p>'+escapeHtml(e.time||"")+'</p>'+(e.kind==="lesson"?'<small>'+escapeHtml(e.lecturer)+' · '+escapeHtml(e.location)+'</small>':e.kind==="assignment"?'<small>'+escapeHtml(e.meta||"")+' · '+(e.done?"Handed in":"Not handed in")+'</small>':'<small>'+escapeHtml(e.meta||"")+'</small>')+'</article>').join("");
 const tabs=[["schedule","Assignments"],["calendar","Calendar"]];
 let body="";
 if(tab==="calendar"){
  body='<section class="college-section-intro"><span class="eyebrow">WEEKLY TIMETABLE + DEADLINES</span><h2>College calendar</h2><p>Tap a date to see its lessons, GLMs and assignment deadlines.</p></section><div class="college-calendar-toolbar"><button type="button" data-college-period="-1" aria-label="Previous period">‹</button><strong>'+calendarHeading+'</strong><button type="button" data-college-period="1" aria-label="Next period">›</button><div class="college-calendar-toggle"><button type="button" data-calendar-mode="week" class="'+(calendarMode==="week"?"active":"")+'">Week</button><button type="button" data-calendar-mode="month" class="'+(calendarMode==="month"?"active":"")+'">Month</button></div></div><div class="college-calendar-grid"><div class="college-calendar-weekday">Mon</div><div class="college-calendar-weekday">Tue</div><div class="college-calendar-weekday">Wed</div><div class="college-calendar-weekday">Thu</div><div class="college-calendar-weekday">Fri</div><div class="college-calendar-weekday">Sat</div><div class="college-calendar-weekday">Sun</div>'+cells.join("")+'</div><div class="college-calendar-legend"><span><i class="lesson-dot"></i>Lessons</span><span><i class="glm-dot"></i>GLM</span><span><i class="assignment-dot"></i>Assignments</span></div><section class="college-selected-day"><div class="college-selected-day-head"><div><span class="eyebrow">SELECTED DAY</span><h3>'+selectedDateLabel+'</h3></div></div><div class="college-day-event-list">'+(selectedDayRows||'<p class="college-empty">No classes or deadlines scheduled for this day.</p>')+'</div></section>';
 }else{
  body='<section class="college-section-intro"><span class="eyebrow">COURSEWORK</span><h2>Assignments</h2><p>'+assignments.length+' assignments · '+done+' handed in · '+(assignments.length-done)+' remaining</p></section><div class="college-list college-list-v2">'+(orderedAssignments.length?orderedAssignments.map(taskCard).join(""):'<p class="college-empty">No assignments available.</p>')+'</div>';
 }
 return '<div class="college-shell"><div class="page-head"><div class="eyebrow">CONFETTI · DS26 · 2026–2027</div><h1>College</h1></div><nav class="college-tabs" aria-label="College sections">'+tabs.map(([id,label])=>'<button type="button" data-college-view="'+id+'" onclick="window.setCollegeTab(\''+id+'\')" class="'+(tab===id?"active":"")+'">'+label+'</button>').join("")+'</nav>'+body+'</div>';
}
function dashboard(){return collegeDashboard();

 const tasks=data.personalTasks||[],events=(data.personalEvents||[]).filter(x=>x.date>=todayKey).sort((a,b)=>(a.date||"").localeCompare(b.date||"")||(a.time||"").localeCompare(b.time||"")),projects=data.personalProjects||[],notes=(data.quickNotes||[]).slice().reverse();
 const open=tasks.filter(t=>!t.done).sort((a,b)=>(a.due||"9999").localeCompare(b.due||"9999")||(a.priority==="high"?-1:1)),done=tasks.filter(t=>t.done).length;
 const priorities=open.filter(t=>t.priority==="high").slice(0,3),todayTasks=open.filter(t=>t.due===todayKey).slice(0,4);
 const taskRows=open.slice(0,6).map(t=>'<div class="personal-list-row"><label class="personal-check"><input type="checkbox" data-task-done="'+t.id+'"><span></span></label><div class="personal-row-copy"><strong>'+escapeHtml(t.title)+'</strong><small>'+(t.due?'Due '+escapeHtml(t.due):'No due date')+'</small></div><span class="personal-priority '+(t.priority||'normal')+'">'+(t.priority==="high"?"High":t.priority==="low"?"Low":"Normal")+'</span><button class="personal-delete" data-task-delete="'+t.id+'" aria-label="Delete task">×</button></div>').join("");
 const eventRows=events.slice(0,4).map(x=>'<div class="personal-list-row"><span class="personal-date-chip">'+escapeHtml(new Date(x.date+"T12:00:00").toLocaleDateString(undefined,{day:"numeric",month:"short"}))+'</span><div class="personal-row-copy"><strong>'+escapeHtml(x.title)+'</strong><small>'+escapeHtml(x.time||"All day")+'</small></div><button class="personal-delete" data-event-delete="'+x.id+'" aria-label="Delete event">×</button></div>').join("");
 const projectRows=projects.map(x=>'<div class="personal-project"><div class="personal-project-top"><strong>'+escapeHtml(x.title)+'</strong><button class="personal-delete" data-project-delete="'+x.id+'" aria-label="Delete project">×</button></div><p>'+(x.next?escapeHtml(x.next):'No next step added')+'</p></div>').join("");
 const noteRows=notes.slice(0,4).map(x=>'<article class="personal-note"><p>'+escapeHtml(x.text)+'</p><small>'+escapeHtml(x.date||"Saved note")+'</small><button class="personal-delete" data-note-delete="'+x.id+'" aria-label="Delete note">×</button></article>').join("");
 return '<div class="personal-dashboard"><div class="page-head"><h1>Home</h1><p>'+today.toLocaleDateString(undefined,{weekday:"long",day:"numeric",month:"long"})+'</p></div>'+
 '<section class="personal-welcome"><div><span class="eyebrow">YOUR DAY</span><h2>'+ (priorities.length?'Your priorities':'Make today count')+'</h2><p>'+(priorities.length?'Your high-priority tasks, all in one place.':'Pick a few things worth focusing on today.')+'</p></div><div class="personal-day-stats"><strong>'+open.length+'</strong><small>tasks left</small><strong>'+done+'</strong><small>completed</small></div></section>'+
 '<div class="personal-dashboard-grid">'+
 '<section class="personal-panel personal-priority-panel"><div class="section-head"><h2>Top priorities</h2><small>High priority tasks</small></div>'+(priorities.length?priorities.map((t,n)=>'<div class="personal-priority-row"><span>'+(n+1)+'</span><strong>'+escapeHtml(t.title)+'</strong><button data-task-done="'+t.id+'" aria-label="Complete task">✓</button></div>').join(""):'<p class="personal-empty">Mark tasks as High priority and they’ll appear here.</p>')+'</section>'+
 '<section class="personal-panel"><div class="section-head"><h2>Today</h2><small>'+todayTasks.length+' due today</small></div>'+(todayTasks.length?todayTasks.map(t=>'<div class="personal-mini-row"><strong>'+escapeHtml(t.title)+'</strong><button data-task-done="'+t.id+'">Done</button></div>').join(""):'<p class="personal-empty">Nothing due today. Add a task or enjoy the breathing room.</p>')+'</section>'+
 '<section class="personal-panel personal-wide"><div class="section-head"><h2>Tasks</h2><small>'+open.length+' remaining · '+done+' completed</small></div>'+
 '<form class="personal-add-form" data-personal-task-form><input name="title" maxlength="100" placeholder="What needs doing?" required><input name="due" type="date" aria-label="Due date"><select name="priority" aria-label="Priority"><option value="normal">Normal</option><option value="high">High</option><option value="low">Low</option></select><button type="submit">Add task</button></form>'+
 (taskRows||'<p class="personal-empty">No tasks yet. Add something you need to get done.</p>')+'</section>'+
 '<section class="personal-panel"><div class="section-head"><h2>Upcoming</h2><small>Events and deadlines</small></div><form class="personal-add-form personal-stacked" data-personal-event-form><input name="title" maxlength="90" placeholder="Add an event or deadline" required><div class="personal-form-line"><input name="date" type="date" min="'+todayKey+'" required><input name="time" type="time" aria-label="Time"></div><button type="submit">Add event</button></form>'+(eventRows||'<p class="personal-empty">No upcoming events.</p>')+'</section>'+
 '<section class="personal-panel"><div class="section-head"><h2>Projects</h2><small>Things you’re working on</small></div><form class="personal-add-form personal-stacked" data-personal-project-form><input name="title" maxlength="70" placeholder="Project name" required><input name="next" maxlength="110" placeholder="Next step (optional)"><button type="submit">Add project</button></form>'+(projectRows||'<p class="personal-empty">Add a project to keep its next step visible.</p>')+'</section>'+
 '<section class="personal-panel personal-wide"><div class="section-head"><h2>Quick notes</h2><small>Ideas and things to remember</small></div><form class="personal-add-form personal-note-form" data-personal-note-form><textarea name="text" maxlength="600" rows="2" placeholder="Write something down before you forget…" required></textarea><button type="submit">Save note</button></form><div class="personal-notes-grid">'+(noteRows||'<p class="personal-empty">Your saved notes will appear here.</p>')+'</div></section>'+
 '</div></div>';
}
function categoriesPage(){
 return '<div class="page-head"><div class="eyebrow">YOUR TRACKING</div><h1>Categories</h1><p>Choose an area to view its activities.</p></div>'+categories.map(c=>{
 const list=c.activities.map(id=>A.find(a=>a.id===id)),n=list.reduce((s,a)=>s+sessionCount(a.id,today.getFullYear(),today.getMonth()),0),t=list.reduce((s,a)=>s+targetFor(a.id,today.getFullYear(),today.getMonth()),0);
 return '<button class="category-link" data-open-category="'+c.id+'"><span><strong>'+c.name+'</strong><small>'+list.map(a=>a.name).join(" · ")+' · '+n+' / '+t+' sessions this month</small></span><span class="arrow">›</span></button>';
 }).join("");
}
function categoryPage(){
 const c=categories.find(x=>x.id===categoryId);if(!c)return categoriesPage();
 if(c.activities.length===1){activityId=c.activities[0];page="Activity";return activityPage()}
 const list=c.activities.map(id=>A.find(a=>a.id===id));
 return '<div class="page-head category-page-head cat-'+c.id+'"><div class="eyebrow">YOUR ACTIVITIES</div><h1>'+c.name+'</h1><p>'+list.length+' activities</p></div><div class="activity-list">'+list.map(activityCard).join("")+'</div>';
}
function monthCard(y,m){
 const first=(new Date(y,m,1).getDay()+6)%7,days=new Date(y,m+1,0).getDate(),parts=[];
 const monthDone=A.reduce((n,a)=>n+sessionCount(a.id,y,m),0);
 for(let i=0;i<first;i++)parts.push('<span class="date-empty"></span>');
 for(let d=1;d<=days;d++){
  const k=key(y,m,d),future=k>todayKey;
  const icons=A.filter(a=>getStatus(a.id,k)===1).map(a=>'<span class="calendar-activity-icon icon-'+a.category+'" title="'+a.name+'">'+a.icon+'</span>').join("");
  const completed=A.filter(a=>getStatus(a.id,k)===1).map(a=>a.name).join(", ");
  parts.push('<button class="date-cell '+(completed?"has-activity":"")+' '+(k===todayKey?"today":"")+'" data-date="'+k+'" '+(future?"disabled":"")+' aria-label="'+k+(completed?" completed: "+completed:" no activities logged")+'"><span class="date-number">'+d+'</span><span class="calendar-activity-icons">'+icons+'</span></button>');
 }
 return '<section class="month-card"><div class="month-heading"><strong>'+new Date(y,m,1).toLocaleDateString(undefined,{month:"short"})+'</strong><small>'+monthDone+' sessions</small></div><div class="weekdays"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div><div class="month-days">'+parts.join("")+'</div></section>';
}
function calendarPage(){
 const displayMonth=viewYear===today.getFullYear()?today.getMonth():0;
 const months=showAllMonths?Array.from({length:12},(_,m)=>monthCard(viewYear,m)).join(""):monthCard(viewYear,displayMonth);
 return '<div class="calendar-screen '+(showAllMonths?"all-months":"current-month-view")+'"><div class="page-head"><h1>Calendar</h1></div><div class="year-nav"><button data-year="-1" aria-label="Previous year" '+(viewYear<=2026?"disabled":"")+'>‹</button><strong>'+viewYear+'</strong><button data-year="1" aria-label="Next year" '+(viewYear>=today.getFullYear()?"disabled":"") +'>›</button><button class="quiet-btn" data-toggle-months>'+(showAllMonths?"Current month":"View all")+'</button></div><div class="months-grid '+(showAllMonths?"all-months":"current-month")+'">'+months+'</div>';
}
function openModal(date){
 const rows=A.map(a=>{
  const done=getStatus(a.id,date)===1;
  return '<button type="button" class="calendar-log-row '+(done?"is-done":"")+'" data-calendar-log="'+a.id+'" data-date="'+date+'" aria-pressed="'+done+'"><span class="calendar-log-icon">'+a.icon+'</span><span class="calendar-log-name">'+a.name+'</span><strong>'+(done?"Completed":"Not logged")+'</strong></button>';
 }).join("");
 $("modalRoot").innerHTML='<div class="modal-backdrop"><section class="modal calendar-modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><button class="modal-close" data-close-modal aria-label="Close">×</button><h2 id="modalTitle">'+new Date(date+"T12:00:00").toLocaleDateString(undefined,{weekday:"long",day:"numeric",month:"long",year:"numeric"})+'</h2><p>Tap an activity to mark it completed or clear it.</p><div class="calendar-log-list">'+rows+'</div></section></div>';
 if(window.lucide?.createIcons)window.lucide.createIcons();
 if(page==="MusicLibrary"&&spotifyTokens())spotifyLoadMusicPlaylist(musicActiveTab);

}
function targetsPage(){
 return '<div class="page-head"><div class="eyebrow">MONTHLY GOALS</div><h1>Targets</h1><p>Set how many sessions you want to complete each month.</p></div><div class="target-list">'+A.map(a=>{const target=targetFor(a.id,today.getFullYear(),today.getMonth()),done=sessionCount(a.id,today.getFullYear(),today.getMonth()),pct=Math.min(100,Math.round(done/target*100));return '<section class="target-card" data-category="'+a.category+'"><div class="target-card-top"><span class="activity-icon">'+a.icon+'</span><span><strong>'+a.name+'</strong><small>'+done+' of '+target+' sessions this month</small></span></div><div class="target-edit"><label for="target-'+a.id+'">Monthly target</label><input id="target-'+a.id+'" type="number" min="1" max="100" step="1" value="'+target+'" data-target-input="'+a.id+'"><button data-save-target="'+a.id+'">Save</button></div><div class="target-progress"><span style="width:'+pct+'%"></span></div></section>'}).join("")+'</div>';
}
function logPage(){
 const dateLabel=today.toLocaleDateString(undefined,{weekday:"long",day:"numeric",month:"long"});
 return '<div class="page-head"><div class="eyebrow">DAILY CHECK-IN</div><h1>Log</h1><p>'+dateLabel+'</p></div><div class="log-list">'+A.map(a=>{
  const status=getStatus(a.id,todayKey);
  const tone=a.category==="fitness"?"fitness":a.category==="music"?"music":"skate";
  return '<section class="log-row"><div class="log-activity"><span class="activity-icon" style="color:var(--'+tone+')">'+a.icon+'</span><span><strong>'+a.name+'</strong><small>'+(status===1?"Completed":"Not logged")+'</small></span></div><div class="log-actions"><button data-log-activity="'+a.id+'" data-log-value="1" class="'+(status===1?"active":"")+'" aria-pressed="'+(status===1)+'">Done</button><button data-log-activity="'+a.id+'" data-log-value="0" class="'+(status===0?"active":"")+'" aria-pressed="'+(status===0)+'">Clear</button></div></section>';
 }).join("")+'</div>';
}
const dailyQuestions=[{id:"skate",title:"Did you skate today?",kind:"yesno"},{id:"exercise",title:"Did you exercise today?",kind:"yesno"},{id:"music",title:"Did you practise music today?",kind:"yesno"},{id:"skincare",title:"Did you follow your skincare routine?",kind:"yesno"},{id:"bed-before-midnight",title:"Did you go to bed before 12?",kind:"yesno"},{id:"bedtime",title:"What time did you go to bed?",kind:"time",showWhen:a=>a["bed-before-midnight"]==="no"},{id:"wake-time",title:"What time did you wake up?",kind:"time"}];
const monthlyQuestions=[{id:"skincare-photo",title:"Add monthly skincare progress photo",category:"Skincare",kind:"media",limit:1,accept:"image/*"},{id:"strength-photos",title:"Add muscle and strength progress photos",category:"Muscle & Strength",kind:"media",limit:5,accept:"image/*"},{id:"flexibility-media",title:"Add flexibility and mobility progress photo or video",category:"Flexibility & Mobility",kind:"media",limit:1,accept:"image/*,video/*"},{id:"posture-photo",title:"Add monthly posture progress photo",category:"Posture",kind:"media",limit:1,accept:"image/*"}];
function activeDayKey(){const d=new Date();if(d.getHours()<5)d.setDate(d.getDate()-1);return key(d.getFullYear(),d.getMonth(),d.getDate())}
function checkinStore(type){const k=type==="daily"?activeDayKey():monthKey(today.getFullYear(),today.getMonth()),name=type==="daily"?"dailyCheckins":"monthlyCheckins";if(!data[name]||typeof data[name]!=="object"||Array.isArray(data[name]))data[name]={};const store=data[name];if(!store[k]||typeof store[k]!=="object"||Array.isArray(store[k]))store[k]={answers:{},skipped:[]};const record=store[k];if(!record.answers||typeof record.answers!=="object"||Array.isArray(record.answers))record.answers={};if(!Array.isArray(record.skipped))record.skipped=[];return {key:k,record}}
function questionsFor(type,record){return (type==="daily"?dailyQuestions:monthlyQuestions).filter(q=>!q.showWhen||q.showWhen(record.answers||{}))}
function isAnswered(q,record){const a=record.answers?.[q.id];return q.kind==="media"?!!a?.media?.length:a!==undefined&&a!==null&&a!==""}
function checkinStats(type){const {record}=checkinStore(type),questions=questionsFor(type,record),missing=questions.filter(q=>!isAnswered(q,record));return {record,questions,missing,complete:!missing.length,total:questions.length}}
function checkinButton(type){const x=checkinStats(type);return x.complete?(x.total?"Edit":"Start"):(Object.keys(x.record.answers||{}).length||x.record.skipped?.length?"Continue":"Start")}
function mediaQuestionMarkup(q,record){const media=record.answers?.[q.id]?.media||[],previews=media.map((m,i)=>m.type?.startsWith("video/")?'<div class="checkin-media-item">Video '+(i+1)+' <button type="button" data-remove-media="'+q.id+'" data-media-index="'+i+'">Remove</button></div>':'<div class="checkin-media-item"><img src="'+m.src+'" alt="Progress record"><button type="button" data-remove-media="'+q.id+'" data-media-index="'+i+'">Remove</button></div>').join("");return '<div class="checkin-media-list">'+previews+'</div><div class="checkin-media-actions"><label class="checkin-icon-action"><i data-lucide="camera"></i><span>Camera</span><input hidden type="file" accept="'+q.accept+'" capture="environment" data-checkin-media="'+q.id+'"></label><label class="checkin-icon-action"><i data-lucide="images"></i><span>Gallery</span><input hidden type="file" accept="'+q.accept+'" '+(q.limit>1?'multiple':'')+' data-checkin-media="'+q.id+'"></label></div><small class="checkin-media-count">'+media.length+' / '+q.limit+' added</small>'}
function checkinQuestionMarkup(type,q,record){const answer=record.answers?.[q.id]??"",unanswered=!isAnswered(q,record);let input="";if(q.kind==="yesno")input='<div class="checkin-choice"><button type="button" data-checkin-answer="yes" data-question="'+q.id+'" class="'+(answer==="yes"?"selected":"")+'">Yes</button><button type="button" data-checkin-answer="no" data-question="'+q.id+'" class="'+(answer==="no"?"selected":"")+'">No</button></div>';else if(q.kind==="time")input='<label class="checkin-time-label">Time<input type="time" step="1800" value="'+escapeHtml(answer)+'" data-checkin-time="'+q.id+'"></label>';else input=mediaQuestionMarkup(q,record);return '<section class="checkin-question '+(unanswered?"unanswered":"")+'"><div class="checkin-progress-label">QUESTION '+(checkinIndex+1)+' OF '+questionsFor(type,record).length+'</div><h2>'+q.title+'</h2>'+input+'</section>'}
function checkinWizard(type){const {record,questions,missing}=checkinStats(type);checkinType=type;if(!questions.length)return '<p class="muted">No questions available.</p>';checkinIndex=Math.max(0,Math.min(checkinIndex,questions.length-1));const q=questions[checkinIndex];return '<div class="page-head"><button class="profile-back" data-checkin-exit>← Back to Track</button><div class="eyebrow">'+(type==="daily"?"DAILY CHECK-IN":"MONTHLY CHECK-IN")+'</div><h1>'+(type==="daily"?"Today’s progress":"Monthly progress")+'</h1><p>'+missing.length+' question'+(missing.length===1?"":"s")+' unanswered</p></div><div class="checkin-step-track"><span style="width:'+((checkinIndex+1)/questions.length*100)+'%"></span></div>'+checkinQuestionMarkup(type,q,record)+'<div class="checkin-nav">'+(checkinIndex>0?'<button type="button" data-checkin-back>Back</button>':'<span></span>')+'<button type="button" class="checkin-next" data-checkin-next>'+(checkinIndex===questions.length-1?"Finish":"Next")+'</button></div><button type="button" class="checkin-later" data-checkin-later>Answer later</button>'}
function trackPage(){const daily=checkinStats("daily"),monthly=checkinStats("monthly");if(window.checkinWizardOpen)return checkinWizard(checkinType);const dailyStatus=daily.missing.length?daily.missing.length+" unanswered":"All questions completed",monthlyItems=monthlyQuestions.map(q=>{const done=isAnswered(q,monthly.record);return '<div class="monthly-question-status"><span class="'+(done?"status-done":"status-missing")+'">'+(done?"✓":"!")+'</span><span>'+q.title+'</span><small>'+(done?"Complete":"Incomplete")+'</small></div>'}).join("");return '<div class="page-head"><h1>Track</h1></div><section class="checkin-card"><div class="checkin-card-head"><div><h2>Daily check-in</h2><p>'+dailyStatus+'</p></div><span class="checkin-count">'+(daily.total-daily.missing.length)+' / '+daily.total+'</span></div><button type="button" class="checkin-start" data-checkin-start="daily">'+checkinButton("daily")+'</button></section><section class="checkin-card monthly-checkin-card"><div class="checkin-card-head"><div><h2>Monthly check-in</h2><p>'+new Date(today.getFullYear(),today.getMonth(),1).toLocaleDateString(undefined,{month:"long",year:"numeric"})+'</p></div><span class="checkin-count">'+(monthly.total-monthly.missing.length)+' / '+monthly.total+'</span></div><div class="monthly-question-list">'+monthlyItems+'</div><button type="button" class="checkin-start" data-checkin-start="monthly">'+checkinButton("monthly")+'</button></section>'}
function tricksPage(){
  const statusOf=t=>{const v=data.tricks[t]||"Not learnt";return v==="Rolling"?"Learnt (rolling)":v==="Learnt"?"Learnt (flat)":v};
  const learnt=tricks.filter(t=>statusOf(t).startsWith("Learnt (")).length,flat=tricks.filter(t=>statusOf(t)==="Learnt (flat)").length,rolling=tricks.filter(t=>statusOf(t)==="Learnt (rolling)").length,learning=tricks.filter(t=>statusOf(t)==="Learning").length,remaining=tricks.length-learnt-learning,pct=Math.round(learnt/tricks.length*100);
  const order={"Not learnt":0,"Learning":1,"Learnt (flat)":2,"Learnt (rolling)":3};
  const visible=tricks.map((t,i)=>({t,i,status:statusOf(t)})).filter(x=>(trickFilter==="All"||(trickFilter==="To learn"&&x.status==="Not learnt")||(trickFilter==="Learning"&&x.status==="Learning")||(trickFilter==="Learnt"&&x.status.startsWith("Learnt (")))&&x.t.toLowerCase().includes(trickSearch.toLowerCase())).sort((a,b)=>order[a.status]-order[b.status]||a.t.localeCompare(b.t));
  const filters=["All","To learn","Learning","Learnt"].map(v=>'<button class="trick-filter '+(trickFilter===v?"active":"")+'" data-trick-filter="'+v+'">'+v+' <span>'+(v==="All"?tricks.length:v==="To learn"?remaining:v==="Learning"?learning:learnt)+'</span></button>').join("");
  return '<div class="page-head category-page-head cat-skateboarding"><h1>My Tricks</h1></div>'+
  '<section class="trick-overview"><div class="trick-overview-top"><div><div class="trick-kicker">TOTAL PROGRESS</div><div class="trick-progress-number">'+learnt+' <span>/ '+tricks.length+' learnt</span></div></div><div class="trick-progress-pct">'+pct+'%</div></div><div class="trick-progress-track"><span style="width:'+pct+'%"></span></div><div class="trick-overview-foot"><span>'+flat+' landed flat</span><span>'+rolling+' landed rolling</span></div></section>'+
  '<div class="trick-stats"><div class="trick-stat stat-learnt"><strong>'+learnt+'</strong><small>Learnt</small></div><div class="trick-stat stat-learning"><strong>'+learning+'</strong><small>Learning</small></div><div class="trick-stat stat-todo"><strong>'+remaining+'</strong><small>To learn</small></div></div>'+
  '<section class="section trick-library"><div class="section-head"><h2>Your tricks</h2><small>'+visible.length+' of '+tricks.length+'</small></div><div class="trick-tools"><div class="trick-filters">'+filters+'</div><input class="trick-search" type="search" placeholder="Find a trick..." value="'+esc(trickSearch)+'" aria-label="Find a trick" data-trick-search></div>'+
  '<div class="trick-list">'+(visible.length?visible.map(x=>'<article class="trick-card '+(x.status==="Learnt (rolling)"?"is-rolling":x.status==="Learnt (flat)"?"is-learnt":x.status==="Learning"?"is-learning":"")+'"><div class="trick-card-top"><span class="trick-state">'+(x.status==="Learnt (rolling)"?"Rolling":x.status==="Learnt (flat)"?"Learnt":x.status==="Learning"?"Learning":"Not learnt")+'</span></div><strong>'+esc(x.t)+'</strong><label class="trick-select-label" for="trick-'+x.i+'">Landing status</label><select id="trick-'+x.i+'" data-trick="'+esc(x.t)+'"><option '+(x.status==="Not learnt"?"selected":"")+'>Not learnt</option><option '+(x.status==="Learning"?"selected":"")+'>Learning</option><option '+(x.status==="Learnt (flat)"?"selected":"")+'>Learnt (flat)</option><option '+(x.status==="Learnt (rolling)"?"selected":"")+'>Learnt (rolling)</option></select></article>').join(""):'<div class="trick-empty">No tricks match this filter.</div>')+'</div></section>';
}


function milestonesPage(){
 const activityMilestones=[10,100,250,500,1000],totalMilestones=[100,500,1000,2500,5000];
 const totalCompleted=A.reduce((n,a)=>n+totalSessions(a.id),0);
 function milestoneCard(name,count,milestones,description){
  const previous=milestones.filter(n=>count>=n).pop()||0;
  const next=milestones.find(n=>count<n);
  const tier=Math.max(0,next?milestones.indexOf(next):milestones.length-1);
  const colour=['#9aa6b2','#bd8958','#b9c4d0','#e0b84f','#55b8c8'][tier];
  const colourStyle='--milestone-colour:'+colour;
  if(!next)return '<article class="quest-card milestone-card" style="'+colourStyle+'"><div class="quest-card-top"><div><strong>'+name+'</strong><p>'+count.toLocaleString()+' completed sessions · All milestones completed</p></div><span class="quest-reward">Complete</span></div><div class="quest-progress"><span style="width:100%"></span></div><div class="quest-card-foot"><small>'+milestones[milestones.length-1].toLocaleString()+' session milestone reached</small></div></article>';
  const progress=Math.max(0,Math.min(100,(count-previous)/(next-previous)*100));
  return '<article class="quest-card milestone-card" style="'+colourStyle+'"><div class="quest-card-top"><div><strong>'+name+'</strong><p>'+count.toLocaleString()+' completed sessions</p></div><span class="quest-reward">Next: '+next.toLocaleString()+'</span></div><div class="quest-progress"><span style="width:'+progress+'%"></span></div><div class="quest-card-foot"><small>'+(previous?previous.toLocaleString()+' reached':'Starting milestone')+'</small><small>'+count.toLocaleString()+' / '+next.toLocaleString()+'</small></div></article>';
 }
 const totalCard=milestoneCard("Total sessions completed",totalCompleted,totalMilestones);
 const activityCards=A.map(a=>milestoneCard(a.name,totalSessions(a.id),activityMilestones)).join("");
 return '<div class="page-head"><div class="eyebrow">YOUR PROGRESS</div><h1>Milestones</h1><p>Track the session milestones you are working towards.</p></div>'+
  '<section class="quest-section"><div class="section-head"><h2>Overall progress</h2></div><div class="quest-list">'+totalCard+'</div></section>'+
  '<section class="quest-section"><div class="section-head"><h2>Activity milestones</h2></div><div class="quest-list">'+activityCards+'</div></section>';
}
function sideQuestsPage(){
 const quests=[...(data.sideQuests||[])].sort((a,b)=>(a.date||"9999").localeCompare(b.date||"9999"));
 const card=q=>{
  const date=q.date?new Date(q.date+"T12:00:00").toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"}):"Date not set";
  const people=(q.friends||"").trim();
  const details=[date,q.location,people?"With "+people:""].filter(Boolean).map(escapeHtml).join(" · ");
  const status=q.status||"planned";
  const statusLabel=status==="in-progress"?"In progress":status==="completed"?"Completed":status==="cancelled"?"Cancelled":"Planned";
  const stars=Array.from({length:5},(_,i)=>'<button type="button" data-quest-rate="'+escapeHtml(q.id)+'" data-rating="'+(i+1)+'" class="'+(i<(q.rating||0)?"selected":"")+'" aria-label="'+(i+1)+' out of 5 stars">★</button>').join("");
  const actions=status==="planned"?'<button type="button" data-quest-start="'+escapeHtml(q.id)+'">Start quest</button><button type="button" data-quest-cancel="'+escapeHtml(q.id)+'">Cancel</button>':status==="in-progress"?'<button type="button" data-quest-complete="'+escapeHtml(q.id)+'">Mark completed</button><button type="button" data-quest-cancel="'+escapeHtml(q.id)+'">Cancel</button>':status==="cancelled"?'<button type="button" data-quest-reschedule="'+escapeHtml(q.id)+'">Reschedule</button>':"";
  return '<article class="sidequest-card"><div class="sidequest-card-top"><div class="sidequest-card-heading"><h3>'+escapeHtml(q.title)+'</h3></div><div style="display:flex;align-items:flex-start;gap:9px"><span class="sidequest-status">'+statusLabel+'</span><details class="sidequest-menu"><summary aria-label="Quest options">⋯</summary><div class="sidequest-menu-options"><button type="button" data-quest-delete="'+escapeHtml(q.id)+'">Delete quest</button></div></details></div></div>'+
   (details?'<div class="sidequest-details">'+details+'</div>':"")+
   (q.description?'<p class="sidequest-description">'+escapeHtml(q.description)+'</p>':"")+
   (actions?'<div class="sidequest-actions">'+actions+'</div>':"")+
   (status==="completed"?'<div class="sidequest-review"><small>Your rating</small><div class="sidequest-stars">'+stars+'</div><small>'+(q.rating?q.rating+' / 5 stars':'Tap a star to rate this quest')+'</small></div>':"")+'</article>';
 };
 const active=quests.filter(q=>!["completed","cancelled"].includes(q.status||"planned"));
 const completed=quests.filter(q=>q.status==="completed");
 const cancelled=quests.filter(q=>q.status==="cancelled");
 return '<div class="page-head"><div class="eyebrow">REAL-LIFE ADVENTURES</div><h1>Side Quests</h1><p>Plan something with your mates, then keep a record of how it went.</p></div>'+
  '<section class="sidequest-create"><div class="section-head"><h2>Create a quest</h2><small>Plan it before you go</small></div>'+
  '<form class="sidequest-form" data-sidequest-form>'+
   '<label class="wide">Quest name<input name="title" maxlength="70" placeholder="e.g. Explore somewhere new" required></label>'+
   '<label>Planned date<input name="date" type="date" min="'+todayKey+'"></label>'+
   '<label>Location<input name="location" maxlength="100" placeholder="Where are you going?"></label>'+
   '<label class="wide">Who is coming?<input name="friends" maxlength="160" placeholder="Names of your mates"></label>'+
   '<label class="wide">Description<textarea name="description" maxlength="500" placeholder="What is the plan?"></textarea></label>'+
   '<button class="sidequest-submit" type="submit">Create side quest</button></form></section>'+
  '<section class="sidequest-group"><div class="section-head"><h2>Upcoming & in progress</h2><small>'+active.length+' quests</small></div>'+
  (active.length?active.map(card).join(""):'<div class="sidequest-empty">No active quests yet. Create one above.</div>')+'</section>'+
  '<section class="sidequest-group"><div class="section-head"><h2>Completed</h2><small>'+completed.length+' quests</small></div>'+
  (completed.length?completed.slice().reverse().map(card).join(""):'<div class="sidequest-empty">Completed adventures will show up here.</div>')+'</section>'+
  '<section class="sidequest-group"><div class="section-head"><h2>Cancelled</h2><small>'+cancelled.length+' quests</small></div>'+
  (cancelled.length?'<section class="sidequest-group"><div class="section-head"><h2>Cancelled</h2><small>'+cancelled.length+' quests</small></div>'+cancelled.slice().reverse().map(card).join("")+'</section>':"");
}


function questsPage(){
 const personal=questSection==="Personal";
 return '<div class="page-head"><h1>Quests</h1></div>'+
 '<div class="quest-section-switch"><button type="button" data-quest-section="Personal" class="'+(personal?"active":"")+'">Main Quests</button><button type="button" data-quest-section="Side" class="'+(!personal?"active":"")+'">Side quests</button></div>'+
 (personal?mainQuestsPage():sideQuestsPage());
}

function profilePage(){
 const totalMilestones=Object.values(data.mainQuestProgress||{}).reduce((n,q)=>n+(q.milestones||[]).length,0);
 const completedMilestones=Object.values(data.mainQuestProgress||{}).reduce((n,q)=>n+(q.milestones||[]).filter(m=>m.done).length,0);
 const trickCount=tricks.length;
 const learntTricks=tricks.filter(t=>["Learnt (flat)","Learnt (rolling)","Learnt","Rolling"].includes(data.tricks[t])).length;
 return '<div class="page-head"><h1>Profile</h1></div>'+
 '<div class="profile-layout"><div class="profile-column">' +
 (data.profile?.workMode?'':('<section class="profile-section"><div class="section-head"><h2>My progress</h2><small>Personal tracking</small></div><div class="profile-links">'+
 '<button class="profile-link" data-page="Progress"><span class="profile-link-icon"><i class="sq-icon" data-lucide="chart-no-axes-combined"></i></span><span><strong>Progress</strong><small>Daily logs, monthly records and activity history</small></span><span class="profile-chevron">›</span></button><button class="profile-link" data-page="Targets"><span class="profile-link-icon">'+appIcon("target")+'</span><span><strong>Goals</strong><small>Set monthly targets for your four activities</small></span><span class="profile-chevron">›</span></button>'+
 '<button class="profile-link" data-page="Milestones"><span class="profile-link-icon">'+appIcon("milestones")+'</span><span><strong>Milestones</strong><small>'+completedMilestones+' / '+totalMilestones+' achievements completed</small></span><span class="profile-chevron">›</span></button>'+
 '<button class="profile-link" data-page="Tricks"><span class="profile-link-icon">'+appIcon("tricks")+'</span><span><strong>My tricks</strong><small>'+learntTricks+' / '+trickCount+' tricks learnt</small></span><span class="profile-chevron">›</span></button>'+
 '</div></section>'))+
 '</div><div class="profile-column profile-column-spotify">'+spotifyProfilePanel()+
 '<section class="profile-section"><div class="section-head"><h2>Settings</h2><small>App and device</small></div><div class="profile-settings"><div class="profile-setting-row"><span><strong>Work</strong><small>'+(data.profile?.workMode?"Work mode is on · College, Music and Profile only":"Show only College, Music and Profile tabs")+'</small></span><button type="button" data-work-mode>'+(data.profile?.workMode?"Turn off":"Turn on")+'</button></div><div class="profile-setting-row"><span><strong>Device sync</strong><small>'+(syncConfig?"Connected across devices":"Not connected")+'</small></span><button type="button" data-profile-action="connect">'+(syncConfig?"Manage":"Connect")+'</button></div><div class="profile-setting-row"><span><strong>Check for updates</strong><small>Current version v0.6.2</small></span><button type="button" data-profile-action="sync">Check</button></div></div></section>'+
 '</div></div>';
}
function mainQuestsPage(){const groups=[{name:"Appearance & Grooming",quests:[["skincare","Skincare routine"]]},{name:"Fitness & Health",quests:[["strength","Build muscle and strength"],["exercise","Build a consistent exercise routine"],["flexibility","Improve flexibility and mobility"],["posture","Improve posture"]]},{name:"Lifestyle",quests:[["sleep","Fix my sleep schedule"]]},{name:"Confidence",quests:[["role-model","Become someone people look up to"]]}];return groups.map(group=>'<section class="mainquest-category"><div class="mainquest-category-head"><h2>'+group.name+'</h2></div><div class="mainquest-grid">'+group.quests.map(([id,name])=>'<article class="mainquest-card mainquest-title-only"><h3>'+name+'</h3><button type="button" class="quest-action" data-open-progress="'+id+'">Track progress</button></article>').join("")+'</div></section>').join("")}

function progressPage(){const cats=[["Skincare","Monthly skincare photos"],["Muscle & Strength","Monthly photos and strength records"],["Flexibility & Mobility","Monthly photos and videos"],["Posture","Monthly posture photos"],["Sleep","Daily bedtime and wake-up records"],["Fitness","Workout calendar and targets"],["Music","Drums and guitar practice"],["Skate","Skate sessions and trick progress"],["Tricks","Your skate trick progress"],["Milestones","Quest milestones and achievements"],["Activity tracking","Full activity calendar, logs and monthly targets"]];return '<div class="page-head"><div class="eyebrow">YOUR RECORDS</div><h1>Progress</h1><p>All your tracking, records and history in one place.</p></div><div class="progress-link-list">'+cats.map(([n,d])=>'<button class="profile-link" data-progress-category="'+n+'"><span class="profile-link-icon"><i class="sq-icon" data-lucide="folder-chart"></i></span><span><strong>'+n+'</strong><small>'+d+'</small></span><span class="profile-chevron">›</span></button>').join("")+'</div>'}
function progressCategoryPage(){const name=progressCategory;if(name==="Activity tracking"||name==="Fitness"||name==="Music"||name==="Skate")return '<div class="page-head"><h1>'+escapeHtml(name)+' tracking</h1><p>Activity logs, calendars and monthly targets.</p></div>'+logPage()+calendarPage();if(name==="Tricks")return '<div class="page-head"><h1>Trick progress</h1></div><button class="profile-back" data-page="Progress">← Back to Progress</button>'+tricksPage();if(name==="Milestones")return '<div class="page-head"><h1>Milestones</h1><p>Your quest milestones and achievements.</p></div>'+milestonesPage();const monthly=Object.entries(data.monthlyCheckins||{}).sort((a,b)=>b[0].localeCompare(a[0])),daily=Object.entries(data.dailyCheckins||{}).sort((a,b)=>b[0].localeCompare(a[0]));let cards="";if(name==="Sleep"){cards=daily.map(([date,r])=>{const x=r.answers||{};return '<article class="progress-record"><strong>'+escapeHtml(date)+'</strong><p>Bed before 12: '+escapeHtml(x["bed-before-midnight"]||"—")+' · Bedtime: '+escapeHtml(x.bedtime||"—")+' · Wake: '+escapeHtml(x["wake-time"]||"—")+'</p></article>'}).join("");cards+=Object.entries(data.sleepLogs||{}).map(([date,x])=>'<article class="progress-record"><strong>'+escapeHtml(date)+'</strong><p>Bed '+escapeHtml(x.bed||"—")+' · Wake '+escapeHtml(x.wake||"—")+'</p></article>').join("")}else{const q=monthlyQuestions.find(q=>q.category===name);if(q)cards=monthly.map(([date,r])=>{const media=r.answers?.[q.id]?.media||[];return media.length?'<article class="progress-record"><div class="progress-record-head"><strong>'+escapeHtml(date)+'</strong></div><div class="progress-media-grid">'+media.map(m=>m.type?.startsWith("video/")?'<video controls src="'+m.src+'"></video>':'<img src="'+m.src+'" alt="'+name+' progress">').join("")+'</div></article>':""}).join("");const legacy={Skincare:"skincare","Muscle & Strength":"strength","Flexibility & Mobility":"flexibility",Posture:"posture"}[name];if(legacy)cards+=(data.questPhotos?.[legacy]||[]).map(p=>'<article class="progress-record"><div class="progress-record-head"><strong>'+escapeHtml(p.date||"Previous record")+'</strong></div><div class="progress-media-grid"><img src="'+p.src+'" alt="'+name+' progress"></div></article>').join("")}if(name==="Muscle & Strength"&&data.strengthLogs?.length)cards+='<article class="progress-record"><h2>Strength records</h2>'+data.strengthLogs.slice().reverse().map(x=>'<p><strong>'+escapeHtml(x.exercise)+'</strong> · '+escapeHtml(x.result)+' · '+escapeHtml(x.date)+'</p>').join("")+'</article>';return '<div class="page-head"><div class="eyebrow">PROGRESS</div><h1>'+escapeHtml(name)+'</h1><p>Your saved records, organised by month.</p></div><div class="progress-record-list">'+(cards||'<p class="muted">No records yet. Your completed check-ins will appear here.</p>')+'</div>'}


let spotifyTracks=[],spotifyPlaylists=[],spotifyBusy=false,spotifyUserProfile=null,spotifyProfileLoaded=false;
// Set by the Side Quest maintainer after the Spotify developer app is registered.
const SPOTIFY_CLIENT_ID="341d366a42f94d35a0c4a1047dea7360";
const spotifyClientId=()=>SPOTIFY_CLIENT_ID;
const spotifyTokenKey="sq27_spotify_tokens";
const spotifyNative=()=>Boolean(window.Capacitor?.isNativePlatform?.());
const spotifyRedirectUri=()=>spotifyNative()?"com.sidequest.tracker://spotify-callback":location.origin+location.pathname;
const spotifyScopes=["playlist-read-private","playlist-modify-private","playlist-modify-public","user-read-private"].join(" ");
function spotifyTokens(){try{let saved=localStorage.getItem(spotifyTokenKey);if(!saved){saved=sessionStorage.getItem(spotifyTokenKey);if(saved){localStorage.setItem(spotifyTokenKey,saved);sessionStorage.removeItem(spotifyTokenKey)}}return JSON.parse(saved||"null")}catch(e){return null}}
function spotifySaveTokens(value){localStorage.setItem(spotifyTokenKey,JSON.stringify(value))}
function spotifyClearTokens(){localStorage.removeItem(spotifyTokenKey);sessionStorage.removeItem(spotifyTokenKey);sessionStorage.removeItem("sq27_spotify_verifier");sessionStorage.removeItem("sq27_spotify_state");spotifyUserProfile=null;spotifyProfileLoaded=false;spotifyPlaylists=[]}
function spotifyLogo(){return '<span class="spotify-mark" aria-label="Spotify"><svg viewBox="0 0 24 24" role="img" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="currentColor"/><path d="M5.2 8.8c4.5-1.35 9.95-.95 14.05 1.52M6.1 12.15c3.75-1.08 8.45-.72 11.95 1.35M6.9 15.35c3.05-.82 6.6-.53 9.35 1.08" fill="none" stroke="#1ed760" stroke-width="1.65" stroke-linecap="round"/></svg></span>'}
function spotifyProfilePanel(){
 const connected=Boolean(spotifyTokens()?.refresh_token||spotifyTokens()?.access_token);
 const account=spotifyUserProfile;
 const avatar=account?.images?.[0]?.url?'<img class="spotify-profile-avatar" src="'+esc(account.images[0].url)+'" alt="Spotify profile picture">':'<span class="spotify-profile-avatar spotify-profile-avatar-fallback"><i class="sq-icon" data-lucide="user-round"></i></span>';
 const display=account?.display_name||account?.id||"Spotify account";
 const playlistOptionsFor=key=>'<option value="">Choose a playlist</option>'+spotifyPlaylists.map(p=>'<option value="'+esc(p.id)+'"'+(data.profile?.spotifyPlaylists?.[key]===p.id?' selected':'')+'>'+esc(p.name)+' · '+Number(p.items?.total??p.tracks?.total??0)+' songs</option>').join("");
 return '<section class="spotify-panel spotify-profile-panel"><div class="section-head"><h2>'+spotifyLogo()+' Spotify</h2></div>'+(connected?'<div class="spotify-account-row">'+avatar+'<span class="spotify-account-name"><strong>'+esc(display)+'</strong></span></div>':'<div class="spotify-connected-row"><span><strong>Connect Spotify</strong><small>Connect your account to use your playlists in Side Quest.</small></span><button type="button" class="spotify-primary" data-spotify-connect>Connect to Spotify</button></div>')+(connected?'<div class="spotify-profile-playlists"><label for="spotifyGuitarPlaylist">Guitar playlist</label><select id="spotifyGuitarPlaylist" data-spotify-profile-playlist="guitar">'+(spotifyPlaylists.length?playlistOptionsFor('guitar'):'<option value="">Loading playlists…</option>')+'</select><button type="button" class="spotify-save-button" data-spotify-save="guitar">Save guitar playlist</button><label for="spotifyDrumsPlaylist">Drums playlist</label><select id="spotifyDrumsPlaylist" data-spotify-profile-playlist="drums">'+(spotifyPlaylists.length?playlistOptionsFor('drums'):'<option value="">Loading playlists…</option>')+'</select><button type="button" class="spotify-save-button" data-spotify-save="drums">Save drums playlist</button><small class="spotify-note">Choose which Spotify playlist Side Quest should use for guitar and drum songs.</small></div>':'')+'</section>';
}

function spotifyPanel(){
 const connected=Boolean(spotifyTokens()?.refresh_token||spotifyTokens()?.access_token);
 const body=connected?'<div class="music-search-tools"><label for="musicSongInstrument">I can play it on</label><select id="musicSongInstrument"><option value="Drums">Drums</option><option value="Guitar">Guitar</option><option value="Both">Both</option></select><label for="spotifyTrackQuery">Find a song</label><input id="spotifyTrackQuery" type="search" autocomplete="off" placeholder="Start typing a song or artist…"><div id="spotifyResults" class="spotify-results" aria-live="polite"><p class="spotify-status">Start typing to find songs on Spotify.</p></div><small class="spotify-note">Add a song to your Side Quest list, or send it straight to your saved Spotify playlist.</small></div>':'<div class="spotify-setup"><p>Connect Spotify to search songs, see their album artwork and add them to your music list.</p><button type="button" class="spotify-primary" data-spotify-connect>Connect to Spotify</button></div>';
 return '<section class="spotify-panel music-library-panel"><div class="section-head"><h2>'+spotifyLogo()+' Add a song</h2><small>Spotify search</small></div>'+body+'</section>';
}
function spotifyRandomString(length=64){const chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";const values=crypto.getRandomValues(new Uint8Array(length));return Array.from(values,x=>chars[x%chars.length]).join("")}
function spotifyBase64Url(buffer){return btoa(String.fromCharCode(...new Uint8Array(buffer))).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}
async function spotifyStartConnect(){
 const id=spotifyClientId();if(!id){toast("Spotify is not configured");return}
 if(!crypto?.subtle||!crypto?.getRandomValues){toast("Secure login needs a modern browser connection");return}
 const verifier=spotifyRandomString(),state=spotifyRandomString(32),digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(verifier)),challenge=spotifyBase64Url(digest);
 sessionStorage.setItem("sq27_spotify_verifier",verifier);sessionStorage.setItem("sq27_spotify_state",state);
 const url=new URL("https://accounts.spotify.com/authorize");
 url.search=new URLSearchParams({client_id:id,response_type:"code",redirect_uri:spotifyRedirectUri(),scope:spotifyScopes,state,code_challenge_method:"S256",code_challenge:challenge}).toString();
 if(spotifyNative()&&window.Capacitor?.Plugins?.Browser?.open){
  await window.Capacitor.Plugins.Browser.open({url:url.toString()});
 }else location.assign(url.toString());
}
async function spotifyHandleCallback(callbackUrl){
 const callback=new URL(callbackUrl||location.href),params=callback.searchParams,code=params.get("code"),error=params.get("error");
 if(!code&&!error)return false;
 const returnedState=params.get("state"),savedState=sessionStorage.getItem("sq27_spotify_state"),verifier=sessionStorage.getItem("sq27_spotify_verifier");
 if(!callbackUrl)history.replaceState({},document.title,location.pathname+location.hash);
 if(error){spotifyClearTokens();toast("Spotify connection was cancelled");return true}
 if(!returnedState||returnedState!==savedState||!verifier){spotifyClearTokens();toast("Spotify sign-in could not be verified. Please try again.");return true}
 try{
  const response=await fetch("https://accounts.spotify.com/api/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({client_id:spotifyClientId(),grant_type:"authorization_code",code,redirect_uri:spotifyRedirectUri(),code_verifier:verifier})});
  const result=await response.json();if(!response.ok)throw new Error(result.error_description||result.error||"Token exchange failed");
  spotifySaveTokens({access_token:result.access_token,refresh_token:result.refresh_token,expires_at:Date.now()+Number(result.expires_in||3600)*1000,issued_at:Date.now()});
  sessionStorage.removeItem("sq27_spotify_verifier");sessionStorage.removeItem("sq27_spotify_state");
  toast("Spotify connected");return true;
 }catch(e){spotifyClearTokens();toast("Spotify sign-in failed: "+(e.message||"Try again"));return true}
}
async function spotifySetupNativeCallback(){
 if(!spotifyNative())return;
 const appPlugin=window.Capacitor?.Plugins?.App,browserPlugin=window.Capacitor?.Plugins?.Browser;
 if(!appPlugin?.addListener){console.warn("Capacitor App plugin unavailable");return}
 appPlugin.addListener("appUrlOpen",async event=>{
  if(!event?.url?.startsWith("com.sidequest.tracker://spotify-callback"))return;
  try{await browserPlugin?.close?.()}catch(_){}
  await spotifyHandleCallback(event.url);
  render();
  if(spotifyTokens()){spotifyProfileLoaded=false;spotifyLoadAccount()}
 });
 try{
  const launch=await appPlugin.getLaunchUrl?.();
  if(launch?.url?.startsWith("com.sidequest.tracker://spotify-callback")){
   try{await browserPlugin?.close?.()}catch(_){}
   await spotifyHandleCallback(launch.url);
  }
 }catch(e){console.warn("Could not read Spotify launch URL",e)}
}
async function spotifyRefreshToken(){
 const current=spotifyTokens(),id=spotifyClientId();if(!current?.refresh_token||!id)throw new Error("Reconnect Spotify to continue");
 if(current.issued_at&&Date.now()-current.issued_at>180*24*60*60*1000){spotifyClearTokens();throw new Error("Spotify authorisation has expired. Connect again.")}
 const response=await fetch("https://accounts.spotify.com/api/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({client_id:id,grant_type:"refresh_token",refresh_token:current.refresh_token})});
 const result=await response.json();if(!response.ok){if(result.error==="invalid_grant")spotifyClearTokens();throw new Error(result.error_description||result.error||"Could not refresh Spotify access")}
 const next={...current,access_token:result.access_token,expires_at:Date.now()+Number(result.expires_in||3600)*1000};if(result.refresh_token)next.refresh_token=result.refresh_token;spotifySaveTokens(next);return next.access_token;
}
async function spotifyAccessToken(){
 let token=spotifyTokens();if(!token?.refresh_token)throw new Error("Connect Spotify first");
 if(!token.access_token||Date.now()>Number(token.expires_at||0)-60000)return spotifyRefreshToken();
 return token.access_token;
}
async function spotifyApi(path,options={},retry=true){
 const access=await spotifyAccessToken(),response=await fetch("https://api.spotify.com/v1"+path,{...options,headers:{Authorization:"Bearer "+access,"Content-Type":"application/json",...(options.headers||{})}});
 if(response.status===401&&retry){await spotifyRefreshToken();return spotifyApi(path,options,false)}
 const result=response.status===204?{}:await response.json().catch(()=>({}));
 if(!response.ok){if(response.status===429)throw new Error("Spotify is rate-limiting requests. Try again in a little while.");throw new Error(result.error?.message||result.error_description||"Spotify request failed ("+response.status+")")}
 return result;
}
async function spotifyLoadAccount(){
 if(spotifyProfileLoaded||!spotifyTokens())return;
 spotifyProfileLoaded=true;
 try{
  spotifyUserProfile=await spotifyApi("/me");
  await spotifyLoadPlaylists();
  if(page==="Profile")render();
 }catch(e){
  spotifyProfileLoaded=false;
  if(String(e.message).includes("403")||String(e.message).toLowerCase().includes("scope"))toast("Reconnect Spotify to allow Side Quest to show your Spotify profile");
  else toast(e.message);
 }
}
async function spotifyLoadPlaylists(){
 const selects=Array.from(document.querySelectorAll("[data-spotify-profile-playlist]"));
 if(selects.length)selects.forEach(select=>select.innerHTML='<option value="">Loading…</option>');
 try{
  const result=await spotifyApi("/me/playlists?limit=50");
  spotifyPlaylists=result.items||[];
  const options='<option value="">Choose a playlist</option>'+spotifyPlaylists.map(p=>'<option value="'+esc(p.id)+'">'+esc(p.name)+' · '+Number(p.items?.total??p.tracks?.total??0)+' songs</option>').join("");
  selects.forEach(select=>{const key=select.dataset.spotifyProfilePlaylist;select.innerHTML=spotifyPlaylists.length?options:'<option value="">No playlists found</option>';select.value=data.profile?.spotifyPlaylists?.[key]||"";});
 }catch(e){selects.forEach(select=>select.innerHTML='<option value="">Could not load playlists</option>');toast(e.message)}
}
let spotifySearchSequence=0,spotifySearchTimer=null,musicActiveTab='drums',spotifyMusicCache={};
async function spotifySearchTracks(queryOverride){
 const input=$("spotifyTrackQuery"),query=String(queryOverride??input?.value??"").trim(),results=$("spotifyResults"),sequence=++spotifySearchSequence;
 if(!results)return;
 if(query.length<2){results.innerHTML=query?'<p class="spotify-status">Type at least 2 characters…</p>':'<p class="spotify-status">Start typing to find songs on Spotify.</p>';spotifyTracks=[];return}
 results.innerHTML='<p class="spotify-status">Searching Spotify…</p>';
 try{
  const result=await spotifyApi("/search?"+new URLSearchParams({q:query,type:"track",limit:"8"}));
  if(sequence!==spotifySearchSequence||$("spotifyTrackQuery")?.value.trim()!==query)return;
  spotifyTracks=result.tracks?.items||[];
  results.innerHTML=spotifyTracks.length?spotifyTracks.map((track,i)=>{
   const cover=track.album?.images?.[1]?.url||track.album?.images?.[0]?.url||"";
   return '<article class="spotify-track"><img class="spotify-track-cover" src="'+esc(cover)+'" alt="'+esc(track.album?.name||"Album artwork")+'" loading="lazy"><div class="spotify-track-info"><strong>'+esc(track.name)+'</strong><small>'+esc((track.artists||[]).map(a=>a.name).join(", "))+'</small><small class="spotify-album-name">'+esc(track.album?.name||"")+'</small><a href="'+esc(track.external_urls?.spotify||"https://open.spotify.com")+'" target="_blank" rel="noopener noreferrer">Open in Spotify ↗</a></div><div class="spotify-track-actions"><button type="button" class="spotify-add-track" data-spotify-add="'+i+'">Add &amp; sync</button></div></article>';
  }).join(""):'<p class="spotify-status">No tracks found. Try another search.</p>';
 }catch(e){if(sequence===spotifySearchSequence)results.innerHTML='<p class="spotify-status">'+esc(e.message)+'</p>'}
}
async function spotifyAddTrack(index){
 const track=spotifyTracks[index],choice=$("musicSongInstrument")?.value||"Drums";
 if(!track?.uri){toast("Choose a track first");return}
 const targets=choice==="Both"?["drums","guitar"]:[choice.toLowerCase()];
 const destinations=[...new Map(targets.map(key=>[data.profile?.spotifyPlaylists?.[key],key]).filter(([id])=>id).map(([id,key])=>[id,{id,key}])).values()];
 const missing=targets.filter(key=>!data.profile?.spotifyPlaylists?.[key]);
 if(!destinations.length){toast("Set up your playlists in Profile first");return}
 try{
  for(const d of destinations) await spotifyApi("/playlists/"+encodeURIComponent(d.id)+"/items",{method:"POST",body:JSON.stringify({uris:[track.uri]})});
  data.musicSongs=Array.isArray(data.musicSongs)?data.musicSongs:[];
  const existing=data.musicSongs.find(song=>song.spotifyId===track.id);
  if(existing) existing.instrument=existing.instrument==="Both"||choice==="Both"?"Both":choice;
  else data.musicSongs.push({id:String(Date.now())+Math.random().toString(36).slice(2,6),spotifyId:track.id,title:track.name,artist:(track.artists||[]).map(a=>a.name).join(", "),album:track.album?.name||"",cover:track.album?.images?.[1]?.url||track.album?.images?.[0]?.url||"",spotifyUrl:track.external_urls?.spotify||"",instrument:choice,createdAt:new Date().toISOString()});
  save();spotifyMusicCache={};
  const btn=$("spotifyResults")?.querySelector('[data-spotify-add="'+index+'"]');if(btn){btn.textContent="Added & synced";btn.disabled=true}
  toast("Added and synced to "+destinations.map(d=>d.key==="drums"?"Drums":"Guitar").join(" and "));
  spotifyLoadMusicPlaylist(musicActiveTab,true);
 }catch(e){toast(e.message)}
}
async function spotifyLoadMusicPlaylist(key,force=false){
 const list=$("musicPlaylistTracks");if(!list)return;
 if(key==="both"){
  const ids=["drums","guitar"].map(k=>({key:k,id:data.profile?.spotifyPlaylists?.[k]}));
  const missing=ids.filter(x=>!x.id);
  if(missing.length){list.innerHTML='<p class="spotify-status">Connect both your Drums and Guitar playlists in Profile to see everything together.</p>';return}
  if(!force&&spotifyMusicCache.both?.ids===ids.map(x=>x.id).join("|")){renderMusicPlaylistTracks("both");return}
  list.innerHTML='<p class="spotify-status">Loading both playlists…</p>';
  try{
   const results=await Promise.all(ids.map(async x=>{const r=await spotifyApi("/playlists/"+encodeURIComponent(x.id)+"/items?limit=50");return (r.items||[]).map(row=>row.item||row.track||row).filter(t=>t&&t.id)}));
   const seen=new Set(),items=results.flat().filter(t=>!seen.has(t.id)&&seen.add(t.id));
   spotifyMusicCache.both={ids:ids.map(x=>x.id).join("|"),items};renderMusicPlaylistTracks("both");
  }catch(e){list.innerHTML='<p class="spotify-status">'+esc(e.message)+'</p>'}
  return;
 }
 const id=data.profile?.spotifyPlaylists?.[key];
 if(!id){list.innerHTML='<p class="spotify-status">Choose your '+(key==="drums"?"Drums":"Guitar")+' playlist in Profile to see it here.</p>';return}
 if(!force&&spotifyMusicCache[key]?.id===id){renderMusicPlaylistTracks(key);return}
 list.innerHTML='<p class="spotify-status">Loading playlist…</p>';
 try{const result=await spotifyApi("/playlists/"+encodeURIComponent(id)+"/items?limit=50");const items=(result.items||[]).map(row=>row.item||row.track||row).filter(t=>t&&t.id);spotifyMusicCache[key]={id,items};renderMusicPlaylistTracks(key)}
 catch(e){list.innerHTML='<p class="spotify-status">'+esc(e.message)+'</p>'}
}
function renderMusicPlaylistTracks(key){
 const list=$("musicPlaylistTracks");if(!list)return;
 const items=spotifyMusicCache[key]?.items||[];
 list.innerHTML=items.length?items.map(t=>{const cover=t.album?.images?.[1]?.url||t.album?.images?.[0]?.url||"";return '<article class="spotify-track"><img class="spotify-track-cover" src="'+esc(cover)+'" alt="Album artwork" loading="lazy"><div class="spotify-track-info"><strong>'+esc(t.name)+'</strong><small>'+esc((t.artists||[]).map(a=>a.name).join(", "))+'</small><small class="spotify-album-name">'+esc(t.album?.name||"")+'</small></div><button type="button" class="spotify-remove-track" data-spotify-remove="'+esc(t.id)+'" aria-label="Remove '+esc(t.name)+'">Remove</button></article>'}).join(""):'<p class="spotify-status">No songs in this playlist yet.</p>';
}
async function spotifyRemoveTrack(trackId){
 const button=document.querySelector('[data-spotify-remove="'+CSS.escape(trackId)+'"]');
 const targets=musicActiveTab==="both"?["drums","guitar"]:[musicActiveTab];
 const destinations=[...new Set(targets.map(key=>data.profile?.spotifyPlaylists?.[key]).filter(Boolean))];
 if(!destinations.length){toast("Choose a Spotify playlist in Profile first");return}
 if(!window.confirm("Remove this song from "+(musicActiveTab==="both"?"both playlists":musicActiveTab+" playlist")+"?"))return;
 if(button){button.disabled=true;button.textContent="Removing…"}
 try{
  const uri="spotify:track:"+trackId;
  for(const playlistId of destinations)await spotifyApi("/playlists/"+encodeURIComponent(playlistId)+"/items",{method:"DELETE",body:JSON.stringify({items:[{uri}]})});
  spotifyMusicCache={};await spotifyLoadMusicPlaylist(musicActiveTab,true);toast("Song removed from Spotify playlist"+(destinations.length>1?"s":""));
 }catch(e){if(button){button.disabled=false;button.textContent="Remove"}toast("Couldn't remove song: "+e.message)}
}
async function spotifyCreatePlaylist(){
 const name=window.prompt("Name your new private playlist","Side Quest Songs");if(!name?.trim())return;
 try{const playlist=await spotifyApi("/me/playlists",{method:"POST",body:JSON.stringify({name:name.trim().slice(0,100),description:"Songs collected in Side Quest",public:false})});await spotifyLoadPlaylists();const select=$("spotifyPlaylistSelect");if(select)select.value=playlist.id;toast("Private playlist created")}
 catch(e){toast(e.message)}
}

function musicLibraryPage(){
 const active=["guitar","both"].includes(musicActiveTab)?musicActiveTab:"drums",label=active==="both"?"Both":active==="guitar"?"Guitar":"Drums";
 return '<div class="page-head category-page-head cat-music"><h1>Music</h1></div>'+spotifyPanel()+'<section class="music-playlist-section"><div class="music-playlist-tabs"><button type="button" data-music-tab="drums" class="'+(active==="drums"?"active":"")+'">Drums</button><button type="button" data-music-tab="guitar" class="'+(active==="guitar"?"active":"")+'">Guitar</button><button type="button" data-music-tab="both" class="'+(active==="both"?"active":"")+'">Both</button></div><div class="section-head"><h2>'+label+(active==="both"?" playlists":" playlist")+'</h2><small>Spotify synced</small></div><div id="musicPlaylistTracks" class="spotify-results"><p class="spotify-status">Loading playlist…</p></div></section>';
}
function render(){
 document.body.classList.toggle("work-mode",Boolean(data.profile?.workMode));
 const labels=data.profile?.workMode?[["College",appIcon("home"),"Overview"],["Music",appIcon("music"),"MusicLibrary"],["Profile",appIcon("profile"),"Profile"]]:[["College",appIcon("home"),"Overview"],["Music",appIcon("music"),"MusicLibrary"],["Track",appIcon("track"),"Track"],["Quests",appIcon("compass"),"Quests"],["Profile",appIcon("profile"),"Profile"]];
 const profileSection=["Targets","Milestones","Tricks","Progress","ProgressCategory"].includes(page);
 const questsSection=page==="Quests"||page==="SideQuests"||page==="Goals";
 $("bottomNav").innerHTML=labels.map(([name,icon,target])=>'<button data-page="'+target+'" class="'+((target==="Profile"&&(page==="Profile"||profileSection)||target==="Quests"&&questsSection||page===target)?"active":"")+'"><span>'+icon+'</span>'+name+'</button>').join("");
 let content=page==="MusicLibrary"?musicLibraryPage():page==="Overview"?dashboard():page==="Track"?trackPage():page==="Calendar"?calendarPage():page==="Progress"?progressPage():page==="ProgressCategory"?progressCategoryPage():page==="Tricks"?tricksPage():page==="Quests"||page==="SideQuests"||page==="Goals"?questsPage():page==="Milestones"?milestonesPage():page==="Targets"?targetsPage():page==="Profile"?profilePage():dashboard();
 if(profileSection)content='<button type="button" class="profile-back" data-page="'+(page==="ProgressCategory"?"Progress":"Profile")+'">← Back</button>'+content;
 $("view").innerHTML=content;
 if(window.lucide?.createIcons)window.lucide.createIcons();
 if(page==="MusicLibrary"){if(spotifyTokens())spotifyLoadMusicPlaylist(musicActiveTab,true);else{const list=$("musicPlaylistTracks");if(list)list.innerHTML='<p class="spotify-status">Connect Spotify above to load your playlists.</p>'}}
 if(page==="Profile"&&spotifyTokens()&&!spotifyProfileLoaded)spotifyLoadAccount();
}
function toast(message){const t=$("toast");t.textContent=message;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1500)}
document.addEventListener("submit",e=>{
 const personalForm=e.target.closest("[data-personal-task-form],[data-personal-event-form],[data-personal-project-form],[data-personal-note-form]");
 if(personalForm){
  e.preventDefault();const v=new FormData(personalForm),id=String(Date.now())+Math.random().toString(36).slice(2,6);
  if(personalForm.matches("[data-personal-task-form]")){const title=String(v.get("title")||"").trim();if(!title)return;data.personalTasks.push({id,title,due:String(v.get("due")||""),priority:String(v.get("priority")||"normal"),done:false});}
  else if(personalForm.matches("[data-personal-event-form]")){const title=String(v.get("title")||"").trim(),date=String(v.get("date")||"");if(!title||!date)return;data.personalEvents.push({id,title,date,time:String(v.get("time")||"")});}
  else if(personalForm.matches("[data-personal-project-form]")){const title=String(v.get("title")||"").trim();if(!title)return;data.personalProjects.push({id,title,next:String(v.get("next")||"").trim()});}
  else {const text=String(v.get("text")||"").trim();if(!text)return;data.quickNotes.push({id,text,date:todayKey});}
  save();render();toast("Saved");return;
 }
 
 const profileForm=e.target.closest("[data-profile-form]");
 if(profileForm){
  e.preventDefault();const values=new FormData(profileForm);
  data.profile={...(data.profile||{}),name:String(values.get("name")||"").trim()};
  save();render();toast("Profile saved");return;
 }
 const form=e.target.closest("[data-sidequest-form]");if(!form)return;
 e.preventDefault();const values=new FormData(form),title=String(values.get("title")||"").trim();
 if(!title){toast("Give your quest a name first");return}
 data.sideQuests=data.sideQuests||[];
 data.sideQuests.push({id:String(Date.now()),title,description:String(values.get("description")||"").trim(),date:String(values.get("date")||""),location:String(values.get("location")||"").trim(),friends:String(values.get("friends")||"").trim(),status:"planned",rating:0,createdAt:new Date().toISOString()});
 save();render();toast("Side quest created");
});
document.addEventListener("click",async e=>{
  const spotifySave=e.target.closest("[data-spotify-save]");if(spotifySave){const key=spotifySave.dataset.spotifySave,select=document.querySelector('[data-spotify-profile-playlist="'+key+'"]');if(!select||!select.value){toast("Choose a playlist first");return}data.profile=data.profile||{};data.profile.spotifyPlaylists=data.profile.spotifyPlaylists||{};data.profile.spotifyPlaylists[key]=select.value;if(!persistSpotifyPlaylistPrefs()||!save())return;spotifySave.disabled=true;const oldLabel=spotifySave.textContent;spotifySave.textContent="Saving…";let synced=true;if(syncConfig&&syncReady){clearTimeout(syncTimer);synced=await syncPush()}spotifySave.disabled=false;spotifySave.textContent=oldLabel;toast(syncConfig&&syncReady?(synced?"Playlist saved and synced":"Saved on this device — sync will retry"):"Playlist saved on this device");return}
 const collegeView=e.target.closest("[data-college-view]");if(collegeView){e.preventDefault();window.setCollegeTab(collegeView.dataset.collegeView);return}
 const calendarModeBtn=e.target.closest("[data-calendar-mode]");if(calendarModeBtn){window.ds26CalendarMode=calendarModeBtn.dataset.calendarMode;render();return}
 const collegePeriod=e.target.closest("[data-college-period]");if(collegePeriod){const mode=window.ds26CalendarMode||"month";const base=new Date((window.ds26CalendarSelected||todayKey)+"T12:00:00");if(mode==="week")base.setDate(base.getDate()+Number(collegePeriod.dataset.collegePeriod)*7);else base.setMonth(base.getMonth()+Number(collegePeriod.dataset.collegePeriod));window.ds26CalendarSelected=base.getFullYear()+"-"+String(base.getMonth()+1).padStart(2,"0")+"-"+String(base.getDate()).padStart(2,"0");window.ds26CalendarMonth=window.ds26CalendarSelected.slice(0,7);render();return}
 const collegeDate=e.target.closest("[data-college-date]");if(collegeDate){window.ds26CalendarSelected=collegeDate.dataset.collegeDate;render();return}
 const collegeMonth=e.target.closest("[data-college-month]");if(collegeMonth){const base=window.ds26CalendarMonth?new Date(window.ds26CalendarMonth+"-01T12:00:00"):new Date(new Date().getFullYear(),new Date().getMonth(),1,12);base.setMonth(base.getMonth()+Number(collegeMonth.dataset.collegeMonth));window.ds26CalendarMonth=base.getFullYear()+"-"+String(base.getMonth()+1).padStart(2,"0");render();return}
 const collegeModule=e.target.closest("[data-college-module]");if(collegeModule){window.ds26Module=collegeModule.dataset.collegeModule;window.collegeTab="schedule";render();return}
 const cs=e.target.closest("[data-college-set]");if(cs){data.collegeAssignmentStatus=data.collegeAssignmentStatus||{};const k=cs.dataset.collegeSet;if(data.collegeAssignmentStatus[k]==="assigned")delete data.collegeAssignmentStatus[k];else data.collegeAssignmentStatus[k]="assigned";save();render();return}
 const cd=e.target.closest("[data-college-done]");if(cd){data.collegeProgress=data.collegeProgress||{};const k=cd.dataset.collegeDone;if(data.collegeProgress[k]==="submitted"||data.collegeProgress[k]==="done"){if(!window.confirm("Mark this assignment as not handed in?"))return;delete data.collegeProgress[k]}else{if(!window.confirm("Confirm this assignment is complete and has been handed in?"))return;data.collegeProgress[k]="submitted"}save();render();return}
 const taskDone=e.target.closest("[data-task-done]");if(taskDone){const t=data.personalTasks.find(x=>x.id===taskDone.dataset.taskDone);if(t)t.done=!t.done;save();render();return}
 const taskDelete=e.target.closest("[data-task-delete]");if(taskDelete){data.personalTasks=data.personalTasks.filter(x=>x.id!==taskDelete.dataset.taskDelete);save();render();return}
 const eventDelete=e.target.closest("[data-event-delete]");if(eventDelete){data.personalEvents=data.personalEvents.filter(x=>x.id!==eventDelete.dataset.eventDelete);save();render();return}
 const projectDelete=e.target.closest("[data-project-delete]");if(projectDelete){data.personalProjects=data.personalProjects.filter(x=>x.id!==projectDelete.dataset.projectDelete);save();render();return}
 const noteDelete=e.target.closest("[data-note-delete]");if(noteDelete){data.quickNotes=data.quickNotes.filter(x=>x.id!==noteDelete.dataset.noteDelete);save();render();return}
 
 const checkinStartBtn=e.target.closest("[data-checkin-start]");if(checkinStartBtn){checkinType=checkinStartBtn.dataset.checkinStart;checkinIndex=0;window.checkinWizardOpen=true;render();window.scrollTo(0,0);return}
 if(e.target.closest("[data-checkin-exit]")){window.checkinWizardOpen=false;render();return}
 if(e.target.closest("[data-checkin-back]")){checkinIndex=Math.max(0,checkinIndex-1);render();return}
 if(e.target.closest("[data-checkin-next]")){const st=checkinStats(checkinType),q=st.questions[checkinIndex];if(!isAnswered(q,st.record)){toast("Answer this question or choose Answer later");return}if(checkinIndex<st.questions.length-1){checkinIndex++;render()}else{window.checkinWizardOpen=false;save();render();toast("Check-in saved")}return}
 if(e.target.closest("[data-checkin-later]")){const st=checkinStats(checkinType),q=st.questions[checkinIndex];st.record.skipped=Array.from(new Set([...(st.record.skipped||[]),q.id]));save();if(checkinIndex<st.questions.length-1){checkinIndex++;render()}else{window.checkinWizardOpen=false;render()}return}
 const ans=e.target.closest("[data-checkin-answer]");if(ans){const st=checkinStore(checkinType);st.record.answers[ans.dataset.question]=ans.dataset.checkinAnswer;st.record.skipped=(st.record.skipped||[]).filter(x=>x!==ans.dataset.question);save();render();return}
 const rem=e.target.closest("[data-remove-media]");if(rem){const st=checkinStore(checkinType),id=rem.dataset.removeMedia;st.record.answers[id].media.splice(Number(rem.dataset.mediaIndex),1);if(!st.record.answers[id].media.length)delete st.record.answers[id];save();render();return}
 const pc=e.target.closest("[data-progress-category]");if(pc){progressCategory=pc.dataset.progressCategory;page="ProgressCategory";render();window.scrollTo(0,0);return}
 const op=e.target.closest("[data-open-progress]");if(op){const map={skincare:"Skincare",strength:"Muscle & Strength",exercise:"Fitness",flexibility:"Flexibility & Mobility",posture:"Posture",sleep:"Sleep","role-model":"Progress"};progressCategory=map[op.dataset.openProgress]||"Progress";page="ProgressCategory";render();window.scrollTo(0,0);return}
 const workMode=e.target.closest("[data-work-mode]");if(workMode){data.profile=data.profile||{};data.profile.workMode=!data.profile.workMode;if(data.profile.workMode&&!["Overview","MusicLibrary","Profile"].includes(page)){page="Overview"}save();render();toast(data.profile.workMode?"Work mode on":"Work mode off");return}
 const editName=e.target.closest("[data-edit-profile-name]");
 if(editName){const current=(data.profile?.name||"").trim();const next=window.prompt("Display name",current);if(next===null)return;data.profile=data.profile||{};data.profile.name=next.trim().slice(0,40);save();render();toast("Display name updated");return}
 if(e.target.closest("[data-crop-close]")){$("modalRoot").innerHTML="";cropImage=null;return}
 if(e.target.closest("[data-crop-save]")&&cropImage){
  const canvas=$("profileCropCanvas");data.profile=data.profile||{};data.profile.avatar=canvas.toDataURL("image/jpeg",0.86);save();$("modalRoot").innerHTML="";cropImage=null;render();toast("Profile picture updated");return
 }
 const strengthAdd=e.target.closest("[data-strength-add]");if(strengthAdd){const exercise=window.prompt("Exercise name");if(!exercise?.trim())return;const result=window.prompt("Result or personal best (e.g. weight, reps or time)");if(!result?.trim())return;data.strengthLogs=data.strengthLogs||[];data.strengthLogs.push({exercise:exercise.trim().slice(0,60),result:result.trim().slice(0,100),date:todayKey});save();render();toast("Performance saved");return}
 const sleepAdd=e.target.closest("[data-sleep-add]");if(sleepAdd){const beforeMidnight=window.confirm("Did you go to bed before 12? Choose Cancel if you went to bed at or after 12.");let bed="Before 12";if(!beforeMidnight){bed=window.prompt("What time did you go to bed? Use 24-hour time, nearest 30 minutes (e.g. 00:30).");if(bed===null)return;if(!/^([01]\d|2[0-3]):(00|30)$/.test(bed.trim())){toast("Enter a time ending in :00 or :30");return}bed=bed.trim()}const wake=window.prompt("What time did you wake up? Use 24-hour time, nearest 30 minutes (e.g. 08:30).");if(wake===null)return;if(!/^([01]\d|2[0-3]):(00|30)$/.test(wake.trim())){toast("Enter a time ending in :00 or :30");return}data.sleepLogs=data.sleepLogs||{};data.sleepLogs[todayKey]={bed,wake:wake.trim()};save();render();toast("Sleep record saved");return}
 const evidenceAdd=e.target.closest("[data-evidence-add]");if(evidenceAdd){const title=window.prompt("Achievement or evidence title");if(!title?.trim())return;const note=window.prompt("Add a short note (optional)")||"";data.questEvidence=data.questEvidence||[];data.questEvidence.push({title:title.trim().slice(0,90),note:note.trim().slice(0,240),date:todayKey});save();render();toast("Evidence added");return}
 const addMain=e.target.closest("[data-add-main-milestone]");if(addMain)return;
 const mainToggle=e.target.closest("[data-main-milestone]");if(mainToggle)return
 const start=e.target.closest("[data-quest-start]");if(start){const q=data.sideQuests.find(x=>x.id===start.dataset.questStart);if(q){q.status="in-progress";q.updatedAt=new Date().toISOString();save();render();toast("Quest started")}return}
 const complete=e.target.closest("[data-quest-complete]");if(complete){const q=data.sideQuests.find(x=>x.id===complete.dataset.questComplete);if(q){q.status="completed";q.completedAt=new Date().toISOString();q.updatedAt=new Date().toISOString();save();render();toast("Quest completed")}return}
 const rate=e.target.closest("[data-quest-rate]");if(rate){const q=data.sideQuests.find(x=>x.id===rate.dataset.questRate);if(q){q.rating=Number(rate.dataset.rating);q.updatedAt=new Date().toISOString();save();render()}return}
 const cancelQuest=e.target.closest("[data-quest-cancel]");if(cancelQuest){const q=data.sideQuests.find(x=>x.id===cancelQuest.dataset.questCancel);if(q){q.status="cancelled";q.cancelledAt=new Date().toISOString();q.updatedAt=q.cancelledAt;save();render();toast("Quest cancelled")}return}
 const reschedule=e.target.closest("[data-quest-reschedule]");if(reschedule){const q=data.sideQuests.find(x=>x.id===reschedule.dataset.questReschedule);if(q){const nextDate=window.prompt("Choose a new date (YYYY-MM-DD):",q.date||todayKey);if(nextDate===null)return;if(!/^\\d{4}-\\d{2}-\\d{2}$/.test(nextDate)||Number.isNaN(new Date(nextDate+"T12:00:00").getTime())){toast("Enter a valid date");return}q.date=nextDate;q.status="planned";delete q.cancelledAt;q.updatedAt=new Date().toISOString();save();render();toast("Quest rescheduled")}return}
 const deleteQuest=e.target.closest("[data-quest-delete]");if(deleteQuest){const id=deleteQuest.dataset.questDelete,q=data.sideQuests.find(x=>x.id===id);if(q&&window.confirm('Delete "'+q.title.replace(/"/g,'\\"')+'" permanently?')){data.sideQuests=data.sideQuests.filter(x=>x.id!==id);save();render();toast("Quest deleted")}return}

 const close=e.target.closest("[data-close-modal]");if(close){$("modalRoot").innerHTML="";return} if(e.target.classList?.contains("modal-backdrop")){$("modalRoot").innerHTML="";return}
 const saveTarget=e.target.closest("[data-save-target]");if(saveTarget){const id=saveTarget.dataset.saveTarget,input=document.querySelector("[data-target-input=\""+id+"\"]"),value=Math.floor(Number(input?.value));if(!Number.isFinite(value)||value<1||value>100){toast("Choose a target from 1 to 100");return}data.targets[id]=data.targets[id]||{};data.targets[id].months=data.targets[id].months||{};data.targets[id].months[monthKey(today.getFullYear(),today.getMonth())]=value;save();render();toast("Target updated");return}
 const quickLog=e.target.closest("[data-log-activity]");if(quickLog){const id=quickLog.dataset.logActivity,value=Number(quickLog.dataset.logValue);data.activityDays[id]=data.activityDays[id]||{};if(value===0)delete data.activityDays[id][todayKey];else data.activityDays[id][todayKey]=value;save();render();return}
 const music=e.target.closest("[data-music-activity]");if(music){activityId=music.dataset.musicActivity;categoryId="music";viewYear=today.getFullYear();page="Activity";render();return}
 const profileAction=e.target.closest("[data-profile-action]");if(profileAction){if(profileAction.dataset.profileAction==="connect")$("connectBtn").click();else $("syncBtn").click();return}
 const questTab=e.target.closest("[data-quest-section]");if(questTab){questSection=questTab.dataset.questSection==="Side"?"Side":"Personal";page="Quests";render();window.scrollTo(0,0);return}
 const musicDelete=e.target.closest("[data-music-delete]");if(musicDelete){data.musicSongs=data.musicSongs.filter(song=>String(song.id)!==musicDelete.dataset.musicDelete);save();render();return}
 const spotifyConnect=e.target.closest("[data-spotify-connect]");if(spotifyConnect){spotifyStartConnect().catch(e=>toast(e.message));return}
 const spotifyDisconnect=e.target.closest("[data-spotify-disconnect]");if(spotifyDisconnect){spotifyClearTokens();render();toast("Spotify disconnected");return}
  
  const spotifyRemove=e.target.closest("[data-spotify-remove]");if(spotifyRemove){spotifyRemoveTrack(spotifyRemove.dataset.spotifyRemove);return}
 const spotifyAdd=e.target.closest("[data-spotify-add]");if(spotifyAdd){spotifyAddTrack(Number(spotifyAdd.dataset.spotifyAdd));return}
 const musicTab=e.target.closest("[data-music-tab]");if(musicTab){musicActiveTab=musicTab.dataset.musicTab;render();spotifyLoadMusicPlaylist(musicActiveTab,true);return}
  const p=e.target.closest("[data-page]");if(p){const target=p.dataset.page;page=target;render();window.scrollTo(0,0);return}
 const c=e.target.closest("[data-open-category]");if(c){categoryId=c.dataset.openCategory;const cat=categories.find(x=>x.id===categoryId);activityId=categoryId==="music"?"drums":cat.activities[0];page="Activity";viewYear=today.getFullYear();render();window.scrollTo(0,0);return}
 const a=e.target.closest("[data-open-activity]");if(a){activityId=a.dataset.openActivity;viewYear=today.getFullYear();page="Activity";render();window.scrollTo(0,0);return}
 const calendarLog=e.target.closest("[data-calendar-log]");if(calendarLog){e.preventDefault();const id=calendarLog.dataset.calendarLog,k=calendarLog.dataset.date;data.activityDays[id]=data.activityDays[id]||{};if(getStatus(id,k)===1)delete data.activityDays[id][k];else data.activityDays[id][k]=1;save();render();openModal(k);if(window.lucide?.createIcons)window.lucide.createIcons();return}
 const date=e.target.closest("[data-date]");if(date&&!date.disabled){openModal(date.dataset.date);return}
 const toggle=e.target.closest("[data-toggle-months]");if(toggle){showAllMonths=!showAllMonths;render();return}
 const tf=e.target.closest("[data-trick-filter]");if(tf){trickFilter=tf.dataset.trickFilter;render();return}
 const y=e.target.closest("[data-year]");if(y){viewYear=Math.max(2026,Math.min(today.getFullYear(),viewYear+Number(y.dataset.year)));showAllMonths=false;render()}
});
document.addEventListener("input",e=>{
 if(e.target.matches("[data-trick-search]")){trickSearch=e.target.value;const view=$("view"),cards=view.querySelectorAll(".trick-card"),q=trickSearch.toLowerCase();cards.forEach(card=>card.hidden=!card.querySelector("strong").textContent.toLowerCase().includes(q));const count=view.querySelector(".trick-library .section-head small");if(count)count.textContent=view.querySelectorAll(".trick-card:not([hidden])").length+" of "+tricks.length;return}
 if(e.target.matches("#spotifyTrackQuery")){clearTimeout(spotifySearchTimer);const query=e.target.value;spotifySearchTimer=setTimeout(()=>spotifySearchTracks(query),320);}
});
let cropImage=null,cropZoom=1,cropX=50,cropY=50;
function drawProfileCrop(){
 const canvas=$("profileCropCanvas");if(!canvas||!cropImage)return;
 const size=320,scale=Math.max(size/cropImage.naturalWidth,size/cropImage.naturalHeight)*cropZoom;
 const w=cropImage.naturalWidth*scale,hh=cropImage.naturalHeight*scale;
 const x=(size-w)*(cropX/100),y=(size-hh)*(cropY/100);
 const ctx=canvas.getContext("2d");ctx.clearRect(0,0,size,size);ctx.drawImage(cropImage,x,y,w,hh);
}
function openProfileCrop(src){
 cropImage=new Image();cropImage.onload=()=>{
  cropZoom=1;cropX=50;cropY=50;
  $("modalRoot").innerHTML='<div class="crop-backdrop"><section class="crop-dialog"><div class="crop-heading"><h2>Crop profile picture</h2><button type="button" data-crop-close aria-label="Close">×</button></div><p>Adjust the image until it fits the square.</p><canvas id="profileCropCanvas" width="320" height="320"></canvas><label>Zoom<input type="range" min="1" max="3" step="0.01" value="1" data-crop-zoom></label><label>Horizontal position<input type="range" min="0" max="100" value="50" data-crop-x></label><label>Vertical position<input type="range" min="0" max="100" value="50" data-crop-y></label><div class="crop-actions"><button type="button" data-crop-close>Cancel</button><button type="button" class="primary" data-crop-save>Save picture</button></div></section></div>';
  drawProfileCrop();
 };cropImage.onerror=()=>toast("Could not load that image");cropImage.src=src;
}
document.addEventListener("change",async e=>{
 const ti=e.target.closest("[data-checkin-time]");if(ti){const st=checkinStore(checkinType);st.record.answers[ti.dataset.checkinTime]=ti.value;st.record.skipped=(st.record.skipped||[]).filter(x=>x!==ti.dataset.checkinTime);save();return}
 const mi=e.target.closest("[data-checkin-media]");if(mi&&mi.files?.length){const st=checkinStore(checkinType),q=monthlyQuestions.find(x=>x.id===mi.dataset.checkinMedia);if(!q)return;const existing=st.record.answers[q.id]?.media||[],files=Array.from(mi.files).slice(0,Math.max(0,q.limit-existing.length));if(!files.length){toast("Photo limit reached");mi.value="";return}let pending=files.length;const added=[];files.forEach(file=>{if(file.size>12*1024*1024){toast("Choose files under 12 MB");pending--;return}const reader=new FileReader();reader.onload=()=>{const finish=src=>{added.push({src,type:file.type,name:file.name});pending--;if(!pending){st.record.answers[q.id]={media:[...existing,...added].slice(0,q.limit)};st.record.skipped=(st.record.skipped||[]).filter(x=>x!==q.id);save();render();toast("Progress record saved")}};if(file.type.startsWith("image/")){const img=new Image();img.onload=()=>{const canvas=document.createElement("canvas"),scale=Math.min(1,1000/Math.max(img.width,img.height));canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);canvas.getContext("2d").drawImage(img,0,0,canvas.width,canvas.height);finish(canvas.toDataURL("image/jpeg",0.68))};img.onerror=()=>finish(reader.result);img.src=reader.result}else if(file.size>900*1024){pending--;toast("Choose a video under 900 KB so it can be saved on this device")}else finish(reader.result)};reader.onerror=()=>{pending--;toast("Could not read a file")};reader.readAsDataURL(file)});mi.value="";return}
 const questPhoto=e.target.closest("[data-quest-photo]");
 if(questPhoto&&questPhoto.files?.[0]){
  const file=questPhoto.files[0],questId=questPhoto.dataset.questPhoto;
  if(!file.type.startsWith("image/")){toast("Choose an image file");return}
  if(file.size>12*1024*1024){toast("Choose an image under 12 MB");questPhoto.value="";return}
  const reader=new FileReader();reader.onload=()=>{const img=new Image();img.onload=()=>{const canvas=document.createElement("canvas"),scale=Math.min(1,900/Math.max(img.width,img.height));canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);canvas.getContext("2d").drawImage(img,0,0,canvas.width,canvas.height);const src=canvas.toDataURL("image/jpeg",0.72);data.questPhotos=data.questPhotos||{};data.questPhotos[questId]=data.questPhotos[questId]||[];data.questPhotos[questId].push({src,date:todayKey});save();render();toast("Progress photo saved")};img.onerror=()=>toast("Could not read that image");img.src=reader.result};reader.onerror=()=>toast("Could not read that image");reader.readAsDataURL(file);
 }
 const picture=e.target.closest("[data-profile-picture]");
 if(picture&&picture.files?.[0]){
  const file=picture.files[0];if(!file.type.startsWith("image/")){toast("Choose an image file");return}
  if(file.size>12*1024*1024){toast("Choose an image under 12 MB");picture.value="";return}
  const reader=new FileReader();reader.onload=()=>openProfileCrop(reader.result);reader.onerror=()=>toast("Could not read that image");reader.readAsDataURL(file);
 }
 const s=e.target.closest("[data-trick]");if(s){data.tricks[s.dataset.trick]=s.value;save();render()}
});
document.addEventListener("input",e=>{
 if(e.target.matches("[data-crop-zoom]"))cropZoom=Number(e.target.value);
 if(e.target.matches("[data-crop-x]"))cropX=Number(e.target.value);
 if(e.target.matches("[data-crop-y]"))cropY=Number(e.target.value);
 if(e.target.matches("[data-crop-zoom],[data-crop-x],[data-crop-y]"))drawProfileCrop();
});
$("connectBtn").addEventListener("click",handleSync);
async function checkForUpdates(){
 try{
  const registration=await navigator.serviceWorker?.getRegistration();
  if(registration)await registration.update().catch(()=>{});
  const url=new URL("./",location.href);
  url.searchParams.set("update_check",String(Date.now()));
  const response=await fetch(url.href,{cache:"no-store",headers:{"Cache-Control":"no-cache"}});
  if(!response.ok)return false;
  const latestHtml=await response.text();
  const latestDoc=new DOMParser().parseFromString(latestHtml,"text/html");
  const latestVersion=latestDoc.querySelector(".brand-version")?.textContent?.trim();
  const currentVersion=document.querySelector(".brand-version")?.textContent?.trim();
  return Boolean(latestVersion&&currentVersion&&latestVersion!==currentVersion);
 }catch(e){return false}
}
async function manualSync(){
 if(!navigator.onLine){toast("Connect to the internet to check for updates");return}
 if(syncBusy){toast("Sync is already running");return}
 toast("Checking for updates…");
 const syncTask=syncConfig?syncPull():Promise.resolve(null);
 const [ok,updateAvailable]=await Promise.all([syncTask,checkForUpdates()]);
 if(updateAvailable){
  toast("Update found — refreshing Side Quest…");
  setTimeout(()=>{const url=new URL("./",location.href);url.searchParams.set("refresh",String(Date.now()));location.replace(url.href)},700);
  return;
 }
 if(!syncConfig){toast("You're up to date — connect devices to sync progress");return}
 if(ok)toast(syncDirty?"Sync pending — will retry":"Sync complete");
 else toast("Update check complete — sync unavailable");
}
$("syncBtn").addEventListener("click",manualSync);
loadDS26().then(()=>{const view=$("view");view?.querySelector(".college-load-error")?.remove();if(page==="Overview")render();}).catch(e=>{console.error("DS26 schedule failed to load",e);const view=$("view");if(view&&page==="Overview")view.insertAdjacentHTML("afterbegin",'<div class="college-load-error" role="alert"><strong>College schedule could not load.</strong><span>Check your connection, then refresh the app. Your saved progress has not been changed.</span></div>')});

spotifySetupNativeCallback().finally(()=>spotifyHandleCallback()).finally(()=>{render();if(spotifyTokens())spotifyLoadAccount()});
if(syncConfig){syncReady=true;syncPull()}
window.addEventListener("online",()=>{if(syncConfig){syncReady=true;syncPull()}});
if("serviceWorker"in navigator)navigator.serviceWorker.register("./sw.js",{updateViaCache:"none"}).then(r=>r.update()).catch(()=>{});
})();
