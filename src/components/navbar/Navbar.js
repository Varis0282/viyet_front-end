import React, { useEffect, useState } from 'react'
import { UserOutlined, SearchOutlined, LogoutOutlined } from '@ant-design/icons'
import { Tooltip, Dropdown, message } from 'antd'
import { useDispatch } from 'react-redux'
import { setUser } from '../../redux/userReducer'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { setLoading } from '../../redux/loaderReducer'

const Navbar = ({ setData, setTotal, page, setSearchForNav }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const [search, setSearch] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    };

    const handleSearch = async () => {
        if (!search) {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/movies`, { headers });
            if (response.data.success) {
                setData(response.data.data.results);
                setTotal(response.data.data.total_results);
            } else {
                message.error(response.data.message);
            }
            return;
        }
        try {
            dispatch(setLoading(true));
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/movies/search?query=${search}&page=${page}`, { headers });
            if (response.data.success) {
                setData(response.data.data.results);
                setTotal(response.data.data.total_results);
            } else {
                message.error(response.data.message);
            }
            dispatch(setLoading(false));
        } catch (error) {
            console.log(error);
            message.error('An error occurred. Please try again');
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        if (search) {
            handleSearch();
        }
    }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

    const items = [
        {
            label: <span className='flex justify-between'>View Profile <UserOutlined /></span>,
            key: '0',
            onClick: () => navigate('/profile')
        },
        {
            label: <p className='text-red-500 flex justify-between'>Logout <LogoutOutlined /></p>,
            key: '1',
            onClick: () => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                dispatch(setUser(null));
                window.location.reload();
            }
        }
    ];


    return (
        <div className="flex flex-row bg-black justify-between text-white text-4xl p-4 items-center flex-wrap">
            <div className='w-1/3 cursor-pointer' onClick={() => { navigate('/') }}>Viyet</div>
            <div className='w-1/3 text-center cursor-pointer' onClick={() => { navigate('/') }}>Movies Villa</div>
            <div className="flex flex-row justify-between text-lg gap-4 w-1/3 pl-24">
                <div className='flex justify-center items-center'>
                    <Tooltip title="Hit Enter to search" destroyTooltipOnHide>
                        <input
                            type="text"
                            className='px-1 w-[180px] text-base h-8 rounded rounded-r-none focus:outline-none outline-none text-black'
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value)
                                setSearchForNav(e.target.value)
                            }}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </Tooltip>
                    <Tooltip title="Click to search">
                        <button
                            className='bg-gray-300 px-1 h-8 rounded rounded-l-none text-black'
                            onClick={handleSearch}
                        >
                            <SearchOutlined />
                        </button>
                    </Tooltip>
                </div>
                <div className='flex items-center'>
                    {token ? (
                        <div className='flex rounded border items-center text-base'>
                            <Tooltip title={'Open profile'}>
                                <button className='border-r-[1px] px-2'>
                                    <UserOutlined />
                                </button>
                            </Tooltip>
                            <Dropdown
                                menu={{
                                    items,
                                }}
                                trigger={['click']}
                            >
                                <button className='px-5'>
                                    {user.name}
                                </button>
                            </Dropdown>
                        </div>
                    ) : (
                        <div className='flex rounded border items-center text-base'>
                            <Tooltip title="Login to view profile">
                                <button className='border-r-[1px] px-2'>
                                    <UserOutlined />
                                </button>
                            </Tooltip>
                            <Tooltip title="Login">
                                <button className='px-5' onClick={() => navigate('/login')}>
                                    Login
                                </button>
                            </Tooltip>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Navbar
