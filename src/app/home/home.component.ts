import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare const bootstrap: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
      const target = event.target as HTMLElement;
      const isNavbar = target.closest('.navbar'); // Проверяем, был ли клик внутри навбара

      // Если клик был ВНЕ навбара и меню сейчас открыто — закрываем
      if (!isNavbar && !this.isMenuCollapsed) {
        this.closeMenu();
      }
    }
  title = 'spa_alina';

  isMobile = false;
  isScrolled = false;
  isMenuCollapsed = true;
  private scrollTimer: any;

  expanded = {
    about: false,
    accordion01: false,
    accordion02: false,
    accordion03: false,
    more_photos: false,
    
  };

  contactForm!: FormGroup;
  submitted = false;
  sending = false;
  success = false;
  error = false;

  toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    this.updateScrollState();
  }

  closeMenu() {
    this.isMenuCollapsed = true;
    this.updateScrollState();
  }

  toggle(section: keyof typeof this.expanded) {
    console.log(section)
    if(section == "about"){
      this.scrollTo(section);
    } else if(section == "more_photos" && !this.isMobile) {
      this.scrollTo("photos");
    }
    this.expanded[section] = !this.expanded[section];
  }

  scrollTo(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (!el) return;

    el.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }



  openVideo(url: string) {
    const modal: any = document.getElementById('videoModal');
    const iframe: any = document.getElementById('videoFrame');
 
    iframe.src = url + "?autoplay=1";

    // Открыть модальное окно
    const bootstrapModal = new (window as any).bootstrap.Modal(modal);
    bootstrapModal.show();

    // Когда закрывается — остановить видео
    modal.addEventListener('hidden.bs.modal', () => {
      iframe.src = "";
    });
  }
  reviews = [
    {
      source: "Teatro Massimo Bellini Di Catania, Italy 2024",
      textDesktop: `“Alina Tkachuk, nel ruolo di Gilda, si è mostrata una splendida interprete, che ha affrontato la sua parte 
      con delicatezza e purezza sonora, catturando il pubblico. La sua voce, fresca e cristallina, ha dato vita a momenti 
      toccanti, culminando in un “Caro nome” che ha evidenziato non solo la sua tecnica sopraffina, ma anche la sua capacità 
      di suscitare un'emozione profonda. La presenza scenica di Tkachuk, unita alla sua recitazione sincera e vulnerabile, 
      ha reso Gilda un personaggio indimenticabile.”`,
      textMobile: `“Alina Tkachuk, nel ruolo di Gilda, si è mostrata una splendida interprete, che ha affrontato la sua parte con 
      delicatezza e purezza sonora, catturando il pubblico. La sua voce, fresca e cristallina, ha dato vita a momenti toccanti,
      culminando in un ‘Caro nome’ che ha evidenziato non solo la sua tecnica sopraffina, ma anche la sua capacità di 
      suscitare un'emozione profonda.”`
    },
    {
      source: "Teatro Massimo Bellini Di Catania, Italy 2025",
      textDesktop: `"L'opera, resa attuale e godibile anche per il pubblico contemporaneo, ha brillato per la freschezza della 
      regia musicale e l'interpretazione vivace di Alina Tkachuk, soprano di grande temperamento, che ha incantato il 
      pubblico con una vocalità calda e raffinata.."`,
      textMobile: `"L'opera, resa attuale e godibile anche per il pubblico contemporaneo, ha brillato per la freschezza della 
      regia musicale e l'interpretazione vivace di Alina Tkachuk, soprano di grande temperamento, che ha incantato il 
      pubblico con una vocalità calda e raffinata.."`,
    },
    {
      source: "Puginci Festival - Torre Del Lago, Italy 2025",
      textDesktop: `""Die Liu von Alina Tkachuk
      kann an diesem Abend am meisten überzeugen. Schön führt die junge Ukrainerin die Melodie ihrer großen Liebesarie, 
      gefühlvoll drückt sie ihre Stimmungen aus, die sie bestens abgestuft in ihre Stimme überträgt.
      Mühelos bleibt sie in der Höhe. Ihr Opfer für die Liebe wirkt auch in den begeisterten Zuschauerraum.""`,
      textMobile: `""Die Liu von Alina Tkachuk
      kann an diesem Abend am meisten überzeugen. Schön führt die junge Ukrainerin die Melodie ihrer großen Liebesarie, 
      gefühlvoll drückt sie ihre Stimmungen aus, die sie bestens abgestuft in ihre Stimme überträgt.
      Mühelos bleibt sie in der Höhe. Ihr Opfer für die Liebe wirkt auch in den begeisterten Zuschauerraum.""`,
    }
  ];

  currentReview = 0;

  prevReview() {
    this.currentReview =
      (this.currentReview - 1 + this.reviews.length) % this.reviews.length;
  }

  nextReview() {
    this.currentReview =
      (this.currentReview + 1) % this.reviews.length;
  }

  @HostListener('window:scroll')
  updateScrollState() {
    this.isScrolled = true;

    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
    }

    this.scrollTimer = setTimeout(() => {
      this.isScrolled = false;
    }, 400);
  }

  @HostListener('window:resize')
  checkMobile() {
    this.isMobile = window.innerWidth < 992;
    console.log(this.isMobile)

  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.checkMobile();
    this.updateScrollState();

    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]],
      hp: ['']
    });

    this.photos.forEach(p => {
      const img = new Image();
      img.src = p.saturated;
    });
  }

  get f() {
    return this.contactForm.controls;
  }

  async onSubmit() {
    this.submitted = true;
    this.success = false;
    this.error = false;

    if (this.contactForm.invalid) return;

    // Пока заглушка: имитируем отправку (без бекенда).
    this.sending = true;
    setTimeout(() => {
      this.sending = false;
      this.success = true;
      this.contactForm.reset();
      this.submitted = false;
    }, 800);
  }

  photos = [
    { normal: 'assets/photos_01.jpg', saturated: 'assets/photos_01_saturated.jpg', galleryPrefix: 'assets/photos_01', galleryCount: 15 },
    { normal: 'assets/photos_02.jpg', saturated: 'assets/photos_02_saturated.jpg', galleryPrefix: 'assets/photos_02', galleryCount: 7 },
    { normal: 'assets/photos_03.jpg', saturated: 'assets/photos_03_saturated.jpg', galleryPrefix: 'assets/photos_03', galleryCount: 18 },
    { normal: 'assets/photos_04.jpg', saturated: 'assets/photos_04_saturated.jpg', galleryPrefix: 'assets/photos_04', galleryCount: 7 },
    { normal: 'assets/photos_05.jpg', saturated: 'assets/photos_05_saturated.jpg', galleryPrefix: 'assets/photos_05', galleryCount: 8 },
    { normal: 'assets/photos_06.jpg', saturated: 'assets/photos_06_saturated.jpg', galleryPrefix: 'assets/photos_06', galleryCount: 11 },
    { normal: 'assets/photos_07.jpg', saturated: 'assets/photos_07_saturated.jpg', galleryPrefix: 'assets/photos_07', galleryCount: 9 },
    { normal: 'assets/photos_08.jpg', saturated: 'assets/photos_08_saturated.jpg', galleryPrefix: 'assets/photos_08', galleryCount: 12 },
    { normal: 'assets/photos_09.jpg', saturated: 'assets/photos_09_saturated.jpg', galleryPrefix: 'assets/photos_09', galleryCount: 10 },
  ];

  photos_titles = [
    ["Teatro Coccia", "Italy  2025"],
    ["Teatro Massimo Bellini", "Italy  2025"],
    ["Teatro Massimo Bellini", "Italy  2024"],
    ["Staatstheater Cottbus", "Germany 2022-2024"],
    ["Opera på Skäret", "Sweden 2023"],
    ["Opernhaus Odessa", "Ukraine  2023"],
    ["Opernhaus Odessa", "Ukraine  2022"],
    ["Opernhaus Odessa", "Ukraine  2022"],
    ["The Netherlands Tour", "2022"]
  ]

  photos_descriptions = [
    "Giulia — “La scala di seta” (Rossini)",
    "Lucy — “The Telephone” (Menotti)",
    "Gilda — “Rigoletto” (Verdi)",
    "Musetta — “La bohème” (Puccini)",
    "Gilda — “Rigoletto” (Verdi)",
    "Gilda — “Rigoletto” (Verdi)",
    "Rosina “Il barbiere di Siviglia” (Rossini)",
    "Concerts & Galas",
    "“Carmina Burana” (K.Orff)",
  ]

  hoveredPhoto: number | null = null;
  activePhoto = 0
  galleryImages: string[] = [];
  activeGalleryIndex = 0;         // стартовый слайд в modal
  currentModalId = 'photoModal';  // id modal (можно оставить статическим)

  // index = индекс thumbnail (0..8)
  openGallery(index: number) {
    const item = this.photos[index];
    const prefix = item.galleryPrefix || `assets/photos_${String(index+1).padStart(2,'0')}`;
    const count = item.galleryCount || 6;

    // Собираем имена: prefix_01.jpg, prefix_02.jpg, ...
    this.galleryImages = Array.from({length: count}, (_, k) =>
      `${prefix}_${String(k+1).padStart(2, '0')}.jpg`
    );

    this.activeGalleryIndex = 0;

    // Открываем modal
    const modalEl = document.getElementById(this.currentModalId);
    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    // После открытия и рендера инициализируем Carousel (чтобы bootstrap корректно работал)
    // Убедимся, что DOM обновился
    setTimeout(() => {
      // Инициализируем/рестартуем карусель с автоплей отключён
      const carouselEl: any = document.getElementById('photoCarousel');
      // уничтожим предыдущую, если есть (безопасно)
      try { new bootstrap.Carousel(carouselEl).to(this.activeGalleryIndex); } catch (e) { /* ignore */ }
      // чтобы контролы работали — можно создать экземпляр
      //const carousel = new bootstrap.Carousel(carouselEl, { interval: false });
      //carousel.to(this.activeGalleryIndex);
    }, 50);
  }
}
