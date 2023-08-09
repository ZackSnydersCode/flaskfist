let pck = document.querySelector('.pico');
pck.innerHTML = `<img src='static/topens/${data.tOpEn}' height='auto' width='100%'>`;
const ta_contxt_of_wav = document.querySelector('._take_to_waves_holder');
ta_contxt_of_wav.addEventListener('click',()=>{
   window.location.href = '/';
})
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
const st_tpn = document.querySelector('.wave_qik_grab_info_tile');
const rit_widget = document.querySelector('.file_graphics');
const ttl_container = document.querySelector('.tools_container');
const cutter = document.querySelector('.file_handeling_frame');
const pl_aud = document.querySelector('.play_framed_file');
const err = document.querySelector('.all_err_msgs_are_here');
const submit_audio_file = document.querySelector('#submit_to_srvr_btn');
const wav_name = document.querySelector('.wave_title');
const wav_desc = document.querySelector('.wave_description_txt');
const wav_topen = document.querySelector('.wave_qik_grab_info_tile');
const chld_of_submit_to_srvr = document.querySelector('.submt_lfe');
const mk_updt = document.querySelector('.updt_btn_tap');
chld_of_submit_to_srvr.style.opacity = '0.5';
st_tpn.addEventListener('change', () => {
  if (st_tpn.files.length !== 0) {
    let file = st_tpn.files[0];
    const reader = new FileReader();

    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'jfif', 'avif', 'ico', 'tiff', 'tif'];

    const fileExtension = file.name.split('.').pop().toLowerCase();
    const isValidExtension = allowedExtensions.includes(fileExtension);

    if (isValidExtension) {
      reader.onload = (e) => {
        const imageURL = e.target.result;
        pck.innerHTML = `<img src='${imageURL}' height='auto' width='100%'>`;
        
        
      };
      
      reader.readAsDataURL(file);
    } else {
     err.innerText = ('Invalid file extension. Only JPG, JPEG, PNG, and GIF files are allowed.');
    }
  }
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
      responsive:true
    });
    wave_effect.load(url);
    
  if(wave_effect){
    const wv_btn = ttl_container.querySelector('.wv_fle');
    if (wv_btn) {
      cutter.removeChild(wv_btn);
    }
    const cncl_aud = document.createElement('div');
    cncl_aud.setAttribute('class','media-file tool wv_fle');
    cncl_aud.innerHTML = '<i class="fa-solid fa-volume-xmark gradient-icon" style="color: #ffffff;"></i>';
    cutter.appendChild(cncl_aud);
    cncl_aud.addEventListener('click',()=>{
        wave_effect.empty();
        wave_effect.destroy();
        wave_effect = null;
        cncl_aud.style.display = 'none';
    })
      wave_effect.on('finish', function() {
        pl_aud.innerHTML = '<i class="fa-solid fa-play control_pannel_icons"></i>';
      })
  }
}
let is_running= true;
if(is_running == true){
pl_aud.innerHTML = '<i class="fa-solid fa-play control_pannel_icons"></i>';
}

pl_aud.addEventListener('click', () => {
if(wave_effect){
if(is_running){
wave_effect.pause();
pl_aud.innerHTML = '<i class="fa-solid fa-play control_pannel_icons"></i>';
is_running = false;
}else{
wave_effect.play();
pl_aud.innerHTML = '<i class="fa-solid fa-pause control_pannel_icons"></i>';
is_running = true;
}
}else{
err.innerText = 'Add Waves...!';
}


})
const stp_rec_btn = document.querySelector('#users_media_1');
const rec_btn = document.querySelector('#users_media_2');
const users_media_file = document.querySelector('#users_media_3');
const _u_r_fi = document.querySelector('#users_file');
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
rec_btn.innerHTML = '<i class="fa-solid fa-microphone fa-beat-fade" style="color: #fff;"></i>';
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
mk_updt.removeEventListener('click',updt_dta);
mk_updt.style.opacity = '0.5';
chld_of_submit_to_srvr.style.opacity = '1'
submit_audio_file.addEventListener('click', send_audio_file_to_srv);
chnk = [];
});
m_rec.stop(); 
rec_btn.innerHTML = '<i class="fa-solid fa-microphone fa-beat-fade" style="color: #ffffff;"></i>';
} 
trks.forEach((trk) => {
trk.stop();
});
});

users_media_file.addEventListener('click', () => {
_u_r_fi.click();
});
createWavForm(data.wv) 
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
if(resp.path == '/'){
window.location.href = '/';
}else{
mk_updt.removeEventListener('click',updt_dta);
mk_updt.style.opacity = '0.5';
chld_of_submit_to_srvr.style.opacity = '1';
submit_audio_file.addEventListener('click', send_audio_file_to_srv);
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
}else{
frm_data.append('wav_topen', file);
}
} 
if(blob){
frm_data.append('Recorded_wave',blob);
}
if(USER_files){
frm_data.append('User_file',USER_files);
}
fetch('/respose_of_audio_file', {
method: 'POST',
body: frm_data
})
.then(response => response.json())
.then(dta => {
if (dta.path) {
const tune = new Audio();
tune.src = dta.path;
tune.play();
tune.addEventListener('ended',()=>{
  window.location.href = '/take_to_cr_wv';
})
}else{
err.innerText = dta.msg;
}
})
.catch(err => {
err.innerText = err;
});
}
}   
mk_updt.addEventListener('click', updt_dta);
function updt_dta() {
const frm_data = new FormData();
frm_data.append('U_ttl', wav_name.value);
frm_data.append('desc', wav_desc.value);
if (wav_topen.files.length > 0) {
var file = wav_topen.files[0];
var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif|\.bmp|\.webp|\.svg|\.jfif|\.avif|\.ico|\.tiff|\.tif)$/i;
if (!allowedExtensions.exec(file.name)) {
err.innerText = 'Invalid file type. Please select an image file (JPG, JPEG, PNG, GIF).';
return;
}else{
frm_data.append('tpn_file', st_tpn.files[0]);
}
} 
frm_data.append('station_n',data.st_n);
frm_data.append('dte',data.tD);
frm_data.append('wv_name_old',data.tTl);
frm_data.append('tD_old',data.tD);
fetch('/updt_dta', {
method: 'POST',
body: frm_data,
}).then(response=>response.json())
.then(response => {
window.location.href = '/take_to_broad_wav_';
})
.catch(error => {
});
}
const rmvrr_tpn = document.querySelector('.tpn_rmvrr');
rmvrr_tpn.addEventListener('click',()=>{
const xhr = new XMLHttpRequest();
const query = `/rmvr_wav_tpn?st_n=${data.st_n}&tD=${data.tD}&tTl=${data.tTl}&tD=${data.tD}`;
xhr.open('GET',query,true);
xhr.onreadystatechange = function(){
if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200){
const response = JSON.parse(xhr.responseText);
if(response.msg == 'rmved'){
err.innerText = 'Image Removed..!';
}
}
}
xhr.send();
})