import type { Resume } from '@/types/resume';
import { pdfParserService } from './pdfParserService';
import { API_CONFIG } from '@/config/api';


interface UploadedResume {
  cloud_path: string;
  public_url: string;
  resume_id?: string;
  id?: string;
  file_name?: string;
  resume_url?: string;
}


// interface UserDataResponse {
//   data: {
//     uploaded_resume: Array<{
//       cloud_path: string;
//       public_url: string;
//       resume_id?: string;
//     }>;
//     parsed_resume_json: Array<{
//       cloud_path: string;
//       public_url: string;
//     }>;
//   };
//   message: string;
//   mode: string;
//   status: number;
// }

interface UserDataResponse {
  data: {
    uploaded_resume: UploadedResume[];
    parsed_resume_json: Array<{
      cloud_path: string;
      public_url: string;
    }>;
  };
  message: string;
  mode: string;
  status: number;
}

interface ResumeAnalysis {
  Areas_of_Improvment: string[];
  strengths: string[];
}

export const resumeService = {
  async getUserResumes(userId: string): Promise<Resume[]> {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FETCH_USER_DATA}?user_id=${userId}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch resumes: ${response.status}`);
      }

      const data = await response.json() as UserDataResponse;

      if (data.data && Array.isArray(data.data.uploaded_resume)) {
        const parsedJsonMap = new Map();
        if (data.data.parsed_resume_json) {
          data.data.parsed_resume_json.forEach(json => {
            const cloudPath = json.cloud_path || '';
            const baseName = cloudPath.split('/').pop()?.split('.')[0] || '';
            parsedJsonMap.set(baseName, json.public_url);
          });
        }

        return data.data.uploaded_resume.map((resume, index) => {
          const cloudPath = resume.cloud_path || '';
          const fileName = resume.file_name ||
            cloudPath.split('/').pop() ||
            `Resume ${index + 1}`;

          const timestamp = cloudPath.split('/').pop()?.split('.')[0] || '';
          const jsonUrl = parsedJsonMap.get(timestamp) || null;

          return {
            id: resume.id || resume.resume_id || '', // Fallback to empty string if both are undefined
            name: fileName,
            lastModified: new Date().toISOString().split('T')[0],
            url: resume.resume_url || resume.public_url, // Fallback to public_url
            cloudPath: resume.cloud_path,
            jsonUrl,
            parsingStatus: jsonUrl ? "completed" : undefined
          };
        });
      }

      return [];
    } catch (error) {
      console.error('Error in getUserResumes:', error);
      throw error;
    }
  },

  async uploadResume(userId: string, file: File): Promise<Resume> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UPLOAD_RESUME}?user_id=${userId}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to upload resume: ${response.status}`);
      }

      const result = await response.json();
      // const newResume = {
      //   id: Date.now().toString(),
      //   name: result.data.file_name,
      //   lastModified: new Date().toISOString().split('T')[0],
      //   url: result.data.public_url,
      //   cloudPath: result.data.cloud_file_path,
      //   parsingStatus: "parsing" as const
      // };

      // Call PDF to parsed JSON with a 2-second delay
      // setTimeout(async () => {
      //   await pdfParserService.convertPdfToJson(userId, newResume.cloudPath || '');
      // }, 2000);

      return result;
    } catch (error) {
      console.error('Error in uploadResume:', error);
      throw error;
    }
  },

  async getLinkedInSuggestions(
    userId: string,
    resumeId: string,
    jobDescription?: string
  ): Promise<any> {
    try {
      let url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LINKEDIN_SUGGESTIONS}?user_id=${userId}&resume_id=${resumeId}`;

      if (jobDescription) {
        url += `&job_description=${encodeURIComponent(jobDescription)}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch LinkedIn suggestions: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error in getLinkedInSuggestions:', error);
      throw error;
    }
  },

  async analyzeResume(userId: string, jsonUrl: string): Promise<ResumeAnalysis> {
    try {
      const urlParts = jsonUrl.split('cvswitch-54227.appspot.com/');
      const fullPath = urlParts[1];

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ANALYZE_RESUME}?user_id=${userId}&cloud_file_path=${encodeURIComponent(fullPath)}`
      );

      const analyzeResult = await response.json();
      console.log('Analyze API Response:', analyzeResult);

      if (!analyzeResult.data || !analyzeResult.data.cloud_file_path) {
        throw new Error('No analysis file path received');
      }

      // Second API call to fetch the actual analysis JSON
      const fetchAnalysisResponse = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FETCH_ANALYZED_JSON}?user_id=${userId}&cloud_file_path=${encodeURIComponent(analyzeResult.data.cloud_file_path)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const fetchResult = await fetchAnalysisResponse.json();
      console.log('Fetch Analysis API Response:', fetchResult);

      if (!fetchResult.data) {
        throw new Error('No analysis data received');
      }

      // Return the analysis data
      const analysisData = {
        Areas_of_Improvment: fetchResult.data.Areas_of_Improvment || [],
        strengths: fetchResult.data.strengths || []
      };
      console.log('Final Analysis Data:', analysisData);

      return analysisData;
    } catch (error) {
      console.error('Error in analyzeResume:', error);
      throw error;
    }
  },
};