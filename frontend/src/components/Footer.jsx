import { Film, Github, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-20" data-testid="footer">
      <div className="px-8 md:px-16 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#e50914] p-2 rounded">
                <Film className="w-6 h-6 text-white" />
              </div>
              <span className="heading-font text-2xl font-bold text-white">MOVIESTREAM</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your ultimate destination for streaming the best movies online.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Search
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-white font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              <li className="text-gray-400 text-sm">No subscription required</li>
              <li className="text-gray-400 text-sm">Stream instantly</li>
              <li className="text-gray-400 text-sm">HD Quality</li>
              <li className="text-gray-400 text-sm">Multiple genres</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-[#e50914] rounded-full flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-[#e50914] rounded-full flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-[#e50914] rounded-full flex items-center justify-center transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} MovieStream. All rights reserved. Built with FastAPI, React & MongoDB.
          </p>
        </div>
      </div>
    </footer>
  );
}