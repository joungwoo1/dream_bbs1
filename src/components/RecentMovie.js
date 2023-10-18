import axios from 'api/axios';
import AppContext from 'context/AppContextProvider';
import { useContext } from 'react';
import { DisplayDate } from 'toolbox/DisplayDate';
import { Fetch } from "toolbox/Fetch";

export default function RecentMovie() {
    const { auth } = useContext(AppContext);
    const listAllRecentMoviesUri = `http://localhost:8080/user/anonymous/listAllRecentMovies?userId=${auth.userId}`;

    return (
        <div>
            <table style={{ margin: '20px' }}>
                <thead>
                    <tr>
                        <th>제목</th>
                        <th>최근에 본 날</th>
                        <th>장르</th>
                    </tr>
                </thead>
                <tbody>
                    <Fetch uri={listAllRecentMoviesUri} renderSuccess={RenderSuccess} />
                </tbody>
            </table>
        </div>
    );

    function RenderSuccess(movieList) {
        return <>
            {movieList?.map(movie => (
                <tr key={movie.movieId}>
                    <td>{findMovie(movie.movieId, 'title')}</td>
                    <td>{DisplayDate(movie.regDt, movie.uptDt)}</td>
                    <td>{findMovie(movie.movieId, 'genre')}</td>
                </tr>
            ))}
        </>;
    }
}

const findMovie = async (movieId, toFind) => {
    const response = await axios.get(`/post/anonymous/getPost?id=${movieId}`);
    if (toFind === 'title') {
        return response?.title;
    } else if (toFind === 'genre') {
        return response?.genre;
    } else {
        return null;
    }
}