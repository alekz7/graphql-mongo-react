import { createContext } from "react";
let user = {
  //(A)
  name: "Stranger",
  token: ""
};

const setUserInfo = obj => (user = { user, ...obj }); //(B)

const UserInfoContext = createContext(null); //(C)

// (D)
export { user, setUserInfo };
export default UserInfoContext;