import { useRef, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import axios from '../api/axios';
const LOGIN_URL = '/auth';
//const USER_URL = '/login/users/current';

const Login = () => {
    const { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();
    const userErrRef = useRef();
    const passwordErrRef = useRef();

    const [username, setUser] = useState('');
    const [password, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [userErrMsg, setUserErrMsg] = useState('');
    const [passwordErrMsg, setPasswordErrMsg] = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [username, password])

    useEffect(() => {
        setUserErrMsg('');
    }, [username])

    useEffect(() => {
        setPasswordErrMsg('');
    }, [password])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ username, password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            const accessToken = response?.data?.accessToken;

            if (response?.data?.errors) {
                if (response?.data?.errors?.username) {
                    setUserErrMsg(response?.data?.errors?.username);
                }
                if (response?.data?.errors?.password) {
                    setPasswordErrMsg(response?.data?.errors?.password);
                }
            } else {

console.log('---data----',response?.data );

                const roles = response?.data?.roles;
                setAuth({username, password, roles, accessToken});
                setUser('');
                setPwd('');
                navigate(from, {replace: true});
            }
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    return (

        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <span ref={userErrRef} className={userErrMsg ? "usererrmsg" : "offscreen"} aria-live="assertive">{userErrMsg}</span>
                <input
                    type="text"
                    id="username"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setUser(e.target.value)}
                    value={username}
                    required
                />

                <label htmlFor="password">Password:</label>
                <span ref={passwordErrRef} className={passwordErrMsg ? "usererrmsg" : "offscreen"} aria-live="assertive">{passwordErrMsg}</span>
                <input
                    type="password"
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    value={password}
                    required
                />
                <button>Sign In</button>
            </form>
            <p>
                Need an Account?<br />
                <span className="line">
                    <Link to="/register">Sign Up</Link>
                </span>
            </p>
        </section>

    )
}

export default Login
