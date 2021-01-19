import constants from "../consts/index";
const updateUserInfo = (data) => {
  return {
    type: constants.UPDATE_USER_INFO,
    data,
  };
};

export default {
  updateUserInfo,
};
