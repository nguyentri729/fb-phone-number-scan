import { Upload, message, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import _ from "lodash";
import config from "../config";
function UploadFile({ data, onRes }) {
  const props = {
    name: "file",
    action: config.restAPIServer + "/convert/upload",
    headers: {
      authorization: "Bearer " + localStorage.getItem("access_token"),
    },
    onChange(info) {
      const file = _.get(info, "file");
      if (_.get(file, "status") === "done") {
        onRes(file.response);
      }
      
    },
    data,
  };
  return (
    <Upload {...props}>
      <Button icon={<UploadOutlined />}>Tải file...</Button>
    </Upload>
  );
}

export default UploadFile;
