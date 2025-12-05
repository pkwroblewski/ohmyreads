import React from 'react';
import { ViewState } from '../types';
import { BookOpen, Heart, Twitter, Instagram, Github, Mail } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: ViewState) => void;
  currentYear?: number;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, currentYear = new Date().getFullYear() }) => {
  const footerLinks = {
    discover: [
      { label: 'Browse Genres', view: ViewState.GENRES },
      { label: 'Discovery', view: ViewState.DISCOVERY },
      { label: 'Community', view: ViewState.COMMUNITY },
      { label: 'Reading Groups', view: ViewState.GROUPS },
    ],
    company: [
      { label: 'About Us', view: ViewState.LANDING },
      { label: 'Blog', view: ViewState.BLOG },
      { label: 'Contact', view: ViewState.CONTACT },
      { label: 'FAQ', view: ViewState.FAQ },
    ],
    legal: [
      { label: 'Privacy Policy', view: ViewState.PRIVACY },
      { label: 'Terms of Service', view: ViewState.PRIVACY },
      { label: 'Cookie Policy', view: ViewState.PRIVACY },
    ],
  };

  const socialLinks = [
    { icon: <Twitter size={20} />, href: '#', label: 'Twitter' },
    { icon: <Instagram size={20} />, href: '#', label: 'Instagram' },
    { icon: <Github size={20} />, href: '#', label: 'GitHub' },
    { icon: <Mail size={20} />, href: '#', label: 'Email' },
  ];

  return (
    <footer className="bg-ink dark:bg-stone-950 text-white mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-accent text-ink rounded-lg flex items-center justify-center font-serif font-bold text-xl">
                O
              </div>
              <span className="font-serif text-2xl font-bold">OhMyReads</span>
            </div>
            <p className="text-stone-400 mb-6 max-w-sm">
              Your personal reading companion. Track books, discover new reads, 
              and connect with fellow book lovers around the world.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-stone-800 hover:bg-accent rounded-lg flex items-center justify-center text-stone-400 hover:text-ink transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Discover Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Discover</h3>
            <ul className="space-y-3">
              {footerLinks.discover.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => onNavigate(link.view)}
                    className="text-stone-400 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => onNavigate(link.view)}
                    className="text-stone-400 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => onNavigate(link.view)}
                    className="text-stone-400 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-stone-800">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-stone-500 text-sm">
            © {currentYear} OhMyReads. All rights reserved.
          </p>
          <p className="text-stone-500 text-sm flex items-center gap-1">
            Made with <Heart size={14} className="text-rose-500 fill-rose-500" /> for book lovers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
};

