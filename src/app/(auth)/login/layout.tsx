import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng nhập - Buddie',
  description: 'Đăng nhập vào Buddie',
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
