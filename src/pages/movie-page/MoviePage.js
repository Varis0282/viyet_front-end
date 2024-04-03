import React, { useEffect, useState } from 'react';
import { PageWithNavbar } from '../../components'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../redux/loaderReducer';
import { Carousel, Tooltip, message } from 'antd';
import { StarFilled } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom';
import './movie.css'
import { setUser } from '../../redux/userReducer';

const MoviePage = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  };

  const [userLocal, setUserLocal] = useState(JSON.parse(localStorage.getItem('user')));
  const [movie, setMovie] = useState({
    movieData: {},
    credits: {},
    reviews: {},
    similiar: {},
    images: {},
    keywords: {}
  });


  const getMovieDetails = async () => {
    dispatch(setLoading(true));
    // get movie details by taking id in the url
    const movieId = window.location.pathname.split('/')[2];
    const movieData = await axios.get(`${process.env.REACT_APP_API_URL}/movies/${movieId}`, { headers });
    const credits = await axios.get(`${process.env.REACT_APP_API_URL}/movies/${movieId}/credits`, { headers });
    const reviews = await axios.get(`${process.env.REACT_APP_API_URL}/movies/${movieId}/reviews`, { headers });
    const similiar = await axios.get(`${process.env.REACT_APP_API_URL}/movies/${movieId}/similar`, { headers });
    const images = await axios.get(`${process.env.REACT_APP_API_URL}/movies/${movieId}/images`, { headers });
    const keywords = await axios.get(`${process.env.REACT_APP_API_URL}/movies/${movieId}/keywords`, { headers });

    setMovie({
      ...movie,
      movieData: movieData.data.data,
      credits: credits.data.data,
      reviews: reviews.data.data,
      similiar: similiar.data.data,
      images: images.data.data,
      keywords: keywords.data.data
    });

    dispatch(setLoading(false));
  }

  const addRemoveFavourite = async (movie) => {
    if (checkFavourite(movie.id)) {
      // Remove from favourites
      try {
        dispatch(setLoading(true))
        const response = await axios.delete(`${process.env.REACT_APP_API_URL}/user/removeFavorite/${movie.id}`, { headers });
        console.log("🚀 => response:", response);
        if (response?.data?.success) {
          localStorage.setItem('user', JSON.stringify(response?.data?.user));
          dispatch(setUser(response?.data?.user));
          message.success('Movie removed from favourites');
          setUserLocal(response?.data?.user);
        } else {
          message.error(response?.data?.message);
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
        if (response?.data?.success) {
          localStorage.setItem('user', JSON.stringify(response?.data?.user));
          dispatch(setUser(response?.data?.user));
          message.success('Movie added to favourites');
          setUserLocal(response?.data?.user);
          dispatch(setLoading(false));
        } else {
          dispatch(setLoading(false));
          message.error(response?.data?.message);
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

  const addRemoveWatchLater = async (movie) => {
    if (checkWatchLater(movie?.id)) {
      // Remove from watch later
      try {
        dispatch(setLoading(true))
        const response = await axios.delete(`${process.env.REACT_APP_API_URL}/user/removeWatchlist/${movie.id}`, { headers });
        if (response?.data?.success) {
          localStorage.setItem('user', JSON.stringify(response?.data?.user));
          dispatch(setUser(response?.data?.user));
          message.success('Movie removed from watch later');
          setUserLocal(response?.data?.user);
        } else {
          message.error(response?.data?.message);
        }
        dispatch(setLoading(false))
      } catch (error) {
        console.log(error);
        dispatch(setLoading(false))
        message.error('An error occurred. Please try again');
      }
    } else {
      // Add to watch later
      try {
        dispatch(setLoading(true))
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/addWatchlist`, movie, { headers });
        if (response?.data?.success) {
          localStorage.setItem('user', JSON.stringify(response?.data?.user));
          dispatch(setUser(response?.data?.user));
          message.success('Movie added to watch later');
          setUserLocal(response?.data?.user);
          dispatch(setLoading(false));
        } else {
          dispatch(setLoading(false));
          message.error(response?.data?.message);
        }
        dispatch(setLoading(false))
      } catch (error) {
        console.log(error);
        dispatch(setLoading(false))
        message.error('An error occurred. Please try again');
      }
    }
  }

  const checkWatchLater = (movieId) => {
    return userLocal.watchlist.some(movie => movie?.id === movieId);
  }

  useEffect(() => {
    getMovieDetails();
  }, [window.location.pathname]); //eslint-disable-line


  return (
    <PageWithNavbar>
      <div className='text-5xl font-semibold px-8 pb-5 '>
        {movie?.movieData?.original_title}
      </div>
      <div className="flex flex-col px-12">
        {/* Top */}
        <div className="flex flex-row w-full">
          {/* Poster */}
          <div className="flex px-12 py-6 w-2/5 justify-center">
            <img src={'https://image.tmdb.org/t/p/w780' + movie?.movieData?.poster_path} alt={movie?.title} className="w-[80%] justify-center items-center object-contain" />
          </div>
          {/* Details */}
          <div className="flex flex-col w-3/5 p-4 gap-y-4">
            <span className='text-3xl font-semibold'>
              Movie Details :
            </span>
            {/* Basic Details */}
            <div className='flex flex-row flex-wrap justify-between'>
              <div>
                <span className='font-semibold'>Release Date : </span>
                <span>{movie?.movieData?.release_date}</span>
              </div>
              <div>
                <span className='font-semibold'>Rating : </span>
                <span>{movie?.movieData?.vote_average?.toFixed(2)}</span>
              </div>
              <div>
                <span className='font-semibold'>Runtime : </span>
                <span>{movie?.movieData?.runtime} mins</span>
              </div>
              <div>
                <span className='font-semibold'>Status : </span>
                <span>{movie?.movieData?.status}</span>
              </div>

            </div>
            {/* Overview */}
            <div>
              <span className='font-semibold'>Overview : </span>
              <span>{movie?.movieData?.overview}</span>
            </div>
            {/* Languages */}
            <div className='flex flex-row justify-between'>
              <div>
                <span className='font-semibold'>Languages : </span>
                <span>{movie?.movieData?.spoken_languages?.map(language => language.name).join(', ')}</span>
              </div>
              <div className="flex justify-center">
                <button
                  className='bg-blue-500 text-white p-2 rounded'
                  onClick={() => addRemoveWatchLater(movie?.movieData)}
                >
                  {checkWatchLater(movie?.movieData?.id) ? 'Remove from Watch Later' : 'Add to Watch Later'}
                </button>
              </div>
            </div>
            {/* Genres */}
            <div className='flex flex-row justify-between'>
              <div>
                <span className='font-semibold'>Genres : </span>
                <span>{movie?.movieData?.genres?.map(genre => genre.name).join(', ')}</span>
              </div>
              <div className="flex justify-center">
                <button
                  className='bg-red-500 text-white p-2 rounded'
                  onClick={() => addRemoveFavourite(movie?.movieData)}
                >
                  {checkFavourite(movie?.movieData?.id) ? 'Remove from Favourite' : 'Add to Favourite'}
                </button>
              </div>
            </div>
            {/* Tagline */}
            <div>
              <span className='font-semibold'>Tagline : </span>
              <span>{movie?.movieData?.tagline}</span>
            </div>
            {/* Keyword */}
            <div>
              <span className='font-semibold'>Keywords : </span>
              <span>{movie?.keywords?.keywords?.map(keyword => keyword.name).join(', ')}</span>
            </div>
            {/* Production Companies */}
            <div>
              <span className='font-semibold'>Production Companies : </span>
              <div className="flex flex-row">
                {movie?.movieData?.production_companies?.map((company, index) => (
                  <img src={'https://image.tmdb.org/t/p/w780' + company?.logo_path} alt="" className='h-20 w-auto' key={index} />
                ))}
              </div>
            </div>
            {/* Production Countries */}
            <div>
              <span className='font-semibold'>Production Countries : </span>
              <span>{movie?.movieData?.production_countries?.map(country => country.name).join(', ')}</span>
            </div>
            {/* Budget */}
            <div>
              <span className='font-semibold'>Budget : </span>
              <span>${movie?.movieData?.budget}</span>
            </div>
            {/* Revenue */}
            <div>
              <span className='font-semibold'>Revenue : </span>
              <span>${movie?.movieData?.revenue}</span>
            </div>

          </div>
        </div>
        {/* Images */}
        <div className="flex flex-col">
          <span className='text-3xl px-24 font-semibold'>
            Images :
          </span>
          <div className="flex flex-row flex-wrap justify-center py-6 items-center gap-4">
            {movie?.images?.backdrops?.slice(0, 6)?.map((image, index) => (
              <img src={'https://image.tmdb.org/t/p/w780' + image?.file_path} alt="" className='w-[40%]' key={index} />
            ))}
          </div>
        </div>
        {/* Credits using carousel*/}
        <div className="flex flex-col">
          <span className='text-3xl px-24 font-semibold'>
            Credits :
          </span>
          <div className="p-12">
            <Carousel autoplay slidesToShow={4} dots={true} arrows={true} swipe autoplaySpeed={1000}>
              {movie?.credits?.cast?.map((cast, index) => (
                <div className="carousel_div" key={index} >
                  {cast.profile_path ? <img src={'https://image.tmdb.org/t/p/w780' + cast.profile_path} alt="" className='h-72 w-auto' /> : <img src={'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o='} alt="" className='h-72 w-auto' />}
                  <div className='text-2xl font-semibold text-center'>{cast?.name}</div>
                  <div className='text-lg text-center'>{cast?.character}</div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
        {/* Reviews */}
        <div className="flex flex-col">
          <span className='text-3xl px-24 font-semibold'>
            Reviews :
          </span>
          <div className="flex flex-row flex-wrap justify-center py-6 items-center gap-4">
            {movie?.reviews?.results?.map((review, index) => (
              <div className="flex flex-col border border-black p-4 rounded w-[20%]" key={index} >
                <div className='text-2xl font-semibold'>{review?.author}</div>
                <div className='text-lg'>{review?.author_details?.rating} <StarFilled className='text-yellow-500' />  out of 10</div>
              </div>
            ))}
          </div>
        </div>
        {/* Similiar */}
        <div className="flex flex-col">
          <span className='text-3xl px-24 font-semibold'>
            Similiar Movies :
          </span>
          <div className="flex flex-row flex-wrap justify-center py-6 items-center gap-4">
            {movie?.similiar?.results?.map((similiar,index) => (
              <div className="flex relative flex-col rounded border-black border w-[18%] cursor-pointer justify-between gap-4 p-4"
                onClick={() => {
                  navigate(`/movie/${similiar?.id}`);
                }}
                key={index}
              >
                <img src={'https://image.tmdb.org/t/p/w780' + similiar?.poster_path} alt={similiar?.title} className="h-72 justify-center items-center object-contain" />
                <div className="flex flex-col justify-center items-center text-center">
                  <h1 className="text-lg font-bold">
                    <Tooltip title={similiar?.original_title}>
                      {similiar?.original_title.length > 20 ? similiar?.original_title?.slice(0, 20) + '...' : similiar?.original_title}
                    </Tooltip>
                  </h1>
                  <p className='flex flex-row w-full justify-between'>
                    <span>
                      {similiar?.vote_average.toFixed(2)}
                      <span className='text-yellow-500'> <StarFilled /></span>
                    </span>
                    <span>{similiar?.release_date}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWithNavbar>
  )
}

export default MoviePage
