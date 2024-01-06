import React, { useState, useEffect } from 'react';


const UserCard = ({ username, userRole }) => (
  <div className="bg-white p-4 rounded-md shadow-md mb-4">
    <h2 className="text-2xl font-bold mb-2 text-gray-800">{username}</h2>
    <p className="text-gray-600">Role: {userRole}</p>
  </div>
);

const Patientdashboard = () => {
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

  return (
    <div className="flex flex-col h-screen p-2 bg-gray-100">
      <div className="flex flex-col md:flex-row">
        <div className="bg-white rounded-md shadow-md md:w-2/3 p-6 bg-slate-300">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">Welcome to the Patient Dashboard</h1>
          {/* Add your content here */}
          <p className="text-gray-600">
            This is where you can view and manage your health-related information.
          </p>
        </div>
        <div className="md:w-1/4 ml-auto">
          {username && userRole && <UserCard username={username} userRole={userRole} />}
        </div>
      </div>
    </div>
  );
};

export default Patientdashboard;
