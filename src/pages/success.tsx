import React from 'react';
import { useNavigate } from 'react-router-dom';

const Success: React.FC = () => {
  const navigate = useNavigate();
  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold mb-4">Purchase Successful! Your canopy is protected.</h1>
        <p className="text-lg text-gray-300 mb-6">
          Your playbook is ready. Whop has sent a secure download link directly to your email. You can also access it immediately in your Whop library.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition-colors duration-200"
        >
          Return to Dashboard
        </button>
      </div>
    </main>
  );
};

export default Success;
