import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import profileData from '@data/profile.data';
import { environment } from '@env/environment';

type MetaImageStyle = 'summary_large_image' | 'summary';

@Injectable({
  providedIn: 'root'
})

export class MetaService {
  public defaultImage: string = '/assets/image/meta-image.jpg'
  public urlKeywords: string[] = ['blog/'];
  private meta = inject(Meta);
  private router = inject(Router);
  private title = inject(Title);
  private document = inject(DOCUMENT);

  get contentType(): string{
   return this.urlKeywords.some(str => this.router.url.includes(str)) ? 'article' : 'website'
  }
  get rootUrl(): string{
    // Drop query string and fragment so every page has one canonical address.
    return `${environment.url}${this.router.url.split(/[?#]/)[0]}`
  }

  // Social sites only read absolute image URLs.
  private absoluteUrl(path: string): string {
    return /^https?:\/\//.test(path) ? path : `${environment.url}/${path.replace(/^\.?\//, '')}`
  }

  setMetaTags(title: string, description: string, keywords?: string | Array<string> | null, image?: string | null , metaImageStyle?: MetaImageStyle): void{
    // Social sites don't show SVG previews, so those fall back to the default image.
    const imageUrl = this.absoluteUrl(image && !/\.svg$/i.test(image) ? image : this.defaultImage);
    this.title.setTitle(title);
    // updateTag replaces the previous page's tag instead of adding a duplicate.
    const tags: MetaDefinition[] = [
      {name: 'title', content: title},
      {name: 'description', content: description},
      {name: 'keywords', content: Array.isArray(keywords) ? keywords.join(', ') : keywords || ''},
      {name: 'author', content: profileData.name},
      {property: 'og:title', content: title},
      {property: 'og:description', content: description},
      {property: 'og:url', content: this.rootUrl},
      {property: 'og:image', content: imageUrl},
      {property: 'og:locale', content: 'en_US'},
      {property: 'og:type', content: this.contentType},
      {property: 'og:site_name', content: profileData.name},
      {name: 'twitter:card', content: metaImageStyle || 'summary_large_image'},
      {name: 'twitter:url', content: this.rootUrl},
      {name: 'twitter:title', content: title},
      {name: 'twitter:description', content: description},
      {name: 'twitter:image', content: imageUrl},
    ];
    tags.forEach(tag => this.meta.updateTag(tag, tag.property ? `property='${tag.property}'` : `name='${tag.name}'`));
    this.setCanonical(this.rootUrl);
  }

  private setCanonical(url: string): void {
    let link: HTMLLinkElement | null = this.document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
