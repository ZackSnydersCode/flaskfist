let pag_num = 1;
let pag_sze = 20;

document.addEventListener('DOMContentLoaded', ld_usr_ht);
const ht_view = document.querySelector('.ht_view');
const ld_anim = document.querySelector('.ld_anim');
const sb_cnt = document.querySelector('.sub_cont')
const dlt_al = document.querySelector('.dlt_ht')
const bck_btn = document.querySelector('.bck_btn')
const Stp_svg = document.querySelector('.Stp_svg')
Stp_svg.addEventListener('click',strt_svg_ht)
Stp_svg.innerText = 'Start Saving'
bck_btn.addEventListener('click',()=>{
    window.history.back()
})
function ntfy(path){
    const ado = new Audio()
    ado.src = path
    ado.play()
}
function ld_usr_ht() {
  const xhr = new XMLHttpRequest();
  const  query = `/ld_ht?pag_num=${pag_num}&pag_sze=${pag_sze}`;
  xhr.open('GET', query, true);
  ld_anim.style.display = 'block';
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      if (response) {
        if(response){        
        if(response.status == 'true'){
        Stp_svg.addEventListener('click',stp_svg_ht)
        Stp_svg.innerText = 'Stop Saving'
        }else if(response.status == 'false'){
            Stp_svg.addEventListener('click',strt_svg_ht)
            Stp_svg.innerText = 'Start Saving'
        }
        cret_rslt_pckg(response);
        ld_anim.style.display = 'none';
      }
      }
    }
  };
  xhr.send();
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
    const ttl_frm = document.createElement('span');
    ttl_frm.setAttribute('class', 'ttl_frm');
    const dt_cont = document.createElement('span');
    dt_cont.className = 'dt_cont';
    const dlt_one = document.createElement('div');
    dlt_one.className = 'dlt_one';
    dlt_one.innerHTML = '<i class="fa-solid fa-xmark" style="color: #ffffff;"></i>';
    main_frm.setAttribute('id', `main_frm_${k}_${result}`);
    dt_cont.setAttribute('id', `spn_${k}_${result}`);
    img_frm.setAttribute('id', `img_frm_${k}_${result}`);
    ttl_frm.setAttribute('id', `ttl_frm_${k}_${result}`);
    dlt_one.setAttribute('id',`cncl_one_${k}_${result}`);
    main_frm.appendChild(dlt_one);
    main_frm.appendChild(img_frm);
    main_frm.appendChild(dt_cont);
    main_frm.appendChild(ttl_frm);
    ht_view.appendChild(main_frm);
    dlt_one.addEventListener('click',dlt_one_svt_ht);
    const objectify_requested_data = {
      st_n: data[k].STATION_NAME,
      wv: data[k].WAVE,
      tTl: data[k].TITLE,
      tOpEn: data[k].TOPEN,
      tD: data[k].DATE
    };
    const dlt_pckt = {
      VIEWER:data[k].VIEWER,
      TITLE:data[k].TITLE,
      VIEWED_STATION:data[k].STATION_NAME,
      VIEW_DATE:data[k].VIEW_DATE
    }
    const stringify_obj = JSON.stringify(objectify_requested_data);
    const stringify_dlt_pckt = JSON.stringify(dlt_pckt);
    dlt_one.dataset.customeData = stringify_dlt_pckt;
    main_frm.dataset.customData = stringify_obj;
    set_values(data[k], main_frm.id, img_frm.id, ttl_frm.id, dt_cont.id,dlt_one.id);
  }
}

function set_values(data, i1, i2, i3, i4,i5) {
  const frm_frm = document.querySelector(`#${i1}`);
  const frm_img = document.querySelector(`#${i2}`);
  const frm_ttl = document.querySelector(`#${i3}`);
  const frm_dte = document.querySelector(`#${i4}`);
  const dlt_one_frm = document.querySelector(`#${i5}`)
  const send_to_query = encodeURIComponent(frm_frm.dataset.customData);
  const query = `/requested_wave?data=${send_to_query}`;
  if (data.TOPEN !== "") {
    frm_img.innerHTML = `<a href='${query}'><img src='static/topens/${data.TOPEN}' class='topen_img'></a>`;
  } else {
    frm_img.innerHTML = `<a href='${query}'><img src='static/app_pics/no_topen_img.png' class='topen_img'></a>`;
  }
  frm_ttl.innerText = `${data.TITLE}`;
  frm_dte.innerText = `${data.VIEW_DATE}`;
}

ht_view.addEventListener('scroll', () => {
  const scrollPosition = ht_view.scrollTop + ht_view.clientHeight;
  const scrollHeight = ht_view.scrollHeight;
  const buffer = 1;

  if (scrollPosition >= scrollHeight - buffer) {
    pag_num = pag_num + 1;
    ld_usr_ht();
  }
});
  dlt_al.addEventListener('click',dlet_al_ht)
  function dlet_al_ht(){
    const cnfm = confirm('Are You Sure?');
    if(cnfm){
    const xhr = new XMLHttpRequest();
    const query = '/dlt_al_ht';
    xhr.open('GET',query,true);
    xhr.onreadystatechange = function(){
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200){
            const response = JSON.parse(this.responseText);
            var i = 0;
            var childNodesArray = Array.from(ht_view.childNodes);
            for (var i = 0; i < childNodesArray.length; i++) {
              var node = childNodesArray[i];
              ht_view.removeChild(node);
            }
            
        }
    }
    xhr.send();
   }
  }
  function stp_svg_ht(){
    const xhr = new XMLHttpRequest();
    const query = '/stp_svg_ht';
    xhr.open('GET',query,true);
    xhr.onreadystatechange = function(){
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200){
            const response = JSON.parse(xhr.responseText);
            ntfy(response.path);
            Stp_svg.removeEventListener('click',stp_svg_ht);
            Stp_svg.addEventListener('click',strt_svg_ht);
            Stp_svg.innerText = 'Start Saving';
        }
    }
    xhr.send();
  }
  function strt_svg_ht(){
    const xhr = new XMLHttpRequest();
    const query = '/strt_svg_ht';
    xhr.open('GET',query,true);
    xhr.onreadystatechange = function(){
      if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200){
        const response = JSON.parse(xhr.responseText);
        ntfy(response.path);
        Stp_svg.removeEventListener('click',strt_svg_ht);
        Stp_svg.addEventListener('click',stp_svg_ht);
        Stp_svg.innerText = 'Stop Saving';
      }
    }
    xhr.send();
  }
  function dlt_one_svt_ht(){
    const data = (this.dataset.customeData);
    const rmv_frm_id = ((this.parentNode).id);
    const rmv_frm = document.querySelector(`#${rmv_frm_id}`);
    const xhr = new XMLHttpRequest();
    const send_to_query = encodeURIComponent(data);
    const query = `/dlt_one_ht_frm?frm=${send_to_query}` ;
    xhr.open('GET',query,true);
    ld_anim.style.display = 'block';
    xhr.onreadystatechange = function(){
      if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200){
        const response = JSON.parse(xhr.responseText);
        ntfy(response.path);
        ld_anim.style.display = 'none';
        ht_view.removeChild(rmv_frm);
      }
    }
    xhr.send();
  }