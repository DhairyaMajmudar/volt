import axios from 'axios';
import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormRegister, Logo } from '@/components';
import type { FormData, FormErrors } from '@/utils/validateForm';
import { validateForm } from '@/utils/validateForm';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const isValid = validateForm(formData, setErrors);

    if (!isValid) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const { data, status } = await axios('/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (status === 200) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard'); // You'll create this later
      } else {
        setErrors({
          general: data.message || 'Registration failed. Please try again.',
        });
      }
    } catch (err) {
      console.error(err);
      setErrors({
        general: 'Network error. Please check your connection and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-md w-full space-y-8">
        <Link
          to={'/'}
          className="flex items-center flex-row justify-center space-x-2 mb-8"
        >
          <span className="text-gray-900 text-2xl font-bold">
            <Logo />
          </span>
          <span className="text-2xl font-bold text-gray-900">Volt</span>
        </Link>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create your account
          </h2>
          <p className="text-gray-600">
            Join thousands of users managing their files with Volt
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/20 p-8">
          <FormRegister
            formData={formData}
            errors={errors}
            isLoading={isLoading}
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
};
