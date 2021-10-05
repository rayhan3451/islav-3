import React, { useState } from 'react';
import './Reset.css'
import * as firebase from "firebase/firebase";
import { useContext } from 'react';
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router-dom';
import { initializeLoginFramework, handleGoogleSignIn, handleSignOut, handleFbSignIn, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '../Login/loginManager';



function Login() {
    const [newUser, setNewUser] = useState(false);
    const [user, setUser] = useState({
        isSignedIn: false,
        name: '',
        email: '',
        password: '',
        photo: ''
    });

    initializeLoginFramework();

    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const history = useHistory();
    const location = useLocation();
    let { from } = location.state || { from: { pathname: "/redy" } };


    const newAccountBtn = () => {
        history.push("/login")
    }





    const handleBlur = (e) => {
        let isFieldValid = true;
        if (e.target.name === 'email') {
            isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
        }
        if (e.target.name === 'password') {
            const isPasswordValid = e.target.value.length > 5;
            const passwordHasNumber = /\d{1}/.test(e.target.value);
            isFieldValid = isPasswordValid && passwordHasNumber;
        }
        if (isFieldValid) {
            const newUserInfo = { ...user };
            newUserInfo[e.target.name] = e.target.value;
            setUser(newUserInfo);
        }
    }
    const handleSubmit = (e) => {



        e.preventDefault();
    }

    const resetPassword = email => {
        var auth = firebase.auth();
        auth.sendPasswordResetEmail(email)
            .then(() => {
                history.replace("/thankyou")
            }).catch(function (error) {

            })
    }



    return (
        <div className="body">
            <div className="container">

            <div className="title">পাসওয়ার্ড রিসেট ফরম</div>

            <form onSubmit={handleSubmit}>
                <div class="user-details">

                    <div className="input-box">
                        <span class="details">ইমেইল</span>
                        <input type="text" name="email" onBlur={handleBlur} placeholder=" আপনার ইমেইল" />
                    </div>
                
                </div>

                <div className="button">
                    <input onClick={() => resetPassword(user.email)} type="submit" value={newUser ? 'সাইন আপ' : 'ক্লিক করুন'}/>
                </div>

                <div className="button_two">
                    <button onClick={newAccountBtn}>লগ-ইন করুন</button>
                </div>
            </form>


            </div>
        </div>
    );
}

export default Login;