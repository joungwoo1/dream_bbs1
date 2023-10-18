import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function NewReply({auth, reply, replyOnReply, onInputReplyContent, manageReply, onInputStarScore}) {
    if (!auth.userNick) {
        return;
    }
    return (
        <Container>
            <Row>
                <Col>댓글 달기</Col>
            </Row>
            <input type="range"
            id="starScore"
            min="0" max="5"
            onChange={(e) => onInputStarScore(e.target.value)}
            size="10" />
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