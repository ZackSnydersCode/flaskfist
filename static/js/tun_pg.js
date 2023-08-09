document.addEventListener('DOMContentLoaded',req_fr_tuns);
const lft_wgt = document.querySelector('.left_widget');
let pag_num = 1;
let pag_sze = 20;
function req_fr_tuns(){
    const xhr = new XMLHttpRequest();
    const query = '/ld_tns';
    xhr.open('GET',query,true);
    xhr.onreadystatechange = function(){
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200){
            const response = JSON.parse(xhr.responseText);
            if(response){
                cret_rslt_pckg(response);
            }
        }
    }
    xhr.send();
}
function mkntfy(path){
  const tne = new Audio();
  tne.src = path;
  tne.play();
}
function cret_rslt_pckg(data) {
    for (let k = 0; k <= data.length - 1; k++) {
      const id_str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890_';
      let result = '';
      for (let i = 0; i < id_str.length; i++) {
        result += id_str.charAt(Math.floor(Math.random() * id_str.length));
      }
      const main_frm = document.createElement('div');
      main_frm.setAttribute('class', 'main_frm');
      const img_frm = document.createElement('div');
      img_frm.setAttribute('class', 'img_frm');
      const ttl_frm = document.createElement('div');
      ttl_frm.setAttribute('class', 'ttl_frm');
      const dt_cont = document.createElement('span');
      dt_cont.className = 'dt_cont';
      const dlt_one = document.createElement('div');
      dlt_one.className = 'dlt_one';
      dlt_one.innerHTML = '<i class="fa-solid fa-trash rmvr" style="color: black;cursor:pointer;"></i>';
      main_frm.setAttribute('id', `main_frm_${k}_${result}`);
      dt_cont.setAttribute('id', `spn_${k}_${result}`);
      img_frm.setAttribute('id', `img_frm_${k}_${result}`);
      ttl_frm.setAttribute('id', `ttl_frm_${k}_${result}`);
      dlt_one.setAttribute('id',`cncl_one_${k}_${result}`);
      main_frm.appendChild(dt_cont);
      main_frm.appendChild(img_frm);
      main_frm.appendChild(ttl_frm);
      main_frm.appendChild(dlt_one);
      lft_wgt.appendChild(main_frm);
      dlt_one.addEventListener('click',dlt_one_svt_ht);
      const objectify_requested_data = {
        st_n:data[k].STATION
      };
      const dlt_pckt = {
        st_n:data[k].STATION 
      }
      const stringify_obj = JSON.stringify(objectify_requested_data);
      const stringify_dlt_pckt = JSON.stringify(dlt_pckt);
      dlt_one.dataset.customeData = stringify_dlt_pckt;
      main_frm.dataset.customeData = stringify_obj;
      set_values(data[k], main_frm.id, img_frm.id, ttl_frm.id, dt_cont.id,dlt_one.id);
    }
  }
  
  function set_values(data, i1, i2, i3, i4,i5) {
    const frm_frm = document.querySelector(`#${i1}`);
    const frm_img = document.querySelector(`#${i2}`);
    const frm_ttl = document.querySelector(`#${i3}`);
    const frm_dte = document.querySelector(`#${i4}`);
    const dlt_one_frm = document.querySelector(`#${i5}`);
    const send_to_query = encodeURIComponent(frm_frm.dataset.customeData);
    const query = `/plc_to_rqstd_sta?data=${send_to_query}`;
    if (data.PROFILE_IMAGE !== "no_image") {
      frm_img.innerHTML = `<a href='${query}'><img src='static/images/${data.PROFILE_IMAGE}' class='station_img'></a>`;
    } else {
      frm_img.innerHTML = `<a href='${query}'><img src='static/app_pics/no_topen_img.png' class='station_img'></a>`;
    }
    frm_ttl.innerText = `${data.STATION}`;
    frm_dte.innerHTML = '';
  }
 
  function dlt_one_svt_ht(){
    const dta = this.dataset.customeData;
    const slct_ths = document.querySelector(`#${this.id}`);
    const xhr = new XMLHttpRequest();
    const query = '/dlt_tund_sta?data=' + encodeURIComponent(dta);
    xhr.open('GET',query,true);
    xhr.onreadystatechange = function(){
      if(xhr.readyState == XMLHttpRequest.DONE && xhr.status);
      {
        const response = JSON.parse(xhr.responseText);
        mkntfy(response.path);
         lft_wgt.removeChild(slct_ths.parentNode);
      }
    }
    xhr.send();
  }
