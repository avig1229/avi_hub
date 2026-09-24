'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from './src/sanity/env'
import { schema } from './src/sanity/schemaTypes'

const SINGLETONS = ['siteGuide', 'musicRec']

export default defineConfig({
    basePath: '/studio',
    projectId: projectId || '',
    dataset: dataset || '',
    // Add and edit the content schema in the './sanity/schema' folder
    schema,
    // Keep the singletons out of the "create new" menu.
    document: {
        newDocumentOptions: (prev) => prev.filter((t) => !SINGLETONS.includes(t.templateId)),
    },
    plugins: [
        structureTool({
            // Singletons: one fixed document each, no create/list.
            structure: (S) =>
                S.list()
                    .title('Content')
                    .items([
                        S.listItem()
                            .title('Site guide')
                            .id('siteGuide')
                            .child(S.document().schemaType('siteGuide').documentId('siteGuide')),
                        S.listItem()
                            .title('Weekly music rec')
                            .id('musicRec')
                            .child(S.document().schemaType('musicRec').documentId('musicRec')),
                        S.divider(),
                        ...S.documentTypeListItems().filter((item) => !SINGLETONS.includes(item.getId() ?? '')),
                    ]),
        }),
        // Vision is a tool that lets you query your content with GROQ in the studio
        // https://www.sanity.io/docs/the-vision-plugin
        visionTool({ defaultApiVersion: apiVersion }),
    ],
})
