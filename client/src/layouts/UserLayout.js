import { Layout, Menu, Avatar } from "antd";
import { UserOutlined, StarFilled } from "@ant-design/icons";
import "../App.css";
import "../App.css";
import routers from "../constants/routers";
import { Switch, Route, Link, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import _ from "lodash";
import moment from "moment";
import userAction from "../redux/actions/user.action";
import menuItems from "../constants/menuItems";
import requireAuth from "../components/requireAuth";
import { useEffect } from "react";
import agent from "../utils/agent"
const { Header, Content, Sider, Footer } = Layout;
function UserLayout({ user, updateUserInfo }) {

  let { pathname } = useLocation();

  useEffect(() => {
    agent.get("/me").then((res) => {
      updateUserInfo(res.data)
    });
    
  }, [])
  const matchSubMenu = _.find(menuItems, (item) => {
    if (item.type === "sub-menu") {
      const mathMenu = _.find(item.subMenus, (subMenu) => {
        if (subMenu.path === pathname) return true;
        return false;
      });
      if (mathMenu) return true;
      return false;
    }
  });

  const renderMenuItem = (item) => {
    const userRoles = _.get(user, "roles", ["guest"]); //default roles "guest" if don't login
    if (
      _.get(item, "type") === "sub-menu" &&
      _.intersection(item.roles, userRoles).length > 0
    ) {
      return (
        <Menu.SubMenu key={item.key} icon={item.icon} title={item.name}>
          {_.map(item.subMenus, (menu) => {
            if (_.intersection(menu.roles, userRoles)) {
              return (
                <Menu.Item key={menu.path} icon={menu.icon} isSelected={true}>
                  <Link to={menu.path}>{menu.name}</Link>
                </Menu.Item>
              );
            }
          })}
        </Menu.SubMenu>
      );
    }

    if (_.intersection(item.roles, userRoles).length > 0) {
      return (
        <Menu.Item key={item.path} icon={item.icon} isSelected={true}>
          <Link to={item.path}>{item.name}</Link>
        </Menu.Item>
      );
    }
    return <></>;
  };

  return (
    <Layout>
      <Sider breakpoint="lg" collapsedWidth="0" theme="dark">
        <Header
          className="site-layout-sub-header-background"
          style={{ padding: 0, backgroundColor: "#367fa9" }}
        >
          <div className="logo">
            <h3
              style={{ fontWeight: "bold", color: "white", paddingLeft: "5%" }}
            >
              <svg
                style={{ fill: "white" }}
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                color="white"
                viewBox="0 0 24 24"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>{" "}
              HOTDATAFB.COM
            </h3>
          </div>
        </Header>

        <div
          style={{
            marginLeft: 10,
            display: "flex",
            flexDirection: "row",
            color: "white",
            padding: 10,
          }}
        >
          <Avatar size={"large"} icon={<UserOutlined />}/>
          <div className="user-info" style={{ marginLeft: 25 }}>
            <span>{_.get(user, "fullName", "Người dùng")}</span> <br />
            <small>
              HSD: <b>{moment(user.expiresDate).format("DD/MM/YYYY")}</b>
            </small>{" "}
            <br />
          </div>
        </div>
        <div className="user-point" style={{
          backgroundColor: "rgba(139,139,139,0.2)",
          color: "white",
          width: "100%",
          textAlign:"center",
          padding: "10px 0px",
          overflow:"hidden"
        }}>
          <b>Point: {_.get(user, "point", 0)} </b> <StarFilled />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[pathname]}
          defaultOpenKeys={[_.get(matchSubMenu, "key", "")]}
        >
          {menuItems.map((item, index) => renderMenuItem(item))}
        </Menu>
      </Sider>
      <Layout>
        <Header
          className="site-layout-sub-header-background"
          style={{ padding: 0, backgroundColor: "rgb(60, 141, 188)" }}
        ></Header>
        <Content style={{ margin: "24px 16px 0", minHeight: "750px" }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            <Switch>
              {routers.map((router) => {
                return (
                  <Route
                    path={router.path}
                    component={requireAuth(
                      router.component,
                      router.isRequireAuth
                    )}
                  />
                );
              })}
            </Switch>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          {/* Created by nguyentri729 */}
        </Footer>
      </Layout>
    </Layout>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateUserInfo: (info) => {
      dispatch(userAction.updateUserInfo(info));
    },
  };
};
const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserLayout);
