export { Input } from './core/Input';

export { FileList } from './dashboard/FileList';
export { FileUpload } from './dashboard/FileUpload';
export { StorageStats } from './dashboard/StorageStats';

export { FormLogin } from './forms/FormLogin';
export { FormRegister } from './forms/FormRegister';

export { Hero } from './Hero';
export { Navbar } from './Navbar';
export { Footer } from './Footer';
export { ProtectedRoute } from './ProtectedRoute';

export { GitHub } from './icons/GitHub';
export { Loader } from './icons/Loader';
export { Logo } from './icons/Logo';
export { Upload } from './icons/Upload';
export { File } from './icons/File';

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
