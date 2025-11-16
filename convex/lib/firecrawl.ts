import FirecrawlApp from '@mendable/firecrawl-js'
import { PRIORITY_FILES } from './detector'

export interface GitHubFileResult {
  path: string
  content: string
  url: string
}

// Normalizar URL do GitHub
export function parseGitHubUrl(url: string): {
  owner: string
  repo: string
  branch?: string
} | null {
  try {
    // Remove trailing slash e .git
    const cleanUrl = url.trim().replace(/\.git$/, '').replace(/\/$/, '')

    const githubRegex = /github\.com\/([^\/]+)\/([^\/]+)(?:\/tree\/([^\/]+))?/
    const match = cleanUrl.match(githubRegex)

    if (!match) return null

    // Remove qualquer sufixo do repo (ex: .git que não foi pego antes)
    const repo = match[2].replace(/\.git$/, '')

    return {
      owner: match[1],
      repo: repo,
      branch: match[3],
    }
  } catch {
    return null
  }
}

// Construir URL raw do GitHub para um arquivo
function buildRawUrl(owner: string, repo: string, branch: string, path: string): string {
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`
}

// Buscar arquivo específico do GitHub
async function fetchGitHubFile(
  owner: string,
  repo: string,
  branch: string,
  filePath: string
): Promise<GitHubFileResult | null> {
  try {
    const url = buildRawUrl(owner, repo, branch, filePath)
    const response = await fetch(url)

    if (!response.ok) return null

    const content = await response.text()
    return {
      path: filePath,
      content,
      url,
    }
  } catch (error) {
    console.error(`Failed to fetch ${filePath}:`, error)
    return null
  }
}

// Verificar se o repositório existe e é público
export async function checkRepositoryExists(owner: string, repo: string): Promise<{
  exists: boolean
  isPrivate: boolean
  defaultBranch?: string
  message?: string
}> {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`)
    
    if (response.status === 404) {
      return {
        exists: false,
        isPrivate: false,
        message: 'Repository not found. Please check the owner and repository name.',
      }
    }

    if (response.status === 403) {
      return {
        exists: true,
        isPrivate: true,
        message: 'Repository may be private. Access denied.',
      }
    }

    if (!response.ok) {
      return {
        exists: false,
        isPrivate: false,
        message: `Failed to access repository: ${response.statusText}`,
      }
    }

    const data = await response.json()
    return {
      exists: true,
      isPrivate: data.private || false,
      defaultBranch: data.default_branch || 'main',
      message: data.private ? 'Repository is private.' : undefined,
    }
  } catch (error) {
    console.error('Error checking repository:', error)
    return {
      exists: false,
      isPrivate: false,
      message: 'Failed to check repository. Network error or invalid URL.',
    }
  }
}

// Buscar branch padrão do repositório
async function getDefaultBranch(owner: string, repo: string): Promise<string> {
  const repoInfo = await checkRepositoryExists(owner, repo)
  if (!repoInfo.exists || !repoInfo.defaultBranch) {
    return 'main'
  }
  return repoInfo.defaultBranch
}

// Buscar arquivos prioritários usando Firecrawl
export async function fetchGitHubFilesWithFirecrawl(
  firecrawlApiKey: string,
  owner: string,
  repo: string,
  branch?: string
): Promise<GitHubFileResult[]> {
  try {
    const app = new FirecrawlApp({ apiKey: firecrawlApiKey })
    const defaultBranch = branch || (await getDefaultBranch(owner, repo))
    const files: GitHubFileResult[] = []

    // Listar arquivos prioritários
    const filesToFetch: string[] = []

    // Adicionar arquivos raiz
    for (const file of PRIORITY_FILES) {
      if (typeof file === 'string') {
        filesToFetch.push(file)
      }
    }

    // Adicionar arquivos de monorepo
    const monorepoPatterns = [
      'apps/*/package.json',
      'packages/*/package.json',
    ]

    // Fetch arquivos diretamente via GitHub API
    for (const filePath of filesToFetch) {
      const file = await fetchGitHubFile(owner, repo, defaultBranch, filePath)
      if (file) {
        files.push(file)
      }
    }

    // Tentar buscar estrutura de monorepo
    const appsPackageJson = await fetchGitHubFile(
      owner,
      repo,
      defaultBranch,
      'apps/package.json'
    )
    if (appsPackageJson) {
      files.push(appsPackageJson)
    }

    const packagesPackageJson = await fetchGitHubFile(
      owner,
      repo,
      defaultBranch,
      'packages/package.json'
    )
    if (packagesPackageJson) {
      files.push(packagesPackageJson)
    }

    return files
  } catch (error) {
    console.error('Firecrawl fetch failed:', error)
    throw error
  }
}

// Fallback: buscar arquivos sem Firecrawl (apenas GitHub API/Raw)
export async function fetchGitHubFilesFallback(
  owner: string,
  repo: string,
  branch?: string
): Promise<GitHubFileResult[]> {
  // Verificar se o repositório existe primeiro
  const repoInfo = await checkRepositoryExists(owner, repo)
  
  if (!repoInfo.exists) {
    throw new Error(repoInfo.message || 'Repository not found. Please check the owner and repository name.')
  }

  if (repoInfo.isPrivate) {
    throw new Error(repoInfo.message || 'Repository is private. Public repositories only.')
  }

  const defaultBranch = branch || repoInfo.defaultBranch || 'main'
  const files: GitHubFileResult[] = []

  // Lista de arquivos prioritários para buscar
  const priorityFilePaths = [
    'package.json',
    'package-lock.json',
    'pnpm-lock.yaml',
    'yarn.lock',
    'tsconfig.json',
    'tailwind.config.js',
    'tailwind.config.ts',
    'wrangler.toml',
    'netlify.toml',
    'vercel.json',
    'Dockerfile',
    'README.md',
    'schema.prisma',
    'drizzle.config.ts',
    'convex.json',
    // Flutter/Dart
    'pubspec.yaml',
    'pubspec.lock',
    // Python
    'requirements.txt',
    'pyproject.toml',
    'Pipfile',
    'setup.py',
    'manage.py',
    // Go
    'go.mod',
    'go.sum',
    // Rust
    'Cargo.toml',
    'Cargo.lock',
    // Java/Kotlin
    'pom.xml',
    'build.gradle',
    'build.gradle.kts',
    'gradlew',
    'settings.gradle',
    // Swift
    'Package.swift',
    'Podfile',
    // C#/.NET
    'project.json',
    // PHP
    'composer.json',
    'composer.lock',
    // Ruby
    'Gemfile',
    'Gemfile.lock',
    'Rakefile',
    // Elixir
    'mix.exs',
    'mix.lock',
    // Scala
    'build.sbt',
    // Haskell
    'stack.yaml',
    // Clojure
    'project.clj',
    'deps.edn',
    // Erlang
    'rebar.config',
    // R
    'DESCRIPTION',
    // Julia
    'Project.toml',
    'Manifest.toml',
    // Zig
    'build.zig',
    // C/C++
    'CMakeLists.txt',
    'Makefile',
    // Solidity
    'hardhat.config.js',
    'truffle-config.js',
    // Vue/Nuxt
    'nuxt.config.js',
    'nuxt.config.ts',
    // Angular
    'angular.json',
    // Svelte
    'svelte.config.js',
    // NestJS
    'nest-cli.json',
    // Spring
    'application.properties',
    'application.yml',
    // Rails
    'config/routes.rb',
    // Laravel
    'artisan',
    // ASP.NET
    'appsettings.json',
    // Unity
    'ProjectSettings/ProjectVersion.txt',
    // Godot
    'project.godot',
    // React Native
    'app.json',
    'metro.config.js',
  ]

  // Buscar cada arquivo
  for (const filePath of priorityFilePaths) {
    const file = await fetchGitHubFile(owner, repo, defaultBranch, filePath)
    if (file) {
      files.push(file)
    }
  }

  // Se nenhum arquivo foi encontrado após verificar que o repositório existe e é público,
  // o repositório pode não ter arquivos reconhecidos ou o branch especificado pode não existir
  if (files.length === 0) {
    // Verificar se o branch existe tentando buscar um arquivo comum
    const testFile = await fetchGitHubFile(owner, repo, defaultBranch, 'README.md')
    if (!testFile) {
      // Verificar se outro branch comum existe
      const altBranches = branch ? [] : ['master', 'develop', 'main']
      let branchFound = false
      
      for (const altBranch of altBranches) {
        const testFileAlt = await fetchGitHubFile(owner, repo, altBranch, 'README.md')
        if (testFileAlt) {
          branchFound = true
          break
        }
      }
      
      if (!branchFound && branch) {
        throw new Error(`Branch "${branch}" not found in repository. The repository may not have this branch.`)
      }
    }
    
    throw new Error(`No recognized configuration files found in repository. The repository exists but doesn't contain any of the expected files (package.json, requirements.txt, etc.).`)
  }

  return files
}
