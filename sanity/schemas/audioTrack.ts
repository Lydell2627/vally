import { defineType, defineField } from 'sanity';

export const audioTrack = defineType({
    name: 'audioTrack',
    title: 'Audio Track',
    type: 'document',
    fields: [
        defineField({
            name: 'trackId',
            title: 'Track ID',
            type: 'string',
            description: 'Unique identifier for the track (e.g., "romantic", "playful")',
        }),
        defineField({
            name: 'title',
            title: 'Track Title',
            type: 'string',
        }),
        defineField({
            name: 'vibe',
            title: 'Vibe Description',
            type: 'string',
        }),
        defineField({
            name: 'file',
            title: 'Audio File',
            type: 'file',
            options: {
                accept: 'audio/*',
            },
        }),
        defineField({
            name: 'url',
            title: 'External URL (alternative)',
            type: 'url',
            description: 'Use this if hosting audio externally instead of uploading',
        }),
    ],
});
