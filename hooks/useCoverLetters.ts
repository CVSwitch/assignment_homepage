import { useState, useEffect } from 'react';
import { coverLetterService } from '@/services/coverLetterService';

interface CoverLetter {
  id: string;
  name: string;
  lastModified: string;
  url?: string;
}

export function useCoverLetters(userId: string | undefined) {
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCoverLetters = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      console.log('Fetching cover letters...');
      const fetchedCoverLetters = await coverLetterService.getUserCoverLetters(userId);
      console.log('Fetched cover letters:', fetchedCoverLetters);
      setCoverLetters(fetchedCoverLetters);
    } catch (error) {
      console.error('Error fetching cover letters:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch cover letters');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchCoverLetters();
    }
  }, [userId]);

  const uploadCoverLetter = async (file: File) => {
    if (!userId) {
      setError('User not authenticated');
      return;
    }

    setUploadLoading(true);
    setError(null);

    try {
      // TODO: Implement actual file upload logic
      const newCoverLetter: CoverLetter = {
        id: Date.now().toString(),
        name: file.name,
        lastModified: new Date().toISOString(),
        url: URL.createObjectURL(file)
      };

      setCoverLetters(prev => [...prev, newCoverLetter]);
    } catch (err) {
      setError('Failed to upload cover letter');
      console.error('Error uploading cover letter:', err);
    } finally {
      setUploadLoading(false);
    }
  };

  return {
    coverLetters,
    isLoading,
    uploadCoverLetter,
    uploadLoading,
    error,
    refreshCoverLetters: fetchCoverLetters,
  };
} 