import * as Sentry from '@sentry/tanstackstart-react'

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% das transações (ajuste em produção)

  // Adds request headers and IP for users
  sendDefaultPii: true,

  // Environment
  environment: process.env.NODE_ENV || 'development',
})
