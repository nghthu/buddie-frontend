import { FrownOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';
import Link from 'next/link';

const AuthorizationError = () => {
  return (
    <Result
      icon={<FrownOutlined />}
      status="403"
      title="403"
      subTitle="Bạn không có quyền truy cập vào trang này."
      extra={
        <Link href="/">
          <Button type="primary">Quay về trang chủ</Button>
        </Link>
      }
    />
  );
};

export default AuthorizationError;
