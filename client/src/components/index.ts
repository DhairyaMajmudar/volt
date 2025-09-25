export { Input } from './core/Input';
export { Footer } from './Footer';
export { FormLogin } from './forms/FormLogin';
export { FormRegister } from './forms/FormRegister';
export { Hero } from './Hero';
export { GitHub } from './icons/GitHub';
export { Loader } from './icons/Loader';
export { Logo } from './icons/Logo';
export { Navbar } from './Navbar';

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
