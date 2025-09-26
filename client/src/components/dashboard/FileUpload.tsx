import UploadButton from '@rpldy/upload-button';
import UploadDropZone from '@rpldy/upload-drop-zone';
import Uploady, {
  useItemCancelListener,
  useItemErrorListener,
  useItemFinishListener,
  useItemProgressListener,
  useItemStartListener,
} from '@rpldy/uploady';
import { useState } from 'react';
import type { FileData, FormErrors, StorageStatsData } from '@/components';
import { Upload } from '@/components';
import { handleErrors } from '@/utils/handleError';

interface Props {
  onUploadSuccess: (files: FileData[], stats: StorageStatsData) => void;
}

const UploadTracker = ({ onUploadSuccess }: Props) => {
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {},
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([]);
  const [latestStats, setLatestStats] = useState<StorageStatsData | null>(null);

  useItemStartListener((item) => {
    setUploadProgress((prev) => ({ ...prev, [item.file.name]: 0 }));
  });

  useItemProgressListener((item) => {
    const progress = Math.round(item.completed);
    setUploadProgress((prev) => ({ ...prev, [item.file.name]: progress }));
  });

  useItemFinishListener((item) => {
    try {
      const response = item.uploadResponse.data;

      if (response.success && response.files && response.files.length > 0) {
        const uploadedFile = response.files[0];

        const fileData: FileData = { ...uploadedFile };

        setUploadedFiles((prev) => [...prev, fileData]);

        if (response.storage_stats) {
          setLatestStats(response.storage_stats);
        }
      }
      setUploadProgress((prev) => ({ ...prev, [item.file.name]: 100 }));
      // @ts-expect-error
    } catch ({ status, data }) {
      handleErrors(status, setErrors, data);
    }

    setTimeout(() => {
      if (uploadedFiles.length > 0 && latestStats) {
        onUploadSuccess(uploadedFiles, latestStats);
        setUploadedFiles([]);
        setLatestStats(null);
      }
      setTimeout(() => setUploadProgress({}), 2000);
    }, 500);
  });

  useItemErrorListener((item) => {
    const errorMsg = item.uploadResponse?.data || 'Upload failed';
    setErrors((prev) => ({ ...prev, [item.file.name]: errorMsg }));
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[item.file.name];
      return newProgress;
    });
  });

  useItemCancelListener((item) => {
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[item.file.name];
      return newProgress;
    });
  });

  return (
    <div>
      {Object.keys(uploadProgress).length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-medium text-gray-900">
            Upload Progress:
          </h3>
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <div key={fileName} className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-700 truncate flex-1 mr-4">
                  {fileName}
                </span>
                <span className="text-gray-500">{progress}%</span>
              </div>
              <div className="mt-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {errors.general && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mt-3">
          {errors.general}
        </div>
      )}

      {Object.keys(errors).filter((key) => key !== 'general').length > 0 && (
        <div className="mt-3 space-y-2">
          <h3 className="text-sm font-medium text-red-900">Upload Errors:</h3>
          {Object.entries(errors)
            .filter(([key]) => key !== 'general')
            .map(([fileName, error]) => (
              <div
                key={fileName}
                className="bg-red-50 border border-red-300 text-red-700 px-3 py-2 rounded text-sm"
              >
                <strong>{fileName}:</strong> {error}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export const FileUpload = ({ onUploadSuccess }: Props) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p className="text-red-600">
          Authentication required. Please log in again.
        </p>
      </div>
    );
  }

  const uploadyProps = {
    destination: {
      url: '/api/v1/files/upload',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    multiple: true,
    accept: '*',
    maxFileSize: 10 * 1024 * 1024, // 10MB
    autoUpload: true,
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Files</h2>

      <Uploady {...uploadyProps}>
        <UploadDropZone
          onDragOverClassName="border-blue-500 bg-blue-50"
          className="border-2 border-dashed rounded-lg p-8 text-center transition-colors border-gray-300 hover:border-gray-400"
        >
          <div className="space-y-4">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <Upload className="h-12 w-12" />
            </div>

            <div>
              <p className="text-lg font-medium text-gray-900">
                Upload your files
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Drag and drop files here, or{' '}
                <UploadButton className="text-blue-600 hover:text-blue-800 font-medium bg-transparent border-none cursor-pointer p-0">
                  browse
                </UploadButton>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Maximum file size: 10MB
              </p>
            </div>
          </div>
        </UploadDropZone>

        <UploadTracker onUploadSuccess={onUploadSuccess} />
      </Uploady>
    </div>
  );
};
