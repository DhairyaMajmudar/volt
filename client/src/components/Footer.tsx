import { Link } from 'react-router-dom';
import { GitHub } from './icons/GitHub';

export const Footer = () => {
  return (
    <div className="bg-black flex flex-row justify-center px-5 h-8 items-center">
      <span className="text-white left-0">Logo</span>

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
