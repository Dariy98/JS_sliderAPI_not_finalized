//===================================
//===================================
class Carousel {
  constructor(element, config = {}) {
    this.element = element;
    this.config = { ...config };
    this.slides = null;
    this.slidesContainer = null;
    this.previousIndex = null;
    this.activeIndex = null;
    this.nextIndex = null;
    this.isBeginning = null;
    this.isEnd = null;
    this.indicators = null;
    this.buttonPrev = document
      .querySelector('[data-slide="prev"]')
      .addEventListener("click", () => {
        this.slidePrev();
      });
    this.buttonNext = document
      .querySelector('[data-slide="next"]')
      .addEventListener("click", () => {
        this.slideNext();
      });
    this.time = null;
  }

  init() {
    this.slides = this.element.querySelectorAll(".carousel-item");
    this.slidesContainer = this.element.querySelector(".carousel-inner");
    this.indicators = document.querySelectorAll('[data-target="#carousel"]');

    if (!this.element.querySelector(".carousel-item.active")) {
      if (this.slides[0]) {
        this.slides[0].classList.add("active");
      }
    }

    this.slides.forEach((slide, currentIndex) => {
      if (slide.classList.contains("active")) {
        if (currentIndex === 0) {
          this.isBeginning = true;
        } else {
          this.isBeginning = false;
        }

        if (currentIndex === this.slides.length - 1) {
          this.isEnd = true;
        } else {
          this.isEnd = false;
        }

        this.activeIndex = currentIndex;
        this.previousIndex =
          currentIndex === 0 ? this.slides.length - 1 : currentIndex - 1;
        this.nextIndex =
          currentIndex === this.slides.length - 1 ? 0 : currentIndex + 1;
      }
    });

    // console.log(this);
  }
  reInit() {
    this.init();
  }
  setOptions(config) {
    this.config = { ...this.config, ...config };
    if (this.config.pause === "hover") this.hover();
    if (this.config.interval === false) this.interval = 0;
    if (this.config.ride === true) this.ride();
    else return;
  }
  hover() {
    this.element.addEventListener("mouseenter", () => {
      console.log("mouse");
      clearInterval(this.time);
    });
    this.element.addEventListener("mouseleave", () => {
      console.log("mouseOUT");
      clearInterval(this.time);
      this.autoScroll();
    });
  }
  autoScroll() {
    this.time = setInterval(() => this.slideNext(), this.config.interval);
  }
  ride() {
    document
      .querySelector('[data-slide="next"]')
      .addEventListener("click", () => {
        this.autoScroll();
      });
  }
  slidePrev() {
    if (!this.config.wrap && this.isBeginning) {
      return;
    }
    this.slideTo(this.previousIndex);
  }
  slideNext() {
    if (!this.config.wrap && this.isEnd) {
      return;
    }

    this.slideTo(this.nextIndex);
  }
  slideTo(index) {
    if (this.slides[index]) {
      this.slides[this.activeIndex].classList.remove("active");
      this.slides[index].classList.add("active");
      this.indicators[this.activeIndex].classList.remove("active");
      this.indicators[index].classList.add("active");
    } else {
      console.log(`${index} - not found`);
    }
    this.reInit();
    this.on("slideChange");
  }
  insetSlide(position, element) {
    let elementOfString =
      typeof element === "string" ? element : element.join("");

    const slide =
      position === "afterend"
        ? this.slides[this.slides.length - 1]
        : this.slides[0];

    slide.insertAdjacentHTML(position, elementOfString);

    this.insetLi();
    this.reInit();
  }
  insetLi() {
    const li = '<li data-target="#carousel"></li>';

    this.indicators[this.indicators.length - 1].insertAdjacentHTML(
      "afterend",
      li
    );
    //костыли от двух лишних индикаторов которые берутся непонятно откуда при вставке слайда
    if (this.slides.length < this.indicators.length) {
      this.indicators.forEach((indicator, i) => {
        if (i > this.slides.length - 2) indicator.remove();
      });
    }

    this.reInit();
  }
  appendSlide(element) {
    this.insetSlide("afterend", element);
    this.insetLi();
  }
  prependSlide(element) {
    this.insetSlide("beforebegin", element);
    this.insetLi();
  }
  removeSlide(index) {
    const indexes = typeof index === "number" ? [index] : index;

    indexes.forEach(index => {
      const slide = this.slides[index];
      if (slide) {
        slide.remove();
      }
      const li = this.indicators[index];
      if (li) {
        li.remove();
      }
    });
    this.removeLi(index);
    this.ifOneSlide();
    this.reInit();
  }
  removeLi(index) {
    const indexes = typeof index === "number" ? [index] : index;
    indexes.forEach(index => {
      const li = this.indicators[index];
      if (li) {
        li.remove();
      }
    });

    this.reInit();
  }
  ifOneSlide() {
    if (this.indicators.length === 1)
      this.indicators[0].classList.add("active");
    this.reInit();
  }
  on(string, func) {
    if (string === "init") {
      this.init();
      console.log(this);
    }
    if (string === "slideChange") {
      this.init();
      console.log(
        this.previousIndex,
        this.activeIndex,
        this.nextIndex,
        this.isBeginning,
        this.isEnd
      );
    }
  }
}

const carousel = new Carousel(document.querySelector(".carousel"), {
  pause: false,
  ride: true,
  interval: 3000,
  wrap: true
});
carousel.setOptions({
  pause: "hover",
  ride: true
});

// // Методы

// --------------------------------------------------------

// Инициализирует карусель

carousel.init();

// Инициализирует карусель с дополнительными опциями

// carousel.setOptions({
//   ride: false,
//   pause: "hover"
// });

// Предыдущий слайд (нужно учесть параметр wrap)

// carousel.slidePrev();

// Следующий слайд (нужно учесть параметр wrap)

// carousel.slideNext();

// Cлайд по индексу

// carousel.slideTo(2);

// Добавить новые слайды в конец. slides может быть HTMLElement или строка HTML с новым слайдом или массив с такими слайдами, например:

// carousel.appendSlide(
//   '<div class="carousel-item"><img class="d-block w-100" src="https://via.placeholder.com/800x400/?text=3 slide" alt="Fourth slide"/></div>'
// );

// carousel.appendSlide([
//   '<div class="carousel-item"><img class="d-block w-100" src="https://via.placeholder.com/800x400/?text=40 slide" alt="Five slide"/></div>',
//   '<div class="carousel-item"><img class="d-block w-100" src="https://via.placeholder.com/800x400/?text=500 slide" alt="Six slide"/></div>'
// ]);
// Добавьте новые слайды
// carousel.appendSlide(
//   '<div class="carousel-item"><img class="d-block w-100" src="https://via.placeholder.com/800x400/?text=1000 slide" alt="Fourth slide"/></div>'
// );
// carousel.appendSlide(
//   '<div class="carousel-item"><img class="d-block w-100" src="https://via.placeholder.com/800x400/?text=1001 slide" alt="Fourth slide"/></div>'
// );
// carousel.appendSlide([
//   '<div class="carousel-item"><img class="d-block w-100" src="https://via.placeholder.com/800x400/?text=42 slide" alt="Five slide"/></div>',
//   '<div class="carousel-item"><img class="d-block w-100" src="https://via.placeholder.com/800x400/?text=566 slide" alt="Six slide"/></div>'
// ]);
// carousel.appendSlide(
//   '<div class="carousel-item"><img class="d-block w-100" src="https://via.placeholder.com/800x400/?text=1101 slide" alt="Fourth slide"/></div>'
// );

// Удалить выбранные слайды. slideIndex это может быть число с индексом слайда для удаления или массив с индексами, например:
// carousel.removeSlide([0, 1]);
// carousel.removeSlide(0);
// Свойства

// --------------------------------------------------------

// коллекции слайдов HTML-элементов

// console.log(carousel.slides);

// Номер индекса предыдущего активного слайда

// console.log(carousel.previousIndex);

// Номер индекса следующего активного слайда

// console.log(carousel.nextIndex);

// Номер индекса текущего активного слайда

// console.log(carousel.activeIndex);

// истина, если в начале

// console.log(carousel.isBeginning);

// истина, если в конце

// console.log(carousel.isEnd);

// События

// --------------------------------------------------------

// Событие будет запущено сразу после инициализации Carousel

carousel.on("init", function() {
  /* do something */
});

// Событие будет запущено при изменении текущего активного слайда

carousel.on("slideChange", function() {
  /* do something */
});
