import { animate, state, style, transition, trigger } from '@angular/animations';
import { isPlatformBrowser } from '@angular/common';
import { Component, HostListener, ViewChild, OnInit, AfterViewInit, Inject, PLATFORM_ID, Renderer2, NgZone, ElementRef } from '@angular/core';
import { SwiperOptions, Swiper } from 'swiper';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('slideInLeft', [
      state('false', style({ opacity: 0, transform: 'translateX(-100%)'})),
      state('true', style({ opacity: 1, transform: 'translateX(0)' })),
      transition('false => true', animate('2000ms ease')),
    ]),
    trigger('slideInRight', [
      state('false', style({ opacity: 0, transform: 'translateX(100%)'})),
      state('true', style({ opacity: 1, transform: 'translateX(0)' })),
      transition('false => true', animate('2000ms ease')),
    ]),
    trigger('slideInLeftSoar', [
      state('false', style({ opacity: 0, transform: 'translateX(-70%)'})),
      state('true', style({ opacity: 1, transform: 'translateX(0)' })),
      transition('false => true', animate('2000ms ease')),
    ]),
  ]
})
export class AppComponent implements OnInit, AfterViewInit {

  sectionInView = false;

  sectionInViewSoar = false;

  animationPlayed = false; // Додаємо змінну для відстеження

  isOpen: boolean = false;

  isBrowser: boolean;

  swiperConfig: SwiperOptions = {};

  portfolioSwiperConfig: SwiperOptions = {};

  swiperConfigMobile: SwiperOptions = {};

  currentSection: string = 'home';

  activeSlideIndex: number = 0;

  sectionInViewMobile: boolean = true;

  isScreenLarge: boolean = window.innerWidth > 1512;

  @ViewChild('swiper') swiper: Swiper | undefined;

  @ViewChild('navigationSwiper') navigationSwiper: any;

  observer: IntersectionObserver | undefined;

  private aboutUsSection: HTMLElement | null = null;

  private aboutUsTexts: NodeListOf<HTMLElement> | null = null;


  constructor(@Inject(PLATFORM_ID) private platformId: Object,
  private renderer: Renderer2,
  private ngZone: NgZone,
  private el: ElementRef,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  setActiveSection(element: string) {
  this.currentSection = element;
  this.scrollToSection(element);
  }

  setupIntersectionObserver() {
    const options = {
      root: null, // вікно браузера
      threshold: 1 // Потрібно, щоб 50% секції були в полі зору
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.currentSection = entry.target.id;
        }
      });
    }, options);

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      this.observer!.observe(section);
    });
  }

  ngOnInit() {
    if (this.isBrowser) {
      const isMobile = window.innerWidth < 833;

      this.swiperConfig = {
        slidesPerView: 3,
        spaceBetween: 0,
        pagination: { clickable: true },
        on: {
          slideChange: () => {
            if (this.isBrowser && this.swiper) {
              this.activeSlideIndex = this.swiper.activeIndex || 0;
            }
          }
        },
      };

      this.portfolioSwiperConfig = {
        slidesPerView: isMobile ? 1 : 3,
        spaceBetween: 40,
        pagination: { clickable: true },
        breakpoints: {
          833: { slidesPerView: 3 },
          0: { slidesPerView: 1 },
        },
        on: {
          slideChange: () => {
            if (this.isBrowser && this.swiper) {
              this.activeSlideIndex = this.swiper.activeIndex || 0;
            }
          }
        },
      };

      this.swiperConfigMobile = {
        slidesPerView: 3,
        spaceBetween: 0,
        pagination: { clickable: true },
        on: {
          slideChange: () => {
            if (this.isBrowser && this.swiper) {
              this.activeSlideIndex = this.swiper.activeIndex || 0;
            }
          },
        }
      };
    }

    window.onbeforeunload = () => {
      window.scrollTo(0, 0);
    };
  };

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.aboutUsSection = document.querySelector('.about-us-section');
      if (this.aboutUsSection) {
        this.aboutUsTexts = this.aboutUsSection.querySelectorAll('div');
        this.handleScroll(); // Виклик вашої існуючої логіки прокручування
      }
    }

    if (this.isBrowser) {
      this.setupIntersectionObserver();
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animationPlayed) {
          this.sectionInView = true;
          this.sectionInViewSoar = true;
          this.animationPlayed = true; // Запам'ятовуємо, що анімація була виконана
        }
      });
    });

    const section = document.querySelector('#about-us');
    if (section) {
      observer.observe(section);
    }
  }

@HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event): void {
    if (this.isBrowser) {
      this.updateCurrentSection();
      this.handleScroll();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.isScreenLarge = window.innerWidth < 1512;
  }

  updateCurrentSection() {
    if (this.isBrowser) {
      const sections = document.querySelectorAll('section');
      let current = '';

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 76) {
          current = section.getAttribute('id')!;
        }
      });

      this.currentSection = current;

      if (this.currentSection === 'services') {
        this.navigationSwiper.swiperRef.slideTo(this.navigationSwiper.swiperRef.slides.length - 1);
      } else if (this.currentSection === 'hello') {
        this.navigationSwiper.swiperRef.slideTo(0);
      }
    }
  }

  handleScroll() {
    if (!this.isBrowser || !this.aboutUsSection || !this.aboutUsTexts) return;

    const sectionTop = this.aboutUsSection.getBoundingClientRect().top;
    const sectionHeight = this.aboutUsSection.offsetHeight;
    const windowHeight = window.innerHeight;

    if (sectionTop <= windowHeight / 2 && sectionTop + sectionHeight >= windowHeight / 2) {
      this.aboutUsTexts.forEach((text) => {
        text.classList.add('scrolled');
      });
    } else {
      this.aboutUsTexts.forEach((text) => {
        text.classList.remove('scrolled');
      });
    }

  }

  scrollToSection(section: string) {
    if (this.isBrowser) {
      document.getElementById(section)!.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToTop() {
    if (this.isBrowser) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  onSwiperDragMove() {
    if (this.isBrowser && this.swiper) {
      const activeIndex = this.swiper.activeIndex;
      if (activeIndex !== undefined && activeIndex !== null) {
        this.activeSlideIndex = activeIndex;
      }
    }
  }

  onSwiper(swiper: Swiper) {
    if (this.isBrowser) {
      this.swiper = swiper;
    }
  }

  goToSlide(index: number) {
    if (this.isBrowser && this.swiper) {
      this.swiper.slideTo(index);
      this.activeSlideIndex = index;
    }
  }

  scrollToActiveRectangle() {
    if (this.isBrowser) {
      const activeRect = document.getElementById(`rect${this.activeSlideIndex + 1}`);
      if (activeRect) {
        activeRect.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }

  toggleForm() {
    this.isOpen = !this.isOpen;
  }

}
