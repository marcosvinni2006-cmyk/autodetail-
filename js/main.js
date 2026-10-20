/* Auto Detail | Estética Automotiva SBC */

// Número do WhatsApp (DDI + DDD + número, só dígitos). Troque aqui e vale para o site todo.
const WHATSAPP = '5511978550155';

// Mensagem usada quando um botão não define a própria em data-wa
const MENSAGEM_PADRAO = 'Olá! Vim pelo site e gostaria de um orçamento.';

document.documentElement.classList.add('js');

/* ---------- Links do WhatsApp ---------- */
function linkWhatsApp(mensagem) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem || MENSAGEM_PADRAO)}`;
}

document.querySelectorAll('[data-wa]').forEach((link) => {
  link.href = linkWhatsApp(link.dataset.wa);
  link.target = '_blank';
  link.rel = 'noopener';
});

/* ---------- Header: fundo ao rolar ---------- */
const header = document.querySelector('.header');
const atualizarHeader = () => header.classList.toggle('is-rolado', window.scrollY > 40);
atualizarHeader();
window.addEventListener('scroll', atualizarHeader, { passive: true });

/* ---------- Menu mobile ---------- */
const botaoMenu = document.querySelector('.hamburguer');
const menu = document.getElementById('menu');

function fecharMenu() {
  menu.classList.remove('is-aberto');
  botaoMenu.setAttribute('aria-expanded', 'false');
  botaoMenu.setAttribute('aria-label', 'Abrir menu');
}

botaoMenu.addEventListener('click', () => {
  const abrir = !menu.classList.contains('is-aberto');
  menu.classList.toggle('is-aberto', abrir);
  botaoMenu.setAttribute('aria-expanded', String(abrir));
  botaoMenu.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
  header.classList.add('is-rolado');
  if (!abrir) atualizarHeader();
});

menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => { fecharMenu(); atualizarHeader(); }));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fecharMenu(); });

/* ---------- Animação ao rolar ---------- */
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('is-visivel');
        observer.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach((el) => observer.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('is-visivel'));
}

/* ---------- Antes e depois ---------- */
// Pares de fotos: para adicionar um novo, coloque antes-N.jpg e depois-N.jpg em assets/img/ e um botão .aba com data-par="N"
const comparador = document.querySelector('.comparador');
if (comparador) {
  const range = comparador.querySelector('.comparador__range');
  const fotoAntes = comparador.querySelector('.comparador__antes');
  const fotoDepois = comparador.querySelector('.comparador__depois');
  const posicionar = (valor) => comparador.style.setProperty('--pos', `${valor}%`);

  range.addEventListener('input', () => posicionar(range.value));

  document.querySelectorAll('.comparador__abas .aba').forEach((aba) => {
    aba.addEventListener('click', () => {
      const par = aba.dataset.par;
      fotoAntes.src = `assets/img/antes-${par}.jpg`;
      fotoDepois.src = `assets/img/depois-${par}.jpg`;
      range.value = 50;
      posicionar(50);
      document.querySelectorAll('.comparador__abas .aba').forEach((outra) => {
        const ativa = outra === aba;
        outra.classList.toggle('is-ativa', ativa);
        outra.setAttribute('aria-pressed', String(ativa));
      });
    });
  });
}

/* ---------- Galeria com lightbox ---------- */
const lightbox = document.querySelector('.lightbox');
const itensGaleria = [...document.querySelectorAll('.galeria__item')];

if (lightbox && itensGaleria.length) {
  const imgGrande = lightbox.querySelector('.lightbox__img');
  let atual = 0;

  const mostrar = (indice) => {
    atual = (indice + itensGaleria.length) % itensGaleria.length;
    const item = itensGaleria[atual];
    imgGrande.src = item.dataset.src;
    imgGrande.alt = item.querySelector('img').alt;
  };

  itensGaleria.forEach((item, i) => item.addEventListener('click', () => {
    mostrar(i);
    lightbox.showModal();
  }));

  lightbox.querySelector('.lightbox__fechar').addEventListener('click', () => lightbox.close());
  lightbox.querySelector('.lightbox__seta--ant').addEventListener('click', () => mostrar(atual - 1));
  lightbox.querySelector('.lightbox__seta--prox').addEventListener('click', () => mostrar(atual + 1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.close(); });
  lightbox.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') mostrar(atual - 1);
    if (e.key === 'ArrowRight') mostrar(atual + 1);
  });

  // Deslizar para os lados no celular
  let inicioX = null;
  lightbox.addEventListener('touchstart', (e) => { inicioX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    if (inicioX === null) return;
    const delta = e.changedTouches[0].clientX - inicioX;
    if (Math.abs(delta) > 50) mostrar(atual + (delta < 0 ? 1 : -1));
    inicioX = null;
  });
}
