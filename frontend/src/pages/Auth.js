import React, { useState, useContext } from 'react'
import './Auth.css';
import AuthContext from '../context/auth-context';

function AuthPage() {

  const {token, userId, login} = useContext(AuthContext);
    
  const[datos, setDatos] = useState({
    email: '',
    password: ''
  })

  const[isLogin, setIsLogin] = useState(true);

  const handleInputChange = (e) => {    
    setDatos({
      ...datos,
      [e.target.name] : e.target.value
    })
  }

  const handleModeSwitch = (e) => {
    setIsLogin(!isLogin);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if(datos.email.trim().length === 0 || datos.password.trim().length === 0){
      return;
    }
    let requestBody={
      query: `
        query {
          login(email: "${datos.email}", password:"${datos.password}"){
            userId
            token
            tokenExpiration
          }
        }      
      `
    }
    if(!isLogin){
      requestBody={
        query:`
          mutation {
            createUser(userInput: {email: "${datos.email}", password:"${datos.password}"} ){
              _id
              email
            }
          }
        `
      };
    }
    
    fetch('http://localhost:8000/graphql',{
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers:{
        'Content-Type':'application/json',
      }
    }).then(res=>{
      if(res.status !== 200 && res.status !== 201){
        throw new Error('Failed');
      }
      return res.json();
    }).then(resData=>{
      if(resData.data.login.token){
        login(
          resData.data.login.token,
          resData.data.login.userId,          
          resData.data.login.tokenExpiration
        )        
      }
    }).catch(err=>{
      console.log(err);
    })
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-control">
        <label htmlFor="email">E-Mail</label>
        <input type="email" id="email" value={datos.email} onChange={handleInputChange} name="email"/>
      </div>
      <div className="form-control">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" value={datos.password} onChange={handleInputChange} name="password"/>
      </div>
      <div className="form-actions">
        <button type="submit">Submit</button>
        <button type="button" onClick={handleModeSwitch}>Switch to {isLogin ? 'Signup' : 'Login'}</button>
      </div>      
    </form>
  )
}

export default AuthPage
