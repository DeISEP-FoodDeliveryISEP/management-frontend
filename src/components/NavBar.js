import * as React from "react";
import '../assets/navbar.css';
import {
  AppNavBar,
  setItemActive
} from "baseui/app-nav-bar";
import {
  ChevronDown,
  Delete,
  Overflow,
  Upload
} from "baseui/icon";
import { Link } from "react-router-dom";

export const NavBar =  () => {
  const [mainItems, setMainItems] = React.useState([
    { icon: Upload, label: "Main A" },
    {
      active: true,
      icon: ChevronDown,
      label: "Main B",
      navExitIcon: Delete,
      children: [
        { icon: Upload, label: "Secondary A" },
        { icon: Upload, label: "Secondary B" }
      ]
    }
  ]);
  return (
    <AppNavBar
      title={<Link to="/" className="logo-link"><div >DeISEP | Management System</div></Link>}
      // mainItems={mainItems}
      // onMainItemSelect={item => {
      //   setMainItems(prev => setItemActive(prev, item));
      // }}
      username="Thomas Wang"
      usernameSubtitle="5 Stars"
      userItems={[
        { icon: Overflow, label: "User A" },
        { icon: Overflow, label: "User B" }
      ]}
      onUserItemSelect={item => console.log(item)}
    />
  );
}