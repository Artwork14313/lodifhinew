import React from "react";
import { doctorsData } from "../data";
import { useState } from "react";

function Doctors() {
  // const filteredItems = doctorsData.filter(
  //   (item) => item.Position === "PEDIATRICS"
  // );
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // const filteredItems =
  //   selectedCategory === "all"
  //     ? doctorsData
  //     : doctorsData.filter((doctor) => doctor.Position === selectedCategory);

  const filteredItems = doctorsData.filter((item) => {
    if (selectedCategory !== "all" && item.Position !== selectedCategory) {
      return false;
    }

    return item.Name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const renderedItems = filteredItems.map((item) => (
    <div
      key={item.id}
      className="w-auto bg-opacity-70 h-auto lg:h-full border-b-8 border-b-[#337CCF] border-t-8 border-t-[#337CCF] my-2 shadow-md"
    >
      <img src={item.Source} className="h-auto w-full" alt="Hospital leader" />
      <h3 className="font-bold 2xl:text-lg text-center text-[#337CCF] mt-1">
        DR. {item.Name.toUpperCase()}
      </h3>
      <p className="text-center text-sm 2xl:text-base text-gray-400">
        {item.Position.toUpperCase()}
      </p>
    </div>
  ));
  return (
    <>
      <div className="flex border-b-4 border-blue-400 ">
        <div className="relative w-full h-[100px] lg:h-[200px] overflow-hidden flex justify-center items-center">
          <img
            src="/doctors.jpg"
            className="w-full h-[100px] lg:h-[250px] object-cover opacity-50 bg-center bg-cover object-center"
            alt="Pharmacy"
          />
          <h1 className="flex justify-center items-center absolute text-2xl lg:text-5xl font-bold text-[#337CCF] cursor-default tracking-widest">
            Our Doctors
          </h1>
        </div>
      </div>

      <div className="pt-1 md:pb-6">
        <div className="flex items-center justify-evenly my-5">
          <div className="bg-[#337CCF] grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-14 px-20 py-12 rounded-md shadow-md">
            <div>
              <label htmlFor="category" className="mr-2 text-white">
                Category:
              </label>
              <select
                id="category"
                className="rounded-sm text-[#337CCF]"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="all">All</option>
                <option value="Surgery">Surgery</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Internal Medicine">Internal Medicine</option>
                <option value="Anesthesiology">Anesthesiology</option>
                <option value="Obstetrics & Gynecology">
                  Obstetrics & Gynecology
                </option>
                <option value="General Practitioner">
                  General Practitioner
                </option>
              </select>
            </div>

            <div class="relative text-[#337CCF]">
              <input
                type="search"
                onChange={(e) => setSearchTerm(e.target.value)}
                name="search"
                placeholder="Search..."
                class="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none w-64"
              />
              <div class="absolute right-0 top-0 mt-3 mr-4">
                <svg
                  class="text-[#337CCF] mr-2 h-4 w-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-2 gap-5 mb-6 mx-0 lg:mx-32 xl:mx-52 2xl:mx-80 my-3 justify-evenly justify-items-center content-evenly items-start cursor-default">
          {renderedItems}
        </div>
      </div>
    </>
  );
}

export default Doctors;
