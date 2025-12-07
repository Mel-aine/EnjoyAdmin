// Silencieux console sécurisé (production uniquement)
// Conserve warn/error pour ne pas masquer les erreurs critiques.
if (import.meta.env.PROD) {
  // Évite les doubles overrides (HMR, imports multiples)
  const flagKey = '__ENJOY_CONSOLE_SILENCED__'
  const globalAny = globalThis as any
  if (!globalAny[flagKey]) {
    const noop = () => {}
    const boundNoop = Function.prototype.bind.call(noop, console)

    // Ne PAS toucher à warn/error/clear
    const silentMethods: Array<keyof Console> = [
      'log',
      'info',
      'debug',
      'trace',
      'group',
      'groupCollapsed',
      'groupEnd',
      'time',
      'timeEnd',
      'timeLog',
    ]

    silentMethods.forEach((m) => {
      try {
        if (typeof console[m] === 'function') {
          // @ts-expect-error: assignment to console method
          console[m] = boundNoop
        } else {
          // @ts-expect-error: assignment to console method
          console[m] = boundNoop
        }
      } catch (_) {
        // Ignorer les erreurs d’assignation éventuelles
      }
    })

    globalAny[flagKey] = true
  }
}

export {}
