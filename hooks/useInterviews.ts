import { useState } from 'react';

interface Interview {
  id: string;
  name: string;
  lastModified: string;
  url?: string;
}

export function useInterviews(userId?: string) {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadInterview = async (file: File) => {
    if (!userId) {
      setError('User not authenticated');
      return;
    }

    setUploadLoading(true);
    setError(null);

    try {
      // TODO: Implement actual file upload logic
      const newInterview: Interview = {
        id: Date.now().toString(),
        name: file.name,
        lastModified: new Date().toISOString(),
        url: URL.createObjectURL(file)
      };

      setInterviews(prev => [...prev, newInterview]);
    } catch (err) {
      setError('Failed to upload interview');
      console.error('Error uploading interview:', err);
    } finally {
      setUploadLoading(false);
    }
  };

  return {
    interviews,
    isLoading,
    uploadInterview,
    uploadLoading,
    error
  };
} 