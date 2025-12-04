// Remplace les méthodes console par des no-op pour éliminer les logs
// Activation uniquement en production pour conserver les logs en développement.
if (import.meta.env.PROD) {
  const noop = () => {}
  const methods: Array<keyof Console> = [
    'log',
    'info',
    'warn',
    'error',
    'debug',
    'trace',
  ]
  methods.forEach((m) => {
    try {
      // @ts-expect-error: assignment to console method
      console[m] = noop
    } catch (_) {
      // Ignorer les erreurs d’assignation éventuelles
    }
  })
}

export {}
