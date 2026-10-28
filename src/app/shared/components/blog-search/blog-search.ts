import { AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild, ViewEncapsulation, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { BlogService } from '@pages/blog/blog.service';
import { Icon } from '@shared/components/icon/icon';
import { search } from '@icon/regular.icon';

const MAX_RESULTS = 5;

// Search box for the navbar: live results as you type, Enter for the full list on /blog.
@Component({
  selector: 'blog-search',
  standalone: true,
  imports: [DatePipe, Icon],
  encapsulation: ViewEncapsulation.None,
  template: `
  <div class="relative">
    <div class="flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 focus-within:ring-2 focus-within:ring-primary-500">
      <icon [path]="searchIcon" [size]="16" iconClass="fill-gray-500 dark:fill-gray-400 shrink-0"/>
      <input #input type="search" placeholder="Search blog here…" aria-label="Search blog posts"
        role="combobox" aria-autocomplete="list" aria-controls="blog-search-results" [attr.aria-expanded]="query().trim() !== ''"
        [attr.aria-activedescendant]="active() >= 0 ? 'blog-search-result-' + active() : null"
        class="w-full bg-transparent py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none border-0 focus:ring-0"
        [value]="query()" (input)="onInput($event)" (keydown)="onKeydown($event)" />
      <button type="button" (click)="closed.emit()" aria-label="Close search"
        class="shrink-0 rounded px-1.5 text-lg leading-none text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">×</button>
    </div>
    @if (query().trim()) {
      <ul id="blog-search-results" role="listbox"
        class="absolute left-0 right-0 top-full mt-2 z-10 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg">
        @for (post of results(); track post.id; let i = $index) {
          <li [id]="'blog-search-result-' + i" role="option" [attr.aria-selected]="i === active()"
            [class]="resultClass(i)"
            (mousedown)="$event.preventDefault()" (click)="open(post.slug)" (mouseenter)="active.set(i)">
            <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ post.title }}</p>
            <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{{ post.publishedAt | date: 'MMM d, y' : 'UTC' }} · {{ post.readingTime }} min read</p>
          </li>
        } @empty {
          <li class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">No posts found for “{{ query().trim() }}”.</li>
        }
        @if (allResults().length > results().length) {
          <li class="border-t border-gray-200 dark:border-gray-700">
            <button type="button" (mousedown)="$event.preventDefault()" (click)="showAll()"
              class="w-full px-4 py-2.5 text-left text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800">
              See all {{ allResults().length }} results →
            </button>
          </li>
        }
      </ul>
    }
  </div>
  `
})
export class BlogSearch implements AfterViewInit {
  @Output() closed = new EventEmitter<void>();
  searchIcon = search;
  private blogService = inject(BlogService);
  private router = inject(Router);
  @ViewChild('input') private input!: ElementRef<HTMLInputElement>;
  query = signal('');
  // Highlighted result for keyboard navigation; -1 means none.
  active = signal(-1);
  allResults = computed(() => this.blogService.search(this.query()));
  results = computed(() => this.allResults().slice(0, MAX_RESULTS));

  ngAfterViewInit(): void {
    this.input.nativeElement.focus();
  }

  resultClass(index: number): string {
    return 'cursor-pointer px-4 py-3 text-left' + (index === this.active() ? ' bg-gray-100 dark:bg-gray-800' : '');
  }

  onInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.active.set(-1);
  }

  onKeydown(event: KeyboardEvent): void {
    const count = this.results().length;
    if (event.key === 'ArrowDown' && count) {
      event.preventDefault();
      this.active.set((this.active() + 1) % count);
    } else if (event.key === 'ArrowUp' && count) {
      event.preventDefault();
      this.active.set(this.active() <= 0 ? count - 1 : this.active() - 1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const post = this.results()[this.active()];
      if (post?.slug) this.open(post.slug); else this.showAll();
    } else if (event.key === 'Escape') {
      this.closed.emit();
    }
  }

  open(slug: string | undefined): void {
    this.router.navigate(['/blog', slug]);
    this.closed.emit();
  }

  showAll(): void {
    const q = this.query().trim();
    if (!q) return;
    this.router.navigate(['/blog'], { queryParams: { q } });
    this.closed.emit();
  }
}
