import { defineType, defineField } from 'sanity';

export const submission = defineType({
    name: 'submission',
    title: '📬 User Submissions',
    type: 'document',
    icon: () => '📬',
    fields: [
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            description: 'What type of submission this is',
            readOnly: true,
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
            description: 'The user\'s submitted response',
            readOnly: true,
        }),
        defineField({
            name: 'submittedAt',
            title: 'Submitted At',
            type: 'datetime',
            description: 'When this was submitted',
            readOnly: true,
        }),
    ],
    preview: {
        select: {
            title: 'category',
            subtitle: 'submittedAt',
            response: 'response',
        },
        prepare({ title, subtitle, response }) {
            const categoryLabels: Record<string, string> = {
                place: '🗺️ Place Suggestion',
                signature: '✍️ Signature',
                proposal: '💍 Proposal Response',
            };
            return {
                title: categoryLabels[title] || title || 'Unknown Submission',
                subtitle: `${response ? response.substring(0, 40) : ''} — ${subtitle ? new Date(subtitle).toLocaleDateString() : 'No date'}`,
            };
        },
    },
});
