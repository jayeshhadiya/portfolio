import { Pipe, PipeTransform } from '@angular/core';
import { Marked } from 'marked';
import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import ini from 'highlight.js/lib/languages/ini';
import json from 'highlight.js/lib/languages/json';
import plaintext from 'highlight.js/lib/languages/plaintext';
import yaml from 'highlight.js/lib/languages/yaml';
import { headingSlugger } from '@core/utils/heading-slugger';

// Only the languages used in posts are bundled; add more here when a post needs them.
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('dockerfile', dockerfile);
hljs.registerLanguage('ini', ini);
hljs.registerLanguage('json', json);
hljs.registerLanguage('plaintext', plaintext);
hljs.registerLanguage('yaml', yaml);
hljs.registerAliases(['sh', 'shell', 'console'], { languageName: 'bash' });
hljs.registerAliases(['text', 'txt'], { languageName: 'plaintext' });
hljs.registerAliases(['toml'], { languageName: 'ini' });

const escapeHtml = (text: string) => text.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));

@Pipe({
  name: 'markdown',
})
export class MarkdownPipe implements PipeTransform {
  transform(value: any, args?: any[]): any {
    if (value && value.length > 0) {
      const slug = headingSlugger();
      const marked = new Marked({
        renderer: {
          // Ids let the table of contents and "#" links jump to each section.
          heading(text: string, level: number, raw: string) {
            const id = slug(raw);
            return `<h${level} id="${id}">${text}<a class="heading-anchor" href="#${id}" aria-label="Link to this section">#</a></h${level}>\n`;
          },
          code(code: string, infostring: string | undefined) {
            const lang = (infostring || '').trim().split(/\s+/)[0];
            const highlighted = lang && hljs.getLanguage(lang)
              ? hljs.highlight(code, { language: lang }).value
              : escapeHtml(code);
            return `<div class="code-block"><button type="button" class="copy-code" aria-label="Copy code">Copy</button>`
              + `<pre><code class="hljs${lang ? ' language-' + escapeHtml(lang) : ''}">${highlighted}</code></pre></div>\n`;
          }
        }
      });
      return marked.parse(value);
    }
    return value;
  }
}
