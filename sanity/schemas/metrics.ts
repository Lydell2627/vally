import { defineType, defineField } from 'sanity';

export const metrics = defineType({
    name: 'metrics',
    title: '📊 Metrics Dashboard',
    type: 'document',
    icon: () => '📊',
    fields: [
        defineField({
            name: 'noCount',
            title: '"No" Button Click Count',
            type: 'number',
            description: 'How many times the "No" button was clicked on the proposal',
            initialValue: 0,
            validation: (Rule) => Rule.min(0),
        }),
        defineField({
            name: 'lastNoClickAt',
            title: 'Last "No" Click',
            type: 'datetime',
            description: 'When the "No" button was last clicked',
            readOnly: true,
        }),
        defineField({
            name: 'hasSigned',
            title: 'T&C Signed?',
            type: 'boolean',
            description: 'Whether she signed the Terms & Conditions',
            initialValue: false,
            readOnly: true,
        }),
        defineField({
            name: 'signatureName',
            title: 'Signature Name',
            type: 'string',
            description: 'The name she signed with',
            readOnly: true,
        }),
        defineField({
            name: 'signedAt',
            title: 'Signed At',
            type: 'datetime',
            description: 'When the T&C was signed',
            readOnly: true,
        }),
        defineField({
            name: 'hasSaidYes',
            title: 'Said Yes? 💍',
            type: 'boolean',
            description: 'Whether she clicked "Yes" on the proposal!',
            initialValue: false,
            readOnly: true,
        }),
        defineField({
            name: 'yesClickedAt',
            title: 'Yes Clicked At',
            type: 'datetime',
            description: 'The exact moment she said yes',
            readOnly: true,
        }),
        defineField({
            name: 'totalNoBeforeYes',
            title: '"No" Count Before She Said Yes',
            type: 'number',
            description: 'How many times she clicked "No" before finally clicking "Yes"',
            readOnly: true,
        }),
        defineField({
            name: 'reactionImages',
            title: 'No-Click Reactions (Stickers)',
            type: 'array',
            description: 'Images that pop up when she clicks No (e.g. Crying cat, Sad hamster)',
            of: [{ type: 'image' }]
        }),
        defineField({
            name: 'reactionSounds',
            title: 'No-Click Sounds',
            type: 'array',
            description: 'Sound effects to play when No is clicked',
            of: [{ type: 'file', options: { accept: 'audio/*' } }]
        }),
    ],
    preview: {
        select: {
            noCount: 'noCount',
            hasSaidYes: 'hasSaidYes',
            hasSigned: 'hasSigned',
        },
        prepare({ noCount, hasSaidYes, hasSigned }: any) {
            const parts = [];
            if (hasSaidYes) parts.push('✅ Said YES!');
            else parts.push(`❌ No clicks: ${noCount || 0}`);
            if (hasSigned) parts.push('✍️ Signed');
            return {
                title: '📊 Metrics Dashboard',
                subtitle: parts.join(' | '),
            };
        },
    },
});
