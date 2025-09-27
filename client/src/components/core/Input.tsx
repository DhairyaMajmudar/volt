import type { FormData, FormErrors, LoginFormData } from '@/components';

interface Props {
  formData: FormData;
  errors: FormErrors;
  label: keyof FormData | keyof LoginFormData;
  className?: string;
  handleInputChange: (field: keyof FormData, value: string) => void;
}

export const Input = ({
  formData,
  errors,
  label,
  className,
  handleInputChange,
}: Props) => {
  return (
    <div>
      <label
        htmlFor={label}
        className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2"
      >
        {label.charAt(0).toUpperCase() + label.slice(1)}
      </label>

      <input
        id={label}
        name={label}
        type={
          label === 'password'
            ? 'password'
            : label === 'email'
              ? 'email'
              : 'text'
        }
        autoComplete={label}
        required
        value={formData[label] || ''}
        onChange={(e) => handleInputChange(label, e.target.value)}
        className={
          `w-full px-3 py-2.5 md:py-3 border text-sm md:text-base ${
            errors[label] ? 'border-red-300' : 'border-gray-300'
          } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]` +
          (className ? ` ${className}` : '')
        }
        placeholder={`Enter your ${label}`}
      />
      {errors[label] && (
        <p className="mt-1 text-xs md:text-sm text-red-600">{errors[label]}</p>
      )}
    </div>
  );
};
