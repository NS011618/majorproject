import React from 'react'
import aboutImage from '../assets/about.jpg'
import missionImage from '../assets/people.jpg'
import valuesImage from '../assets/peopl.jpg'

function About() {
   const contentData = [
      {
         title: 'About Us',
         image: aboutImage,
         content:
            'Welcome to our healthcare website! We are dedicated to providing high-quality medical services. Our team of experienced healthcare professionals is committed to ensuring the well-being of our community.',
      },
      {
         title: 'Our Values',
         image: valuesImage,
         content: [
            'Compassion - We empathize with our patients and strive to make a positive impact on their lives.',
            'Excellence - We maintain high standards in medical care and services.',
            'Integrity - We conduct ourselves with honesty and ethical behavior in all aspects of our work.',
         ],
      },
      {
         title: 'Our Mission',
         image: missionImage,
         content: [
            'Our mission is to improve the health and well-being of our patients by providing comprehensive and compassionate healthcare services.',
            'We strive for innovation in medical treatments and technologies.',
            'Ensure accessible and affordable healthcare for all members of our community.',
         ],
      },
      // Add more content sections here as needed
   ]

   return (
      <div className="bg-white shadow-md p-8 flex flex-wrap">
         {contentData.map((item, index) => (
            <div
               key={index}
               className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3 mb-8 px-4"
            >
               <div className="bg-white p-6 rounded-lg shadow-md transition duration-300 hover:shadow-lg">
                  <img
                     src={item.image}
                     alt={item.title}
                     className="max-w-full h-auto mb-4 rounded-lg"
                  />
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                     {item.title}
                  </h2>
                  {typeof item.content === 'string' ? (
                     <p className="text-gray-600">{item.content}</p>
                  ) : (
                     <ul className="list-disc list-inside text-gray-600">
                        {item.content.map((contentItem, contentIndex) => (
                           <li key={contentIndex}>{contentItem}</li>
                        ))}
                     </ul>
                  )}
               </div>
            </div>
         ))}
         <div className="w-full mb-8 text-center">
            <p className="text-sm text-gray-500">
               For more information, contact us at example@gmail.com
            </p>
         </div>
      </div>
   )
}

export default About
