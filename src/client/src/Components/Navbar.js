import React, { useContext } from 'react';
import UserContext from '../Contexts/UserContext';

const Navbar = () => {
  const { user } = useContext(UserContext);

  const renderAuth = () => {
    if (user) {
      return (
        <li className='nav-item dropdown'>
          <div
            className='nav-link dropdown-toggle'
            id='navbarUsDropdown'
            role='button'
            data-bs-toggle='dropdown'
            aria-expanded='false'
          >
            {user.username}
          </div>
          <ul
            className='dropdown-menu dropdown-menu-end dropdown-menu-dark'
            aria-labelledby='navbarUsDropdown'
          >
            <li>
              <a className='dropdown-item' href={'/profile/' + user.id}>
                Profile
              </a>
            </li>
            <li>
              <hr className='dropdown-divider' />
            </li>
            <li>
              <a className='dropdown-item' href='/signout'>
                Sign Out
              </a>
            </li>
          </ul>
        </li>
      );
    } else {
      return (
        <React.Fragment>
          <li className='nav-item'>
            <a className='nav-link' href='/signup'>
              Sign Up
            </a>
          </li>
          <li className='nav-item'>
            <a className='nav-link' href='/signin'>
              Sign In
            </a>
          </li>
        </React.Fragment>
      );
    }
  };

  return (
    <nav className='navbar navbar-expand-lg sticky-top navbar-dark bg-dark'>
      <div className='container-fluid'>
        {/* brand */}
        <a className='navbar-brand' href='/'>
          Geeter
        </a>

        {/* collapse navbar toggler */}
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#collapse'
        >
          <span className='navbar-toggler-icon'></span>
        </button>

        {/* navbar */}
        <div className='collapse navbar-collapse' id='collapse'>
          <ul className='navbar-nav'>
            <li className='nav-item'>
              <a className='nav-link' href='/queue'>
                Queue
              </a>
            </li>
            <li className='nav-item'>
              <a className='nav-link' href='/community'>
                Community
              </a>
            </li>
            <li className='nav-item'>
              <a className='nav-link' href='/games'>
                Games
              </a>
            </li>
          </ul>

          <ul className='navbar-nav ms-auto'>{renderAuth()}</ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
