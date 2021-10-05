import React, { useEffect, useState } from 'react';
import './Login.css'
import { useContext } from 'react';
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router-dom';
import { initializeLoginFramework, handleGoogleSignIn, handleSignOut, handleFbSignIn, createUserWithEmailAndPassword, signInWithEmailAndPassword } from './loginManager';
import Swal from 'sweetalert2'


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
    let { from } = location.state || { from: { pathname: "/" } };
    const [paid, setPaid] = useState("unpaid")
    const [userPaymentDatas, setUserpaymentData] = useState([])
    //user payment check data

    useEffect(() => {
        fetch('https://islavo.herokuapp.com/userdata')
            .then(res => res.json())
            .then(userPaymentData => {
                if (userPaymentData.length > 0) {
                    setUserpaymentData(userPaymentData)
                }
            })
    }, [])

    const handleResponse = (res, redirect) => {
        setUser(res);
        setLoggedInUser(res);
        if (redirect) {
            history.replace(from);
        }
    }

    const resetpassbtn = () => {
        history.push("/resetpassword")
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
        console.log(user)
        if (newUser && user.email && user.password) {
            console.log(user)
            createUserWithEmailAndPassword(user.name, user.email, user.password)
                .then(res => {
                    handleResponse(res, true);
                    if (userPaymentDatas.length == 0) {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'সফলভাবে অ্যাকাউন্ট তৈরি হয়েছে',
                            showConfirmButton: false,
                            timer: 2000
                        })

                        history.push("/redy")

                    }

                    userPaymentDatas.filter(data => {
                        if (data?.Email === user.email) {
                            const payments = data?.payment

                            if (payments === "paid") {
                                history.push("/clicknow")

                            }
                        }
                        else {
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: 'সফলভাবে অ্যাকাউন্ট তৈরি হয়েছে',
                                showConfirmButton: false,
                                timer: 2000
                            })
                            history.push('/redy')
                        }

                    })


                })
        }

        if (!newUser && user.email && user.password) {
            console.log(user)
            signInWithEmailAndPassword(user.email, user.password)
                .then(res => {
                    handleResponse(res, true);
                    console.log(user)
                    if (1) {
                        console.log(user)
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'সফলভাবে লগইন হয়েছে',
                            showConfirmButton: false,
                            timer: 2000
                        })
                        fetch('https://islavopyament.herokuapp.com/api/users/getUserPaymentStatus', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({email: user.email}),
                        })
                        .then(res => res.json())
                        .then((data) => {
                            console.log(data.paymentStatus == 'completed');
                            if (data.paymentStatus == 'completed') {
                                // Swal.fire({
                                //     position: 'center',
                                //     icon: 'success',
                                //     title: 'payment succcess',
                                //     showConfirmButton: false,
                                //     timer: 2000,
                                // });
                                history.push('/success');
                            }
                            else{
                                history.push("/redy")
                            }
                        });
                    }


                    // userPaymentDatas.filter(data => {
                    //     if (data?.Email === user.email) {
                    //         const payments = data?.payment

                    //         if (payments === "paid") {
                    //             Swal.fire({
                    //                 position: 'center',
                    //                 icon: 'success',
                    //                 title: 'সফলভাবে লগইন হয়েছে',
                    //                 showConfirmButton: false,
                    //                 timer: 2000
                    //             })

                    //             history.push("/clicknow")
                    //         }
                    //     }
                    //     else {
                    //         Swal.fire({
                    //             position: 'center',
                    //             icon: 'success',
                    //             title: 'সফলভাবে লগইন হয়েছে',
                    //             showConfirmButton: false,
                    //             timer: 2000
                    //         })
                    //         history.push('/redy')
                    //     }

                    // })

                })
        }
        e.preventDefault();
    }



    return (
        <div className="body">

            <div className="container">

                <p>
                    দেশ সেরা ইসলামী সংগীত শিল্পীদের নিয়ে ইসলাভো পডকাস্ট চার্জ ৬৪.২ টাকা মাত্র (মেয়াদ ১বছর)
                    যেভাবে পেমেন্ট করতে পারবেন বিকাশ ও নগদ , ভিসা , মাস্টার ও এমেরিকান এক্সপ্রেস এর মাধ্যমে</p>

                <div className="title">সাইন-আপ অথবা সাইন-ইন করুন</div>

                <form onSubmit={handleSubmit}>

                <div class="user-details">
                    
            
                    <div className="input-box">
                        <span class="details">ইমেইল</span>
                        <input type="text" name="email" onBlur={handleBlur} placeholder=" আপনার ইমেইল" />
                    </div>

                    <div className="input-box">
                        <span class="details">পাসওয়ার্ড</span>
                        <input type="password" name="password" onBlur={handleBlur} placeholder=" ছয় সংখ্যার পাসওয়ার্ড" />
                    </div>

                   
                    {newUser &&
                    <div className="input-box">
                        <span class="details">আপনার নাম</span>
                        <input name="name" type="text" onBlur={handleBlur} placeholder="আপনার নাম"/>
                    </div> 
                        
                    }
                    

                </div>
                    
                    <div className="button">
                        <input type="submit" value={newUser ? 'সাইন আপ' : 'সাইন ইন'} />
                    </div>

                    <button className="btn" htmlFor="newUser" onClick={() => setNewUser(!newUser)} name="newUser" >নতুন অ্যাকাউন্ট</button><br/>
                    <button className="btn" onClick={resetpassbtn} >পাসওয়ার্ড রিসেট করুন</button>
                    

                </form>
            </div>

        </div>
    );
}

export default Login;
