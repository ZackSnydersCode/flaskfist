
if (!sessionStorage.getItem('lst_vst')) {
    document.querySelector('.anim').style.display = 'block';
    setTimeout(() => {
        sessionStorage.setItem('lst_vst', true);
        document.querySelector('.anim').style.display = 'none';
    }, 2500);
}
function showLoader() {
  const loader = document.getElementById('loader');
  loader.style.display = 'block';
}
function hideLoader() {
  const loader = document.getElementById('loader');
  loader.style.display = 'none';
}      
  const sr_br = document.querySelector('#search_br');
  const sr_btn = document.querySelector('.cncl_btn');
  const ldr = document.querySelector('.ld_anim');
  const content = document.querySelector('.tgs');
  sr_btn.addEventListener('click', () => {
    sr_br.value = '';
  });
  const rslt_div = document.querySelector('.result_widget');
  let is_nv_query = true;
  sr_br.addEventListener('input', debounce(ser_value, 300));
  let rslt_hldr;
  let pg_sz = 10;
  let pg_num = 1;
  
  function ser_value(event) {
    const val = sr_br.value.trim();
    is_nv_query = true;
    pg_num = 1;
    if (val !== '') {
      mak_req(val, pg_sz, pg_num);
    }
  }  
  function mak_req(quer, pg_sze, pg_numb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/searching_query?key=' + encodeURIComponent(quer) + '&pg_sz=' + pg_sze + '&pg_num=' + pg_numb, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    loader.style.display = 'block';
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        if(response.status.length != 0){
        rslt_hldr = [];
        rslt_hldr.push(response.status);
        create_pckt_data(response.status);
        hideLoader();     
             }
      else{
        showLoader();             }
    }
    };
    xhr.send();
  }
  
  function debounce(func, delay) {
    let timer;
    return function() {
      clearTimeout(timer);
      timer = setTimeout(func, delay);
    };
  }        
  function create_pckt_data(data) {
    if (is_nv_query !== false) {
      while (rslt_div.firstChild) {
        rslt_div.removeChild(rslt_div.firstChild);
        pg_num = 1;
      }
    }
    if (rslt_hldr.length !== 0) {
      for (let i = 0; i < data.length; i++) {
        if (rslt_hldr[0][i] !== undefined) {
          cret_rslt_pckg(rslt_hldr[0][i]);
        }
      }
    }
  }
  function cret_rslt_pckg(data) {
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
    const crter = document.createElement('span');
    crter.setAttribute('class','crter');
    const dte__ = document.createElement('span');
    dte__.setAttribute('class','dte');
    const about = document.createElement('div')
    about.setAttribute('class','abt');
    main_frm.appendChild(about);
    main_frm.setAttribute('id', `main_frm_${result}`);
    img_frm.setAttribute('id', `img_frm_${result}`);
    ttl_frm.setAttribute('id', `ttl_frm_${result}`);
    about.appendChild(img_frm);
    main_frm.appendChild(crter);
    main_frm.appendChild(dte__);
    about.appendChild(ttl_frm);
    crter.innerText = `${data.st_n}`;
    dte__.innerText = `${data.tD.substr(0,10)}`;
    rslt_div.appendChild(main_frm);
    const objectify_requested_data = {
      st_n: data.st_n,
      st_i: data.st_i,
      wv: data.wv,
      tTl: data.tTl,
      tOpEn: data.tOpEn,
      tD: data.tD
    };
    const stringify_obj = JSON.stringify(objectify_requested_data);
    main_frm.dataset.customeData = stringify_obj;
    set_values(data, main_frm.id, img_frm.id, ttl_frm.id);
  }
  function set_values(data, i1, i2, i3) {
    const frm_frm = document.querySelector(`#${i1}`);
    const frm_img = document.querySelector(`#${i2}`);
    const frm_ttl = document.querySelector(`#${i3}`);
    const send_to_query = encodeURIComponent(frm_frm.dataset.customeData);
    const query = `/requested_wave?data=${ send_to_query}`;
    if(data.tOpEn != ""){
      frm_img.innerHTML = `<img src='static/topens/${data.tOpEn}' class='topen_img'>`;
    }else{
      frm_img.innerHTML = `<img src='static/app_pics/no_topen_img.png' class='topen_img'>`;
    }
    frm_ttl.innerHTML = `<a href='${query}'>${data.tTl}</a>`;
  }   
  rslt_div.addEventListener('scroll', ld_mr_rslt); 
  function ld_mr_rslt() {
    if (rslt_div.scrollTop + rslt_div.clientHeight >= rslt_div.scrollHeight - 1) {
      mak_req(sr_br.value, pg_sz, pg_num = pg_num + 1);
      is_nv_query = false;
    }
  }  
  let cntrl_pag_num = 1;
  let cntrl_pag_sze = 20;
  document.addEventListener('DOMContentLoaded', rndm_wvs);
  function rndm_wvs() {
    brngs_tgs(cntrl_pag_num = cntrl_pag_num,cntrl_pag_sze = cntrl_pag_sze);
  }
  function brngs_tgs(p_n,p_z){
    const xhr = new XMLHttpRequest();
    const query = `/brngs_tgs?cntrl_pag_num=${p_n}&cntrl_pag_sze=${p_z}`;
    xhr.open('GET',query,true);
    showLoader();
    xhr.onreadystatechange = function(){
      if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200){
        const response = JSON.parse(xhr.responseText);
        if(response.trnd.length != 0){
          mk_tgs(response.trnd);
          mak_req(response.trnd[Math.floor(Math.random()*response.trnd.length)][0][0], 5, 1); 
           hideLoader();
      }
     }
    }
    xhr.send();
  }
  function mk_tgs(tgs_dta) { 
    for (let i = 0; i < tgs_dta.length; i++) {
      const id_str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_';
      let result = '';
      for (let i = 0; i < id_str.length; i++) {
        result += id_str.charAt(Math.floor(Math.random() * id_str.length));
      }
      const tgs_frm = document.createElement('li');
      const send_to_query = encodeURIComponent(JSON.stringify({st_n:tgs_dta[i]}));
      const query = `/plc_to_rqstd_sta?data=${send_to_query}`;

      tgs_frm.id = result;
      tgs_frm.setAttribute('class','nv_tg');
      tgs_frm.innerHTML = `<i class="fa-solid fa-record-vinyl"style="color: #ffffff;"></i><a href='${query}'style="color: #ffffff;">${tgs_dta[i]}</a>`;
      document.querySelector('.tgs').appendChild(tgs_frm);
    }
  }
  
const scrollButton = document.querySelector('.fred_cont');

scrollButton.addEventListener('click', () => { 
content.scrollBy({
left: content.offsetWidth,
behavior: 'smooth',
});
brngs_tgs(cntrl_pag_num = cntrl_pag_num + 1,cntrl_pag_sze);
});
