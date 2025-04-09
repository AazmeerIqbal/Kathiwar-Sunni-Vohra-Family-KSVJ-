import React from "react";
import Link from "next/link";

const Cards = ({ Heading, Text, Icon, link }) => {
  return (
    <Link href={link}>
      <div className="cursor-pointer overflow-hidden relative transition-all duration-500 hover:translate-y-2 bg-neutral-50 rounded-lg shadow-xl flex flex-row items-center justify-evenly gap-2 p-4 before:absolute before:w-full hover:before:top-0 before:duration-500 before:-top-1 before:h-1 before:bg-purple-200">
        {Icon}
        <div>
          <span className="font-bold">{Heading}</span>
          <p className="line-clamp-3">{Text}</p>
        </div>
      </div>
    </Link>
  );
};

export default Cards;
