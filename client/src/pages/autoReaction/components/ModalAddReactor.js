import React, { useEffect, useState } from "react";
import { SyncOutlined } from "@ant-design/icons";
import _ from "lodash";
import {
  Form,
  Button,
  Radio,
  Modal,
  message
} from "antd";
import agent from "../../../utils/agent"
import InputAccessToken from "../../../components/InputAccessToken";
import helper from "../../../utils/helper";

function ModalAdd({ isShow, setShow }) {
  const [isLoading, setAddLoading] = useState(false);
  const [form] = Form.useForm();
  const initialValues = {
    option: "all",
    typeReaction: "random"
  }
  function onFinishEditUser(values) {
    setAddLoading(true);
    agent.post("/auto-reaction/create", values).then(res => {
      setShow(false);
      message.success("Thêm thành công !")
    }).catch(err => helper.notifyError).finally(() => setAddLoading(false));
  }
  return (
    <Modal
      title="Cài đặt"
      visible={isShow}
      confirmLoading={isLoading}
      onCancel={() => {
        form.resetFields();
        setShow(false);
      }}
      width={900}
      footer={[
        <Button
          key="back"
          onClick={() => {
            form.resetFields();
            setShow(false);
          }}
        >
          Đóng
        </Button>,
        <Button
          form="formCreateAutoReactor"
          type="primary"
          htmlType="submit"
          loading={isLoading}
          disabled={isLoading}
        >
          Thêm
        </Button>,
      ]}
    >
      <Form
        layout="vertical"
        id="formCreateAutoReactor"
        form={form}
        name="basic"
        initialValue={initialValues}
        onFinish={onFinishEditUser}
      >
        <InputAccessToken />

        <Form.Item name="typeReaction" label="Cảm xúc"  rules={[
          { required: true, message: "Vui lòng điền access token hợp lệ!" },
        ]}>
        <Radio.Group >

          <Radio value="random">Ngẫu nhiên</Radio>
          <Radio value="like">👍 Like</Radio>
          <Radio value="love">❤️ Love</Radio>
          <Radio value="wow">😯 Wow</Radio>
          <Radio value="haha">😂 Haha</Radio>
          <Radio value="sad">😢 Sad </Radio>
          <Radio value="angry">😡 Angry</Radio>

        </Radio.Group>
      </Form.Item>

      <Form.Item name="option" label="Options"  rules={[
          { required: true, message: "Vui lòng điền access token hợp lệ!" },
        ]} 
        >
        <Radio.Group  >
          
          <Radio value="all">Tất cả bài viết trên newfeed</Radio> <br /> 
          <Radio value="only_friend">Chỉ bài viết bạn bè</Radio><br /> 
          <Radio value="only_page">Chỉ bài viết của Page</Radio><br /> 
         

        </Radio.Group>
      </Form.Item>


      </Form>
    </Modal>
  );
}

export default ModalAdd;
