import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  ViewEncapsulation,
  effect,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop'
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe, DOCUMENT } from '@angular/common';
import { BlogService } from '../blog.service';
import { arrowLeft } from '@icon/regular.icon';
import { MetaService } from '@core/services/meta.service';
import { Subscription } from 'rxjs';
import { Icon } from '@shared/components/icon/icon';
import { CoreModule } from '@core/core.module';
import { Prose } from '@shared/components/prose/prose'
import { ZoomImageDirective } from '@shared/directives/zoom-image/zoom-image.directive'
import { BlogSchema } from './blog-detail.interface';
import { ImageSkeletonDirective } from '@core/directives/image-skeleton.directive';
import { Share } from '@shared/components/share/share';
import { onScrollChange } from '@core/utils/scroll-change';
@Component({
  selector: 'blog-detail-page',
  template: `@if(data(); as data){
    <div class="fixed top-0 left-0 z-[3] h-1 bg-primary-500 transition-[width] duration-75" [style.width.%]="progress()"
      role="progressbar" aria-label="Reading progress" [attr.aria-valuenow]="progress()" aria-valuemin="0" aria-valuemax="100"></div>
    <div class="mx-auto dark:text-white text-gray-800">
      <header class="flex flex-col gap-7">
        <a class="text-primary-800 hover:text-black dark:text-primary-200 dark:hover:text-white font-medium"
          routerLink="/blog">
          <div class="flex items-center gap-1">
            <icon [path]="backIcon" [size]="15"></icon> Back to blog list
          </div>
        </a>
        <div>
          <h1 class="font-semibold text-3xl md:text-4xl md:!leading-[120%] lg:text-5xl  max-w-4xl">
            {{ data.title }}
          </h1>
          <p class="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">
            {{ data.publishedAt | date: 'MMMM d, y' : 'UTC' }} · {{ data.readingTime }} min read
            @if(isUpdated(data)){ · Updated {{ data.updatedAt | date: 'MMMM d, y' : 'UTC' }} }
          </p>
        </div>
        <share [title]="data.title"/>
      </header>
      @if((data.headings?.length ?? 0) >= 3){
        <nav class="mt-8 rounded-lg border border-gray-200 dark:border-gray-700 p-5" aria-label="Table of contents">
          <p class="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">On this page</p>
          <ol class="space-y-1.5 text-sm">
            @for(heading of data.headings; track heading.id){
              <li [class.ps-4]="heading.level === 3">
                <a class="hover:text-primary-600 dark:hover:text-primary-400" [href]="'#' + heading.id" (click)="scrollTo($event, heading.id)">{{ heading.text }}</a>
              </li>
            }
          </ol>
        </nav>
      }
      <div class="flex flex-col gap-3 text-lg py-6">
        <prose [data]="data.content"></prose>
      </div>
      <footer class="border-t border-gray-200 dark:border-gray-700 pt-6 pb-10">
        <p class="mb-3 text-lg font-semibold">Found this useful? Share it with your team.</p>
        <share [title]="data.title"/>
        @if(previousPost() || nextPost()){
          <div class="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            @if(previousPost(); as post){
              <a [routerLink]="['/blog', post.slug]" class="rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-primary-500">
                <span class="text-xs font-medium text-gray-500 dark:text-gray-400">← Older post</span>
                <span class="mt-1 block font-semibold">{{ post.title }}</span>
              </a>
            } @else { <span class="hidden sm:block"></span> }
            @if(nextPost(); as post){
              <a [routerLink]="['/blog', post.slug]" class="rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-primary-500 sm:text-right">
                <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Newer post →</span>
                <span class="mt-1 block font-semibold">{{ post.title }}</span>
              </a>
            }
          </div>
        }
      </footer>
    </div>
  }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Icon, CoreModule, Prose, ZoomImageDirective, ImageSkeletonDirective, Share, DatePipe, RouterLink],
  standalone: true
})
export class BlogDetailPage{
  backIcon = arrowLeft;
  data = signal<BlogSchema | null>(null);
  progress = signal(0);
  sub!: Subscription;
  document = inject(DOCUMENT);
  blogService = inject(BlogService);
  metaService = inject(MetaService);
  router = inject(Router);
  paramMap = toSignal(inject(ActivatedRoute).paramMap);
  // The blog list is sorted newest first, so the next item is the older post.
  private position = computed(() => this.blogService.blogs().findIndex(post => post.slug === this.data()?.slug));
  previousPost = computed(() => this.position() < 0 ? undefined : this.blogService.blogs()[this.position() + 1]);
  nextPost = computed(() => this.position() < 1 ? undefined : this.blogService.blogs()[this.position() - 1]);
  constructor() {
    onScrollChange(() => this.readProgress(), progress => this.progress.set(progress));
    effect((onCleanup) => {
      this.sub = this.blogService.get(this.paramMap()?.get('slug')).subscribe({
        next: data => {
          this.data.set(data)
          this.metaService.setMetaTags( data.title, data.summary, data.keywords, data.smallImage )
        },
        // Unknown slug: show the error page but keep the address the visitor typed.
        error: () => this.router.navigateByUrl('/404', { skipLocationChange: true })
      });

      onCleanup(() => {
        this.sub.unsubscribe();
      });
    // Post data is bundled, so it arrives synchronously while this effect runs.
    }, { allowSignalWrites: true });
  }

  isUpdated(post: BlogSchema): boolean {
    return !!post.updatedAt && post.updatedAt.slice(0, 10) !== post.publishedAt?.slice(0, 10);
  }

  readProgress(): number {
    const { scrollTop, scrollHeight, clientHeight } = this.document.documentElement;
    const scrollable = scrollHeight - clientHeight;
    return scrollable > 0 ? Math.min(100, Math.round(scrollTop / scrollable * 100)) : 0;
  }

  // With <base href="/"> a plain "#id" link would go to the home page, so scroll in place instead.
  scrollTo(event: Event, id: string): void {
    event.preventDefault();
    this.document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    history.replaceState(history.state, '', `${location.pathname}#${id}`);
  }
}
