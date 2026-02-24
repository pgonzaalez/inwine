import React from 'react';
import { motion } from 'framer-motion';
import Footer from '@components/FooterComponent';

const BaseInfoPage = ({ title, content, children }) => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-6">
              {title.split(' ').map((word, i) => (
                <span key={i} className={i === 0 ? "" : "text-[#9A3E50]"}>
                  {word}{' '}
                </span>
              ))}
            </h1>
            
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 prose prose-lg max-w-none text-gray-700 leading-relaxed prose-headings:text-gray-900 prose-strong:text-gray-900 prose-a:text-[#9A3E50] hover:prose-a:underline">
              {content && <p className="text-xl text-gray-600 mb-10 italic border-l-4 border-[#9A3E50] pl-6">{content}</p>}
              <div className="space-y-6">
                {children}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BaseInfoPage;
