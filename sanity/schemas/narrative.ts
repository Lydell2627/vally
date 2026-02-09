import { defineType, defineField } from 'sanity';

export const narrative = defineType({
    name: 'narrative',
    title: 'Narrative Section',
    type: 'document',
    fields: [
        defineField({
            name: 'texts',
            title: 'Narrative Texts',
            type: 'array',
            of: [{ type: 'text' }],
        }),
    ],
});
