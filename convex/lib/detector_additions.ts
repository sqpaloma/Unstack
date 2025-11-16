// Novas tecnologias para adicionar ao TECH_PATTERNS em detector.ts
// Baseado na lista completa do DevDocs.io (234 tecnologias)

export const NEW_LANGUAGES = {
  html: {
    name: 'HTML',
    category: 'language' as const,
    patterns: [
      { type: 'content' as const, match: /\.html?$/i, confidence: 0.95 },
      { type: 'content' as const, match: /\.htm$/i, confidence: 0.9 },
      { type: 'content' as const, match: /<(!DOCTYPE html|html)/i, confidence: 0.85 },
    ],
  },
  css: {
    name: 'CSS',
    category: 'language' as const,
    patterns: [
      { type: 'content' as const, match: /\.css$/i, confidence: 0.95 },
      { type: 'content' as const, match: /\.(scss|sass|less)$/i, confidence: 0.9 },
      { type: 'package' as const, match: 'postcss', confidence: 0.7 },
    ],
  },
  sass: {
    name: 'Sass/SCSS',
    category: 'language' as const,
    patterns: [
      { type: 'package' as const, match: 'sass', confidence: 0.95 },
      { type: 'package' as const, match: 'node-sass', confidence: 0.95 },
      { type: 'content' as const, match: /\.scss$/i, confidence: 0.95 },
      { type: 'content' as const, match: /\.sass$/i, confidence: 0.95 },
    ],
  },
  less: {
    name: 'Less',
    category: 'language' as const,
    patterns: [
      { type: 'package' as const, match: 'less', confidence: 0.95 },
      { type: 'content' as const, match: /\.less$/i, confidence: 0.95 },
    ],
  },
  dom: {
    name: 'DOM (Document Object Model)',
    category: 'language' as const,
    patterns: [
      { type: 'content' as const, match: /document\.(getElementById|querySelector|createElement)/i, confidence: 0.7 },
      { type: 'content' as const, match: /window\.(addEventListener|location|localStorage)/i, confidence: 0.7 },
    ],
  },
  http: {
    name: 'HTTP/HTTPS',
    category: 'language' as const,
    patterns: [
      { type: 'content' as const, match: /https?:\/\//i, confidence: 0.5 },
      { type: 'package' as const, match: 'http-server', confidence: 0.8 },
    ],
  },
  bash: {
    name: 'Bash',
    category: 'language' as const,
    patterns: [
      { type: 'file' as const, match: '.bashrc', confidence: 0.8 },
      { type: 'file' as const, match: '.bash_profile', confidence: 0.8 },
      { type: 'content' as const, match: /\.sh$/, confidence: 0.9 },
    ],
  },
  coffeescript: {
    name: 'CoffeeScript',
    category: 'language' as const,
    patterns: [
      { type: 'package' as const, match: 'coffeescript', confidence: 0.95 },
      { type: 'content' as const, match: /\.coffee$/, confidence: 0.9 },
    ],
  },
  perl: {
    name: 'Perl',
    category: 'language' as const,
    patterns: [
      { type: 'content' as const, match: /\.pl$/, confidence: 0.9 },
      { type: 'content' as const, match: /\.pm$/, confidence: 0.85 },
    ],
  },
  ocaml: {
    name: 'OCaml',
    category: 'language' as const,
    patterns: [
      { type: 'file' as const, match: 'dune', confidence: 0.95 },
      { type: 'content' as const, match: /\.ml$/, confidence: 0.9 },
    ],
  },
  nim: {
    name: 'Nim',
    category: 'language' as const,
    patterns: [
      { type: 'file' as const, match: /\.nimble$/, confidence: 0.95 },
      { type: 'content' as const, match: /\.nim$/, confidence: 0.9 },
    ],
  },
  d: {
    name: 'D',
    category: 'language' as const,
    patterns: [
      { type: 'file' as const, match: 'dub.json', confidence: 0.95 },
      { type: 'content' as const, match: /\.d$/, confidence: 0.85 },
    ],
  },
  fortran: {
    name: 'Fortran',
    category: 'language' as const,
    patterns: [
      { type: 'content' as const, match: /\.f90$/, confidence: 0.95 },
      { type: 'content' as const, match: /\.f95$/, confidence: 0.95 },
    ],
  },
  groovy: {
    name: 'Groovy',
    category: 'language' as const,
    patterns: [
      { type: 'content' as const, match: /\.groovy$/, confidence: 0.95 },
      { type: 'file' as const, match: 'Jenkinsfile', confidence: 0.8 },
    ],
  },
  vb: {
    name: 'Visual Basic',
    category: 'language' as const,
    patterns: [
      { type: 'content' as const, match: /\.vb$/, confidence: 0.95 },
    ],
  },
  liquid: {
    name: 'Liquid',
    category: 'language' as const,
    patterns: [
      { type: 'content' as const, match: /\.liquid$/, confidence: 0.95 },
    ],
  },
  terraform: {
    name: 'Terraform',
    category: 'language' as const,
    patterns: [
      { type: 'file' as const, match: /\.tf$/, confidence: 0.95 },
      { type: 'file' as const, match: '.terraform.lock.hcl', confidence: 0.95 },
    ],
  },
}

export const NEW_FRAMEWORKS = {
  astro: {
    name: 'Astro',
    category: 'framework' as const,
    patterns: [
      { type: 'package' as const, match: 'astro', confidence: 0.95 },
      { type: 'file' as const, match: 'astro.config.mjs', confidence: 0.95 },
      { type: 'content' as const, match: /\.astro$/, confidence: 0.9 },
    ],
  },
  ember: {
    name: 'Ember.js',
    category: 'framework' as const,
    patterns: [
      { type: 'package' as const, match: 'ember-cli', confidence: 0.95 },
      { type: 'file' as const, match: 'ember-cli-build.js', confidence: 0.95 },
    ],
  },
  backbone: {
    name: 'Backbone.js',
    category: 'framework' as const,
    patterns: [
      { type: 'package' as const, match: 'backbone', confidence: 0.95 },
    ],
  },
  preact: {
    name: 'Preact',
    category: 'framework' as const,
    patterns: [
      { type: 'package' as const, match: 'preact', confidence: 0.95 },
    ],
  },
  alpinejs: {
    name: 'Alpine.js',
    category: 'framework' as const,
    patterns: [
      { type: 'package' as const, match: 'alpinejs', confidence: 0.95 },
    ],
  },
  electron: {
    name: 'Electron',
    category: 'framework' as const,
    patterns: [
      { type: 'package' as const, match: 'electron', confidence: 0.95 },
      { type: 'file' as const, match: 'main.js', confidence: 0.6 },
    ],
  },
  tauri: {
    name: 'Tauri',
    category: 'framework' as const,
    patterns: [
      { type: 'file' as const, match: 'tauri.conf.json', confidence: 0.95 },
      { type: 'package' as const, match: '@tauri-apps/api', confidence: 0.95 },
    ],
  },
  remix: {
    name: 'Remix',
    category: 'framework' as const,
    patterns: [
      { type: 'package' as const, match: '@remix-run/react', confidence: 0.95 },
      { type: 'file' as const, match: 'remix.config.js', confidence: 0.95 },
    ],
  },
  gatsby: {
    name: 'Gatsby',
    category: 'framework' as const,
    patterns: [
      { type: 'package' as const, match: 'gatsby', confidence: 0.95 },
      { type: 'file' as const, match: 'gatsby-config.js', confidence: 0.95 },
    ],
  },
  deno: {
    name: 'Deno',
    category: 'framework' as const,
    patterns: [
      { type: 'file' as const, match: 'deno.json', confidence: 0.95 },
      { type: 'file' as const, match: 'deno.jsonc', confidence: 0.95 },
    ],
  },
  bun_framework: {
    name: 'Bun',
    category: 'framework' as const,
    patterns: [
      { type: 'package' as const, match: 'bun', confidence: 0.95 },
      { type: 'file' as const, match: 'bunfig.toml', confidence: 0.95 },
    ],
  },
  bottle: {
    name: 'Bottle',
    category: 'framework' as const,
    patterns: [
      { type: 'package' as const, match: 'bottle', confidence: 0.95 },
    ],
  },
  cakephp: {
    name: 'CakePHP',
    category: 'framework' as const,
    patterns: [
      { type: 'package' as const, match: 'cakephp/cakephp', confidence: 0.95 },
    ],
  },
  codeigniter: {
    name: 'CodeIgniter',
    category: 'framework' as const,
    patterns: [
      { type: 'file' as const, match: /application\/config\/config\.php/, confidence: 0.95 },
    ],
  },
  symfony: {
    name: 'Symfony',
    category: 'framework' as const,
    patterns: [
      { type: 'package' as const, match: 'symfony/symfony', confidence: 0.95 },
      { type: 'file' as const, match: 'symfony.lock', confidence: 0.95 },
    ],
  },
  yii: {
    name: 'Yii',
    category: 'framework' as const,
    patterns: [
      { type: 'package' as const, match: 'yiisoft/yii2', confidence: 0.95 },
    ],
  },
  hono: {
    name: 'Hono',
    category: 'framework' as const,
    patterns: [
      { type: 'package' as const, match: 'hono', confidence: 0.95 },
    ],
  },
  koa: {
    name: 'Koa',
    category: 'framework' as const,
    patterns: [
      { type: 'package' as const, match: 'koa', confidence: 0.95 },
    ],
  },
}

export const NEW_DATABASES = {
  sqlite: {
    name: 'SQLite',
    category: 'db' as const,
    patterns: [
      { type: 'package' as const, match: 'sqlite3', confidence: 0.95 },
      { type: 'package' as const, match: 'better-sqlite3', confidence: 0.95 },
      { type: 'content' as const, match: /\.sqlite$/, confidence: 0.9 },
      { type: 'content' as const, match: /\.db$/, confidence: 0.7 },
    ],
  },
  mariadb: {
    name: 'MariaDB',
    category: 'db' as const,
    patterns: [
      { type: 'package' as const, match: 'mariadb', confidence: 0.95 },
    ],
  },
  duckdb: {
    name: 'DuckDB',
    category: 'db' as const,
    patterns: [
      { type: 'package' as const, match: 'duckdb', confidence: 0.95 },
      { type: 'content' as const, match: /\.duckdb$/, confidence: 0.95 },
    ],
  },
  elasticsearch: {
    name: 'Elasticsearch',
    category: 'db' as const,
    patterns: [
      { type: 'package' as const, match: '@elastic/elasticsearch', confidence: 0.95 },
      { type: 'package' as const, match: 'elasticsearch', confidence: 0.95 },
    ],
  },
  cassandra: {
    name: 'Cassandra',
    category: 'db' as const,
    patterns: [
      { type: 'package' as const, match: 'cassandra-driver', confidence: 0.95 },
    ],
  },
  neo4j: {
    name: 'Neo4j',
    category: 'db' as const,
    patterns: [
      { type: 'package' as const, match: 'neo4j-driver', confidence: 0.95 },
    ],
  },
  influxdb: {
    name: 'InfluxDB',
    category: 'db' as const,
    patterns: [
      { type: 'package' as const, match: '@influxdata/influxdb-client', confidence: 0.95 },
    ],
  },
}

export const NEW_TESTING = {
  jest: {
    name: 'Jest',
    category: 'tool' as const,
    patterns: [
      { type: 'package' as const, match: 'jest', confidence: 0.95 },
      { type: 'file' as const, match: 'jest.config.js', confidence: 0.95 },
      { type: 'file' as const, match: 'jest.config.ts', confidence: 0.95 },
    ],
  },
  vitest: {
    name: 'Vitest',
    category: 'tool' as const,
    patterns: [
      { type: 'package' as const, match: 'vitest', confidence: 0.95 },
      { type: 'file' as const, match: 'vitest.config.ts', confidence: 0.95 },
    ],
  },
  cypress: {
    name: 'Cypress',
    category: 'tool' as const,
    patterns: [
      { type: 'package' as const, match: 'cypress', confidence: 0.95 },
      { type: 'file' as const, match: 'cypress.config.js', confidence: 0.95 },
      { type: 'file' as const, match: 'cypress.config.ts', confidence: 0.95 },
    ],
  },
  playwright: {
    name: 'Playwright',
    category: 'tool' as const,
    patterns: [
      { type: 'package' as const, match: '@playwright/test', confidence: 0.95 },
      { type: 'file' as const, match: 'playwright.config.ts', confidence: 0.95 },
    ],
  },
  mocha: {
    name: 'Mocha',
    category: 'tool' as const,
    patterns: [
      { type: 'package' as const, match: 'mocha', confidence: 0.95 },
      { type: 'file' as const, match: '.mocharc.json', confidence: 0.95 },
    ],
  },
  jasmine: {
    name: 'Jasmine',
    category: 'tool' as const,
    patterns: [
      { type: 'package' as const, match: 'jasmine', confidence: 0.95 },
      { type: 'file' as const, match: 'jasmine.json', confidence: 0.95 },
    ],
  },
  puppeteer: {
    name: 'Puppeteer',
    category: 'tool' as const,
    patterns: [
      { type: 'package' as const, match: 'puppeteer', confidence: 0.95 },
    ],
  },
  chai: {
    name: 'Chai',
    category: 'tool' as const,
    patterns: [
      { type: 'package' as const, match: 'chai', confidence: 0.95 },
    ],
  },
  sinon: {
    name: 'Sinon',
    category: 'tool' as const,
    patterns: [
      { type: 'package' as const, match: 'sinon', confidence: 0.95 },
    ],
  },
  ava: {
    name: 'AVA',
    category: 'tool' as const,
    patterns: [
      { type: 'package' as const, match: 'ava', confidence: 0.95 },
    ],
  },
  phpunit: {
    name: 'PHPUnit',
    category: 'tool' as const,
    patterns: [
      { type: 'package' as const, match: 'phpunit/phpunit', confidence: 0.95 },
      { type: 'file' as const, match: 'phpunit.xml', confidence: 0.95 },
    ],
  },
  pytest: {
    name: 'Pytest',
    category: 'tool' as const,
    patterns: [
      { type: 'package' as const, match: 'pytest', confidence: 0.95 },
      { type: 'file' as const, match: 'pytest.ini', confidence: 0.95 },
    ],
  },
  rspec: {
    name: 'RSpec',
    category: 'tool' as const,
    patterns: [
      { type: 'package' as const, match: 'rspec', confidence: 0.95 },
      { type: 'file' as const, match: '.rspec', confidence: 0.95 },
    ],
  },
}

export const NEW_TOOLS = {
  webpack: {
    name: 'Webpack',
    category: 'tool' as const,
    patterns: [
      { type: 'package' as const, match: 'webpack', confidence: 0.95 },
      { type: 'file' as const, match: 'webpack.config.js', confidence: 0.95 },
    ],
  },
  babel: {
    name: 'Babel',
    category: 'tool' as const,
    patterns: [
      { type: 'package' as const, match: '@babel/core', confidence: 0.95 },
      { type: 'file' as const, match: '.babelrc', confidence: 0.95 },
      { type: 'file' as const, match: 'babel.config.js', confidence: 0.95 },
    ],
  },
  eslint: {
    name: 'ESLint',
    category: 'tool' as const,
    patterns: [
      { type: 'package' as const, match: 'eslint', confidence: 0.95 },
      { type: 'file' as const, match: '.eslintrc.js', confidence: 0.95 },
      { type: 'file' as const, match: 'eslint.config.js', confidence: 0.95 },
    ],
  },
  prettier: {
    name: 'Prettier',
    category: 'tool' as const,
    patterns: [
      { type: 'package' as const, match: 'prettier', confidence: 0.95 },
      { type: 'file' as const, match: '.prettierrc', confidence: 0.95 },
    ],
  },
  esbuild: {
    name: 'esbuild',
    category: 'tool' as const,
    patterns: [
      { type: 'package' as const, match: 'esbuild', confidence: 0.95 },
    ],
  },
  rollup: {
    name: 'Rollup',
    category: 'tool' as const,
    patterns: [
      { type: 'package' as const, match: 'rollup', confidence: 0.95 },
      { type: 'file' as const, match: 'rollup.config.js', confidence: 0.95 },
    ],
  },
  parcel: {
    name: 'Parcel',
    category: 'tool' as const,
    patterns: [
      { type: 'package' as const, match: 'parcel', confidence: 0.95 },
    ],
  },
  turbo: {
    name: 'Turborepo',
    category: 'tool' as const,
    patterns: [
      { type: 'package' as const, match: 'turbo', confidence: 0.95 },
      { type: 'file' as const, match: 'turbo.json', confidence: 0.95 },
    ],
  },
  nx: {
    name: 'Nx',
    category: 'tool' as const,
    patterns: [
      { type: 'package' as const, match: '@nx/workspace', confidence: 0.95 },
      { type: 'file' as const, match: 'nx.json', confidence: 0.95 },
    ],
  },
  pnpm: {
    name: 'pnpm',
    category: 'tool' as const,
    patterns: [
      { type: 'file' as const, match: 'pnpm-lock.yaml', confidence: 0.95 },
      { type: 'file' as const, match: 'pnpm-workspace.yaml', confidence: 0.95 },
    ],
  },
  yarn: {
    name: 'Yarn',
    category: 'tool' as const,
    patterns: [
      { type: 'file' as const, match: 'yarn.lock', confidence: 0.95 },
    ],
  },
  npm: {
    name: 'npm',
    category: 'tool' as const,
    patterns: [
      { type: 'file' as const, match: 'package-lock.json', confidence: 0.95 },
      { type: 'file' as const, match: 'package.json', confidence: 0.8 },
    ],
  },
  git: {
    name: 'Git',
    category: 'tool' as const,
    patterns: [
      { type: 'file' as const, match: '.gitignore', confidence: 0.9 },
      { type: 'file' as const, match: '.gitattributes', confidence: 0.85 },
    ],
  },
  graphql: {
    name: 'GraphQL',
    category: 'tool' as const,
    patterns: [
      { type: 'package' as const, match: 'graphql', confidence: 0.95 },
      { type: 'file' as const, match: /\.graphql$/, confidence: 0.95 },
      { type: 'file' as const, match: /\.gql$/, confidence: 0.95 },
    ],
  },
  apollo: {
    name: 'Apollo GraphQL',
    category: 'tool' as const,
    patterns: [
      { type: 'package' as const, match: '@apollo/client', confidence: 0.95 },
      { type: 'package' as const, match: 'apollo-server', confidence: 0.95 },
    ],
  },
  redux: {
    name: 'Redux',
    category: 'tool' as const,
    patterns: [
      { type: 'package' as const, match: 'redux', confidence: 0.95 },
      { type: 'package' as const, match: '@reduxjs/toolkit', confidence: 0.95 },
    ],
  },
  zustand: {
    name: 'Zustand',
    category: 'tool' as const,
    patterns: [
      { type: 'package' as const, match: 'zustand', confidence: 0.95 },
    ],
  },
  jotai: {
    name: 'Jotai',
    category: 'tool' as const,
    patterns: [
      { type: 'package' as const, match: 'jotai', confidence: 0.95 },
    ],
  },
  rxjs: {
    name: 'RxJS',
    category: 'tool' as const,
    patterns: [
      { type: 'package' as const, match: 'rxjs', confidence: 0.95 },
    ],
  },
  lodash: {
    name: 'Lodash',
    category: 'tool' as const,
    patterns: [
      { type: 'package' as const, match: 'lodash', confidence: 0.95 },
    ],
  },
  axios_lib: {
    name: 'Axios',
    category: 'tool' as const,
    patterns: [
      { type: 'package' as const, match: 'axios', confidence: 0.95 },
    ],
  },
  storybook: {
    name: 'Storybook',
    category: 'tool' as const,
    patterns: [
      { type: 'package' as const, match: '@storybook/react', confidence: 0.95 },
      { type: 'file' as const, match: '.storybook/main.js', confidence: 0.95 },
    ],
  },
  swagger: {
    name: 'Swagger/OpenAPI',
    category: 'tool' as const,
    patterns: [
      { type: 'file' as const, match: 'swagger.json', confidence: 0.95 },
      { type: 'file' as const, match: 'openapi.yaml', confidence: 0.95 },
    ],
  },
  kubernetes: {
    name: 'Kubernetes',
    category: 'infra' as const,
    patterns: [
      { type: 'file' as const, match: /deployment\.yaml/, confidence: 0.9 },
      { type: 'file' as const, match: /service\.yaml/, confidence: 0.8 },
      { type: 'content' as const, match: /kind: Deployment/, confidence: 0.85 },
    ],
  },
  terraform_tool: {
    name: 'Terraform',
    category: 'infra' as const,
    patterns: [
      { type: 'file' as const, match: /\.tf$/, confidence: 0.95 },
      { type: 'file' as const, match: '.terraform.lock.hcl', confidence: 0.95 },
    ],
  },
  ansible_tool: {
    name: 'Ansible',
    category: 'infra' as const,
    patterns: [
      { type: 'package' as const, match: 'ansible', confidence: 0.95 },
      { type: 'file' as const, match: 'ansible.cfg', confidence: 0.95 },
    ],
  },
  nginx: {
    name: 'Nginx',
    category: 'infra' as const,
    patterns: [
      { type: 'file' as const, match: 'nginx.conf', confidence: 0.95 },
      { type: 'file' as const, match: /sites-available\//, confidence: 0.8 },
    ],
  },
  apache: {
    name: 'Apache',
    category: 'infra' as const,
    patterns: [
      { type: 'file' as const, match: 'httpd.conf', confidence: 0.95 },
      { type: 'file' as const, match: '.htaccess', confidence: 0.9 },
    ],
  },
}

// Documentação oficial das tecnologias
export const TECH_DOCS_URLS: Record<string, string> = {
  // Languages
  bash: 'https://www.gnu.org/software/bash/manual/',
  coffeescript: 'https://coffeescript.org/',
  perl: 'https://perldoc.perl.org/',
  ocaml: 'https://ocaml.org/docs',
  nim: 'https://nim-lang.org/docs/lib.html',
  d: 'https://dlang.org/spec/spec.html',
  terraform: 'https://www.terraform.io/docs',

  // Frameworks
  astro: 'https://docs.astro.build/',
  ember: 'https://guides.emberjs.com/',
  backbone: 'https://backbonejs.org/',
  preact: 'https://preactjs.com/',
  alpinejs: 'https://alpinejs.dev/',
  electron: 'https://www.electronjs.org/docs',
  tauri: 'https://tauri.app/',
  remix: 'https://remix.run/docs',
  gatsby: 'https://www.gatsbyjs.com/docs',
  deno: 'https://deno.land/manual',
  bun_framework: 'https://bun.sh/docs',
  bottle: 'https://bottlepy.org/docs/',
  cakephp: 'https://book.cakephp.org/',
  symfony: 'https://symfony.com/doc/',
  hono: 'https://hono.dev/',
  koa: 'https://koajs.com/',

  // Databases
  sqlite: 'https://www.sqlite.org/docs.html',
  mariadb: 'https://mariadb.com/kb/',
  duckdb: 'https://duckdb.org/docs/',
  elasticsearch: 'https://www.elastic.co/guide/',

  // Testing
  jest: 'https://jestjs.io/docs/',
  vitest: 'https://vitest.dev/',
  cypress: 'https://docs.cypress.io/',
  playwright: 'https://playwright.dev/docs/',
  mocha: 'https://mochajs.org/',
  jasmine: 'https://jasmine.github.io/',
  puppeteer: 'https://pptr.dev/',
  pytest: 'https://docs.pytest.org/',

  // Tools
  webpack: 'https://webpack.js.org/concepts/',
  babel: 'https://babeljs.io/docs/',
  eslint: 'https://eslint.org/docs/',
  prettier: 'https://prettier.io/docs/',
  esbuild: 'https://esbuild.github.io/',
  turbo: 'https://turbo.build/repo/docs',
  nx: 'https://nx.dev/',
  graphql: 'https://graphql.org/learn/',
  apollo: 'https://www.apollographql.com/docs/',
  redux: 'https://redux.js.org/',
  storybook: 'https://storybook.js.org/docs/',
  kubernetes: 'https://kubernetes.io/docs/',
  nginx: 'https://nginx.org/en/docs/',
}
