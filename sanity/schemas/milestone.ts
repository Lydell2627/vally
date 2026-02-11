import { defineType, defineField } from 'sanity';

export const milestone = defineType({
    name: 'milestone',
    title: '📅 Milestone',
    type: 'document',
    icon: () => '📅',
    fields: [
        defineField({
            name: 'title',
            title: 'Memory Title',
            type: 'string',
            description: 'The headline for this milestone (e.g. "THE FIRST HANGOUT")',
            validation: (Rule) => Rule.required().max(80),
        }),
        defineField({
            name: 'category',
            title: 'Category / Subtitle',
            type: 'string',
            description: 'A short label like "Where it started" or "The Shift"',
        }),
        defineField({
            name: 'year',
            title: 'Time Period',
            type: 'string',
            description: 'When this happened (e.g. "Day 01", "The Middle", "2024")',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            description: 'The story behind this memory. Keep it personal and heartfelt.',
            validation: (Rule) => Rule.required().min(10).max(500),
        }),
        defineField({
            name: 'image',
            title: 'Primary Image',
            type: 'image',
            description: 'The main photo for this milestone',
            options: { hotspot: true },
        }),
        defineField({
            name: 'images',
            title: 'Additional Photos (Gallery)',
            type: 'array',
            description: 'Add more photos to create a gallery/variation for this milestone',
            of: [
                {
                    type: 'image',
                    options: { hotspot: true },
                },
            ],
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
            year: 'year',
            category: 'category',
            media: 'image',
        },
        prepare({ title, year, category, media }) {
            return {
                title: title || 'Untitled Milestone',
                subtitle: `${year || ''}${category ? ' — ' + category : ''}`,
                media,
            };
        },
    },
});
