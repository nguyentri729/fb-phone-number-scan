import UserManager from "../pages/userManager/UserManager";
import TokenManager from "../pages/tokenManger/TokenManger";
import LoginPage from "../pages/login/LoginPage"
import ConvertUidToPhone from "../pages/convertUidToPhone/ConvetUidToPhone"
import ConvertPhoneToUid from "../pages/convertPhoneToUid/ConvertPhoneToUid"
import ConvertUidFromEmail from "../pages/ConvertUidToEmail/ConvetUidToEmail"
import RegisterPage from '../pages/register/RegisterPage';
import AutoAddFriend from '../pages/autoAddFriend/AutoAddFriend';
import HistoryPage from "../pages/history/HistoryPage"
import AutoReaction  from "../pages/autoReaction/AutoReaction"
import ScanUidReaction from "../pages/scanUidReactions/ScanUidReactions"
import ScanUidComment from "../pages/scanUIDComments/ScanUIDComments" 
import ScanUidShare from "../pages/scanUidShares/ScanUidShares"
import ScanUidInfo from "../pages/scanUidInfo/ScanUidInfos"
const routers = [
  {
    path: "/user-manager",
    name: "User manager",
    strict: true,
    component: UserManager,
  },
  {
    path: "/token-manager",
    name: "Token manager",
    strict: true,
    isRequireAuth: true,
    component: TokenManager,
  },
  {
    path: "/login",
    name: "Đăng nhập",
    strict: true,
    component: LoginPage,
},
  {
    path: "/convert-uid-to-phone",
    name: "Convert UID To Phone",
    strict: true,
    isRequireAuth: true,
    component: ConvertUidToPhone,
  },
  {
    path: "/convert-phone-to-uid",
    name: "Convert Phone To Uid",
    strict: true,
    isRequireAuth: true,
    component: ConvertPhoneToUid,
  },
  {
    path: "/convert-uid-to-email",
    name: "Convert Uid To email",
    strict: true,
    isRequireAuth: true,
    component: ConvertUidFromEmail,
  },
  {
    path: "/register",
    name: "Đăng kí",
    strict: true,
    component: RegisterPage
  },
  {
    path: "/auto-add-friend",
    name: "Tự động thêm bạn",
    strict: true,
    component: AutoAddFriend
  },
  {
    path: "/history",
    name: "Lịch sử",
    isRequireAuth: true,
    component: HistoryPage
  },
  {
    path: "/auto-reactions",
    name: "Tự động thả tim",
    isRequireAuth: true,
    component: AutoReaction
  },
  {
    path: "/scan-uid-reactions",
    name: "Quét người reaction post",
    isRequireAuth: true,
    component: ScanUidReaction
  },
  {
    path: "/scan-uid-comments",
    name: "Quét người comments post",
    isRequireAuth: true,
    component: ScanUidComment
  },
  {
    path: "/scan-uid-shares",
    name: "Quét người shares post",
    isRequireAuth: true,
    component: ScanUidShare
  },
  {
    path: "/scan-uid-infos",
    name: "Quét infos",
    isRequireAuth: true,
    component: ScanUidInfo
  }
];

export default routers;
