import React from 'react';

const Playbooks: React.FC = () => {
  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-start py-12 px-4">
      <section className="w-full max-w-3xl flex flex-col items-center text-center">
        {/* Hero Section */}
        <div className="mb-8">
          {/* Product image */}
          <img
            src="/images/ipm-cover.png"
            alt="MasterGrowbot AI IPM Playbook cover - premium cannabis pest and pathogen guide"
            className="w-full h-64 object-cover rounded-lg mb-6 border-2 border-green-500 shadow-lg"
            width={445}
            height={335}
          />
          <h1 className="text-4xl font-extrabold mb-2">The Master Cannabis IPM Playbook</h1>
          <h2 className="text-xl font-semibold text-green-400 mb-4">Eradicate Pests and Pathogens — Save $336+ Per Plant.</h2>
          <p className="text-lg text-gray-300 mb-6">A premium, expert-crafted guide to protecting your cannabis crop from pests, pathogens, and diseases. Instantly downloadable, proven ROI, and trusted by top growers.</p>
          <a
            href="https://whop.com/checkout/plan_Lsx5cbs9qj0J5"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition-colors duration-200"
          >
            Buy Now - Instant Access
          </a>
        </div>
        {/* Social Proof & Features */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {/* Placeholder for ROI, TOC, and Preview images */}
          <div className="bg-gray-800 rounded-lg h-48 flex items-center justify-center">
            <span className="text-gray-500">[ROI Data Image]</span>
          </div>
          <div className="bg-gray-800 rounded-lg h-48 flex items-center justify-center">
            <span className="text-gray-500">[Table of Contents Image]</span>
          </div>
          <div className="bg-gray-800 rounded-lg h-48 flex items-center justify-center">
            <span className="text-gray-500">[Spider Mite Preview Image]</span>
          </div>
        </div>
        {/* Guarantee & Security */}
        <div className="mt-12 text-gray-400 text-sm">
          <p>Secure checkout powered by Whop. Instant digital delivery. 100% satisfaction guarantee.</p>
        </div>
      </section>
    </main>
  );
};

export default Playbooks;
