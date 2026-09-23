import { defineField, defineType } from 'sanity'

// A series within the CORE collection (e.g. Sashiko, Graffiti). Pieces pick
// one; each series becomes its own section on the CORE page.
export default defineType({
    name: 'coreSeries',
    title: 'CORE Series',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Name',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            description: 'Used for the section link. Click Generate.',
            options: { source: 'title', maxLength: 48 },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'blurb',
            title: 'Blurb',
            type: 'string',
            description: 'One short line shown next to the series name.',
        }),
        defineField({
            name: 'accent',
            title: 'Accent color',
            type: 'string',
            description: 'Hex color for the series label and story line, e.g. #ff8ad8.',
            validation: (rule) =>
                rule.regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, { name: 'hex color' }),
        }),
        defineField({
            name: 'order',
            title: 'Order',
            type: 'number',
            description: 'Lower numbers come first on the page.',
        }),
    ],
    orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
    preview: { select: { title: 'title', subtitle: 'blurb' } },
})
