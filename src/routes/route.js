import { createBrowserRouter } from 'react-router-dom';
import { Home, Login, MoviePage, Profile, Signup } from '../pages';
import PrivateResource from './PrivateResources';

const routes = createBrowserRouter([
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/',
        element: <PrivateResource component={<Home />} />,
    },
    {
        path: '/home',
        element: <PrivateResource component={<Home />} />,
    },
    {
        path: '/signup',
        element: <Signup />,
    },
    {
        path: '/movie/:id',
        element: <PrivateResource component={<MoviePage />} />
    },
    {
        path: '/profile',
        element: <PrivateResource component={<Profile />} />
    }
]);

export default routes;