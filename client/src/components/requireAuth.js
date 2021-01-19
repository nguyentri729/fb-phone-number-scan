import React from "react";
import RequireLogin from "./RequireLogin"
export default function requireAuth(children, isRequireAuth) {
  if (isRequireAuth) {
    if (localStorage.getItem("access_token")) {
      return children;
    } else {
      return function App() {
        return <RequireLogin /> 
    };
    }
  }
  return children
}
