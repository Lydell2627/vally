

export const HERO_TEXT = {
  top: "JUST ONE",
  bottom: "CHANCE",
  subtitle: "MY SIDE OF THE STORY ©"
};

export const NARRATIVE = [
  "I know you aren't looking for anything right now.",
  "I know the timing might feel wrong.",
  "But I also know that some connections are rare.",
  "We've had moments that felt like more than just 'hanging out'.",
  "So I wrote this not to pressure you, but to tell you my truth.",
  "I don't want a label. I just want a chance to show you what could be."
];

export interface Milestone {
  id: number;
  title: string;
  category: string;
  year: string;
  description: string;
  image: string;
}

export const MILESTONES: Milestone[] = [
  {
    id: 1,
    title: "THE FIRST HANGOUT",
    category: "Where it started",
    year: "Day 01",
    description: "I remember exactly what you were wearing. I remember thinking, 'Okay, I'm in trouble.' It was just supposed to be casual, but my brain didn't get the memo.",
    image: "https://picsum.photos/800/1000?random=1"
  },
  {
    id: 2,
    title: "THAT ONE TIME",
    category: "The Shift",
    year: "The Middle",
    description: "We were just talking, but I saw a side of you that you don't show everyone. That's the version of you I want to know better.",
    image: "https://picsum.photos/800/1000?random=2"
  },
  {
    id: 3,
    title: "CAPTURED MOMENTS",
    category: "Through my lens",
    year: "Lately",
    description: "I have these photos of you. Not because I'm obsessed (okay, maybe a little), but because you look happiest when you aren't trying. That's the version of you I want to know better.",
    image: "https://picsum.photos/800/1000?random=3"
  }
];

export const WHY_I_LIKE_YOU = [
  {
    id: 1,
    title: "The Way You Listen",
    description: "You don't just wait for your turn to speak. You actually hear me. In a world full of noise, your attention feels like a quiet sanctuary."
  },
  {
    id: 2,
    title: "Your Unapologetic Joy",
    description: "When you get excited about something, you don't hold back. Seeing your eyes light up is honestly the highlight of my week."
  },
  {
    id: 3,
    title: "How You Handle Chaos",
    description: "Life gets messy, but you have this way of staying grounded. You're the calm in the storm, and I admire that so much."
  },
  {
    id: 4,
    title: "Your Weird Side",
    description: "Yeah, I said it. You're a little weird, just like me. And that's exactly why I feel so comfortable around you."
  }
];

export const FUTURE_MEMORIES = [
  {
    id: 1,
    title: "The 'Golden Hour' Shot",
    description: "Me taking a candid of you laughing at a terrible joke I made, with the sunset hitting your face perfectly. No filters needed."
  },
  {
    id: 2,
    title: "The Coffee Date",
    description: "A Sunday morning where we argue about which coffee shop is better. You win, obviously."
  },
  {
    id: 3,
    title: "The Blurry Night Out",
    description: "A low-quality photo of high-quality fun. Just us, somewhere in the city, realizing we don't want the night to end."
  },
  {
    id: 4,
    title: "The 'I Told You So' Look",
    description: "The face you make when you beat me at bowling/mini-golf/mariokart. I want to frame that victory."
  }
];

export const PLACES = [
  {
    id: 1,
    name: "The Late Night Diner",
    subtitle: "2:00 AM",
    description: "Pancakes, bad coffee, and conversations about the universe. The best dates happen when the world is asleep.",
    image: "https://images.unsplash.com/photo-1550966871-3ed3c6227685?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "The Art Museum",
    subtitle: "Culture Trip",
    description: "We walk around pretending to understand abstract art while secretly judging it. Then we find the one painting we actually like.",
    image: "https://images.unsplash.com/photo-1518998053901-5348d3969105?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "A Rooftop Somewhere",
    subtitle: "City Lights",
    description: "Just us, the skyline, and comfortable silence. Maybe a drink, maybe just the view. No agenda.",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "The Sunset Drive",
    subtitle: "Windows Down",
    description: "No destination. Just a good playlist (I'll let you DJ) and the open road until the stars come out.",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "The Live Gig",
    subtitle: "Loud & Close",
    description: "Sticky floors, cheap drinks, and music so loud we have to lean in close to talk.",
    image: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=800&auto=format&fit=crop"
  }
];

export const TERMS_AND_CONDITIONS = [
  {
    title: "Clause 1: The 'No Pressure' Policy",
    content: "This date comes with zero expectations. If you don't feel a spark, we go back to being friends. No awkwardness, no drama."
  },
  {
    title: "Clause 2: Food & Drinks",
    content: "All expenses for food, drinks, and snacks will be covered by the 'Proposer' (Me). You just have to bring your appetite."
  },
  {
    title: "Clause 3: The Exit Strategy",
    content: "If at any point you are bored, you can use the code word 'Pineapple'. We will immediately leave and get ice cream instead."
  },
  {
    title: "Clause 4: Bad Jokes",
    content: "You agree to laugh at 30% of my bad jokes out of pity. The other 70% you are free to roll your eyes at."
  },
  {
    title: "Clause 5: Hoodie Theft Protocol",
    content: "If you get cold, my hoodie is legally yours for the duration of the evening. Long-term custody is subject to negotiation."
  },
  {
    title: "Clause 6: Spider Defense Pact",
    content: "I agree to be the designated spider remover. In return, you agree to handle any moths, because those things are unpredictable."
  },
  {
    title: "Clause 7: The Fry Tax",
    content: "I will order my own fries, but I acknowledge that 20% of them will inevitably end up on your plate. This is a non-negotiable tax."
  },
  {
    title: "Clause 8: Aux Cord Veto",
    content: "You have full DJ privileges. However, I reserve the right to veto any track that sounds like a lawnmower or a sad whale."
  }
];

export const AUDIO_TRACKS = {
  HERO: {
    id: 'hero',
    url: 'https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3', // Lofi / Chill
    title: 'The Beginning',
    vibe: 'Just a thought'
  },
  MILESTONES: {
    id: 'milestones',
    url: 'https://assets.mixkit.co/music/preview/mixkit-driving-ambition-32.mp3', // Sentimental Piano
    title: 'Our History',
    vibe: 'Nostalgic'
  },
  WHY_I_LIKE_YOU: {
    id: 'why-i-like-you',
    url: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3', // Soft/Sweet
    title: 'Just You',
    vibe: 'Appreciation'
  },
  FUTURE: {
    id: 'future',
    url: 'https://assets.mixkit.co/music/preview/mixkit-valley-sunset-127.mp3', // Dreamy Synth
    title: 'What Could Be',
    vibe: 'Dreaming'
  },
  PLACES: {
    id: 'places',
    url: 'https://assets.mixkit.co/music/preview/mixkit-going-higher-53.mp3', // Upbeat / Travel
    title: 'The Journey',
    vibe: 'Adventure'
  },
  PROPOSAL: {
    id: 'proposal',
    url: 'https://assets.mixkit.co/music/preview/mixkit-hazy-after-hours-132.mp3', // Cinematic Swell
    title: 'The Question',
    vibe: 'Just for you'
  }
};

export const UI_SFX = {
  HOVER: 'https://assets.mixkit.co/sfx/preview/mixkit-modern-click-box-check-1120.mp3', // Very short tick/pop
  CLICK: 'https://assets.mixkit.co/sfx/preview/mixkit-software-interface-back-2575.mp3', // Soft wooden/glass click
  CARD_SLIDE: 'https://assets.mixkit.co/sfx/preview/mixkit-paper-slide-1530.mp3', // Paper slide
  SIGNATURE: 'https://assets.mixkit.co/sfx/preview/mixkit-pencil-writing-on-paper-1988.mp3', // Scribble
  SUCCESS: 'https://assets.mixkit.co/sfx/preview/mixkit-magic-sweep-game-trophy-257.mp3', // Chime
  MODAL: 'https://assets.mixkit.co/sfx/preview/mixkit-air-woosh-1489.mp3' // Soft air whoosh
};
