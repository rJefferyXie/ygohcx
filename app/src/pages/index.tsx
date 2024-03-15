"use client"

// React + Next
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';

// Components
import AvatarIcon from '@/components/avatarIcon';

// Constants
import AvatarIcons from '@/constants/avatarIcons';

const Home = () => {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [selectedAvatarIcon, setSelectedAvatarIcon] = useState('');

  const navigate = useCallback(() => {
    router.push("rooms");
  }, [router]);

  const createAccount = () => {
    const userData = {
      username: username,
      avatarIcon: selectedAvatarIcon,
      health: 8000
    }

    localStorage.setItem("userData", JSON.stringify(userData));
    navigate();
  }
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userData') ?? 'null');
    if (user) navigate();
  }, [navigate])

  return (
    <div className="flex flex-col w-full h-screen overflow-y-auto overflow-x-hidden py-4 px-2">
      <h1 className="text-3xl mx-auto">
        Welcome to ygoHCX!
      </h1>

      <p className="mt-2 mx-4 text-center">Please select an avatar icon and enter a username.</p>
      <div className="flex flex-wrap mt-2 justify-center">
        {Object.values(AvatarIcons).map((icon, idx) => {
          return <AvatarIcon key={idx} icon={icon} isSelected={icon.name === selectedAvatarIcon} selectIcon={setSelectedAvatarIcon}/>
        })}
      </div>

      <input 
        type="text" 
        placeholder="Enter a username..." 
        className="input bg-transparent border border-slate-300 w-full max-w-xs mx-auto mt-2 my-4"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      <button 
        className="btn btn-success text-white mx-auto mb-auto w-5/6"
        onClick={createAccount}
      >
        Continue
      </button>
    </div>
  )
}

export default Home;