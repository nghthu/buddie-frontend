import type { Metadata } from 'next';
import '@/styles/globals.scss';
import { Provider } from 'react-redux';
import { store } from '@/store';

export const metadata: Metadata = {
  title: 'Buddy',
  description: 'Học tiếng Anh cùng AI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
