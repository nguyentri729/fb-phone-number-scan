import React, { useState, useEffect } from "react";
import { PageHeader, Row, Col, Modal, Statistic, Card } from "antd";
import {
  PlusOutlined,
  SyncOutlined,
  SketchOutlined,
  AlertOutlined,
  CommentOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import moment from "moment";
import _ from "lodash";
import { Form, Input, Button, Tooltip, notification, Table, Tag } from "antd";
import agent from "../../utils/agent";
import helper from "../../utils/helper";

export default function PostManager() {
  const onFinishAddPost = (values) => {
    setAddLoading(true);
    const { tokens } = values;
    agent
      .post("/token/add", values)
      .then((res) => {
        notification.success({
          message: `Đã thêm thành công ${res.data.length} / ${
            tokens.split("\n").length
          }`,
        });
        getTokens();
      })
      .catch(helper.notifyError)
      .finally(() => {
        setAddLoading(false);
      });
  };

  const checkAccessToken = () => {
    setLoading(true);
    agent
      .get("/token/check")
      .then((res) => {
        notification.success({
          message: "Đã làm mới token thành công !",
        });
        getTokens();
      })
      .catch(helper.notifyError)
      .finally(() => {
        setLoading(false);
      });
  };

  const getTokens = () => {
    agent
      .get("/tokens")
      .then((res) => {
        setTokens(res.data);
      })
      .catch(helper.notifyError);
  };

  useEffect(() => {
    getTokens();
  }, []);
  const [isAddLoading, setAddLoading] = useState(false);
  const [isModalVisible, setModalVisable] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [tokens, setTokens] = useState([]);
  const groupTokenByStatus = _.groupBy(tokens, "status");

  const columns = [
    {
      title: "Thời gian tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
      render: (createdAt) => moment(createdAt).format("DD/MM/YYYY \n HH:mm "),
    },
    {
      title: "UID",
      dataIndex: "uid",
      sorter: (a, b) => a.uid.localeCompare(b.uid),
      key: "uid",
    },
    {
      title: "Tên",
      sorter: (a, b) => a.name.localeCompare(b.name),

      dataIndex: "name",
      key: "name",
    },
    {
      title: "Token",
      dataIndex: "accessToken",
      key: "accessToken",

      render: (token) => {
        return <Input.TextArea value={token} />;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status) => {
        return (
          <>
            {status === "live" ? (
              <Tag color="geekblue">Live</Tag>
            ) : (
              <Tag color="red">Die</Tag>
            )}
          </>
        );
      },
    },
  ];

  return (
    <>
      <PageHeader
        className="site-page-header"
        title="Quản lý token"
        subTitle={
          <Tooltip title="Thêm token mới">
            <Button
              type="primary"
              shape="circle"
              icon={<PlusOutlined />}
              onClick={() => setModalVisable(true)}
            />
          </Tooltip>
        }
      />
      <Row gutter={16}>
        <Col span={9}>
          <Card>
            <Statistic
              title="Tổng token"
              value={_.get(tokens, "length", 0)}
              valueStyle={{ color: "#3f8600" }}
              prefix={<SketchOutlined />}
            />
          </Card>
        </Col>
        <Col span={9}>
          <Card>
            <Statistic
              title="Token live"
              value={_.get(groupTokenByStatus, "live.length", 0)}
              valueStyle={{ color: "#26de81" }}
              prefix={<AlertOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Token die"
              value={_.get(groupTokenByStatus, "die.length", 0)}
              valueStyle={{ color: "#red" }}
              prefix={<CommentOutlined />}
            />
          </Card>
        </Col>
      </Row>
      <br />

      <Button
        type="primary"
        style={{ marginBottom: "20px", float: "right" }}
        icon={<RedoOutlined spin={isLoading} />}
        disabled={isLoading}
        onClick={checkAccessToken}
      >
        {" "}
        {isLoading ? "Đang làm mới..." : "Làm mới danh sách"}
      </Button>

      <br />
      <Table columns={columns} dataSource={tokens} />

      <Modal
        title="Thêm token mới"
        visible={isModalVisible}
        confirmLoading={isAddLoading}
        onCancel={() => setModalVisable(false)}
        footer={[
          <Button key="back" onClick={() => setModalVisable(false)}>
            Đóng
          </Button>,
          <Button
            form="formAddToken"
            type="primary"
            htmlType="submit"
            disabled={isAddLoading}
          >
            {isAddLoading ? (
              <p>
                <SyncOutlined spin /> Vui lòng đợi...
              </p>
            ) : (
              "Thêm"
            )}
          </Button>,
        ]}
      >
        <Form
          layout="vertical"
          id="formAddToken"
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinishAddPost}
        >
          <Form.Item
            label="Danh sách token"
            name="tokens"
            rules={[
              { required: true, message: "Vui lòng nhập list access_token" },
            ]}
          >
            <Input.TextArea
              placeholder="Mỗi token cách nhau bằng dấu xuống dòng"
              rows={6}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
