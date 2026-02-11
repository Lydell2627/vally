import { defineType, defineField } from 'sanity';

export const narrative = defineType({
    name: 'narrative',
    title: '✍️ Narrative Section',
    type: 'document',
    icon: () => '✍️',
    fields: [
        defineField({
            name: 'texts',
            title: 'Narrative Texts',
            type: 'array',
            description: 'Each text block appears as a large animated statement. Order matters — the story flows top to bottom.',
            of: [{ type: 'text' }],
            validation: (Rule) => Rule.required().min(1),
        }),
    ],
    preview: {
        select: {
            texts: 'texts',
        },
        prepare({ texts }) {
            const count = texts?.length || 0;
            return {
                title: 'Narrative Section',
                subtitle: `${count} statement${count !== 1 ? 's' : ''}`,
            };
        },
    },
});
