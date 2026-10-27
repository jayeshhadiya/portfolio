// Turns heading text into a URL-safe id ("Read the `logs`!" -> "read-the-logs").
// Repeated headings get a suffix (-1, -2...) like GitHub does, so create one
// slugger per document and the table of contents and the rendered headings match.
export function headingSlugger(): (text: string) => string {
  const seen = new Map<string, number>();
  return (text: string) => {
    const base = text
      .toLowerCase()
      .replace(/<[^>]*>/g, '')
      .replace(/&[a-z0-9#]+;/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-') || 'section';
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count ? `${base}-${count}` : base;
  };
}

// Plain heading text without inline markdown, for showing in a table of contents.
export function stripInlineMarkdown(text: string): string {
  return text.replace(/[`*_~]/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').trim();
}
