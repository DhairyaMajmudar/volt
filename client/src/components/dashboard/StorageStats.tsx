import type { StorageStatsData } from '@/components';
import { formatFileSize } from '@/utils/formatFileSize';

interface Props {
  stats: StorageStatsData;
}

export const StorageStats = ({ stats }: Props) => {
  const totalSizeFormatted = formatFileSize(stats.total_storage_used);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
        Storage Overview
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 md:gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-md p-3 md:p-4">
          <div className="text-xl md:text-2xl font-bold text-blue-700">
            {stats.total_files}
          </div>
          <div className="text-xs md:text-sm text-blue-600 font-medium">
            Total Files
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-md p-3 md:p-4">
          <div className="text-xl md:text-2xl font-bold text-green-700">
            {totalSizeFormatted}
          </div>
          <div className="text-xs md:text-sm text-green-600 font-medium">
            Storage Used
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-md p-3 md:p-4 sm:col-span-2 lg:col-span-1 xl:col-span-2">
          <div className="text-xl md:text-2xl font-bold text-purple-700">
            {stats.duplicate_files}
          </div>
          <div className="text-xs md:text-sm text-purple-600 font-medium">
            Duplicates
          </div>
        </div>
      </div>
    </div>
  );
};
