import React from 'react';

import aboutImage from '../assets/about.jpg'; // Replace with actual image URLs
import missionImage from '../assets/people.jpg';
import valuesImage from '../assets/peopl.jpg'; // Corrected image URL

function About() {
  const contentData = [
    {
      title: "About Us",
      image: aboutImage,
      content: "Welcome to our healthcare website! We are dedicated to providing high-quality medical services..."
    },
    {
      title: "Our Values",
      image: valuesImage, // Corrected image URL
      content: [
        "At our healthcare facility, we are committed to the following values:",
        "- Compassion",
        "- Excellence",
        "- Integrity"
      ]
    },
    {
      title: "Our Mission",
      image: missionImage,
      content: [
        "Our mission is to improve the health and well-being of our patients by...",
        "We strive to provide high-quality medical services and...",
        "Ensure accessible and affordable healthcare for all..."
      ]
    },
    // Add more content sections here as needed
  ];

  return (
    <>
    <div className="bg-white p-4 md:p-8 flex flex-wrap">
      {contentData.map((item, index) => (
        <div key={index} className="w-full md:w-1/2 mb-8 flex">
          <div className="md:w-1/3 mb-4 md:mb-0">
            <img
              src={item.image}
              alt={item.title}
              className="max-w-full h-auto mx-auto rounded-lg"
            />
          </div>
          <div className="md:w-2/3 md:pl-4">
            <h2 className="text-3xl font-semibold text-gray-800">{item.title}</h2>
            {typeof item.content === 'string' ? (
              <p className="text-gray-600 mt-2">{item.content}</p>
            ) : (
              <ul className="list-disc list-inside text-gray-600 mt-2">
                {item.content.map((contentItem, contentIndex) => (
                  <li key={contentIndex}>{contentItem}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
    </>
  );
}

export default About;
