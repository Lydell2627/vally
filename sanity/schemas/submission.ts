import { defineType, defineField } from 'sanity';

export const submission = defineType({
    name: 'submission',
    title: 'User Submission',
    type: 'document',
    fields: [
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    { title: 'Place Suggestion', value: 'place' },
                    { title: 'Signature', value: 'signature' },
                    { title: 'Proposal Response', value: 'proposal' },
                ],
            },
        }),
        defineField({
            name: 'response',
            title: 'Response',
            type: 'string',
        }),
        defineField({
            name: 'submittedAt',
            title: 'Submitted At',
            type: 'datetime',
        }),
    ],
    preview: {
        select: {
            title: 'category',
            subtitle: 'submittedAt',
        },
    },
});
