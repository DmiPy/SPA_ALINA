import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { NgForm, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

declare const bootstrap: any;


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const isNavbar = target.closest('.navbar');

    if (!isNavbar && !this.isMenuCollapsed) {
      this.closeMenu();
    }
  }
  title = 'spa_alina';

  isMobile = false;
  isScrolled = false;
  isMenuCollapsed = true;
  isSubmittingContact = false;
  isSubmittingNewsletter = false;
  contactSuccess = false;
  newsletterSuccess = false;
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
    if (section == "about") {
      this.scrollTo(section);
    } else if (section == "more_photos" && !this.isMobile) {
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

    const bootstrapModal = new (window as any).bootstrap.Modal(modal);
    bootstrapModal.show();

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
  }

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) { }

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

  onContactSubmit(form: NgForm) {
    if (form.valid && !this.isSubmittingContact) {
      this.isSubmittingContact = true;
      
      this.http.post('https://formspree.io/f/xlgweevy', form.value).subscribe({
        next: () => {
          this.isSubmittingContact = false;
          this.contactSuccess = true; 
          form.resetForm();
          
          setTimeout(() => this.contactSuccess = false, 5000);
        },
        error: () => {
          this.isSubmittingContact = false;
          alert('Something went wrong. Please try again.');
        }
      });
    }
  }

  onNewsletterSubmit(form: NgForm) {
    if (form.valid && !this.isSubmittingNewsletter) {
      this.isSubmittingNewsletter = true;

      this.http.post('https://formspree.io/f/xzdabbqp', form.value).subscribe({
        next: () => {
          this.isSubmittingNewsletter = false;
          this.newsletterSuccess = true;
          form.resetForm();
          
          setTimeout(() => this.newsletterSuccess = false, 6000);
        },
        error: () => {
          this.isSubmittingNewsletter = false;
          alert('Oops! Error subscribing.'); 
        }
      });
    }
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
  activeGalleryIndex = 0;
  currentModalId = 'photoModal';

  openGallery(index: number) {
    const item = this.photos[index];
    const prefix = item.galleryPrefix || `assets/photos_${String(index + 1).padStart(2, '0')}`;
    const count = item.galleryCount || 6;

    this.galleryImages = Array.from({ length: count }, (_, k) =>
      `${prefix}_${String(k + 1).padStart(2, '0')}.jpg`
    );

    this.activeGalleryIndex = 0;

    const modalEl = document.getElementById(this.currentModalId);
    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    setTimeout(() => {
      const carouselEl: any = document.getElementById('photoCarousel');
      try { new bootstrap.Carousel(carouselEl).to(this.activeGalleryIndex); } catch (e) { /* ignore */ }
    }, 50);
  }

}
