import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

/* 별찍기 */

export default function StarRating({style = {}, totalStars=5, getStarsValue =f=>f, disabled=true }) {
  const [selectedStars, setSelectedStars] = useState(5);
  const createArray = (len) => [...Array(len)];
  const Star = ({ selected = false, onSelect = f=> f}) =>(
    <FaStar color={selected ? "red":"grey"} onClick={onSelect} />
  );

  /* 별점 보내는 곳 콜백함수 */
  const sandStarsValue =(props)=> {
    getStarsValue(selectedStars);
  }
  
  
  /* 별점 선택 온오프 기능 */
  const ChoseStar=(disabled) =>{
    if (disabled == true){
      return <div float="left" style={{padding:"5px", ...style}}>
    {createArray(totalStars).map((n,i) => (
      <Star key={i} id="#callback-btn"
      selected={selectedStars > i}
      />
      ))}
    </div>
    } else if(disabled == false) {
      return <div style={{padding:"5px", ...style}}>
    {createArray(totalStars).map((n,i) => (
      <Star key={i} id="#callback-btn"
      selected={selectedStars > i}
      onSelect={()=> setSelectedStars(i+1)}
      />
      ))}
      {document.addEventListener('click',sandStarsValue)}
    </div>
    }
  }

  return (<>
  {ChoseStar(disabled)}
    </>
  )
}
