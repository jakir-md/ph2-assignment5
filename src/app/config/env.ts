import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
  //jwt
  JWT_ACCESS_TOKEN_SECRET: string;
  JWT_REFRESH_TOKEN_SECRET: string;
  JWT_ACCESS_TOKEN_EXPIRES: string;
  JWT_REFRESH_TOKEN_EXPIRES: string;

  //node env
  NODE_ENV: string;

  //BCRYPT
  BCRYPT_SALT_ROUND:string;

  //frontend url
  FRONT_END_URL: string;

  //db url
  DB_URL:string;
  PORT: string;

  //express session
  EXPRESS_SESSION_SECRET:string;
}

function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env ${key}`);
  return value;
}

export const EnvVars: EnvConfig = {
  JWT_ACCESS_TOKEN_SECRET: getEnv("JWT_ACCESS_TOKEN_SECRET"),
  JWT_REFRESH_TOKEN_SECRET: getEnv("JWT_REFRESH_TOKEN_SECRET"),
  JWT_ACCESS_TOKEN_EXPIRES: getEnv("JWT_ACCESS_TOKEN_EXPIRES"),
  JWT_REFRESH_TOKEN_EXPIRES: getEnv("JWT_REFRESH_TOKEN_EXPIRES"),
  NODE_ENV: getEnv("NODE_ENV"),
  BCRYPT_SALT_ROUND: getEnv("BCRYPT_SALT_ROUND"),
  FRONT_END_URL: getEnv("FRONT_END_URL"),
  DB_URL: getEnv("DB_URL"),
  PORT: getEnv("PORT"),
  EXPRESS_SESSION_SECRET: getEnv("EXPRESS_SESSION_SECRET")
};
