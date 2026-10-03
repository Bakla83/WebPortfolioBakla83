// astro.config.mjs
sitemap({
  // Корень только выбирает язык и закрыт от поиска (noindex),
  // поэтому в карте сайта ему не место.
  filter: (page) => !page.includes('/in-progress') && new URL(page).pathname !== '/',
}),
