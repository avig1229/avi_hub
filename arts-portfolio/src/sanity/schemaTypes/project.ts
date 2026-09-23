import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'project',
    title: 'Project',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    { title: 'Generative Art', value: 'Generative Art' },
                    { title: 'Interactive', value: 'Interactive' },
                    { title: '3D Modeling', value: '3D Modeling' },
                    { title: 'Video', value: 'Video' },
                    { title: 'Creative Coding', value: 'Creative Coding' },
                    { title: 'Installation', value: 'Installation' },
                    { title: 'Fashion Design', value: 'Fashion Design' },
                    { title: 'Graphic Design', value: 'Graphic Design' },
                    { title: 'Brand Design', value: 'Brand Design' },
                ],
            },
        }),
        defineField({
            name: 'date',
            title: 'Date/Year',
            type: 'string',
        }),
        defineField({
            name: 'mainImage',
            title: 'Main image',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'content',
            title: 'Content',
            type: 'blockContent',
        }),
        defineField({
            name: 'links',
            title: 'Project Links',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'title', title: 'Link Title', type: 'string' },
                        { name: 'url', title: 'URL', type: 'url' },
                    ],
                },
            ],
        }),
        defineField({
            name: 'gallery',
            title: 'Gallery (Images & Videos)',
            type: 'array',
            of: [
                {
                    type: 'image',
                    options: { hotspot: true },
                    fields: [
                        {
                            name: 'caption',
                            type: 'string',
                            title: 'Caption',
                        },
                        {
                            name: 'story',
                            type: 'text',
                            title: 'Story',
                            rows: 4,
                            description: 'A short backstory for this piece. Shown when hovering the piece on flagship pages.',
                        },
                        {
                            name: 'series',
                            type: 'string',
                            title: 'Series',
                            description: 'Which CORE series this piece belongs to. Left empty, it goes to Experimentals.',
                            options: {
                                list: [
                                    { title: 'Sashiko', value: 'sashiko' },
                                    { title: 'Graffiti', value: 'graffiti' },
                                    { title: 'Experimentals', value: 'experimentals' },
                                ],
                                layout: 'radio',
                                direction: 'horizontal',
                            },
                            hidden: ({ document }) => (document?.slug as { current?: string } | undefined)?.current !== 'core-collection',
                        },
                    ],
                },
                {
                    type: 'file',
                    options: { accept: 'video/*' },
                    fields: [
                        {
                            name: 'caption',
                            type: 'string',
                            title: 'Video Caption'
                        }
                    ]
                }
            ]
        }),
        defineField({
            name: 'subsections',
            title: 'Subsections (Seasons/Chapters)',
            type: 'array',
            of: [
                {
                    type: 'object',
                    title: 'Section',
                    fields: [
                        {
                            name: 'title',
                            title: 'Section Title',
                            type: 'string',
                        },
                        {
                            name: 'description',
                            title: 'Description',
                            type: 'blockContent',
                        },
                        {
                            name: 'gallery',
                            title: 'Section Gallery',
                            type: 'array',
                            of: [
                                {
                                    type: 'image',
                                    options: { hotspot: true },
                                    fields: [
                                        {
                                            name: 'caption',
                                            type: 'string',
                                            title: 'Caption',
                                        },
                                        {
                                            name: 'story',
                                            type: 'text',
                                            title: 'Story',
                                            rows: 4,
                                            description: 'A short backstory for this piece. Shown when hovering the piece on flagship pages.',
                                        },
                                    ],
                                },
                                {
                                    type: 'file',
                                    options: { accept: 'video/*' },
                                    fields: [
                                        {
                                            name: 'caption',
                                            type: 'string',
                                            title: 'Video Caption'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        })
    ],
    preview: {
        select: {
            title: 'title',
            media: 'mainImage',
        },
    },
})
