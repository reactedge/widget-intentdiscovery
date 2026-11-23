// build/manifestPlugin.ts

import { createHash } from 'crypto'
import fs from 'fs'
import path from 'path'
import type { Plugin } from 'vite'

type Options = {
    widgetName: string
    version: string
}

export function manifestPlugin({ widgetName, version }: Options): Plugin {
    if (!widgetName) {
        throw new Error('manifestPlugin requires widgetName')
    }

    return {
        name: 'reactedge-manifest-plugin',
        apply: 'build',

        generateBundle(options, bundle) {
            const entries = Object.entries(bundle).filter(
                ([fileName, chunk]) =>
                    chunk.type === 'chunk' && fileName.endsWith('.iife.js')
            )

            if (entries.length !== 1) {
                throw new Error(
                    `Expected exactly one IIFE bundle, found ${entries.length}`
                )
            }

            const entry = entries[0]
            if (!entry || entry[1].type !== 'chunk') {
                throw new Error('Expected a widget JavaScript chunk')
            }
            const [fileName, chunk] = entry

            const digest = createHash('sha256').update(chunk.code).digest()

            const manifest = {
                widget: widgetName,
                version,
                hash: digest.toString('base64url'),
                integrity: `sha256-${digest.toString('base64')}`,
                filename: fileName,
                built_at: new Date().toISOString()
            }

            const outDir = options.dir || 'www'

            const manifestPath = path.join(
                outDir,
                `widget-${widgetName}.manifest.json`
            )

            fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))

            console.log(`✔ Manifest generated: ${manifestPath}`)
        }
    }
}
