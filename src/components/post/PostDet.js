import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AppContext from "context/AppContextProvider";
import {Fetch} from 'toolbox/Fetch';
import { displayDate } from "toolbox/DateDisplayer";
import ReplyList from './ReplyList';
import ThumbnailList from 'atom/ThumbnailList';
import { Container } from 'react-bootstrap';

import styled from 'styled-components';

const MovieDetailBlock = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 101;
    background: #0B0C0D;
    border-top: 1px solid #191a1c;
    border-bottom: 1px solid #191a1c;
    opacity: 0;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    &.show {
       
        opacity: 1;
    }
    .movie_detail {
        position: absolute;
        bottom: 10%;
        width: 100vw;
        height: 70vh;
        padding: 4vw;
        overflow: hidden;
        background: #2c2c2c;
        color: #fff;
    }
    .detail_content {
        // float: left;
        // width: 40%;
        height: 100%
        padding-top: 5vw;
        & > .content_wrap {
            margin-bottom: 10px;
        }
        .movie_detail_title {
            font-size: 40px;
            h1 {
                line-height: 1.3;
            }
        }
        .movie_detail_info {
            font-size: 18px;
            p {
                line-height: 1.2;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }
        }
    
    }
    .detail_right {
        float: right;
        width: 50%;
        height: 100%;
    }
`;

export default function PostDet({clazzName, show, onClick, title, overview, backImg}) {
    const thumbnailRequestTarget = ["video", "image"];

    const { auth } = useContext(AppContext);
    const location = useLocation();

    const state = location.state;
    //state={{ id:post.id, boardId:state.boardId, page: currentPage, search: txtSearch.current?.value, postListWithPaging}}>

    const postUri = `http://localhost:8080/post/anonymous/getPost/${state.id}`;

    const styles ={
            backgroundImage: `url(https://image.tmdb.org/t/p/original${backImg})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '50% 60%',
            opacity: '0.7',
        }
    

    return <>
        <Link key={state.boardId} to={`/board`} state={state}>
            목록
        </Link>
        <Fetch uri={postUri} renderSuccess={renderSuccess} />
    </>

    function renderSuccess(post) {

        return <>
            <div>
            <MovieDetailBlock className={clazzName} onClick={onClick}  >
                <div className="movie_detail" style={styles}>
                    <div className="detail_content">
                        <div className="content_wrap movie_detail_title">
                            <h1>{title}</h1>
                        </div>
                        <div className="content_wrap movie_detail_info">
                            <p>{overview}</p>
                        </div>
                        <br />
                <ReplyList parent={post} />
                    </div>
                </div>
            </MovieDetailBlock>
            </div>
        </>
    }

}
