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

export const validateForm = (
  formData: FormData,
  setErrors: (errors: FormErrors) => void,
): boolean => {
  const newErrors: FormErrors = {};

  if (!formData.username) {
    newErrors.username = 'Username is required';
  } else if (formData.username.length < 3) {
    newErrors.username = 'Username must be at least 3 characters long';
  } else if (formData.username.length > 50) {
    newErrors.username = 'Username must be less than 50 characters';
  }

  if (!formData.email) {
    newErrors.email = 'Email is required';
  } else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(formData.email)) {
    newErrors.email = 'Please enter a valid email address';
  }

  if (!formData.password) {
    newErrors.password = 'Password is required';
  } else if (formData.password.length < 6) {
    newErrors.password = 'Password must be at least 6 characters long';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
