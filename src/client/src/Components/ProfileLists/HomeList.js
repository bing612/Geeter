import React from 'react';
import GameList from './GameList';
import MediaList from './MediaList';

const HomeList = () => {
  return (
    <div>
      <h2 className='text-decoration-underline'>Games</h2>
      <GameList />
      <h2 className='text-decoration-underline'>Media</h2>
      <MediaList />
    </div>
  );
};

export default HomeList;
