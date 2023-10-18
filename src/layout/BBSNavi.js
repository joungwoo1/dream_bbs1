import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Fetch } from "toolbox/Fetch";
import LoginModal from "components/LoginModal";
import Button from 'react-bootstrap/Button';

import AppContext from 'context/AppContextProvider';

export default function BBSNavi() {
    const boardListUri = `http://localhost:8080/bb/anonymous/listAll`;
    const { auth } = useContext(AppContext);
    const navigate = useNavigate();
    const isManager = auth?.roles?.includes('manager');

    const handleSubmit = (e, id) => {
        e.preventDefault();
        navigate(`/board`, { state: { boardId: id, page: 1 }});
    }

    return (
        <header>
            <Link to='/' style={{ margin: '5px' }}>Home</Link>
            <Fetch uri={boardListUri} renderSuccess={RenderSuccess} />
            {isManager ?
                <Link key='whatever'
                    to='/manager-only' style={{ margin: '5px' }}>
                    관리자 페이지
                </Link> : ''}
            <LoginModal />
        </header>
    );

    function RenderSuccess(boardList) {
        return <>
            {boardList.map(board => (
                <Button variant="outline-info" onClick={e => handleSubmit(e, board.id)} style={{ margin: '5px' }}>
                    {board.name}
                </Button>
            ))}
        </>;
    }
}