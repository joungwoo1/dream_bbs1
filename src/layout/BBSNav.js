import LoginModal from 'components/LoginModal';
import AppContext from "context/AppContextProvider";
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Fetch } from 'toolbox/Fetch';
import Button from 'react-bootstrap/Button';

import styled from 'styled-components';

const HeaderBlock =  styled.header`
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    align-items: center;
    background: #22b99b;
    width: 100%;
    min-width: 1280px;
    height: 56px;
    padding: 0 50px;

`;

const HeaderTitle = styled.p`
    flex: 1;
    font-size: 25px;
    line-height: 1.3;
    font-weight: bold;
`;

function BBSNav() {
    const boardListUri = `http://localhost:8080/bb/anonymous/listAll`;
    const { auth } = useContext(AppContext);
    const navigate = useNavigate();
    const isManager = auth?.roles?.includes("manager");

    const handleSubmit = (e, id) => {
        e.preventDefault();
        navigate(`/board`, { state: { boardId: id, page: 1 }});
    }

    return (
        <>

        <div>
        <HeaderBlock>
            <HeaderTitle>OTT</HeaderTitle>
            <nav class="navbar">
                    <a href="/"><Button variant="secondary" style={{color: "black"}}>Home</Button></a>
                    <a href="/main"><Button variant="secondary" style={{color: "black"}}>List</Button></a>
                </nav>
        </HeaderBlock>
        <br/>
        <br/>
        <br/>
            <body>
            <Fetch uri={boardListUri} renderSuccess={renderSuccess} />
            {isManager ?
                <Link key='whatever'
                    to='/manager-only' style={{ margin: '5px' }}>
                    관리자 페이지
                </Link> : ''}
            <LoginModal />
            </body>
        </div>
        </>
    );

    function renderSuccess(boardList) {
        return <>
            {boardList.map(board => (
                <Button variant="outline-info" onClick={e => handleSubmit(e, board.id)} style={{ margin: '5px' }}>
                    {board.name}
                </Button>
            ))}
        </>
    }
}

export default BBSNav;

