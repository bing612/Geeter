import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import UserContext from '../Contexts/UserContext';

const Signout = () => {
  const [status, setStatus] = useState('');
  const { setUser } = useContext(UserContext);

  // this works like componentDidMount()
  useEffect(() => {
    const reqSignout = async () => {
      setUser(false);
      try {
        await axios({
          method: 'post',
          url: `${process.env.REACT_APP_API}/signout`,
          withCredentials: true
        });
        // authorization success
        setStatus('You have signed out!');
      } catch (err) {
        if (err && err.response && err.response.data)
          setStatus(err.response.data);
      }
    };
    reqSignout();
    // eslint-disable-next-line
  }, []);

  return (
    <div className='d-flex align-items-center justify-content-center'>
      <div className='card p-4 text-light bg-dark' style={{ width: '30rem' }}>
        {/* card header title */}
        <h2 className='card-header'>Sign Out</h2>
        <div className='card-body text-center px-3 my-1'>
          {/* possible alerts */}
          <div className='alert alert-warning mb-1' role='alert'>
            {status}
          </div>

          {/* hint buttons */}
          <span className='m-0'>
            <a className='text-warning' href='/signin'>
              Sign in!
            </a>
            {' | '}
            <a className='text-warning' href='/signup'>
              Sign up!
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signout;
