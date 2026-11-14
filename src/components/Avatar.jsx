import React from "react";

const Avatar = ({ 
  seed = "Ritam Majumdar", // The name used to generate the unique avatar
  size = "w-10 h-10", 
  className = "" 
}) => {
  // DiceBear 10.x HTTP API using the 'adventurer' collection
  const avatarUrl = `https://api.dicebear.com/10.x/adventurer/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

  return (
    <div className={`overflow-hidden rounded-full bg-slate-200 flex-shrink-0 ${size} ${className}`}>
      <img 
        src={avatarUrl} 
        alt={`${seed}'s avatar`} 
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
};

export default Avatar;