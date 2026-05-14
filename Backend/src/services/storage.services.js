const ImageKit = require("@imagekit/nodejs");

const imageKitClient = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadFile(file) {
  try {
    const result = await imageKitClient.files.upload({
      file,
      fileName: `moodify_${Date.now()}.mp3`,
      folder: "/moodify/songs",
    });

    return result;

  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = { uploadFile };
