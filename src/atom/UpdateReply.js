import StarRating from 'StarDraw/StarRating';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

export default function UpdateReply({auth, parent, getStarScore, onInputReplyContent, bringInputReplyContent, 
    manageReply, handleDelete, bringInputStarScore}) {    

    let [starsValue , setStarsValue] = useState();
    

    /* 별점 받는 곳 콜백함수 */
    const getStarsValue = (num) => {
    	setStarsValue(num);
        sandStarsScore(num);
    }
    /* 별점 보내는 곳 콜백함수 */
    const sandStarsScore =(props)=> {
        getStarScore(props); //별점 가져온 값
      };

    /* 유저 이름이 없을시 예외사항 처리 */
    if (!auth.userNick) {
        return;
    }

    return (
        <Container>
        <Row>
            <Col>{auth.userNick}
        {/*별 그리기 및 별점 받아오기 */}
        <StarRating style={""} getStarsValue={getStarsValue} disabled={false} startStar={bringInputStarScore}/></Col>
        </Row>
        {/*이벤트 써서 갱신 */}
        {document.addEventListener('click',sandStarsScore(starsValue))}
        <Row>
            <Col sm={10}>
                <input placeholder='댓글'
                    defaultValue={bringInputReplyContent()}
                    style={{ height: "100%", width: "100%" }}
                    onInput={(e) => onInputReplyContent(e, parent.id)} />
            </Col>
            <Col>
                <Button variant="primary" onClick={(e) => { manageReply(e, parent.id) }}>적용</Button>
                <Button variant="danger" onClick={handleDelete} style={{ margin: '5px' }}>삭제</Button>
            </Col>
        </Row>
    </Container>
    )
}