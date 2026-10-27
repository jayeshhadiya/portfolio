import { Injectable, Signal, computed, signal } from '@angular/core';
import { Observable, map, of, tap } from 'rxjs';
import { BlogSchema } from '@pages/blog/blog-detail/blog-detail.interface'
import { BlogData, BlogResponse } from '@data/schema/blog-response.schema'
import { BlogHeading } from '@pages/blog/blog-detail/blog-detail.interface'
import { Tokens, lexer } from 'marked'
import { headingSlugger, stripInlineMarkdown } from '@core/utils/heading-slugger'
// Bundled at build time (not fetched) so server-side rendering and prerendering can read it.
import blogsJson from '../../../assets/json/blogs.json'

interface Blog {
  blogs: BlogSchema[];
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  public state = signal<Blog>({ blogs: []});
  public blogs: Signal<BlogSchema[]> = computed(() => this.state().blogs);
  constructor() {
    this.getAll();
  }
  // Minutes to read at ~200 words per minute, never less than 1.
  private readingTime(content: string): number {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  }
  // Section headings (h2/h3) for the table of contents; ids match the ones MarkdownPipe renders.
  private headings(content: string): BlogHeading[] {
    const slug = headingSlugger();
    return lexer(content)
      .filter((token): token is Tokens.Heading => token.type === 'heading')
      .map(token => {
        const text = stripInlineMarkdown(token.text);
        return { id: slug(text), text, level: token.depth };
      })
      .filter(heading => heading.level === 2 || heading.level === 3);
  }
  get(slug: string | null | undefined): Observable<BlogSchema>{
    return of(blogsJson as BlogResponse).pipe(map(res => {
      const blogDetail = res.data.find((x: BlogData) => x.attributes.slug === slug);
      if (!blogDetail) {
        throw new Error('Blog Detail not found');
      }
      const { id, attributes: { content, title, summary, seo, picture, publishedAt, updatedAt, slug: postSlug } } = blogDetail
      return {
        id,
        content,
        title,
        summary,
        image: picture.data.attributes.url,
        smallImage: picture.data.attributes.formats.small.url,
        keywords: seo && seo.keywords,
        slug: postSlug,
        publishedAt,
        updatedAt,
        readingTime: this.readingTime(content),
        headings: this.headings(content)
      }
    }))
  }
  getAll(): void {
    of(blogsJson as BlogResponse).pipe(map(res => {
      const blogs = res.data?.map((item: any) => {
      const { small } = item.attributes.picture.data.attributes.formats;
      return {
        id: item.id,
        title: item.attributes.title,
        smallImage: small.url,
        summary: item.attributes.summary,
        slug: item.attributes.slug,
        publishedAt: item.attributes.publishedAt,
        readingTime: this.readingTime(item.attributes.content)
      }
    })
      return blogs as BlogSchema[]
    }), tap((blogs: BlogSchema[]) => {
        this.state.update((state: any) => ({ ...state, blogs }));
    })).subscribe();
  }
}
