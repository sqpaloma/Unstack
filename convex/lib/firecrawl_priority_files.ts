// Arquivos prioritários para detecção de tecnologias
// Baseado na lista completa do DevDocs.io + tecnologias modernas

export const PRIORITY_FILES_EXTENDED = [
  // ============ HTML/CSS/Web Fundamentals ============
  'index.html',
  'index.htm',
  'styles.css',
  'main.css',
  'app.css',
  'style.css',
  'global.css',

  // ============ JavaScript/TypeScript Ecosystem ============
  // Core configs
  'package.json',
  'package-lock.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  'yarn.lock',
  'tsconfig.json',
  'jsconfig.json',

  // CSS Frameworks
  'tailwind.config.js',
  'tailwind.config.ts',
  'postcss.config.js',

  // Build Tools
  'vite.config.js',
  'vite.config.ts',
  'webpack.config.js',
  'rollup.config.js',
  'esbuild.config.js',
  'turbo.json',
  'nx.json',

  // Frontend Frameworks
  'astro.config.mjs',
  'next.config.js',
  'next.config.mjs',
  'remix.config.js',
  'gatsby-config.js',
  'nuxt.config.js',
  'nuxt.config.ts',
  'svelte.config.js',
  'angular.json',
  'ember-cli-build.js',

  // Code Quality
  '.babelrc',
  'babel.config.js',
  '.eslintrc.js',
  '.eslintrc.json',
  'eslint.config.js',
  '.prettierrc',
  '.prettierrc.json',

  // Testing
  'jest.config.js',
  'jest.config.ts',
  'vitest.config.ts',
  'cypress.config.js',
  'cypress.config.ts',
  'playwright.config.ts',
  '.mocharc.json',
  'jasmine.json',
  'ava.config.js',

  // Backend Frameworks (Node.js)
  'nest-cli.json',
  'fastify.config.js',

  // Mobile
  'metro.config.js',
  'app.json', // React Native / Expo

  // Desktop
  'main.js', // Electron
  'electron-builder.yml',
  'tauri.conf.json',

  // ============ Infrastructure/Deployment ============
  // Cloud Platforms
  'wrangler.toml', // Cloudflare
  'netlify.toml',
  'vercel.json',

  // Containers
  'Dockerfile',
  'docker-compose.yml',
  '.dockerignore',

  // Kubernetes
  'kubernetes.yaml',
  'deployment.yaml',
  'service.yaml',
  'ingress.yaml',

  // Web Servers
  'nginx.conf',
  'httpd.conf',
  '.htaccess',
  'apache2.conf',

  // DevOps
  'ansible.cfg',
  'playbook.yml',
  '.terraform.lock.hcl',
  'terraform.tfvars',

  // CI/CD
  '.github/workflows/ci.yml',
  '.gitlab-ci.yml',
  'Jenkinsfile',
  '.circleci/config.yml',

  // ============ Documentation ============
  'README.md',
  'swagger.json',
  'openapi.yaml',
  'openapi.json',
  '.storybook/main.js',

  // ============ Databases & ORMs ============
  'schema.prisma',
  'drizzle.config.ts',
  'drizzle.config.js',
  'convex.json',
  'schema.graphql',
  'codegen.yml',

  // ============ Python ============
  'requirements.txt',
  'pyproject.toml',
  'Pipfile',
  'Pipfile.lock',
  'setup.py',
  'setup.cfg',
  'poetry.lock',
  'manage.py', // Django
  'pytest.ini',
  'tox.ini',
  '.flake8',
  'mypy.ini',

  // ============ Flutter/Dart ============
  'pubspec.yaml',
  'pubspec.lock',
  'analysis_options.yaml',

  // ============ Go ============
  'go.mod',
  'go.sum',
  'go.work',

  // ============ Rust ============
  'Cargo.toml',
  'Cargo.lock',
  'rust-toolchain.toml',

  // ============ Java/Kotlin ============
  'pom.xml',
  'build.gradle',
  'build.gradle.kts',
  'gradlew',
  'settings.gradle',
  'settings.gradle.kts',

  // ============ Swift ============
  'Package.swift',
  'Podfile',
  'Podfile.lock',

  // ============ C#/.NET ============
  'project.json',
  'appsettings.json',
  'appsettings.Development.json',
  '.csproj',
  '.sln',

  // ============ PHP ============
  'composer.json',
  'composer.lock',
  'artisan', // Laravel
  'symfony.lock',
  'phpunit.xml',
  'phpunit.xml.dist',

  // ============ Ruby ============
  'Gemfile',
  'Gemfile.lock',
  'Rakefile',
  'config/routes.rb', // Rails
  '.rspec',
  '.rubocop.yml',

  // ============ Elixir ============
  'mix.exs',
  'mix.lock',
  '.formatter.exs',

  // ============ Scala ============
  'build.sbt',
  'project/build.properties',

  // ============ Haskell ============
  'stack.yaml',
  'stack.yaml.lock',
  'cabal.project',

  // ============ Clojure ============
  'project.clj',
  'deps.edn',
  'bb.edn',

  // ============ Erlang ============
  'rebar.config',
  'rebar.lock',

  // ============ OCaml ============
  'dune',
  'dune-project',

  // ============ Nim ============
  '.nimble',

  // ============ D ============
  'dub.json',
  'dub.sdl',

  // ============ Crystal ============
  'shard.yml',
  'shard.lock',

  // ============ R ============
  'DESCRIPTION',
  'NAMESPACE',

  // ============ Julia ============
  'Project.toml',
  'Manifest.toml',

  // ============ Zig ============
  'build.zig',
  'build.zig.zon',

  // ============ C/C++ ============
  'CMakeLists.txt',
  'Makefile',
  'configure.ac',
  'meson.build',

  // ============ Solidity ============
  'hardhat.config.js',
  'hardhat.config.ts',
  'truffle-config.js',
  'foundry.toml',

  // ============ Spring (Java) ============
  'application.properties',
  'application.yml',
  'application.yaml',

  // ============ Game Engines ============
  'ProjectSettings/ProjectVersion.txt', // Unity
  'project.godot', // Godot
  '.uproject', // Unreal

  // ============ Runtimes ============
  'deno.json',
  'deno.jsonc',
  'bunfig.toml',

  // ============ Shell Scripts ============
  '.bashrc',
  '.bash_profile',
  '.zshrc',

  // ============ Environment ============
  '.env',
  '.env.example',
  '.env.local',
  '.env.production',

  // ============ Editors/IDEs ============
  '.editorconfig',
  '.vscode/settings.json',
  '.idea/workspace.xml',
]

// Mapa de arquivos para suas tecnologias (para referência/validação)
export const FILE_TO_TECH_MAP: Record<string, string[]> = {
  // Web Fundamentals
  'index.html': ['html'],
  'index.htm': ['html'],
  'styles.css': ['css'],
  'main.css': ['css'],
  'app.css': ['css'],

  // JavaScript/TypeScript
  'package.json': ['node', 'javascript', 'typescript'],
  'tsconfig.json': ['typescript'],
  'vite.config.ts': ['vite'],
  'next.config.js': ['nextjs'],
  'astro.config.mjs': ['astro'],
  'tailwind.config.ts': ['tailwind'],
  'go.mod': ['go'],
  'Cargo.toml': ['rust'],
  'requirements.txt': ['python'],
  'pyproject.toml': ['python'],
  'pubspec.yaml': ['dart', 'flutter'],
  'Gemfile': ['ruby'],
  'mix.exs': ['elixir'],
  'composer.json': ['php'],
  'pom.xml': ['java'],
  'build.gradle': ['java', 'kotlin'],
  'Package.swift': ['swift'],
  'Dockerfile': ['docker'],
  'kubernetes.yaml': ['kubernetes'],
  'terraform.tfvars': ['terraform'],
  'schema.prisma': ['prisma'],
  'convex.json': ['convex'],
  'wrangler.toml': ['cloudflare'],
  'netlify.toml': ['netlify'],
  'vercel.json': ['vercel'],
  'jest.config.ts': ['jest'],
  'vitest.config.ts': ['vitest'],
  'cypress.config.ts': ['cypress'],
  'playwright.config.ts': ['playwright'],
}

// URLs de documentação oficial por tecnologia
export const TECH_DOCUMENTATION_URLS: Record<string, string> = {
  // Web Fundamentals
  html: 'https://devdocs.io/html/',
  css: 'https://devdocs.io/css/',
  sass: 'https://devdocs.io/sass/',
  less: 'https://devdocs.io/less/',
  dom: 'https://devdocs.io/dom/',
  http: 'https://devdocs.io/http/',

  // JavaScript/TypeScript
  javascript: 'https://devdocs.io/javascript/',
  typescript: 'https://devdocs.io/typescript/',
  node: 'https://devdocs.io/node/',

  // Frontend Frameworks
  react: 'https://devdocs.io/react/',
  vue: 'https://devdocs.io/vue~3/',
  angular: 'https://devdocs.io/angular/',
  svelte: 'https://devdocs.io/svelte/',
  nextjs: 'https://devdocs.io/nextjs/',
  astro: 'https://devdocs.io/astro/',
  remix: 'https://remix.run/docs',
  gatsby: 'https://devdocs.io/gatsby/',
  nuxt: 'https://devdocs.io/nuxt/',
  solidjs: 'https://docs.solidjs.com/',
  qwik: 'https://qwik.builder.io/docs/',
  preact: 'https://preactjs.com/guide/',
  alpinejs: 'https://alpinejs.dev/start-here',

  // Backend Frameworks
  express: 'https://devdocs.io/express/',
  nestjs: 'https://devdocs.io/nest/',
  fastify: 'https://devdocs.io/fastify/',
  koa: 'https://koajs.com/',
  hono: 'https://hono.dev/',
  django: 'https://devdocs.io/django~5.0/',
  flask: 'https://devdocs.io/flask~2.3/',
  fastapi: 'https://devdocs.io/fastapi/',
  rails: 'https://devdocs.io/rails~7.1/',
  laravel: 'https://devdocs.io/laravel~10/',
  spring: 'https://devdocs.io/spring/',
  phoenix: 'https://devdocs.io/phoenix/',

  // Languages
  python: 'https://devdocs.io/python~3.12/',
  go: 'https://devdocs.io/go/',
  rust: 'https://devdocs.io/rust/',
  java: 'https://devdocs.io/openjdk~21/',
  kotlin: 'https://devdocs.io/kotlin/',
  swift: 'https://devdocs.io/swift/',
  ruby: 'https://devdocs.io/ruby~3.3/',
  php: 'https://devdocs.io/php/',
  csharp: 'https://devdocs.io/c/',
  cpp: 'https://devdocs.io/cpp/',
  c: 'https://devdocs.io/c/',
  elixir: 'https://devdocs.io/elixir~1.16/',
  scala: 'https://docs.scala-lang.org/',
  haskell: 'https://devdocs.io/haskell~9/',
  clojure: 'https://devdocs.io/clojure~1.11/',
  erlang: 'https://devdocs.io/erlang~26/',
  dart: 'https://devdocs.io/dart~3/',
  lua: 'https://devdocs.io/lua~5.4/',
  perl: 'https://devdocs.io/perl~5.38/',
  r: 'https://devdocs.io/r/',
  julia: 'https://devdocs.io/julia~1.10/',
  zig: 'https://ziglang.org/documentation/',

  // Databases
  postgres: 'https://devdocs.io/postgresql~16/',
  mysql: 'https://devdocs.io/mysql/',
  mongodb: 'https://devdocs.io/mongodb/',
  redis: 'https://devdocs.io/redis/',
  sqlite: 'https://devdocs.io/sqlite/',
  elasticsearch: 'https://devdocs.io/elasticsearch/',
  mariadb: 'https://devdocs.io/mariadb/',

  // ORMs
  prisma: 'https://www.prisma.io/docs',
  drizzle: 'https://orm.drizzle.team/docs',
  convex: 'https://docs.convex.dev/',

  // Build Tools
  vite: 'https://devdocs.io/vite/',
  webpack: 'https://devdocs.io/webpack/',
  esbuild: 'https://esbuild.github.io/',
  rollup: 'https://devdocs.io/rollup/',
  parcel: 'https://parceljs.org/',
  turbo: 'https://turbo.build/repo/docs',

  // Testing
  jest: 'https://devdocs.io/jest/',
  vitest: 'https://devdocs.io/vitest/',
  cypress: 'https://devdocs.io/cypress/',
  playwright: 'https://devdocs.io/playwright/',
  mocha: 'https://devdocs.io/mocha/',
  jasmine: 'https://devdocs.io/jasmine/',

  // DevOps
  docker: 'https://devdocs.io/docker/',
  kubernetes: 'https://devdocs.io/kubernetes/',
  terraform: 'https://devdocs.io/terraform/',
  ansible: 'https://devdocs.io/ansible/',
  nginx: 'https://devdocs.io/nginx/',
  apache: 'https://devdocs.io/apache_http_server/',

  // Cloud Platforms
  cloudflare: 'https://developers.cloudflare.com/workers/',
  netlify: 'https://docs.netlify.com/',
  vercel: 'https://vercel.com/docs',

  // CSS
  tailwind: 'https://devdocs.io/tailwindcss/',
  css: 'https://devdocs.io/css/',
  sass: 'https://devdocs.io/sass/',
  less: 'https://devdocs.io/less/',

  // Libraries
  react_router: 'https://devdocs.io/react_router/',
  redux: 'https://devdocs.io/redux/',
  rxjs: 'https://devdocs.io/rxjs/',
  lodash: 'https://devdocs.io/lodash~4/',
  axios: 'https://devdocs.io/axios/',
  graphql: 'https://devdocs.io/graphql/',
  apollo: 'https://www.apollographql.com/docs/',

  // Game Engines
  unity: 'https://docs.unity3d.com/',
  godot: 'https://devdocs.io/godot~4/',
  unreal: 'https://docs.unrealengine.com/',
}
