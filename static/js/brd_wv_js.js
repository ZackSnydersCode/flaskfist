const ta_contxt_of_wav = document.querySelector('._take_to_waves_holder')
ta_contxt_of_wav.addEventListener('click',()=>{
   window.location.href = '/';
})
document.querySelector('.stat_icon').addEventListener('click',()=>{
   window.location.href = '/take_to_stat_graph';
})
document.querySelector('.tat_icon').addEventListener('click',()=>{
   window.location.href = '/take_to_stat_com';
})
document.querySelector('.comment_icon').addEventListener('click',()=>{
   window.location.href = '/take_to_stat_com';
})
document.querySelector('.create_wave_icon').addEventListener('click',()=>{
   window.location.href = '/take_to_cr_wv';
})
document.querySelector('.profile_settings_icon').addEventListener('click',()=>{
   window.location.href = '/take_sta_set_';
})
const univ_hldr = document.querySelector('.miodbjczzz');
let pg_num = 1;
let pg_sz = 20;

document.addEventListener('DOMContentLoaded',mk_req_cal);
function mk_req_cal(){
   mk_req(pg_num);
}
function mk_req(pg_n){
  const xhr = new XMLHttpRequest();
  const query = `/ld_usr_wavs?pg_num=${pg_n}&pg_sz=${pg_sz}`;
  xhr.open('GET', query, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      if (response.length != 0) {
        crt_lnks(response);
      }else{
       univ_hldr.innerHTML = `<center><img src='static/app_pics/no_wv.png' class='no_wv' style='padding:none;'><br><br><b>You Haven't Any Wave.</b></center>`;
      }
    }
  };

  xhr.send();
};
  univ_hldr.addEventListener('scroll',()=>{
   mk_req(pg_num = pg_num + 1);
  })
 function crt_lnks(data) {
   for (let i = 0; i < data.length; i++) {
       let rslt = '';
     const lnks_id_gnrtr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890_';
     for (let k = 0; k <= lnks_id_gnrtr.length; k++) {
       rslt += lnks_id_gnrtr.charAt(Math.floor(Math.random()*k));
     }
 
     const main_frm_ = document.createElement('div');
     main_frm_.className = 'main_frm';
     main_frm_.id = `main_frm_${i}_${rslt}`;
 
     const tpn = document.createElement('div');
     tpn.className = 'tpn';
     tpn.id = `tpn_${i}_${rslt}`;
 
     const ttl = document.createElement('span');
     ttl.className = 'ttl';
     ttl.id = `ttl_${i}_${rslt}`;
 
     const dlt_btn = document.createElement('div');
     dlt_btn.className = 'dlt_btn';
     dlt_btn.id = `dlt_btn_${i}_${rslt}`;
 
     const updt_btn = document.createElement('div');
     updt_btn.className = 'updt_btn';
     updt_btn.id = `updt_btn_${i}_${rslt}`;

     const dte_cont = document.createElement('span');
     dte_cont.className = 'dte_cont';
     dte_cont.innerText = data[i].TIME.substring(0, 10);
 
     main_frm_.appendChild(tpn);
     main_frm_.appendChild(ttl);
     main_frm_.appendChild(dlt_btn);
     main_frm_.appendChild(updt_btn);
     main_frm_.appendChild(dte_cont);
     const objectify_requested_data = {
       st_n: data[i].STATION_NAME,
       st_i: data[i].STATION_IMAGE,
       wv: data[i].WAVE_FILE,
       tTl: data[i].WAVE_TITLE,
       tOpEn: data[i].WAVE_TOPEN, 
       tD: data[i].TIME
     };
     main_frm_.dataset.customeData = JSON.stringify(objectify_requested_data);
     univ_hldr.appendChild(main_frm_);
     dlt_btn.addEventListener('click',dlt_wav);
     dlt_btn.innerText = 'Delete';
     const updt_identity = document.querySelector(`#${updt_btn.id}`);
     const query = '/updt_new_wav?path=' + encodeURIComponent(JSON.stringify(objectify_requested_data));
     console.log(objectify_requested_data);
     updt_identity.innerHTML = `<a href='${query}'>Update</a>`;
     set_vals(data[i],main_frm_.id,tpn.id,ttl.id);
   }
 }
       function set_vals(data,i1,i2,i3,i4){
           const main_frm = document.querySelector(`#${i1}`);
           const tpn  =document.querySelector(`#${i2}`);
           const ttl = document.querySelector(`#${i3}`);
           const send_to_query = encodeURIComponent(main_frm.dataset.customeData);
           const query = `/requested_wave?data=${ send_to_query}`;
           if(data.WAVE_TOPEN != ""){
               console.log('this is',data.WAVE_TOPEN);
               tpn.innerHTML = `<img src='static/topens/${data.WAVE_TOPEN}' class='wav_tpn'>`;
           }else{
               tpn.innerHTML = `<img src='static/app_pics/no_topen_img.png' class='wav_tpn'>`;

           }
           ttl.innerHTML = `<a href='${query}' class='lnk'>${data.WAVE_TITLE}</a>`;
       }
       function dlt_wav() {
           const this_id = this.id;
           const parentElement = document.querySelector(`#${this_id}`).parentNode;
           const this_select = parentElement.dataset.customeData;
           const parsed = JSON.parse(this_select);
          
           const new_dlt_pckt = {
             st_n: parsed.st_n,
             st_i: parsed.st_i,
             wv: parsed.wv,
             tTl: parsed.tTl,
             tOpEn: parsed.tOpEn,
             tD: parsed.tD
           };
           let user_cnfrmtion = confirm('Are you sure your wave cannot be recovered?');
           if(user_cnfrmtion == true){
           const xhr = new XMLHttpRequest();
           const query = '/dlt_wavXXX';
           const payload = encodeURIComponent(JSON.stringify(new_dlt_pckt));
           const fullQuery = `${query}?data=${payload}`;
         
           xhr.open('GET', fullQuery, true);
           xhr.onreadystatechange = function() {
             if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
               const response = JSON.parse(xhr.responseText);
               console.log(response.msg);
               univ_hldr.removeChild(parentElement);
             }
           };
           xhr.send();
           }
         }