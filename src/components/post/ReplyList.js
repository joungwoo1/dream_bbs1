import StarRating from "StarDraw/StarRating";
import axios from "api/axios";
import MngReply from "atom/MngReply";
import AppContext from "context/AppContextProvider";
import { useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { DisplayDate } from 'toolbox/DisplayDate';

export default function ReplyList({ parent }) {
    const { auth } = useContext(AppContext);

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
    
    /* 별점 받는 곳 콜백함수 */
    const getStarScore = (num) =>{
    	setStarScore(num);
    }

    //set 은 데이터를 순서 없이 저장하는 기능
    function markShowAddReply(e, replyId) {
        openAddReply.set(replyId, 1); //replyId을 맵을 돌려서  openAddReply에 1개 넣어라 
        setRenderCount(renderCount + 1);//조회수 증가
    }

    function markShowChangeReply(e, replyId) {
        openAddReply.set(replyId, 1);
        setRenderCount(renderCount + 1);//조회수 증가
    }

    const manageReply = async (e, parentId) => {
        // 목적: 재조회 방지, 성능
        // parent 객체의 댓글 목록 ul을 찾아서 동적으로 강제적으로 넣기
        e.preventDefault();
        if (replyOnReply.get(parentId) == null || replyOnReply.get(parentId).length === 0)
            return;
        const score = parseFloat(starScore)
        const bodyData = {
            firstVal: { id: parentId , replyId: auth.userId, listReply: parent.listReply},
            secondVal: { content: replyOnReply.get(parentId), starScore:score }
        };
        console.log(JSON.stringify(bodyData));

        try {
            const response = await axios.post(
                "/post/manageReply",
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
    console.log(parent)
    console.log(auth)

    /*댓글 등록 체크 */
    function ReplyCheck(){
        let isAlready = [];
        parent.listReply.map((replyId) => {
            isAlready.push(replyId.id == parent.id + auth.userId && replyId.length !=0);
        })
        return isAlready.includes(true)  ?
        <Button variant='primary' onClick={(e) => { markShowChangeReply(e, parent.id + auth.userId ) }}>수정</Button> 
        : <Button variant='primary' onClick={(e) => { markShowAddReply(e, parent.id) }}>댓글</Button>
    }


    justCreatedReplyList.forEach((newReply) => { appendJustCreatedReply(newReply, parent) });

    return <>
        {/* 초회 댓글인지 확인 */}
        {ReplyCheck()}
        
        {/* 로그인 했는지 체크 */}
        {openAddReply.has(parent.id) ?
            <MngReply auth={auth} reply={parent} replyOnReply={replyOnReply} getStarScore={getStarScore}
                onInputReplyContent={onInputReplyContent} manageReply={manageReply} /> : ""}
        

        <ul> {/* 댓글 출력 */}
            {parent.listReply?.map((reply) => {
                return <li key={reply.id}>
                    <p>작성자: <span>{reply.writer ? reply.writer.nick : ""} 
                     <span> {DisplayDate(reply.regDt, reply.uptDt)} </span> 별점 {reply.starScore}
                    <StarRating style={""} totalStars={reply.starScore} disabled={true}/> </span></p>
                    <p><span>답글 :{reply.content} </span></p>
                    
                </li>
            })}
        </ul>
    </>
}
