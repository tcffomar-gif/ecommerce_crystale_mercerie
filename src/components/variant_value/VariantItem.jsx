"use client"
import React, { memo } from "react";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";

const VariantItem = memo(( item, onDelete ) => {
  return (
    <div className="border w-fit py-[2rem] px-[3rem] shadow-lg rounded-lg relative">
      <h3 className="text-lg font-semibold mb-2">{item.type.fr}</h3>
      <div className="flex space-x-2">
        {item.array_value.map((size, index) => (
          <button
            key={index}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-or_color2"
          >
            {size}
          </button>
        ))}
      </div>
      <IconButton
        sx={{ position: "absolute", top: "5px", right: "5px" }}
        aria-label="add an valeur"
        onClick={() => onDelete(item.type.fr)}
      >
        <ClearIcon />
      </IconButton>
    </div>
  );
});

export default VariantItem;