import bcrypt from 'bcrypt';

export const hashPassword = async (plain) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
};

export const comparePasswords = (plain, hash) => bcrypt.compare(plain, hash);
