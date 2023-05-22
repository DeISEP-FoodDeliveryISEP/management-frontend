import * as React from "react";
import { Navigation } from "baseui/side-navigation";
import {useLocation, useNavigate} from 'react-router-dom';
import { BiReceipt, BiFoodMenu, BiCategory, BiDish } from "react-icons/bi";

const SideBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
  return (
    <Navigation
      items={[
        { title:
          <div style={{display: "flex", alignItems: "center"}}>
            <BiFoodMenu size={18} style={{marginRight: "9px"}}/>
            Menu Items
          </div>
          , itemId: "/menu-items" },
        { title:
          <div style={{display: "flex", alignItems: "center"}}>
            <BiDish size={18} style={{marginRight: "9px"}}/>
            Set Meals
          </div>
          , itemId: "/set-meals" },
        {
          title:
          <div style={{display: "flex", alignItems: "center"}}>
            <BiCategory size={18} style={{marginRight: "9px"}}/>
            Edit Categories
          </div>,
          itemId: "/edit-categories"
        },
        {
          title:
          <div style={{display: "flex", alignItems: "center"}}>
            <BiReceipt size={18} style={{marginRight: "9px"}}/>
            Customer Orders
          </div>,
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