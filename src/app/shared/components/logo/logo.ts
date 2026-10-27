import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'logo',
  imports: [RouterLink],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  template: `
  <a routerLink="/" aria-label="Brand">
    <svg class="hover:text-primary" width="25" height="25" viewBox="0 0 9 8" fill="none">
      <path d="M1 1H3.5V7H1V5.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M5 1V7M8 1V7M5 4H8" stroke="currentColor" stroke-linecap="round" />
    </svg>
  </a>
`
})
export class Logo {}
