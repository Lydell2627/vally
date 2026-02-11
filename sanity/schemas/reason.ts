import { defineType, defineField } from 'sanity';

export const reason = defineType({
    name: 'reason',
    title: '❤️ Why I Like You Reason',
    type: 'document',
    icon: () => '❤️',
    fields: [
        defineField({
            name: 'title',
            title: 'Reason Title',
            type: 'string',
            description: 'A short headline (e.g. "The Way You Listen")',
            validation: (Rule) => Rule.required().max(80),
        }),
        defineField({
            name: 'text',
            title: 'Reason Description',
            type: 'text',
            description: 'Expand on why this matters — be genuine and specific',
            validation: (Rule) => Rule.required().min(10).max(500),
        }),
        defineField({
            name: 'order',
            title: 'Display Order',
            type: 'number',
            description: 'Lower numbers appear first',
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
            text: 'text',
        },
        prepare({ title, text }) {
            return {
                title: title || 'Untitled Reason',
                subtitle: text ? text.substring(0, 80) + '...' : '❤️ Why I Like You',
            };
        },
    },
});
