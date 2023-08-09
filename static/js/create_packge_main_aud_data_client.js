const ta_contxt_of_wav = document.querySelector('._take_to_waves_holder')
ta_contxt_of_wav.addEventListener('click', () => {
  window.location.href = '/';
})
document.querySelector('.stat_icon').addEventListener('click', () => {
  window.location.href = '/take_to_stat_graph';
})
document.querySelector('.tat_icon').addEventListener('click', () => {
  window.location.href = '/take_to_stat_com';
})
document.querySelector('.comment_icon').addEventListener('click', () => {
  window.location.href = '/take_to_stat_com';
})
document.querySelector('.frquented_wav_icon').addEventListener('click', () => {
  window.location.href = '/take_to_broad_wav_';
})
document.querySelector('.profile_settings_icon').addEventListener('click', () => {
  window.location.href = '/take_sta_set_';
})
const stp_rec_btn = document.querySelector('#users_media_1');
const rec_btn = document.querySelector('#users_media_2');
const users_media_file = document.querySelector('#users_media_3');
const _u_r_fi = document.querySelector('#users_file');
const err = document.querySelector('.all_err_msgs_are_here');
let m_rec;
let chnk = [];
let trks;
let USER_files;
let vs_data = [];
let audioURL;
let blob;

rec_btn.addEventListener('click', () => {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      trks = stream.getAudioTracks();
      m_rec = new MediaRecorder(stream);
      m_rec.start();
      m_rec.addEventListener('dataavailable', (event) => {
        chnk.push(event.data);
        vs_data.push(event.data);
      });
    })
    .catch((error) => {
      err.innerText = err;
    });
});

stp_rec_btn.addEventListener('click', () => {
  if (m_rec && m_rec.state !== 'inactive') {
    m_rec.addEventListener('stop', () => {
      blob = new Blob(chnk, { type: 'audio/webm' });
      audioURL = URL.createObjectURL(blob);
      createWavForm(audioURL);

      chnk = [];
    });
    m_rec.stop();

  }
  trks.forEach((trk) => {
    trk.stop();
  });
});

users_media_file.addEventListener('click', () => {
  _u_r_fi.click();
});

_u_r_fi.addEventListener('change', () => {
  USER_files = _u_r_fi.files[0];
  const allowedExtensions = ['.mp3', '.wav', '.ogg'];
  const fileName = USER_files.name;
  const fileExtension = fileName.substring(fileName.lastIndexOf('.'));

  if (allowedExtensions.includes(fileExtension.toLowerCase())) {
    const formData = new FormData();
    formData.append('file', USER_files);

    fetch('/send_users_media_file', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(resp => {
        if (resp.path == '/') {
          window.location.href = '/';
        } else {
          err.innerText = '';
          createWavForm(resp.path);
        }
      })
      .catch(err => {
        err.innerText = err;
      });

  } else {
    err.innerText = 'Invalid File Selected...!';
  }
});


const submitToServerBtn = document.querySelector('#submit_to_srvr_btn');
submitToServerBtn.addEventListener('click', () => {
});
let wave_effect;
function createWavForm(url) {

  exportation_file = url;

  if (wave_effect) {
    wave_effect.empty();
    wave_effect.destroy();
  }

  wave_effect = WaveSurfer.create({
    container: '.wave_wave_form',
    waveColor: '#fff',
    progressColor: '#e52e71',
    height: 50,
    barWidth: 2,
    responsive: true
  });
  wave_effect.load(url);

  if (wave_effect) {
    wave_effect.on('finish', function () {
      pl_aud.innerHTML = '<i class="fa-solid fa-play control_pannel_icons"></i>';
    })
  }
}

const pl_aud = document.querySelector('#play_audio');
let is_running = true;
if (is_running == true) {
  pl_aud.innerHTML = '<i class="fa-solid fa-play control_pannel_icons"></i>';
}

pl_aud.addEventListener('click', () => {
  if (wave_effect) {
    if (is_running) {
      wave_effect.pause();
      pl_aud.innerHTML = '<i class="fa-solid fa-play control_pannel_icons"></i>';
      is_running = false;
    } else {
      wave_effect.play();
      pl_aud.innerHTML = '<i class="fa-solid fa-pause control_pannel_icons"></i>';
      is_running = true;
    }
  } else {
    err.innerText = 'Add Waves...!'
  }


})
const submit_audio_file = document.querySelector('#submit_to_srvr_btn');
const wav_name = document.querySelector('.wave_title');
const wav_desc = document.querySelector('.wave_description_txt');
const wav_topen = document.querySelector('.wave_qik_grab_info_tile');
wav_topen.addEventListener('change', (e) => {
  const fle = e.target.files[0];
  if (fle) {
    const fileGraphics = document.querySelector('.pico');
    const redr = new FileReader();
    redr.onload = function (e) {
      const url = e.target.result;
      fileGraphics.style.backgroundImage = `url(${url})`;
      fileGraphics.style.backgroundSize = 'cover';
      fileGraphics.style.backgroundPosition = 'center';
      fileGraphics.style.backgroundRepeat = 'no-repeat';
    }
    redr.readAsDataURL(fle);
  }
})
submit_audio_file.addEventListener('click', send_audio_file_to_srv);
function send_audio_file_to_srv() {
  if (wave_effect) {
    const frm_data = new FormData();
    const specialCharsRegex = /[^\w\s]/g; 
    const wavNameValue = wav_name.value;
    const wavDescValue = wav_desc.value;
    const sanitizedWavName = wavNameValue.replace(specialCharsRegex, '');
    const sanitizedWavDesc = wavDescValue.replace(specialCharsRegex, '');
    frm_data.append('wav_name', sanitizedWavName);
    frm_data.append('wav_desc', sanitizedWavDesc);
    if (wav_topen.files.length > 0) {
      var file = wav_topen.files[0];
      var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif|\.bmp|\.webp|\.svg|\.jfif|\.avif|\.ico|\.tiff|\.tif)$/i;
      if (!allowedExtensions.exec(file.name)) {
        err.innerText = 'Invalid file type. Please select an image file (JPG, JPEG, PNG, GIF).';
        return;
      } else {
        frm_data.append('wav_topen', file);
      }
    }
    if (blob) {
      frm_data.append('Recorded_wave', blob);
    }
    if (USER_files) {
      frm_data.append('User_file', USER_files);
    }
    fetch('/respose_of_audio_file', {
      method: 'POST',
      body: frm_data
    })
      .then(response => response.json())
      .then(dta => {
        if (dta.path) {
          console.log('tuned...');
          const tune = new Audio();
          tune.src = dta.path;
          tune.play();
          tune.addEventListener('ended', () => {
            setTimeout(() => {
              window.location.href = '/take_to_cr_wv';
            }, 100)
          })
        } else {
          err.innerText = dta.msg;
        }
      })
      .catch(err => {
        err.innerText = err;
      });
  }
} 