import React, { useState, useEffect } from "react";
import { contactData } from "../data";

function Contact() {
  const [contacts, setContacts] = useState([]);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [mobileNo, setMobileNo] = useState("");

  // 🔹 Load contacts from API with fallback
  useEffect(() => {
    const loadContacts = async () => {
      try {
        const response = await fetch("http://localhost/lodifhinew-main/api/contacts.php");

        if (!response.ok) {
          throw new Error("API not reachable");
        }

        const data = await response.json();
        setContacts(data);
      } catch (error) {
        console.log("Using fallback data:", error.message);
        setContacts(contactData); // fallback
      }
    };

    loadContacts();
  }, []);

  const handleSendEmail = (e) => {
      e.preventDefault();

    if (name && message && mobileNo) {
      const subject = encodeURIComponent("Inquire Services");
      const body = encodeURIComponent(message + "\n\nNumber: " + mobileNo + "\nFrom: " + name);
      window.location.href = `mailto:lodifhi@gmail.com?subject=${subject}&body=${body}`;
    } else {
      alert("Please fill in both fields.");
    }
  };

  const formatNumber = (num) => {
    if (num.length < 11) {
      return `${num.slice(0, 3)} ${num.slice(3, 6)} ${num.slice(6, 10)}`;
    }
    return `${num.slice(0, 4)} ${num.slice(4, 7)} ${num.slice(7, 11)}`;
  };

  return (
    <>
      {/* Header */}
      <div className="flex border-b-4 border-blue-400">
        <div className="relative w-full h-[100px] lg:h-[200px] overflow-hidden flex justify-center items-center">
          <img
            src="/admitting.jpg"
            className="w-full h-[100px] lg:h-[250px] object-cover opacity-50"
            alt="Contact"
          />
          <h1 className="absolute text-2xl lg:text-5xl font-bold text-[#337CCF] tracking-widest">
            Contact Us
          </h1>
        </div>
      </div>

      <form onSubmit={handleSendEmail}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-5 my-5">

          {/* Contact Form */}
          <div className="bg-[#337CCF] row-span-2 lg:col-start-2 lg:col-end-4 rounded-lg px-5 py-5">
            <label className="text-white">Full Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 border rounded-md p-2 w-full mb-2"
            />

              <label className="text-white my-2">Mobile Number</label>

              <input
                required
                value={mobileNo}
                onChange={(e) => setMobileNo(e.target.value)}
                type="text"
                className="border rounded-md p-2 w-full my-2"
              />

            <label className="text-white my-2">Message</label>
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-2 resize-none border rounded-md p-2 w-full h-72"
            />

            <button
              type="submit"
              className="bg-white font-bold mt-4 text-[#337CCF] hover:bg-blue-400 hover:text-white h-12 w-1/2 rounded-lg"
            >
              Send
            </button>
          </div>

          {/* Contact Table */}
          <div className="text-gray-600 lg:col-start-4 lg:col-end-6 mt-5 lg:mt-0">
            <p className="mb-1 font-bold">CONNECT WITH US</p>

            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Department</th>
                  <th className="py-2 px-4 border-b text-left">Number</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact.id}>
                    <td className="py-2 px-4 border-b">
                      {contact.department}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {formatNumber(contact.contactNum)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="h-auto w-full lg:row-start-2 lg:col-start-4 lg:col-end-6 mt-5 lg:mt-0">
            <p className="font-bold text-gray-600 mb-1 ml-4 sm:ml-0">
              Our Location
            </p>
            <iframe
              title="Map"
              className="h-[300px] w-full  2xl:h-[400px] border-2 border-[#337CCF] rounded-lg"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3917.8796129714315!2d123.41193941542!3d10.896752859939358!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a8dd359e8c0017%3A0x8c5912a9c408a05e!2sLopez%20District%20Farmers&#39;%20Hospital%20Inc!5e0!3m2!1sen!2sph!4v1579136555293!5m2!1sen!2sph"
              frameborder="0"
              allowfullscreen
            ></iframe>
          </div>
        </div>
        
      </form>
    </>
  );
}

export default Contact;