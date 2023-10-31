import axios from 'api/axios';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form';
import { FormSelect } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Register = () => {
    const [userName, setUserName] = useState('');
    const [userNick, setUserNick] = useState('');

    const [pwd, setPwd] = useState('');
    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState();

    const [userBirth, setUserBirth] = useState();
    const [userSex, setUserSex] = useState();
    const [userAddress, setUserAddress] = useState();

    const [userEmail, setUserEmail] = useState();
    const [userDomain, setUserDomain] = useState();

    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setValidMatch(pwd ? pwd === matchPwd : false);
    }, [pwd, matchPwd])

    const checkSex = (e) => {
        console.log("checkSex");
        console.log(e.target.value);
        setUserSex(e.target.value);
    };

    const locations = [
        { value: "Goyang", name: "고양" },
        { value: "Gwangju", name: "광주" },
        { value: "Daegu", name: "대구" },
        { value: "Daejeon", name: "대전" },
        { value: "Busan", name: "부산" },
        { value: "Seoul", name: "서울" },
        { value: "Seongnam", name: "성남" },
        { value: "Suwon", name: "수원" },
        { value: "Ansan", name: "안산" },
        { value: "Anyang", name: "안양" },
        { value: "Yongin", name: "용인" },
        { value: "Ulsan", name: "울산" },
        { value: "Incheon", name: "인천" },
        { value: "Jeonju", name: "전주" },
        { value: "Changwon", name: "창원" },
        { value: "Cheonan", name: "천안" },
        { value: "Cheongju", name: "청주" },
        { value: "Pohang", name: "포항" },
        { value: "etc", name: "그 외 국내" }
    ];


    const onBlurNick = async (e) => {
        console.log("onBlurNick");
        try {
            const response = await axios.get(`/user/anonymous/checkNick?nick=${e.target.value}`);
            console.log(response?.data);
        } catch (err) {
            console.log('Error?');
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validMatch)
            return;

        const bodyData = {
            name: userName,
            nick: userNick,
            pwd: pwd,
            birth: userBirth,
            sex: userSex,
            address: userAddress,
            email: userEmail + '@' + userDomain
        };

        console.log(bodyData)

        try {
            const response = await axios.post("/user/anonymous/createMember",
                JSON.stringify(bodyData),
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            console.log(response?.data);
            console.log(JSON.stringify(response))
            setSuccess(true);
            console.log("success");
            //clear state and controlled inputs
            //need value attrib on inputs for this
        } catch (err) {
            console.log('Registration Failed');
        }
    }

    const changeDomain = (domain) => {
        const domainInputEl = document.querySelector('#domain-txt');
        if (domain === "type") {
            domainInputEl.value = "";
            setUserDomain("");
            domainInputEl.disabled = false;
        } else {
            domainInputEl.value = domain;
            setUserDomain(domain);
            domainInputEl.disabled = true;
        }
    }

    return success ? (
        <section style={{ margin: '100px' }}>
            <h1>회원가입이 완료되었습니다!</h1>
            <h1>환영합니다. {userName}님!</h1>
            <p>
                <Link to='/'>메인화면으로</Link>
            </p>
        </section>
    ) : (
        <Form style={{ margin: '50px' }}>
            <Form.Group className="mb-3">
                <Form.Label htmlFor="userName">이름:</Form.Label>
                <Form.Control
                    type="text"
                    id="userName"
                    onChange={(e) => setUserName(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label htmlFor="userNick">아이디:</Form.Label>
                <Form.Control
                    type="text"
                    id="userNick"
                    onChange={(e) => setUserNick(e.target.value)}
                    onBlur={onBlurNick}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label htmlFor="userPwd">비밀번호:</Form.Label>
                <Form.Control
                    type="password"
                    id="userPwd"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                />
                <Form.Label htmlFor="userMatchPwd">비밀번호 확인:</Form.Label>
                <Form.Control
                    type="password"
                    id="userMatchPwd"
                    onChange={(e) => setMatchPwd(e.target.value)}
                    value={matchPwd}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label htmlFor="userBirth">생년월일:</Form.Label>
                <Form.Control
                    type="date"
                    id="userBirth"
                    min="1900-01-01"
                    max={new Date().toISOString().substring(0, 10)}
                    onChange={(e) => setUserBirth(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label htmlFor="userSex">성별:</Form.Label>
                <div key={'inline-radio'} className="mb-3">
                    <Form.Check
                        inline
                        label="남성"
                        name="userSex"
                        type='radio'
                        value={false}
                        onChange={checkSex}
                        id={'inline-radio-1'}
                    />
                    <Form.Check
                        inline
                        label="여성"
                        name="userSex"
                        type='radio'
                        value={true}
                        onChange={checkSex}
                        id={'inline-radio-2'}
                    />
                </div>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label htmlFor="userAddress">주소:</Form.Label>
                <FormSelect className="mb-2" onChange={(e) => setUserAddress(e.target.value)}>
                    <option value="">(주소를 선택해주세요)</option>
                    {locations.map((location) => (
                        <option value={location.value}>{location.name}</option>
                    ))}
                    <option value="Foreign">해외</option>
                </FormSelect>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label htmlFor="userEmail">이메일:&nbsp;</Form.Label>
                <input class="box"
                    type="text"
                    id="userEmail"
                    onChange={(e) => setUserEmail(e.target.value)}
                    required
                />
                @
                <input class="box" id="domain-txt" type="text" onChange={(e) => setUserDomain(e.target.value)} required />
                <select class="box" id="domain-list" onChange={(e) => changeDomain(e.target.value)}>
                    <option value="type">직접 입력</option>
                    <option value="naver.com">naver.com</option>
                    <option value="google.com">google.com</option>
                    <option value="hanmail.net">hanmail.net</option>
                    <option value="nate.com">nate.com</option>
                    <option value="kakao.com">kakao.com</option>
                </select>
            </Form.Group>
            <Button variant="primary" onClick={handleSubmit} style={{ float: 'right', margin: '10px' }}
                disabled={!validMatch || !userName || !userNick || !userBirth || !userSex || !userAddress || !userEmail || !userDomain}>
                입력완료
            </Button>

        </Form>
    )
}

export default Register;