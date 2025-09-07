import { removeBackground, loadImage, downloadImageAsBlob } from './backgroundRemoval';

export const processLogoToTransparent = async (): Promise<string> => {
  try {
    console.log('Starting logo processing...');
    
    // Download the current logo image
    const imageBlob = await downloadImageAsBlob('/lovable-uploads/bf2b2868-d68a-4c38-9824-dfd4ab14394e.png');
    console.log('Downloaded logo image');
    
    // Load the image
    const imageElement = await loadImage(imageBlob);
    console.log('Loaded image element');
    
    // Remove background
    const transparentBlob = await removeBackground(imageElement);
    console.log('Background removed successfully');
    
    // Create object URL for the transparent image
    const transparentUrl = URL.createObjectURL(transparentBlob);
    console.log('Created transparent image URL');
    
    return transparentUrl;
  } catch (error) {
    console.error('Error processing logo:', error);
    throw error;
  }
};