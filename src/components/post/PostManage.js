import axios from "api/axios";
import Button from 'react-bootstrap/Button';
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import AppContext from 'context/AppContextProvider';
import AttachedFileList from "atom/AttachedFileList";
import ThumbnailList from "atom/ThumbnailList";
import { listAgeLimit, listGenre } from "toolbox/MovieInfo";

export default function PostManage() {
    const location = useLocation();
    // 신규작성 시 post.boardVO.id 활용, 수정 시 모든 정보 활용
    const state = location.state?.state;
    const post = location.state?.post;

    const { auth } = useContext(AppContext);
    const navigate = useNavigate();

    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);
    const [listAttach, setListAttach] = useState(post.listAttachFile);
	const [movieId, setMovieId] = useState(post.movieDTO?.id);
    const [contentGenre, setContentGenre] = useState(post.genre);
	const [ageLimit, setAgeLimit] = useState(post.ageLimit);

    const [hasAllContents, setHasAllContents] = useState();
    useEffect(() => {
        setHasAllContents(title?.trim() ? content?.trim() ? movieId ? contentGenre?.trim() ? ageLimit : false : false : false : false);
    }, [title, content, movieId, contentGenre, ageLimit])



	function checkGenre(e) {
		let files = '';
		const query = 'input[name="checkGenre"]:checked';
		const selectedEls = document.querySelectorAll(query);

		// 선택된 목록에서 value 찾기
		selectedEls.forEach((el) => {
			files += el.value + ' ';
		});
		setContentGenre(files)
	};

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!hasAllContents)
            return;

        const writer = { id: auth.userId, name: auth.userName, nick: auth.userNick };
		const bodyData = {
			id: post.id, writer: writer, title: title.trim(),
			content: content.trim(), boardVO: { id: post.boardVO.id },
			genre: contentGenre, ageLimit: ageLimit, listAttachFile: listAttach
		};

        try {
            await axios.post(
                "/post/managePost",
                bodyData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        "x-auth-token": `Bearer ${auth.accessToken}`
                    }
                }
            );
			console.log('post.id', post.id);
            if (!post.id) {
                // 글쓰기
                const ttt = { boardId: post.boardVO.id, page: 1, search: "" }
                navigate(`/board`, { state: ttt });
			} else {
                // 수정
                navigate(`/board`, { state: state });
            }

            //clear state and controlled inputs
            //need value attrib on inputs for this
        } catch (err) {
            console.log("fail... " + err);
        }
    }

    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            await axios.delete(`/post/${post.id}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        "x-auth-token": `Bearer ${auth.accessToken}`
                    }
                });
        } catch (err) {
            console.log("Delete failed... ", err);
        } finally {
			// navigate state 전달
			console.log('Delete state', state);
            navigate(`/board`, { state: state });
        }
    }

	const genreHtml =() =>{
		return <>{listGenre.map((genre,i) => (
			<Form.Check
			inline
			label={genre}
			name="checkGenre"
			type="checkbox"
			value={genre}
			onChange={checkGenre}
			id={`inline-checkbox-${1+i}`}
			checked={contentGenre?.includes(genre)}
			/>))
		}</>
	}

	const ageHtml = () =>{
		return <>{listAgeLimit.map((age,i) => (
			<Form.Check
			inline
			label={age.name}
			name="userSex"
			type="radio"
			value={i}
			onChange={(e) => setAgeLimit(e.target.value)}
			id={`inline-radio-${1+i}`}
			checked={ageLimit == i}
		/>))
		}</>
	}


    return <Form>
        <h5>영상 등록</h5>
        <Form.Group className="mb-3">
            <Form.Label>제목:</Form.Label>
            <br />
            <Form.Control
                type="text"
                value={title}
                id="title"
                onChange={(e) => setTitle(e.target.value)}
                required
            />
        </Form.Group>
        <Form.Group className="mb-3" >
            <Form.Label >영화ID</Form.Label>
            <Form.Control
                type="text"
                value={movieId}
                id="movieId"
                onChange={(e) => setMovieId(e.target.value)}
                required
            />
        </Form.Group>
        <div key={`inline-checkbox`} className="mb-3" defaultChecked={post.genre}>
		{genreHtml()}
		</div>
		{ageHtml()}
        <ThumbnailList imgDtoList={listAttach} />
        <AttachedFileList writer={auth} listAttach={listAttach} setListAttach={setListAttach} />
        
        <Form.Group className="mb-3" >
			<Form.Label >줄거리</Form.Label>
			<Form.Control
				as="textarea"
				value={content}
				rows="5"
				id="content"
				onChange={(e) => setContent(e.target.value)}
				required
			/>
		</Form.Group>

        <Button variant="primary" onClick={handleSubmit} style={{ float: 'right', margin: '10px' }}
            disabled={!hasAllContents}>
            등록
        </Button>
        { post.id ?
        <Button variant="danger" onClick={handleDelete} style={{ float: 'right', margin: '10px' }}>
            삭제
        </Button>:""}
    </Form>
}
