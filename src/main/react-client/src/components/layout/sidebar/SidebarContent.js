import React, { Suspense, lazy } from 'react';
import { useSelector } from 'react-redux';
import SidebarHome from './SidebarHome';

const SidebarList = lazy(() => import('./SidebarList'));

const SidebarContent = () => {
  const { classifications } = useSelector((state) => state.videos);

  return !classifications || classifications.length === 0 ? (
    'Loading...'
  ) : (
    <div className="sidebar-content">
      <SidebarHome />
      <Suspense fallback="Loading...">
        <SidebarList classifications={classifications} />
      </Suspense>
    </div>
  );
};

export default SidebarContent;
