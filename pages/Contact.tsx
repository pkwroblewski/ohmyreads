import React, { useState } from 'react';
import { Mail, MapPin, Clock, Send, CheckCircle, MessageSquare, HelpCircle, Bug } from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const contactMethods = [
    {
      icon: <Mail size={24} />,
      title: 'Email Us',
      description: 'support@ohmyreads.app',
      detail: 'We respond within 24 hours',
    },
    {
      icon: <MapPin size={24} />,
      title: 'Location',
      description: 'San Francisco, CA',
      detail: 'United States',
    },
    {
      icon: <Clock size={24} />,
      title: 'Support Hours',
      description: 'Mon - Fri: 9AM - 6PM PST',
      detail: 'Weekend: Limited support',
    },
  ];

  const subjectOptions = [
    { value: 'general', label: 'General Inquiry', icon: <MessageSquare size={16} /> },
    { value: 'support', label: 'Technical Support', icon: <HelpCircle size={16} /> },
    { value: 'bug', label: 'Report a Bug', icon: <Bug size={16} /> },
    { value: 'feedback', label: 'Feedback', icon: <CheckCircle size={16} /> },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center animate-fade-in">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-ink dark:text-stone-100 mb-4">
            Message Sent!
          </h2>
          <p className="text-stone-600 dark:text-stone-400 mb-6">
            Thank you for reaching out. We've received your message and will get back to you within 24 hours.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="text-accent hover:underline font-medium"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fade-in pb-12">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-ink dark:text-stone-100 mb-4">
          Get in Touch
        </h1>
        <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
          Have a question, feedback, or just want to say hello? We'd love to hear from you. 
          Our team is here to help make your reading experience even better.
        </p>
      </header>

      {/* Contact Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {contactMethods.map((method) => (
          <div
            key={method.title}
            className="bg-white dark:bg-stone-900 rounded-xl p-6 border border-stone-100 dark:border-stone-800 text-center hover:shadow-lg transition-shadow"
          >
            <div className="w-14 h-14 mx-auto bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-accent mb-4">
              {method.icon}
            </div>
            <h3 className="font-bold text-ink dark:text-stone-100 mb-1">{method.title}</h3>
            <p className="text-stone-700 dark:text-stone-300 font-medium">{method.description}</p>
            <p className="text-stone-500 dark:text-stone-500 text-sm">{method.detail}</p>
          </div>
        ))}
      </div>

      {/* Contact Form */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-8 border border-stone-100 dark:border-stone-800 max-w-2xl mx-auto">
        <h2 className="text-2xl font-serif font-bold text-ink dark:text-stone-100 mb-6">
          Send Us a Message
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-2">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Jane Reader"
                className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:border-accent outline-none text-ink dark:text-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="jane@example.com"
                className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:border-accent outline-none text-ink dark:text-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-2">
              Subject
            </label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:border-accent outline-none text-ink dark:text-white transition-colors"
            >
              {subjectOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-2">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Tell us how we can help..."
              className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:border-accent outline-none text-ink dark:text-white transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-ink dark:bg-accent text-white rounded-xl font-bold hover:bg-stone-800 dark:hover:bg-amber-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              'Sending...'
            ) : (
              <>
                <Send size={18} />
                Send Message
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

