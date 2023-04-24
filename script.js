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
// Анимация навигационного меню
const nav = document.querySelector('nav');
// "Липкое" меню
const header = document.querySelector('header');
// Анимация проявления секций при скролле
const allSections = document.querySelectorAll('.section');
// Ленивая прогрузка рисунков
const lazyImg = document.querySelectorAll('img[data-src]');
// Слайдер
const sliderContainer = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const sliderBtnLeft = document.querySelector('.slider__btn--left');
const sliderBtnRight = document.querySelector('.slider__btn--right');
const dotsContainer = document.querySelector('.dots');

///////////////////////////////////////

// Реализация модального окна
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

//Реализация анимации меню навигации(выцветание(fade animation))(Делегирование события)
const changeOpacity = function (e) {
    // Отсев ненужных событии
    if (e.target.classList.contains('nav__link')) {
        // Выбираем "инициатора" события
        const activeLink = e.target;
        const linkSiblings = activeLink
            .closest('.nav')
            .querySelectorAll('.nav__link');

        const logo = activeLink.closest('.nav').querySelector('img');

        linkSiblings.forEach((el) => {
            // Меняем прозрачность всех линков, кроме активного
            if (el !== activeLink) {
                el.style.opacity = this;
            }
        });
        logo.style.opacity = this;
    }
};
// Анимация выцветания при наведении
nav.addEventListener('mouseover', changeOpacity.bind(0.5));
// Убираем анимацию
nav.addEventListener('mouseout', changeOpacity.bind(1));

//Реализация "липкого" навигационного меню(Intersection Observer API)
const stickyCallback = function (entries, observer) {
    const [entriesSticky] = entries;
    entriesSticky.isIntersecting
        ? nav.classList.remove('sticky')
        : nav.classList.add('sticky');
};

const stickyOptions = {
    root: null,
    threshold: 0,
    rootMargin: `-${nav.getBoundingClientRect().height}px`,
};

const stickyObserver = new IntersectionObserver(stickyCallback, stickyOptions);
stickyObserver.observe(header);

// Реализация анимации проявления секций при скролле(reveal)
const revealCallback = function (entries, observer) {
    const [entriesReveal] = entries;

    if (!entriesReveal.isIntersecting) return;

    entriesReveal.target.classList.remove('section--hidden');
    observer.unobserve(entriesReveal.target);
};

const revealOptions = {
    root: null,
    threshold: 0.2,
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

allSections.forEach(function (el) {
    el.classList.add('section--hidden');
    revealObserver.observe(el);
});

// Реализация ленивой прогрузки рисунков(lazy loading)
const lazyImgCallback = function (entries, observer) {
    const [lazyImgEntries] = entries;

    if (!lazyImgEntries.isIntersecting) return;

    const imgTarget = lazyImgEntries.target;
    imgTarget.src = lazyImgEntries.target.dataset.src;
    imgTarget.addEventListener('load', function () {
        imgTarget.classList.remove('lazy-img');
    });

    observer.unobserve(imgTarget);
};

const lazyImgOptions = {
    root: null,
    treshold: 0,
    rootMargin: '200px',
};

const lazyImgObserver = new IntersectionObserver(
    lazyImgCallback,
    lazyImgOptions
);

lazyImg.forEach(function (el) {
    lazyImgObserver.observe(el);
});

// Реализация слайдера
// Условно хранит значение текущего слайда
let currSlide = 0;

// Основная логика переключения слайда
const moveSlides = function (slide) {
    slides.forEach((el, i) => {
        el.style.transform = `translateX(${(i - slide) * 100}%)`;
    });
};

// Создаем "точки" под слайдером
const createDots = function () {
    slides.forEach(function (_, i) {
        // Создаем точки внутри контейнера точек
        dotsContainer.insertAdjacentHTML(
            'beforeend',
            `<button class="dots__dot" data-slide="${i}"></button>`
        );
    });
};

// Задает активную точку
const setActiveDot = function (currSlide) {
    // Убираем активность со всех точек
    document.querySelectorAll('.dots__dot').forEach(function (el) {
        el.classList.remove('dots__dot--active');
    });

    // Назначаем активную точку
    document
        .querySelector(`.dots__dot[data-slide="${currSlide}"]`)
        .classList.add('dots__dot--active');
};

// Следующий слайд
const nextSlide = function () {
    currSlide === slides.length - 1 ? (currSlide = 0) : currSlide++;
    moveSlides(currSlide);
    setActiveDot(currSlide);
};
// Предыдущий слайд
const prevSlide = function () {
    currSlide === 0 ? (currSlide = slides.length - 1) : currSlide--;
    moveSlides(currSlide);
    setActiveDot(currSlide);
};

// Инициализируем слайдер
const initAll = function () {
    // Задаем состояние слайдов по-умолчанию
    moveSlides(0);
    // Создаем "точки" под слайдами
    createDots();
    // Применяем класс активности к "точке"
    setActiveDot(currSlide);
};

initAll();

//Смена слайда при нажатии кнопок
sliderBtnRight.addEventListener('click', nextSlide);
sliderBtnLeft.addEventListener('click', prevSlide);

//Смена слайда при нажатии "стрелок"
document.addEventListener('keydown', function (e) {
    // Сокращенная оценка(Short Circuiting)
    e.key === 'ArrowRight' && nextSlide();
    e.key === 'ArrowLeft' && prevSlide();
});

//Смена слайда при нажатии на точки под слайдером(делегирование событий)
dotsContainer.addEventListener('click', function (e) {
    e.preventDefault();
    // Фильтр от  не нужных событий(Guard Clause)
    if (!e.target.classList.contains('dots__dot')) return;

    // Перемещаем слайд по кликнутой "точке"
    moveSlides(e.target.dataset.slide);
    // Применяем класс активности к "точке"
    setActiveDot(e.target.dataset.slide);
});
