import axios from "api/axios";
import NewReply from "atom/NewReply";
import AppContext from "context/AppContextProvider";
import { useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { DisplayDate } from 'toolbox/DisplayDate';

export default function ReplyList({ parent }) {
    const { auth } = useContext(AppContext);
    const ReplyList = ''

    const [justCreatedReplyList, setJustCreatedReplyList] = useState([]);
    const [openAddReply] = useState(new Map());//리플 확인 체크용
    const [replyOnReply] = useState(new Map());//댓글 내용
    const [starScore, setStarScore] = useState(5);//별점
    
    const [renderCount, setRenderCount] = useState(0);//조회수

    function onInputReplyContent(e, replyId) {
        const content = e.target.value;
        replyOnReply.set(replyId, content);//포스트 아이디
        setRenderCount(renderCount + 1);
    }

    function onInputStarScore(starScore){
        setStarScore(starScore);
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
        const score = parseFloat(starScore)
        console.log(typeof(score))
        const bodyData = {
            firstVal: { id: parentId },
            secondVal: { content: replyOnReply.get(parentId), starScore:score }
        };
        console.log(JSON.stringify(bodyData));

        try {
            const response = await axios.post(
                "/post/createReply",
                bodyData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        "x-auth-token": `Bearer ${auth.accessToken}`
                    }
                }
            );
            const reply = response.data;
            setJustCreatedReplyList([...justCreatedReplyList, reply]);
            replyOnReply.set(parentId, '');
            setRenderCount(renderCount + 1);
            postStarScoreAxios(parentId);

            console.log("reply success");
        } catch (err) {
            console.log("fail");
        }
    }

    const postStarScoreAxios = async (postId) => {
        // 목적: 재 조회 방지. 성능
        // parent 객체의 댓글 목록 ul을 찾아서 동적으로 강제적으로 넣기
        
		try {
			await axios.get(`/post/postUpdateStarScore?id=${postId}`);
		} catch (err) {
			console.log('postStarScore Failed');
		}
	}


    function appendJustCreatedReply(newReply, parent) {
        if (!parent.listReply.includes(newReply))
            parent.listReply = [...parent.listReply, newReply];
    }

    justCreatedReplyList.forEach((newReply) => { appendJustCreatedReply(newReply, parent) });

    return <>
        {auth.userNick ?
            <Button variant='primary' onClick={(e) => { markShowAddReply(e, parent.id) }}>댓글</Button> : ''}
        {openAddReply.has(parent.id) ?
            <NewReply auth={auth} reply={parent} replyOnReply={replyOnReply}
                onInputReplyContent={onInputReplyContent} manageReply={manageReply} onInputStarScore={onInputStarScore} /> : ''}
        <ul>
            {parent.listReply?.map((reply) => {
                return <li key={reply.id}>
                    <p>작성자 <span>{reply.writer ? reply.writer.nick : ""} </span></p>
                    답글 : <span>{reply.content}</span>
                    <p><span>{DisplayDate(reply.regDt, reply.uptDt)} </span></p>
                </li>
            })}
        </ul>
    </>
}
