const s_n = document.querySelector('#station_name_field');
const s_p = document.querySelector('#station_password_field');
const s_e = document.querySelector('#station_email_field');
const c_s_b = document.querySelector('.statio_data_xxx');

const i_s = document.querySelector('#inv_sta');
const i_p = document.querySelector('#inv_pass');
const i_e = document.querySelector('#inv_em');
s_n.addEventListener('keyup', () => {
  validateStationName();
});
s_p.addEventListener('keyup', () => {
  validateStationPassword();
});
s_e.addEventListener('keyup', () => {
  validateStationEmail();
});

c_s_b.addEventListener('click', () => {
  if (validateStationName() && validateStationPassword() && validateStationEmail()) {
    const data = {
      s: s_n.value,
      p: s_p.value,
      e: s_e.value
    };

    fetch('/submit_form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then((r) => {
        if(r.MSG == 'hello'){
          window.location.href = '/';
        }
        i_s.innerText = r.duplication_msg;
      })
      .catch(e => {
        console.log(e);
      });
  }
  setInterval(() => {
    function checkCookieExists(cookieName) {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.indexOf(cookieName + '=') === 0) {
          return true;
        }
      }
      return false;
    }
  
    if (checkCookieExists('U_I_S_N')) {
      window.location.href = '/';
    }
  }, 100);
  
});

function validateStationName() {
  const s_n_v = s_n.value.trim();

  if (s_n_v === '') {
    i_s.innerText = 'Enter the Station Name';
    i_s.style.color = 'red';
    return false;
  }

  if (hasUnwantedCharactersAtStart(s_n_v, '#$%^&')) {
    i_s.innerText = 'Name cannot start with #, $, %, ^, &';
    i_s.style.color = 'red';
    return false;
  }

  i_s.innerText = 'Good to go...!';
  i_s.style.color = 'green';

  return true;
}

function validateStationPassword() {
    const s_p_v = s_p.value.trim();
  
    if (s_p_v.length < 8) {
      i_p.innerText = 'Password should be at least 8 characters long';
      i_p.style.color = 'red';
      return false;
    }
  
    i_p.innerText = 'Good to go...!';
    i_p.style.color = 'green';
    return true;
  }

function validateStationEmail() {
    const s_e_v = s_e.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (s_e_v === '') {
      i_e.innerText = 'Enter the email address';
      i_e.style.color = 'red';
      return false;
    }
  
    if (!emailRegex.test(s_e_v)) {
      i_e.innerText = 'Invalid email address';
      i_e.style.color = 'red';

      return false;
    }
  
    i_e.innerText = 'good to go...!';
    i_e.style.color = 'green';

    return true;   
  }
  
  // ...

function hasUnwantedCharactersAtStart(str, unwantedChars) {
  const firstChar = str.charAt(0);
  return unwantedChars.includes(firstChar);
}
