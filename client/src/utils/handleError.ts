export const handleErrors = (
  status: number,
  setErrors: (errors: Record<string, string>) => void,
  data: any,
) => {
  switch (status) {
    case 400:
      if (data.errors && typeof data.errors === 'object') {
        setErrors(data.errors);
      } else {
        setErrors({
          general: data.message || 'Please check your input and try again.',
        });
      }
      break;
    case 401:
      setErrors({
        general: 'Invalid email or password. Please try again.',
      });
      break;
    case 409:
      if (data?.message.includes('email')) {
        setErrors({
          email: 'An account with this email already exists.',
        });
      } else if (data?.message.includes('username')) {
        setErrors({
          username: 'This username is already taken.',
        });
      } else {
        setErrors({
          general: 'An account with this email or username already exists.',
        });
      }
      break;
    case 500:
      setErrors({
        general: 'Server error. Please try again later.',
      });
      break;
    default:
      setErrors({
        general: 'Network error. Please check your connection and try again.',
      });
  }
};
