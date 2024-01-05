import { React , useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    const storedName = localStorage.getItem('userName');
    
    if (storedRole && storedName) {
      setUserRole(storedRole);
      setUsername(storedName);
      console.log(
        `User role: ${storedRole}, User name: ${storedName}`
      );
      
    }
  }, []);

  const handleInput = () => {
    navigate('/input-data');
  };

  return (
    <div className='flex flex-col h-screen'>
      <h1 className='text-3xl font-bold mb-8'>Home</h1>
      <div className=''>
        <button
          className='bg-blue-500 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out hover:bg-blue-600'
          onClick={handleInput}
        >
          Upload Files
        </button>
        <p>{username}</p>
        <p>{userRole}</p>
      </div>
    </div>
  );
}

export default Home;
