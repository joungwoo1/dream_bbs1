import axios from "api/axios";
import { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DisplayDate } from 'toolbox/DisplayDate';
import Fetch from 'toolbox/Fetch';
import Button from 'react-bootstrap/Button';
import NewReply from "atom/MngReply";

import AppContext from 'context/AppContextProvider';

export default function PostDetailOld() {
    const location = useLocation();
    const { auth: curUser } = useContext(AppContext);

    const state = location.state;
    const postUri = `http://localhost:8080/post/anonymous/getPost/${state.id}`;

    const [renderCount, setRenderCount] = useState(0);

    const [justCreated] = useState(new Map());
    const [openAddReply] = useState(new Map());
    const [replyOnReply] = useState(new Map());

    function onInputReplyContent(e, replyId) {
        const content = e.target.value;
        replyOnReply.set(replyId, content);
        setRenderCount(renderCount + 1);
    }

    function markShowAddReply(e, replyId) {
        openAddReply.set(replyId, 1);
        setRenderCount(renderCount + 1);
    }

    const manageReply = async (e, parentId) => {
        // 목적: 재조회 방지, 성능
        // parent 객체의 댓글 목록 ul을 찾아서 동적으로 강제적으로 넣기
        e.preventDefault();
        if (replyOnReply.get(parentId) == null || replyOnReply.get(parentId).length === 0)
            return;

        const bodyData = {
            firstVal: { id: parentId },
            secondVal: {
                writer: { id: curUser.userId, nick: curUser.userNick },
                content: replyOnReply.get(parentId)
            }
        };
        console.log(JSON.stringify(bodyData));

        try {
            const response = await axios.post(
                "/post/createReply",
                bodyData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        "x-auth-token": `Bearer ${curUser.accessToken}`
                    }
                }
            );
            const reply = response.data;
            console.log('reply : ' + JSON.stringify(reply));
            justCreated.set(reply.parentId, reply);
            replyOnReply.set(parentId, '');
            console.log(reply.parentId);
            setRenderCount(renderCount + 1);

            console.log("reply success");
        } catch (err) {
            console.log("fail");
        }
    }

    return <>
        <Link key={state.boardId} style={{ margin: '5px' }}
            to={'/board'} state={state}>
            목록으로 돌아가기
        </Link>
        <Fetch uri={postUri} renderSuccess={RenderSuccess} />
    </>;

    function appendJustCreatedReply(pid, reply, parent) {
        console.log('pid : ' + pid);
        console.log('parent.id : ' + parent.id);
        if (pid === parent.id) {
            if (!parent.listReply.include(reply))
                parent.listReply = [...parent.listReply, reply];
        }
    }

    function RenderSuccess(post) {
        justCreated.forEach((value, key) => { appendJustCreatedReply(key, value, post) });

        return <>
            <h3 style={{ margin: '20px' }}>{post.title}</h3>
            <p style={{ margin: '20px' }}>{post.content}</p>
            <br /><br /><br />
            작성자 : {post.writer ? post.writer.nick : '(없음)'}&nbsp;&nbsp;
            조회수 : <span>{post.readCnt}</span>&nbsp;&nbsp;
            좋아요 : <span>{post.likeCnt} with button</span>&nbsp;&nbsp;
            싫어요 : <span>{post.disCnt}</span>&nbsp;&nbsp;
            최종작성일 : <span>{DisplayDate(post.regDt, post.uptDt)}</span>
            {(post.writer ? post.writer.id === curUser.userId : false) ?
                <Link
                    to={"/post/managePost"}
                    state={{ post: post }}
                    style={{ margin: '20px' }}
                >수정</Link> : ''}
            <br />
            <Button variant='primary' onClick={(e) => { markShowAddReply(e, post.id) }}>댓글</Button>
            {openAddReply.has(post.id) ?
                <NewReply auth={curUser} reply={post} replyOnReply={replyOnReply}
                    onInputReplyContent={onInputReplyContent} manageReply={manageReply} /> : ''}
            <Replies listReply={post.listReply} />
        </>;
    }

    function Replies({ listReply = [] }) {
        if (!listReply || listReply.length === 0)
            return <ul></ul>;
        return <ul>
            {listReply.map((reply) => {
                return <li key={reply.id}>
                    댓글 : <span>{reply.content}</span>&nbsp;&nbsp;
                    최종작성일 : <span>{DisplayDate(reply.regDt, reply.uptDt)}</span>&nbsp;&nbsp;
                    작성자 : {reply.writer ? reply.writer.nick : '(없음)'}&nbsp;&nbsp;
                    <Button variant='primary' onClick={(e) => { markShowAddReply(e, reply.id) }}>댓글</Button>
                    <br />
                    {openAddReply.has(reply.id) ?
                        <NewReply auth={curUser} reply={reply} replyOnReply={replyOnReply}
                            onInputReplyContent={onInputReplyContent} manageReply={manageReply} /> : ''}
                    <Replies listReply={reply.listReply} />
                </li>
            })}
        </ul>
    }
}
