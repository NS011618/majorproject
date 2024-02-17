import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import { inputRoute } from '../utils/APIRoutes'; // Adjust your import based on actual API routes

const Inputdat = () => {
   const navigate = useNavigate();
   const [csvData, setCsvData] = useState([]);
   const [postDataResponse, setPostDataResponse] = useState(null);
   const [fileNames, setFileNames] = useState([]);
   const [editedFileNames, setEditedFileNames] = useState([]);
   const [userRole, setUserRole] = useState(null);

   useEffect(() => {
      // Check the login status when the component mounts
      const checkrole = () => {
         const storedRole = localStorage.getItem('userRole');
         setUserRole(storedRole);
      };

      checkrole();
   }, []);

   const handleFileUpload = (event) => {
      const files = event.target.files;
      const newFiles = Array.from(files);

      // Create an array to store the names of uploaded files
      const newFileNames = newFiles.map((file) => file.name);

      // Initialize editedFileNames with the same values as newFileNames
      setEditedFileNames([...newFileNames]);

      // Append the new file names to the existing file names
      setFileNames((prevFileNames) => [...prevFileNames, ...newFileNames]);

      // Loop through selected files and parse each one
      newFiles.forEach((file) => {
         Papa.parse(file, {
            header: true,
            complete: (results) => {
               // Filter out rows with empty values
               const nonEmptyRows = results.data.filter((row) =>
                  Object.values(row).some((value) => value !== null && value !== undefined && value !== '')
               );

               // Append the data from the current file to the existing data
               setCsvData((prevData) => [...prevData, ...nonEmptyRows]);
            },
         });
      });
   };

   const handleEditFileName = (index) => {
      // Update the fileNames state with the edited name at the specified index
      setFileNames((prevFileNames) => {
         const newFileNames = [...prevFileNames];
         newFileNames[index] = editedFileNames[index];
         return newFileNames;
      });
   };

   const postDataToPublicURL = async () => {
      if (csvData.length === 0) {
         setPostDataResponse('No data to post');
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
            setPostDataResponse('Data posted successfully');

            // Navigate based on the user role
            if (userRole === 'admin') {
               navigate('/admin-dashboard');
            } else if (userRole === 'patient') {
               navigate('/patient-dashboard');
            } else {
               console.error('Unknown user role:', userRole);
            }
         } else {
            setPostDataResponse('Failed to post data');
         }
      } catch (error) {
         console.error('Error posting data:', error);
         setPostDataResponse('An error occurred while posting data');
      }
   };

   return (
      <div className="container mx-auto p-8">
         <h1 className="text-3xl font-semibold mb-6 text-center">Patient Health Records</h1>
         <div className="flex flex-col items-center space-y-4">
            <input
               type="file"
               accept=".csv"
               multiple
               className="hidden"
               id="fileInput"
               onChange={handleFileUpload}
            />
            <label
               htmlFor="fileInput"
               className="cursor-pointer bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-lg shadow-md transition duration-300 hover:opacity-90"
            >
               Upload CSV Files
            </label>
            {fileNames.length > 0 && (
               <div className="w-full">
                  <h2 className="text-lg font-semibold mb-2">Selected Files:</h2>
                  <ul>
                     {fileNames.map((fileName, index) => (
                        <li key={index} className="flex items-center space-x-2">
                           <input
                              type="text"
                              value={editedFileNames[index]}
                              className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:border-blue-500"
                              onChange={(e) => {
                                 const newEditedFileNames = [...editedFileNames];
                                 newEditedFileNames[index] = e.target.value;
                                 setEditedFileNames(newEditedFileNames);
                              }}
                           />
                           <button
                              onClick={() => handleEditFileName(index)}
                              className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-md shadow-md transition duration-300 hover:opacity-90"
                           >
                              Save
                           </button>
                           {editedFileNames[index] !== fileName && <span>(Edited)</span>}
                        </li>
                     ))}
                  </ul>
               </div>
            )}

            {csvData.length > 0 && (
               <button
                  onClick={postDataToPublicURL}
                  className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-3 rounded-lg shadow-md transition duration-300 hover:opacity-90"
               >
                  Post Data
               </button>
            )}

            {postDataResponse && <p className="text-center">{postDataResponse}</p>}
         </div>
      </div>
   );
};

export default Inputdat;
