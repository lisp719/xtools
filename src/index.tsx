import { Hono } from 'hono';
import { buildXhomeUrl, buildXsearchUrl } from './lib/search';
import { Index } from './pages/Index';
import { Xhome } from './pages/Xhome';
import { Xsearch } from './pages/Xsearch';

const app = new Hono();

app.get('/', (c) => c.html(<Index />));
app.get('/Index', (c) => c.html(<Index />));
app.get('/xhome', (c) => c.html(<Xhome />));
app.get('/xsearch', (c) => c.html(<Xsearch />));

app.post('/xhome', async (c) => {
  const form = await c.req.formData();
  const url = buildXhomeUrl({
    filter: (form.get('filter') as string) || undefined,
    until: (form.get('until') as string) || undefined,
  });
  return c.redirect(url, 302);
});

app.post('/xsearch', async (c) => {
  const form = await c.req.formData();
  const url = buildXsearchUrl({
    japaneseOnly: form.get('japaneseOnly') === 'true',
    excludeReplies: form.get('excludeReplies') === 'true',
    followersOnly: form.get('followersOnly') === 'true',
    filter: (form.get('filter') as string) || undefined,
    since: (form.get('since') as string) || undefined,
    until: (form.get('until') as string) || undefined,
    countType: (form.get('countType') as string) || undefined,
    countValue: (form.get('countValue') as string) || undefined,
    query: (form.get('query') as string) || undefined,
    exactMatch: form.get('exactMatch') === 'true',
  });
  return c.redirect(url, 302);
});

export default app;
