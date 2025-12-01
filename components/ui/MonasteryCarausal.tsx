// "use client";
// import React, { useState } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// export type MonasteryType = {
//   name: string;
//   villageOrTown: string;
//   district: string;
//   images: string[];
// };

// const MonasteryCarousel = ({ monasteries }: { monasteries: MonasteryType[] }) => {
//   const [index, setIndex] = useState(0);

//   const prevSlide = () => {
//     setIndex((prev) => (prev === 0 ? monasteries.length - 1 : prev - 1));
//   };

//   const nextSlide = () => {
//     setIndex((prev) => (prev === monasteries.length - 1 ? 0 : prev + 1));
//   };

//   const item = monasteries[index];

//   return (
//     <div className="flex items-center justify-center gap-4 w-full max-w-3xl mx-auto mt-10">
//       <button onClick={prevSlide} className="text-3xl font-bold">
//         <ChevronLeft />
//       </button>

//       <div className="w-96 bg-white rounded-xl shadow-xl overflow-hidden">
//         <img
//           src={item?.images[0]}
//           alt={item?.name}
//           className="w-full h-56 object-cover"
//         />
//         <div className="p-4 text-center">
//           <h2 className="text-xl font-semibold">{item?.name}</h2>
//           <p className="text-gray-500 text-sm">
//             {item?.villageOrTown} — {item?.district}
//           </p>
//         </div>
//       </div>

//       <button onClick={nextSlide} className="text-3xl font-bold">
//         <ChevronRight />
//       </button>
//     </div>
//   );
// };

// export default MonasteryCarousel;

"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Types } from "mongoose";

export type MonasteryType = {
    _id : Types.ObjectId
  name: string;
  villageOrTown: string;
  district: string;
  images: string[];
};

const MonasteryCarousel = ({ monasteries }: { monasteries: MonasteryType[] }) => {
  const [index, setIndex] = useState(0);

  const prevSlide = () => {
    setIndex((prev) => (prev === 0 ? monasteries.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setIndex((prev) => (prev === monasteries.length - 1 ? 0 : prev + 1));
  };

  const item = monasteries[index];

  return (
    <div className="flex items-center justify-center gap-6 max-w-4xl mx-auto mt-8 px-4">
      <button
        onClick={prevSlide}
        aria-label="Previous monastery"
        className="p-3 rounded-full bg-indigo-200 text-indigo-700 hover:bg-indigo-300 shadow-md transition"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <div className="w-96 bg-white rounded-2xl shadow-2xl overflow-hidden border border-indigo-300 hover:shadow-indigo-400 transition-shadow duration-300 cursor-pointer">
        <img
          src={item?.images[0]}
          alt={item?.name}
          className="w-full h-60 object-cover transform transition-transform duration-500 hover:scale-105"
        />
        <div className="p-5 text-center bg-gradient-to-t from-indigo-100 to-transparent">
          <h2 className="text-2xl font-semibold text-indigo-900">{item?.name}</h2>
          <p className="text-indigo-600 text-sm mt-1 font-light">
            {item?.villageOrTown} — {item?.district}
          </p>
        </div>
      </div>

      <button
        onClick={nextSlide}
        aria-label="Next monastery"
        className="p-3 rounded-full bg-indigo-200 text-indigo-700 hover:bg-indigo-300 shadow-md transition"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default MonasteryCarousel;
