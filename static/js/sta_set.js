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
document.querySelector('.comment_icon').addEventListener('click',()=>{
    window.location.href = '/take_to_stat_com';
})
document.querySelector('.frquented_wav_icon').addEventListener('click',()=>{
    window.location.href = '/take_to_broad_wav_';
})
document.querySelector('.create_wave_icon').addEventListener('click',()=>{
    window.location.href = '/take_to_cr_wv';
})


const st_na = document.querySelector('#sta_name');
const st_gener = document.querySelector('#sta_gener_');
const sta_desc = document.querySelector('#sta_own_desc');
const sta_img = document.querySelector('#sta_pic');
const name_err = document.querySelector('.name_err');

const send_btn = document.querySelector('.sb_inf_to_srv');
let is_null = false;
send_btn.addEventListener('click', () => {
  const formData = new FormData();
  if (st_na.value != '' && st_na.placeholder != st_na.value) {
    is_null = true;
    formData.append('n', st_na.value);
  }
  if(st_gener.value != ''){
    is_null = true;
  formData.append('g', st_gener.value);
  }
  if(sta_desc.value != ''){
    is_null = true;
  formData.append('d', sta_desc.value);
  }
  function isImageFile(fileName) {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'ico', 'webp', 'svg', 'tif', 'tiff', 'avif','jfif'];
    const fileExtension = fileName.split('.').pop().toLowerCase();
    return allowedExtensions.includes(fileExtension);
}
  if (sta_img.files.length !== 0) {
    const fileName = sta_img.files[0].name;
    if (isImageFile(fileName)) {
      is_null = true;
        formData.append('i', sta_img.files[0]);
    } else {
        name_err.innerText = 'Error: Only image files with extensions .jpg, .jpeg, .png, or .gif are allowed.';
        return;
    }
}
  
function updt_ckk(cki_nme,cll_bck){
 let initial = getCookie(cki_nme);
 setInterval(()=>{
 const crnt_value = getCookie(cki_nme);
 if(crnt_value !== initial){
   cll_bck(crnt_value)
   initial = crnt_value;
 }
 },300)
}
function getCookie(nm){
  const val = `; ${document.cookie}`;
  const prts = val.split(`; ${nm}=`);
  if(prts.length >= 2) return prts.pop().split(';').shift();
}
updt_ckk('U_I_S_N',(n_val)=>{
  name_err.innerText = 'Updated successfully..!';
})
if(!is_null){
  name_err.innerText = 'Nothing To Update';
  return;
}
  fetch('/sta_dat', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then((responseData) => {
    if(responseData){
    name_err.innerText = responseData.msg;
    }
  })
  .catch(err => {
    console.log(err);
  });
});
document.querySelector('.cncl_prof_im').addEventListener('click',()=>{
  const xhr = new XMLHttpRequest();
  const qur = '/rmv_prof_im';
  xhr.open('GET',qur,true);
  xhr.onreadystatechange = function(){
    if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200){
      const response = JSON.parse(xhr.responseText)
      if(response.is_ == 'true'){
        name_err.innerText = 'Profile Picture Removed...';
      }else{
        name_err.innerText = 'No Image To Remove...';
      }
    }
  }
  xhr.send();
})