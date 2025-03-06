
import { FC, useState } from 'react';

const Contact: FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate sending form data to the server
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmissionStatus('Message sent successfully!');
      // Reset form
      setName('');
      setEmail('');
      setMessage('');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md sm:max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="p-4 sm:p-6">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4 text-center">Contact me</h1>
          <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 text-center">
            I'd love to hear from you. Please fill out the form below to get in touch.
          </p>

          {submissionStatus && (
            <div className="mb-4 text-center text-green-600 dark:text-green-400">{submissionStatus}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-600 touch-target"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-600 touch-target"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-600"
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed touch-target"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
