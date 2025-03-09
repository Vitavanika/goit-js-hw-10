import flatpickr from 'flatpickr';
import iziToast from 'izitoast';
import iconOk from '../img/check.svg';
import iconWarning from '../img/warning.svg';
import 'flatpickr/dist/flatpickr.min.css';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  startBtn: document.querySelector('[data-start]'),
  inputEl: document.querySelector('#datetime-picker'),
  dataDaysEl: document.querySelector('[data-days]'),
  dataHoursEl: document.querySelector('[data-hours]'),
  dataMinutesEl: document.querySelector('[data-minutes]'),
  dataSecondsEl: document.querySelector('[data-seconds]'),
};
let userSelectedDate = '';
let intervalId = null;
refs.startBtn.disabled = true;

const msgOk = {
  title: 'OK',
  titleColor: '#fff',
  message: 'Timer started!',
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
  message: 'Please choose a date in the future',
  messageColor: '#fff',
  backgroundColor: '#ef4040',
  iconUrl: iconWarning,
  iconColor: '#fff',
  position: 'topRight',
};

const msgFinish = {
  title: 'Done',
  titleColor: '#fff',
  message: 'Countdown finished!',
  messageColor: '#fff',
  backgroundColor: '#59a10d',
  iconUrl: iconOk,
  iconColor: '#fff',
  position: 'topRight',
  timeout: 3000,
};

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    if (selectedDates.length > 0) {
      const selectedDate = selectedDates[0];
      if (selectedDate <= new Date()) {
        iziToast.error(msgWarning);
        return;
      }
      userSelectedDate = selectedDate;
      refs.startBtn.disabled = false;
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }
  },
};

function startTimer() {
  refs.startBtn.disabled = true;
  refs.inputEl.disabled = true;

  iziToast.success(msgOk);

  intervalId = setInterval(() => {
    const countTime = userSelectedDate - Date.now();
    if (countTime <= 0) {
      iziToast.success(msgFinish);
      clearInterval(intervalId);
      intervalId = null;
      refs.inputEl.disabled = false;
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(countTime);
    refs.dataDaysEl.textContent = String(days).padStart(2, '0');
    refs.dataHoursEl.textContent = String(hours).padStart(2, '0');
    refs.dataMinutesEl.textContent = String(minutes).padStart(2, '0');
    refs.dataSecondsEl.textContent = String(seconds).padStart(2, '0');
  }, 1000);
}

function convertMs(ms) {
  const sec = 1000;
  const minute = sec * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / sec);

  return { days, hours, minutes, seconds };
}

refs.startBtn.addEventListener('click', startTimer);
flatpickr(refs.inputEl, options);
