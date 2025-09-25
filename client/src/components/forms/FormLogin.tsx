import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import type { LoginFormData, LoginFormErrors } from '@/components';
import { Input, Loader } from '@/components';

interface Props {
  formData: LoginFormData;
  errors: LoginFormErrors;
  isLoading: boolean;
  handleSubmit: (e: FormEvent<Element>) => Promise<void>;
  handleInputChange: (field: keyof LoginFormData, value: string) => void;
}

export const FormLogin = ({
  formData,
  errors,
  isLoading,
  handleSubmit,
  handleInputChange,
}: Props) => {
  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {errors.general && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
          {errors.general}
        </div>
      )}

      {['email', 'password'].map((label) => (
        <Input
          label={label as keyof LoginFormData}
          key={label}
          formData={formData}
          errors={errors}
          //@ts-expect-error
          handleInputChange={handleInputChange}
        />
      ))}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white px-5 py-2.5 rounded-md hover:bg-blue-700 transition-all duration-200 text-base shadow-md font-semibold"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
            Signing in...
          </div>
        ) : (
          'Sign In'
        )}
      </button>

      <div className="text-center">
        <span className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            Create one here
          </Link>
        </span>
      </div>
    </form>
  );
};
