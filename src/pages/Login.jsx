import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { Link, useNavigate } from 'react-router-dom'
import { loginRoute } from '../utils/APIRoutes'

const Login = ({ onLogin }) => {
   const [username, setUsername] = useState('')
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [role, setRole] = useState('patient')
   const [message, setMessage] = useState('')
   const [loading, setLoading] = useState(false)
   const navigate = useNavigate()

   useEffect(() => {
      const storedRole = localStorage.getItem('userRole')
      const storedName = localStorage.getItem('userName')

      if (storedRole && storedName) {
         setRole(storedRole)
         setUsername(storedName)
      }
   }, [])

   const handleLogin = async () => {
      try {
         setLoading(true)
         const response = await axios.post(loginRoute, {
            username,
            email,
            password,
            role,
         })

         if (response.status === 200) {
            setMessage('Login successful')
            localStorage.setItem('isLoggedIn', 'true')
            localStorage.setItem('userRole', role)
            localStorage.setItem('userName', username)
            onLogin() // Notify the parent component about the successful login
            if (role === 'admin') {
               navigate('/admin-dashboard')
            } else {
               navigate('/patient-dashboard')
            }
         }
      } catch (error) {
         const errorMessage = error.response?.data?.message || 'An error occurred'
         setMessage(errorMessage)
      } finally {
         setLoading(false)
      }
   }

   return (
      <Container>
         <LoginForm>
            <h1>Login</h1>
            <InputGroup>
               <label>Username:</label>
               <Input
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
               />
            </InputGroup>
            <InputGroup>
               <label>Email:</label>
               <Input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
               />
            </InputGroup>

            <InputGroup>
               <label>Password:</label>
               <Input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
               />
            </InputGroup>
            <InputGroup>
               <label>Role:</label>
               <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="admin">Admin</option>
                  <option value="patient">Patient</option>
               </select>
            </InputGroup>
            <Button onClick={handleLogin} disabled={loading}>
               {loading ? 'Logging in...' : 'Log In'}
            </Button>
            {message && <Message>{message}</Message>}
            <Link to="/">Don't have an account? Register</Link>
         </LoginForm>
      </Container>
   )
}

const Container = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   height: 100vh;
`

const LoginForm = styled.div`
   text-align: center;
   background-color: #fff;
   border-radius: 8px;
   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
   padding: 20px;
   width: 300px;
`

const InputGroup = styled.div`
   display: flex;
   flex-direction: column;
   margin-bottom: 15px;

   label {
      text-align: left;
      margin-bottom: 5px;
      font-weight: bold;
   }
`

const Input = styled.input`
   width: 100%;
   padding: 10px;
   border: 1px solid #ccc;
   border-radius: 4px;
`

const Button = styled.button`
   margin: 10px 0;
   padding: 10px;
   width: 100%;
   background-color: #007bff;
   color: #fff;
   border: none;
   border-radius: 4px;
   cursor: pointer;
`

const Message = styled.div`
   color: red;
   margin: 10px 0;
`

export default Login
