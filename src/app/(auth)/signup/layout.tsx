import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng ký - Buddie',
  description: 'Đăng ký tài khoản Buddie',
};

export default function SignupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
