import { defineType, defineField } from 'sanity';

export const reason = defineType({
    name: 'reason',
    title: 'Why I Like You Reason',
    type: 'document',
    fields: [
        defineField({
            name: 'text',
            title: 'Reason Text',
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
