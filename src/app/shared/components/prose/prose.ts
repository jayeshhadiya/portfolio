import { Component, ElementRef, effect, inject, input } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CoreModule } from '@core/core.module'
import { PlatformCheckService } from '@core/services/platform-check.service';
import mediumZoom from 'medium-zoom';
@Component({
  selector: 'prose',
  standalone: true,
  imports: [CoreModule],
  host: { '(click)': 'onClick($event)' },
  template: `<article class="prose lg:prose-xl max-w-full dark:prose-invert dark:prose-pre:bg-gray-700 prose-code:before:content-none prose-code:after:content-none prose-table:block prose-table:overflow-x-auto"
  [innerHTML]="data() | markdown | safe: 'html'">
</article>`,
})
export class Prose {
  data = input<string | null>();
  el = inject(ElementRef);
  document = inject(DOCUMENT);
  platformCheck = inject(PlatformCheckService);
  constructor(){
    effect(() => {
      if(this.platformCheck.onBrowser){
        mediumZoom(this.el.nativeElement.querySelectorAll("img"), {
          margin: 40,
          scrollOffset: 40
        });
      }
    })
  }

  // The markdown HTML isn't compiled by Angular, so its buttons and links are handled here.
  onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const copyButton = target.closest<HTMLButtonElement>('.copy-code');
    if (copyButton) {
      const code = copyButton.parentElement?.querySelector('code')?.textContent ?? '';
      navigator.clipboard?.writeText(code).then(() => {
        copyButton.textContent = 'Copied!';
        setTimeout(() => copyButton.textContent = 'Copy', 2000);
      });
      return;
    }
    // With <base href="/"> a plain "#id" link would go to the home page, so scroll in place instead.
    const anchor = target.closest<HTMLAnchorElement>('a[href^="#"]');
    if (anchor) {
      event.preventDefault();
      const id = anchor.getAttribute('href')!.slice(1);
      this.document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      history.replaceState(history.state, '', `${location.pathname}#${id}`);
    }
  }
}
