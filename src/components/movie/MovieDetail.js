import StarRating from 'StarDraw/StarRating';
import axios from 'api/axios';
import ThumbnailList from 'atom/ThumbnailList';
import AppContext from 'context/AppContextProvider';
import { useInterval } from 'hooks/useInterval';
import { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DisplayDate, MembershipDate } from 'toolbox/DisplayDate';
import { Fetch } from 'toolbox/Fetch';
import PostShowMovieDetail from 'components/post/PostShowMovieDetail';
import MovieList from './MovieList';
import MyEval from './MyEval';

export default function MovieDetail() {
    const location = useLocation();
    const { auth } = useContext(AppContext);

    const state = location.state;
    // state={{ id: post.id, boardId: state.boardId, page: curPage, search: textSearch.current?.value, postListWithPaging }}>

    const [title, setTitle] = useState()
    const userId = auth.userId;
    const movieId = state.id;
    const movieUri = `http://localhost:8080/movie/anonymous/getMovie/${movieId}/${userId}`;


    const interval = 5000; // 5초마다 함수 실행
    const isPaid = MembershipDate(auth.membership) >= 0;
    
    

    useInterval(async () => {
        if (!isPaid) {
            return;
        }
        const bodyData = { userId: userId, movieId: movieId, movieTitle: title, viewTime: interval };
        try {
            await axios.post("/user/anonymous/watchingMovie",
                JSON.stringify(bodyData),
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            console.log("RecentMovie Update Success");
            console.log("RecentMovie Update Success");
        } catch (err) {
            console.log('RecentMovie Update Failed');
        }
    }, interval);
    

    return <>
        {state.boardId ?
            <Link key={state.boardId} style={{ margin: '5px' }}
                to={'/board0000'} state={state}>
                목록
            </Link> : auth.userName ?
                <Link to='/recent-movie' style={{ margin: '5px' }}>목록</Link> :
                <Link to='/' style={{ margin: '5px' }}>메인으로</Link>}
        <Fetch uri={movieUri} renderSuccess={RenderSuccess} />
    </>;

    

    function RenderSuccess(post) {
        return <>
           {PostShowMovieDetail(post.movieDTO?.id)}
           {console.log()}
            {setTitle(post.title)}
            <br />
            {isPaid ? <ThumbnailList imgDtoList={post.listAttachFile} /> : <th style={{ color: 'blue' }}>영화를 관람하시려면 멤버쉽 구독이 필요합니다.</th>}

            <h3>제목 : {title}</h3>
            <p>줄거리 : {post.content}</p>
                <p>조회수: <span>{post.readCnt}회</span>
                <span> 개봉일: {DisplayDate(post.regDt, post.uptDt)} </span></p>
                <div>등록닉네임 : {post.writer ? post.writer.nick : ""}&nbsp;&nbsp;&nbsp;&nbsp;별점: {post.starScore}점
                <StarRating totalStars={1} starScore={1} float="left" disabled={true}/></div>
                {(post.writer ? post.writer.nick === auth.userNick : false) ?
                <Link to="/post/managePost" state={{post, state}}>글수정</Link> : "" }
            <br/>
            <MovieList/>
            <MyEval/>
            <otherE/>
            

        </>;
    }
}