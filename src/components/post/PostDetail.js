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

export default function PostDetail() {
    const location = useLocation();
    const { auth } = useContext(AppContext);

    const state = location.state;
    // state={{ id: post.id, boardId: state.boardId, page: curPage, search: textSearch.current?.value, postListWithPaging }}>

    const [title, setTitle] = useState()

    const postUri = `http://localhost:8080/post/anonymous/getPost/${state.id}`;

    const userId = auth.userId;
    const postId = state.id;
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
        <Link key={state.boardId} style={{ margin: '5px' }}
            to={'/board'} state={state}>
            목록
        </Link>
        <Fetch uri={postUri} renderSuccess={RenderSuccess} />
    </>;

    

    function RenderSuccess(post) {
        return <>
         {setTitle(post.title)}
        <ThumbnailList imgDtoList={post.listAttachFile}/>
                <h3>제목: {post.title}</h3>
                <p>줄거리: {post.content}</p>
                <p>조회수: <span>{post.readCnt}회</span>
                <span> 개봉일: {DisplayDate(post.regDt, post.uptDt)} </span></p>
                <div>등록닉네임 : {post.writer ? post.writer.nick : ""}&nbsp;&nbsp;&nbsp;&nbsp;
                <StarRating totalStars={1} float="left" disabled={true}/>{post.starScore}</div>
                {(post.writer ? post.writer.nick === auth.userNick : false) ?
                <Link to="/post/managePost" state={{post, state}}>글수정</Link> : ""
                }
            <br/>
            <ReplyList parent={post} />
        </>;
    }
}