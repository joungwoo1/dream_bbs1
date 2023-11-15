import HomePage from 'page/HomePage';
import PostList from 'components/post/PostList';
import PostDetail from 'components/post/PostDetail';
import PostManage from 'components/post/PostManage';
import Register from 'components/Register';
import ManagerPage from 'components/ManagerPage';
import Mypage from 'components/Mypage';
import { Route, Routes } from 'react-router-dom';
import RecentMovie from 'components/RecentMovie';
import MainPage from 'page/MainPage';
import MoviePlay from 'movie/MoviePlay';
import PostSearch from 'components/PostSearch';
import ReplyList from 'components/post/ReplyList';
import MovieDetail from 'components/movie/MovieDetail';
import MovieList from 'components/movie/MovieList';
import MyEval from 'components/movie/MyEval';
import MovieManage from 'components/movie/MovieManage';

/* 
            <Route path='/board0001' element={<PostList />} />
            <Route path='/post' element={<PostDetail />} />
            <Route path='/post/managePost' element={<PostManage />} />
            <Route path='/post/manageReply' element={<ReplyList />} />
*/


export default function BBSRouter() {
    return (
        <Routes>

            <Route path="/" element={<HomePage />} exact={true} />
            <Route path="/main" element={<MainPage />} exact={true} />
            <Route path='/movie_play' element={<MoviePlay/>} />
            <Route path="/sign-up" element={<Register />} />
            <Route path='/movie' element={<MovieDetail/>}/>
            <Route path='/post' element={<PostDetail />} />
            <Route path='/board0000' element={<MovieList/>} />
            <Route path='/board0001' element={<PostList />} />
            <Route path='/Movie/manageMovie' element={<MovieManage />} />
            <Route path='/post/managePost' element={<PostManage />} />
            <Route path='/movie/manageEval' element={<MyEval/>} />
            <Route path='/post/manageReply' element={<ReplyList />} />
            <Route path='/movie-search' element={<PostSearch />} />
            <Route path='/manager-only' element={<ManagerPage />} />
            <Route path='/mypage' element={<Mypage />} />
            <Route path='/recent-movie' element={<RecentMovie />} />
        </Routes>
    );
}