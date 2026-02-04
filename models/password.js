import bcryptjs from "bcryptjs";

async function hash(password) {
  const salts = getNumberOfRounds();

  return await bcryptjs.hash(password, salts);
}

function getNumberOfRounds() {
  return process.env.NODE_ENV === "production" ? 14 : 1;
}

async function compare(providedPassword, storedPassword) {
  return bcryptjs.compare(providedPassword, storedPassword);
}

const password = {
  hash,
  compare,
};

export default password;
