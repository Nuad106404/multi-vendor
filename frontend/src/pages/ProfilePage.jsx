// ProfilePage.jsx
import React, { useState } from 'react';
import Header from '../components/Layout/Header';
import ProfileSidebar from '../components/Profile/ProfileSidebar.jsx';
import ProfileContent from '../components/Profile/ProfileContent.jsx';

const ProfilePage = () => {
  const [active, setActive] = useState(1);

  return (
    <div>
      <Header />
      <div className="flex flex-col lg:flex-row bg-[#f9f9f9] py-10 px-4 lg:px-10">
        <div className="w-full lg:w-1/4 mb-8 lg:mb-0"> {/** Full width on mobile, quarter width on large screens */}
          <ProfileSidebar active={active} setActive={setActive} />
        </div>
        <div className="w-full lg:w-3/4 bg-white shadow-md rounded-lg p-6">
          <ProfileContent active={active} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
