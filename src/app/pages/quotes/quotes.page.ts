import { Component, ViewEncapsulation, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MetaService } from '@core/services/meta.service';
import profileData from '@data/profile.data';
import quotesData from '@data/quotes.data';
import { QuoteCategory, QuoteSchema } from '@data/schema/quote.schema';

type Tab = 'All' | QuoteCategory;

// A Substack-style reading page for quotes: serif text, one column, section tabs.
@Component({
  selector: 'quotes-page',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [RouterLink],
  template: `
  <div class="mx-auto max-w-2xl">
    <header class="flex flex-col items-center gap-3 border-b border-gray-200 dark:border-gray-800 pb-8 text-center">
      <span class="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-500 font-serif text-4xl text-white" aria-hidden="true">“</span>
      <h1 class="font-serif text-3xl font-bold tracking-tight text-gray-900 dark:text-white lg:text-4xl">Quotes</h1>
      <p class="max-w-md text-gray-600 dark:text-gray-400">Lines that shaped how I build systems and how I live. Collected by {{ name }}.</p>
      <p class="text-sm text-gray-500 dark:text-gray-500">{{ quotes.length }} quotes</p>
    </header>

    <nav class="flex gap-6 overflow-x-auto border-b border-gray-200 dark:border-gray-800 text-sm font-medium" aria-label="Quote categories">
      @for (tab of tabs; track tab) {
      <button type="button" (click)="active.set(tab)" [attr.aria-pressed]="active() === tab"
        class="-mb-px whitespace-nowrap border-b-2 py-3 transition-colors"
        [class]="active() === tab
          ? 'border-primary-500 text-gray-900 dark:text-white'
          : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'">
        {{ tab }}
      </button>
      }
    </nav>

    @if (featured(); as quote) {
    <figure class="mt-10 rounded-xl border-l-4 border-primary-500 bg-primary-50 dark:bg-gray-800/60 p-6 sm:p-8">
      <p class="mb-4 text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400">Featured · {{ quote.category }}</p>
      <blockquote class="font-serif text-2xl italic leading-snug text-gray-900 dark:text-white sm:text-3xl">“{{ quote.text }}”</blockquote>
      <figcaption class="mt-5 text-sm text-gray-600 dark:text-gray-300">
        <span class="font-semibold text-gray-900 dark:text-white">{{ quote.author }}</span>
        @if (quote.source) { <span> · {{ quote.source }}</span> }
      </figcaption>
      @if (quote.note) { <p class="mt-3 text-sm text-gray-600 dark:text-gray-400">{{ quote.note }}</p> }
    </figure>
    }

    <ul class="mt-6">
      @for (quote of list(); track quote.text) {
      <li class="border-b border-gray-200 dark:border-gray-800 py-8">
        <p class="mb-3 text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400">{{ quote.category }}</p>
        <blockquote class="font-serif text-xl leading-relaxed text-gray-900 dark:text-gray-100 sm:text-2xl">“{{ quote.text }}”</blockquote>
        <div class="mt-4 flex items-center justify-between gap-4">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            <span class="font-semibold text-gray-900 dark:text-white">{{ quote.author }}</span>
            @if (quote.source) { <span> · {{ quote.source }}</span> }
          </p>
          <button type="button" (click)="copy(quote)"
            class="shrink-0 rounded-full border border-gray-300 dark:border-gray-700 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 transition-colors hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
            {{ copied() === quote.text ? 'Copied!' : 'Copy' }}
          </button>
        </div>
        @if (quote.note) { <p class="mt-3 text-sm text-gray-600 dark:text-gray-400">{{ quote.note }}</p> }
      </li>
      } @empty {
      <li class="py-12 text-center text-gray-500 dark:text-gray-400">No quotes here yet.</li>
      }
    </ul>

    <div class="my-12 rounded-xl border border-gray-200 dark:border-gray-800 p-6 text-center">
      <p class="font-serif text-xl font-semibold text-gray-900 dark:text-white">Got a quote I should read?</p>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Send me the line that changed how you work.</p>
      <a routerLink="/about" fragment="contact" class="mt-4 inline-block rounded-lg bg-primary-500 px-5 py-2 text-sm font-medium text-white hover:bg-primary-600">Send a message</a>
    </div>
  </div>
  `
})
export class QuotesPage {
  name = profileData.name;
  quotes = quotesData;
  tabs: Tab[] = ['All', ...new Set(quotesData.map(quote => quote.category))];
  active = signal<Tab>('All');
  copied = signal<string | null>(null);
  metaService = inject(MetaService);

  // The featured quote shows on the "All" tab and on its own category's tab.
  featured = computed(() => quotesData.find(quote =>
    quote.featured && (this.active() === 'All' || this.active() === quote.category)));
  list = computed(() => quotesData.filter(quote =>
    quote !== this.featured() && (this.active() === 'All' || quote.category === this.active())));

  constructor() {
    this.metaService.setMetaTags(
      `Quotes - ${profileData.name}`,
      'Quotes on DevOps, engineering and life that shaped how I build systems and how I live.',
      ['quotes', 'devops quotes', 'engineering quotes', 'programming quotes', 'jayesh hadiya']
    );
  }

  copy(quote: QuoteSchema): void {
    navigator.clipboard?.writeText(`“${quote.text}” — ${quote.author}`).then(() => {
      this.copied.set(quote.text);
      setTimeout(() => this.copied.set(null), 2000);
    });
  }
}
