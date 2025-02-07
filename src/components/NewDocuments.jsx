import React, { memo } from "react";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import { baseUrls } from "../utils/apiWrapper";
const NewDocuments = ({ docs }) => {
  let documents = [];
  try {
    if (docs) {
      documents = JSON.parse(docs);
    }
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }

  // Convert object to array if documents is an object
  const documentArray = Array.isArray(documents)
    ? documents
    : Object.values(documents);

  const handleOpenPdf = (path) => {
    const url = `${baseUrls}/storage/${path}`;
    window.open(url, "_blank");
  };

  return (
    <>
      {!!documentArray && documentArray.length > 0 ? (
        <div className="bg-white rounded-md p-5 border-2 border-[#E2E8F0] mt-3">
          {/* Badge Section */}
          <span className="text-black-200 document-text mb-3">
            Resources And Downloads
          </span>
          <div class="grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2 3xl:grid-cols-3 gap-2 mt-3">
            {/* Ensure documentArray is an array before using .map */}
            {documentArray.length > 0 ? (
              documentArray.map((item, index) => {
                console.log("docuemnts", item);
                return (
                  <div
                    className="flex flex-col relative p-1 flex justify-center items-center"
                    key={index}
                    onClick={() => handleOpenPdf(item.path)}
                  >
                    <object
                      data={`${baseUrls}/storage/${item.path}`}
                      type="application/pdf"
                      // width="550"
                      height="151"
                      className="w-full border border-b-2 border-t-1 border-black"
                    >
                      <p>
                        Your browser does not support PDFs.{" "}
                        <a href={`${baseUrls}/storage/${item.path}`}>
                          Download the PDF
                        </a>
                      </p>
                    </object>
                    {/* Overlay div on top of iframe */}
                    {/* <div
                      onClick={() => handleOpenPdf(item.path)}
                      className="absolute bg-[red] cursor-pointer top-0 left-0 w-full h-full bg-transparent z-10"
                    >
                      <span
                        // style={{ marginLeft: "45px" }}
                        className="absolute top-1/2 h-[150px] mt-[-14px] border-r border-t border-black broder-[1px] ml-[42px] w-[12px] bg-[white] ml-[45px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white"
                      ></span>
                    </div> */}

                    <span className="mt-3 text-xs text-[#186737] font-semibold">
                      {item.title}
                    </span>
                  </div>
                );
              })
            ) : (
              <Skeleton count={3} />
            )}
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default memo(NewDocuments);
