import { Component, ViewEncapsulation, computed, effect, inject, signal } from '@angular/core';
import { DatePipe, formatDate } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MetaService } from '@core/services/meta.service';
import profileData from '@data/profile.data';
import currentAffairsData from '@data/current-affairs.data';
import { DatePicker } from '@pages/current-affairs/date-picker';
import { DemoNotice } from '@pages/current-affairs/demo-notice';

// One day's quiz at /current-affairs/YYYY-MM-DD. An unknown date shows the 404 page.
@Component({
  selector: 'current-affairs-day-page',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [DatePipe, RouterLink, DatePicker, DemoNotice],
  template: `
  <div class="mx-auto max-w-2xl">
    <a routerLink="/current-affairs" class="mb-6 inline-block text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">← All days</a>
    <ca-demo-notice/>
    <header class="flex flex-col items-center gap-3 border-b border-gray-200 dark:border-gray-800 pb-8 text-center">
      <span class="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-500 text-2xl font-bold text-white" aria-hidden="true">?</span>
      <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white lg:text-4xl">Current Affairs</h1>
      @if (day(); as d) {
        <p class="text-lg font-medium text-primary-600 dark:text-primary-400">{{ d.date | date: 'EEEE, d MMMM y' }}</p>
      }
      <p class="max-w-md text-gray-600 dark:text-gray-400">Tap an option to check your answer.</p>
    </header>

    <div class="mt-6 flex justify-center">
      <ca-date-picker [dates]="dates" [selected]="day()?.date" label="Choose another day"/>
    </div>

    @if (days.length > 1) {
      <nav class="flex gap-2 overflow-x-auto border-b border-gray-200 dark:border-gray-800 py-3" aria-label="Choose a day">
        @for (d of days; track d.date) {
          <a [routerLink]="['/current-affairs', d.date]" [class]="dayClass(d.date === day()?.date)"
            [attr.aria-current]="d.date === day()?.date ? 'date' : null">{{ d.date | date: 'd MMM' }}</a>
        }
      </nav>
    }

    @if (day(); as d) {
      <div class="sticky top-20 z-[1] mt-6 flex items-center justify-between gap-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur px-4 py-3">
        <p class="text-sm text-gray-700 dark:text-gray-300" aria-live="polite">
          Score <span class="font-bold text-gray-900 dark:text-white">{{ score() }}</span> / {{ d.questions.length }}
          <span class="text-gray-500 dark:text-gray-400"> · {{ answeredCount() }} answered</span>
        </p>
        <div class="flex gap-2">
          <button type="button" (click)="revealAll()" [class]="smallButton">Show answers</button>
          <button type="button" (click)="reset()" [class]="smallButton">Reset</button>
        </div>
      </div>

      <ol class="mt-6 flex flex-col gap-6">
        @for (q of d.questions; track q.question; let i = $index) {
        <li class="rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <div class="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest">
            <span class="text-gray-500 dark:text-gray-400">Q{{ i + 1 }}</span>
            @if (q.category) { <span class="text-primary-600 dark:text-primary-400">· {{ q.category }}</span> }
          </div>
          <p class="font-semibold text-gray-900 dark:text-white">{{ q.question }}</p>
          <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            @for (option of q.options; track option; let o = $index) {
              <button type="button" (click)="choose(i, o)" [disabled]="isDone(i)" [class]="optionClass(i, o)">
                <span class="me-2 font-semibold">{{ letters[o] }}.</span>{{ option }}
              </button>
            }
          </div>
          @if (isDone(i)) {
            <div class="mt-4 rounded-lg bg-gray-50 dark:bg-gray-800/60 p-3 text-sm" role="status">
              <p class="font-semibold" [class]="resultClass(i)">{{ resultText(i) }}</p>
              @if (q.explanation) { <p class="mt-1 text-gray-600 dark:text-gray-300">{{ q.explanation }}</p> }
            </div>
          }
        </li>
        }
      </ol>

      @if (d.sources?.length) {
        <p class="mt-8 text-xs text-gray-500 dark:text-gray-400">
          Sources:
          @for (s of d.sources; track s.url; let last = $last) {
            <a [href]="s.url" target="_blank" rel="noopener" class="underline hover:text-primary-600">{{ s.name }}</a>@if (!last) {, }
          }
        </p>
      }
    }
  </div>
  `
})
export class CurrentAffairsDayPage {
  days = currentAffairsData;
  dates = currentAffairsData.map(day => day.date);
  letters = ['A', 'B', 'C', 'D', 'E', 'F'];
  smallButton = 'rounded-full border border-gray-300 dark:border-gray-700 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 transition-colors hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400';
  private router = inject(Router);
  private metaService = inject(MetaService);
  private params = toSignal(inject(ActivatedRoute).paramMap);
  day = computed(() => this.days.find(d => d.date === this.params()?.get('date')));
  // Chosen option per question, keyed by "date:index" so each day keeps its own answers.
  private chosen = signal<Record<string, number>>({});
  private revealed = signal<Record<string, boolean>>({});
  answeredCount = computed(() => this.day()?.questions.filter((_, i) => this.choice(i) !== undefined).length ?? 0);
  score = computed(() => this.day()?.questions.filter((q, i) => this.choice(i) === q.answer).length ?? 0);

  constructor() {
    effect(() => {
      const day = this.day();
      if (!day) {
        this.router.navigateByUrl('/404', { skipLocationChange: true });
        return;
      }
      const label = formatDate(day.date, 'd MMMM y', 'en-US');
      this.metaService.setMetaTags(
        `Current Affairs ${label} - ${profileData.name}`,
        `India current affairs quiz for ${label}: ${day.questions.length} questions with answers and explanations for UPSC, SSC, banking and state exams.`,
        ['current affairs', `current affairs ${label}`, 'india current affairs', 'daily quiz', 'gk', 'upsc', 'ssc', 'bank exams']
      );
    }, { allowSignalWrites: true });
  }

  private key(index: number): string {
    return `${this.day()?.date}:${index}`;
  }

  choice(index: number): number | undefined {
    return this.chosen()[this.key(index)];
  }

  isDone(index: number): boolean {
    return this.choice(index) !== undefined || !!this.revealed()[this.key(index)];
  }

  choose(index: number, option: number): void {
    if (this.isDone(index)) return;
    this.chosen.update(map => ({ ...map, [this.key(index)]: option }));
  }

  revealAll(): void {
    const keys = this.day()?.questions.map((_, i) => this.key(i)) ?? [];
    this.revealed.update(map => ({ ...map, ...Object.fromEntries(keys.map(k => [k, true])) }));
  }

  reset(): void {
    const prefix = `${this.day()?.date}:`;
    const without = (map: Record<string, any>) => Object.fromEntries(Object.entries(map).filter(([k]) => !k.startsWith(prefix)));
    this.chosen.update(without);
    this.revealed.update(without);
  }

  resultText(index: number): string {
    const q = this.day()!.questions[index];
    const correct = `${this.letters[q.answer]}. ${q.options[q.answer]}`;
    const picked = this.choice(index);
    if (picked === undefined) return `Answer: ${correct}`;
    return picked === q.answer ? 'Correct!' : `Not quite. Answer: ${correct}`;
  }

  resultClass(index: number): string {
    const picked = this.choice(index);
    if (picked === undefined) return 'text-gray-900 dark:text-white';
    return picked === this.day()!.questions[index].answer ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400';
  }

  optionClass(index: number, option: number): string {
    const base = 'w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ';
    if (!this.isDone(index)) {
      return base + 'border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-gray-800';
    }
    if (option === this.day()!.questions[index].answer) {
      return base + 'border-green-600 bg-green-50 text-green-900 dark:bg-green-900/30 dark:text-green-200';
    }
    if (option === this.choice(index)) {
      return base + 'border-red-600 bg-red-50 text-red-900 dark:bg-red-900/30 dark:text-red-200';
    }
    return base + 'border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-500';
  }

  dayClass(active: boolean): string {
    return 'shrink-0 rounded-full border px-3 py-1 text-sm font-medium transition-colors '
      + (active
        ? 'bg-primary-500 border-primary-500 text-white'
        : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-primary-500');
  }
}
