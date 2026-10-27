import { Component, ViewEncapsulation, inject } from '@angular/core';
import { MetaService } from '@core/services/meta.service';
import profileData from '@data/profile.data';
import experienceData from '@data/experience.data';
@Component({
  selector: 'experience-page',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  template: `
    <h1
      class="text-brand-primary mt-2 text-center text-3xl font-semibold tracking-tight lg:text-4xl lg:leading-snug dark:text-white">
      Experience
    </h1>
    <ol class="relative max-w-screen-md mx-auto my-10 border-s border-gray-300 dark:border-gray-700">
      @for (job of experiences; track $index) {
      <li class="mb-12 ms-6 last:mb-0">
        <span class="absolute -start-1.5 mt-2 h-3 w-3 rounded-full bg-primary-500 ring-4 ring-white dark:ring-gray-900"></span>
        <p class="text-sm font-semibold dark:text-primary-400 text-primary-600">
          {{ job.start }} – {{ job.end || 'Present' }}
        </p>
        <h2 class="mt-1 text-xl font-bold dark:text-white">{{ job.role }}</h2>
        <p class="mt-1 text-gray-700 dark:text-gray-300">
          @if (job.companyUrl) {
            <a class="font-medium underline hover:text-primary-600 dark:hover:text-primary-400" [href]="job.companyUrl" target="_blank">{{ job.company }}</a>
          } @else {
            <span class="font-medium">{{ job.company }}</span>
          }
          @if (job.employmentType) { <span> · {{ job.employmentType }}</span> }
          @if (job.location) { <span> · {{ job.location }}</span> }
        </p>
        <div class="mt-4 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 bg-white p-5 text-sm text-gray-900 dark:text-gray-200">
          <p>{{ job.summary }}</p>
          @if (job.highlights.length) {
          <ul class="mt-3 list-disc ps-5 space-y-1">
            @for (h of job.highlights; track $index) {
            <li>{{ h }}</li>
            }
          </ul>
          }
          @if (job.tools.length) {
          <div class="mt-4 flex flex-wrap gap-2">
            @for (t of job.tools; track $index) {
            <span class="rounded-full border border-primary-500/40 bg-primary-500/10 px-3 py-0.5 text-xs font-medium dark:text-primary-300 text-primary-700">{{ t }}</span>
            }
          </div>
          }
        </div>
      </li>
      }
    </ol>
`
})
export class ExperiencePage {
  experiences = experienceData;
  metaService = inject(MetaService);
  constructor() {
    this.metaService.setMetaTags(
      `Experience - ${profileData.name}`,
      `Work experience of ${profileData.name}: roles, responsibilities and the tools used.`,
      ['experience', 'work', 'career', 'devops', 'resume', 'portfolio']
    )
  }
}
