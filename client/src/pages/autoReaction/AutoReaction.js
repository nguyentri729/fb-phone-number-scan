import React, {useState, useEffect} from "react";
import { Card, Avatar, Button, Row, Col } from "antd";
import {
  EditOutlined,
  PauseOutlined,
  CopyOutlined,
  CaretRightOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import _ from "lodash";
import ModalAddReactor from "./components/ModalAddReactor"
import ModalEditReactor from "./components/ModalEditReactor"
import helper from "../../utils/helper";
import agent from "../../utils/agent"
const { Meta } = Card;




function AutoReaction(props) {
    const [isShowModal, setShowModal] = useState(false)
    const [isShowModalEdit, setShowModelEdit] = useState(false)
    const [reactorEdit, setReactorEdit] = useState()
    const [data, setData] = useState([]) 

    const CardItem = ({data}) => {
        return (<Col md={6} lg={6} xs={24} sm={24}>
              <Card
        style={{ width: 300 }}
        cover={
          <img
            alt="example"
            src={`http://graph.facebook.com/${_.get(data, "facebookID", "4")}/picture?type=square&width=300&height=180&access_token=${_.get(data, "accessToken")}`}
          />
        }
        actions={[
          <CopyOutlined key="setting" />,
          <EditOutlined key="edit" onClick={() => {
            setReactorEdit(data)
            setShowModelEdit(true)
          }}/>,
          <CaretRightOutlined key="ellipsis" />,
        ]}
      >
        <Meta
          avatar={
            <Avatar src={`http://graph.facebook.com/${_.get(data, "facebookID", "4")}/picture?type=square&access_token=${_.get(data, "accessToken")}`} />
          }
          title={_.get(data, "name", "Unkown")}
          description={_.get(data, "status.status", "")}
        />
      </Card>
        </Col>)
    }

    useEffect(() => { 
        agent.get("/auto-reaction").then(res => {
            setData(res.data)
        }).catch(err => helper.notifyError)
    }, [])
  return (
    <div>
      <Row>
       {_.map(data, item => {
           return (<CardItem data = {item}/> )
       })}
        <Col md={6} lg={6} xs={24} sm={24}>
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            style={{
              height: "325px",
              width: "100%",
              fontSize: "1.5em",
            }}
            onClick={() => setShowModal(true)}
          >
            Thêm
          </Button>
        </Col>
      </Row>

      <ModalAddReactor isShow={isShowModal} setShow={setShowModal} /> 
      <ModalEditReactor isShow={isShowModalEdit} setShow={setShowModelEdit} reactor={reactorEdit} /> 
    </div>
  );
}

export default AutoReaction;
