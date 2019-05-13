const users = [];

const addUser = ({ id, username, room }) => {
  //Clean the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  //Validate data
  if (!username || !room) {
    return {
      error: "Username and room are required!"
    };
  }

  const existingUser = users.find(user => {
    return user.room === room && user.username === username;
  });

  if (existingUser) {
    return {
      error: "Username is in use!"
    };
  }

  const user = { id, username, room };
  users.push(user);
};

const removeUser = id => {
  const idx = users.findIndex(user => users.id === id);
  if (index !== -1) {
    return users.splice(idx, 1)[0];
  }
};

const getUser = id => {
  return users.find(user => user.id === id);
};

const getUsersInRoom = room => {
  room = room.trim().toLowerCase();
  return users.filter(user => user.room === room);
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
}
