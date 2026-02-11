import { defineType, defineField } from 'sanity';

export const futureMemory = defineType({
    name: 'futureMemory',
    title: '🌅 Future Memory',
    type: 'document',
    icon: () => '🌅',
    fields: [
        defineField({
            name: 'title',
            title: 'Memory Title',
            type: 'string',
            description: 'A name for this future vision (e.g. "The Golden Hour Shot")',
            validation: (Rule) => Rule.required().max(80),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            description: 'Describe the dream moment in vivid detail',
            validation: (Rule) => Rule.required().min(10).max(500),
        }),
        defineField({
            name: 'image',
            title: 'Vision Image',
            type: 'image',
            description: 'A photo that captures the vibe of this future memory',
            options: { hotspot: true },
        }),
        defineField({
            name: 'order',
            title: 'Display Order',
            type: 'number',
            description: 'Lower numbers appear first in the reel',
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
            media: 'image',
        },
        prepare({ title, media }) {
            return {
                title: title || 'Untitled Future Memory',
                subtitle: '🌅 Future Memories Reel',
                media,
            };
        },
    },
});
