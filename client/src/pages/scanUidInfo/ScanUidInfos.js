import React, { useState } from "react";
import { Form, Input, Button, Card, Checkbox, message, Progress } from "antd";

import { ScanOutlined } from "@ant-design/icons";

import InputAccessToken from "../../components/InputAccessToken";
import ScanUidTable from "./components/ScanUidTable";
import config from "../../config";
import _ from "lodash";
import helper from "../../utils/helper";
import agent from "../../utils/agent"
export default function ScanUidInfo() {
  const [percent, setPercent] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [result, setResult] = useState([]);

  async function scanInfos({ accessToken, isUseSystemToken, txtUid }) {
    setLoading(true);
    setPercent(0);
    setResult([]);
    let userInfos = [];
    let scanedCount = 0;
    const uids = txtUid.trim().split("\n");
    for (const uid of uids) {
      scanedCount++;
      let apiScan = _.get(isUseSystemToken, "0", false)
        ? config.restAPIServer + `/useSystemToken/v2.6/${uid}?fields=gender,name`
        : `https://graph.facebook.com/v2.6/${uid}?access_token=${accessToken}&fields=gender,name`;
      await agent
        .get(apiScan)
        .then((res) => {
          const { id, gender, name } = res.data;

          const userInfo = {
            id,
            gender,
            name,
          };

          userInfos.push(userInfo);

          return userInfo;
        })
        .catch((err) => {
            message.error(err.message)
        });
      setPercent(Math.round((scanedCount / uids.length) * 100));

      await helper.sleep(500);
    }
    setResult(userInfos);

    setTimeout(() => setLoading(false), 600);
    message.success("Hoàn tất");
  }
  function onFinish(values) {
    scanInfos(values);
  }

  return (
    <Card bordered={true}>
      {/* <Alert
        message="Hướng dẫn"
        description={
          "Người dùng thông thường chỉ được quét tối đa 500 UID, vui lòng nâng cấp VIP để quét thêm. "
        }
        type="warning"
        showIcon
        closable
      /> */}

      <Form layout="vertical" name="basic" onFinish={onFinish} size="large">
        <InputAccessToken required={false} />

        <Form.Item
          name="isUseSystemToken"
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value && !getFieldValue("accessToken")) {
                  return Promise.reject("Thiếu access_token ");
                }

                return Promise.resolve();
              },
            }),
          ]}
        >
          <Checkbox.Group>
            <Checkbox value="true">Sử dụng token hệ thống</Checkbox>
          </Checkbox.Group>
        </Form.Item>

        <Form.Item
          name="txtUid"
          label="UID"
          required
          tooltip="List UID cần lấy info. Mỗi ID cách nhau 1 dòng"
          rules={[{ required: true, message: "Ko được để trống trường này !" }]}
        >
          <Input.TextArea rows={5} placeholder="Mỗi UID cách nhau 1 dòng" />
        </Form.Item>

        {isLoading ? (
          <Progress
            percent={percent}
            strokeColor={{
              from: "#108ee9",
              to: "#87d068",
            }}
            status="active"
            style={{
              marginBottom: "10px",
            }}
          />
        ) : (
          <></>
        )}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            icon={<ScanOutlined />}
          >
            Quét
          </Button>
        </Form.Item>
      </Form>

      <ScanUidTable data={result} isLoading={isLoading} />
    </Card>
  );
}
