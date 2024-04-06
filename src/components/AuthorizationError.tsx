import { FrownOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';

const AuthorizationError = () => {
  return (
    <Result
      icon={<FrownOutlined />}
      status="403"
      title="403"
      subTitle="Bạn không có quyền truy cập vào trang này."
      extra={
        <Button
          type="primary"
          href="/"
        >
          Quay về trang chủ
        </Button>
      }
    />
  );
};

export default AuthorizationError;
