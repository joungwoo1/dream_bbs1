import StarRating from 'StarDraw/StarRating';
import axios from "api/axios";
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

export default function MngReply({auth, parent, replyOnReply, onInputReplyContent, manageReply, getStarScore}) {    

    const [starsValue , setStarsValue] = useState("");


    /* 별점 받는 곳 콜백함수 */
    const getStarsValue = (num) => {
    	setStarsValue(num);
        sandStarsScore(num);
    }
    /* 별점 보내는 곳 콜백함수 */
    const sandStarsScore =(props)=> {
        getStarScore(props);
      };

    /* 유저 이름이 없을시 예외사항 처리 */
    if (!auth.userNick) {
        return;
    }
    console.log(parent)
    /* 기존 댓글 가져오기 기능 */
    const checkedReple = () => {
        
    }

    /* 삭제 버튼 기능 */
    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            await axios.delete(`/post/${parent.id}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        "x-auth-token": `Bearer ${auth.accessToken}`
                    }
                });
        } catch (err) {
            console.log("Delete failed... ", err);
        }
    }

    

    return (
        <Container>
        <Row>
            <Col>{auth.userNick}
        <StarRating style={""} getStarsValue={getStarsValue} disabled={false}/></Col>
        </Row>
        {/*별 그리기 및 별점 받아오기 */}
        {/*이벤트 써서 갱신 */}
        {document.addEventListener('click',sandStarsScore(starsValue))}
        <Row>
            <Col sm={10}>
                <input placeholder='댓글 달기'
                    value={replyOnReply.get(parent.id)}
                    style={{ height: "100%", width: "100%" }}
                    onInput={(e) => onInputReplyContent(e, parent.id)} />
            </Col>

            <Col sm>
            { parent.id.length > 5 ?
        <Button variant="danger" onClick={handleDelete} style={{ float: 'right', margin: '10px' }}>
            삭제
        </Button>:""}
                <Button variant="primary" onClick={(e) => { manageReply(e, parent.id) }}>적용</Button></Col>
        </Row>
    </Container>
    )
}