(() => {
  const lang = localStorage.getItem('wedding-lang') || 'fa';
  const welcomeText = {
    en: { title:'', subtitle:'This night is better with you', card:'With love, toward a new beginning', cta:'Open Invitation', next:'FA' },
    fa: { title:'', subtitle:'این شب، با شما زیباتر است', card:'با عشق، به سوی یک آغاز', cta:'باز کردن دعوت‌نامه', next:'EN' }
  };
  const t = welcomeText[lang];
  const music = new Audio(lang === 'fa' ? 'assets/Pol.mp3' : 'assets/Ordinary.mp3');
  music.preload = 'auto';
  music.loop = true;

  document.documentElement.classList.add('welcome-locked');
  document.body.classList.add('welcome-locked');

  const screen = document.createElement('div');
  screen.id = 'welcome-screen';
  screen.setAttribute('role','dialog');
  screen.setAttribute('aria-modal','true');
  screen.innerHTML = `
    <div class="welcome-shell" dir="${lang === 'fa' ? 'rtl' : 'ltr'}">
      <button class="welcome-language" id="welcomeLanguage" type="button" aria-label="${lang === 'en' ? 'Switch to Persian' : 'Switch to English'}">${t.next}</button>
      <div class="welcome-copy">
        <h1 class="welcome-title">${t.title}</h1>
        <p class="welcome-subtitle">${t.subtitle}</p>
      </div>
      <div class="welcome-envelope-wrap">
        <div class="welcome-envelope" aria-hidden="true">
          <div class="welcome-card">
            <div class="welcome-card-mark">NS</div>
            <div class="welcome-card-names">${t.card}</div>
          </div>
          <div class="welcome-flap"></div>
          <button class="welcome-seal" id="welcomeSeal" type="button" aria-label="${t.cta}"><img src="assets/ns-logo.png" alt=""></button>
        </div>
      </div>
      <button class="welcome-cta" id="welcomeOpen" type="button">${t.cta}</button>
    </div>
  `;
  document.body.insertBefore(screen, document.body.firstChild);
  document.body.classList.remove('welcome-dismissed');

  const restartInLanguage = () => {
    localStorage.setItem('wedding-lang', lang === 'en' ? 'fa' : 'en');
    music.pause();
    music.currentTime = 0;
    window.location.reload();
  };

  document.getElementById('welcomeLanguage').addEventListener('click', restartInLanguage);

  let opening = false;
  const openInvitation = () => {
    if (opening) return;
    opening = true;
    music.play().catch(() => {});
    screen.classList.add('welcome-screen-opening');
    document.getElementById('welcomeOpen').disabled = true;
    document.getElementById('welcomeSeal').disabled = true;
    window.setTimeout(() => {
      document.body.classList.add('welcome-dismissed');
      document.documentElement.classList.remove('welcome-locked');
      document.body.classList.remove('welcome-locked');
      window.setTimeout(() => screen.remove(), 700);
    }, 1250);
  };

  document.getElementById('welcomeOpen').addEventListener('click', openInvitation);
  document.getElementById('welcomeSeal').addEventListener('click', openInvitation);
})();