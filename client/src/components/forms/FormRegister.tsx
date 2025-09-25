import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Input, Loader } from '@/components';
import type { FormData, FormErrors } from '@/utils/validateForm';

interface Props {
  formData: FormData;
  errors: FormErrors;
  isLoading: boolean;
  handleSubmit: (e: FormEvent<Element>) => Promise<void>;
  handleInputChange: (field: keyof FormData, value: string) => void;
}

export const FormRegister = ({
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

      {['username', 'email', 'password'].map((label) => (
        <Input
          label={label as keyof FormData}
          key={label}
          formData={formData}
          errors={errors}
          handleInputChange={handleInputChange}
        />
      ))}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white px-5 py-2.5 rounded-md hover:bg-blue-700 transition-all duration-200 text-base shadow-md font-semibold"
      >
        {isLoading ? (
          <div className="flex items-center">
            <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
            Creating account...
          </div>
        ) : (
          'Create Account'
        )}
      </button>

      <div className="text-center">
        <span className="text-sm text-gray-600">
          Already have an account?
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            Sign in here
          </Link>
        </span>
      </div>
    </form>
  );
};
