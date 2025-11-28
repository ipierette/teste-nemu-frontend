import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#1a1a1a] text-gray-200 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#1a1a1a] p-2 rounded-lg">
              <img 
                src="/logo-desenvolvedora.webp" 
                alt="Logo Desenvolvedora" 
                className="h-8 w-auto"
              />
            </div>
            <div className="text-sm">
              <p className="font-semibold text-white">Izadora Cury Pierette</p>
              <p className="text-xs text-gray-400">Full Stack Developer</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="https://www.linkedin.com/in/izadora-cury-pierette-7a7754253/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center gap-1.5 text-sm"
            >
              <FaLinkedin className="text-lg" />
              <span className="hidden sm:inline">LinkedIn</span>
            </a>
            <a 
              href="https://github.com/ipierette" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center gap-1.5 text-sm"
            >
              <FaGithub className="text-lg" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <a 
              href="mailto:ipierette2@gmail.com"
              className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center gap-1.5 text-sm"
            >
              <FaEnvelope className="text-lg" />
              <span className="hidden sm:inline">Email</span>
            </a>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-800 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Izadora Cury Pierette. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
