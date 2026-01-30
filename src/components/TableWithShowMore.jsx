import React, { useState } from "react";
import { BiSolidChevronDown, BiSolidChevronUp } from "react-icons/bi";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { orData, ultraData, opdData, xrayData } from "../data";

const TableWithShowMore = ({ data }) => {
  const itemsPerTable = Math.ceil(data.length / 2);
  const [showAll, setShowAll] = useState(false);

  let firstTableData = showAll
    ? data.slice(0, itemsPerTable)
    : data.slice(0, 7);
  let secondTableData = showAll
    ? data.slice(itemsPerTable)
    : data.slice(7, 14);

  if (data.length < 20 && data.length > 10) {
    firstTableData = showAll ? data.slice(0, itemsPerTable) : data.slice(0, 10);

    secondTableData = showAll ? data.slice(itemsPerTable) : data.slice(10, 19);
  } else if (data.length < 10) {
    firstTableData = showAll ? data.slice(0, itemsPerTable) : data.slice(0, 4);

    secondTableData = showAll ? data.slice(itemsPerTable) : data.slice(4, 7);
  }

  const itemsToShow = showAll ? data.length : 10;

  return (
    <>
      <div className="bg-gray-100 md:py-1 hidden lg:block cursor-default">
        <div class="overflow-x-auto mx-0 xl:mx-40 2xl:mx-80 mt-7 mb-9 justify-evenly justify-items-center content-evenly items-start shadow-inner2 text-white bg-[#1450A3] bg-opacity-70">
          <div class="overflow-x-auto">
            <div class="w-full lg:w-1/2 p-4 float-left border-b-2 lg:border-b-0 lg:border-r-2 border-white">
              <table class="min-w-full divide-y divide-white">
                <thead>
                  <tr className="divide-x divide-white">
                    <th class="px-2 sm:px-6 py-3 text-left text-base xl:text-lg font-medium uppercase tracking-wider">
                      {data === xrayData && "EXAMINATION"} {data === ultraData && "EXAMINATION"} {data === orData && "PROCEDURE"} {data === opdData && "Services"}
                    </th>
                    <th class="px-2 sm:px-6 py-3 text-left text-base xl:text-lg font-medium uppercase tracking-wider">
                      OPD PRICE
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-white text-sm sm:text-base">
                  <TransitionGroup component={null}>
                    {firstTableData.map((item, index) => (
                      <CSSTransition
                        key={index}
                        timeout={500}
                        classNames="fade"
                      >
                        <tr key={item.id} className="divide-x divide-white hover:bg-blue-900 hover:bg-opacity-40 hover:shadow-md duration-500 delay-100">
                          <td class="px-2 sm:px-6 py-4 whitespace-nowrap">
                            {item.Exam}
                          </td>
                          <td class="px-2 sm:px-6 py-4 whitespace-nowrap">
                            ₱ {item.Price.toLocaleString()}
                          </td>
                        </tr>
                      </CSSTransition>
                    ))}
                  </TransitionGroup>
                </tbody>
              </table>
            </div>

            {secondTableData.length > 0 && (
              <div class="w-full lg:w-1/2 p-4 float-left border-t-2 lg:border-t-0 lg:border-l-2 border-white">
                <table class="min-w-full divide-y divide-white">
                  <thead>
                    <tr className="divide-x divide-white">
                      <th class="px-2 sm:px-6 py-3 text-left text-base xl:text-lg font-medium uppercase tracking-wider">
                        {data === xrayData && "EXAMINATION"} {data === ultraData && "EXAMINATION"} {data === orData && "PROCEDURE"} {data === opdData && "Services"}
                      </th>
                      <th class="px-2 sm:px-6 py-3 text-left text-base xl:text-lg font-medium uppercase tracking-wider">
                        OPD PRICE
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-white text-sm sm:text-base">
                    <TransitionGroup component={null}>
                      {secondTableData.map((item, index) => (
                        <CSSTransition
                          key={index}
                          timeout={500}
                          classNames="fade"
                        >
                          <tr key={item.id} className="divide-x divide-white hover:bg-blue-900 hover:bg-opacity-40 hover:shadow-md duration-500 delay-100">
                            <td class="px-2 sm:px-6 py-4 whitespace-nowrap">
                              {item.Exam}
                            </td>
                            <td class="px-2 sm:px-6 py-4 whitespace-nowrap">
                              ₱ {item.Price.toLocaleString()}
                            </td>
                          </tr>
                        </CSSTransition>
                      ))}
                    </TransitionGroup>
                    {firstTableData.length > secondTableData.length && (
                      <tr className="divide-x divide-white invisible">
                        <td class="px-2 sm:px-6 py-4 whitespace-nowrap">
                          asdsad
                        </td>
                        <td class="px-2 sm:px-6 py-4 whitespace-nowrap">
                          asdsads
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            <div class="clearfix"></div>
          </div>
          {data.length > 3 && (
            <div className="m-3">
              {/* Schedule + Button row */}
              <div className="flex items-center justify-between gap-4">
                
                {data.length >= 20 && (
                  <button
                    className="py-1 px-3 font-bold text-white bg-blue-300 hover:bg-blue-50 hover:text-[#337CCF] hover:border-blue-400 rounded-lg border-4 text-sm duration-500 flex items-center"
                    onClick={() => setShowAll(!showAll)}
                  >
                    {showAll ? "Show Less" : "Show More"}
                    {showAll ? (
                      <BiSolidChevronUp className="ml-1 text-lg" />
                    ) : (
                      <BiSolidChevronDown className="ml-1 text-lg" />
                    )}
                  </button>
                )}

                <p className="font-bold text-lg flex items-center">
                  <span className="mr-2">Schedule:</span>
                  <span>
                    {data === xrayData && "6:00 am to 10:00 pm"}
                    {data === ultraData && "Tuesday & Friday"}
                    {data === orData && "6:00 am to 10:00 pm"}
                    {data === opdData && "8:00 am to 5:00 pm"}
                  </span>
                </p>
              </div>
            </div>
          )}

        </div>
      </div>

      <div className="bg-gray-100 md:py-1 block lg:hidden">
        <div class="overflow-x-auto mx-0 xl:mx-40 2xl:mx-80 my-7 justify-evenly justify-items-center content-evenly items-start shadow-inner2 text-white bg-[#1450A3] bg-opacity-70">
          <div class="overflow-x-auto">
            <div class="w-full lg:w-1/2 p-4 float-left ">
              <table class="min-w-full divide-y divide-white">
                <thead>
                  <tr className="divide-x divide-white">
                    <th class="px-2 sm:px-6 py-3 text-left text-base xl:text-lg font-medium uppercase tracking-wider">
                      {data === xrayData && "EXAMINATION"} {data === ultraData && "EXAMINATION"} {data === orData && "PROCEDURE"} {data === opdData && "Services"}
                    </th>
                    <th class="px-2 sm:px-6 py-3 text-left text-base xl:text-lg font-medium uppercase tracking-wider">
                      OPD PRICE
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-white text-sm sm:text-base">
                  <TransitionGroup component={null}>
                    {data.slice(0, itemsToShow).map((item, index) => (
                      <CSSTransition
                        key={index}
                        timeout={500}
                        classNames="fade"
                      >
                        <tr key={index} className="divide-x divide-white hover:bg-blue-900 hover:bg-opacity-40 hover:shadow-md duration-500 delay-100">
                          <td class="px-2 sm:px-6 py-4 whitespace-nowrap">
                            {item.Exam}
                          </td>
                          <td class="px-2 sm:px-6 py-4 whitespace-nowrap">
                            ₱ {item.Price.toLocaleString()}
                          </td>
                        </tr>
                      </CSSTransition>
                    ))}
                  </TransitionGroup>
                </tbody>
              </table>
            </div>

            <div class="clearfix"></div>
          </div>
          {data.length > 3 && (
            <div>
              <div className="m-3 flex justify-center">
                <button
                  className="mt-1 py-1 me-2 mb-5 font-bold text-white hover:text-[#337CCF] bg-blue-300 hover:bg-blue-50 hover:border-blue-400 rounded-lg px-3 border-white-400 border-4 text-sm duration-500"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? "Show Less" : "Show More"}
                  {showAll ? (
                    <BiSolidChevronUp className="inline-block relative left-1 text-lg " />
                  ) : (
                    <BiSolidChevronDown className="inline-block relative bottom-[1px] left-1 text-lg " />
                  )}
                </button>
              </div>
              <hr className="mb-5" />
              <p className="ml-6 mb-5 font-bold text-md flex justify-start">
                Schedule: <span className="ml-2">{data === ultraData ? "Tuesday & Friday" : "6:00 am to 10:00 pm"}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TableWithShowMore;
