import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedinIn, FaTwitter, FaEnvelope } from 'react-icons/fa';

const Footer: React.FC = () => {
  const [hovered, setHovered] = useState<number | null>(null);
  
  const socialLinks = [
    { id: 1, icon: <FaGithub size={20} />, url: 'https://github.com/vishsinh', label: 'GitHub' },
    { id: 2, icon: <FaLinkedinIn size={20} />, url: 'https://linkedin.com/in/vishsinh', label: 'LinkedIn' },
    { id: 3, icon: <FaTwitter size={20} />, url: 'https://twitter.com/vishsinh', label: 'Twitter' },
    { id: 4, icon: <FaEnvelope size={20} />, url: 'mailto:vish.json@gmail.com', label: 'Email' },
  ];

  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <motion.h3 
              className="text-xl font-bold mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Vishal Sinha
            </motion.h3>
            <motion.p 
              className="text-sm text-gray-400 max-w-md"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Software Engineer trying to build cool things ;)
            </motion.p>
          </div>
          
          <div className="flex space-x-4">
            {socialLinks.map((social) => (
              <motion.a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300"
                whileHover={{ scale: 1.2, color: '#ffffff' }}
                onMouseEnter={() => setHovered(social.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <span className="sr-only">{social.label}</span>
                {social.icon}
                {hovered === social.id && (
                  <motion.span 
                    className="absolute -mt-8 text-xs bg-gray-800 px-2 py-1 rounded"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    {social.label}
                  </motion.span>
                )}
              </motion.a>
            ))}
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm">
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            © {currentYear} Vishal Sinha. All rights reserved.
          </motion.p>
          <motion.p 
            className="mt-2 md:mt-0 text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Made with ❤️ 
          </motion.p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;