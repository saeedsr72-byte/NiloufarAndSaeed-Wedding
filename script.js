const WEDDING_AT = new Date('2026-09-01T19:00:00+03:30').getTime();
const translations = {
  en: { eyebrow:'A new chapter begins', date:'September 1, 2026 / 7:00 PM', countdownTitle:'Until our day', days:'Days', hours:'Hours', minutes:'Minutes', seconds:'Seconds', storyKicker:'Two hearts, one beginning', storyTitle:'We would love to celebrate with you.', venueKicker:'The celebration', venueName:'Ashkan Garden', venueAddress:'Shiraz - Qalat Road - Aghaghia 2 Alley - Ashkan Garden', map:'Open location', mapKicker:'Navigation', mapTitle:'Choose your map', rsvpTitle:'Will you join us?', rsvpText:'A simple RSVP form will be added in the next build.' },
  fa: { eyebrow:'آغاز یک فصل تازه', date:'۱۰ شهریور ۱۴۰۵ / ساعت ۱۹:۰۰', countdownTitle:'تا آغاز فصل عاشقی', days:'روز', hours:'ساعت', minutes:'دقیقه', seconds:'ثانیه', storyKicker:'دو قلب، یک آغاز', storyTitle:'دوست داریم این شب را در کنار شما جشن بگیریم.', venueKicker:'محل جشن', venueName:'باغ اشکان', venueAddress:'شیراز - ابتدای جاده قلات - کوچه اقاقیا ۲ - باغ اشکان', map:'مشاهده لوکیشن', mapKicker:'مسیریابی', mapTitle:'مسیریاب خود را انتخاب کنید', rsvpTitle:'در کنار ما خواهید بود؟', rsvpText:'فرم RSVP در نسخه بعدی اضافه می‌شود.' }
};

let lang = localStorage.getItem('wedding-lang') || 'en';
const $ = id => document.getElementById(id);

function renderLanguage(){
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = translations[lang][key];
  });
  $('languageToggle').textContent = lang === 'en' ? 'FA' : 'EN';
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

renderLanguage();
updateCountdown();
setInterval(updateCountdown, 1000);
