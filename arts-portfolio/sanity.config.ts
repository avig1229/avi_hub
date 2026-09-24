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

export default defineConfig({
    basePath: '/studio',
    projectId: projectId || '',
    dataset: dataset || '',
    // Add and edit the content schema in the './sanity/schema' folder
    schema,
    // Keep the Site guide singleton out of the "create new" menu.
    document: {
        newDocumentOptions: (prev) => prev.filter((t) => t.templateId !== 'siteGuide'),
    },
    plugins: [
        structureTool({
            // Site guide is a singleton: one fixed document, no create/list.
            structure: (S) =>
                S.list()
                    .title('Content')
                    .items([
                        S.listItem()
                            .title('Site guide')
                            .id('siteGuide')
                            .child(S.document().schemaType('siteGuide').documentId('siteGuide')),
                        S.divider(),
                        ...S.documentTypeListItems().filter((item) => item.getId() !== 'siteGuide'),
                    ]),
        }),
        // Vision is a tool that lets you query your content with GROQ in the studio
        // https://www.sanity.io/docs/the-vision-plugin
        visionTool({ defaultApiVersion: apiVersion }),
    ],
})
