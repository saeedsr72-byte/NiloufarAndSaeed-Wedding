const WEDDING_AT = new Date('2026-09-01T19:00:00+03:30').getTime();
const translations = {
  en: { eyebrow:'A new chapter begins', date:'Tuesday — September 1, 2026 / 7:00 PM', countdownTitle:'Until our day', days:'Days', hours:'Hours', minutes:'Minutes', seconds:'Seconds', storyKicker:'Two hearts, one beginning', storyTitle:'We would love to celebrate with you.', venueKicker:'The celebration', venueName:'Ashkan Garden', venueAddress:'Shiraz - Qalat Road - Aghaghia 2 Alley - Ashkan Garden', map:'Open location', mapKicker:'Navigation', mapTitle:'Choose your map', rsvpTitle:'Will you be joining us?', rsvpHint:'Tap to respond', namePlaceholder:'Full name', attendanceQuestion:'Will you be joining us?', attendanceYes:"With love, I'll be there", attendanceNo:"I won't be able to join you this time", noteLabel:'Your note', notePlaceholder:'Write a message for us...', submitRsvp:'Send RSVP', rsvpSuccess:'Thank you for letting us know ♥', rsvpError:'Something went wrong. Please try again.' },
  fa: { eyebrow:'آغاز یک فصل تازه', date:'سه‌شنبه — ۱۰ شهریور ۱۴۰۵ / ساعت ۱۹:۰۰', countdownTitle:'تا آغاز فصل عاشقی', days:'روز', hours:'ساعت', minutes:'دقیقه', seconds:'ثانیه', storyKicker:'دو قلب، یک آغاز', storyTitle:'دوست داریم این شب را در کنار شما جشن بگیریم.', venueKicker:'محل جشن', venueName:'باغ اشکان', venueAddress:'شیراز - ابتدای جاده قلات - کوچه اقاقیا ۲ - باغ اشکان', map:'مشاهده لوکیشن', mapKicker:'مسیریابی', mapTitle:'مسیریاب خود را انتخاب کنید', rsvpTitle:'آیا در این شب کنار ما خواهید بود؟', rsvpHint:'برای پاسخ، اینجا را لمس کنید', namePlaceholder:'نام و نام خانوادگی', attendanceQuestion:'آیا در این شب کنار ما خواهید بود؟', attendanceYes:'با عشق، می‌آیم', attendanceNo:'این بار نمی‌توانم همراه‌تان باشم', noteLabel:'یادداشت شما', notePlaceholder:'پیامتان را برای ما بنویسید...', submitRsvp:'ارسال پاسخ', rsvpSuccess:'ممنون که خبرمان کردید ♥', rsvpError:'مشکلی پیش آمد. لطفاً دوباره تلاش کنید.' }
};

let lang = localStorage.getItem('wedding-lang') || 'fa';
const $ = id => document.getElementById(id);

function renderLanguage(){
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = translations[lang][key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    el.placeholder = translations[lang][key];
  });
  $('languageToggle').textContent = lang === 'en' ? 'FA' : 'EN';
  $('rsvpLanguage').value = lang === 'en' ? 'English' : 'Persian';
  const selected = document.querySelector('input[name="attendance"]:checked');
  if (selected) $('attendanceLabel').value = selected.nextElementSibling.textContent;
}

function updateCountdown(){
  const diff = Math.max(0, WEDDING_AT - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  $('days').textContent = String(days).padStart(2,'0');
  $('hours').textContent = String(hours).padStart(2,'0');
  $('minutes').textContent = String(minutes).padStart(2,'0');
  $('seconds').textContent = String(seconds).padStart(2,'0');
}

$('languageToggle').addEventListener('click', () => {
  localStorage.setItem('wedding-lang', lang === 'en' ? 'fa' : 'en');
  window.location.href = window.location.pathname + window.location.search;
});

const locationButton = $('locationButton');
const mapPopover = $('mapPopover');
const mapClose = $('mapClose');

function openMapPicker(){ mapPopover.hidden = false; locationButton.setAttribute('aria-expanded','true'); }
function closeMapPicker(){ mapPopover.hidden = true; locationButton.setAttribute('aria-expanded','false'); }

locationButton.addEventListener('click', event => {
  event.stopPropagation();
  mapPopover.hidden ? openMapPicker() : closeMapPicker();
});
mapClose.addEventListener('click', event => { event.stopPropagation(); closeMapPicker(); });
mapPopover.addEventListener('click', event => event.stopPropagation());
document.addEventListener('click', closeMapPicker);
document.addEventListener('keydown', event => { if(event.key === 'Escape') closeMapPicker(); });

mapPopover.querySelectorAll('.map-option').forEach(option => {
  option.addEventListener('click', event => {
    const fallback = option.dataset.fallback;
    if (fallback) {
      event.preventDefault();
      const started = Date.now();
      window.location.href = option.href;
      setTimeout(() => {
        if (document.visibilityState === 'visible' && Date.now() - started < 1800) window.location.href = fallback;
      }, 900);
    }
    closeMapPicker();
  });
});

const rsvpForm = $('rsvpForm');
const rsvpTrigger = $('rsvpTrigger');
const rsvpStatus = $('rsvpStatus');
const attendanceInputs = document.querySelectorAll('input[name="attendance"]');

function openRsvp(){
  const isOpen = rsvpForm.classList.contains('float-in');
  if (isOpen) return;
  rsvpForm.classList.remove('rsvp-form-hidden');
  rsvpForm.classList.remove('float-in');
  void rsvpForm.offsetWidth;
  rsvpForm.classList.add('float-in');
  rsvpTrigger.setAttribute('aria-expanded','true');
  setTimeout(() => rsvpForm.querySelector('input[name="name"]')?.focus(), 350);
}

rsvpTrigger.addEventListener('click', openRsvp);
rsvpTrigger.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    openRsvp();
  }
});

attendanceInputs.forEach(input => input.addEventListener('change', () => {
  $('attendanceLabel').value = input.nextElementSibling.textContent;
}));

rsvpForm.addEventListener('submit', async event => {
  event.preventDefault();
  const submitButton = rsvpForm.querySelector('.rsvp-submit');
  submitButton.disabled = true;
  rsvpStatus.textContent = '';
  $('rsvpLanguage').value = lang === 'en' ? 'English' : 'Persian';
  const selected = document.querySelector('input[name="attendance"]:checked');
  if (selected) $('attendanceLabel').value = selected.nextElementSibling.textContent;

  try {
    const response = await fetch(rsvpForm.action, { method:'POST', body:new FormData(rsvpForm), headers:{Accept:'application/json'} });
    if (!response.ok) throw new Error('RSVP submission failed');
    rsvpForm.reset();
    $('rsvpLanguage').value = lang === 'en' ? 'English' : 'Persian';
    rsvpStatus.textContent = translations[lang].rsvpSuccess;
    if (window.umami) window.umami.track('rsvp_submitted', { language: lang });
  } catch (error) {
    rsvpStatus.textContent = translations[lang].rsvpError;
  } finally {
    submitButton.disabled = false;
  }
});

const rsvpStyle = document.createElement('style');
rsvpStyle.textContent = `.rsvp-trigger{cursor:pointer;transition:opacity .2s ease}.rsvp-trigger:hover{opacity:.78}.rsvp-trigger:focus-visible{outline:1px solid rgba(128,86,90,.35);outline-offset:6px}.rsvp-trigger-wrap{display:inline-flex;flex-direction:column;align-items:center;gap:9px;cursor:pointer}.rsvp-trigger-hint{display:inline-flex;align-items:center;gap:7px;color:#a7777b;font-size:.62rem;letter-spacing:.1em;text-transform:uppercase;opacity:.82;transition:opacity .25s ease,transform .25s ease}.rsvp-trigger-hint::after{content:'→';font-size:.85rem;transition:transform .25s ease}.rsvp-trigger-wrap:hover .rsvp-trigger-hint,.rsvp-trigger-wrap:focus-within .rsvp-trigger-hint{opacity:1}.rsvp-trigger-wrap:hover .rsvp-trigger-hint::after,.rsvp-trigger-wrap:focus-within .rsvp-trigger-hint::after{transform:translateX(4px)}.rsvp-trigger-wrap:hover .rsvp-trigger::after,.rsvp-trigger-wrap:focus-within .rsvp-trigger::after{transform:scaleX(1)}.rsvp-trigger::after{content:'';display:block;width:100%;height:1px;margin-top:12px;background:rgba(128,86,90,.38);transform:scaleX(0);transform-origin:center;transition:transform .3s ease}.rsvp-form{max-width:460px;margin:34px auto 0;display:flex;flex-direction:column;gap:18px;text-align:start}.rsvp-form-hidden{display:none}.rsvp-form.float-in{display:flex;animation:rsvpFloatIn .55s cubic-bezier(.22,.61,.36,1) both}.rsvp-field{width:100%;border:0;border-bottom:1px solid rgba(128,86,90,.28);border-radius:0;background:transparent;color:#6f4d50;padding:12px 2px;font:inherit;outline:none;text-align:start}.rsvp-field:focus{border-bottom-color:#80565a}.rsvp-field::placeholder{color:#a7777b;opacity:.8}.rsvp-choice{margin:4px 0 0;padding:0;border:0;display:flex;flex-direction:column;gap:12px;text-align:start}.rsvp-choice legend,.rsvp-note-label{margin-bottom:4px;color:#80565a;font-size:.85rem;text-align:start}.rsvp-choice label{display:flex;align-items:center;gap:10px;font-size:.9rem;text-align:start}.rsvp-choice label:first-of-type span::after{content:' ♥';color:#c84b50;font-size:.92em}.rsvp-choice input{accent-color:#80565a}.rsvp-message{resize:none;min-height:90px}.rsvp-submit{align-self:center;border:1px solid rgba(128,86,90,.28);border-radius:999px;background:transparent;color:#80565a;padding:11px 24px;cursor:pointer}.rsvp-submit:disabled{opacity:.55}.rsvp-status{min-height:1.4em;margin:0!important;text-align:center;color:#80565a;font-size:.85rem}`;
document.head.appendChild(rsvpStyle);

window.addEventListener('load', () => {
  if (window.umami) window.umami.track('invitation_opened', { language: lang });
});

renderLanguage();
updateCountdown();
setInterval(updateCountdown, 1000);
