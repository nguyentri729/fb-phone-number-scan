import contants from "../consts/index";
const userReducers = (state = {}, action) => {
  switch (action.type) {
    case contants.UPDATE_USER_INFO:
      state = action.data;
      break;
    default:
      break;
  }
  return state;
};

export default userReducers