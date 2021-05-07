import React, { useState } from 'react';
import axios from 'axios';
import AuthForm from '../Components/AuthForm';

const Signup = () => {
  const [username, setUsername] = useState(false);
  const [email, setEmail] = useState(false);
  const [password, setPassword] = useState(false);
  const [status, setStatus] = useState(false);

  const reqSignup = async () => {
    try {
      // must have required fields filled
      if (!username || !password) {
        setStatus('Username and password must not be empty');
        return;
      }

      await axios({
        method: 'post',
        url: `${process.env.REACT_APP_API}/signup`,
        data: {
          username: username,
          email: email,
          password: password
        },
        withCredentials: true
      });

      // authorization success
      setStatus('You have signed up!');
    } catch (err) {
      if (err && err.response && err.response.data)
        setStatus(err.response.data);
    }
  };

  let hint = (
    <span className='m-0'>
      Already have an account?{' '}
      <a className='text-warning' href='/signin'>
        Sign in!
      </a>
    </span>
  );

  return (
    <div className='d-flex align-items-center justify-content-center'>
      <AuthForm
        headerText={'Sign Up'}
        enterText={'Sign Up'}
        statusText={status}
        hintText={hint}
        setUsername={(u) => setUsername(u)}
        setEmail={(e) => setEmail(e)}
        setPassword={(p) => setPassword(p)}
        action={() => reqSignup()}
      />
    </div>
  );
};

export default Signup;
