import { formatFileSize } from '@/utils/formatFileSize';
import type { StorageStatsData } from '@/components';

interface Props {
  stats: StorageStatsData;
}

export const StorageStats = ({ stats }: Props) => {
  const totalSizeFormatted = formatFileSize(stats.total_files);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Storage Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-md p-4">
          <div className="text-2xl font-bold text-blue-700">
            {stats.total_files}
          </div>
          <div className="text-sm text-blue-600 font-medium">Total Files</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-md p-4">
          <div className="text-2xl font-bold text-green-700">
            {totalSizeFormatted}
          </div>
          <div className="text-sm text-green-600 font-medium">Storage Used</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-md p-4">
          <div className="text-2xl font-bold text-purple-700">
            {stats.total_duplicates}
          </div>
          <div className="text-sm text-purple-600 font-medium">Duplicates</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-md p-4">
          <div className="text-2xl font-bold text-orange-700">
            {Object.keys(stats.storage_by_file_type).length}
          </div>
          <div className="text-sm text-orange-600 font-medium">File Types</div>
        </div>
      </div>
    </div>
  );
};
