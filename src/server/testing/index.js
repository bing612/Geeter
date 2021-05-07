const test = (req, res) => {
  const API_URL = process.env.API_URL;

  let signup = `
    <div>
      <h2>Sign Up</h2>
      <form action='${API_URL}/signup' method='POST'>
        <div>
          <label for='email'>Email (optional): </label>
          <input type='email' id='email' name='email'>
        </div>
        <div>
          <label for='username'>Username: </label>
          <input type='text' id='username' name='username' required>
        </div>
        <div>
          <label for='password'>Password: </label>
          <input type='password' id='password' name='password' required>
        </div>
        <button type='submit'>Sign Up</button>
      </form>
    </div>
  `;

  let signin = `
    <div>
      <h2>Sign In</h2>
      <form action='${API_URL}/signin' method='POST'>
        <div>
          <label for='email'>Email (optional): </label>
          <input type='email' id='email' name='email'>
        </div>
        <div>
          <label for='username'>Username: </label>
          <input type='text' id='username' name='username' required>
        </div>
        <div>
          <label for='password'>Password: </label>
          <input type='password' id='password' name='password' required>
        </div>
        <button type='submit'>Sign In</button>
      </form>
    </div>
  `;

  let signout = `
    <div>
      <h2>Sign Out</h2>
      <form action='${API_URL}/signout' method='POST'>
        <button type='submit'>Sign Out</button>
      </form>
    </div>
  `;

  let getQueue = `
    <div>
      <h2>Get Queue</h2>
      <form action='${API_URL}/getqueue' method='POST'>
        <label>Game ID: </label>
        <input type='text' name='gameID'>
        <button type='submit'>Get Queue</button>
      </form>
    </div>
  `;

  let joinQueue = `
    <div>
      <h2>Join Queue</h2>
      <form action='${API_URL}/joinqueue' method='POST'>
        <label>Game ID: </label>
        <input type='text' name='gameID'>
        <button type='submit'>Join Queue</button>
      </form>
    </div>
  `;

  let leaveQueue = `
    <div>
      <h2>Leave Queue</h2>
      <form action='${API_URL}/leavequeue' method='POST'>
        <button type='submit'>Leave Queue</button>
      </form>
    </div>
  `;

  let postGame = `
    <div>
      <h2>Post Game</h2>
      <form action='${API_URL}/postGame' method='POST'>
        <div>
          <label for='game'>Game: </label>
          <input type='game' id='game' name='game' required>
        </div>
        <div>
          <label for='description'>Description: </label>
          <input type='description' id='description' name='description'>
        </div>
        <div>
          <label for='image'>Image (link for now): </label>
          <input id='image' name='image' required>
        </div>
        <button type='submit'>Post</button>
      </form>
    </div>
  `;

  let uploadImage = `
    <div>
      <h2>Upload Content</h2>
      <p>Pick 1 of the 3 options, only 1 would be uploaded</p>
      <form action='${API_URL}/upload' method='POST' enctype='multipart/form-data'>
        <label>Title: </label>
        <input type='text' name='title' required>
        <br />
        <label>Game ID: </label>
        <input type='text' name='gameID' required>
        <br />
        <label>Content type: </label>
        <select name="type">
          <option value="screenshot">screenshot</option>
          <option value="video">video</option>
          <option value="text">text</option>
        </select>
        <br />
        <label>Screenshot: </label>
        <input type='file' name='image'>
        </select>
        <br />
        <label>Video (youtube URL): </label>
        <input type='text' name='video'>
        <br />
        <label>Text: </label>
        <input type='text' name='text'>
        <br />
        <button type='submit'>Upload Content</button>
      </form>
    </div>
  `;

  return res.status(200).send(`
    <h1>Testing Page</h1>
    <p>Hello ${JSON.stringify(req.user)}</p>
    ${signup}
    ${signin}
    ${signout}
    ${getQueue}
    ${joinQueue}
    ${leaveQueue}
    ${postGame}
    ${uploadImage}
    <div>
      <h2>Get Games</h2>
      <form action='${API_URL}/getAllGames' method='GET'>
        <button type='submit'>Get Games</button>
      </form>
    </div>
  `);
};

module.exports = test;
