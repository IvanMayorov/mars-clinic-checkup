/* Поведение шапки и подвала как на mars-clinic.ru: сворачивание при прокрутке, выпадающие блоки, мобильное меню. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const header = $('#siteHeader .b-header');
  const footer = $('#siteFooter');
  const top = $('.header__top', header);
  const bottomMenu = $('.b-bottom-menu', footer);
  const FADE = 300;

  const shown = el => getComputedStyle(el).display !== 'none';
  const show = el => {
    el.style.display = '';
    if (!shown(el)) el.style.display = 'block';
    el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: FADE });
  };
  const hide = el => {
    if (!shown(el)) return;
    el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: FADE }).onfinish = () => { el.style.display = 'none'; };
  };
  const lock = on => document.body.classList.toggle('ss-lock', on);

  function measure() {
    root.style.setProperty('--sh-h', header.offsetHeight + 'px');
    root.style.setProperty('--sh-bar', header.offsetHeight - top.offsetHeight + 'px');
    const menu = bottomMenu && $('.b-bottom-menu__list', bottomMenu);
    const visible = menu && shown(bottomMenu);
    root.style.setProperty('--sh-bottom', visible ? innerHeight - menu.getBoundingClientRect().top + 'px' : '0px');
  }
  new ResizeObserver(measure).observe(header);
  addEventListener('resize', measure);
  addEventListener('load', measure);
  measure();

  const phoneLink = $('.js-phone-link', header);
  const phones = $('.phones-block', header);
  const burger = $('.js-menu-btn', header);
  const mainMenu = $('#main-menu', header);
  const clinicLink = $('.js-clinic-menu', header);
  const clinicList = clinicLink.parentNode.querySelector('.clinic-list');

  const closePhones = () => { if (phoneLink.classList.contains('active')) { phoneLink.classList.remove('active'); hide(phones); lock(false); } };
  const closeMenu = () => { if (burger.classList.contains('active')) { burger.classList.remove('active'); hide(mainMenu); lock(false); } };
  const closeClinics = () => { if (clinicLink.classList.contains('active')) { clinicLink.classList.remove('active'); hide(clinicList); } };

  const onScroll = () => {
    const scrolled = scrollY > 0;
    header.classList.toggle('hide', scrolled);
    if (scrolled) { closePhones(); closeMenu(); closeClinics(); }
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  clinicLink.addEventListener('click', e => {
    e.stopPropagation();
    if (innerWidth >= 992) return;
    if (clinicLink.classList.contains('active')) closeClinics();
    else { clinicLink.classList.add('active'); show(clinicList); }
  });

  phoneLink.addEventListener('click', e => {
    e.stopPropagation();
    if (phoneLink.classList.contains('active')) return closePhones();
    phoneLink.classList.add('active');
    show(phones);
    if (innerWidth <= 991) lock(true);
  });
  phones.addEventListener('click', e => e.stopPropagation());
  document.addEventListener('click', closePhones);

  burger.addEventListener('click', () => {
    if (burger.classList.contains('active')) return closeMenu();
    closeBottom();
    burger.classList.add('active');
    show(mainMenu);
    if (innerWidth <= 1200) lock(true);
  });
  $('.js-menu-close', header).addEventListener('click', closeMenu);

  $$('.js-extra-link', header).forEach(link => link.addEventListener('click', e => {
    if (innerWidth < 768) return;
    e.preventDefault();
    const block = link.parentNode.querySelector('.extra-block');
    const on = link.classList.toggle('active');
    on ? show(block) : hide(block);
  }));

  $$('.b-main-menu__submenu-item', header).forEach(item => item.addEventListener('click', e => {
    if (e.target.closest('a')) return;
    item.classList.toggle('opened');
    const sub = $('.b-main-menu__submenu-wrapper', item);
    sub.style.maxHeight = sub.style.maxHeight ? '' : sub.scrollHeight + 'px';
  }));

  // нижнее меню на телефоне
  const clinicTab = $('.b-bottom-menu__item.clinic', footer);
  const ball = $('.b-bottom-menu__ball', footer);
  const clinicSheet = $('.b-clinic-block--bottom-menu', footer);
  const contacts = $('.b-contacts-menu-botttom', footer);
  const blackout = $('.l-blackout', footer);

  function closeBottom() {
    clinicTab.classList.remove('active');
    clinicSheet.classList.remove('active');
    ball.parentNode.classList.remove('opened');
    contacts.classList.remove('active');
    blackout.classList.remove('active');
    lock(false);
  }
  clinicTab.addEventListener('click', () => {
    const on = !clinicTab.classList.contains('active');
    closeBottom(); closeMenu();
    if (on) { clinicTab.classList.add('active'); clinicSheet.classList.add('active'); lock(true); }
  });
  ball.addEventListener('click', () => {
    const on = !ball.parentNode.classList.contains('opened');
    closeBottom(); closeMenu();
    if (on) { ball.parentNode.classList.add('opened'); contacts.classList.add('active'); blackout.classList.add('active'); lock(true); }
  });
  blackout.addEventListener('click', closeBottom);

  $$('.js-tab-link', footer).forEach(tab => tab.addEventListener('click', () => {
    const section = tab.closest('.tabs-section');
    $$('.js-tab-link', section).forEach(t => t.classList.toggle('active', t === tab));
    $$('.tab-item', section).forEach(t => t.classList.toggle('active', t.dataset.tab === tab.dataset.tab));
  }));
})();
