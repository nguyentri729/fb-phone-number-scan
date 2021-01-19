import React, {useState} from "react";
import {
  CheckCircleFilled,
  LoadingOutlined,
} from "@ant-design/icons";
import {Form, Input} from "antd"
import axios from "axios";
import _ from "lodash";

function InputAccessToken({required = true}) {
    const [isCheckTokenLoading, setCheckTokenLoading] = useState(false);
    const [tokenInfos, setTokenInfos] = useState({});

  function onChangeToken(token) {
    if (token === "") return;
    setCheckTokenLoading(true);
    axios
      .get("https://graph.facebook.com/me", { params: { access_token: token } })
      .then((res) => {
        setTokenInfos({
          status: "success",
          data: res.data,
        });
      })
      .catch(() => {
        setTokenInfos({
          status: "fail",
        });
      })
      .finally(() => setCheckTokenLoading(false));
  }

  return (
    <div>
      <Form.Item
        label="Access Token"
        name="accessToken"
        style={{ marginBottom: 0 }}
        rules={[
          { required: required, message: "Vui lòng điền access token hợp lệ!" },
        ]}
      >
        <Input
          placeholder="Nhập access Token"
          type="text"
          onChange={(e) => onChangeToken(e.target.value)}
        />
      </Form.Item>
      <div
        style={{
          position: "relative",
          marginTop: "20px",
          marginBottom: "24px",
        }}
      >
        {!isCheckTokenLoading ? (
          <>
            {tokenInfos.status === "success" ? (
              <span style={{ color: "green", marginTop: "2px" }}>
                <CheckCircleFilled />
                {"  "}
                {_.get(tokenInfos, "data.name", "")}
              </span>
            ) : (
              <></>
            )}
            {tokenInfos.status === "fail" ? (
              <span
                style={{
                  color: "red",
                  marginTop: "2px",
                  fontStyle: "italic",
                }}
              >
                <CheckCircleFilled /> Không thể lấy thông tin token
              </span>
            ) : (
              <></>
            )}
          </>
        ) : (
          <span style={{ color: "green", marginTop: "2px" }}>
            {" "}
            <LoadingOutlined /> Đang tải...
          </span>
        )}

        <a
          href="#"
          style={{
            position: "absolute",
            color: "#213fef",
            right: 0,
            fontSize: "12px",
            fontStyle: "italic",
          }}
        >
          Hướng dẫn lấy access Token
        </a>
      </div>
    </div>
  );
}

export default InputAccessToken;
