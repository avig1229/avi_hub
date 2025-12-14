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
            name: 'gallery',
            title: 'Gallery',
            type: 'array',
            of: [{ type: 'image' }]
        })
    ],
    preview: {
        select: {
            title: 'title',
            media: 'mainImage',
        },
    },
})
