// Forn d'en Pere — interacciones básicas
(() => {
  const nav = document.getElementById('nav');
  const toggle = nav.querySelector('.nav__toggle');

  // Cabecera sólida al hacer scroll
  const onScroll = () => nav.classList.toggle('is-solid', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Menú móvil
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  nav.querySelectorAll('.nav__menu a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }));

  // Filtro de productos
  const tabs = document.querySelectorAll('.tabs button');
  const cards = document.querySelectorAll('#grid .card');
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(t => t.setAttribute('aria-selected', t === tab));
    const f = tab.dataset.filter;
    cards.forEach(c => { c.hidden = f !== 'todo' && c.dataset.cat !== f; });
  }));

  // Abierto / cerrado según la hora de Barcelona
  const HOURS = { 1: [745, 2000], 2: [745, 2000], 3: [745, 2000], 4: [745, 2000], 5: [745, 2000], 6: [815, 1430] };
  const fmt = n => `${Math.floor(n / 100)}:${String(n % 100).padStart(2, '0')}`;
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
  }).formatToParts(new Date());
  const get = type => parts.find(p => p.type === type).value;
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  const now = parseInt(get('hour'), 10) % 24 * 100 + parseInt(get('minute'), 10);
  const today = HOURS[day];
  const status = document.getElementById('status');
  if (today && now >= today[0] && now < today[1]) {
    status.classList.add('is-open');
    status.textContent = `Abierto ahora · hasta las ${fmt(today[1])}`;
  } else {
    status.classList.add('is-closed');
    let next = day, label = 'hoy';
    if (!today || now >= today[1]) {
      do { next = (next + 1) % 7; } while (!HOURS[next]);
      label = next === (day + 1) % 7 ? 'mañana' : ['domingo', 'el lunes', 'el martes', 'el miércoles', 'el jueves', 'el viernes', 'el sábado'][next];
    }
    status.textContent = `Cerrado ahora · abrimos ${label} a las ${fmt(HOURS[next][0])}`;
  }
  document.querySelectorAll('.hours tr').forEach(tr => {
    if (tr.dataset.days.split(',').map(Number).includes(day)) tr.classList.add('is-today');
  });

  // Animación de entrada
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
  }), { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  document.getElementById('year').textContent = new Date().getFullYear();
})();
