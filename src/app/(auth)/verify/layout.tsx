import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Xác nhận email - Buddie',
  description: 'Xác nhận email của tài khoản Buddie',
};

export default function VerifyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
