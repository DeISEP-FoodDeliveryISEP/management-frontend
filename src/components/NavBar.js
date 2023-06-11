import * as React from "react";
import '../assets/navbar.css';
import {
  AppNavBar
} from "baseui/app-nav-bar";
import { Link } from "react-router-dom";
import { HiOutlineLogout } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { logoutApi } from "../api/login";
import { toaster } from "baseui/toast";

export const NavBar =  () => {
  
  const [userInfo, setUserInfo] = React.useState({});
  const [username, setUsername] = React.useState("");
  const [name, setName] = React.useState("");
  const navigate = useNavigate();

  React.useEffect(()=>{
    const curUserInfo = JSON.parse(localStorage.getItem('userInfo'));
    setUserInfo(curUserInfo);
    if (curUserInfo !== null) {
      setName(curUserInfo['name']);
      setUsername(curUserInfo['username']);
    }
    else {
      toaster.warning("*local* User not login, redirect");
      navigate("/login");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  async function handleLogout() {
        let res = await logoutApi();
        if (String(res.code) === '1') {// login success
            localStorage.removeItem('userInfo');
            navigate("/login");
        } else {
            toaster.warning(res.msg);
        }
    }

  return (
    <AppNavBar
      title={<Link to="/" className="logo-link"><div ><span style={{color: "#FFD643"}}>De</span>ISEP | Management System</div></Link>}
      username={name === "管理员" ? "Administrator" : name}
      usernameSubtitle={username}
      userItems={[
        { icon: HiOutlineLogout, label: "Logout" }
      ]}
      onUserItemSelect={item => {
        if (item.label === "Logout") {
          handleLogout();
        }
      }}
    />
  );
}