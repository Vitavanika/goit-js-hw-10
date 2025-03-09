import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import iconOk from '../img/check.svg';
import iconWarning from '../img/warning.svg';
import iconCoution from '../img/coution.svg';

const formEl = document.querySelector('.form');
const STATE_FULFILLED = 'fulfilled';
const msgOk = {
  title: 'OK',
  titleColor: '#fff',
  messageColor: '#fff',
  backgroundColor: '#59a10d',
  iconUrl: iconOk,
  iconColor: '#fff',
  position: 'topRight',
  timeout: 3000,
};

const msgWarning = {
  title: 'Error',
  titleColor: '#fff',
  messageColor: '#fff',
  backgroundColor: '#ef4040',
  iconUrl: iconWarning,
  iconColor: '#fff',
  position: 'topRight',
};

const msgCaution = {
  title: 'Caution',
  titleColor: '#fff',
  message: 'Please enter a valid positive delay value.',
  messageColor: '#fff',
  backgroundColor: '#ffa000',
  iconUrl: iconCoution,
  iconColor: '#fff',
  position: 'topRight',
};

function onSubmit(event) {
  event.preventDefault();

  const delay = parseInt(formEl.elements.delay.value);
  const state = formEl.elements.state.value;

  if (isNaN(delay) || delay <= 0) {
    iziToast.error(msgCaution);
    event.currentTarget.reset();
    return;
  }
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      state === STATE_FULFILLED ? resolve(delay) : reject(delay);
    }, delay);
  });

  promise
    .then(delay => {
      console.log(`✅ Fulfilled promise in ${delay}ms`);
      msgOk.message = `Fulfilled promise in ${delay}ms`;
      iziToast.success(msgOk);
    })
    .catch(delay => {
      console.log(`❌ Rejected promise in ${delay}ms`);
      msgWarning.message = `Rejected promise in ${delay}ms`;
      iziToast.error(msgWarning);
    });
  event.currentTarget.reset();
}

formEl.addEventListener('submit', onSubmit);
