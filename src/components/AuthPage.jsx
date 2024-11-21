import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/fireBaseConfig';

const AuthPage = () => {
    const [user, setUser] = useState({});
    const [login, setLogin] = useState(false);
    const navigator = useNavigate();

    let handleChnage = (e) => {
        let { name, value } = e.target;
        setUser((prevstate) => ({ ...prevstate, [name]: value }));
    };

    let handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (login) {
                await signInWithEmailAndPassword(auth, user.email, user.password);
                setUser({});
                navigator("/add");
            } else {
                try {
                    let res = await createUserWithEmailAndPassword(
                        auth,
                        user.email,
                        user.password
                    ).catch((err) => {
                        alert(err.code);
                    });

                    if (res) {
                        setUser({});
                        navigator("/add");
                    }

                } catch (error) {
                    console.log(error);

                }

            }
        } catch (error) {
            alert(error.code);
        }
    };

    const googleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            navigator("/add");
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    return (
        <div>
            <div className="container my-5">
                <div className="row justify-content-center">
                    <div className="col-4">
                        <div className="form-content border p-2 rounded">
                            <h3>{!login ? "SignUp" : "Login"} Form</h3>
                            <form onSubmit={handleSubmit}>
                                <input type="text" name="email" id="" className='form-control'
                                    placeholder='Enter Email' value={user.email || ""} onChange={handleChnage} />
                                <input type="password" name="password" className='form-control my-2'
                                    placeholder='Enter Password' id="" value={user.password || ""} onChange={handleChnage} />
                                <div className="d-flex justify-content-between align-items-center">
                                    <input type="submit" value={!login ? "SignUp" : "Login"} className='btn btn-primary' />
                                    <button type="button" onClick={googleSignIn} className='btn btn-danger mt-2'>Sign in with Google</button>
                                </div>
                                <span className='d-block mt-3 text-center'>{login ? "Don't have an account?" : "Already have an account?"}
                                    <span style={{ cursor: "pointer" }} className='ms-1' onClick={() => setLogin(!login)}>
                                        {login ? "SignUp" : "Login"}
                                    </span>
                                </span>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthPage
