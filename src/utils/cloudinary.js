// Cloudinary Upload Utility
// Cloudinary bağlantı bilgileriniz

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dshbqbtpb/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "hastatakip";

/**
 * Uploads an image file to Cloudinary and returns the secure URL
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} - The secure URL of the uploaded image
 */
export const uploadImageToCloudinary = async (file) => {
  if (!file) return null;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error("Resim yükleme hatası");
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};
