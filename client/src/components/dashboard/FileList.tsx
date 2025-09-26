import { format } from 'date-fns';
import { useState } from 'react';
import { File, Loader, Delete } from '@/components';
import { formatFileSize } from '@/utils/formatFileSize';

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

interface Props {
  files: FileData[];
  onDeleteFile: (fileId: number) => void;
  loading: boolean;
}

export const FileList = ({ files, onDeleteFile, loading }: Props) => {
  const [deletingFiles, setDeletingFiles] = useState<Set<number>>(new Set());

  const handleDelete = async (fileId: number) => {
    setDeletingFiles((prev) => new Set(prev.add(fileId)));
    try {
      await onDeleteFile(fileId);
    } finally {
      setDeletingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <Loader className="animate-spin h-8 w-8 text-blue-600" />
          <span className="ml-3 text-gray-600">Loading files...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Your Files</h2>
        <span className="text-sm text-gray-500">
          {files.length} file{files.length !== 1 ? 's' : ''}
        </span>
      </div>

      {files.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4 justify-center flex">
            <File className="text-gray-400 size-10" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No files yet
          </h3>
          <p className="text-gray-600">
            Upload your first file to get started!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="text-2xl">
                  <File />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {file.display_name}
                  </h3>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                    <span>{file.file.mime_type}</span>
                    <span>{formatFileSize(file.file.size)}</span>
                    <span>
                      {format(new Date(file.created_at), 'MMM d, yyyy')}
                    </span>
                    {file.is_duplicate && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                        Duplicate
                      </span>
                    )}
                    {file.is_private && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        Private
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleDelete(file.id)}
                  disabled={deletingFiles.has(file.id)}
                  className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Delete file"
                >
                  {deletingFiles.has(file.id) ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <Delete className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
