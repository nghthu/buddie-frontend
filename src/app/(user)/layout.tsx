import { redirect } from 'next/navigation';
import { auth } from '@/lib';

const UserLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  // const user = auth.currentUser;

  // if (!user) {
  //   redirect('/login');
  // }

  // if (user && !user.emailVerified) {
  //   return <div>email not verified</div>;
  // }

  return children;
};

export default UserLayout;
