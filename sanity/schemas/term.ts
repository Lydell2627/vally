import { defineType, defineField } from 'sanity';

export const term = defineType({
    name: 'term',
    title: '📜 Terms & Conditions',
    type: 'document',
    icon: () => '📜',
    fields: [
        defineField({
            name: 'title',
            title: 'Clause Title',
            type: 'string',
            description: 'The clause heading (e.g. "Clause 1: The No Pressure Policy")',
            validation: (Rule) => Rule.required().max(100),
        }),
        defineField({
            name: 'content',
            title: 'Clause Content',
            type: 'text',
            description: 'The fun, witty clause text',
            validation: (Rule) => Rule.required().min(10).max(500),
        }),
        defineField({
            name: 'order',
            title: 'Display Order',
            type: 'number',
            description: 'Lower numbers appear first in the card stack',
            validation: (Rule) => Rule.required().min(0),
        }),
    ],
    orderings: [
        {
            title: 'Display Order',
            name: 'orderAsc',
            by: [{ field: 'order', direction: 'asc' }],
        },
    ],
    preview: {
        select: {
            title: 'title',
            content: 'content',
        },
        prepare({ title, content }) {
            return {
                title: title || 'Untitled Clause',
                subtitle: content ? content.substring(0, 80) + '...' : '📜 Terms',
            };
        },
    },
});
