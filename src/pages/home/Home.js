import React, { useEffect, useState } from 'react'
import { Navbar, PageWithNavbar } from '../../components'
import axios from 'axios'
import { message, Pagination } from 'antd'
import moment from 'moment'
import { StarFilled, HeartOutlined, HeartFilled } from '@ant-design/icons'
import { Tooltip } from 'antd'
import { useDispatch } from 'react-redux'
import { setUser } from '../../redux/userReducer'
import { setLoading } from '../../redux/loaderReducer'
import { useNavigate } from 'react-router-dom'


const Home = () => {
    const [data, setData] = useState([]);
    const [userLocal, setUserLocal] = useState(JSON.parse(localStorage.getItem('user')));
    const [currentPage, setCurrentPage] = useState(1);
    const [search,setSearch] = useState('');
    const [total, setTotal] = useState(0);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }

    const addRemoveFavourite = async (movie) => {
        if (checkFavourite(movie.id)) {
            // Remove from favourites
            try {
                dispatch(setLoading(true))
                const response = await axios.delete(`${process.env.REACT_APP_API_URL}/user/removeFavorite/${movie.id}`, { headers });
                console.log("🚀 => response:", response);
                if (response.data.success) {
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    dispatch(setUser(response.data.user));
                    message.success('Movie removed from favourites');
                    setUserLocal(response.data.user);
                } else {
                    message.error(response.data.message);
                }
                dispatch(setLoading(false))
            } catch (error) {
                console.log(error);
                dispatch(setLoading(false))
                message.error('An error occurred. Please try again');
            }
        } else {
            // Add to favourites
            try {
                dispatch(setLoading(true))
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/addFavorite`, movie, { headers });
                console.log("🚀 => response:", response);
                if (response.data.success) {
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    dispatch(setUser(response.data.user));
                    message.success('Movie added to favourites');
                    setUserLocal(response.data.user);
                    dispatch(setLoading(false));
                } else {
                    dispatch(setLoading(false));
                    message.error(response.data.message);
                }
                dispatch(setLoading(false))
            } catch (error) {
                console.log(error);
                dispatch(setLoading(false))
                message.error('An error occurred. Please try again');
            }
        }
    }

    const checkFavourite = (id) => {
        return userLocal.favourite.some(movie => movie?.id === id);
    }

    useEffect(() => {
        const getData = () => {
            dispatch(setLoading(true))
            axios.get(`${process.env.REACT_APP_API_URL}/movies?page=${currentPage}`, { headers: headers })
                .then((res) => {
                    if (res.data.success) {
                        setData(res.data.data.results);
                        setTotal(res.data.data.total_results);
                        message.success('Movies fetched successfully');
                    }
                    dispatch(setLoading(false))
                })
                .catch((err) => {
                    console.log(err)
                    message.error('An error occurred. Please try again');
                    dispatch(setLoading(false))
                }) // eslint-disable-next-line
        }
        if (!search) {
            getData();
        }
    }, [userLocal, currentPage]);

    return (
        <>
            <Navbar setData={setData} setTotal={setTotal} page={currentPage} setSearchForNav={setSearch}/>
            <div className='font-bold text-4xl text-center mb-4 pt-8'>Movies {'('}{total}{')'}</div>
            {/* Pagination */}
            <div className='w-full flex justify-center items-center py-4 pb-8'>
                <Pagination defaultCurrent={1} total={total} pageSize={20}
                    showQuickJumper
                    onChange={(e) => {
                        setCurrentPage(e)
                    }}
                />
            </div>
            <div className="flex flex-row flex-wrap gap-4 justify-center">
                {data && data?.map((movie) => (
                    <div
                        key={movie?.id}
                        className="flex relative flex-col rounded border-black border w-[18%] cursor-pointer justify-between gap-4 p-4"
                        onClick={() => {
                            navigate(`/movie/${movie?.id}`)
                        }}
                    >
                        {/* Insert a add to favoutite button */}
                        <div className="absolute right-0">
                            <Tooltip title="Add to Favourites">
                                <button className='px-2 outline-none' onClick={() => addRemoveFavourite(movie)}>
                                    {checkFavourite(movie?.id) ? <HeartFilled className='text-red-500' /> : <HeartOutlined />}
                                </button>
                            </Tooltip>
                        </div>
                        <img src={'https://image.tmdb.org/t/p/w780' + movie?.poster_path} alt={movie?.title} className="h-72 justify-center items-center object-contain" />
                        <div className="flex flex-col justify-center items-center text-center">
                            <span className="w-full flex justify-end">
                                {movie?.adult ? <span className='bg-red-500 text-white px-1 rounded'>A</span> : null}
                            </span>
                            {/* Keep the title only of One line */}
                            <h1 className="text-lg font-bold">
                                <Tooltip title={movie?.original_title}>
                                    {movie?.original_title.length > 20 ? movie?.original_title.slice(0, 20) + '...' : movie?.original_title}
                                </Tooltip>
                            </h1>
                            <p className='flex flex-row w-full justify-between'>
                                <span>
                                    {movie?.vote_average.toFixed(2)}
                                    <span className='text-yellow-500'> <StarFilled /></span>
                                </span>
                                <span>{moment(movie?.release_date).format('MMMM Do YYYY')}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Home
