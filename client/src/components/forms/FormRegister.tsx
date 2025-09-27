import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import type { FormData, FormErrors } from '@/components';
import { Input, Loader } from '@/components';

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
    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
      {errors.general && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-3 py-2.5 md:px-4 md:py-3 rounded-lg text-sm md:text-base">
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
        className="w-full bg-blue-600 text-white px-4 py-3 md:px-5 md:py-2.5 rounded-md hover:bg-blue-700 transition-all duration-200 text-sm md:text-base shadow-md font-semibold min-h-[44px] touch-manipulation"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader className="animate-spin -ml-1 mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5 text-white" />
            Creating account...
          </div>
        ) : (
          'Create Account'
        )}
      </button>

      <div className="text-center">
        <span className="text-xs md:text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200 underline-offset-2 hover:underline"
          >
            Sign in here
          </Link>
        </span>
      </div>
    </form>
  );
};
