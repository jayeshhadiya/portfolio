import { Component, ViewEncapsulation, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MetaService } from '@core/services/meta.service';
import profileData from '@data/profile.data';
import currentAffairsData from '@data/current-affairs.data';
import { CurrentAffairsDay } from '@data/schema/current-affairs.schema';
import { DatePicker } from '@pages/current-affairs/date-picker';
import { DemoNotice } from '@pages/current-affairs/demo-notice';

const REASONS = [
  { title: 'New questions every day', text: '10 fresh questions from the day\'s news, so revision becomes a daily habit instead of a last-minute rush.' },
  { title: 'Only what India\'s exams ask', text: 'National news, schemes, economy, defence, science, awards and sports. No filler, no celebrity gossip.' },
  { title: 'Exam-style MCQs', text: 'Four options per question, just like the real paper, so you practise recall instead of only reading.' },
  { title: 'Answer and explanation', text: 'See the right answer the moment you choose, with a short note on the fact behind it.' },
  { title: 'Instant score', text: 'Your score updates as you go. Five minutes a day shows you exactly where you stand.' },
  { title: 'Sources for every day', text: 'Each day lists where its facts came from, so you can read the full story when a topic matters.' },
  { title: 'Day-wise archive', text: 'Missed a day? Every past day stays here by date, ready for revision before your exam.' },
  { title: 'Free, no sign-up, no ads', text: 'Open the page and start. Works on your phone, in light and dark mode.' },
];

const EXAMS = ['UPSC', 'State PSC', 'SSC CGL / CHSL', 'Banking (IBPS, SBI)', 'Railways (RRB)', 'Defence (CDS, NDA, AFCAT)', 'Insurance', 'Teaching exams'];

const STEPS = [
  { title: 'Pick a day', text: 'Start with today, or choose any earlier date below.' },
  { title: 'Answer 10 questions', text: 'Tap an option to see if you were right, with the explanation.' },
  { title: 'Check your score', text: 'Use "Show answers" to revise, or "Reset" to try again later.' },
];

// Landing page for the daily current affairs quiz. Hidden page: not linked from the navbar.
@Component({
  selector: 'current-affairs-page',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [DatePipe, RouterLink, DatePicker, DemoNotice],
  template: `
  <div class="mx-auto max-w-3xl">
    <ca-demo-notice/>
    <header class="flex flex-col items-center gap-4 text-center">
      <span class="rounded-full border border-primary-500 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400">Updated daily</span>
      <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">Daily Current Affairs for Competitive Exams</h1>
      <p class="max-w-xl text-gray-600 dark:text-gray-400">
        Every day I upload 10 multiple-choice questions on India's most important news, with answers and short explanations.
        Five minutes a day keeps your current affairs ready for the exam.
      </p>
      @if (latest; as day) {
        <div class="flex flex-wrap justify-center gap-3">
          <a [routerLink]="['/current-affairs', day.date]" class="rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-600">
            Start today's quiz · {{ day.date | date: 'd MMM' }}
          </a>
          <ca-date-picker [dates]="dates"/>
        </div>
      }
      <p class="text-sm text-gray-500 dark:text-gray-400">{{ days.length }} {{ days.length === 1 ? 'day' : 'days' }} · {{ totalQuestions }} questions so far</p>
    </header>

    <section class="mt-16">
      <h2 class="text-center text-2xl font-bold text-gray-900 dark:text-white">Why follow these current affairs?</h2>
      <p class="mx-auto mt-2 max-w-xl text-center text-gray-600 dark:text-gray-400">There are plenty of current affairs PDFs and long articles. This is made to be quick, focused and easy to stick with.</p>
      <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        @for (reason of reasons; track reason.title; let i = $index) {
          <div class="rounded-xl border border-gray-200 dark:border-gray-800 p-5">
            <p class="flex items-center gap-3 font-semibold text-gray-900 dark:text-white">
              <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-500 text-xs font-bold text-white">{{ i + 1 }}</span>
              {{ reason.title }}
            </p>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">{{ reason.text }}</p>
          </div>
        }
      </div>
    </section>

    <section class="mt-16 rounded-xl bg-primary-50 dark:bg-gray-800/60 p-6 text-center sm:p-8">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white">Useful for</h2>
      <div class="mt-4 flex flex-wrap justify-center gap-2">
        @for (exam of exams; track exam) {
          <span class="rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1 text-sm text-gray-700 dark:text-gray-200">{{ exam }}</span>
        }
      </div>
    </section>

    <section class="mt-16">
      <h2 class="text-center text-2xl font-bold text-gray-900 dark:text-white">How it works</h2>
      <ol class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        @for (step of steps; track step.title; let i = $index) {
          <li class="rounded-xl border border-gray-200 dark:border-gray-800 p-5">
            <p class="text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400">Step {{ i + 1 }}</p>
            <p class="mt-1 font-semibold text-gray-900 dark:text-white">{{ step.title }}</p>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">{{ step.text }}</p>
          </li>
        }
      </ol>
    </section>

    <section id="days" class="mt-16">
      <div class="flex flex-col items-center gap-3">
        <h2 class="text-center text-2xl font-bold text-gray-900 dark:text-white">Day-wise current affairs</h2>
        <ca-date-picker [dates]="dates" label="Pick a date from the calendar"/>
      </div>
      @for (month of months; track month.label) {
        <h3 class="mt-8 mb-3 text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">{{ month.label }}</h3>
        <ul class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          @for (day of month.days; track day.date) {
            <li>
              <a [routerLink]="['/current-affairs', day.date]"
                class="group flex h-full items-center gap-4 rounded-xl border border-gray-200 dark:border-gray-800 p-4 transition-colors hover:border-primary-500">
                <span class="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-primary-500 text-white">
                  <span class="text-xl font-bold leading-none">{{ day.date | date: 'd' }}</span>
                  <span class="text-xs uppercase">{{ day.date | date: 'MMM' }}</span>
                </span>
                <span class="min-w-0 flex-1">
                  <span class="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                    {{ day.date | date: 'EEEE' }}
                    @if (day === latest) { <span class="rounded-full bg-green-100 dark:bg-green-900/40 px-2 py-0.5 text-xs font-medium text-green-800 dark:text-green-300">Latest</span> }
                  </span>
                  <span class="mt-0.5 block truncate text-sm text-gray-600 dark:text-gray-400">{{ day.questions.length }} questions · {{ topics(day) }}</span>
                </span>
                <span class="text-primary-600 dark:text-primary-400 transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
              </a>
            </li>
          }
        </ul>
      }
    </section>

    <p class="mt-12 text-center text-xs text-gray-500 dark:text-gray-400">
      Questions are compiled from news reports and exam-prep sources, listed on each day's page. Spotted a mistake?
      <a routerLink="/about" fragment="contact" class="underline hover:text-primary-600">Send me a message</a>.
    </p>
  </div>
  `
})
export class CurrentAffairsPage {
  reasons = REASONS;
  exams = EXAMS;
  steps = STEPS;
  // Newest first.
  days = [...currentAffairsData].sort((a, b) => b.date.localeCompare(a.date));
  latest: CurrentAffairsDay | undefined = this.days[0];
  dates = this.days.map(day => day.date);
  totalQuestions = this.days.reduce((sum, day) => sum + day.questions.length, 0);
  // Days grouped by month, e.g. "October 2026", so the list stays readable as it grows.
  months = this.days.reduce<{ label: string; days: CurrentAffairsDay[] }[]>((groups, day) => {
    const label = new Date(day.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
    const group = groups.find(g => g.label === label);
    group ? group.days.push(day) : groups.push({ label, days: [day] });
    return groups;
  }, []);

  constructor() {
    inject(MetaService).setMetaTags(
      `Daily Current Affairs Quiz - ${profileData.name}`,
      'Daily India current affairs for competitive exams: 10 MCQs every day with answers and explanations for UPSC, SSC, banking, railways and state exams.',
      ['current affairs', 'daily current affairs', 'india current affairs', 'current affairs quiz', 'gk', 'upsc', 'ssc', 'bank exams']
    );
  }

  // The day's main categories, for the card subtitle.
  topics(day: CurrentAffairsDay): string {
    return [...new Set(day.questions.map(q => q.category).filter(Boolean))].slice(0, 3).join(', ');
  }
}
