import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Checkbox,
  Radio,
  Alert,
  message,
  Progress,
} from "antd";
import InputAccessToken from "../../components/InputAccessToken";
import InputPostID from "../../components/InputPostId";
import agent from "../../utils/agent"
import config from "../../config";
import _ from "lodash";
import helper from "../../utils/helper";
export default function ScanUidComments() {
  const [percent, setPercent] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [result, setResult] = useState([]);
  
  async function scanComments({
    accessToken,
    isUseSystemToken,
    postId,
    gender,
    limit,
  }) {
    setLoading(true);
    setPercent(0);
    setResult([]);
    let apiScan = _.get(isUseSystemToken, "0", false)
      ? config.restAPIServer +
        `/useSystemToken/v2.6/${postId}/comments?limit=500&fields=from{gender}`
      : `https://graph.facebook.com/v2.6/${postId}/comments?access_token=${accessToken}&limit=500&fields=from{gender}`;
    let response = [];
    let scanedUID = [];
    do {
      response = await agent
        .get(apiScan)
        .then((res) => res.data)
        .catch(helper.notifyError);
      if (_.get(response, "data")) {
        let filteredUID = _.reduce(
          response.data,
          (result, comment) => {
            if (gender === "all" || _.get(comment, "from.gender") === gender) {
              result.push(_.get(comment, "from.id"));
            }
            return result;
          },
          []
        );
        scanedUID = [...scanedUID, ...filteredUID];
        setPercent(Math.round((scanedUID.length / limit) * 100));
        if (scanedUID.length > limit) {
          break;
        }
        apiScan = _.get(response, "paging.next");
        await helper.sleep(1500);
      }
    } while (_.get(response, "paging.next"));
    setTimeout(() => setLoading(false), 600);
    setResult(_.slice(scanedUID, 0, limit - 1));
    message.success("Hoàn tất");
  }

  function onFinish(values) {
    scanComments(values);
  }

  return (
    <Card bordered={true}>
      <Alert
        message="Hướng dẫn"
        description={
          "Người dùng thông thường chỉ được quét tối đa 500 UID, vui lòng nâng cấp VIP để quét thêm. "
        }
        type="warning"
        showIcon
        closable
      />

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

        <InputPostID />
        <Form.Item
          name="gender"
          label="Giới tính"
          rules={[{ required: true, message: "Ko được để trống trường này !" }]}
        >
          <Radio.Group>
            <Radio value="all">Tất cả</Radio>
            <Radio value="male">Nam</Radio>
            <Radio value="female">Nữ</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="limit"
          label="Limit"
          required
          tooltip="Giới hạn"
          rules={[{ required: true, message: "Ko được để trống trường này !" }]}
        >
          <Input type="number" suffix="UID" />
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
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
      <label> Kết quả</label>
      <Input.TextArea
        rows={5}
        value={result.join("\n")}
        placeholder="Kết quả sẽ hiển thị ở đây. "
      />
    </Card>
  );
}
