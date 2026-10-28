import { Component, ElementRef, OnInit, PLATFORM_ID, Renderer2, ViewEncapsulation, effect, inject } from '@angular/core';
import { Navbar } from '@layout/navbar/navbar';
import { ScrollToTop } from '@shared/components/scroll-to-top/scroll-to-top';
import { RouterOutlet } from '@angular/router';
import { Footer } from '@layout/footer/footer';
import { ThemeService } from '@core/services/theme.service';
import { DOCUMENT, NgClass, isPlatformBrowser } from '@angular/common';
import { environment } from '@env/environment';
@Component({
  selector: 'app',
  template: `
  <navbar/>
    <main class="max-w-screen-lg mx-auto px-4 md:px-10 my-28 overflow-x-hidden min-h-screen">
      <router-outlet/>
      <scroll-to-top/>
    </main>
  <foot-note/>
  `,
  imports: [Footer, RouterOutlet, Navbar, ScrollToTop, NgClass],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class App implements OnInit {
  elementRef = inject(ElementRef)
  theme = inject(ThemeService)
  renderer = inject(Renderer2)
  document: Document = inject(DOCUMENT);
  platformId = inject(PLATFORM_ID);

  constructor(){
    effect(() => {
      this.elementRef.nativeElement.style.setProperty(`--primary-color`, this.theme.getColor())
      // The early color from index.html is no longer needed (and would override later changes).
      this.document.getElementById('theme-color-preload')?.remove();
    })
  }
  ngOnInit(): void {
    this.elementRef.nativeElement.removeAttribute("ng-version");
    this.elementRef.nativeElement.removeAttribute("ng-server-context");

    // Browser only: otherwise prerendered pages already contain the tag and it loads twice.
    if(environment.production && environment.umamiWebsiteId && isPlatformBrowser(this.platformId)){
      const script = this.renderer.createElement('script');
      script.defer = true;
      script.src = 'https://cloud.umami.is/script.js';
      script.setAttribute('data-website-id', environment.umamiWebsiteId);
      this.renderer.appendChild(this.document.head, script);
    }
  }

}
