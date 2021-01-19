import { Row, Col } from "antd";
import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Card, notification } from "antd";
import agent from "../../utils/agent";
import { useHistory } from "react-router";
import _ from "lodash";
export default function LoginPage() {
  let history = useHistory();
  const onFinish = (values) => {
    const { email, password } = values;
    setLoading(true);
    agent
      .post("/login", { email, password})
      .then((res) => {
        const { accessToken, refreshToken } = res.data;
        if (accessToken && refreshToken) {
          localStorage.setItem("access_token", accessToken);
          localStorage.setItem("refresh_token", refreshToken);
          notification.success({
            message: "Đăng nhập thành công",
          });
          history.push("/acccount-convert");
        }
      })
      .catch((err) => {
        notification.error({
          message: "Đăng nhập thất bại",
          description: _.get(err, "response.data.msg", err.message),
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const [isLoading, setLoading] = useState(false);

  return (
        <Card bordered={true}>
          <Form
            layout="vertical"
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              label="Email đăng nhập"
              name="email"
              rules={[
                { required: true, message: "Vui lòng điền email đăng nhập" },
              ]}
            >
              <Input type="email" />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Vui lòng điền mật khẩu" }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item {...tailLayout} name="remember" valuePropName="checked">
              <Checkbox>Nhớ đăng nhập</Checkbox>
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                Đăng nhập
              </Button>

              <Button type="dashed" style={{marginLeft: 10}} onClick={() => history.push('/register')}>
                Đăng ký
              </Button>
            </Form.Item>

          </Form>
        </Card>
  );
}

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
