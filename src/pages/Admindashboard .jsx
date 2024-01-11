import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const UserCard = ({ username, userRole }) => (
   <div className="bg-white p-4 rounded-md shadow-md mb-4">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">{username}</h2>
      <p className="text-gray-600">Role: {userRole}</p>
   </div>
)

const Admindashboard = () => {
   const navigate = useNavigate()
   const [userRole, setUserRole] = useState(null)
   const [username, setUsername] = useState(null)

   useEffect(() => {
      const storedRole = localStorage.getItem('userRole')
      const storedName = localStorage.getItem('userName')

      if (storedRole && storedName) {
         setUserRole(storedRole)
         setUsername(storedName)
      }
   }, [])

   const handleInput = () => {
      navigate('/input-data')
   }

   return (
      <div className="flex flex-col h-screen p-4 ">
         <div className="md:w-1/2 md:mr-5">
            {username && userRole && <UserCard username={username} userRole={userRole} />}
         </div>

         <div className="flex flex-col md:flex-row mt-4 ">
            <div className="bg-white p-3 rounded-md shadow-md mb-4 md:w-1/2">
               <h1 className="text-3xl font-bold mb-4">Welcome to Admin Dashboard</h1>
            </div>

            <div className="bg-white p-3 rounded-md shadow-md mb-4 md:w-1/4 ml-auto">
               <p className="mb-4">You can upload datasets here:</p>
               <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out hover:bg-blue-600"
                  onClick={handleInput}
               >
                  Upload Files
               </button>
            </div>
         </div>
      </div>
   )
}

export default Admindashboard
