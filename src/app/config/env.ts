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
  BCRYPT_SALT_ROUND: string;

  //frontend url
  FRONT_END_URL: string;

  //db url
  DB_URL: string;
  PORT: string;

  //express session
  EXPRESS_SESSION_SECRET: string;

  //#cloudinary
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;

  //#admin
  ADMIN_EMAIL: string;
  ADMIN_PASS: string;

  //ssl commerz info
  SSL_STORE_ID: string;
  SSL_STORE_PASS: string;
  SSL_PAYMENT_API: string;
  SSL_VALIDATION_API: string;

  SSL_SUCCESS_BACKEND_URL: string;
  SSL_FAIL_BACKEND_URL: string;
  SSL_CANCEL_BACKEND_URL: string;
  SSL_SUCCESS_FRONTEND_URL: string;
  SSL_FAIL_FRONTEND_URL: string;
  SSL_CANCEL_FRONTEND_URL: string;
  SSL_IPN_URL: string;
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
  EXPRESS_SESSION_SECRET: getEnv("EXPRESS_SESSION_SECRET"),
  CLOUDINARY_API_KEY: getEnv("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: getEnv("CLOUDINARY_API_SECRET"),
  CLOUDINARY_CLOUD_NAME: getEnv("CLOUDINARY_CLOUD_NAME"),
  ADMIN_EMAIL: getEnv("ADMIN_EMAIL"),
  ADMIN_PASS: getEnv("ADMIN_PASS"),

  //sslcommerz
  SSL_STORE_ID: getEnv("SSL_STORE_ID"),
  SSL_STORE_PASS: getEnv("SSL_STORE_PASS"),
  SSL_PAYMENT_API: getEnv("SSL_PAYMENT_API"),
  SSL_VALIDATION_API: getEnv("SSL_VALIDATION_API"),
  SSL_SUCCESS_BACKEND_URL: getEnv("SSL_SUCCESS_BACKEND_URL"),
  SSL_FAIL_BACKEND_URL: getEnv("SSL_FAIL_BACKEND_URL"),
  SSL_CANCEL_BACKEND_URL: getEnv("SSL_CANCEL_BACKEND_URL"),
  SSL_SUCCESS_FRONTEND_URL: getEnv("SSL_SUCCESS_FRONTEND_URL"),
  SSL_FAIL_FRONTEND_URL: getEnv("SSL_FAIL_FRONTEND_URL"),
  SSL_CANCEL_FRONTEND_URL: getEnv("SSL_CANCEL_FRONTEND_URL"),
  SSL_IPN_URL: getEnv("SSL_IPN_URL"),
};
