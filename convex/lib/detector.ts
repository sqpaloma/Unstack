// Tipos para detecção de tecnologias
export type TechCategory = 'language' | 'framework' | 'auth' | 'db' | 'infra' | 'tool'

export interface DetectedTech {
  key: string
  name: string
  category: TechCategory
  version?: string
  confidence: number
  sources: string[]
}

export interface FileContent {
  path: string
  content: string
}

// Mapas de detecção
const TECH_PATTERNS: Record<
  string,
  {
    name: string
    category: TechCategory
    patterns: Array<{
      type: 'package' | 'file' | 'content' | 'config'
      match: string | RegExp
      confidence: number
    }>
  }
> = {
  // Languages
  typescript: {
    name: 'TypeScript',
    category: 'language',
    patterns: [
      { type: 'file', match: 'tsconfig.json', confidence: 0.95 },
      { type: 'package', match: 'typescript', confidence: 0.9 },
      { type: 'content', match: /\.tsx?$/, confidence: 0.8 },
    ],
  },
  javascript: {
    name: 'JavaScript',
    category: 'language',
    patterns: [
      { type: 'file', match: 'package.json', confidence: 0.9 },
      { type: 'content', match: /\.jsx?$/, confidence: 0.8 },
    ],
  },
  node: {
    name: 'Node.js',
    category: 'language',
    patterns: [
      { type: 'package', match: 'package.json', confidence: 0.95 },
      { type: 'content', match: /node:/, confidence: 0.85 },
    ],
  },
  dart: {
    name: 'Dart',
    category: 'language',
    patterns: [
      { type: 'file', match: 'pubspec.yaml', confidence: 0.95 },
      { type: 'content', match: /\.dart$/, confidence: 0.8 },
    ],
  },
  python: {
    name: 'Python',
    category: 'language',
    patterns: [
      { type: 'file', match: 'requirements.txt', confidence: 0.9 },
      { type: 'file', match: 'pyproject.toml', confidence: 0.95 },
      { type: 'file', match: 'Pipfile', confidence: 0.9 },
      { type: 'content', match: /\.py$/, confidence: 0.8 },
    ],
  },
  go: {
    name: 'Go',
    category: 'language',
    patterns: [
      { type: 'file', match: 'go.mod', confidence: 0.95 },
      { type: 'file', match: 'go.sum', confidence: 0.9 },
      { type: 'content', match: /\.go$/, confidence: 0.8 },
    ],
  },
  rust: {
    name: 'Rust',
    category: 'language',
    patterns: [
      { type: 'file', match: 'Cargo.toml', confidence: 0.95 },
      { type: 'file', match: 'Cargo.lock', confidence: 0.9 },
      { type: 'content', match: /\.rs$/, confidence: 0.8 },
    ],
  },
  java: {
    name: 'Java',
    category: 'language',
    patterns: [
      { type: 'file', match: 'pom.xml', confidence: 0.95 },
      { type: 'file', match: 'build.gradle', confidence: 0.9 },
      { type: 'content', match: /\.java$/, confidence: 0.8 },
    ],
  },
  kotlin: {
    name: 'Kotlin',
    category: 'language',
    patterns: [
      { type: 'file', match: 'build.gradle.kts', confidence: 0.95 },
      { type: 'content', match: /\.kt$/, confidence: 0.9 },
    ],
  },
  swift: {
    name: 'Swift',
    category: 'language',
    patterns: [
      { type: 'file', match: 'Package.swift', confidence: 0.95 },
      { type: 'content', match: /\.swift$/, confidence: 0.9 },
    ],
  },
  csharp: {
    name: 'C#',
    category: 'language',
    patterns: [
      { type: 'file', match: /\.csproj$/, confidence: 0.95 },
      { type: 'file', match: /\.sln$/, confidence: 0.9 },
      { type: 'content', match: /\.cs$/, confidence: 0.85 },
    ],
  },
  cpp: {
    name: 'C++',
    category: 'language',
    patterns: [
      { type: 'file', match: 'CMakeLists.txt', confidence: 0.9 },
      { type: 'content', match: /\.(cpp|hpp|cc|cxx)$/, confidence: 0.85 },
    ],
  },
  c: {
    name: 'C',
    category: 'language',
    patterns: [
      { type: 'file', match: 'Makefile', confidence: 0.6 },
      { type: 'content', match: /\.(c|h)$/, confidence: 0.8 },
    ],
  },
  php: {
    name: 'PHP',
    category: 'language',
    patterns: [
      { type: 'file', match: 'composer.json', confidence: 0.95 },
      { type: 'content', match: /\.php$/, confidence: 0.85 },
    ],
  },
  ruby: {
    name: 'Ruby',
    category: 'language',
    patterns: [
      { type: 'file', match: 'Gemfile', confidence: 0.95 },
      { type: 'file', match: 'Rakefile', confidence: 0.85 },
      { type: 'content', match: /\.rb$/, confidence: 0.8 },
    ],
  },
  elixir: {
    name: 'Elixir',
    category: 'language',
    patterns: [
      { type: 'file', match: 'mix.exs', confidence: 0.95 },
      { type: 'content', match: /\.(ex|exs)$/, confidence: 0.85 },
    ],
  },
  scala: {
    name: 'Scala',
    category: 'language',
    patterns: [
      { type: 'file', match: 'build.sbt', confidence: 0.95 },
      { type: 'content', match: /\.scala$/, confidence: 0.9 },
    ],
  },
  haskell: {
    name: 'Haskell',
    category: 'language',
    patterns: [
      { type: 'file', match: /\.cabal$/, confidence: 0.95 },
      { type: 'file', match: 'stack.yaml', confidence: 0.95 },
      { type: 'content', match: /\.hs$/, confidence: 0.9 },
    ],
  },
  clojure: {
    name: 'Clojure',
    category: 'language',
    patterns: [
      { type: 'file', match: 'project.clj', confidence: 0.95 },
      { type: 'content', match: /\.(clj|cljs)$/, confidence: 0.9 },
    ],
  },
  erlang: {
    name: 'Erlang',
    category: 'language',
    patterns: [
      { type: 'file', match: 'rebar.config', confidence: 0.95 },
      { type: 'content', match: /\.erl$/, confidence: 0.9 },
    ],
  },
  lua: {
    name: 'Lua',
    category: 'language',
    patterns: [
      { type: 'content', match: /\.lua$/, confidence: 0.9 },
    ],
  },
  r: {
    name: 'R',
    category: 'language',
    patterns: [
      { type: 'file', match: 'DESCRIPTION', confidence: 0.85 },
      { type: 'content', match: /\.(R|Rmd)$/, confidence: 0.9 },
    ],
  },
  julia: {
    name: 'Julia',
    category: 'language',
    patterns: [
      { type: 'file', match: 'Project.toml', confidence: 0.9 },
      { type: 'content', match: /\.jl$/, confidence: 0.9 },
    ],
  },
  zig: {
    name: 'Zig',
    category: 'language',
    patterns: [
      { type: 'file', match: 'build.zig', confidence: 0.95 },
      { type: 'content', match: /\.zig$/, confidence: 0.9 },
    ],
  },
  solidity: {
    name: 'Solidity',
    category: 'language',
    patterns: [
      { type: 'content', match: /\.sol$/, confidence: 0.95 },
      { type: 'file', match: 'hardhat.config.js', confidence: 0.85 },
    ],
  },
  shell: {
    name: 'Shell Script',
    category: 'language',
    patterns: [
      { type: 'content', match: /\.(sh|bash|zsh)$/, confidence: 0.85 },
    ],
  },
  powershell: {
    name: 'PowerShell',
    category: 'language',
    patterns: [
      { type: 'content', match: /\.ps1$/, confidence: 0.95 },
    ],
  },

  // Frameworks
  react: {
    name: 'React',
    category: 'framework',
    patterns: [
      { type: 'package', match: 'react', confidence: 0.95 },
      { type: 'content', match: /import.*from\s+['"]react['"]/, confidence: 0.9 },
    ],
  },
  'tanstack-router': {
    name: 'TanStack Router',
    category: 'framework',
    patterns: [
      { type: 'package', match: '@tanstack/react-router', confidence: 0.95 },
      { type: 'package', match: '@tanstack/router', confidence: 0.95 },
    ],
  },
  'tanstack-start': {
    name: 'TanStack Start',
    category: 'framework',
    patterns: [
      { type: 'package', match: '@tanstack/start', confidence: 0.95 },
    ],
  },
  nextjs: {
    name: 'Next.js',
    category: 'framework',
    patterns: [
      { type: 'package', match: 'next', confidence: 0.95 },
      { type: 'file', match: 'next.config.js', confidence: 0.95 },
      { type: 'file', match: 'next.config.mjs', confidence: 0.95 },
    ],
  },
  vite: {
    name: 'Vite',
    category: 'framework',
    patterns: [
      { type: 'package', match: 'vite', confidence: 0.95 },
      { type: 'file', match: /vite\.config\.(js|ts|mjs)$/, confidence: 0.95 },
    ],
  },
  flutter: {
    name: 'Flutter',
    category: 'framework',
    patterns: [
      { type: 'file', match: 'pubspec.yaml', confidence: 0.9 },
      { type: 'content', match: /flutter:/, confidence: 0.95 },
      { type: 'content', match: /dependencies:\s+flutter:/, confidence: 0.95 },
    ],
  },
  tailwind: {
    name: 'Tailwind CSS',
    category: 'framework',
    patterns: [
      { type: 'package', match: 'tailwindcss', confidence: 0.95 },
      { type: 'file', match: /tailwind\.config\.(js|ts|mjs|cjs)$/, confidence: 0.95 },
    ],
  },
  django: {
    name: 'Django',
    category: 'framework',
    patterns: [
      { type: 'file', match: 'manage.py', confidence: 0.95 },
      { type: 'content', match: /django/, confidence: 0.9 },
    ],
  },
  fastapi: {
    name: 'FastAPI',
    category: 'framework',
    patterns: [
      { type: 'content', match: /from fastapi import/, confidence: 0.95 },
      { type: 'content', match: /fastapi/, confidence: 0.85 },
    ],
  },
  vue: {
    name: 'Vue.js',
    category: 'framework',
    patterns: [
      { type: 'package', match: 'vue', confidence: 0.95 },
      { type: 'content', match: /import.*from\s+['"]vue['"]/, confidence: 0.9 },
    ],
  },
  angular: {
    name: 'Angular',
    category: 'framework',
    patterns: [
      { type: 'package', match: '@angular/core', confidence: 0.95 },
      { type: 'file', match: 'angular.json', confidence: 0.95 },
    ],
  },
  svelte: {
    name: 'Svelte',
    category: 'framework',
    patterns: [
      { type: 'package', match: 'svelte', confidence: 0.95 },
      { type: 'file', match: 'svelte.config.js', confidence: 0.95 },
      { type: 'content', match: /\.svelte$/, confidence: 0.9 },
    ],
  },
  sveltekit: {
    name: 'SvelteKit',
    category: 'framework',
    patterns: [
      { type: 'package', match: '@sveltejs/kit', confidence: 0.95 },
    ],
  },
  nuxt: {
    name: 'Nuxt.js',
    category: 'framework',
    patterns: [
      { type: 'package', match: 'nuxt', confidence: 0.95 },
      { type: 'file', match: 'nuxt.config.js', confidence: 0.95 },
      { type: 'file', match: 'nuxt.config.ts', confidence: 0.95 },
    ],
  },
  solidjs: {
    name: 'Solid.js',
    category: 'framework',
    patterns: [
      { type: 'package', match: 'solid-js', confidence: 0.95 },
    ],
  },
  qwik: {
    name: 'Qwik',
    category: 'framework',
    patterns: [
      { type: 'package', match: '@builder.io/qwik', confidence: 0.95 },
    ],
  },
  express: {
    name: 'Express.js',
    category: 'framework',
    patterns: [
      { type: 'package', match: 'express', confidence: 0.95 },
    ],
  },
  fastify: {
    name: 'Fastify',
    category: 'framework',
    patterns: [
      { type: 'package', match: 'fastify', confidence: 0.95 },
    ],
  },
  nestjs: {
    name: 'NestJS',
    category: 'framework',
    patterns: [
      { type: 'package', match: '@nestjs/core', confidence: 0.95 },
      { type: 'file', match: 'nest-cli.json', confidence: 0.95 },
    ],
  },
  flask: {
    name: 'Flask',
    category: 'framework',
    patterns: [
      { type: 'content', match: /from flask import/, confidence: 0.95 },
      { type: 'content', match: /flask/, confidence: 0.85 },
    ],
  },
  spring: {
    name: 'Spring Boot',
    category: 'framework',
    patterns: [
      { type: 'content', match: /spring-boot/, confidence: 0.95 },
      { type: 'file', match: 'application.properties', confidence: 0.8 },
      { type: 'file', match: 'application.yml', confidence: 0.8 },
    ],
  },
  rails: {
    name: 'Ruby on Rails',
    category: 'framework',
    patterns: [
      { type: 'file', match: 'Gemfile', confidence: 0.7 },
      { type: 'content', match: /gem ['"]rails['"]/, confidence: 0.95 },
      { type: 'file', match: 'config/routes.rb', confidence: 0.9 },
    ],
  },
  laravel: {
    name: 'Laravel',
    category: 'framework',
    patterns: [
      { type: 'file', match: 'artisan', confidence: 0.95 },
      { type: 'content', match: /laravel\/framework/, confidence: 0.95 },
    ],
  },
  aspnet: {
    name: 'ASP.NET Core',
    category: 'framework',
    patterns: [
      { type: 'content', match: /Microsoft\.AspNetCore/, confidence: 0.95 },
      { type: 'file', match: 'appsettings.json', confidence: 0.7 },
    ],
  },
  gin: {
    name: 'Gin (Go)',
    category: 'framework',
    patterns: [
      { type: 'content', match: /github\.com\/gin-gonic\/gin/, confidence: 0.95 },
    ],
  },
  fiber: {
    name: 'Fiber (Go)',
    category: 'framework',
    patterns: [
      { type: 'content', match: /github\.com\/gofiber\/fiber/, confidence: 0.95 },
    ],
  },
  echo: {
    name: 'Echo (Go)',
    category: 'framework',
    patterns: [
      { type: 'content', match: /github\.com\/labstack\/echo/, confidence: 0.95 },
    ],
  },
  phoenix: {
    name: 'Phoenix',
    category: 'framework',
    patterns: [
      { type: 'content', match: /phoenix/, confidence: 0.9 },
      { type: 'file', match: 'mix.exs', confidence: 0.7 },
    ],
  },
  reactnative: {
    name: 'React Native',
    category: 'framework',
    patterns: [
      { type: 'package', match: 'react-native', confidence: 0.95 },
      { type: 'file', match: 'app.json', confidence: 0.7 },
    ],
  },
  unity: {
    name: 'Unity',
    category: 'framework',
    patterns: [
      { type: 'file', match: 'ProjectSettings/ProjectVersion.txt', confidence: 0.95 },
      { type: 'content', match: /UnityEngine/, confidence: 0.9 },
    ],
  },
  unreal: {
    name: 'Unreal Engine',
    category: 'framework',
    patterns: [
      { type: 'file', match: /\.uproject$/, confidence: 0.95 },
    ],
  },
  godot: {
    name: 'Godot',
    category: 'framework',
    patterns: [
      { type: 'file', match: 'project.godot', confidence: 0.95 },
      { type: 'content', match: /\.gd$/, confidence: 0.9 },
    ],
  },
  tensorflow: {
    name: 'TensorFlow',
    category: 'framework',
    patterns: [
      { type: 'content', match: /tensorflow/, confidence: 0.95 },
      { type: 'content', match: /import tensorflow/, confidence: 0.95 },
    ],
  },
  pytorch: {
    name: 'PyTorch',
    category: 'framework',
    patterns: [
      { type: 'content', match: /torch/, confidence: 0.9 },
      { type: 'content', match: /import torch/, confidence: 0.95 },
    ],
  },
  sklearn: {
    name: 'Scikit-Learn',
    category: 'framework',
    patterns: [
      { type: 'content', match: /sklearn/, confidence: 0.95 },
      { type: 'content', match: /from sklearn/, confidence: 0.95 },
    ],
  },
  keras: {
    name: 'Keras',
    category: 'framework',
    patterns: [
      { type: 'content', match: /keras/, confidence: 0.95 },
      { type: 'content', match: /from keras/, confidence: 0.95 },
    ],
  },
  jax: {
    name: 'JAX',
    category: 'framework',
    patterns: [
      { type: 'content', match: /import jax/, confidence: 0.95 },
    ],
  },

  // Auth
  clerk: {
    name: 'Clerk',
    category: 'auth',
    patterns: [
      { type: 'package', match: '@clerk/clerk-react', confidence: 0.95 },
      { type: 'package', match: '@clerk/nextjs', confidence: 0.95 },
      { type: 'package', match: '@clerk/tanstack-start', confidence: 0.95 },
    ],
  },
  authjs: {
    name: 'Auth.js',
    category: 'auth',
    patterns: [
      { type: 'package', match: 'next-auth', confidence: 0.95 },
      { type: 'package', match: '@auth/core', confidence: 0.95 },
    ],
  },
  supabase: {
    name: 'Supabase Auth',
    category: 'auth',
    patterns: [
      { type: 'package', match: '@supabase/supabase-js', confidence: 0.9 },
      { type: 'package', match: '@supabase/auth', confidence: 0.95 },
    ],
  },
  firebase: {
    name: 'Firebase Auth',
    category: 'auth',
    patterns: [
      { type: 'package', match: 'firebase', confidence: 0.85 },
      { type: 'package', match: '@firebase/auth', confidence: 0.95 },
    ],
  },

  // Databases & ORMs
  postgres: {
    name: 'PostgreSQL',
    category: 'db',
    patterns: [
      { type: 'package', match: 'pg', confidence: 0.95 },
      { type: 'package', match: 'postgres', confidence: 0.95 },
      { type: 'content', match: /postgresql:\/\//, confidence: 0.9 },
    ],
  },
  mysql: {
    name: 'MySQL',
    category: 'db',
    patterns: [
      { type: 'package', match: 'mysql2', confidence: 0.95 },
      { type: 'package', match: 'mysql', confidence: 0.95 },
    ],
  },
  mongodb: {
    name: 'MongoDB',
    category: 'db',
    patterns: [
      { type: 'package', match: 'mongodb', confidence: 0.95 },
      { type: 'package', match: 'mongoose', confidence: 0.95 },
    ],
  },
  redis: {
    name: 'Redis',
    category: 'db',
    patterns: [
      { type: 'package', match: 'redis', confidence: 0.95 },
      { type: 'package', match: 'ioredis', confidence: 0.95 },
    ],
  },
  prisma: {
    name: 'Prisma',
    category: 'db',
    patterns: [
      { type: 'package', match: '@prisma/client', confidence: 0.95 },
      { type: 'package', match: 'prisma', confidence: 0.95 },
      { type: 'file', match: 'schema.prisma', confidence: 0.95 },
    ],
  },
  drizzle: {
    name: 'Drizzle ORM',
    category: 'db',
    patterns: [
      { type: 'package', match: 'drizzle-orm', confidence: 0.95 },
      { type: 'file', match: /drizzle\.config\.(ts|js)$/, confidence: 0.95 },
    ],
  },
  convex: {
    name: 'Convex',
    category: 'db',
    patterns: [
      { type: 'package', match: 'convex', confidence: 0.95 },
      { type: 'file', match: 'convex.json', confidence: 0.95 },
    ],
  },

  // Infra/Deploy
  cloudflare: {
    name: 'Cloudflare',
    category: 'infra',
    patterns: [
      { type: 'file', match: 'wrangler.toml', confidence: 0.95 },
      { type: 'package', match: 'wrangler', confidence: 0.9 },
      { type: 'package', match: '@cloudflare/workers-types', confidence: 0.9 },
    ],
  },
  netlify: {
    name: 'Netlify',
    category: 'infra',
    patterns: [
      { type: 'file', match: 'netlify.toml', confidence: 0.95 },
      { type: 'file', match: '_redirects', confidence: 0.7 },
    ],
  },
  vercel: {
    name: 'Vercel',
    category: 'infra',
    patterns: [
      { type: 'file', match: 'vercel.json', confidence: 0.95 },
      { type: 'package', match: '@vercel/node', confidence: 0.85 },
    ],
  },
  docker: {
    name: 'Docker',
    category: 'infra',
    patterns: [
      { type: 'file', match: 'Dockerfile', confidence: 0.95 },
      { type: 'file', match: 'docker-compose.yml', confidence: 0.95 },
    ],
  },

  // Tools
  sentry: {
    name: 'Sentry',
    category: 'tool',
    patterns: [
      { type: 'package', match: '@sentry/react', confidence: 0.95 },
      { type: 'package', match: '@sentry/node', confidence: 0.95 },
      { type: 'package', match: '@sentry/nextjs', confidence: 0.95 },
    ],
  },
  firecrawl: {
    name: 'Firecrawl',
    category: 'tool',
    patterns: [
      { type: 'package', match: '@mendable/firecrawl-js', confidence: 0.95 },
      { type: 'package', match: 'firecrawl', confidence: 0.95 },
    ],
  },
  autumn: {
    name: 'Autumn',
    category: 'tool',
    patterns: [
      { type: 'package', match: 'autumn', confidence: 0.95 },
    ],
  },
}

// Arquivos prioritários para detecção
export const PRIORITY_FILES = [
  'pnpm-lock.yaml',
  'yarn.lock',
  'package-lock.json',
  'package.json',
  'README.md',
  'Dockerfile',
  'tsconfig.json',
  /tailwind\.config\.(js|ts|mjs|cjs)$/,
  'wrangler.toml',
  'netlify.toml',
  'vercel.json',
  '.env.example',
  'schema.prisma',
  /drizzle\.config\.(ts|js)$/,
  'convex.json',
]

// Normalizar versão extraída
function normalizeVersion(version: string): string {
  return version.replace(/^[\^~]/, '').trim()
}

// Extrair versão de package.json
function extractVersion(packageJson: any, packageName: string): string | undefined {
  const deps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
    ...packageJson.peerDependencies,
  }
  return deps[packageName] ? normalizeVersion(deps[packageName]) : undefined
}

// Detectar tecnologias em arquivos
export function detectTechnologies(files: FileContent[]): DetectedTech[] {
  const detected = new Map<string, DetectedTech>()

  // Parse package.json se existir
  const packageJsonFile = files.find((f) => f.path.endsWith('package.json'))
  let packageJson: any = null
  if (packageJsonFile) {
    try {
      packageJson = JSON.parse(packageJsonFile.content)
    } catch (e) {
      console.error('Failed to parse package.json', e)
    }
  }

  // Iterar sobre todas as tecnologias conhecidas
  for (const [key, tech] of Object.entries(TECH_PATTERNS)) {
    let maxConfidence = 0
    let sources: string[] = []
    let version: string | undefined

    for (const pattern of tech.patterns) {
      if (pattern.type === 'package' && packageJson) {
        const allDeps = {
          ...packageJson.dependencies,
          ...packageJson.devDependencies,
          ...packageJson.peerDependencies,
        }

        for (const [depName, depVersion] of Object.entries(allDeps)) {
          if (
            typeof pattern.match === 'string'
              ? depName === pattern.match || depName.includes(pattern.match)
              : pattern.match.test(depName)
          ) {
            maxConfidence = Math.max(maxConfidence, pattern.confidence)
            sources.push('package.json')
            if (!version && typeof depVersion === 'string') {
              version = normalizeVersion(depVersion)
            }
          }
        }
      }

      if (pattern.type === 'file') {
        for (const file of files) {
          const fileName = file.path.split('/').pop() || ''
          const matches =
            typeof pattern.match === 'string'
              ? fileName === pattern.match
              : pattern.match.test(fileName)

          if (matches) {
            maxConfidence = Math.max(maxConfidence, pattern.confidence)
            if (!sources.includes(fileName)) {
              sources.push(fileName)
            }
          }
        }
      }

      if (pattern.type === 'content') {
        for (const file of files) {
          if (
            typeof pattern.match === 'string'
              ? file.content.includes(pattern.match)
              : pattern.match.test(file.content)
          ) {
            maxConfidence = Math.max(maxConfidence, pattern.confidence)
            const fileName = file.path.split('/').pop() || file.path
            if (!sources.includes(fileName)) {
              sources.push(fileName)
            }
          }
        }
      }
    }

    // Adicionar se confiança >= 0.7
    if (maxConfidence >= 0.7) {
      detected.set(key, {
        key,
        name: tech.name,
        category: tech.category,
        version,
        confidence: maxConfidence,
        sources,
      })
    }
  }

  return Array.from(detected.values()).sort((a, b) => b.confidence - a.confidence)
}

// Gerar resumo da análise
export function generateAnalysisSummary(techs: DetectedTech[]): string {
  const byCategory: Record<TechCategory, DetectedTech[]> = {
    language: [],
    framework: [],
    auth: [],
    db: [],
    infra: [],
    tool: [],
  }

  for (const tech of techs) {
    byCategory[tech.category].push(tech)
  }

  const parts: string[] = []

  if (byCategory.language.length > 0) {
    parts.push(byCategory.language.map((t) => t.name).join(', '))
  }

  if (byCategory.framework.length > 0) {
    parts.push(byCategory.framework.map((t) => t.name).join(' + '))
  }

  if (byCategory.auth.length > 0) {
    parts.push(`Auth: ${byCategory.auth.map((t) => t.name).join(', ')}`)
  }

  if (byCategory.db.length > 0) {
    parts.push(`DB: ${byCategory.db.map((t) => t.name).join(', ')}`)
  }

  if (byCategory.infra.length > 0) {
    parts.push(`Infra: ${byCategory.infra.map((t) => t.name).join(', ')}`)
  }

  if (byCategory.tool.length > 0) {
    parts.push(`Observabilidade: ${byCategory.tool.map((t) => t.name).join(', ')}`)
  }

  return parts.join('; ')
}
