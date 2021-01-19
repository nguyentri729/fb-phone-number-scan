import { notification } from "antd";
import _ from "lodash";
const notifyError = (err) => {
  return notification.error({
    message: _.get(err, "response.data.msg", err.message),
  });
};

const sleep = (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}
export default {
  notifyError,
  sleep
};
