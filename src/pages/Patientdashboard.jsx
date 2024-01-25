// Import necessary dependencies and API routes
import React, { useState, useEffect } from 'react'
import { predictRoute, getSymptomsRoute } from '../utils/APIRoutes'

// UserCard component for displaying user information
const UserCard = ({ username, userRole }) => (
   <div className="bg-white p-4 rounded-md shadow-md mb-4">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">{username}</h2>
      <p className="text-gray-600">Role: {userRole}</p>
   </div>
)

// PatientDashboard component
const PatientDashboard = () => {
   // State variables for managing user data, symptoms, and prediction results
   const [userRole, setUserRole] = useState(null)
   const [username, setUsername] = useState(null)
   const [symptomsList, setSymptomsList] = useState([])
   const [selectedSymptoms, setSelectedSymptoms] = useState([])
   const [predictedDisease, setPredictedDisease] = useState('')
   const [accuracy, setAccuracy] = useState(null)
   const [algorithm, setAlgorithm] = useState('DecisionTree')
   const [symptomsLoaded, setSymptomsLoaded] = useState(false)
   const [symptomsError, setSymptomsError] = useState(null)
   const [predictionError, setPredictionError] = useState(null)
   const [searchTerm, setSearchTerm] = useState('')
   const algorithmOptions = ['DecisionTree']

   // Fetch user role and name from local storage and symptoms data from the server
   useEffect(() => {
      const storedRole = localStorage.getItem('userRole')
      const storedName = localStorage.getItem('userName')

      if (storedRole && storedName) {
         setUserRole(storedRole)
         setUsername(storedName)
      }

      const fetchSymptoms = async () => {
         try {
            const response = await fetch(getSymptomsRoute, {
               method: 'GET',
               headers: {
                  'Content-Type': 'application/json',
               },
            })

            if (response.ok) {
               const symptoms = await response.json()
               setSymptomsList(symptoms)               
               setSymptomsLoaded(true)
            } else {
               setSymptomsError('Failed to fetch symptoms. Please try again later.')
               console.error(
                  'Failed to fetch symptoms. Server returned:',
                  response.status,
                  response.statusText,
               )
            }
         } catch (error) {
            setSymptomsError('Error fetching symptoms. Please try again later.')
            console.error('Error:', error)
         }
      }

      fetchSymptoms()
   }, [])

   // Toggle selected symptoms
   const handleSymptomToggle = (event) => {
      const { value } = event.target
      setSelectedSymptoms((prevSelected) => {
         if (prevSelected.includes(value)) {
            return prevSelected.filter((symptom) => symptom !== value)
         } else {
            return [...prevSelected, value]
         }
      })
   }

   // Handle algorithm selection change
   const handleAlgorithmChange = (event) => {
      setAlgorithm(event.target.value)
   }

   // Handle form submission for disease prediction
   const handleSubmit = async () => {
      try {
         const response = await fetch(predictRoute, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               symptoms: selectedSymptoms,
               algorithm: algorithm,
               listsymptoms:symptomsList[0]['sname'],
               
            }),
         })

         if (response.ok) {
            const result = await response.json()
            setPredictedDisease(result.predicted_disease)
            setAccuracy(result.accuracy)
            setPredictionError(null)            
         } else {
            setPredictionError('Failed to get prediction. Please try again later.')
            console.error(
               'Failed to get prediction. Server returned:',
               response.status,
               response.statusText,
            )
         }
      } catch (error) {
         setPredictionError('Error getting prediction. Please try again later.')
         console.error('Error:', error)
      }
   }

   // Clear all selected symptoms
   const handleClearAll = () => {
      setSelectedSymptoms([])
   }

   // Clear predicted disease and accuracy
   const handleClearPredictions = () => {
      setPredictedDisease('')
      setAccuracy(null)
   }

   return (
      <div className="flex flex-col h-screen p-2 bg-gray-100">
         {/* Header */}
         <div className="flex flex-col md:flex-row">
            <div className="bg-white rounded-md shadow-md md:w-2/3 p-6 mb-4">
               <h1 className="text-3xl font-bold mb-4 text-gray-800">
                  Welcome to the Patient Dashboard
               </h1>
               <p className="text-gray-600">
                  This is where you can view and manage your health-related information.
               </p>
            </div>
            <div className="md:w-1/4 ml-auto">
               {username && userRole && (
                  <UserCard username={username} userRole={userRole} />
               )}
            </div>
         </div>

         {/* Main Content */}
         <div className="flex p-2 flex-col h-screen">
            {/* Disease Prediction Section */}
            <div className="flex flex-col md:flex-row">
               <div className="bg-white rounded-md shadow-md md:w-1/3 p-6">
                  <div className="mt-4">
                     <h2 className="text-xl font-bold mb-2 text-gray-800">
                        Disease Prediction
                     </h2>

                     {symptomsError && <p className="text-red-600">{symptomsError}</p>}
                     {symptomsLoaded ? (
                        <form>
                           {/* Search Symptoms */}
                           <div className="mb-4">
                              <label
                                 htmlFor="search"
                                 className="block text-gray-700 text-sm font-bold mb-2"
                              >
                                 Search Symptoms
                              </label>
                              <input
                                 type="text"
                                 id="search"
                                 name="search"
                                 value={searchTerm}
                                 onChange={(e) => setSearchTerm(e.target.value)}
                                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              />
                           </div>

                           {/* Algorithm Selection */}
                           <div className="mb-4">
                              <label
                                 htmlFor="algorithm"
                                 className="block text-gray-700 text-sm font-bold mb-2"
                              >
                                 Algorithm
                              </label>
                              <select
                                 id="algorithm"
                                 name="algorithm"
                                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                 onChange={handleAlgorithmChange}
                                 value={algorithm}
                              >
                                 {algorithmOptions.map((option) => (
                                    <option key={option} value={option}>
                                       {option}
                                    </option>
                                 ))}
                              </select>
                           </div>

                           {/* Prediction Buttons */}
                           <div className="flex">
                              <button
                                 type="button"
                                 className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                                 onClick={handleSubmit}
                              >
                                 Predict Disease
                              </button>
                              <button
                                 type="button"
                                 className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                 onClick={handleClearPredictions}
                              >
                                 Clear Predicted Results
                              </button>
                           </div>
                        </form>
                     ) : (
                        <p>Loading symptoms...</p>
                     )}

                     {predictionError && (
                        <p className="text-red-600">{predictionError}</p>
                     )}

                     {predictedDisease !== null && (
                        <div className="mt-4">
                           <p className="text-gray-800">
                              Predicted Disease: <strong>{predictedDisease}</strong>
                           </p>
                           {accuracy !== null && (
                              <p className="text-gray-800">
                                 Accuracy: <strong>{(accuracy)}%</strong>
                              </p>
                           )}
                        </div>
                     )}
                  </div>
               </div>

               {/* Symptom Selection Section */}
               <div className="bg-white rounded-md shadow-md md:w-2/4 ml-auto p-6">
                  {symptomsError && <p className="text-red-600">{symptomsError}</p>}
                  {symptomsLoaded ? (
                     <form>
                        {/* Select Symptoms */}
                        <div className="mb-4">
                           <label className="block text-gray-800 text-lg font-bold mb-2">
                              Select Symptoms
                           </label>
                           <div className="flex">
                              <div className="mb-4 max-h-96 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                 {symptomsList.map((category, index) => (
                                    <div
                                       key={index}
                                       className="bg-white p-4 rounded-md "
                                    >
                                       <p className="text-blue-600 font-semibold mb-2">
                                          {category.category}
                                       </p>
                                       {category.sname
                                          .filter((symptom) =>
                                             symptom
                                                .toLowerCase()
                                                .includes(searchTerm.toLowerCase()),
                                          )
                                          .sort()
                                          .map((symptom, innerIndex) => (
                                             <div
                                                key={`${index}-${innerIndex}`}
                                                className="mb-2 flex items-center"
                                             >
                                                <input
                                                   type="checkbox"
                                                   id={`symptom-${index}-${innerIndex}`}
                                                   value={symptom}
                                                   checked={selectedSymptoms.includes(
                                                      symptom,
                                                   )}
                                                   onChange={handleSymptomToggle}
                                                   className="mr-2 cursor-pointer text-blue-500"
                                                />
                                                <label
                                                   htmlFor={`symptom-${index}-${innerIndex}`}
                                                   className="text-gray-800"
                                                >
                                                   {symptom}
                                                </label>
                                             </div>
                                          ))}
                                    </div>
                                 ))}
                              </div>
                              <button
                                 type="button"
                                 className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                 onClick={handleClearAll}
                              >
                                 Clear All
                              </button>
                           </div>
                        </div>
                     </form>
                  ) : (
                     <p>Loading symptoms...</p>
                  )}
               </div>
            </div>
         </div>
      </div>
   )
}

export default PatientDashboard
