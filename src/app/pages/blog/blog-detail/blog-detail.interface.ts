export interface BlogHeading {
  id: string;
  text: string;
  level: number;
}

export interface BlogSchema {
  id: number;
  content: string;
  title: string;
  summary: string;
  image: string;
  smallImage: string;
  keywords?: string;
  slug?: string;
  publishedAt?: string;
  updatedAt?: string;
  readingTime?: number;
  headings?: BlogHeading[];
}
