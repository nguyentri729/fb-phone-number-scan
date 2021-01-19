import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Card, notification } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';
import _ from 'lodash';

import agent from '../../utils/agent';

export default function RegisterPage() {
  let history = useHistory();

  const onFinish = (values) => {
    const { fullName, email, password, passwordAgain } = values;
    setLoading(true);

    if (password !== passwordAgain) {
      notification.error({
        message: 'Mật khẩu không chính xác'
      });
    } else {
      agent
        .post('/register', {
          email: email,
          password: password,
          fullName: fullName
        })
        .then((res) => {
          const { accessToken, refreshToken } = res.data;
          if (accessToken && refreshToken) {
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);
            notification.success({
              message: 'Đăng ký thành công'
            });
            history.push('/comment-manager');
          }
        })
        .catch((err) => {
          notification.error({
            message: 'Đăng ký thất bại',
            description: _.get(err, 'response.data.msg', err.message)
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const [isLoading, setLoading] = useState(false);

  return (
    <Card bordered={true}>
      <Form
        {...formItemLayout}
        layout="vertical"
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        size="large"
        scrollToFirstError
      >
        <Form.Item
          name="fullName"
          rules={[{ required: true, message: 'Vui lòng điền tên người dùng' }]}
          hasFeedback
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" style={{color: '#ccc'}} />}
            type="text"
            placeholder="Full Name"
          />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Vui lòng điền tên đăng nhập' },
            { type: 'email', message: 'The input is not valid E-mail!' }
          ]}
          hasFeedback
        >
          <Input
            prefix={<MailOutlined className="site-form-item-icon" style={{color: '#ccc'}} />}
            type="email"
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Vui lòng điền mật khẩu' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || value.length >= 6) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  'The Password must be at least 6 characters.'
                );
              }
            })
          ]}
          hasFeedback
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" style={{color: '#ccc'}} />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item
          name="passwordAgain"
          rules={[
            { required: true, message: 'Vui lòng điền mật khẩu' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  'The two passwords that you entered do not match!'
                );
              }
            })
          ]}
          hasFeedback
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" style={{color: '#ccc'}} />}
            type="password"
            placeholder="Password confirm"
          />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginRight: 10, width: '80%' }}
            loading={isLoading}
          >
            Tạo tài khoản
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

const formItemLayout = {
  wrapperCol: {
    xs: { span: 14 },
    sm: { span: 16 },
    offset: 4
  },
};

const tailLayout = {
  wrapperCol: { offset: 4 }
};
