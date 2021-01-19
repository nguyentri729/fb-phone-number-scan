import React, { useState, useEffect } from "react";
import { PageHeader, Modal, InputNumber } from "antd";
import { PlusOutlined, SyncOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import moment from "moment";
import _ from "lodash";

import {
  Form,
  Input,
  Button,
  Tooltip,
  notification,
  Switch,
  Table,
  Popconfirm,
  Tag,
  Checkbox,
  DatePicker
} from "antd";
import EditUser from "./components/EditUser"
import agent from "../../utils/agent";
import helper from "../../utils/helper";
import { connect } from "react-redux";

function PostManager({me}) {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [isModalVisible, setModalVisable] = useState(false);
  const [isAddLoading, setAddLoading] = useState(false);
  const [isShowEditUserModal, setShowEditUserModal] = useState(false)
  const [userEdit, setUserEdit] = useState({})
  const onDelete = (id) => {
    agent
      .delete(`/user/${id}`)
      .then(() => {
        notification.success({
          message: "Đã xóa !",
        });
        let updatedUsers = _.remove(users, (user) => !_.isEqual(user._id, id));
        setUsers(updatedUsers);
      })
      .catch((err) => helper.notifyError(err));
  };
  const getUsers = () => {
    agent
      .get("/user")
      .then((res) => {
        setUsers(res.data);
      })
      .catch(helper.notifyError);
  };
  const onFinishAddPost = (values) => {
    setAddLoading(true);
    agent
      .post("/user/create", values)
      .then(() => {
        notification.success({
          message: "Đã tạo người dùng",
        });
      })
      .catch(helper.notifyError)
      .finally(() => {
        form.resetFields();
        setAddLoading(false);
        setTimeout(() => setModalVisable(false), 500);
      });
  };

  useEffect(() => {
    getUsers();
  }, []);

  const columns = [
    {
      title: "Thời gian tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
      render: (createdAt) => moment(createdAt).format("DD/MM/YYYY \n HH:mm "),
    },
    {
      title: "Email",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Tên ",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Giới hạn post",
      dataIndex: "limitPost",
      key: "limitPost",
    },
    {
      title: "Roles",
      dataIndex: "roles",
      key: "roles",
      render: (roles) => {
        return (
          <>
            {_.map(roles.sort(), (role) => {
              let tagColor;
              switch (role) {
                case "admin":
                  tagColor = "gold";
                  break;
                case "user":
                  tagColor = "green";
                  break;
                default:
                  tagColor = "geekblue";
                  break;
              }
              return <Tag color={tagColor}>{role}</Tag>;
            })}
          </>
        );
      },
    },
    {
      title: "Thời gian hết hạn",
      dataIndex: "expiresDate",
      key: "expiresDate",
      sorter: (a, b) => moment(a.expiresDate).unix() - moment(b.expiresDate).unix(),
      render: (expiresDate) => moment(expiresDate).format("DD/MM/YYYY "),
    },
    
    {
      title: "Hành động",
      dataIndex: "_id",
      key: "_id",
      render: (_id, user) => {
        return (

          <>

            <Button
              type="primary"
              size="small"
              shape="round"
              icon={<EditOutlined />}
              onClick={() => {
                setShowEditUserModal(true)
                setUserEdit(user)
              }}
            >
              Sửa
            </Button>


          <Popconfirm
            title="Bạn có chắc chắn muốn xóa ？"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => onDelete(_id)}
          >
            <Button
              type="danger"
              size="small"
              shape="round"
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Popconfirm>


          </>
        );
      },
    },
  ];
  return (
    <>
      <PageHeader
        className="site-page-header"
        title="Quản lý người dùng"
        subTitle={
          <Tooltip title="Thêm người dùng">
            <Button
              type="primary"
              shape="circle"
              icon={<PlusOutlined />}
              onClick={() => setModalVisable(true)}
            />
          </Tooltip>
        }
      />
      <Table columns={columns} dataSource={users} />

      <EditUser
        isShow={isShowEditUserModal}
        user={userEdit}
        setShow={setShowEditUserModal}
        getUsers={getUsers}
        me={me}
      />
      <Modal
        title="Thêm người dùng"
        visible={isModalVisible}
        confirmLoading={isAddLoading}
        onCancel={() => setModalVisable(false)}
        footer={[
          <Button key="back" onClick={() => setModalVisable(false)}>
            Đóng
          </Button>,
          <Button
            form="formCreateUser"
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
          id="formCreateUser"
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinishAddPost}
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
          >
            <Input placeholde="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: "Ko được để trống trường này !" },
            ]}
          >
            <Input.Password placeholde="Mật khẩu" />
          </Form.Item>

          <Form.Item
            name="fullName"
            label="Tên đầy đủ"
            rules={[
              { required: true, message: "Ko được để trống trường này !" },
            ]}
          >
            <Input placeholde="Tên đầy đủ" />
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
            rules={[
              { required: true, message: "Ko được để trống trường này !" },
            ]}
          >
            <Checkbox.Group>
            {_.get(me, "roles", []).includes("admin") ? (
              <>
                <Checkbox value="super-user">Super User</Checkbox>
                <Checkbox value="admin">Admin</Checkbox>
                <Checkbox value="user" defaultChecked={true}>Normal User</Checkbox>
              </>
            ) : (
              <Checkbox value="user" checked>Normal User</Checkbox>
            )}
            </Checkbox.Group>
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
          <Form.Item name="active" label="Trạng thái">
            <Switch defaultChecked />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    me: state.user,
  };
};

export default connect(mapStateToProps)(PostManager);
