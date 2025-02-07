import React from "react";

export const Loader = () => {
  return (
    <div className="loader">
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
    </div>
  )
}

export const FullScreenLoader=()=>{
  return (<div className="w-full h-[100vh] flex items-center justify-center bg-white fixed left-0 top-0 z-[999]">
    <Loader />
  </div>);
}




