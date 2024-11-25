const axios = require('axios');

const GITHUB_OWNER = 'sunilvurandur';
const GITHUB_REPO = 'restaurant_finder_202';
const GITHUB_TOKEN = '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';

async function uploadToGitHub(fileBuffer, fileName) {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/photos/${fileName}`;
  const content = fileBuffer.toString('base64'); // Convert file buffer to Base64

  try {
    const response = await axios.put(
      url,
      {
        message: `Upload photo ${fileName}`,
        content,
      },
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.content.download_url; // Return the GitHub URL of the uploaded file
  } catch (error) {
    console.error('Error uploading to GitHub:', error.response?.data || error.message);
    throw new Error('Failed to upload file to GitHub');
  }
}

module.exports = uploadToGitHub;
