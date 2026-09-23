'use client'

import dynamic from 'next/dynamic'

// The Studio is browser-only. Loading it without SSR keeps its server-side
// dependencies (jsdom via isomorphic-dompurify) out of the server entirely;
// they crash both the webpack dev server and the Vercel runtime.
const NextStudio = dynamic(
    async () => {
        const [{ NextStudio }, { default: config }] = await Promise.all([
            import('next-sanity/studio'),
            import('../../../../sanity.config'),
        ])
        return function Studio() {
            return <NextStudio config={config} />
        }
    },
    { ssr: false },
)

export function Studio() {
    return <NextStudio />
}
