import React from 'react';
import styled from 'styled-components';
import logoImg from '../Image/logo.png';

const MovieTemplate = styled.div`
    position: relative;
    background: url('https://dhgywazgeek0d.cloudfront.net/watcha/image/upload/c_fill,h_1620,q_80,w_2880/v1564363966/crosgmb6yawejwkff87a.jpg') no-repeat center;
    background-size: cover;
    position: relative;
    .inner {
        height: 100vh;
        width: 100%;
        position: relative;
        margin: 0 auto;
        padding: 0 135px;
    }
    .area_text {
        display: inline-block;
        overflow: hidden;
        position: relative;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        z-index: 100;
    }
    .logo {
        display: inline-block;
        width: 345px;
        height: 125px;
        background: url(${logoImg}) no-repeat ;
        text-indent: -9999px;
    }
    h1 {
        font-size: 30px;
        color: #fff;
    }
`;

const MoviePlay = () => {
    return(
        <MovieTemplate>
            <div className="inner">
                <div className="area_text">
                    <div className="logo">로고</div>
                    <br/>
                    <h1>서비스를 준비하고 있습니다.</h1>
                </div>
            </div>
        </MovieTemplate>            
    );
}

export default MoviePlay;