import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileList,
  FileUpload,
  StorageStats,
  Navbar,
  Footer,
} from '@/components';

interface User {
  id: number;
  username: string;
  email: string;
}

interface FileData {
  id: number;
  user_id: number;
  file_id: number;
  display_name: string;
  is_duplicate: boolean;
  is_private: boolean;
  created_at: string;
  updated_at: string;
  file: {
    id: number;
    hash: string;
    original_name: string;
    mime_type: string;
    size: number;
    storage_path: string;
    reference_count: number;
    created_at: string;
  };
}

interface StorageStatsData {
  user_id: number;
  total_files: number;
  total_size: number;
  total_duplicates: number;
  storage_by_file_type: Record<string, number>;
}

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileData[]>([]);
  const [storageStats, setStorageStats] = useState<StorageStatsData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch {
      navigate('/login');
      return;
    }

    fetchFiles();
    fetchStorageStats();
  }, [navigate]);

  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('/api/v1/files', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setFiles(response.data || []);
    } catch (error) {
      console.error('Failed to fetch files:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStorageStats = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get('/api/v1/users/storage-stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStorageStats(response.data);
    } catch (error) {
      console.error('Failed to fetch storage stats:', error);
    }
  };

  const handleFileUpload = (
    uploadedFiles: FileData[],
    newStats: StorageStatsData,
  ) => {
    setFiles((prevFiles) => [...uploadedFiles, ...prevFiles]);
    setStorageStats(newStats);
  };

  const handleFileDelete = async (fileId: number) => {
    try {
      const token = localStorage.getItem('token');

      await axios.delete(`/api/v1/files/${fileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
      fetchStorageStats();
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <FileList
            files={files}
            onDeleteFile={handleFileDelete}
            loading={loading}
          />
          <FileUpload onUploadSuccess={handleFileUpload} />
          {storageStats && <StorageStats stats={storageStats} />}
        </div>
      </main>
      <Footer />
    </div>
  );
};
