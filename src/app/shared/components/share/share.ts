import { Component, ViewEncapsulation, computed, inject, input, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Icon } from '@shared/components/icon/icon';
import { PlatformCheckService } from '@core/services/platform-check.service';
import { facebook, linkedin, whatsapp, x } from '@icon/brand.icon';
import { check, link, share } from '@icon/regular.icon';

@Component({
  selector: 'share',
  standalone: true,
  imports: [Icon],
  encapsulation: ViewEncapsulation.None,
  template: `@if(platformCheck.onBrowser){
    <div class="flex flex-wrap items-center gap-2">
      <span class="text-sm font-medium text-gray-600 dark:text-gray-400 mr-1">Share:</span>
      @if(canNativeShare){
        <button type="button" [class]="btnClass" (click)="nativeShare()" aria-label="Share" title="Share">
          <icon [path]="shareIcon" [size]="18"/>
        </button>
      }
      @for(s of links(); track s.name){
        <a [class]="btnClass" [href]="s.href" target="_blank" rel="noopener noreferrer" [attr.aria-label]="'Share on ' + s.name" [title]="'Share on ' + s.name">
          <icon [path]="s.icon" [size]="18"/>
        </a>
      }
      <button type="button" [class]="btnClass" (click)="copyLink()" [attr.aria-label]="copied() ? 'Link copied' : 'Copy link'" [title]="copied() ? 'Link copied' : 'Copy link'">
        <icon [path]="copied() ? checkIcon : linkIcon" [size]="18"/>
      </button>
      @if(copied()){
        <span class="text-sm text-primary-600 dark:text-primary-400" role="status">Link copied</span>
      }
    </div>
  }`
})
export class Share {
  title = input<string>('');
  platformCheck = inject(PlatformCheckService);
  private document = inject(DOCUMENT);
  private url = this.platformCheck.onBrowser ? this.document.location.href : '';
  canNativeShare = this.platformCheck.onBrowser && typeof navigator.share === 'function';
  copied = signal<boolean>(false);
  btnClass = 'inline-flex items-center justify-center w-9 h-9 rounded-full border border-gray-300 dark:border-gray-700 transition-colors hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-gray-800';
  shareIcon = share;
  linkIcon = link;
  checkIcon = check;

  links = computed(() => {
    const url = encodeURIComponent(this.url);
    const text = encodeURIComponent(this.title());
    return [
      { name: 'X', icon: x, href: `https://twitter.com/intent/tweet?url=${url}&text=${text}` },
      { name: 'LinkedIn', icon: linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}` },
      { name: 'WhatsApp', icon: whatsapp, href: `https://wa.me/?text=${text}%20${url}` },
      { name: 'Facebook', icon: facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${url}` },
    ];
  });

  nativeShare(): void {
    navigator.share({ title: this.title(), url: this.url }).catch(() => {});
  }

  async copyLink(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.url);
    } catch {
      const el = this.document.createElement('textarea');
      el.value = this.url;
      this.document.body.appendChild(el);
      el.select();
      this.document.execCommand('copy');
      el.remove();
    }
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
