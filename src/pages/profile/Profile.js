import React, { useEffect, useState } from 'react';
import { PageWithNavbar } from '../../components';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/userReducer';
import axios from 'axios';
import { message, Table, Image, Button } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLoading } from '../../redux/loaderReducer';
import { UndoOutlined } from '@ant-design/icons';

const Profile = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  };


  const { user } = useSelector(state => state.users);
  console.log("🚀 => user:", user);

  const [userData, setUserData] = useState(user);

  const getUserData = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/me`, { headers });
      console.log(response);
      if (response.data.success) {
        dispatch(setUser(response.data.user));
        setUserData(response.data.user);
      } else {
        message.error(response.data.message);
      }
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error);
      message.error('An error occurred. Please try again');
    }
  };

  const refreshButtonFav = (
    <div className='flex flex-row gap-4 items-end text-4xl'>
      Favourite Movies {'('}{userData?.favourite?.length}{')'}
      <Button className='w-8 h-8 flex justify-center items-center' onClick={getUserData}><UndoOutlined /></Button>
    </div>
  );

  const refreshButtonwWatch = (
    <div className='flex flex-row gap-4 items-end text-4xl'>
      Watch Later Movies {'('}{userData?.watchlist?.length}{')'}
      <Button className='w-8 h-8 flex justify-center items-center' onClick={getUserData}><UndoOutlined /></Button>
    </div>
  )

  const columnsFav = [
    {
      title: 'Poster',
      dataIndex: 'poster_path',
      key: 'poster_path',
      render: (poster_path) => <Image src={`https://image.tmdb.org/t/p/w500${poster_path}`} alt='poster' width={120} className='rounded-md' />
    },
    {
      title: 'Title',
      dataIndex: 'original_title',
      key: 'title',
      sorter: (a, b) => a.original_title.localeCompare(b.original_title),
    },
    {
      title: 'Release Date',
      dataIndex: 'release_date',
      key: 'release_date',
      render: (release_date) => new Date(release_date).toDateString(),
      sorter: (a, b) => new Date(a.release_date) - new Date(b.release_date),
      width: 200
    },
    {
      title: 'Rating',
      dataIndex: 'vote_average',
      key: 'vote_average',
      render: (vote_average) => vote_average.toFixed(1),
      sorter: (a, b) => a.vote_average - b.vote_average,
    },
    {
      title: 'Overview',
      dataIndex: 'overview',
      key: 'overview'
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <div className='flex flex-row'>
          <button
            className='p-1 px-2 bg-black text-white rounded'
            onClick={() => {
              navigate(`/movie/${record.id}`)
            }}
          >View</button>
          <button
            className='p-1 px-2 bg-red-500 text-white rounded ms-2'
            onClick={async () => {
              let newFavourites = userData?.favourite.filter((movie) => movie.id !== record.id);
              setUserData({ ...userData, favourite: newFavourites });
              const response = await axios.delete(`${process.env.REACT_APP_API_URL}/user/removeFavorite/${record.id}`, { headers });
              if (response?.data?.success) {
                localStorage.setItem('user', JSON.stringify(response?.data?.user));
                dispatch(setUser(response?.data?.user));
                message.success('Movie removed from favourites');
                setUserData(response?.data?.user);
              } else {
                message.error(response?.data?.message);
              }
            }}
          >
            Remove
          </button>
        </div>
      ),
    }
  ]

  const columnWatch = [
    {
      title: 'Poster',
      dataIndex: 'poster_path',
      key: 'poster_path',
      render: (poster_path) => <Image src={`https://image.tmdb.org/t/p/w500${poster_path}`} alt='poster' width={120} className='rounded-md' />
    },
    {
      title: 'Title',
      dataIndex: 'original_title',
      key: 'title',
      sorter: (a, b) => a.original_title.localeCompare(b.original_title),
    },
    {
      title: 'Release Date',
      dataIndex: 'release_date',
      key: 'release_date',
      render: (release_date) => new Date(release_date).toDateString(),
      sorter: (a, b) => new Date(a.release_date) - new Date(b.release_date),
      width: 200
    },
    {
      title: 'Rating',
      dataIndex: 'vote_average',
      key: 'vote_average',
      render: (vote_average) => vote_average.toFixed(1),
      sorter: (a, b) => a.vote_average - b.vote_average,
    },
    {
      title: 'Overview',
      dataIndex: 'overview',
      key: 'overview'
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <div className='flex flex-row'>
          <button
            className='p-1 px-2 bg-black text-white rounded'
            onClick={() => {
              navigate(`/movie/${record.id}`)
            }}
          >View</button>
          <button
            className='p-1 px-2 bg-red-500 text-white rounded ms-2'
            onClick={async () => {
              let newWatchlist = userData?.watchlist.filter((movie) => movie.id !== record.id);
              setUserData({ ...userData, watchlist: newWatchlist });
              const response = await axios.delete(`${process.env.REACT_APP_API_URL}/user/removeWatchlist/${record.id}`, { headers });
              if (response?.data?.success) {
                localStorage.setItem('user', JSON.stringify(response?.data?.user));
                dispatch(setUser(response?.data?.user));
                message.success('Movie removed from watchlist');
                setUserData(response?.data?.user);
              } else {
                message.error(response?.data?.message);
              }
            }}
          >
            Remove
          </button>
        </div>
      ),
    }
  ]

  useEffect(() => {
    getUserData();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <PageWithNavbar>
      {user ?
        <div className="flex flex-col gap-6">
          {/* Details */}
          <div className="flex flex-col items-center">
            <p className="bg-black my-4 text-white rounded-full flex justify-center items-center text-4xl w-20 h-20">
              {user.name[0]?.toUpperCase()}
            </p>
            <div className="flex flex-col w-full items-center justify-center gap-4">
              <div className="flex flex-row items-center w-full justify-center px-12">
                <label htmlFor="name" className='w-[10%] text-right px-3'>Name : </label>
                <input
                  type="text"
                  className='border p-2 my-2 w-[70%] rounded-md'
                  value={userData?.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  id='name'
                />
              </div>
              <div className="flex flex-row items-center w-full justify-center px-12">
                <label htmlFor="email" className='w-[10%] text-right px-3'>Email : </label>
                <input
                  type="text"
                  className='border p-2 my-2 w-[70%] rounded-md'
                  value={user.email}
                  id='email'
                  disabled
                />
              </div>
            </div>
          </div>
          {/* Movies */}
          <div className="flex flex-col px-12">
            <Table dataSource={userData?.favourite} columns={columnsFav} bordered title={() => refreshButtonFav} />
            <Table dataSource={userData?.watchlist} columns={columnWatch} bordered title={() => refreshButtonwWatch} />
          </div>
        </div>
        :
        <div className='w-full h-screen flex justify-center items-center text-2xl'>
          Please Login Again !
        </div>
      }
    </PageWithNavbar>
  )
}

export default Profile