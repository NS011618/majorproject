import React, { useState } from 'react'
import logo2 from '../assets/logo2.avif'

function Contact() {
   const [formData, setFormData] = useState({
      first_name: '',
      last_name: '',
      email: '',
      message: '',
   })

   const handleSubmit = async (e) => {
      e.preventDefault()

      try {
         const response = await fetch('http://localhost:5000/contact', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json', // Set content type to JSON
            },
            body: JSON.stringify(formData), // Convert form data to JSON
         })

         const result = await response.json()
         console.log(result)
      } catch (error) {
         console.error('Error sending message:', error)
      }
   }

   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value })
   }

   return (
      <>
         <section className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
               <div className="flex flex-col sm:flex-row items-center">
                  <div className="mb-4 sm:mb-0 sm:mr-6 flex-shrink-0">
                     <img src={logo2} alt="Contact Us" className="mx-auto max-w-xs" />
                  </div>

                  <div className="mt-6 sm:mt-0 bg-white shadow-md p-6 rounded-lg sm:flex-grow">
                     <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                        Contact Us
                     </h2>
                     <p className="mt-4 text-lg text-gray-600">
                        Have questions or feedback? Get in touch with us.
                     </p>

                     <form className="mt-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                           <div>
                              <label
                                 htmlFor="first_name"
                                 className="block text-sm font-medium text-gray-700"
                              >
                                 First name
                              </label>
                              <div className="mt-1">
                                 <input
                                    type="text"
                                    id="first_name"
                                    name="first_name"
                                    autoComplete="given-name"
                                    className="py-2 px-4 w-full bg-gray-100 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                                    onChange={handleChange}
                                 />
                              </div>
                           </div>
                           <div>
                              <label
                                 htmlFor="last_name"
                                 className="block text-sm font-medium text-gray-700"
                              >
                                 Last name
                              </label>
                              <div className="mt-1">
                                 <input
                                    type="text"
                                    id="last_name"
                                    name="last_name"
                                    autoComplete="family-name"
                                    className="py-2 px-4 w-full bg-gray-100 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                                    onChange={handleChange}
                                 />
                              </div>
                           </div>
                           <div className="w-full">
                              <label
                                 htmlFor="email"
                                 className="block text-sm font-medium text-gray-700"
                              >
                                 Email address
                              </label>
                              <div className="mt-1">
                                 <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    className="py-2 px-4 w-full bg-gray-100 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                                    onChange={handleChange}
                                 />
                              </div>
                           </div>
                           <div className="w-full">
                              <label
                                 htmlFor="message"
                                 className="block text-sm font-medium text-gray-700"
                              >
                                 Message
                              </label>
                              <div className="mt-1">
                                 <textarea
                                    id="message"
                                    name="message"
                                    rows={4}
                                    className="py-2 px-4 w-full bg-gray-100 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                                    defaultValue={''}
                                    onChange={handleChange}
                                 />
                              </div>
                           </div>
                           <div className="mt-6">
                              <button
                                 type="submit"
                                 className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                 Send
                              </button>
                           </div>
                        </div>
                     </form>
                  </div>
               </div>
            </div>
         </section>
      </>
   )
}

export default Contact
