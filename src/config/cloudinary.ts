import { v2 as cloudinary } from 'cloudinary';

const getRequiredEnvironmentVariable = (name: string) => {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} non définie`);
  }

  return value;
};

export const configureCloudinary = () => {
  const cloudName = getRequiredEnvironmentVariable('CLOUDINARY_CLOUD_NAME');
  const apiKey = getRequiredEnvironmentVariable('CLOUDINARY_API_KEY');
  const apiSecret = getRequiredEnvironmentVariable('CLOUDINARY_API_SECRET');

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return {
    cloudinary,
    cloudName,
    apiKey,
    apiSecret,
  };
};
