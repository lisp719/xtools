import { Layout } from './Layout';

export function Index() {
  return (
    <Layout title="Home page">
      <div class="text-center">
        <ul class="list-unstyled">
          <li>
            <a href="/xhome">Xhome</a>
          </li>
          <li>
            <a href="/xsearch">Xsearch</a>
          </li>
        </ul>
      </div>
    </Layout>
  );
}
