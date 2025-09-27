import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FileData, FormErrors, StorageStatsData } from '@/components';
import {
  FileList,
  FileUpload,
  Footer,
  Navbar,
  StorageStats,
} from '@/components';
import { handleErrors } from '@/utils/handleError';

interface User {
  id: number;
  username: string;
  email: string;
}

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileData[]>([]);
  const [storageStats, setStorageStats] = useState<StorageStatsData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    fetchFiles();
    fetchStorageStats();
  }, [navigate]);

  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (!token || !userData) {
        navigate('/login');
        return;
      }

      const userId: User['id'] = JSON.parse(userData).id;

      const { status, data } = await axios.get(`/api/v1/files/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (status === 200) {
        setFiles(Array.isArray(data) ? data : []);
      }
      // @ts-expect-error
    } catch ({ status, data }) {
      handleErrors(status, setErrors, data);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStorageStats = async () => {
    try {
      const token = localStorage.getItem('token');

      const { status, data } = await axios.get(`/api/v1/users/storage-stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (status === 200) setStorageStats(data);

      // @ts-expect-error
    } catch ({ status, data }) {
      handleErrors(status, setErrors, data);
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
      // @ts-expect-error
    } catch ({ status, data }) {
      handleErrors(status, setErrors, data);
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6 md:space-y-8">
        {errors.general && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
            {errors.general}
          </div>
        )}

        <div className="space-y-6 md:space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2">
              <FileUpload onUploadSuccess={handleFileUpload} />
            </div>

            <div className="lg:col-span-1">
              {storageStats && <StorageStats stats={storageStats} />}
            </div>
          </div>

          <div className="w-full">
            <FileList
              files={files}
              onDeleteFile={handleFileDelete}
              loading={loading}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
