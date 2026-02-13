import { defineType, defineField } from 'sanity';

export const audioTrack = defineType({
    name: 'audioTrack',
    title: '🎵 Audio Track',
    type: 'document',
    icon: () => '🎵',
    fields: [
        defineField({
            name: 'role',
            title: 'Track Role',
            type: 'string',
            description: 'What role does this track play?',
            options: {
                list: [
                    { title: '🎶 Background Music (loops across entire site)', value: 'background' },
                    { title: '🎬 Reel Music (plays only during Future Memories reel)', value: 'reel' },
                ],
                layout: 'radio',
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'title',
            title: 'Track Title',
            type: 'string',
            description: 'Display name (e.g., "Our Song")',
        }),
        defineField({
            name: 'file',
            title: 'Audio File (Upload)',
            type: 'file',
            options: {
                accept: 'audio/*',
            },
            description: 'Upload an MP3 or WAV file directly.',
        }),
        defineField({
            name: 'url',
            title: 'Audio URL (External)',
            type: 'url',
            description: 'OR paste a direct link to an externally hosted audio file.',
        }),
        defineField({
            name: 'volume',
            title: 'Volume',
            type: 'number',
            description: 'Playback volume (0.0 to 1.0). Background default: 0.3, Reel default: 0.8',
            validation: (Rule) => Rule.min(0).max(1),
            initialValue: 0.3,
        }),
    ],
    preview: {
        select: {
            title: 'title',
            role: 'role',
        },
        prepare({ title, role }) {
            return {
                title: title || 'Untitled Track',
                subtitle: role === 'background' ? '🎶 Background (looping)' : '🎬 Reel',
            };
        },
    },
});
