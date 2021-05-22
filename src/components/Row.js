import React, { useState, useEffect } from 'react'
import YouTube from 'react-youtube';
import movieTrailer from 'movie-trailer';
import axios from '../axios'
import './Row.css'
const baseImgUrl = "https://image.tmdb.org/t/p/original";

function Row({ title, fetchUrl, isLargeRow }) {
    const [movies, setMovies] = useState([]);
    const [trailerUrl, settrailerUrl] = useState("")
    useEffect(() => {
        async function fetchData() {
            const request = await axios.get(fetchUrl);
            // console.log(request.data.results);
            setMovies(request.data.results);
            return request;
        }
        fetchData();
    }, [fetchUrl]);

    // Options for react-youtube
    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
            autoplay: 1,
        },
    };

    const handleClick = movie => {
        if (trailerUrl) {
            settrailerUrl('')
        } else {
            movieTrailer(movie?.title || "")
                .then(url => {
                    const urlParams = new URLSearchParams(new URL(url).search)
                    settrailerUrl(urlParams.get('v'));
                })
                .catch(error => console.log(error))
        }
    }
    // console.log(movies);
    return (
        <div className="row">
            <h2>{title}</h2>
            <div className="row__posters">
                {
                    movies.map(movie => (
                        <img
                            className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                            src={`${baseImgUrl}${isLargeRow ? movie.poster_path : movie.backdrop_path
                                }`}
                            alt={movie.name}
                            key={movie.id}
                            onClick={() => handleClick(movie)}
                        />
                    ))
                }
            </div>
            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
        </div>
    )
}

export default Row
