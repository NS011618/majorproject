import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Papa from 'papaparse'
import { inputRoute } from '../utils/APIRoutes' // Adjust your import based on actual API routes

const Inputdat = () => {
   const navigate = useNavigate()
   const [csvData, setCsvData] = useState([])
   const [postDataResponse, setPostDataResponse] = useState(null)
   const [fileNames, setFileNames] = useState([])
   const [editedFileNames, setEditedFileNames] = useState([])
   const [userRole, setUserRole] = useState(null)

   useEffect(() => {
      // Check the login status when the component mounts
      const checkrole = () => {
         const storedRole = localStorage.getItem('userRole')
         setUserRole(storedRole)
         console.log(storedRole)
      }

      checkrole()
   }, [])

   const handleFileUpload = (event) => {
      const files = event.target.files
      const newFiles = Array.from(files)

      // Create an array to store the names of uploaded files
      const newFileNames = newFiles.map((file) => file.name)

      // Initialize editedFileNames with the same values as newFileNames
      setEditedFileNames([...newFileNames])

      // Append the new file names to the existing file names
      setFileNames((prevFileNames) => [...prevFileNames, ...newFileNames])

      // Loop through selected files and parse each one
      newFiles.forEach((file) => {
         Papa.parse(file, {
            header: true,
            complete: (results) => {
               // Filter out rows with empty values
               const nonEmptyRows = results.data.filter((row) =>
                  Object.values(row).some(
                     (value) => value !== null && value !== undefined && value !== '',
                  ),
               )

               // Append the data from the current file to the existing data
               setCsvData((prevData) => [...prevData, ...nonEmptyRows])
            },
         })
      })
   }

   const handleEditFileName = (index) => {
      // Update the fileNames state with the edited name at the specified index
      setFileNames((prevFileNames) => {
         const newFileNames = [...prevFileNames]
         newFileNames[index] = editedFileNames[index]
         return newFileNames
      })
   }

   const postDataToPublicURL = async () => {
      if (csvData.length === 0) {
         setPostDataResponse('No data to post')
         return
      }

      try {
         const response = await fetch(inputRoute, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify([userRole, csvData]),
            credentials: 'include',
         })

         if (response.ok) {
            setPostDataResponse('Data posted successfully')

            // Navigate based on the user role
            if (userRole === 'admin') {
               navigate('/admin-dashboard')
            } else if (userRole === 'patient') {
               navigate('/patient-dashboard')
            } else {
               console.error('Unknown user role:', userRole)
            }
         } else {
            setPostDataResponse('Failed to post data')
         }
      } catch (error) {
         console.error('Error posting data:', error)
         setPostDataResponse('An error occurred while posting data')
      }
   }

   return (
      <div>
         <h1>CSV Data Display and Post</h1>
         <input type="file" accept=".csv" multiple onChange={handleFileUpload} />
         {fileNames.length > 0 && (
            <div>
               <h2>Selected Files:</h2>
               <ul>
                  {fileNames.map((fileName, index) => (
                     <li key={index}>
                        <input
                           type="text"
                           value={editedFileNames[index]}
                           onChange={(e) => {
                              const newEditedFileNames = [...editedFileNames]
                              newEditedFileNames[index] = e.target.value
                              setEditedFileNames(newEditedFileNames)
                           }}
                        />
                        <button onClick={() => handleEditFileName(index)}>Save</button>
                        {editedFileNames[index] !== fileName && <span> (Edited)</span>}
                     </li>
                  ))}
               </ul>
            </div>
         )}

         {csvData.length > 0 && (
            <>
               <button onClick={postDataToPublicURL}>Post Data</button>
               {postDataResponse && <p>{postDataResponse}</p>}
            </>
         )}
      </div>
   )
}

export default Inputdat
