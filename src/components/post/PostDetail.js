import AppContext from 'context/AppContextProvider';
import { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DisplayDate, MembershipDate } from 'toolbox/DisplayDate';
import { Fetch } from 'toolbox/Fetch';
import ReplyList from './ReplyList';
import ThumbnailList from 'atom/ThumbnailList';
import StarRating from 'StarDraw/StarRating';
import { useInterval } from 'hooks/useInterval';
import axios from 'api/axios';
import MovieDetailList from './MovieDetailList';

export default function PostDetail() {
    const location = useLocation();
    const { auth } = useContext(AppContext);

    const state = location.state;
    // state={{ id: post.id, boardId: state.boardId, page: curPage, search: textSearch.current?.value, postListWithPaging }}>

    const [title, setTitle] = useState()
    const userId = auth.userId;
    const postId = state.id;
    const postUri = `http://localhost:8080/post/anonymous/getPost/${postId}/${userId}`;

    const interval = 5000; // 5초마다 함수 실행
    const isPaid = MembershipDate(auth.membership) >= 0;
    
    

    useInterval(async () => {
        if (!isPaid) {
            return;
        }
        const bodyData = { userId: userId, movieId: postId, movieTitle: title, viewTime: interval };
        try {
            await axios.post("/user/anonymous/watchingMovie",
                JSON.stringify(bodyData),
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            console.log("RecentMovie Update Success");
        } catch (err) {
            console.log('RecentMovie Update Failed');
        }
    }, interval);


    return <>
        {state.boardId ?
            <Link key={state.boardId} style={{ margin: '5px' }}
                to={'/board'} state={state}>
                목록
            </Link> : auth.userName ?
                <Link to='/recent-movie' style={{ margin: '5px' }}>목록</Link> :
                <Link to='/' style={{ margin: '5px' }}>메인으로</Link>}
        <Fetch uri={postUri} renderSuccess={RenderSuccess} />
    </>;

    function RenderSuccess(post) {
        return <>
           {MovieDetailList(post.movieDTO?.id)}
           {console.log()}
            {setTitle(post.title)}
            <br />
            {isPaid ? <ThumbnailList imgDtoList={post.listAttachFile} /> : <th style={{ color: 'blue' }}>영화를 관람하시려면 멤버쉽 구독이 필요합니다.</th>}

            <h3>제목 : {title}</h3>
            <p>줄거리 : {post.content}</p>
                <p>조회수: <span>{post.readCnt}회</span>
                <span> 개봉일: {DisplayDate(post.regDt, post.uptDt)} </span></p>
                <div>등록닉네임 : {post.writer ? post.writer.nick : ""}&nbsp;&nbsp;&nbsp;&nbsp;별점: {post.starScore}점
                <StarRating totalStars={1} float="left" disabled={true}/></div>
                {(post.writer ? post.writer.nick === auth.userNick : false) ?
                <Link to="/post/managePost" state={{post, state}}>글수정</Link> : "" }
            <br/>
            
            <ReplyList parent={post} />
        </>;
    }
}