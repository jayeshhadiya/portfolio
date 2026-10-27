// Creates src/environments/environment*.ts from the committed .bak templates when
// they are missing (they are git-ignored, so hosts like Vercel never get them).
// Values come from environment variables set on the host:
//   SITE_URL          live address, e.g. https://jayeshhadiya.vercel.app
//                     (on Vercel it defaults to the project's production domain)
//   WEB3FORMS_KEY     contact form key from https://web3forms.com
//   UMAMI_WEBSITE_ID  optional analytics id
// Existing environment files are never touched, so local settings stay as they are.
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'environments');
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
const siteUrl = (process.env.SITE_URL || vercelUrl || '').replace(/\/$/, '');

const setValue = (text, key, value) => text.replace(new RegExp(`(${key}:\\s*)[^,\\n]+`), `$1${value}`);

for (const [file, production] of [['environment.ts', true], ['environment.development.ts', false]]) {
  const target = join(dir, file);
  if (existsSync(target)) continue;
  copyFileSync(`${target}.bak`, target);
  let text = readFileSync(target, 'utf8');
  text = setValue(text, 'production', String(production));
  if (siteUrl) text = setValue(text, 'url', `'${siteUrl}'`);
  if (process.env.WEB3FORMS_KEY) text = setValue(text, 'web3formsKey', `'${process.env.WEB3FORMS_KEY}'`);
  if (process.env.UMAMI_WEBSITE_ID) text = setValue(text, 'umamiWebsiteId', `'${process.env.UMAMI_WEBSITE_ID}'`);
  writeFileSync(target, text);
  console.log(`Created ${file} from template${siteUrl ? ` (url: ${siteUrl})` : ''}`);
}
