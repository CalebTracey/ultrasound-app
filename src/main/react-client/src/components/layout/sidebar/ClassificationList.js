/* eslint-disable react/prop-types */
import { Spin } from 'antd';
import React, { useState, useEffect, Suspense, lazy } from 'react';

const ClassificationItemListGroup = lazy(() =>
  import('./ClassificationItemListGroup')
);
const ClassificationSubMenuGroup = lazy(() =>
  import('./ClassificationSubMenuGroup')
);

const ClassificationList = ({ classificationItem }) => {
  const { listItems, subMenus } = classificationItem;
  const [allSubMenus, setAllSubLists] = useState(null);
  const [allListItems, setAllItemLists] = useState(null);

  useEffect(() => {
    if (subMenus) {
      setAllSubLists(subMenus);
    }
    if (listItems) {
      setAllItemLists(listItems);
    }
  }, [subMenus, listItems]);

  return (
    <Suspense
      fallback={
        <>
          <Spin />
        </>
      }
    >
      <ClassificationSubMenuGroup allSubMenus={allSubMenus} />
      <ClassificationItemListGroup allListItems={allListItems} />
    </Suspense>
  );
};

export default ClassificationList;
