/**
 * @fileoverview This file contains the configuration for the application.
 * @package RaniFashions-BackEnd
 */
import dotenv from "dotenv";

dotenv.config();

/**
 * Configuration for the application
 */
const CONFIG = {
  HOST: process.env.HOST || "http://localhost:5001",
  PORT: process.env.PORT || 5001,
  PRODUCTION: process.env.NODE_ENV === "production",
  // CLIENT_URL: process.env.CLIENT_URL || "https://chicandholland.com",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  // DB_SYNC: true,
  DB_URL:
    // process.env.DB_URL || "mysql://root:root@192.168.1.200:3306/chickholland",
    process.env.DB_URL ||
    "mysql://root:root@192.168.1.200:3307/krishna_chicandholland",
  DB_POOL_SIZE: 10,
  JWT_SECRET: process.env.JWT_SECRET || "krishna_chicandholland",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
  JWT_ISSUER: process.env.JWT_ISSUER || "krishna_chicandholland",
  SALT_ROUNDS: process.env.SALT_ROUNDS || 10, // the more the salt rounds the more the time it takes to hash the password
  // Product Specific Configuration
  MAX_PRODUCT_IMAGE_LIMIT: process.env.MAX_PRODUCT_IMAGE_LIMIT || 3,
  SMTP_URL:
    process.env.SMTP_URL ||
    "smtp://info@chicandholland.com:yktwlbuwklsawauv@smtp.gmail.com:587",
  S3_BUCKET: process.env.S3_BUCKET || "ymts",
  S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID || "DO00WAZPKYEYV9U7DPVN",
  S3_SECRET_ACCESS_KEY:
    process.env.S3_SECRET_ACCESS_KEY ||
    "IMMU+pwgaDEJlOAngCE2W9VybFVqdxl+4CUSdP+yiDw",
  S3_REGION: process.env.S3_REGION || "blr1",
  S3_AWS_ENDPOINT: process.env.S3_AWS_ENDPOINT || "blr1.digitaloceanspaces.com",
  QB_CLIENT_ID:
    process.env.QB_CLIENT_ID ||
    "ABXhaf7ileiFSoPqrwEfaLZRAmmvPd0PsbOlbXM0edUB22BcFH",
  QB_CLIENT_SECRET:
    process.env.QB_CLIENT_SECRET || "u4jptL93HiIavNE0PCEfj8i4ZoVNTZpOnnMc5LY5",
  GOOGLE_MAPS_API_KEY:
    process.env.GOOGLE_MAPS_API_KEY ||
    "AIzaSyCm6BCGEB30k2P5xAPys5KU1dfuJT9H6V4",
  ENCRYPTION_KEY:
    process.env.ENCRYPTION_KEY ||
    "493743431badcfbe49f4d416e587b22110809dd549e86e7bc23033f08f6a08db",
  IV_LENGTH: parseInt(process.env.IV_LENGTH as string) || 16,
  ALGORITHM: process.env.ALGORITHM || "aes-256-cbc",
  IV: process.env.IV || "3f33edfaacd8d7edd8f27bfccbe40447",
};

export default CONFIG;
