/// <reference types="vite/client" />


interface ImportMetaEnv {
  readonly VITE_API_KEY: string
  // ajoute d'autres variables d'environnement ici si besoin
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
