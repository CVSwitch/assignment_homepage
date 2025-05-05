interface LinkedInProfile {
  id: string;
  userId: string;
  // Add other LinkedIn profile fields as needed
}

class LinkedInService {
  async getProfiles(userId: string): Promise<LinkedInProfile[]> {
    try {
      const response = await fetch(`/api/linkedin/profiles?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch profiles');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching LinkedIn profiles:', error);
      throw error;
    }
  }

  async uploadProfile(file: File, userId: string): Promise<LinkedInProfile> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);

      const response = await fetch('/api/linkedin/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload profile');
      }

      return response.json();
    } catch (error) {
      console.error('Error uploading LinkedIn profile:', error);
      throw error;
    }
  }
}

export const linkedInService = new LinkedInService();
