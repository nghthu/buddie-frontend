import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Xác minh email - Buddie',
  description: 'Xác minh email tài khoản Buddie',
};

export default function VerifyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
