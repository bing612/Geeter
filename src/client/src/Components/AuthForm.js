import React from 'react';

/**
 * @param {string} props.headerText
 * @param {string} props.enterText
 * @param {string} props.statusText
 * @param {string} props.hintText
 * @param {Function} props.setUsername
 * @param {Function} props.setEmail
 * @param {Function} props.setPassword
 * @param {Function} props.action
 */
const AuthForm = (props) => {
  const renderAlert = () => {
    // if there is no status, then do not show anything
    if (!props.statusText) return null;
    // otherwise show alert status
    return (
      <div className='alert alert-warning mb-1' role='alert'>
        {props.statusText}
      </div>
    );
  };

  return (
    <div className='card p-4 text-light bg-dark' style={{ width: '30rem' }}>
      {/* card header title */}
      <h2 className='card-header'>{props.headerText}</h2>
      <div className='card-body text-center px-3 my-1'>
        {/* email */}
        <div className='input-group mb-1'>
          <span className='input-group-text btn-warning'>
            <i className='fas fa-envelope fa-fw'></i>
          </span>
          <input
            type='email'
            className='form-control'
            onChange={(e) => props.setEmail(e.target.value)}
            placeholder='Email'
            autocomplete='on'
          ></input>
        </div>

        {/* username */}
        <div className='input-group mb-1'>
          <span className='input-group-text btn-warning'>
            <i className='fas fa-user fa-fw'></i>
          </span>
          <input
            type='text'
            className='form-control'
            onChange={(e) => props.setUsername(e.target.value)}
            placeholder='Username'
            name='username'
            autocomplete='on'
          ></input>
        </div>

        {/* password */}
        <div className='input-group mb-1'>
          <span className='input-group-text btn-warning'>
            <i className='fas fa-key fa-fw'></i>
          </span>
          <input
            type='password'
            className='form-control'
            onChange={(e) => props.setPassword(e.target.value)}
            placeholder='Password'
            name='password'
            autocomplete='on'
          ></input>
        </div>

        {/* submit button */}
        <div className='float-end'>
          <button className='btn btn-warning' onClick={props.action}>
            {props.enterText} <i className='fas fa-sign-in-alt fa-fw'></i>
          </button>
        </div>
      </div>
      <div className='card-footer text-center'>
        {/* possible alerts */}
        {renderAlert()}

        {/* hint button */}
        {props.hintText}
      </div>
    </div>
  );
};

export default AuthForm;
