import { defineArrayMember, defineField, defineType } from 'sanity'

// Singleton: the records in the room's crate, besides the weekly rec. Visitors
// flip through them and put one on the turntable. Title and artist come from
// YouTube automatically.
export default defineType({
    name: 'recordCrate',
    title: 'Record crate',
    type: 'document',
    fields: [
        defineField({
            name: 'records',
            title: 'Records',
            type: 'array',
            description: 'Songs that say something about you, in the order visitors flip through them.',
            of: [
                defineArrayMember({
                    type: 'object',
                    name: 'record',
                    fields: [
                        defineField({
                            name: 'youtubeUrl',
                            title: 'YouTube link',
                            type: 'url',
                            validation: (rule) =>
                                rule.required().uri({ scheme: ['https'] }).custom((v) =>
                                    !v || /youtu\.be\/|youtube\.com\//.test(v) ? true : 'Must be a YouTube link',
                                ),
                        }),
                        defineField({
                            name: 'note',
                            title: 'Why this one',
                            type: 'text',
                            rows: 2,
                            description: 'Optional: what this song says about you.',
                        }),
                    ],
                    preview: { select: { title: 'youtubeUrl', subtitle: 'note' } },
                }),
            ],
        }),
    ],
    preview: { prepare: () => ({ title: 'Record crate' }) },
})
