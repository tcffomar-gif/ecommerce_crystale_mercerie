import React from "react";
import  './loading.css';
const Loading = () => {
  return (
    <div
    className="w-full h-full"
      style={{  display: "flex",flexDirection:"column" ,justifyContent: "center" ,alignItems:"center" }}
    >
    <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
    </div>
  );
};

export default Loading;
