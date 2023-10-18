import AppContext from 'context/AppContextProvider';
import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DisplayDate } from 'toolbox/DisplayDate';
import { Fetch } from 'toolbox/Fetch';
import ReplyList from './ReplyList';
import ThumbnailList from 'atom/ThumbnailList';

export default function PostDetail() {
    const location = useLocation();
    const { auth: curUser } = useContext(AppContext);

    const state = location.state;
    // state={{ id: post.id, boardId: state.boardId, page: curPage, search: textSearch.current?.value, postListWithPaging }}>

    const postUri = `http://localhost:8080/post/anonymous/getPost/${state.id}`;

    return <>
        <Link key={state.boardId} style={{ margin: '5px' }}
            to={'/board'} state={state}>
            목록
        </Link>
        <Fetch uri={postUri} renderSuccess={RenderSuccess} />
    </>;

    function RenderSuccess(post) {
        return <>
            <ThumbnailList imgDtoList={post.listAttachFile}/>
                <h3>제목 : {post.title}</h3>
                <p>줄거리 : {post.content}</p>
                작성자 : {post.writer ? post.writer.nick : ""}
                readCnt : <span>{post.readCnt}</span>
                개봉일 : <span>{DisplayDate(post.regDt, post.uptDt)} </span>
                {(post.writer ? post.writer.nick === curUser.userNick : false) ?
        <Link to="/post/managePost" state={ {post, state}}>수정</Link> : ""
            }
            <br />
            <ReplyList parent={post} />
        </>;
    }
}