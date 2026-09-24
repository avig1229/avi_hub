import type { CSSProperties } from 'react';

// The logo's outline, used as a mask so whatever fills it (the text colour, or
// FabricLogo's cloth) takes the logo's shape.
export const LOGO_MASK: CSSProperties = {
    maskImage: 'url(/logo.svg)',
    WebkitMaskImage: 'url(/logo.svg)',
    maskSize: 'contain',
    WebkitMaskSize: 'contain',
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    maskPosition: 'left center',
    WebkitMaskPosition: 'left center',
};

// The logo is used as a mask so it inherits the surrounding text colour (light/dark themes, mix-blend nav).
export default function Logo({ className = '' }: { className?: string }) {
    return <span role="img" aria-label="shRma" className={`block bg-current aspect-[1164/400] ${className}`} style={LOGO_MASK} />;
}
