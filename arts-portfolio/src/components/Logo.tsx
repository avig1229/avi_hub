// The logo is used as a mask so it inherits the surrounding text colour (light/dark themes, mix-blend nav).
export default function Logo({ className = '' }: { className?: string }) {
    return (
        <span
            role="img"
            aria-label="shRma"
            className={`block bg-current aspect-[1164/400] ${className}`}
            style={{
                maskImage: 'url(/logo.svg)',
                WebkitMaskImage: 'url(/logo.svg)',
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'left center',
                WebkitMaskPosition: 'left center',
            }}
        />
    );
}
