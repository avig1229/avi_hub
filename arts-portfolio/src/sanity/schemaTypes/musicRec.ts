import { defineField, defineType } from 'sanity'

// Singleton: the home page's weekly music recommendation. The hero's record
// plays it; the Weekly rec card below credits it. Title and artist come from
// YouTube automatically.
export default defineType({
    name: 'musicRec',
    title: 'Weekly music rec',
    type: 'document',
    fields: [
        defineField({
            name: 'youtubeUrl',
            title: 'YouTube link',
            type: 'url',
            description: 'Paste the song’s YouTube link. Title and artist are filled in from YouTube.',
            validation: (rule) =>
                rule.required().uri({ scheme: ['https'] }).custom((v) =>
                    !v || /youtu\.be\/|youtube\.com\//.test(v) ? true : 'Must be a YouTube link',
                ),
        }),
        defineField({
            name: 'note',
            title: 'Why this week',
            type: 'text',
            rows: 2,
            description: 'Optional: a line on why you picked it.',
        }),
        defineField({
            name: 'weekOf',
            title: 'Week of',
            type: 'date',
            description: 'Optional: shown as “Week of …”.',
        }),
    ],
    preview: { select: { subtitle: 'youtubeUrl' }, prepare: ({ subtitle }) => ({ title: 'Weekly music rec', subtitle }) },
})
