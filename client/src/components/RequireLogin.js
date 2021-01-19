import { Alert } from 'antd';
import React from 'react';

function RequireLogin() {
    return (
        <Alert
      message="Yêu cầu đăng nhập"
      description="Bạn cần đăng nhập để sử dụng chức năng này. "
      type="warning"
      showIcon
      closable
    />
    );
}

export default RequireLogin;