import axios from "api/axios";
import Button from 'react-bootstrap/Button';
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import AppContext from 'context/AppContextProvider';
import AttachedFileList from "atom/AttachedFileList";
import ThumbnailList from "atom/ThumbnailList";

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
	const [contentGenre, setContentGenre] = useState(post.genre);
	const [ageLimit, setAgeLimit] = useState(post.ageLimit);

    const [hasAllContents, setHasAllContents] = useState();
    useEffect(() => {
        setHasAllContents(title?.trim() ? content?.trim() : false);
    }, [title, content])

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
	console.log(ageLimit)
	console.log(contentGenre)

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
		console.log(JSON.stringify(bodyData))
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
				console.log('//글쓰기 ttt');
				navigate(`/board`, { state: { boardId: post.boardVO.id, page: 1, search: "" } });
			} else {
                // 수정
                console.log('수정', post);
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
            const data = await axios.delete(`/post/${post.id}`,
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
        <div key={`inline-checkbox`} className="mb-3" defaultChecked={post.genre}>
			<Form.Check
				inline
				label="액션/무협"
				name="checkGenre"
				type="checkbox"
				value={"액션/무협"}
				onChange={checkGenre}
				id={`inline-checkbox-1`}
				checked={contentGenre?.includes("액션/무협")}
			/>
			<Form.Check
				inline
				label="모험"
				name="checkGenre"
				type="checkbox"
				value={"모험"}
				onChange={checkGenre}
				id={`inline-checkbox-2`}
				checked={contentGenre?.includes("모험")}
			/>
			<Form.Check
				inline
				label="판타지"
				name="checkGenre"
				type="checkbox"
				value={"판타지"}
				onChange={checkGenre}
				id={`inline-checkbox-3`}
				checked={contentGenre?.includes("판타지")}
			/>

			<Form.Check
				inline
				label="공상"
				name="checkGenre"
				type="checkbox"
				value={"공상"}
				onChange={checkGenre}
				id={`inline-checkbox-4`}
				checked={contentGenre?.includes("공상")}
			/>
			<Form.Check
				inline
				label="과학(SF)"
				name="checkGenre"
				type="checkbox"
				value={"과학(SF)"}
				onChange={checkGenre}
				id={`inline-checkbox-5`}
				checked={contentGenre?.includes("과학(SF)")}
			/>
			<Form.Check
				inline
				label="누아르"
				name="checkGenre"
				type="checkbox"
				value={"누아르"}
				onChange={checkGenre}
				id={`inline-checkbox-6`}
				checked={contentGenre?.includes("누아르")}
			/>
			<Form.Check
				inline
				label="전쟁"
				name="checkGenre"
				type="checkbox"
				value={"전쟁"}
				onChange={checkGenre}
				id={`inline-checkbox-7`}
				checked={contentGenre?.includes("전쟁")}
			/>
			<Form.Check
				inline
				label="코미디"
				name="checkGenre"
				type="checkbox"
				value={"코미디"}
				onChange={checkGenre}
				id={`inline-checkbox-8`}
				checked={contentGenre?.includes("코미디")}
			/>
		</div>
        <Form.Check
						inline
						label="전체 이용가"
						name="userSex"
						type="radio"
						value={0}
						onChange={(e) => setAgeLimit(e.target.value)}
						id={`inline-radio-1`}
						checked={ageLimit == 0}
					/>
					<Form.Check
						inline
						label="12세 이상"
						name="userSex"
						type="radio"
						onChange={(e) => setAgeLimit(e.target.value)}
						value={1}
						id={`inline-radio-2`}
						checked={ageLimit == 1}
					/>
					<Form.Check
						inline
						label="15세 이상"
						name="userSex"
						type="radio"
						onChange={(e) => setAgeLimit(e.target.value)}
						value={2}
						id={`inline-radio-3`}
						checked={ageLimit == 2}
					/>
					<Form.Check
						inline
						label="18세 이상"
						name="userSex"
						type="radio"
						onChange={(e) => setAgeLimit(e.target.value)}
						value={3}
						id={`inline-radio-4`}
						checked={ageLimit == 3}
					/>
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
        <Button variant="danger" onClick={handleDelete} style={{ float: 'right', margin: '10px' }}>
            삭제
        </Button>
    </Form>
}
