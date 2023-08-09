
let is_tunned = false;
const gbl_obj = {
  DATE: data.DATE,
  STATION: data.STATION,
  STATION_IMAGE: data.STATION_IMAGE,
  TITLE: data.TITLE,
  TOPEN: data.TOPEN,
  WAVE: data.WAVE,
  WAVE_DESCRIPTION: data.WAVE_DESCRIPTION
}
document.addEventListener('DOMContentLoaded', function () {
  const wv_obj = {
    DATE: data.DATE,
    STATION: data.STATION,
    STATION_IMAGE: data.STATION_IMAGE,
    TITLE: data.TITLE,
    TOPEN: data.TOPEN,
    WAVE: data.WAVE,
  }
  ld_mr_dats();
  const xhr = new XMLHttpRequest();
  const query = '/mk_vw?obj=' + encodeURIComponent(JSON.stringify(wv_obj));
  xhr.open('GET', query, true);
  xhr.send();
});

const main_frm = document.querySelector('.switched_frm');
const switched_frm_info = document.querySelector('.ttl_dec');
const main_frm_ig = document.querySelector('.main_frm_img');
const al_clkd_cont = document.querySelector('.all_cliked_container');
const currentDate = new Date();
const l_ding = document.querySelector('.ding');
let bg_clr;
if (data) {
  switch_re_wav(data);
}
function switch_re_wav(data) {
  const stamp_data = {
    st_n: data.STATION,
    wv: data.WAVE,
    tTl: data.TITLE,
    dec: data.DESCRIPTION,
    tOpEn: data.TOPEN,
    tD: data.DATE,
    st_i: data.STATION_IMAGE,
    st_g: data.STATION_DESC,
    usr_slf: data.STATION_USERSELF,
  };
  const parse_obj = JSON.stringify(stamp_data);
  main_frm.dataset.customeData = parse_obj;
  if (stamp_data.tOpEn != "") {
    main_frm_ig.innerHTML = `<img src='static/topens/${data.TOPEN}' class='switched_img'/>`;
  } else {
    main_frm_ig.innerHTML = `<img src='static/app_pics/no_topen_img.png' class='switched_img'/>`;
  }
  const imgElement = document.querySelector('.switched_img');
  imgElement.onload = function () {
    if (data.TITLE == '') {
      switched_frm_info.innerHTML = `<span class='ttl'>......</pre></span><br></br><span class='dec'><div class='dec'>  ${data.WAVE_DESCRIPTION}</div></span>`;
    }
    if (data.WAVE_DESCRIPTION == '') {
      switched_frm_info.innerHTML = `<span class='ttl'> ${data.TITLE}</pre></span><br></br><span class='dec'><div class='dec'>.....</div></span>`;
    }
    if (data.TITLE == '' && data.WAVE_DESCRIPTION == '') {
      switched_frm_info.innerHTML = `<span class='ttl'>Title is not available</pre></span><br></br><span class='dec'><div class='dec'>Description Not Available</div></span>`;
    }
    switched_frm_info.innerHTML = `<span class='ttl'>${data.STATION} :${data.DATE.substr(0, 10)}<br>${data.TITLE}</pre></span><br></br><span class='dec'><div class='dec'>${data.WAVE_DESCRIPTION}</div></span>`;
    var image = new Image();
    image.src = imgElement.src//`static/topens/${data.TOPEN}`;
    image.onload = function () {
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0);
      var imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
      var averageColor = [0, 0, 0]; // Initialize with 0 values for R, G, B

      for (var i = 0; i < imageData.length; i += 4) {
        averageColor[0] += imageData[i]; // R
        averageColor[1] += imageData[i + 1]; // G
        averageColor[2] += imageData[i + 2]; // B
      }

      // Divide the sum by the number of pixels to get the average
      var pixelCount = imageData.length / 4;
      averageColor[0] = Math.round(averageColor[0] / pixelCount);
      averageColor[1] = Math.round(averageColor[1] / pixelCount);
      averageColor[2] = Math.round(averageColor[2] / pixelCount);

      // Calculate the dark color by reducing the RGB values
      var darkColorRgb = [
        Math.round(averageColor[0] * 1), // Darker red
        Math.round(averageColor[1] * 1), // Darker green
        Math.round(averageColor[2] * 1), // Darker blue
      ];
      if (
        !(darkColorRgb[0] >= 230) &&
        !(darkColorRgb[1] >= 230) &&
        !(darkColorRgb[2] >= 230)
      ) {
        document.body.style = `rgb(${darkColorRgb[0] * 0.7}, ${darkColorRgb[1] * 0.7}, ${darkColorRgb[2] * 0.7})`;
        document.querySelectorAll('.bg_fm_drk').forEach(elm => {
          elm.style.background = `rgb(${darkColorRgb[0] * 0.7}, ${darkColorRgb[1] * 0.7}, ${darkColorRgb[2] * 0.7})`;
        })
        document.querySelectorAll('.bg_fm').forEach(elm => {
          elm.style.background = `rgb(${darkColorRgb[0]}, ${darkColorRgb[1]}, ${darkColorRgb[2]})`;
        })
      } else {
        document.body.style = `rgb(${darkColorRgb[0] * 0.7}, ${darkColorRgb[1] * 0.2}, ${darkColorRgb[2] * 0.7})`;
        document.querySelectorAll('.bg_fm_drk').forEach(elm => {
          elm.style.background = `rgb(${darkColorRgb[0] * 0.7}, ${darkColorRgb[1] * 0.5}, ${darkColorRgb[2] * 0.7})`;
        })
        document.querySelectorAll('.bg_fm').forEach(elm => {
          elm.style.background = `rgb(${darkColorRgb[0] * 0.3}, ${darkColorRgb[1] * 0.3}, ${darkColorRgb[2] * 0.3})`;
        })
      }


    };
  };
}

let objectify_requested_data;

function createSugstonPacks(packs_data) {
  const sagston_div = document.querySelector('.clicked_view');
  const id_rnd_str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890_';
  let rslt_rnd_str = '';

  for (let i = 0; i < id_rnd_str.length; i++) {
    rslt_rnd_str += id_rnd_str.charAt(Math.floor(Math.random() * id_rnd_str.length));
  }
  const main_frm = document.createElement('div');
  const main_frm_id = main_frm.id = `main_frm_cont_${Math.floor(Math.random())}` + rslt_rnd_str;
  const main_frm_img = document.createElement('div');
  const main_frm_img_id = main_frm_img.id = `main_img_frm_${Math.floor(Math.random())}` + rslt_rnd_str;
  const main_frm_ttl = document.createElement('div');
  const main_frm_ttl_id = main_frm_ttl.id = `main_frm_ttl_${Math.floor(Math.random())}` + rslt_rnd_str;
  main_frm.classList.add('pckt_main_frm');
  main_frm_img.classList.add('pckt_main_img');
  main_frm_ttl.classList.add('pckt_main_ttl');
  main_frm.appendChild(main_frm_img);
  main_frm.appendChild(main_frm_ttl);
  al_clkd_cont.appendChild(main_frm);
  objectify_requested_data = {
    st_n: packs_data.STATION,
    st_i: packs_data.STATION_IMAGE,
    wv: packs_data.WAVE,
    tTl: packs_data.TITLE,
    tOpEn: packs_data.TOPEN,
    tD: packs_data.DATE
  };
  const stringify_obj = JSON.stringify(objectify_requested_data);
  main_frm.dataset.customeData = stringify_obj;
  add_pckt_data(packs_data, main_frm_id, main_frm_img_id, main_frm_ttl_id);
}
function add_pckt_data(dats, i1, i2, i3) {
  const selt_frm = document.querySelector(`#${i1}`);
  const selt_img = document.querySelector(`#${i2}`);
  const selt_ttl = document.querySelector(`#${i3}`);

  const send_to_query = encodeURIComponent(selt_frm.dataset.customeData);
  const query = `/requested_wave?data=${send_to_query}`;
  if (dats.TOPEN != "") {
    selt_img.innerHTML = `<a href='${query}'><img src='static/topens/${dats.TOPEN}' class='main_pckt_img_ac'></a>`;
  } else {
    selt_img.innerHTML = `<a href='${query}'><img src='static/app_pics/no_topen_img.png' class='main_pckt_img_ac'></a>`;

  }
  selt_ttl.innerText = `${dats.TITLE}`;
}
const suggestion_view = document.querySelector('.clicked_view');
suggestion_view.addEventListener('scroll', function () {
  const scrollThreshold = 0.8 * (suggestion_view.scrollHeight - suggestion_view.clientHeight);

  // Check if the user has reached the bottom of the element (or close to it)
  if (suggestion_view.scrollTop >= scrollThreshold) {
    // Execute the desired function when the threshold is reached
    ld_mr_dats();
  }
});

let pg_num = 0;
pg_sz = 20;
let sugston_arr;
function ld_mr_dats() {
  pg_num = pg_num + 1;
  const main_frm = document.querySelector('.switched_frm');
  const custome_data = JSON.parse(main_frm.dataset.customeData);
  const query = '/lod_mr_dta?data=' + (custome_data.st_n) + '&pg_num=' + pg_num + '&pg_sz=' + pg_sz;
  const xhr = new XMLHttpRequest();
  xhr.open('GET', query);
  l_ding.style.display = 'block';
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
      const response = JSON.parse(xhr.responseText);
      if (response.info) {
        l_ding.style.display = 'none';
        sugston_arr = response.info;
        for (let i = 0; i <= sugston_arr.length - 1; i++) {
          if (sugston_arr[i].TITLE == data.TITLE) {
            sugston_arr.splice(sugston_arr.indexOf(sugston_arr[i]), 1);
          }
          if (sugston_arr[i] != undefined) {
            const sugston_data = sugston_arr[i];
            createSugstonPacks(sugston_data);

          }
        }

      }
    }
  }
  xhr.send();
}
const pl_pse = document.querySelector('.ply_pse');
const disk = document.querySelector('.main_frm_img ');
document.addEventListener('DOMContentLoaded', ld_aud);
let wav_form;
function ld_aud() {
  const main_frm_data = main_frm.dataset.customeData;
  const prs_frm_dta = JSON.parse(main_frm_data);
  const wv_cont = document.querySelector('.wav_frm');
  wav_form = WaveSurfer.create({
    container: '.wav_frm',
    waveColor: '#dedcdc',
    progressColor: '#fff',
    cursorColor: 'white',
    height: 40,
    barWidth:3,
    responsive: true,
    normalize: true
  });
  wav_form.load(prs_frm_dta.wv);
  if (wav_form) {
    wav_form.on('ready', function () {
      pl_pse.innerHTML = '<i class="fa-solid fa-circle-pause" style="color: #ffffff;padding:0.1rem; border-radius:50%;"></i>';
      disk.classList.add('ply_disc');
      l_ding.style.display = 'none';
       wav_form.play();

    });
    wav_form.on('finish', () => {
      wav_form.seekTo(0);
      disk.classList.remove('ply_disc');
      pl_pse.innerHTML = '<i class="fa-solid fa-circle-play " style="color: #ffffff;"></i>';
    });
  } else {
    l_ding.style.display = 'block';
  }
}

pl_pse.addEventListener('click', () => {
  if (wav_form) {
    if (wav_form.isPlaying()) {
      disk.classList.remove('ply_disc');
      pl_pse.innerHTML = '<i class="fa-solid fa-circle-play " style="color: #ffffff;padding:0.1rem; border-radius:50%;"></i>';
      wav_form.pause();
    } else {
      wav_form.play();
      disk.classList.add('ply_disc');
      pl_pse.innerHTML = '<i class="fa-solid fa-circle-pause" style="color: #ffffff;padding:0.1rem; border-radius:50%;"></i>';

    }
  }
})
const fr_ward = document.querySelector('.fr_ward')
fr_ward.addEventListener('click', () => {
  if (wav_form) {
    const skipDuration = 5; // Specify the duration to skip forward (in seconds)
    const currentPosition = wav_form.getCurrentTime();
    const duration = wav_form.getDuration();
    const targetPosition = Math.min(currentPosition + skipDuration, duration);

    wav_form.seekTo(targetPosition / duration);
  }
})
const bk_ward = document.querySelector('.bck_ward')
bk_ward.addEventListener('click', () => {
  if (wav_form) {
    const skipDuration = 5; // Specify the duration to skip backward (in seconds)
    const currentPosition = wav_form.getCurrentTime();
    const targetPosition = Math.max(currentPosition - skipDuration, 0);

    wav_form.seekTo(targetPosition / wav_form.getDuration());
  }
})
let cmt_station_name = null;
function make_notify(path, str) {
  const tune = new Audio();
  if (str == 'heart') {
    tune.src = path;
    tune.play();
    const lik_ico = document.querySelector('.like_ico');
    lik_ico.classList.add('animate__animated');
    lik_ico.classList.add('animate__bounce');
    lik_ico.addEventListener('animationend', () => {
      lik_ico.classList.remove('animate__animated');
      lik_ico.classList.remove('animate__bounce');
    })

  }
  if (str == 'view') {
    tune.src = path;
    tune.play();
    const pin = document.querySelector('.tick_pin_it');
    pin.classList.add('grdnt_bg');
    pin.classList.add('animate__animated');
    pin.classList.add('animate__bounce');
    pin.addEventListener('animationend', () => {
      pin.classList.remove('animate__animated');
      pin.classList.remove('animate__bounce');
      pin.classList.remove('grdnt_bg');

    })
  }
  if (str == 'cmt') {
    tune.src = path;
    tune.play();
    const cpc_ = document.querySelector('.send_btn');

    cpc_.classList.add('animate__animated');
    cpc_.classList.add('animate__bounce');
    cpc_.addEventListener('animationend', () => {
      cpc_.classList.remove('animate__animated');
      cpc_.classList.remove('animate__bounce');

    })
  
  }
  if (str == 'shr_rply') {
    tune.src = path;
    tune.play();
  }
}
const info = JSON.parse(main_frm.dataset.customeData);
const give_like = document.querySelector('.likes');
give_like.addEventListener('click', () => {
  const sta_ob_lik = {
    station: info.st_n,
    title: info.tTl,
    topen: info.tOpEn,
    date: info.tD
  }
  fetch('/save_love_of_station', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ pckg: sta_ob_lik })
  })
    .then(response => response.json())
    .then((data) => {
      if (data.msg == '/') {
        window.location.href = '/';
      } else {
        make_notify(data.path, 'heart');
      }
    })
})
const vie_ico = document.querySelector('.tunned');
vie_ico.addEventListener('click', mk_tunned)
if (tnd == true) {
  vie_ico.removeEventListener('click', mk_tunned);
  vie_ico.addEventListener('click', rmvr_tund_hr);
}
function mk_tunned() {
  const tunned_pckt = {
    station: info.st_n
  }
  fetch('/save_to_tunned_list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ pckg: tunned_pckt })
  })
    .then(response => response.json())
    .then(data => {
      if (data.path == '/') {
        window.location.href = '/';
      }
      else {
        is_tunned = true;
        make_notify(data.path, 'view');
        if (is_tunned == true) {
          vie_ico.removeEventListener('click', mk_tunned);
          vie_ico.addEventListener('click', rmvr_tund_hr);
        }
      }
    })
}
const rec_cmt = document.querySelector('.rec_btn');
const sen_cmt = document.querySelector('.send_btn');
let recdr;
let chunks = [];
let strm;
let url = '';

rec_cmt.addEventListener('click', rec_com);

function rec_com() {
  sen_cmt.addEventListener('click', snd_cmt);
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      rec_cmt.innerHTML = '<i class="fa-solid fa-microphone fa-fade" style="color: #ffffff;"></i>';
      recdr = new MediaRecorder(stream);
      recdr.start();
      strm = stream;
      recdr.ondataavailable = function (event) {
        chunks.push(event.data);
      };
    })
    .catch(error => {
      console.log(error);
    });
}
function snd_cmt() {
  rec_cmt.innerHTML = '<i class="fa-solid fa-microphone" style="color: #ffffff;"></i>';
  if (recdr && recdr.state !== 'inactive') {
    recdr.stop();
    strm.getTracks().forEach(trck => {
      trck.stop();
    });
  }
  recdr.onstop = function () {
    const cmt_blb = new Blob(chunks, { type: 'audio/webm' });
    url = URL.createObjectURL(cmt_blb);
    upld_cmt(cmt_blb);
    chunks = [];
    url = '';
  };
}

function upld_cmt(cmt) {
  const sta_ob_lik = {
    station: info.st_n,
    title: info.tTl,
    date: info.tD
  }
  if (cmt) {
    const _cmt_ = new FormData()
    _cmt_.append('cmt', cmt);
    _cmt_.append('commented_to', sta_ob_lik.station);
    _cmt_.append('comment_to_ttl', sta_ob_lik.title);
    _cmt_.append('commented_to_wv_date', sta_ob_lik.date);
    fetch('/commenting', {
      method: 'POST',
      body: _cmt_
    }).then(response => response.json())
      .then((data) => {
        cmt_station_name = data.name;
        make_notify(data.path, 'cmt');
      }).catch(err => {
        console.log(err);
      })
  }
}
document.addEventListener('DOMContentLoaded', ld_cmts);
let cmt_pg_num = 1;
let cmt_pg_sz = 20;

function ld_cmts() {
  const cmt_pckg = {
    station: info.st_n,
    title: info.tTl,
    dte: info.tD
  }
  const xhr = new XMLHttpRequest();
  const sta_nam = cmt_pckg.station;
  const sta_tit = cmt_pckg.title;
  const sta_br_dte = cmt_pckg.dte;
  const url = '/ld_mr_cmt?comments=' + sta_nam + '&pg_nm=' + cmt_pg_num + '&pg_sz=' + cmt_pg_sz + '&tite=' + sta_br_dte;

  xhr.open('GET', url, true);
  l_ding.style.display = 'block';
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        if (response) {
          show_cmts(response.cmts)
          l_ding.style.display = 'none';
          document.querySelector('.cnts').innerText = response.counts;
        }
      } else {
        // Handle the error case
        console.error('Error: ' + xhr.status);
      }
    }
  };

  xhr.send();
}

const switch_view = document.querySelector('.switch_view');
const cmts_contnr = document.querySelector('.cmts_contnr');
cmts_contnr.addEventListener('scroll', call_to_mr_cmts);
function call_to_mr_cmts() {
  const cmts_contnr = document.querySelector(".cmts_contnr");
  const scrollThreshold = 0.8 * (cmts_contnr.scrollHeight - cmts_contnr.clientHeight);
  if (cmts_contnr.scrollTop >= scrollThreshold) {
    cmt_pg_num = cmt_pg_num + 1;
    ld_cmts();
  }
}
const cmt_view = document.querySelector('.cmt_view')
function show_cmts(cmt_data) {
  for (let i = cmt_data.length - 1; i >= 0; i--) {
    const rand_str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890_';
    let result = '';
    for (let j = 0; j <= rand_str.length; j++) {
      const rand = Math.floor(Math.random() * cmt_data.length);
      result += rand_str.charAt(Math.floor(rand));
    }
    const main_cmt_frm = document.createElement('div');
    main_cmt_frm.setAttribute('class', 'main_cmt_frm bg_fm');
    const cmt_prof_frm = document.createElement('div');
    cmt_prof_frm.className = 'cmt_prof_frm';
    const cmt_cmtr_frm = document.createElement('div');
    cmt_cmtr_frm.className = 'cmt_cmtr_frm';
    const cmt_dat_frm = document.createElement('div');
    cmt_dat_frm.className = 'cmt_dat_frm';
    const rply_btn_rec = document.createElement('button');
    rply_btn_rec.setAttribute('class', 'rply_rec');
    rply_btn_rec.addEventListener('click', mk_rply);
    const rply_btn_sn = document.createElement('button');
    rply_btn_sn.setAttribute('class', 'sn_rply');
    rply_btn_sn.addEventListener('click', sn_rply);
    const rplys_lnk = document.createElement('button');
    rplys_lnk.setAttribute('class', 'lnk');
    rplys_lnk.addEventListener('click', shw_rplys);
    rplys_lnk.innerHTML = '<i class="fa-solid fa-message" style="color: #000000;"></i>';
    main_cmt_frm.appendChild(cmt_prof_frm);
    main_cmt_frm.appendChild(cmt_cmtr_frm);
    main_cmt_frm.appendChild(cmt_dat_frm);
    main_cmt_frm.appendChild(rplys_lnk);
    main_cmt_frm.appendChild(rply_btn_rec);
    main_cmt_frm.appendChild(rply_btn_sn);
    cmts_contnr.appendChild(main_cmt_frm);
    main_cmt_frm.id = `main_frm_${i}_${result}`;
    cmt_prof_frm.id = `cmt_prof_img_${i}_${result}`;
    cmt_cmtr_frm.id = `cmt_cmtr_${i}_${result}`;
    cmt_dat_frm.id = `cmt_dat_frm_${i}_${result}`;
    rply_btn_rec.id = `cmt_rply_rec_${i}_${result}`;
    rply_btn_sn.id = `cmt_rply_sen_rec_${i}_${result}`;
    rplys_lnk.id = `cmt_rplys_shwer_${i}_${result}`;
    set_data_to_cmts(cmt_data[i], main_cmt_frm.id, cmt_prof_frm.id, cmt_cmtr_frm.id, cmt_dat_frm.id, rply_btn_rec.id, rply_btn_sn.id, rplys_lnk.id);
  }
}

function set_data_to_cmts(cmt_ifo, i1, i2, i3, i4, i5, i6, i7) {
  const main_frm = document.querySelector(`#${i1}`);
  const cmt_prof = document.querySelector(`#${i2}`);
  const cmt_cmtr = document.querySelector(`#${i3}`);
  const cmt_dat = document.querySelector(`#${i4}`);
  const cmt_rply_rec = document.querySelector(`#${i5}`);
  const cmt_rply_rec_sen = document.querySelector(`#${i6}`);
  const cmt_rply_shr = document.querySelector(`#${i7}`);
  const query = `/station_profile?_search=${cmt_ifo.COMMENTER}`;
  if (cmt_ifo.COMMENTER_PROFILE_IMAGE != 'no_image') {
    cmt_prof.innerHTML = `<a href='${query}'><img src='static/images/${cmt_ifo.COMMENTER_PROFILE_IMAGE}' class='cmt_prof_frm'/></a>`;
  } else {
    cmt_prof.innerHTML = `<a href='${query}'><b><p>${cmt_ifo.COMMENTER[0]}</p></b></a>`;
  }
  cmt_cmtr.innerHTML = `<u>${cmt_ifo.COMMENTER}</u>`;
  cmt_dat.innerText = `${cmt_ifo.ON_DATE}`;
  cmt_cmtr.dataset.customeData = JSON.stringify(cmt_ifo.COMMENT);
  cmt_cmtr.addEventListener('click', ply_cmt);
  cmt_rply_rec.innerHTML = '<i class="fa-solid fa-microphone-lines" style="color: #000000;"></i>';
  cmt_rply_rec_sen.innerHTML = '<i class="fa-solid fa-reply fa-flip-horizontal" style="color: #000000;"></i>';
  cstm_data = {
    cmtr: cmt_ifo.COMMENTER,
    cmt_td: cmt_ifo.ON_DATE,
    cmted_wv_sta: info.st_n,
    cmtd_wv_ttl: info.tTl,
    cmp: cmt_ifo.COMMENT
  }
  cmt_rply_rec_sen.dataset.customData = JSON.stringify(cstm_data);
  cmt_rply_shr.dataset.customData = JSON.stringify(cstm_data);

}
let currentlyPlayingAudio = null;
let prev_id = [];
let prev_clm;
let cmt_tune;

function ply_cmt() {
  if (currentlyPlayingAudio && !currentlyPlayingAudio.paused) {
    currentlyPlayingAudio.pause();
    currentlyPlayingAudio = null;
    prev_clm.classList.remove('animate_frm');
    return;
  }

  if (currentlyPlayingAudio) {
    currentlyPlayingAudio.pause();
    prev_clm.classList.remove('animate_frm');
  }

  cmt_tune = new Audio();
  cmt_tune.src = `static/comments/${JSON.parse(this.dataset.customeData)}`;
  cmt_tune.play();
  prev_id.push(this.id);
  prev_clm = this;
  currentlyPlayingAudio = cmt_tune;
  this.classList.add('animate_frm');

  cmt_tune.addEventListener('ended', function () {
    currentlyPlayingAudio = null;
    prev_id.pop();
    prev_clm.classList.remove('animate_frm');
  });
}

cmts_contnr.addEventListener('scroll', () => {
  stp_plying_cmt();
});

function stp_plying_cmt() {
  if (currentlyPlayingAudio) {
    currentlyPlayingAudio.pause();
    currentlyPlayingAudio = null;
    prev_clm.classList.remove('animate_frm');
  }
}
document.addEventListener('DOMContentLoaded', function () {

  const xhr = new XMLHttpRequest()
  const query = '/wv_stat_dta?brg_vw=' + encodeURIComponent(JSON.stringify(gbl_obj));
  xhr.open('GET', query, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
      const response = JSON.parse(xhr.responseText);
      if (response.love == 0) {
        document.querySelector('.lv').innerText = 0;
      } else {
        document.querySelector('.lv').innerText = response.love;
      }
      document.querySelector('.vw').innerText = response.views;
      document.querySelector('.liked_nums').innerText = response.tunes;
    }
  }
  xhr.send();
})
function rmvr_tund_hr() {
  const xhr = new XMLHttpRequest();
  const tunned_pckt = {
    st_n: info.st_n
  }
  const query = '/dlt_tund_sta?data=' + encodeURIComponent(JSON.stringify(tunned_pckt));
  xhr.open('GET', query, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
      const response = JSON.parse(xhr.responseText);
      let mk_ntfy = new Audio();
      mk_ntfy.src = response.path;
      mk_ntfy.play();
      vie_ico.addEventListener('click', mk_tunned);
    }
  }
  xhr.send();
}
const bck_wrd = document.querySelector('.bck_ward');
const fr_wrd = document.querySelector('.fr_ward');
bck_wrd.addEventListener('mouseup', mk_1);
function mk_1() {
  bck_wrd.classList.add('frwrd');
  bck_wrd.addEventListener('animationend', () => {
    bck_wrd.classList.remove('frwrd');
  })
}
fr_ward.addEventListener('mouseup', mk_2);
function mk_2() {
  fr_ward.classList.add('bckwrd');
  fr_ward.addEventListener('animationend', () => {
    fr_ward.classList.remove('bckwrd');
  })
}
let shr_blob;
let shr_stream;
let shr_rcdr;
let shr_chnck = [];
let flag = false;
function mk_rply() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      shr_rcdr = new MediaRecorder(stream);
      shr_rcdr.start()
      flag = true;
      shr_stream = stream;
      shr_rcdr.ondataavailable = function (event) {
        shr_chnck.push(event.data);
      }
    }).catch(error => {
      console.log(error);
    })
}
function sn_rply() {
  if (flag == true) {
    const this_shr_cmt = document.querySelector(`#${this.id}`);
    if (shr_rcdr && shr_rcdr.state !== 'inactive') {
      shr_stream.getTracks().forEach((trcks) => {
        trcks.stop();
      })
      shr_rcdr.stop();
    }
    shr_chnck = [];
    shr_rcdr.onstop = function () {
      const shr_blb = new Blob(shr_chnck, { type: 'audio/webm' });
      shr_sn_rply(shr_blb, this_shr_cmt.dataset.customData);
    }
  }
}
function shr_sn_rply(shr, dta_) {
  const dta = JSON.parse(dta_);
  const shr_rply = new FormData();
  shr_rply.append('cmt', shr);
  shr_rply.append('cmtr', dta.cmtr);
  shr_rply.append('cmt_td', dta.cmt_td);
  shr_rply.append('cmtd_wv_sta', dta.cmted_wv_sta);
  shr_rply.append('cmtd_wv_ttl', dta.cmtd_wv_ttl);
  shr_rply.append('cmp', dta.cmp);
  l_ding.style.display = 'block';
  fetch('/mk_rply_to_cmt', {
    method: 'POST',
    'body': shr_rply
  }).then(response => response.json())
    .then((data) => {
      flag = false
      l_ding.style.display = 'none';
      make_notify(data.path, 'shr_rply');
    }).catch(err => {
      console.log(err);
    })

}
let shr_pag_num = 1;
let shr_pag_sze = 20;
let this_cntr = [];
let scrl_flg = false;
let this_shwr;
const sxxx = document.querySelector('.rplys');
function shw_rplys(epex) {
  sxxx.style.display = 'block';
  this_cntr.push(this.id);
  if (scrl_flg == true) {
    this_shwr = document.querySelector(`#${epex}`);
  } else {
    this_shwr = document.querySelector(`#${this.id}`);
  }
  const prse_pckt = JSON.parse(this_shwr.dataset.customData);
  const xhr = new XMLHttpRequest();
  const query = `/get_rplys?shr_pag_num=${shr_pag_num}&shr_pag_sze=${shr_pag_sze}&customData=${encodeURIComponent(JSON.stringify(prse_pckt))}`;
  xhr.open('GET', query, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
      const response = JSON.parse(xhr.responseText);
      if (response.data.length !== 0) {

        crt_rplys(response.data);

      }
    }
  }
  xhr.send();
}
const appendr = document.querySelector('.ans_');
function crt_rplys(data) {
  for (let i = data.length - 1; i > -1; i--) {
    const rand_str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890_';
    let result = ''
    for (let j = 0; j <= rand_str.length; j++) {
      const rand = Math.floor(Math.random() * data.length);
      result += rand_str.charAt(Math.floor(rand));
    }
    const shr_main_frm = document.createElement('div');
    shr_main_frm.id = `_frm_${i}_${result}`;
    shr_main_frm.dataset.customData = JSON.stringify(data[i]);
    shr_main_frm.setAttribute('class', 'main_strm');
    let ig = data[i].repr_ig;
    let ipg;
    if (ig == 'no_image') {
      ipg = `static/app_pics/no_pro_pic.png`;
    } else {
      ipg = `static/images/${ig}`;
    }
    const query = `/station_profile?_search=${data[i].rplyr}`;
    shr_main_frm.innerHTML = `<a href='${query}'><img src='${ipg}'></a>
               <p>${data[i].reply_on.substr(0, 10)}</p><p>${data[i].rplyr}</p>`;
    appendr.appendChild(shr_main_frm);
    shr_main_frm.addEventListener('click', ply_shr);
  }
}
let crntly_plyng_aud = null;
let prev_elm = null;

function ply_shr() {
  if (crntly_plyng_aud && !crntly_plyng_aud.paused) {
    crntly_plyng_aud.pause();
    if (prev_elm) {
      prev_elm.classList.remove('animate_frm');
    }
    crntly_plyng_aud = null;
    return;
  }

  const clck_rply = this;
  const audioSrc = `static/rplys/${JSON.parse(clck_rply.dataset.customData).rply}`;
  let o = new Audio();
  o.src = audioSrc;
  const slected_shr = document.querySelector(`#${this.id}`);
  slected_shr.classList.add('animate_frm');

  // If there was previously playing audio, remove the class from the previously clicked audio element
  if (prev_elm && prev_elm !== slected_shr) {
    prev_elm.classList.remove('animate_frm');
  }
  prev_elm = slected_shr;

  o.play();
  o.addEventListener('ended', () => {
    slected_shr.classList.remove('animate_frm');
  })
  // Set the currently playing audio to the new audio object
  crntly_plyng_aud = o;
  function stp_plying_shr() {
    o.pause();
    slected_shr.classList.remove('animate_frm');
  }

  appendr.addEventListener('scroll', () => {
    stp_plying_shr();
  })
}

appendr.addEventListener('scroll', () => {
  shr_pag_num++;
  scrl_flg = true;
  shw_rplys(this_cntr[0]);
});


const hdr = document.querySelector('.hdxxx');

hdr.addEventListener('click', () => {
  sxxx.style.display = 'none';
  this_cntr = [];
  scrl_flg = false;
  shr_pag_num = 1;
  while (appendr.firstChild) {
    appendr.removeChild(appendr.firstChild);
  }
});
const up_dwn = document.querySelector('.up_dwn');
up_dwn.addEventListener('click', up);
function up() {
  document.querySelector('.cmt_view').style.height = 'auto';
  up_dwn.innerHTML = '<i class="fa-solid fa-chevron-down" style="color: #ffffff;"></i>';
  up_dwn.removeEventListener('click', up);
  up_dwn.addEventListener('click', dn);
}
function dn() {
  document.querySelector('.cmt_view').style.height = '15%';
  up_dwn.innerHTML = '<i class="fa-solid fa-chevron-up" style="color: #ffffff;"></i>';
  up_dwn.removeEventListener('click', dn);
  up_dwn.addEventListener('click', up);
}