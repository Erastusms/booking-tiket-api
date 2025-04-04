import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const saltRounds = parseInt(process.env.SALT_ROUNDS || '10');

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};
