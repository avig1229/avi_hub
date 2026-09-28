import { defineArrayMember, defineField, type ConditionalPropertyCallbackContext } from 'sanity'

// Fields that only appear on the shRma project: its brand intro and its
// seasons (the road). Everything here is optional; anything left empty falls
// back to the built-in content in src/flagships/shrma/content.ts.

const onlyOnShrma = ({ document }: ConditionalPropertyCallbackContext) =>
    (document?.slug as { current?: string } | undefined)?.current !== 'shrma'

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i

// Who sees a piece of content: visitors pick how geeky they are with design.
const level = defineField({
    name: 'level',
    title: 'Shows from',
    type: 'string',
    description: 'The lowest geek level that sees this. Higher levels see everything below them too.',
    options: {
        list: [
            { title: 'Low (just the vibes)', value: 'low' },
            { title: 'Mid (show me how)', value: 'mid' },
            { title: 'High AF (give me everything)', value: 'high' },
        ],
        layout: 'radio',
        direction: 'horizontal',
    },
    initialValue: 'mid',
})

const captionedImage = defineArrayMember({
    type: 'image',
    options: { hotspot: true },
    fields: [{ name: 'caption', type: 'string', title: 'Caption' }],
})

// A block of detail: a story, moodboard, sketches, concept doc, Pinterest
// saves, iterations, specs, a timeline… tagged with the level that sees it.
const detailBlock = defineArrayMember({
    type: 'object',
    name: 'shrmaDetail',
    title: 'Detail',
    fields: [
        defineField({ name: 'title', title: 'Title', type: 'string', description: 'e.g. "Moodboard", "From sketch to print", "Concept doc".' }),
        level,
        defineField({ name: 'body', title: 'Text', type: 'text', rows: 5 }),
        defineField({ name: 'images', title: 'Images', type: 'array', of: [captionedImage] }),
        defineField({ name: 'video', title: 'Video', type: 'file', options: { accept: 'video/*' } }),
    ],
    preview: {
        select: { title: 'title', level: 'level', media: 'images.0' },
        prepare: ({ title, level, media }) => ({ title: title || 'Detail', subtitle: `Shows from: ${level ?? 'mid'}`, media }),
    },
})

export const shrmaFields = [
    defineField({
        name: 'shrmaIntro',
        title: 'shRma: brand intro',
        type: 'object',
        hidden: onlyOnShrma,
        description: 'The opening of the shRma page, before visitors pick their geek level.',
        fields: [
            defineField({ name: 'headline', title: 'Headline', type: 'string' }),
            defineField({
                name: 'video',
                title: 'Cover video',
                type: 'file',
                options: { accept: 'video/*' },
                description: 'Plays muted behind the cover once, then holds on its last frame. Empty uses the logo process video.',
            }),
            defineField({ name: 'videoStart', title: 'Cover video: start at (seconds)', type: 'number', initialValue: 15 }),
            defineField({ name: 'videoEndTrim', title: 'Cover video: stop this many seconds before the end', type: 'number', initialValue: 0 }),
            defineField({ name: 'text', title: 'Intro text', type: 'text', rows: 5, description: 'Always shown. Leave a blank line between paragraphs.' }),
            defineField({ name: 'details', title: 'Details (logo story, process…)', type: 'array', of: [detailBlock] }),
        ],
    }),
    defineField({
        name: 'shrmaSeasons',
        title: 'shRma: seasons (the road)',
        type: 'array',
        hidden: onlyOnShrma,
        description: 'In order along the road, oldest first. If this is empty, the built-in seasons are used.',
        of: [
            defineArrayMember({
                type: 'object',
                name: 'shrmaSeason',
                title: 'Season',
                fields: [
                    defineField({ name: 'name', title: 'Name', type: 'string', description: 'e.g. "Formosa Cowboy".', validation: (r) => r.required() }),
                    defineField({ name: 'hanzi', title: 'Chinese title', type: 'string', description: 'Optional, set vertically on the chapter opener, e.g. 寶島牛仔.' }),
                    defineField({ name: 'label', title: 'Season label', type: 'string', description: 'e.g. "FW 24/25 · ACT I".' }),
                    defineField({ name: 'date', title: 'Launch date', type: 'string', description: 'As it should read, e.g. "10.10.2024".' }),
                    defineField({
                        name: 'era',
                        title: 'Era',
                        type: 'string',
                        options: { list: [{ title: 'Meraki', value: 'meraki' }, { title: 'shRma', value: 'shrma' }], layout: 'radio', direction: 'horizontal' },
                        initialValue: 'shrma',
                    }),
                    defineField({
                        name: 'status',
                        title: 'Status',
                        type: 'string',
                        options: { list: [{ title: 'Released', value: 'released' }, { title: 'Concept', value: 'concept' }], layout: 'radio', direction: 'horizontal' },
                        initialValue: 'released',
                    }),
                    defineField({ name: 'oneLiner', title: 'One-liner', type: 'text', rows: 2 }),
                    defineField({
                        name: 'palette',
                        title: 'Palette',
                        type: 'object',
                        description: 'Hex colours for this stop on the road, e.g. #0B3A30.',
                        options: { columns: 3 },
                        fields: ['bg', 'ink', 'accent'].map((name) =>
                            defineField({
                                name,
                                title: { bg: 'Background', ink: 'Text', accent: 'Accent' }[name],
                                type: 'string',
                                validation: (r) => r.regex(HEX, { name: 'hex colour' }),
                            }),
                        ),
                    }),
                    defineField({ name: 'keyVisuals', title: 'Key visuals', type: 'array', of: [captionedImage] }),
                    defineField({
                        name: 'pieces',
                        title: 'Pieces',
                        type: 'array',
                        of: [
                            defineArrayMember({
                                type: 'object',
                                name: 'shrmaPiece',
                                title: 'Piece',
                                fields: [
                                    defineField({ name: 'name', title: 'Name', type: 'string' }),
                                    defineField({ name: 'key', title: 'Key piece', type: 'boolean', description: 'Shown big (in 3D if it has a model) at the season stop.' }),
                                    defineField({ name: 'images', title: 'Images (front, back…)', type: 'array', of: [captionedImage] }),
                                    defineField({
                                        name: 'model',
                                        title: '3D model',
                                        type: 'file',
                                        description: 'A .glb file. Visitors can spin it, and view it in AR on phones.',
                                        options: { accept: '.glb,.gltf,model/gltf-binary' },
                                    }),
                                    defineField({ name: 'notes', title: 'Design notes (Mid)', type: 'text', rows: 3 }),
                                    defineField({ name: 'specs', title: 'Tech specs (High AF)', type: 'text', rows: 3 }),
                                ],
                                preview: { select: { title: 'name', media: 'images.0' } },
                            }),
                        ],
                    }),
                    defineField({ name: 'photos', title: 'Worn / event photos', type: 'array', of: [captionedImage] }),
                    defineField({ name: 'details', title: 'Details (story, moodboards, process…)', type: 'array', of: [detailBlock] }),
                ],
                preview: {
                    select: { title: 'name', label: 'label', status: 'status', media: 'keyVisuals.0' },
                    prepare: ({ title, label, status, media }) => ({ title, subtitle: [label, status].filter(Boolean).join(' · '), media }),
                },
            }),
        ],
    }),
]
