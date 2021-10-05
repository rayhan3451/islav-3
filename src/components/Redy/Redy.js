import React, { useContext } from 'react';
import './Redy.css'
import { useForm } from 'react-hook-form';
import { useHistory, Redirect } from 'react-router-dom';
import { UserContext } from '../../App';
import Swal from 'sweetalert2';

const Redy = () => {
  let history = useHistory();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const onSubmit = (data) => {
    fetch('https://islavopyament.herokuapp.com/api/users/createPaymentLink', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.paymentLink) {
          window.location.href = `${data.paymentLink}`;
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'সফলভাবে ফরম পূরণ হয়েছে',
            showConfirmButton: false,
            timer: 2000,
          });
          history.push('/clicknow');
        }
      });
  };

  console.log(watch('example')); // watch input value by passing the name of it
  return (
    <div className='body'>
      
      <div className="container">

      <p>যেভাবে পেমেন্ট করতে পারবেনঃ বিকাশ ও নগদ , ভিসা , মাস্টার ও এমেরিকান এক্সপ্রেস । পেমেন্ট করে অ্যাপে পূনরায় লগ-ইন করুন ।</p>

      <div className='title'>চার্জ ৬৪.২ টাকা মাত্র (মেয়াদ ১বছর)</div>

      <form onSubmit={handleSubmit(onSubmit)}>

        <div class="user-details">

            <div className="input-box">
                <span class="details">ইমেইল</span>
                <input defaultValue={loggedInUser.email} {...register('email', { required: true })} placeholder=' আপনার ইমেইল'/>
            </div>

            <div className="input-box">
                <span class="details">আপনার নাম</span>
                <input {...register('name', { required: true })} placeholder=' আপনার নাম'/>
            </div>

            <div className="input-box">
                <span class="details">আপনার মোবাইল</span>
                <input {...register('phone', { required: true })} placeholder=' আপনার মোবাইল'/>
            </div>

            <input
              {...register('payment', { required: true })}
              value='paid'
              style={{ display: 'none' }}
        />
        </div>

        <div className="button_two">
         <button type='submit' className="btn">টাকা পরিশোধ করুন</button>
        </div>

      </form>
      </div>

    </div>
  );
};

export default Redy;
