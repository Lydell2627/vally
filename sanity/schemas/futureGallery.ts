import { defineType, defineField } from 'sanity';

export const futureGallery = defineType({
    name: 'futureGallery',
    title: '🖼️ Future Gallery',
    type: 'document',
    icon: () => '🖼️',
    fields: [
        defineField({
            name: 'title',
            title: 'Photo Title',
            type: 'string',
            description: 'A name for this gallery photo (e.g. "Beach Sunset Together")',
            validation: (Rule) => Rule.required().max(80),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            description: 'A short caption or story for this photo',
            validation: (Rule) => Rule.max(500),
        }),
        defineField({
            name: 'image',
            title: 'Gallery Image',
            type: 'image',
            description: 'The photo to display in the gallery',
            options: { hotspot: true },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'order',
            title: 'Display Order',
            type: 'number',
            description: 'Lower numbers appear first in the gallery',
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
                title: title || 'Untitled Gallery Photo',
                subtitle: '🖼️ Future Gallery',
                media,
            };
        },
    },
});
