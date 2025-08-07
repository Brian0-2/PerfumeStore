import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLAUDINARY_SERVER_NAME,
    api_key: process.env.CLAUDINARY_API_KEY,
    api_secret: process.env.CLAUDINARY_API_SECRET,
    secure: true
});

export const uploadImage = async (filePath: string) => {
    return await cloudinary.uploader.upload(filePath, {
        folder: 'perfumes'
    });
}

export const deleteImage = async (publicId: string) => {
    return await cloudinary.uploader.destroy(publicId)
}