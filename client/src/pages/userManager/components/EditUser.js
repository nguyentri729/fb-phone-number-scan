import React, { useEffect, useState } from "react";
import { SyncOutlined } from "@ant-design/icons";
import _ from "lodash";
import {
  Form,
  Input,
  Button,
  InputNumber,
  Switch,
  Checkbox,
  Modal,
  DatePicker,
} from "antd";

import moment from "moment";
import agent from "../../../utils/agent";
import helper from "../../../utils/helper";

function EditUser({ me, user, isShow, setShow, getUsers }) {
  const [isLoading, setAddLoading] = useState(false);

  function onFinishEditUser(values) {
    setAddLoading(true);
    agent
      .put("/user/" + user._id, values)
      .then((res) => {
        getUsers();
        setShow(false);
      })
      .catch((err) => helper.notifyError(err))
      .finally(() => {
        setAddLoading(false);
      });
  }
  const [form] = Form.useForm();

  const { username, status, fullName, limitPost, roles, expiresDate } = user;
  let intitalValues = [
    {
      name: ["username"],
      value: username,
    },
    {
      name: ["active"],
      value: status === "active" ? true : false,
    },
    {
      name: ["fullName"],
      value: fullName,
    },
    {
      name: ["limitPost"],
      value: limitPost,
    },
    {
      name: ["roles"],
      value: roles,
    },
    {
      name: ["expiresDate"],
      value: moment(expiresDate),
    },
  ];
  return (
    <Modal
      title="Chỉnh sửa người dùng"
      visible={isShow}
      confirmLoading={isLoading}
      onCancel={() => {
        form.resetFields()
        setShow(false)
      }}
      footer={[
        <Button key="back" onClick={() =>  {
          form.resetFields() 
          setShow(false)
        }
        }>
          Đóng
        </Button>,
        <Button
          form="formCreateUser"
          type="primary"
          htmlType="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <p>
              <SyncOutlined spin /> Vui lòng đợi...
            </p>
          ) : (
            "Cập nhật"
          )}
        </Button>,
      ]}
    >
      <Form
        layout="vertical"
        id="formCreateUser"
        form ={form}
        name="basic"
        fields={intitalValues}
        onFinish={onFinishEditUser}
      >
        <Form.Item
          name="username"
          label="Email đăng nhập"
          rules={[
            {
              type: "email",
              message: "Vui lòng điền email",
            },
            { required: true, message: "Ko được để trống trường này !" },
          ]}
          value={user.username}
        >
          <Input placeholde="Username" disabled={true} />
        </Form.Item>

        <Form.Item
          name="fullName"
          label="Tên đầy đủ"
          rules={[{ required: true, message: "Ko được để trống trường này !" },
       
          { min: 6, message: "Mật khẩu phải tối thiểu 6 ký tự" }
        ]}
        >
          <Input placeholde="Tên đầy đủ" />
        </Form.Item>



        <Form.Item
          name="password"
          label="Mật khẩu"
          
        >
          <Input.Password placeholder="Điền trống để ko đổi mật khẩu" />
        </Form.Item>


        <Form.Item
          name="limitPost"
          label="Giới hạn post"
          rules={[
            { required: true, message: "Ko được để trống trường này !" },
            () => ({
              validator(_, value) {
                if (!value || value < 5) {
                  return Promise.reject("Giới hạn post phải lớn hơn 5 bài. ");
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <InputNumber placeholde="Giới hạn post" />
        </Form.Item>

        <Form.Item
          name="roles"
          label="Quyền"
          rules={[{ required: true, message: "Ko được để trống trường này !" }]}
        >
          <Checkbox.Group>
            {_.get(me, "roles", []).includes("admin") ? (
              <>
                <Checkbox value="super-user">Super User</Checkbox>
                <Checkbox value="admin">Admin</Checkbox>
                <Checkbox value="user">Normal User</Checkbox>
              </>
            ) : (
              <Checkbox value="user" checked>Normal User</Checkbox>
            )}
          </Checkbox.Group>
        </Form.Item>

        <Form.Item name="active" label="Trạng thái">
          <Switch defaultChecked />
        </Form.Item>

        <Form.Item
          name="expiresDate"
          label="Ngày hết hạn"
          rules={[
            {
              required: true,
              message: "Thiếu ngày hết hạn",
            },
            () => ({
              validator(_, value) {
                if (moment(value).isAfter(moment())) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  "Ngày hết hạn phải lớn hơn thời gian hiện tại"
                );
              },
            }),
          ]}
        >
          <DatePicker format="DD/MM/YYYY" />
        </Form.Item>
      </Form>
    </Modal>
  );
}



export default EditUser
