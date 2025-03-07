import flatpickr from 'flatpickr';
import iziToast from 'izitoast';
import iconOk from '../img/check.svg';
import iconWarning from '../img/warning.svg';
import 'flatpickr/dist/flatpickr.min.css';
import 'izitoast/dist/css/iziToast.min.css';

const startBtn = document.querySelector('[data-start]');
const inputEl = document.querySelector('#datetime-picker');
const dataDaysEl = document.querySelector('[data-days]');
const dataHoursEl = document.querySelector('[data-hours]');
const dataMinutesEl = document.querySelector('[data-minutes]');
const dataSecondsEl = document.querySelector('[data-seconds]');
let userSelectedDate = '';
let intervalId = null;
startBtn.disabled = true;

const msgOk = {
  title: 'OK',
  message: 'Timer started!',
  iconUrl: iconOk,
  iconColor: '#fff',
  titleColor: '#fff',
  backgroundColor: '#59a10d',
  messageColor: '#fff',
  position: 'topRight',
  timeout: 3000,
};

const msgWarning = {
  title: 'Error',
  message: 'Please choose a date in the future',
  backgroundColor: '#ef4040',
  iconColor: '#fff',
  titleColor: '#fff',
  messageColor: '#fff',
  position: 'topRight',
  iconUrl: iconWarning,
};

const msgFinish = {
  title: 'Done',
  message: 'Countdown finished!',
  iconUrl: iconOk,
  iconColor: '#fff',
  titleColor: '#fff',
  backgroundColor: '#59a10d',
  messageColor: '#fff',
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
      startBtn.disabled = false;
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }
  },
};

function startTimer() {
  startBtn.disabled = true;
  inputEl.disabled = true;

  iziToast.success(msgOk);

  intervalId = setInterval(() => {
    const countTime = userSelectedDate - Date.now();
    if (countTime <= 0) {
      clearInterval(intervalId);
      intervalId = null;
      iziToast.success(msgFinish);
      inputEl.disabled = false;
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(countTime);
    dataDaysEl.textContent = String(days).padStart(2, '0');
    dataHoursEl.textContent = String(hours).padStart(2, '0');
    dataMinutesEl.textContent = String(minutes).padStart(2, '0');
    dataSecondsEl.textContent = String(seconds).padStart(2, '0');
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

startBtn.addEventListener('click', startTimer);
flatpickr(inputEl, options);
