import { defineType, defineField } from 'sanity';

export const hero = defineType({
    name: 'hero',
    title: '🎬 Hero Section',
    type: 'document',
    icon: () => '🎬',
    fields: [
        defineField({
            name: 'top',
            title: 'Top Line Text',
            type: 'string',
            description: 'The main heading top line (e.g. "JUST ONE")',
            validation: (Rule) => Rule.required().max(50),
        }),
        defineField({
            name: 'bottom',
            title: 'Bottom Line Text',
            type: 'string',
            description: 'The main heading bottom line (e.g. "CHANCE")',
            validation: (Rule) => Rule.required().max(50),
        }),
        defineField({
            name: 'subtitle',
            title: 'Corner Subtitle',
            type: 'string',
            description: 'Text shown in the top-right corner (e.g. "MY SIDE OF THE STORY ©")',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'backgroundImage',
            title: 'Background Image',
            type: 'image',
            description: 'Optional background image for the hero section',
            options: { hotspot: true },
        }),
    ],
    preview: {
        select: {
            top: 'top',
            bottom: 'bottom',
        },
        prepare({ top, bottom }) {
            return {
                title: `${top || ''} ${bottom || ''}`.trim() || 'Hero Section',
                subtitle: 'Hero — Opening Section',
            };
        },
    },
});
