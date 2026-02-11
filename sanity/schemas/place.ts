import { defineType, defineField } from 'sanity';

export const place = defineType({
    name: 'place',
    title: '🗺️ Place',
    type: 'document',
    icon: () => '🗺️',
    fields: [
        defineField({
            name: 'name',
            title: 'Place Name',
            type: 'string',
            description: 'The destination name (e.g. "The Late Night Diner")',
            validation: (Rule) => Rule.required().max(80),
        }),
        defineField({
            name: 'subtitle',
            title: 'Subtitle / Tagline',
            type: 'string',
            description: 'A short tagline like "2:00 AM" or "City Lights"',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            description: 'Why this place is special — paint a picture',
            validation: (Rule) => Rule.required().min(10).max(500),
        }),
        defineField({
            name: 'image',
            title: 'Destination Image',
            type: 'image',
            description: 'A beautiful photo of this place',
            options: { hotspot: true },
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
            title: 'name',
            subtitle: 'subtitle',
            media: 'image',
        },
        prepare({ title, subtitle, media }) {
            return {
                title: title || 'Untitled Place',
                subtitle: subtitle || '🗺️ Destination',
                media,
            };
        },
    },
});
