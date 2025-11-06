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
  tailwind: {
    name: 'Tailwind CSS',
    category: 'framework',
    patterns: [
      { type: 'package', match: 'tailwindcss', confidence: 0.95 },
      { type: 'file', match: /tailwind\.config\.(js|ts|mjs|cjs)$/, confidence: 0.95 },
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
