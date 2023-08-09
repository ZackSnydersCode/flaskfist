document.querySelector('.stat_icon').addEventListener('click',()=>{
  window.location.href = '/take_to_stat_graph';
})
document.querySelector('.tat_icon').addEventListener('click',()=>{
  window.location.href = '/take_to_stat_com';
})
document.querySelector('.create_wave_icon').addEventListener('click',()=>{
window.location.href = '/take_to_cr_wv';
})
document.querySelector('.frquented_wav_icon').addEventListener('click',()=>{
  window.location.href = '/take_to_broad_wav_';
})
document.querySelector('.profile_settings_icon').addEventListener('click',()=>{
  window.location.href = '/take_sta_set_';
})
const ta_contxt_of_wav = document.querySelector('._take_to_waves_holder')
ta_contxt_of_wav.addEventListener('click',()=>{
   window.location.href = '/';
})
let pag_num = 1; 
let pag_sze = 20; 
let isLoadingComments = false;
const cmt_view = document.querySelector('.miodbjczzz');
if(sts != true){
  cmt_view.innerHTML = `<center><img src='static/app_pics/no_cmts_2.png' class='no_cmt'><br><b>You haven't Commented yet.</b></center>`;
}
function mk_cmts(pgn) {
    if (isLoadingComments) return;
    isLoadingComments = true;
    const xhr = new XMLHttpRequest();
    const query =
      "/ld_prof_cmts?station=" +
      key +
      "&pag_num=" +
      pgn +
      "&pag_sze=" +
      pag_sze;
    xhr.open("GET", query, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          if(response.data.length != 0){
            show_cmts(response.data);
          }else {
          }
        } else {
          console.error("Request failed with status", xhr.status);
        }
        isLoadingComments = false;
      }
    };
    xhr.send();
  }
  function show_cmts(cmt_data) {
    for (let i = 0; i <= cmt_data.length-1; i++) {
      const rand_str =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890_";
      let result = "";
      for (let j = 0; j <= rand_str.length; j++) {
        const rand = Math.floor(Math.random() * cmt_data.length);
        result += rand_str.charAt(Math.floor(rand));
      }
      const main_cmt_frm = document.createElement("div");
      main_cmt_frm.className = "main_cmt_frm";
      const cmt_prof_frm = document.createElement("div");
      cmt_prof_frm.className = "cmt_prof_frm";
      const cmt_cmtr_frm = document.createElement("div");
      cmt_cmtr_frm.className = "cmt_cmtr_frm";
      const cmt_dat_frm = document.createElement("div");
      cmt_dat_frm.className = "cmt_dat_frm";
      const dlt_btn = document.createElement('div');
      dlt_btn.className = 'dlt_btn';
      dlt_btn.id = `dlt_btn_${i}_${result}`;
      dlt_btn.innerText = 'Delete';
      const plly_cmts = document.createElement('div');
      plly_cmts.className = 'plly_cmts';
      plly_cmts.innerHTML = '<i class="fa-solid fa-volume-off ply_" style="color: #ffffff;"></i>';
      main_cmt_frm.appendChild(cmt_prof_frm);
      main_cmt_frm.appendChild(cmt_cmtr_frm);
      main_cmt_frm.appendChild(cmt_dat_frm);
      main_cmt_frm.appendChild(dlt_btn);
      main_cmt_frm.appendChild(plly_cmts);
      cmt_view.appendChild(main_cmt_frm);
      main_cmt_frm.id = `main_frm_${i}_${result}`;
      cmt_prof_frm.id = `cmt_prof_img_${i}_${result}`;
      cmt_cmtr_frm.id = `cmt_cmtr_${i}_${result}`;
      cmt_dat_frm.id = `cmt_dat_frm_${i}_${result}`;
      plly_cmts.id = `cmt_plyer_btn_${i}_${result}`;
      dlt_btn.addEventListener('click',dlt_wav);
      set_data_to_cmts(
        cmt_data[i],
        main_cmt_frm.id,
        cmt_prof_frm.id,
        cmt_cmtr_frm.id,
        cmt_dat_frm.id,
        plly_cmts.id,
        dlt_btn.id
      );
    }
  }
  
  function set_data_to_cmts(cmt_ifo, i1, i2, i3, i4,i5,i6) {
    console.log(cmt_ifo.WAVE_DATE)
    const main_frm = document.querySelector(`#${i1}`);
    const cmt_prof = document.querySelector(`#${i2}`);
    const cmt_cmtr = document.querySelector(`#${i3}`);
    const cmt_dat = document.querySelector(`#${i4}`);
    const plly_cmmt = document.querySelector(`#${i5}`);
    const dlt_btn_ = document.querySelector(`#${i6}`);
    const wv_obj = {
    st_n:cmt_ifo.STATION_IMAGE.STATION,
    st_i:cmt_ifo.STATION_IMAGE.STATION_IMAGE,
    wv:cmt_ifo.STATION_IMAGE.WAVE_FILE,
    tTl:cmt_ifo.STATION_IMAGE.WAVE_TITLE,
    tOpEn:cmt_ifo.STATION_IMAGE.WAVE_TOPEN,
    tD:cmt_ifo.WAVE_DATE
    }
    console.log(wv_obj)
    const query = `/requested_wave?data=${encodeURIComponent(JSON.stringify(wv_obj))}`;
    cmt_prof.innerHTML = `<a href='${query}'><img src='static/topens/${cmt_ifo.STATION_IMAGE.WAVE_TOPEN}' class='cmt_prof_frm'/></a>`;
    cmt_cmtr.innerText = `${cmt_ifo.STATION_IMAGE.WAVE_TITLE}`;
    cmt_dat.innerText = `${cmt_ifo.DATE}`;
    const cmt_obj_dta = {
      COMMENT:cmt_ifo.COMMENT,
      COMMENTED_TO:cmt_ifo.COMMENTED_TO,
      TITLE:cmt_ifo.STATION_IMAGE.WAVE_TITLE,
      DATE:cmt_ifo.DATE,
      COMMENTER:cmt_ifo.COMMENTER
    }
    console.log(cmt_obj_dta)
    plly_cmmt.dataset.customeData = JSON.stringify(cmt_obj_dta);
    dlt_btn_.dataset.customeData = JSON.stringify(cmt_obj_dta);
    plly_cmmt.addEventListener("click", ply_cmt);
  }
  
  let currentlyPlayingAudio = null;
  let prev_id = [];
  let cmt_tune;
  const ne_blck = document.querySelector('._sta_box_');
  let threshold = 100;
  
  ne_blck.addEventListener('scroll', () => {
    const scrollableHeight = ne_blck.scrollHeight - ne_blck.clientHeight;
    const scrolledDistance = ne_blck.scrollTop;
  
    if (scrollableHeight - scrolledDistance <= threshold) {
      mk_cmts(pag_num = pag_num + 1);
    }
  }); 
  
  mk_cmts(pag_num);
  function ply_cmt() {
    const ply = document.querySelector(`#${this.id}`);
    if (currentlyPlayingAudio && !currentlyPlayingAudio.paused) {
      currentlyPlayingAudio.pause();
      currentlyPlayingAudio = null;
        if (prev_id.length > 0) {
        let prevCommentId = prev_id.pop();
        let prevComment = document.querySelector(`#${prevCommentId}`);
        prevComment.innerHTML = '<i class="fa-solid fa-volume-off ply_" style="color: #ffffff;"></i>';
      }
    }
    cmt_tune = new Audio();
    cmt_tune.src = `static/comments/${JSON.parse(this.dataset.customeData).COMMENT}`;
    cmt_tune.play();
      ply.innerHTML = '<i class="fa-solid fa-volume-high ply_" style="color: #ffffff;"></i>';
      prev_id.push(this.id);
    currentlyPlayingAudio = cmt_tune;
    cmt_tune.addEventListener("ended", function () {
      currentlyPlayingAudio = null;
        let currentIndex = prev_id.indexOf(ply.id);
      if (currentIndex !== -1) {
        prev_id.splice(currentIndex, 1);
      }
        ply.innerHTML = '<i class="fa-solid fa-volume-off ply_" style="color: #ffffff;"></i>';
    });
    document.querySelector('._sta_box_').addEventListener('scroll',()=>{
      cmt_tune.pause();
      ply.innerHTML = '<i class="fa-solid fa-volume-off ply_" style="color: #ffffff;"></i>';
    })
  }
  
  
  function dlt_wav() {
    const this_id = this.id;
    const parentElement = document.querySelector(`#${this_id}`).parentNode;
    const dlt_ths = document.querySelector(`#${this_id}`);
    const this_select = dlt_ths.dataset.customeData;
    const parsed = JSON.parse(this_select);
   console.log(parsed)
   const new_dlt_pckt = {
      COMMENT:parsed.COMMENT,
      COMMENTED_TO:parsed.COMMENTED_TO,
      TITLE:parsed.TITLE,
      DATE:parsed.DATE,
      COMMENTER:parsed.COMMENTER
    };
  let user_cnfrmtion = confirm('Are you sure your?');
    if(user_cnfrmtion == true){
    const xhr = new XMLHttpRequest();
    const query = '/dlt_cmtXXX';
    const payload = encodeURIComponent(JSON.stringify(new_dlt_pckt));
    const fullQuery = `${query}?data=${payload}`;
  
    xhr.open('GET', fullQuery, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        console.log(response.msg);
        cmt_view.removeChild(parentElement);
      }
    };
    xhr.send();
    }
  }
