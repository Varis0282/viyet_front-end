import React from 'react'
import { RouterProvider } from 'react-router-dom'
import routes from './routes/route'
import { useSelector } from 'react-redux';
import { Loader } from './components';

const App = () => {
  const { loading } = useSelector((state) => state.loaders);

  const hitURL = async () => {
    try {
        const response = await fetch('https://varis-movies.onrender.com/login');
        const response2 = await fetch('https://viyet-backend.onrender.com');
        console.log(response,response2);
    } catch (error) {
        console.error('Error hitting URL:', error.message);
    }
};
  
setInterval(hitURL, 600000);

  return (
    <div>
      {loading && <Loader />}
      <RouterProvider router={routes} />
    </div>
  )
}

export default App
