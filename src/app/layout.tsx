import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ANDY LEE | Shinhwa',
  description: 'The elegant journey of Andy, the eternal maknae of Shinhwa. Artist, Producer, Visionary.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-brand-900 text-white selection:bg-accent-gold selection:text-brand-900">
        {children}
      </body>
    </html>
  );
}
