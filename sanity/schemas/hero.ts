import { defineType, defineField } from 'sanity';

export const hero = defineType({
    name: 'hero',
    title: 'Hero Section',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
        }),
        defineField({
            name: 'subtitle',
            title: 'Subtitle',
            type: 'string',
        }),
        defineField({
            name: 'backgroundImage',
            title: 'Background Image',
            type: 'image',
            options: { hotspot: true },
        }),
    ],
});
