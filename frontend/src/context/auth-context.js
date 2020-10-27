import React, {createContext, useState } from 'react';

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
  
  const [tokenData, setTokenData] = useState({
    token: null,
    userId: null,    
  })
  const [isLoading, setIsLoading] = useState(false);

  const login = (token, userId, tokenExpiration) => {
    setTokenData({...tokenData, token, userId})
  }
  const logout = () => {
    setTokenData({...tokenData, token:null, userId:null})
  }
  const[isLogin, setIsLogin] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
 
  return (
    <AuthContext.Provider value={{ tokenData , setTokenData, isLogin, login:login, logout:logout, 
                                    isLoading, setIsLoading,
                                    selectedEvent, setSelectedEvent
                                    }}>
      {props.children}
    </AuthContext.Provider>
  );
}
export default AuthContextProvider;
