const cmt_view = document.querySelector('.cmt_view');
let pag_num = 1;
let pag_sze = 20;
let isLoadingComments; 
const l_ding = document.querySelector('.ldr');
function mk_cmts(pgn) {
  const xhr = new XMLHttpRequest();
  const query =
    "/ld_prof_cmts?station=" +
    user_data.STATION +
    "&pag_num=" +
    pgn +
    "&pag_sze=" +
    pag_sze;
  xhr.open("GET", query, true);
  l_ding.style.display = 'block';
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        if(response.data){
          show_cmts(response);
          l_ding.style.display = 'none';
        }
      }
    }
  };
  xhr.send();
}
document.addEventListener('DOMContentLoaded', function() {
  mk_cmts(pag_num)
});
function show_cmts(cmt_data) {
  const rand_str ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890_";
let result = "";
for (let j = 0; j < rand_str.length ; j++) {
  const rand = Math.floor(Math.random() * j);
  result += rand_str.charAt(Math.floor(rand));
}
  for (let i = cmt_data.data.length - 1; i >= 0; i--) {
    const main_cmt_frm = document.createElement("div");
    main_cmt_frm.className = "main_cmt_frm";
    const cmt_prof_frm = document.createElement("div");
    cmt_prof_frm.className = "cmt_prof_frm";
    const cmt_cmtr_frm = document.createElement("div");
    cmt_cmtr_frm.className = "cmt_cmtr_frm";
    const cmt_dat_frm = document.createElement("div");
    cmt_dat_frm.className = "cmt_dat_frm";
    main_cmt_frm.appendChild(cmt_prof_frm);
    main_cmt_frm.appendChild(cmt_cmtr_frm);
    main_cmt_frm.appendChild(cmt_dat_frm);
    cmt_view.appendChild(main_cmt_frm);
    main_cmt_frm.id = `main_frm_${i}_${result}`;
    cmt_prof_frm.id = `cmt_prof_img_${i}_${result}`;
    cmt_cmtr_frm.id = `cmt_cmtr_${i}_${result}`;
    cmt_dat_frm.id = `cmt_dat_frm_${i}_${result}`;
    set_data_to_cmts(
      cmt_data.data[i],
      main_cmt_frm.id,
      cmt_prof_frm.id,
      cmt_cmtr_frm.id,
      cmt_dat_frm.id
    );
  }
}

function set_data_to_cmts(cmt_ifo, i1, i2, i3, i4) {
  const main_frm = document.querySelector(`#${i1}`);
  const cmt_prof = document.querySelector(`#${i2}`);
  const cmt_cmtr = document.querySelector(`#${i3}`);
  const cmt_dat = document.querySelector(`#${i4}`);
  const wv_obj = {
    st_n:cmt_ifo.STATION_IMAGE.STATION,
    st_i:cmt_ifo.STATION_IMAGE.STATION_IMAGE,
    wv:cmt_ifo.STATION_IMAGE.WAVE_FILE,
    tTl:cmt_ifo.STATION_IMAGE.WAVE_TITLE,
    tOpEn:cmt_ifo.STATION_IMAGE.WAVE_TOPEN,
    tD:cmt_ifo.WAVE_DATE
    }
    const query = `/requested_wave?data=${encodeURIComponent(JSON.stringify(wv_obj))}`;
    cmt_prof.innerHTML = `<a href='${query}'><img src='static/topens/${cmt_ifo.STATION_IMAGE.WAVE_TOPEN}' class='cmt_prof_frm'/></a>`;
  cmt_cmtr.innerText = `${cmt_ifo.STATION_IMAGE.WAVE_TITLE}`;
  cmt_dat.innerText = `${cmt_ifo.DATE}`;
  main_frm.dataset.customeData = JSON.stringify(cmt_ifo.COMMENT);
  main_frm.addEventListener("click", ply_cmt);
}
 
let currentlyPlayingAudio = null;
let prev_id = [];
let prev_clm;
let cmt_tune;
cmt_view.addEventListener('scroll', function() {
  let scrollableHeight = cmt_view.scrollHeight - cmt_view.clientHeight;
  if (cmt_view.scrollTop >= scrollableHeight - 1) {
    pag_num = pag_num + 1;
    mk_cmts(pag_num);
    alert()
  }
});


function ply_cmt() {
  if (currentlyPlayingAudio && !currentlyPlayingAudio.paused) {
    currentlyPlayingAudio.pause();
    currentlyPlayingAudio = null;
    prev_clm.classList.remove("animate_frm");
    return;
  }

  if (currentlyPlayingAudio) {
    currentlyPlayingAudio.pause();
    prev_clm.classList.remove("animate_frm");
  }
 window.addEventListener('scroll',()=>{
  if(currentlyPlayingAudio){
  currentlyPlayingAudio.pause();
  prev_clm.classList.remove("animate_frm");
  }
 })
  cmt_tune = new Audio();
  cmt_tune.src = `static/comments/${JSON.parse(this.dataset.customeData)}`;
  cmt_tune.play();
  prev_id.push(this.id);
  prev_clm = this;
  currentlyPlayingAudio = cmt_tune;
  this.classList.add("animate_frm");

  cmt_tune.addEventListener("ended", function() {
    currentlyPlayingAudio = null;
    prev_id.pop();
    prev_clm.classList.remove("animate_frm");
  });
}
