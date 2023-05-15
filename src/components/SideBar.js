import * as React from "react";
import { Navigation } from "baseui/side-navigation";
import {useLocation, useNavigate} from 'react-router-dom';

const SideBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
  return (
    <Navigation
      items={[
        { title: "Menu Items", itemId: "/menu-items" },
        { title: "Set Meals", itemId: "/set-meals" },
        {
          title: "Edit Categories",
          itemId: "/edit-categories"
        },
        {
          title: "Customer Orders",
          itemId: "/customer-orders"
        }
      ]}
      activeItemId={location.pathname}
      onChange={({ event, item }) => {
        // prevent page reload
        event.preventDefault();
        navigate(item.itemId);
        // history.push(item.itemId);
      }}
    />
  );
}

export default SideBar;