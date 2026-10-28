import { Component, ViewEncapsulation } from '@angular/core';

// Shown on the current affairs pages until daily uploads start.
// When they do, remove <ca-demo-notice/> from current-affairs.page.ts and current-affairs-day.page.ts.
@Component({
  selector: 'ca-demo-notice',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `
  <div role="note" class="mb-8 flex gap-3 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4 text-left">
    <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 text-sm font-bold text-amber-950" aria-hidden="true">!</span>
    <p class="text-sm text-amber-900 dark:text-amber-100">
      <span class="font-semibold">Note:</span> Daily current affairs start from <span class="font-semibold">1 November 2026</span>.
      The days shown now are a demo, so you can see how the quiz works.
    </p>
  </div>
  `
})
export class DemoNotice {}
