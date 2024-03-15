"use client"

// React + Next
import React from 'react';

interface HealthBarProps {
  health: number;
}

const HealthBar = (props: React.PropsWithChildren<HealthBarProps>) => {
  const { health } = props;

  const healthPercentage = (health / 8000) * 100;

  const getColor = () => {
    if (healthPercentage >= 50) {
      return `rgba(${255 - (healthPercentage - 50) * 5}, 255, 0, 0.75)`;
    } else {
      return `rgba(255, ${(healthPercentage * 5)}, 0, 0.75)`;
    }
  };

  const fillStyle = {
    width: `${healthPercentage}%`,
    backgroundColor: getColor(),
  };

  return (
    <div className="mb-auto mt-2 w-full h-11 overflow-hidden relative rounded-3xl bg-zinc-500 border border-black">
      <p className="absolute text-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl" style={{textShadow: '1px 1px 1px black'}}>{health}</p>
      <div className="flex h-full rounded-xl transition-all duration-700 ease-in-out" style={fillStyle}></div>
    </div>
  );
};

export default HealthBar;