// Built-in lines for the site guide (the third-eye mascot). Anything written
// in Sanity replaces these. DRAFTS in his voice; rewrite freely.
// A blank line splits a line into pages of dialogue.

export type SiteGuideLines = {
    name: string;
    home: string;
    about: string;
    typeNotes: string;
    idle: string;
};

export const SITE_GUIDE_DEFAULTS: SiteGuideLines = {
    name: 'Third Eye',
    home: `Oh! A visitor.\n\nI'm the third eye around here. I see the stories behind the pieces.\n\nScroll on. I'll pop up when there's something worth knowing.`,
    about: `This is Avi. Tech, design, fashion: I keep an eye on all three.`,
    typeNotes: `Psst. Type nerds, this part's for you.\n\nTry typing your name in the box below.`,
    idle: `Still here. Keep exploring and I'll chime in when there's a story.`,
};

// CORE's built-in lines, by spot. Series keys match their slugs.
export const CORE_GUIDE_DEFAULTS = {
    origin: `Welcome to CORE.\n\nEvery piece here grew from one spine: Avi's. Keep scrolling and watch it take shape.`,
    anatomy: `Tap the little + marks.\n\nThe nails? Those are real. Well, the ones they stand for are.`,
    series: {
        sashiko: `Sashiko is Japanese mending: stitch what's broken and it comes back stronger.\n\nHover a card. Tilt it, even.`,
        graffiti: `Graffiti. Loud, fast, one gesture each. No undo button.`,
        experimentals: `The Experimentals. Anything goes here, including the ones that argue with the rules.`,
    } as Record<string, string>,
};
