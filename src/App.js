import React from 'react'
import { RouterProvider } from 'react-router-dom'
import routes from './routes/route'
import { useSelector } from 'react-redux';
import { Loader } from './components';

const App = () => {
  const { loading } = useSelector((state) => state.loaders);

  return (
    <div>
      {loading && <Loader />}
      <RouterProvider router={routes} />
    </div>
  )
}

export default App
