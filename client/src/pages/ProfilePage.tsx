import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FormErrors, StorageStatsData } from '@/components';
import { Navbar } from '@/components';
import { formatDate } from '@/utils/formatDate';
import { formatFileSize } from '@/utils/formatFileSize';
import { handleErrors } from '@/utils/handleError';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
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

    fetchProfile();
    fetchStorageStats();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const { status, data } = await axios.get('/api/v1/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (status === 200) {
        setProfile(data);
      }
      // @ts-expect-error
    } catch ({ status, data }) {
      handleErrors(status, setErrors, data);
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
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 md:mt-4 text-sm md:text-base text-gray-600">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {errors.general && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-3 py-2.5 md:px-4 md:py-3 rounded-lg mb-4 md:mb-6 text-sm md:text-base">
            {errors.general}
          </div>
        )}

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {profile && (
            <div className="px-4 py-4 md:px-6 md:py-6">
              <div className="flex items-center space-x-3 md:space-x-4 mb-4 md:mb-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-lg md:text-2xl font-bold text-blue-600">
                    {profile.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                    {profile.username}
                  </h2>
                  <p className="text-sm md:text-base text-gray-600">
                    {profile.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-3 md:space-y-4">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900">
                    Account Information
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <span className="block text-xs md:text-sm font-medium text-gray-700">
                        Username
                      </span>
                      <div className="mt-1 p-2.5 md:p-3 bg-gray-50 border border-gray-200 rounded-md text-sm md:text-base">
                        {profile.username}
                      </div>
                    </div>

                    <div>
                      <span className="block text-xs md:text-sm font-medium text-gray-700">
                        Email
                      </span>
                      <div className="mt-1 p-2.5 md:p-3 bg-gray-50 border border-gray-200 rounded-md text-sm md:text-base">
                        {profile.email}
                      </div>
                    </div>

                    <div>
                      <span className="block text-xs md:text-sm font-medium text-gray-700">
                        Member Since
                      </span>
                      <div className="mt-1 p-2.5 md:p-3 bg-gray-50 border border-gray-200 rounded-md text-sm md:text-base">
                        {formatDate(profile.created_at)}
                      </div>
                    </div>
                  </div>
                </div>

                {storageStats && (
                  <div className="space-y-3 md:space-y-4">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900">
                      Storage Statistics
                    </h3>

                    <div className="space-y-3">
                      <div className="p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-md">
                        <div className="flex items-center justify-between">
                          <span className="text-xs md:text-sm font-medium text-blue-900">
                            Total Files
                          </span>
                          <span className="text-base md:text-lg font-bold text-blue-600">
                            {storageStats.total_files.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 md:p-4 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex items-center justify-between">
                          <span className="text-xs md:text-sm font-medium text-green-900">
                            Storage Used
                          </span>
                          <span className="text-base md:text-lg font-bold text-green-600">
                            {formatFileSize(storageStats.total_storage_used)}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 md:p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                        <div className="flex items-center justify-between">
                          <span className="text-xs md:text-sm font-medium text-yellow-900">
                            Duplicates
                          </span>
                          <span className="text-base md:text-lg font-bold text-yellow-600">
                            {storageStats.duplicate_files}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
