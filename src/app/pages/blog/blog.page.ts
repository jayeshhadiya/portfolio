import { ChangeDetectionStrategy, Component, DestroyRef, ViewEncapsulation, computed, inject, signal } from '@angular/core';
import { BlogService } from '@pages/blog/blog.service'
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { MetaService } from '@core/services/meta.service';
import profileData from '@data/profile.data';
import { ImageSkeletonDirective } from '@core/directives/image-skeleton.directive';
import { PlatformCheckService } from '@core/services/platform-check.service';

// Posts per page by screen size, matching the grid's 1/2/3 columns (Tailwind md and lg breakpoints).
const PAGE_SIZES = { mobile: 3, tablet: 4, desktop: 6 };
const TABLET_QUERY = '(min-width: 768px)';
const DESKTOP_QUERY = '(min-width: 1024px)';
@Component({
  selector: 'blog-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [RouterLink, DatePipe, ImageSkeletonDirective],
  template: `
  <div class="container px-8 mx-auto xl:px-5">
  <div class="mx-auto max-w-screen-md">
    <h1
      class="text-brand-primary mb-3 mt-2 text-center text-3xl font-semibold tracking-tight lg:text-4xl lg:leading-snug dark:text-white">
      Blogs
    </h1>
    @if (query()) {
      <p class="text-center text-sm text-gray-600 dark:text-gray-400">
        {{ filtered().length }} {{ filtered().length === 1 ? 'result' : 'results' }} for “{{ query() }}” ·
        <a routerLink="/blog" class="font-medium text-primary-600 dark:text-primary-400 hover:underline">Clear search</a>
      </p>
    }
  </div>
</div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-screen-lg mx-auto my-10 text-left ">
      @for (post of posts(); track post.id; let i = $index) {
      <a class="max-w-sm mx-auto bg-white dark:bg-gray-900 rounded-lg" [class]="prerenderClass(i)" [routerLink]="['/blog/'+ post.slug+'']">
        <img skeleton class="rounded-lg object-cover hover:scale-105 transition-all w-full h-auto aspect-[2/1] bg-gradient-to-br from-primary-500 to-primary-800" [src]="post.smallImage"
          [alt]="post.title"/>
        <div class="pt-3">
          <p class="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">{{ post.publishedAt | date: 'MMM d, y' : 'UTC' }} · {{ post.readingTime }} min read</p>
          <h5 class="mb-2 text-lg font-semibold tracking-tight text-gray-900 dark:text-white">{{post.title}}</h5>
          <p class="mb-2 text-sm text-gray-900 dark:text-gray-200">{{post.summary}}</p>
        </div>
      </a>
      } @empty {
        <p class="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">No posts match your search. Try different words.</p>
      }
    </div>
    @if (pageCount() > 1) {
      <nav class="flex items-center justify-center gap-2 mb-10" aria-label="Blog pages">
        <a [routerLink]="[]" [queryParams]="{ page: page() - 1 }" queryParamsHandling="merge" [class]="pageLinkClass(false)"
          [class.pointer-events-none]="page() === 1" [class.opacity-40]="page() === 1"
          [attr.aria-disabled]="page() === 1" [attr.tabindex]="page() === 1 ? -1 : null" aria-label="Previous page">←<span class="hidden sm:inline ms-1">Previous</span></a>
        @for (n of pages(); track n) {
          <a [routerLink]="[]" [queryParams]="{ page: n }" queryParamsHandling="merge" [class]="pageLinkClass(n === page())"
            [attr.aria-current]="n === page() ? 'page' : null" [attr.aria-label]="'Page ' + n">{{ n }}</a>
        }
        <a [routerLink]="[]" [queryParams]="{ page: page() + 1 }" queryParamsHandling="merge" [class]="pageLinkClass(false)"
          [class.pointer-events-none]="page() === pageCount()" [class.opacity-40]="page() === pageCount()"
          [attr.aria-disabled]="page() === pageCount()" [attr.tabindex]="page() === pageCount() ? -1 : null" aria-label="Next page"><span class="hidden sm:inline me-1">Next</span>→</a>
      </nav>
    }
`
})
export class BlogPage {
  blogService = inject(BlogService);
  metaService = inject(MetaService)
  private queryParams = toSignal(inject(ActivatedRoute).queryParamMap);
  // Unknown until the browser can measure the screen; prerendering uses the desktop size.
  private measured = signal(false);
  pageSize = signal(PAGE_SIZES.desktop);
  // ?q=… from the navbar search filters the list.
  query = computed(() => (this.queryParams()?.get('q') ?? '').trim());
  filtered = computed(() => this.query() ? this.blogService.search(this.query()) : this.blogService.blogs());
  pageCount = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.pageSize())));
  pages = computed(() => Array.from({ length: this.pageCount() }, (_, i) => i + 1));
  // ?page=N from the address, kept within range (a resize can reduce the number of pages).
  page = computed(() => Math.min(this.pageCount(), Math.max(1, Number(this.queryParams()?.get('page')) || 1)));
  posts = computed(() => this.filtered().slice((this.page() - 1) * this.pageSize(), this.page() * this.pageSize()));

  constructor(){
    if (inject(PlatformCheckService).onBrowser) {
      const tablet = matchMedia(TABLET_QUERY);
      const desktop = matchMedia(DESKTOP_QUERY);
      const update = () => this.pageSize.set(desktop.matches ? PAGE_SIZES.desktop : tablet.matches ? PAGE_SIZES.tablet : PAGE_SIZES.mobile);
      update();
      this.measured.set(true);
      tablet.addEventListener('change', update);
      desktop.addEventListener('change', update);
      inject(DestroyRef).onDestroy(() => {
        tablet.removeEventListener('change', update);
        desktop.removeEventListener('change', update);
      });
    }
    this.metaService.setMetaTags(
      `Blogs - ${profileData.name}`,
      `Blog posts by ${profileData.name}. I share some guide, tutorials and information about software development`,
      'tech,software,development,thoughts,blog,content,news,tutorials,guide,post'
      )
  }

  // The prerendered page shows the desktop count, so hide the extra cards with CSS on
  // smaller screens until the app takes over; this avoids a layout jump on load.
  prerenderClass(index: number): string {
    if (this.measured()) return '';
    if (index >= PAGE_SIZES.tablet) return 'hidden lg:block';
    if (index >= PAGE_SIZES.mobile) return 'hidden md:block';
    return '';
  }

  pageLinkClass(active: boolean): string {
    return 'inline-flex items-center justify-center min-w-10 h-10 px-3 rounded-lg border text-sm font-medium transition-colors '
      + (active
        ? 'bg-primary-500 border-primary-500 text-white'
        : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-primary-500');
  }
}
