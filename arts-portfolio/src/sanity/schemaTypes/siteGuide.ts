import { defineField, defineType } from 'sanity'

const LINES_HELP = 'What the guide says here. Leave a blank line between pages of dialogue. Empty uses the built-in line.'

// Singleton: the mascot guide's name and the lines for site-wide spots.
// Per-project and per-series lines live on those documents.
export default defineType({
    name: 'siteGuide',
    title: 'Site guide',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Guide name',
            type: 'string',
            description: 'Shown on his dialogue box name tag.',
        }),
        defineField({ name: 'home', title: 'Home page', type: 'text', rows: 3, description: LINES_HELP }),
        defineField({ name: 'about', title: 'About page', type: 'text', rows: 3, description: LINES_HELP }),
        defineField({ name: 'typeNotes', title: 'About → Type notes', type: 'text', rows: 3, description: LINES_HELP }),
        defineField({ name: 'idle', title: 'When tapped with nothing to say', type: 'text', rows: 2, description: LINES_HELP }),
    ],
    preview: { prepare: () => ({ title: 'Site guide' }) },
})
