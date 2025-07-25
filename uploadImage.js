import 'dotenv/config'
import {v2 as cloudinary} from 'cloudinary'

cloudinary.config({
    secure: true, 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// const opts = {
//     resource_type: 'auto', 
//     use_filename: true,
//     overwrite: true
// }

export default function uploadImage (image) { // this is base64 format
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(image, {
            resource_type: 'auto', 
            use_filename: true,
            overwrite: true
        }, (error, result) => {
            if (result && result.secure_url) {
                console.log("This is from uploadImage.js", result.secure_url)
                return resolve(result.secure_url)
            } 
            console.log("Error from uploadImage.js", error.message)
            return reject({message: error.message})
        })
    })
}
