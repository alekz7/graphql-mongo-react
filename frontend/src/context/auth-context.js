import React, {createContext, useState } from 'react';

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
  
  const [tokenData, setTokenData] = useState({
    token: null,
    userId: null,
  })
  const login = (token, userId, tokenExpiration) => {
    setTokenData({...tokenData, token, userId})
  }
  const[isLogin, setIsLogin] = useState(true);
 
  return (
    <AuthContext.Provider value={{ tokenData , setTokenData, isLogin, login:login}}>
      {props.children}
    </AuthContext.Provider>
  );
}
export default AuthContextProvider;