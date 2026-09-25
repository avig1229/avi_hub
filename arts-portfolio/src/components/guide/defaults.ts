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
    home: `Oh! A visitor.\n\nWelcome to the crib. I'm Third Eye, I'll show you around.\n\nSee the little gold arrows? Click one and I'll walk you over. His work's in the arcade, his music's on the records.\n\nLost? Hit the ? button, or tap me.`,
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

// Built-in lines for regular project pages, by slug. `intro` plays when the
// page opens; `sections` play the first time each tab is opened, keyed by the
// section's title in Sanity. A project's own "Guide says" fields in Sanity
// replace these. CORE has its own set above.
export const PROJECT_GUIDE_DEFAULTS: Record<string, { intro?: string; sections?: Record<string, string> }> = {
    shrma: {
        intro: `shRma is Avi's middle name. Now it's his label.\n\nEach tab up there is a different piece of it. Open them and watch what he borrows from.`,
        sections: {
            'Hoodie Vision Board': `The yee-haw hoodie. His first sell-out.\n\nFollow it from the first board to the anniversary remake. Same bones, sharper cut.`,
            'Logo Design': `Old-school Stüssy energy.\n\nSymmetrical, a little classy, still street. It dresses up or down.`,
            "'THE' Baseball Jersey Shirt": `Baseball, cut for the runway.\n\nNot too long, not too baggy. The mood boards come first, then the real thing.`,
            "'Take me to Temple' Loafer designs": `Taiwanese Taoist temples, on a loafer.\n\nLook for the temple ornament he pulled into the shoe.`,
            'shRma Jewelry Line': `Small bling, big plans.\n\nThese are early contours. Squint a little and picture them on.`,
        },
    },
    branding: {
        intro: `Avi rebuilt his dad's travel agency in Nepal: the brand and the site.\n\nStart with the vision boards, then find the final logo. Watch the ideas get boiled down to one mark.`,
    },
    'hear-feel-create': {
        intro: `One drawing, one song.\n\nHe drew while the track played, so the lines move the way the music does. The captions name the songs. Put one on and look again.`,
    },
    'our-uneaten-taipei': {
        intro: `Six episodes, one city, lots of food.\n\nThis is where Avi first tried colour grading and VFX. Watch the warmth and texture change from episode to episode.`,
    },
    archive: {
        intro: `The vault. Sketches, side quests, half-ideas.\n\nYou'll find a few early versions of me in here too. I've had some looks.`,
    },
};
