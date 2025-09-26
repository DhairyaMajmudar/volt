export { Input } from './core/Input';

export { FileList } from './dashboard/FileList';
export { FileUpload } from './dashboard/FileUpload';
export { StorageStats } from './dashboard/StorageStats';
export { Footer } from './Footer';
export { FormLogin } from './forms/FormLogin';
export { FormRegister } from './forms/FormRegister';
export { Hero } from './Hero';
export { Delete } from './icons/Delete';
export { File } from './icons/File';
export { GitHub } from './icons/GitHub';
export { Loader } from './icons/Loader';
export { Logo } from './icons/Logo';
export { Upload } from './icons/Upload';
export { Navbar } from './Navbar';
export { ProtectedRoute } from './ProtectedRoute';

export interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  general?: string;
}

export interface FormData {
  username?: string;
  email: string;
  password: string;
}

export type LoginFormErrors = Omit<FormErrors, 'username'>;
export type LoginFormData = Omit<FormData, 'username'>;

export interface FileData {
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

export interface StorageStatsData {
  user_id: number;
  total_files: number;
  total_storage_used: number;
  duplicate_files: number;
}
