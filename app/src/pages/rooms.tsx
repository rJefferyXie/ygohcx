"use client"

// React + Next
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';

// Firebase
import { db } from '@/firebase/config';
import { doc, setDoc, deleteDoc, collection, onSnapshot, serverTimestamp } from "firebase/firestore"; 
import { Timestamp } from '@firebase/firestore-types';

interface Room {
  name: string,
  players: string[],
  dateCreated: string
}

const Rooms = () => {
  const router = useRouter();

  const [user, setUser] = useState('');
  const [rooms, setRooms] = useState<any[]>([]);
  const [newRoomName, setNewRoomName] = useState('');

  const createRoom = () => {
    if (!newRoomName) return; // put alert telling ppl they need rom name

    const roomData = {
      name: newRoomName,
      players: [],
      dateCreated: serverTimestamp()
    }

    const roomRef = doc(db, 'rooms', newRoomName);
    setDoc(roomRef, roomData)
  }

  const joinRoom = (room: Room) => {
    if (room.players.includes(user)) return;

    room.players.push(user);
    const roomRef = doc(db, 'rooms', room.name);
    setDoc(roomRef, room)

    localStorage.setItem('roomData', room.name);
    navigate('room');
  }

  const deleteRoom = async (roomName: string) => {
    if (!roomName) return;

    await deleteDoc(doc(db, 'rooms', roomName))
  }

  const firebaseTimestampToJSDate = (timestamp: Timestamp) => {
    if (timestamp && timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString();
    }

    return timestamp;
  };

  const navigate = useCallback((destination: string) => {
    router.push(destination);
  }, [router]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'rooms'), (snapshot) => {
      const roomData: any = [];
      snapshot.forEach((doc) => {
        const room = doc.data();
        const dateCreated = firebaseTimestampToJSDate(room.dateCreated);
        roomData.push({...room, dateCreated});
      });
      setRooms(roomData);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const user = localStorage.getItem('userData');
    if (!user) navigate("/");
    setUser(JSON.parse(user!))

    const room = localStorage.getItem('roomData');
    if (room) navigate("room");
  }, [navigate]);

  return (
    <div className="flex flex-col w-screen h-screen overflow-y-auto overflow-x-hidden">
      <div className="flex my-4 p-4">
        <input 
          type='text'
          placeholder='Enter room name...'
          className="input input-bordered mr-2 w-2/3"
          value={newRoomName}
          onChange={(event) => setNewRoomName(event.target.value)}
        />

        <button 
          className="text-md bg-emerald-600 w-1/3 px-3 py-2 ml-2 text-white rounded-md duration-200 ease-in-out" 
          onClick={createRoom}
        >
          Create Room
        </button>
      </div>

      <div className='flex flex-col w-full px-4'>
        {rooms.map((room, idx) => {
          return (
            <div key={idx} className="flex flex-col w-full my-1">
              <div className="flex flex-col stats shadow bg-sky-950">
                <div className="stat py-2">
                  <div className="stat-title text-slate-50 text-lg">Room Name</div>
                  <div className="stat-value text-teal-200">{room.name}</div>
                </div>
                
                <div className="stat py-2">
                  <div className="stat-title text-slate-50 text-lg">Number of Players</div>
                  <div className="stat-value text-teal-200">{room.players.length}</div>
                </div>
                
                <div className="stat py-2">
                  <div className="stat-title text-slate-50 text-lg">Date Created</div>
                  <div className="stat-desc text-fuchsia-200 text-base">{room.dateCreated}</div>
                </div>

                <div className="stat py-2">
                  <div className="flex mx-auto my-2">
                    <button 
                      className="bg-rose-700 text-xl rounded-md px-3 py-2 mx-2 text-white"
                      onClick={() => deleteRoom(room.name)}
                    >
                      Delete Room
                    </button>
                    <button 
                      className="bg-emerald-600 text-xl rounded-md px-3 py-2 mx-2 text-white"
                      onClick={() => joinRoom(room)}
                    >
                      Join Room
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Rooms;