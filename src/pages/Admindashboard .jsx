import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserCard = ({ username, userRole }) => (
   <div className="bg-gradient-to-r from-slate-300 from-10% via-yellow-100 via-40% to-emerald-200 to-90% p-4 rounded-md shadow-md mb-4">
      <h2 className="text-2xl font-bold mb-2 text-gray-800 capitalize">{username}</h2>
      <p className="text-gray-600">Role: {userRole}</p>
   </div>
);

const Admindashboard = () => {
   const navigate = useNavigate();
   const [userRole, setUserRole] = useState(null);
   const [username, setUsername] = useState(null);

   useEffect(() => {
      const storedRole = localStorage.getItem('userRole');
      const storedName = localStorage.getItem('userName');

      if (storedRole && storedName) {
         setUserRole(storedRole);
         setUsername(storedName);
      }
   }, []);

   const handleInput = () => {
      navigate('/input-data');
   };

   return (
      <div className="flex flex-col h-screen p-5  bg-gradient-to-r from-emerald-300 from-5% via-slate-100 via-30% to-orange-200 to-90% shadow-lg">
         <div className="md:flex md:flex-row md:justify-between">
            <div className="bg-white bg-opacity-80 p-6 rounded-md shadow-md mb-4 md:w-1/2 md:mr-4">
               <h1 className="text-3xl font-bold mb-4 text-gray-800">Welcome to Admin Dashboard</h1>
               <p className="text-gray-800">
                  This is your control panel where you can manage all administrative tasks.
               </p>
            </div>
            {username && userRole && (
               <div className="md:w-1/4 md:ml-4">
                  <UserCard username={username} userRole={userRole} />
               </div>
            )}
         </div>
         <div className="bg-white bg-opacity-80 p-6 rounded-md shadow-md mb-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Actions</h2>
            <ul className="space-y-2">
               <li className="flex items-center">
                  <span className="text-gray-800 mr-2">Upload Files:</span>
                  <button
                     className="bg-blue-500 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out hover:bg-blue-600"
                     onClick={handleInput}
                  >
                     Upload Files
                  </button>
               </li>
               {/* Add more action items here */}
            </ul>
         </div>
      </div>
   );
};

export default Admindashboard;
