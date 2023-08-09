
const sta_img = datas.STATION_IMAGE
let pag_num = 1
let pag_sze = 20
const ldr = document.querySelector('.ldr')
document.addEventListener('DOMContentLoaded',()=>{
  mk_req(pag_num,pag_sze)
})
function mk_req(pg_nm,pg_sz){
    const xhr = new XMLHttpRequest()
    const query = `/mk_req_fr_wvs?nm=${datas.STATION}&pag_num=${pg_nm}&pag_sze=${pg_sz}`;
    xhr.open('GET',query,true)
    ldr.style.display = 'block'
    xhr.onreadystatechange = function(){
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200){
            const response = JSON.parse(xhr.responseText)
            cret_rslt_pckg(response.pckt)
            ldr.style.display = 'none'
        } 
    }
    xhr.send()
}
let sb_cnt = document.querySelector('.sub_cont');
sb_cnt.addEventListener('scroll', () => {
  const threshold = 100; 

  const isScrolledToBottom = sb_cnt.scrollTop + sb_cnt.clientHeight >= sb_cnt.scrollHeight - threshold;

  if (isScrolledToBottom) {
    (pag_num++,pag_sze)
    pag_num++;
  }
});
const lwr_wgt = document.querySelector('.sub_cont');
const nvbr = document.querySelector('.sta_coins');
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
      const ttl_frm = document.createElement('span');
      ttl_frm.setAttribute('class', 'ttl_frm');
      const dt_cont = document.createElement('span');
      dt_cont.className = 'dt_cont';
      main_frm.setAttribute('id', `main_frm_${k}_${result}`);
      dt_cont.setAttribute('id', `spn_${k}_${result}`);
      img_frm.setAttribute('id', `img_frm_${k}_${result}`);
      ttl_frm.setAttribute('id', `ttl_frm_${k}_${result}`);
      main_frm.appendChild(img_frm);
      main_frm.appendChild(dt_cont);
      main_frm.appendChild(ttl_frm);
      lwr_wgt.appendChild(main_frm);
      const objectify_requested_data = {
        st_n: data[k].STATION_NAME,
        st_i: sta_img,
        wv: data[k].WAVE_FILE,
        tTl: data[k].WAVE_TITLE,
        tOpEn: data[k].WAVE_TOPEN,
        tD: data[k].TIME,

      };
      console.log(objectify_requested_data)
      const stringify_obj = JSON.stringify(objectify_requested_data);
      main_frm.dataset.customeData = stringify_obj;
      set_values(data[k], main_frm.id, img_frm.id, ttl_frm.id, dt_cont.id);
    }
  }
  function set_values(data, i1, i2, i3, i4) {
    const frm_frm = document.querySelector(`#${i1}`);
    const frm_img = document.querySelector(`#${i2}`);
    const frm_ttl = document.querySelector(`#${i3}`);
    const frm_dte = document.querySelector(`#${i4}`);
    const send_to_query = encodeURIComponent(frm_frm.dataset.customeData);
    const query = `/requested_wave?data=${ send_to_query}`;
    if (data.WAVE_TOPEN !== "") {
      frm_img.innerHTML = `<img src='static/topens/${data.WAVE_TOPEN}' class='station_img'>`;
    } else {
      frm_img.innerHTML = `<img src='static/app_pics/no_topen_img.png' class='station_img'>`;
    }
    frm_ttl.innerHTML = `<a href='${query}'>${data.WAVE_TITLE}</a>`;
    frm_dte.innerHTML = `${data.TIME.substr(0,10)}`;
  }
  document.addEventListener('DOMContentLoaded',brng_sta_tunneds)
  function brng_sta_tunneds(){
    const xhr = new XMLHttpRequest();
    const query = `/ld_sta_tuneds?nm=${datas.STATION}`;
    xhr.open('GET',query,true)
    xhr.onreadystatechange = function(){
      if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200){
         const response = JSON.parse(this.responseText);
         crt_tunned(response.data);
      }
    }
    xhr.send()
  }

  function crt_tunned(data){
    for(let k=0;k<=data.length-1;k++){
      const id_str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890_';
      let result = '';
      for (let i = 0; i < id_str.length-1; i++) {
        result += id_str.charAt(Math.floor(Math.random() * id_str.length));
      }
    const main_frm = document.createElement('div');
    main_frm.setAttribute('class','tnd_main_frm main_img');
    main_frm.id = `tnd_${result}`;
    nvbr.appendChild(main_frm);
    set_values_to_bbl(data[k],main_frm.id);
    }
  }
  function set_values_to_bbl(data,i1){
    function generateRandomColor() {
      const randomColor = '#' + (Math.floor(Math.random() * 0xAAAAAA) + 0x555555).toString(16);
      return randomColor;
    }
    const randomColor = generateRandomColor();
    const main_frm = document.querySelector(`#${i1}`);
    const dlt_pckt = {
      st_n:data.STATION 
    }
    const send_to_query = encodeURIComponent(JSON.stringify(dlt_pckt));
    const query = `/plc_to_rqstd_sta?data=${send_to_query}`;
    if(data.STATION_IMAGE != 'no_image'){
    main_frm.innerHTML = `<a href='${query}'><img src='static/images/${data.STATION_IMAGE}' class='brand main_img'></a>`;
  }
 else{
  main_frm.innerHTML = `<a href='${query}'><center><b><div class='brand main_img' style='color:#fff;background:${randomColor};'> ${data.STATION[0].toUpperCase()} </div></b><center></a>`;
 }
}