const ta_contxt_of_wav = document.querySelector('._take_to_waves_holder')
const univ_hldr_vw = document.querySelector('.miodbjczzz');
const univ_hldr_lv = document.querySelector('.miodbjczzz');
const scrl_bse = document.querySelector('.miodbjczzz');
let existingBtn;
ta_contxt_of_wav.addEventListener('click',()=>{
   window.location.href = '/';
})
document.querySelector('.create_wave_icon').addEventListener('click',()=>{
    window.location.href = '/take_to_cr_wv';
})
document.querySelector('.tat_icon').addEventListener('click',()=>{
    window.location.href = '/take_to_stat_com';
})
document.querySelector('.comment_icon').addEventListener('click',()=>{
    window.location.href = '/take_to_stat_com';
})
document.querySelector('.frquented_wav_icon').addEventListener('click',()=>{
    window.location.href = '/take_to_broad_wav_';
})
document.querySelector('.profile_settings_icon').addEventListener('click',()=>{
    window.location.href = '/take_sta_set_';
})
let pag_num = 1;
let pag_sze = 10;
document.addEventListener('DOMContentLoaded',()=>{
    ld_lkes(pag_num);
})
function ld_lkes(pg_n) {
    const xhr = new XMLHttpRequest();
    const query = `/ld_lkes_dte?pag_num=${pg_n}&pag_sze=${pag_sze}`;
    xhr.open('POST', query, true);
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            const response = JSON.parse(xhr.responseText);
            if (response.view.length != 0) {                 
                crt_lnks_lv(response.love);
                crt_lnks_vw(response.view);
            }
        }
    };
    xhr.send();
}
document.addEventListener('DOMContentLoaded', function() {
    const xhr = new XMLHttpRequest();
    const query = `/ld_stats`;
    xhr.open('POST', query, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            const response = JSON.parse(xhr.responseText);
            if (response.stats != 'no_stats') {
                crt_stats(response.stats);
            }else {
                shw_msg();
            }
        }
    };
    xhr.send();

  });
 function shw_msg(){
    scrl_bse.innerHTML = `<center><img src='static/app_pics/no_stat.png' class='no_mrn' height='auto' width='30%' style='margin:none;padding:none;'><br><br><b>You haven't any stats.</b></center>`;
 }
function crt_stats(v) {
    const sts_grph_bse = document.querySelector('.my_stats').getContext('2d');
    sts_grph_bse.height = 100
    const data = {
      labels: ['Views', 'Likes' , 'Tunes'],
      datasets: [{
        label:'On Whole Station',
        data: [v[0], v[1], v[2]],
        backgroundColor:['skyblue','rgb(253, 74, 134)','orange']
      }]
    };
  
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      height: 50,
      width: 50,
      plugins:{
        legend:{
            labels:{
                color:'#000000'
            }
        }
      }
    };
    const pieChart = new Chart(sts_grph_bse, {
      type: 'doughnut',
      data: data,
      options: options, 
     
    });
  }
 function crt_lnks_lv(data) {
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
     const ttl = document.createElement('div');
     ttl.className = 'ttl';
     ttl.id = `ttl_${i}_${rslt}`;
     const lv = document.createElement('div')
     lv.className = 'lv'
     lv.innerHTML = '<i class="fa-solid fa-heart lv_ks"></i>'
     main_frm_.appendChild(tpn);
     main_frm_.appendChild(ttl);
     main_frm_.appendChild(lv)
     univ_hldr_lv.appendChild(main_frm_);
     set_vals_lv(data[i],main_frm_.id,tpn.id,ttl.id);
   }
 }
       function set_vals_lv(data,i1,i2,i3,i4){
           const main_frm = document.querySelector(`#${i1}`);
           const tpn  =document.querySelector(`#${i2}`);
           const ttl = document.querySelector(`#${i3}`);
           const query = `/station_profile?_search=${data.LOVED_FROM}`;
           if(data.ROMEO_PIC != 'no_image'){
               tpn.innerHTML = `<a href='${query}' class='lnk'><img src='static/images/${data.ROMEO_PIC}' class='wav_tpn'></a>`;
           }else{
               tpn.innerHTML = `<a href='${query}' class='lnk'><img src='static/app_pics/no_pro_pic.png' class='wav_tpn'></a>`;
           }
           ttl.innerHTML = `<b>${data.LOVED_FROM}</b> : ${data.LOVED_TITLE}`;
       }
  function crt_lnks_vw(data) {
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
  
      const ttl = document.createElement('div');
      ttl.className = 'ttl';
      ttl.id = `ttl_${i}_${rslt}`;
      const vw = document.createElement('div');
      vw.className = 'vw';
      vw.innerHTML = '<i class="fa-solid fa-eye vw_ey"></i>';
      main_frm_.appendChild(tpn);
      main_frm_.appendChild(ttl);
      main_frm_.appendChild(vw);
      univ_hldr_vw.appendChild(main_frm_);
      set_vals_vw(data[i],main_frm_.id,tpn.id,ttl.id);
    }
  }
        function set_vals_vw(data,i1,i2,i3,i4){
            const main_frm = document.querySelector(`#${i1}`);
            const tpn  =document.querySelector(`#${i2}`);
            const ttl = document.querySelector(`#${i3}`);
            const send_to_query = encodeURIComponent(main_frm.dataset.customeData);
            const query = `/station_profile?_search=${data.VIEWER}`;
            if(data.VIEWER_PIC != 'no_image'){
                tpn.innerHTML = `<a href='${query}' class='lnk'><img src='static/images/${data.VIEWER_PIC}' class='wav_tpn'></a>`;
            }else{
                tpn.innerHTML = `<a href='${query}' class='lnk'><img src='static/app_pics/no_pro_pic.png' class='wav_tpn'></a>`;

            }
            ttl.innerHTML = `<b>${data.VIEWER}</b> : ${data.TITLE}`;
        }
        const scrl_slct = document.querySelector('._sta_box_');
        let isScrolling = false;
        
        function handleScroll() {
          if (!isScrolling) {
            isScrolling = true;
            const scrollTop = scrl_slct.scrollTop;
            const scrollHeight = scrl_slct.scrollHeight;
            const clientHeight = scrl_slct.clientHeight;
            const scrollThreshold = 5;    
            if (scrollTop + clientHeight >= scrollHeight - scrollThreshold) {
                ld_lkes(pag_num = pag_num + 1);
            }
            isScrolling = false;
          }
        }
        scrl_slct.addEventListener('scroll', handleScroll);
        function handleResize() {
          scrl_slct.removeEventListener('scroll', handleScroll);
          scrl_slct.addEventListener('scroll', handleScroll);
        }
        window.addEventListener('resize', handleResize);
        