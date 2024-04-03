import React, { useEffect, useState } from 'react'
import { PageWithNavbar } from '../../components'
import { message } from 'antd';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../redux/loaderReducer';

const Login = () => {
    const [user, setUserLocal] = useState({
        name: '',
        email: '',
        password: ''
    })

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user.email || !user.password || !user.name) {
            return message.error('Please fill in all fields');
        }
        try {
            dispatch(setLoading(true))
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, user);
            if (response.data.success) {
                navigate('/login');
                dispatch(setLoading(false))
                return message.success('Signup successful');
            } else {
                dispatch(setLoading(false))
                return message.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            dispatch(setLoading(false))
            return message.error('An error occurred. Please try again');
        }
    };

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/home');
        }
    }, []);


    return (
        <PageWithNavbar>
            <div className='flex flex-col justify-center'>
                <div className='flex justify-center'>
                    <h1 className='text-2xl font-bold'>Signup</h1>
                </div>
                <div className='flex justify-center'>
                    <form className='flex flex-col w-1/3' onSubmit={handleSubmit}>
                        <input
                            type='text'
                            placeholder='Name'
                            className='p-2 my-2 border border-gray-300 rounded'
                            value={user.name}
                            onChange={(e) => setUserLocal({ ...user, name: e.target.value })}
                        />
                        <input
                            type='email'
                            placeholder='Email'
                            className='p-2 my-2 border border-gray-300 rounded'
                            value={user.email}
                            onChange={(e) => setUserLocal({ ...user, email: e.target.value })}
                        />
                        <input
                            type='password'
                            placeholder='Password'
                            className='p-2 my-2 border border-gray-300 rounded'
                            value={user.password}
                            onChange={(e) => setUserLocal({ ...user, password: e.target.value })}
                        />
                        <button
                            type='submit'
                            className='p-2 my-2 bg-blue-500 text-white rounded'
                        >
                            Signup
                        </button>
                        <p className='flex justify-center items-center text-center'>
                            Already have an account ? Click here to &nbsp; <Link to={'/login'} className='text-blue-500'>Login</Link>
                        </p>
                    </form>
                </div>
            </div>
        </PageWithNavbar>
    )
}

export default Login
