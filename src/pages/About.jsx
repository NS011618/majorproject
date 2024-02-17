import React from 'react';
import aboutImage from '../assets/about.jpg';

function About() {
   const contentData = [
      {
         title: 'About Us',
         content:
            'Welcome to our healthcare website! We are dedicated to providing high-quality medical services. Our team of experienced healthcare professionals is committed to ensuring the well-being of our community.',
      }
   ];

   return (
      <div className="bg-gradient-to-r from-orange-400 from-10% via-sky-300 via-30% to-emerald-500 to-90% shadow-md p-8 flex flex-wrap items-center">
         <div className="w-full md:w-1/3 mb-8 md:mb-0 md:pr-4">
            <img
               src={aboutImage}
               alt="About Us"
               className="max-w-full h-auto rounded-lg"
            />
         </div>
         <div className="w-full md:w-1/2 md:pl-4">
            {contentData.map((item, index) => (
               <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                     {item.title}
                  </h2>
                  <p className="text-gray-600">{item.content}</p>
               </div>
            ))}
            <div className="mt-8 text-center">
               <p className="text-sm text-gray-500">
                  For more information, contact us at example@gmail.com
               </p>
            </div>
         </div>
      </div>
   );
}

export default About;
