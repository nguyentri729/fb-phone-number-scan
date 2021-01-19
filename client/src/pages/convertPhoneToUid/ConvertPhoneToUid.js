import {
  Alert,
  Divider,
  Typography,
  Row,
  Col,
  message,
  Button,
  Form,
  Input,
  Progress,
} from "antd";
import _ from "lodash";
import React, { useState } from "react";
import {
  ThunderboltOutlined,
  ArrowDownOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import agent from "../../utils/agent";
import UploadFile from "../../components/UploadFile";
import helper from "../../utils/helper";
import config from "../../config";
const AlertDescription = () => {
  return (
    <>
      <p>
      - Convert Phone là công cụ giúp chuyển đổi từ Số điện thoại sang uid Facebook.
      </p>
      <p>- Mỗi phone convert thành công sẽ bị trừ 1 Point.
</p>
      <p>- Có 2 cách sử dụng dưới đây:</p>
    </>
  );
};
const ScanUidPhone = () => {
  function handleUploadFileRes(data) {
    const fileUploadedId = _.get(data, "_id");
    if (fileUploadedId) {
      setFileUploadedId(fileUploadedId);
      setShowConvertFile(true);
    }
  }
  function setResult(res) {
    const textResult = _.reduce(
      _.get(res, "data.result", {}),
      (result, phone, uid) => {
        result += `${uid}\t${phone.replace("+84", "0")}\n`;
        return result;
      },
      ""
    );
    const { total, success, history} = res.data;
    setFieldResult({ total, success, history, textResult });
  }

  function handleConvertFileButton() {
    setLoadingConvertFile(true);
    agent
      .post("/convert/file-phones-to-uids", {
        fileId: fileUploadedId,
      })
      .then((res) => {
        setResult(res);
      })
      .finally(() => {
        setLoadingConvertFile(false);
      });
  }
  const [isLoadingConvertFile, setLoadingConvertFile] = useState(false);
  const [isShowConvertFile, setShowConvertFile] = useState(false);
  const [isShowResult, setShowResult] = useState(false);
  const [fileUploadedId, setFileUploadedId] = useState();
  const [isLoadingConvertFromText, setLoadingConvertFromText] = useState(false);
  const [fieldResult, setFieldResult] = useState();
  function onFinish(values) {
    const key = "updatable";

    const phones = values.uid.trim().split("\n");
    setLoadingConvertFromText(true);
    message.loading({ content: "Đang chuyển đổi...", key });

    agent
      .post("/convert/phones-to-uids", {
        phones
      })
      .then((res) => {
        setResult(res);
      })
      .catch(helper.notifyError)
      .finally(() => {
        setLoadingConvertFromText(false);
        message.success({ content: "Hoàn tất !", key, duration: 2 });
      });
  }
  return (
    <div>
      <Form
        layout="vertical"
        name="basic"
        fields={[
          {
            name: ["result"],
            value: _.get(fieldResult, "textResult", ""),
          },
        ]}
        onFinish={onFinish}
      >
        <Alert
          message="Hướng dẫn"
          description={<AlertDescription />}
          type="success"
          showIcon
          closable
        />
        <Divider />
        <Row>
          <Col md={12} lg={12} xs={24} sm={24}>
            <Typography.Title level={5}>
              1. Chọn file UID (.txt) - Mỗi uid một dòng (tối đa 200.000 UID)
            </Typography.Title>{" "}
            <br />
            <UploadFile
              data={{
                typeUpload: "convert-uid-to-phone",
              }}
              onRes={handleUploadFileRes}
            />
            <br />
            {isShowConvertFile ? (
              <Button
                type="primary"
                icon={<ThunderboltOutlined />}
                loading={isLoadingConvertFile}
                onClick={() => handleConvertFileButton()}
              >
                Convert
              </Button>
            ) : (
              <></>
            )}
          </Col>

          <Col md={12} lg={12} xs={24} sm={24}>
            <Typography.Title level={5}>
              2. Copy-Paste UID - Mỗi uid một dòng
            </Typography.Title>
            <br />

            <Row justify={"space-between"}>
              <Col span={24} md={24} lg={24} xs={24} sm={24}>
                <b>Danh sách UID</b>

                <Form.Item
                  name="uid"
                  rules={[{ required: true, message: "Vui lòng điền UID" }]}
                >
                  <Input.TextArea
                    rows={5}
                    placeholder="Mỗi UID một dòng"
                  ></Input.TextArea>
                </Form.Item>
              </Col>
            </Row>

            <Button
              type={"dashed"}
              size={"large"}
              htmlType="submit"
              loading={isLoadingConvertFromText}
              icon={<ThunderboltOutlined />}
              style={{
                float: "right",
                color: "white",
                backgroundColor: "orange",
              }}
            >
              Convert
            </Button>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={12} md={12} lg={24} xs={24} sm={24}>
            {_.get(fieldResult, "total") ? (
              <>
                <Row justify={"space-around"}>
                  <Progress
                    type="circle"
                    percent={100}
                    strokeColor={{
                      "0%": "#108ee9",
                      "100%": "#87d068",
                    }}
                    format={() => (
                      <span style={{ fontSize: "20px" }}>
                        {fieldResult.total} <br /> tổng số
                      </span>
                    )}
                  />

                  <Progress
                    type="circle"
                    strokeColor={{
                      "0%": "#11998e",
                      "100%": "#38ef7d",
                    }}
                    percent={(
                      (fieldResult.success / fieldResult.total) *
                      100
                    ).toFixed(2)}
                    format={() => (
                      <span style={{ fontSize: "20px", color: "green" }}>
                        {fieldResult.success} <br />
                        thành công
                      </span>
                    )}
                  />

                  <Progress
                    type="circle"
                    strokeColor={{
                      "0%": "#bc4e9c",
                      "100%": "#f80759",
                    }}
                    percent={(
                      ((fieldResult.total - fieldResult.success) /
                        fieldResult.total) *
                      100
                    ).toFixed(2)}
                    format={() => (
                      <span style={{ fontSize: "20px", color: "red" }}>
                        {fieldResult.total - fieldResult.success} <br /> lỗi
                      </span>
                    )}
                  />
                </Row>

                <Row style={{ marginTop: "15px" }} justify="center">
                  <Button
                    type={"default"}
                    style={{ marginRight: 5 }}
                    icon={<EyeOutlined />}
                    onClick={() => setShowResult(!isShowResult)}
                  >
                    Xem kết quả
                  </Button>
                  <Button type={"primary"} icon={<ArrowDownOutlined />}>
                    <a style={{color: "white"}} href={config.restAPIServer + "/history/" + fieldResult.history + "/download?type=output"} rel="noreferrer" target="_blank">Tải kết quả</a>
                  </Button>
                </Row>
              </>
            ) : (
              <></>
            )}
          </Col>
          {isShowResult ? (
            <Col span={12} md={12} lg={24} xs={24} sm={24}>
              <b>Kết quả</b>
              <Form.Item name="result">
                <Input.TextArea
                  rows={5}
                  placeholder="UID  Phone"
                ></Input.TextArea>
              </Form.Item>
            </Col>
          ) : (
            <></>
          )}
        </Row>
      </Form>
    </div>
  );
};

export default ScanUidPhone;
