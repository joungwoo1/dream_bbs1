import { useContext, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { DisplayDate } from "toolbox/DisplayDate";
import { Fetch } from "toolbox/Fetch";

import AppContext from 'context/AppContextProvider';

export default function MovieList() {
    const location = useLocation();
    let state = location.state;
    console.log(state)
    const { auth } = useContext(AppContext);
    const isManager = auth?.roles?.includes('manager');

    function buildUrl() {
            return `http://localhost:8080/movie/anonymous/listAll/`;
    }
    const [movieListUri, setMovieListUri] = useState(buildUrl(222));
    
    const [targetBoard, setTargetBoard] = useState(state.boardId);
    console.log("saved targetBoard", targetBoard);

    if (targetBoard !== state.boardId) {
        setTargetBoard(state.boardId);
        setMovieListUri(buildUrl());
    }

    function renderSuccess(movieListWithPaging) {
        const movieList = movieListWithPaging;
        return <>
           <table style={{ margin: '20px' }}>
                <thead>
                    <tr>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>조회수</th>
                        <th>좋아요수</th>
                        <th>최종수정일</th>
                    </tr>
                </thead>
                <tbody>
                    {movieList?.map(movie => (
                        <tr key={movie.id}>
                            <td>
                            {(!auth?.ageLimit && movie.ageLimit < 3) || (movie.ageLimit <= auth?.ageLimit) ?
                                <Link key={movie.id} to={`/movie`}
                                    state={{ id: movie.id, movieListWithPaging }}>
                                    {movie.title}
                                </Link> : '연령 제한 콘텐츠'}
                            </td>
                            <td>&nbsp;&nbsp;{movie.readCnt}</td>
                            <td>&nbsp;&nbsp;{DisplayDate(movie.regDt, movie.uptDt)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    }

    return (
        <div>
            {isManager ?
                <Link
                    to="/Movie/manageMovie"
                    state={{ movie: { boardVO: { id: state.boardId }, listAttachFile:[] } }} 
                    style={{ margin: '5px' }}>
                    영상 등록
                </Link> : ''}
            
            <Fetch uri={movieListUri} renderSuccess={renderSuccess} />
        </div>
    );
}
