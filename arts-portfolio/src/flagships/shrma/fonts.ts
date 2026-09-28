import { Cormorant_Garamond } from 'next/font/google';

// The lookbook's display serif; loaded only on the shRma page.
export const serif = Cormorant_Garamond({
    weight: ['400', '500', '600'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
    display: 'swap',
});
