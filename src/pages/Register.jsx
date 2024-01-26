import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import { registerRoute, inputRoute } from '../utils/APIRoutes';

function Register() {
   const [username, setUsername] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [role, setRole] = useState('patient');
   const [message, setMessage] = useState('');
   const [loading, setLoading] = useState(false);

   // File upload related states
   const [csvData, setCsvData] = useState([]);
   const [fileNames, setFileNames] = useState([]);
   const [userRole, setUserRole] = useState(null);

   const navigate = useNavigate();

   useEffect(() => {
      // Check the login status when the component mounts
      const checkRole = () => {
         const storedRole = localStorage.getItem('userRole');
         setUserRole(storedRole);
      };

      checkRole();
   }, []);

   const navigateToDashboard = (role) => {
      if (role === 'patient') {
         navigate('/patient-dashboard');
      } else {
         navigate('/admin-dashboard');
      }
   };

   const handleFileUpload = (event) => {
      const files = event.target.files;
      const newFiles = Array.from(files);

      newFiles.forEach((file) => {
         Papa.parse(file, {
            header: true,
            complete: (results) => {
               const nonEmptyRows = results.data.filter((row) =>
                  Object.values(row).some(
                     (value) => value !== null && value !== undefined && value !== '',
                  ),
               );

               setCsvData((prevData) => [...prevData, ...nonEmptyRows]);

               if (!username && nonEmptyRows.length > 0) {
                  setUsername(nonEmptyRows[0].Name);
               }

               const newFileNames = newFiles.map(() => {
                  const fileName = `${nonEmptyRows[0].Name}.csv`;
                  return fileName;
               });

               setFileNames((prevFileNames) => [...prevFileNames, ...newFileNames]);
            },
         });
      });
   };

   const handleRemoveFile = (fileName) => {
      setFileNames((prevFileNames) => prevFileNames.filter((name) => name !== fileName));
      setUsername('');
      setCsvData((prevData) =>
         prevData.filter((row) => row._fileName !== fileName)
      );
   };

   const handleSignup = async () => {
      try {
         setLoading(true);

         if (password !== confirmPassword) {
            setMessage('Password and confirm password do not match');
            return;
         }

         const response = await axios.post(registerRoute, {
            username,
            email,
            password,
            confirmPassword,
            role,
         });

         if (response.status === 201) {
            setMessage('User registered successfully');

            if (role === 'patient') {
               await postDataToPublicURL();
            }

            navigateToDashboard(role);

         }
      } catch (error) {
         const errorMessage = error.response?.data?.message || 'An error occurred';
         setMessage('Error: ' + errorMessage);
      } finally {
         setLoading(false);
      }
   };

   const postDataToPublicURL = async () => {
      if (csvData.length === 0) {
         setMessage('No data to post');
         return;
      }

      try {
         const response = await fetch(inputRoute, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify([userRole, csvData]),
            credentials: 'include',
         });

         if (response.ok) {
            setMessage('Data posted successfully');
         } else {
            setMessage('Failed to post data');
         }
      } catch (error) {
         console.error('Error posting data:', error);
         setMessage('An error occurred while posting data');
      }
   };

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

            {role === 'patient' && (
               <InputGroup>
                  <label>CSV File:</label>
                  <FileInput
                     type="file"
                     accept=".csv"
                     multiple
                     onChange={handleFileUpload}                     
                  />
                  {fileNames.length === 0 && <NoFileChosen>No file chosen</NoFileChosen>}
               </InputGroup>
            )}

            {fileNames.length > 0 && (
               <FileList files={fileNames} onRemoveFile={handleRemoveFile} />
            )}

            <Button onClick={handleSignup} disabled={loading}>
               {loading ? 'Signing up...' : 'Sign Up'}
            </Button>
            {message && <Message>{message}</Message>}
            <Link to="/login-page">Already have an account? Log In</Link>
         </Form>
      </Container>
   );
}

const Container = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   height: 100vh;
`;

const Form = styled.form`
   background-color: #f0f0f0;
   border-radius: 5px;
   box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
   padding: 20px;
   text-align: center;
   width: 300px;
`;

const InputGroup = styled.div`
   display: flex;
   flex-direction: column;
   margin-bottom: 15px;

   label {
      text-align: left;
      margin-bottom: 5px;
      font-weight: bold;
   }
`;

const Input = styled.input`
   width: 100%;
   padding: 10px;
   border: 1px solid #ccc;
   border-radius: 3px;
`;

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
`;

const Message = styled.div`
   color: red;
   margin: 10px 0;
`;

const FileInput = styled.input`
   width: 100%;
   padding: 10px;
   border: 1px solid #ccc;
   border-radius: 3px;
`;

const NoFileChosen = styled.div`
   margin-top: 10px;
   color: #555;
`;

const FileListContainer = styled.div`
   margin-top: 10px;
`;

const FileListItem = styled.div`
   display: flex;
   justify-content: space-between;
   align-items: center;
   padding: 5px;
   border: 1px solid #ccc;
   border-radius: 3px;
   margin-bottom: 5px;
`;

const FileList = ({ files, onRemoveFile }) => (
   <FileListContainer>
      <h2>Selected Files:</h2>
      {files.map((fileName, index) => (
         <FileListItem key={index}>
            {fileName}
            <button className="bg-red-600 p-1" onClick={() => onRemoveFile(fileName)}>Remove</button>
         </FileListItem>
      ))}
   </FileListContainer>
);

export default Register;
