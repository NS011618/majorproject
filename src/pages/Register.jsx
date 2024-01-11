import React, { useState } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { registerRoute } from '../utils/APIRoutes'

function Register() {
   const [username, setUsername] = useState('')
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [confirmPassword, setConfirmPassword] = useState('')
   const [role, setRole] = useState('patient')
   const [message, setMessage] = useState('')
   const [loading, setLoading] = useState(false)

   const handleSignup = async () => {
      try {
         setLoading(true)

         if (password !== confirmPassword) {
            setMessage('Password and confirm password do not match')
            return
         }

         const response = await axios.post(registerRoute, {
            username,
            email,
            password,
            confirmPassword,
            role,
         })

         if (response.status === 201) {
            setMessage('User registered successfully')
         }
      } catch (error) {
         const errorMessage = error.response?.data?.message || 'An error occurred'
         setMessage('Error: ' + errorMessage)
      } finally {
         setLoading(false)
      }
   }

   return (
      <Container>
         <Form>
            <h1>Register</h1>
            <InputGroup>
               <label>Username:</label>
               <Input
                  type="text"
                  placeholder="Username"
                  name="username"
                  onChange={(e) => setUsername(e.target.value)}
               />
            </InputGroup>
            <InputGroup>
               <label>Email:</label>
               <Input
                  type="email"
                  placeholder="Email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
               />
            </InputGroup>
            <InputGroup>
               <label>Password:</label>
               <Input
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
               />
            </InputGroup>
            <InputGroup>
               <label>Confirm Password:</label>
               <Input
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  onChange={(e) => setConfirmPassword(e.target.value)}
               />
            </InputGroup>
            <InputGroup>
               <label>Role:</label>
               <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="admin">Admin</option>
                  <option value="patient">Patient</option>
               </select>
            </InputGroup>
            <Button onClick={handleSignup} disabled={loading}>
               {loading ? 'Signing up...' : 'Sign Up'}
            </Button>
            {message && <Message>{message}</Message>}
            <Link to="/login-page">Already have an account? Log In</Link>
         </Form>
      </Container>
   )
}

const Container = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   height: 100vh;
`

const Form = styled.form`
   background-color: #f0f0f0;
   border-radius: 5px;
   box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
   padding: 20px;
   text-align: center;
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
   border-radius: 3px;
`

const Button = styled.button`
   width: 100%;
   padding: 10px;
   background-color: #0074d9;
   border: none;
   border-radius: 3px;
   color: white;
   cursor: pointer;

   &:hover {
      background-color: #0056b3;
   }
`

const Message = styled.div`
   color: red;
   margin: 10px 0;
`

export default Register
