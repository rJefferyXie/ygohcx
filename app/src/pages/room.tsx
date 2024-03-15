"use client"

// React + Next
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';

// Firebase
import { db } from '@/firebase/config';
import { doc, setDoc, onSnapshot } from "firebase/firestore"; 

// Constants
import AvatarIcons from '@/constants/avatarIcons';

// Components
import HealthBar from '@/components/healthBar';
import HealthCalculator from '@/components/healthCalculator';

// Interfaces
import Player from '@/interfaces/player';

const Room = () => {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomData, setRoomData] = useState<any>();
  const [selectedPlayer, setSelectedPlayer] = useState<Player>();
  const [showCalculator, setShowCalculator] = useState(false);

  const navigate = useCallback((destination: string) => {
    router.push(destination);
  }, [router]);

  const leaveRoom = () => {
    const updatedPlayers = roomData.players.filter((player: Player) => {
      return player.username !== username;
    });

    const updatedRoomData = {...roomData, players: updatedPlayers}
    const roomRef = doc(db, 'rooms', roomName);
    setDoc(roomRef, updatedRoomData)

    localStorage.removeItem('roomData');
    navigate("rooms");
  }

  const newGame = () => {
    const updatedPlayers = roomData.players.map((player: Player) => {
      return {...player, health: 8000};
    });

    const updatedRoomData = {...roomData, players: updatedPlayers}
    const roomRef = doc(db, 'rooms', roomName);
    setDoc(roomRef, updatedRoomData)
  }

  const editHealth = (player: Player) => {
    setSelectedPlayer(player);
    setShowCalculator(true);
  }

  useEffect(() => {
    if (!roomName) return;

    const roomRef = doc(db, 'rooms', roomName);
    const unsubscribe = onSnapshot(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        const roomData = snapshot.data();
        roomData.players.map((player: Player) => {
          if (player.username === selectedPlayer?.username) {
            setSelectedPlayer(player);
          }
        })
        setRoomData(roomData);
      } else {
        localStorage.removeItem('roomData');
        navigate("rooms");
      }
    });

    return () => unsubscribe();
  }, [roomName, navigate, selectedPlayer]);

  useEffect(() => {
    const user = localStorage.getItem('userData');
    if (!user) navigate("/");
    setUsername(JSON.parse(user!).username);

    const room = localStorage.getItem('roomData');
    if (!room) navigate("rooms");
    setRoomName(room!);

  }, [navigate]);

  useEffect(() => {
    console.log(roomData);
  }, [roomData]);

  return (
    <div className="w-full relative">
      {showCalculator && <HealthCalculator selectedPlayer={selectedPlayer} roomData={roomData} exit={() => setShowCalculator(false)}></HealthCalculator>}

      <div className="flex justify-center mt-8 mb-4">
        <button 
          className="bg-rose-700 text-xl rounded-md px-3 py-2 mx-2 text-white"
          onClick={leaveRoom}
        >
          Exit Room        
        </button>
        <button 
          className="bg-emerald-600 text-xl rounded-md px-3 py-2 mx-2 text-white"
          onClick={newGame}
        >
          New Game
        </button>
      </div>

      {roomData?.players.map((player: Player, idx: number) => {
        return (
          <div key={idx} className="card bg-sky-900 m-4 p-4">
            <div className="flex">
              <img className="mr-2" src={AvatarIcons[player.avatarIcon].icon} width={96} height={96}></img>
              <div className="flex flex-col w-full">
                <p className="text-2xl w-full mt-auto text-center text-white">{player.username}</p>
                <HealthBar health={player.health}></HealthBar>
              </div>
            </div>

            <button className="btn border-none mt-2 h-14 text-white bg-zinc-800" onClick={() => editHealth(player)}>Change Health</button>
          </div>
        )
      })}
    </div>
  )
}

export default Room;