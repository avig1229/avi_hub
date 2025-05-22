# Design Portfolio Website

A modern, responsive portfolio website built with Next.js, TypeScript, and Tailwind CSS. This website showcases design work and serves as a platform for potential employers to learn about your skills and experience.

## Features

- Clean, minimalistic design
- Responsive layout for all devices
- Smooth animations and transitions
- Project showcase with detailed case studies
- Contact form for potential opportunities
- Resume page with downloadable PDF
- Modern UI components and interactions

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework for production
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Heroicons](https://heroicons.com/) - Beautiful hand-crafted SVG icons

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── page.tsx        # Home page
│   ├── projects/       # Projects page
│   ├── resume/         # Resume page
│   └── contact/        # Contact page
├── components/         # Reusable components
├── styles/            # Global styles
└── public/            # Static assets
```

## Customization

1. Update personal information:
   - Edit the content in each page component
   - Replace placeholder text with your own
   - Add your own projects and case studies

2. Styling:
   - Modify colors in `tailwind.config.js`
   - Update global styles in `globals.css`
   - Customize component styles in their respective files

3. Assets:
   - Add your own images to the `public` directory
   - Update image paths in components
   - Add your resume PDF to the `public` directory

## Deployment

The site can be deployed to any platform that supports Next.js applications. Some popular options include:

- [Vercel](https://vercel.com/) (recommended)
- [Netlify](https://www.netlify.com/)
- [AWS Amplify](https://aws.amazon.com/amplify/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
