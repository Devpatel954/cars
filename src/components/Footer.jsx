import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-24 text-sm text-gray-600">
      <div className="px-6 md:px-16 lg:px-24 xl:px-32">
       
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-8 border-b border-gray-200">
       
          <div>
            <img src={assets.logo} alt="Company logo" className="h-8 md:h-9" />
            <p className="max-w-sm mt-3">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
              Ipsum has been the industry&apos;s standard dummy text.
            </p>

        
            <div className="flex items-center gap-3 mt-6">
              <a href="#" aria-label="Facebook" title="Facebook" className="hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400 rounded">
                <img src={assets.facebook_logo} alt="Facebook" className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Instagram" title="Instagram" className="hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400 rounded">
                <img src={assets.instagram_logo} alt="Instagram" className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Twitter" title="Twitter" className="hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400 rounded">
                <img src={assets.twitter_logo} alt="Twitter" className="w-5 h-5" />
              </a>
              <a href="mailto:devpatel@gmail.com" aria-label="Email" title="Email" className="hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400 rounded">
                <img src={assets.gmail_logo} alt="Email" className="w-5 h-5" />
              </a>
            </div>
          </div>

        
          <div>
            <h2 className="text-base font-semibold text-gray-900">Quick Links</h2>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="hover:text-gray-900">Home</a></li>
              <li><a href="#" className="hover:text-gray-900">Browse Cars</a></li>
              <li><a href="#" className="hover:text-gray-900">List your car</a></li>
              <li><a href="#" className="hover:text-gray-900">About us</a></li>
            </ul>
          </div>

         
          <div>
            <h2 className="text-base font-semibold text-gray-900">Resources</h2>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="hover:text-gray-900">Help Center</a></li>
              <li><a href="#" className="hover:text-gray-900">Terms of Service</a></li>
              <li><a href="#" className="hover:text-gray-900">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-gray-900">Insurance</a></li>
            </ul>
          </div>

        
          <div>
            <h2 className="text-base font-semibold text-gray-900">Contact</h2>
            <address className="mt-4 not-italic space-y-2">
              <p>605 W Madison St</p>
              <p>Chicago, IL 60611</p>
              <p>
                <a href="tel:+1235689906" className="hover:text-gray-900">+1 (235) 689-906</a>
              </p>
              <p>
                <a href="mailto:devpatel@gmail.com" className="hover:text-gray-900">devpatel@gmail.com</a>
              </p>
            </address>
          </div>
        </div>

    
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-3 items-center justify-between py-5">
          <p>
            © {year}{' '}
            <a href="#" className="hover:text-gray-900 underline-offset-4 hover:underline">
              Car rental
            </a>. All rights reserved.
          </p>

          <ul className="flex items-center gap-4">
            <li><a href="#" className="hover:text-gray-900">Privacy</a></li>
            <li><a href="#" className="hover:text-gray-900">Terms</a></li>
            <li><a href="#" className="hover:text-gray-900">Cookies</a></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer
