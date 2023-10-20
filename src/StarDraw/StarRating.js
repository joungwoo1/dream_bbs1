import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

export default function StarRating({ style = {}, totalStars=5, getStarsValue =f=>f}) {
  const [selectedStars, setSelectedStars] = useState(5);
  const createArray = (len) => [...Array(len)];
  const Star = ({ selected = false, onSelect = f=> f}) =>(
    <FaStar color={selected ? "red":"grey"} onClick={onSelect}/>
  );

  const sandStarsValue =(props)=> {
    getStarsValue(selectedStars);
  }; 

  return (
    <div style={{padding:"5px", ...style}}>
    {createArray(totalStars).map((n,i) => (
      <Star key={i} id="#callback-btn"
      selected={selectedStars > i}
      onSelect={()=> setSelectedStars(i+1)} />
      ))}
      {selectedStars} / {totalStars}
      {document.addEventListener('click',sandStarsValue)}
    </div>
  )
}
