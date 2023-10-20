import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import StarRating from 'StarDraw/StarRating';
import { useState } from 'react';

export default function NewReply({auth, reply, replyOnReply, onInputReplyContent, manageReply, getStarScore}) {    
    const [starsValue , setStarsValue] = useState("");

    const getStarsValue = (num) => {
    	setStarsValue(num);
        sandStarsScore(starsValue)
    }
    
    console.log(starsValue)
    

    const sandStarsScore =(props)=> {
        
        getStarScore(starsValue)
    };

    if (!auth.userNick) {
        return;
    }
    
    return (
        <Container>
            <Row>
                <Col>댓글 달기</Col>
            </Row>
            <StarRating style={""} getStarsValue={getStarsValue} />
            <Row>
                <Col sm={10}>
                    <input placeholder='댓글 달기'
                        value={replyOnReply.get(reply.id)}
                        style={{ height: "100%", width: "100%" }}
                        onInput={(e) => onInputReplyContent(e, reply.id)} />
                </Col>
                <Col sm><Button variant="primary" onClick={(e) => { manageReply(e, reply.id) }}>적용</Button></Col>
            </Row>
        </Container>
    )
}