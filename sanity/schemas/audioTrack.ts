import { defineType, defineField } from 'sanity';

export const audioTrack = defineType({
    name: 'audioTrack',
    title: '🎵 Audio Track',
    type: 'document',
    icon: () => '🎵',
    fields: [
        defineField({
            name: 'section',
            title: 'Section',
            type: 'string',
            description: 'Which section of the website should this track play on?',
            options: {
                list: [
                    { title: 'Hero (Opening)', value: 'hero' },
                    { title: 'Milestones (Our Timeline)', value: 'milestones' },
                    { title: 'Why I Like You', value: 'whyILikeYou' },
                    { title: 'Future Memories (Photo Reel)', value: 'future' },
                    { title: 'Places I Wanna Go With You', value: 'places' },
                    { title: 'Terms & Conditions (The Proposal)', value: 'proposal' },
                ],
                layout: 'dropdown',
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'title',
            title: 'Track Title',
            type: 'string',
            description: 'Display name shown in the audio player (e.g., "The Beginning")',
        }),
        defineField({
            name: 'vibe',
            title: 'Vibe',
            type: 'string',
            description: 'Short mood descriptor (e.g., "Nostalgic", "Dreaming")',
        }),
        defineField({
            name: 'file',
            title: 'Audio File (Upload)',
            type: 'file',
            options: {
                accept: 'audio/*',
            },
            description: 'Upload an MP3 or WAV file directly to Sanity.',
        }),
        defineField({
            name: 'url',
            title: 'Audio URL (External)',
            type: 'url',
            description: 'OR paste a direct link to an externally hosted audio file.',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            section: 'section',
            vibe: 'vibe',
        },
        prepare({ title, section, vibe }) {
            const sectionLabels: Record<string, string> = {
                hero: '🎬 Hero',
                milestones: '📅 Milestones',
                whyILikeYou: '❤️ Why I Like You',
                future: '🌅 Future Memories',
                places: '🗺️ Places',
                proposal: '💍 Terms (Proposal)',
            };
            return {
                title: title || 'Untitled Track',
                subtitle: `${sectionLabels[section] || section} — ${vibe || 'No vibe set'}`,
            };
        },
    },
});
