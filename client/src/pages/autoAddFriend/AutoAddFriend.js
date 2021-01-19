import React, { useState } from "react";
import { Form, Input, Button, Card } from "antd";
import InputAccessToken from "../../components/InputAccessToken"
export default function AutoAddFriend() {
  const [second, setSecond] = useState(30);

  const onChange = ({ target: { value } }) => {
    setSecond(value);
  };
  const onFinish = (values) => {
    const { token, listUID } = values;
    console.log(token, listUID.split("\n"), parseInt(second));
  };

  return (
    <Card bordered={true}>
      <Form layout="vertical" name="basic" onFinish={onFinish} size="large">
      <InputAccessToken /> 
        <Form.Item
          label="Danh sách UID"
          name="listUID"
          rules={[{ required: true, message: "Ko được để trống trường này !" }]}
        >
          <Input.TextArea
            placeholder="Nhập danh sách UID, Mỗi UID 1 dòng."
            style={{ height: "300px" }}
          ></Input.TextArea>
        </Form.Item>

        
        <Form.Item
          label="Thởi gian chờ"
          required
          tooltip="Thời gian chờ giữa các lần kết bạn để tránh bị block"
          rules={[{ required: true, message: "Ko được để trống trường này !" }]}
        >
          <Input
            type="number"
            suffix="Giây"
            value={second}
            onChange={onChange}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
