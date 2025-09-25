import { Link } from 'react-router-dom';
import { GitHub, Logo } from '@/components';

export const Footer = () => {
  return (
    <div className="bg-black/85 flex flex-row justify-center px-5 h-8 items-center">
      <Link to={'/'} className="text-white left-0 ">
        <span className="flex items-center text-lg font-semibold gap-2">
          <Logo />
          Volt
        </span>
      </Link>

      <p className="text-white text-center flex-grow font-bold tracking-wider">
        Developed by Dhairya Majmudar 🚀
      </p>

      <span>
        <Link
          to="https://github.com/DhairyaMajmudar/volt"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHub className="text-white cursor-pointer hover:text-gray-300" />
        </Link>
      </span>
    </div>
  );
};
