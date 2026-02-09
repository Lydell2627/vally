import { defineType, defineField } from 'sanity';

export const term = defineType({
    name: 'term',
    title: 'Terms and Conditions',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Term Title',
            type: 'string',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
        }),
        defineField({
            name: 'order',
            title: 'Display Order',
            type: 'number',
        }),
    ],
    orderings: [
        {
            title: 'Display Order',
            name: 'orderAsc',
            by: [{ field: 'order', direction: 'asc' }],
        },
    ],
});
