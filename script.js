'use strict';

// Модальное окно
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
// Плавный скролл к секции
const btnScroll = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
// Плавный скрол навигации сайта
const navLinks = document.querySelector('.nav__links');
// Табы
const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////

// Модальное окно
const openModal = function (e) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

btnsOpenModal.forEach(function (val) {
    val.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});

// Реализация плавного скрола к section--1
btnScroll.addEventListener('click', function (e) {
    // // Вычисляем координаты секции относительно окна браузера
    // const sectionCoordinates = section1.getBoundingClientRect();

    // window.scrollTo({
    //   top: sectionCoordinates.y + window.pageYOffset,
    //   behavior: 'smooth',
    // });
    section1.scrollIntoView({ behavior: 'smooth' });
});

// Реализация плавного скрола навигации сайта(делегирование события(event delegation))
navLinks.addEventListener('click', function (e) {
    e.preventDefault();
    const elemId = e.target.getAttribute('href');
    document.querySelector(elemId)?.scrollIntoView({ behavior: 'smooth' });
});

// Реализация табов(делегирование события(event delegation))
tabsContainer.addEventListener('click', function (e) {
    // "Источник" события
    const activeBtn = e.target.closest('.operations__tab');

    // "Защитное предложение"(Guard Clause)
    if (!activeBtn) return;

    tabs.forEach(function (el) {
        el.classList.remove('operations__tab--active');
    });
    activeBtn.classList.add('operations__tab--active');

    // Получаем "активный" контент таба
    const activeContent = document.querySelector(
        `.operations__content--${activeBtn.getAttribute('data-tab')}`
    );

    tabsContent.forEach(function (el) {
        el.classList.remove('operations__content--active');
    });
    activeContent.classList.add('operations__content--active');
});
