interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  [key: string]: unknown;
}

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary configuration is missing. Please check your environment variables.');
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Please select a valid image file.');
  }

  // Validate file size (5MB limit)
  const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSizeInBytes) {
    throw new Error('Image file size must be less than 5MB.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  debugger
  try {
    console.log('🚀 Uploading image to Cloudinary...');
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Cloudinary upload failed: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data: CloudinaryResponse = await response.json();
    console.log('✅ Image uploaded successfully:', data.secure_url);
    
    return data.secure_url;
  } catch (error) {
    console.error('❌ Error uploading image to Cloudinary:', error);
    throw new Error(
      error instanceof Error 
        ? `Image upload failed: ${error.message}` 
        : 'Image upload failed: Unknown error'
    );
  }
};