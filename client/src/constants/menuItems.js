import {
  UserAddOutlined,
  HistoryOutlined,
  KeyOutlined,
  ThunderboltOutlined,
  PhoneOutlined,
  HeartOutlined,
  SecurityScanOutlined,
  CommentOutlined,
  ShareAltOutlined,
  InfoCircleOutlined,
  RobotOutlined,
  UserOutlined,
  MailOutlined
} from "@ant-design/icons";

const menus = [
  {
    path: "/convert-uid-to-phone",
    type: "menu-item",
    name: "Convert UID - Phone",
    icon: <PhoneOutlined />,
    roles: ["guest", "admin", "user"],
  },
  {
    path: "/convert-phone-to-uid",
    type: "menu-item",
    name: "Convert Phone - UID",
    icon: <UserOutlined />,
    roles: ["guest", "admin", "user"],
  },
  {
    path: "/convert-uid-to-email",
    type: "menu-item",
    name: "Convert UID - Email",
    icon: <MailOutlined />,
    roles: ["guest", "admin", "user"],
  },
  {
    type: "sub-menu",
    key: "histories",
    name: "Lịch sử",
    icon: <HistoryOutlined />,
    roles: ["user", "super-user", "admin"],
    subMenus: [
      {
        path: "/history",
        name: "Convert",
        icon: <ThunderboltOutlined />,
        roles: ["user", "super-user", "admin"],
      },
    ],
  },

  {
    type: "sub-menu",
    key: "auto-tools",
    name: "Auto",
    icon: <RobotOutlined />,
    roles: ["user", "super-user", "admin"],
    subMenus: [
      {
        path: "/auto-add-friend",
        name: "Kết bạn",
        icon: <UserAddOutlined />,
        roles: ["user", "super-user", "admin"],
      },
      {
        path: "/auto-reactions",
        name: "Cảm xúc",
        icon: <HeartOutlined />,
        roles: ["user", "super-user", "admin"],
      },
    ],
  },


  {
    type: "sub-menu",
    key: "scan-tools",
    name: "Quét UID",
    icon: <SecurityScanOutlined />,
    roles: ["user", "super-user", "admin"],
    subMenus: [
      {
        path: "/scan-uid-reactions",
        name: "Quét reaction",
        icon: <HeartOutlined />,
        roles: ["user", "super-user", "admin"],
      },
      {
        path: "/scan-uid-comments",
        name: "Quét comment",
        icon: <CommentOutlined />,
        roles: ["user", "super-user", "admin"],
      },
      {
        path: "/scan-uid-shares",
        name: "Quét shares",
        icon: <ShareAltOutlined />,
        roles: ["user", "super-user", "admin"],
      },
      {
        path: "/scan-uid-infos",
        name: "Quét info",
        icon: <InfoCircleOutlined />,
        roles: ["user", "super-user", "admin"],
      },
    ],
  },



  {
    path: "/user-manager",
    type: "menu-item",
    name: "Quản lý người dùng",
    icon: <UserAddOutlined />,
    roles: ["admin", "super-user"],
  },

  {
    path: "/token-manager",
    type: "menu-item",
    name: "Quản lý token",
    icon: <KeyOutlined />,
    roles: ["admin"],
  },

  {
    path: "/login",
    type: "menu-item",
    name: "Đăng nhập",
    icon: <UserAddOutlined />,
    roles: ["guest"],
  },
];

export default menus;
