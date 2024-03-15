"use client"

// React + Next
import { useEffect, useState} from 'react';

// Components
import HealthBar from './healthBar';

// Firebase
import { db } from '@/firebase/config';
import { doc, setDoc, onSnapshot } from "firebase/firestore"; 

// Constants
import AvatarIcons from '@/constants/avatarIcons';

// Interfaces
import Player from '@/interfaces/player';

interface HealthCalculatorProps {
  selectedPlayer: Player | undefined,
  roomData: any,
  exit: Function
}

const HealthCalculator = (props: React.PropsWithChildren<HealthCalculatorProps>) => {
  const {selectedPlayer, roomData, exit} = props;

  const [healthDelta, setHealthDelta] = useState('0');
  const [healthSign, setHealthSign] = useState('');

  const changeHealth = () => {
    const updatedPlayers = roomData.players.map((player: Player) => {
      if (selectedPlayer?.username === player.username) {
        if (healthSign === '+') {
          return {...player, health: player.health + Number(healthDelta)};
        } else {
          return {...player, health: player.health - Number(healthDelta)};
        }
      }
      return player;
    });

    const updatedRoomData = {...roomData, players: updatedPlayers}
    const roomRef = doc(db, 'rooms', roomData.name);
    setDoc(roomRef, updatedRoomData);
    exit();
  }

  const addNumber = (number: string) => {
    if (healthDelta.length > 9) return;
    
    const newHealthDelta = Number(healthDelta + number).toString();
    setHealthDelta(newHealthDelta);
  }

  const resetCalculator = () => {
    setHealthDelta('0');
    setHealthSign('');
  }

  return (
    <div className="flex flex-col fixed z-10 card w-full h-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-zinc-900">
      <div className="card-actions flex mt-4 ml-4">
        <button 
          className="bg-rose-700 text-xl rounded-md px-3 py-2 text-white"
          onClick={() => exit()}
        >
          Back   
        </button>
      </div>
      
      <div className="card-actions mx-auto flex flex-col p-4">
        {selectedPlayer && 
          <div className="card flex flex-row w-full bg-sky-900 my-2 p-4">
            <img className="mr-2" src={AvatarIcons[selectedPlayer.avatarIcon].icon} width={96} height={96}></img>
            <div className="flex flex-col w-full">
              <p className="text-2xl w-full mt-auto text-center text-white">{selectedPlayer.username}</p>
              <HealthBar health={selectedPlayer.health}></HealthBar>
            </div>
          </div>
        }

        <div className="flex w-full h-20 my-1 text-5xl bg-zinc-700 shadow-lg rounded-3xl items-center justify-end p-4">
          {healthSign + healthDelta}
        </div>

        <div className="flex mx-auto my-1">
          <button className="w-24 h-24 mx-1 text-2xl bg-zinc-700 shadow-lg  text-white rounded-full" onClick={() => addNumber('7')}>7</button>
          <button className="w-24 h-24 mx-1 text-2xl bg-zinc-700 shadow-lg  text-white rounded-full" onClick={() => addNumber('8')}>8</button>
          <button className="w-24 h-24 mx-1 text-2xl bg-zinc-700 shadow-lg  text-white rounded-full" onClick={() => addNumber('9')}>9</button>
          <button className="w-24 h-24 mx-1 text-2xl bg-zinc-700 shadow-lg  text-white rounded-full" onClick={resetCalculator}>C</button>
        </div>
        <div className="flex mx-auto my-1">
          <button className="w-24 h-24 mx-1 text-2xl bg-zinc-700 shadow-lg  text-white rounded-full" onClick={() => addNumber('4')}>4</button>
          <button className="w-24 h-24 mx-1 text-2xl bg-zinc-700 shadow-lg  text-white rounded-full" onClick={() => addNumber('5')}>5</button>
          <button className="w-24 h-24 mx-1 text-2xl bg-zinc-700 shadow-lg  text-white rounded-full" onClick={() => addNumber('6')}>6</button>
          <button className="w-24 h-24 mx-1 text-3xl bg-zinc-700 shadow-lg  text-white rounded-full" onClick={() => setHealthSign("-")}>-</button>
        </div>
        <div className="flex mx-auto my-1">
          <button className="w-24 h-24 mx-1 text-2xl bg-zinc-700 shadow-lg  text-white rounded-full" onClick={() => addNumber('1')}>1</button>
          <button className="w-24 h-24 mx-1 text-2xl bg-zinc-700 shadow-lg  text-white rounded-full" onClick={() => addNumber('2')}>2</button>
          <button className="w-24 h-24 mx-1 text-2xl bg-zinc-700 shadow-lg  text-white rounded-full" onClick={() => addNumber('3')}>3</button>
          <button className="w-24 h-24 mx-1 text-2xl bg-zinc-700 shadow-lg  text-white rounded-full" onClick={() => setHealthSign("+")}>+</button>
        </div>
        <div className="flex mx-auto my-1">
          <button className="w-72 h-24 mr-2 text-2xl bg-zinc-700 shadow-lg  text-white rounded-full" onClick={() => addNumber('0')}>0</button>
          <button className="w-24 h-24 ml-2 text-2xl bg-emerald-600 shadow-lg  text-white rounded-full" onClick={changeHealth}>=</button>
        </div>
      </div>
    </div>
  )
}

export default HealthCalculator;