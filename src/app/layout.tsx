import type { Metadata } from 'next';
import '@/styles/globals.scss';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Buddie',
  description: 'Học tiếng Anh cùng AI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header activatedTab="home" />
        {children}
      </body>
    </html>
  );
}
