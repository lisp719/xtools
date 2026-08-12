import type { Child, FC } from 'hono/jsx';

export const Layout: FC<{ title: string; children?: Child }> = ({ title, children }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title} - xtools</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css" />
        <link rel="stylesheet" href="/css/site.css" />
      </head>
      <body>
        <div class="container">
          <header>
            <nav>
              <div>
                <ul>
                  <li>
                    <a href="/">Home</a>
                  </li>
                </ul>
              </div>
            </nav>
          </header>
          <div>
            <main role="main">{children}</main>
          </div>
        </div>
        <script src="/js/site.js"></script>
      </body>
    </html>
  );
};
