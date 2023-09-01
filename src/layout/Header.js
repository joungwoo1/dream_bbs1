import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import Fetch from 'toolbox/Fetch';

function Header(){
    
    const boardListUri = "http://192.168.0.147:8080/bb/anonymous/listAll";    
    //const [boardList, setBoardList] = useState();

    return (
        <>            
            <Link to="/">Home</Link>
            <Fetch uri={boardListUri} renderSuccess={RenderSuccess} />
        </>
    );
}

function RenderSuccess(board) {

    return <>{board.map(board=>{return <Link key={board.id} to={`/post/anonymous/listAll${board.id}`}>{board.name}</Link>})}</>
    
}
export default Header;