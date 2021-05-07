import React, { useState, useContext } from 'react';
import axios from 'axios';
import UserContext from '../Contexts/UserContext';
import AuthForm from '../Components/AuthForm';

const Signin = () => {
  const [username, setUsername] = useState(false);
  const [email, setEmail] = useState(false);
  const [password, setPassword] = useState(false);
  const [status, setStatus] = useState(false);
  const { setUser } = useContext(UserContext);

  const reqSignin = async () => {
    try {
      // must have required fields filled
      if (!username || !password) {
        setStatus('Username and password must not be empty');
        return;
      }

      let res = await axios({
        method: 'post',
        url: `${process.env.REACT_APP_API}/signin`,
        data: {
          username: username,
          email: email,
          password: password
        },
        withCredentials: true
      });

      // authorization success
      setStatus('You have signed in!');
      setUser(res.data);
    } catch (err) {
      if (err && err.response && err.response.data)
        setStatus(err.response.data);
    }
  };

  let hint = (
    <span className='m-0'>
      Don't have an account?{' '}
      <a className='text-warning' href='/signup'>
        Sign up!
      </a>
    </span>
  );

  return (
    <div className='d-flex align-items-center justify-content-center'>
      <AuthForm
        headerText={'Sign In'}
        enterText={'Sign In'}
        statusText={status}
        hintText={hint}
        setUsername={(u) => setUsername(u)}
        setEmail={(e) => setEmail(e)}
        setPassword={(p) => setPassword(p)}
        action={() => reqSignin()}
      />
    </div>
  );
};

export default Signin;
