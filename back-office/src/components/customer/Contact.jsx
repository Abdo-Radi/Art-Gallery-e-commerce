import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkedin,
  faFacebook,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

const Contact = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
      <div className="max-w-lg">
      <h1 className="mb-5 text-title-lg font-medium">Contact Us</h1>
        <p className="text-gray-700 mb-6">
          Have a question or want to get in touch? Reach out to us using the
          form below.
        </p>
        <form>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 font-semibold mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full border border-stroke px-4 py-2 focus:outline-none focus:border-primary"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-semibold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full border border-stroke px-4 py-2 focus:outline-none focus:border-primary"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="message"
              className="block text-gray-700 font-semibold mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="5"
              className="w-full border border-stroke px-4 py-2 focus:outline-none focus:border-primary"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-36 bg-primary text-white py-2 px-4"
          >
            Submit
          </button>
        </form>
      </div>
      <div className="lg:mt-5 max-w-lg lg:col-start-2">
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
          <p className="text-gray-700 mb-2">123 Gallery Street</p>
          <p className="text-gray-700 mb-2">City, Country</p>
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Connect With Us</h3>
          <p className="text-gray-700 mb-2">
            For Product Questions/Concerns, Brand Information & General
            Inquiries:
            <br />{" "}
            <a href="#" className="font-semibold">
              info@horizons.com
            </a>{" "}
          </p>
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-700 hover:text-black">
              <FontAwesomeIcon icon={faLinkedin} size="2x" />
            </a>
            <a href="#" className="text-gray-700 hover:text-black">
              <FontAwesomeIcon icon={faFacebook} size="2x" />
            </a>
            <a href="#" className="text-gray-700 hover:text-black">
              <FontAwesomeIcon icon={faInstagram} size="2x" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
