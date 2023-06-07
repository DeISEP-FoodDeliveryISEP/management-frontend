import './App.css';
import './assets/layout.css';
import { Routes, Route, Outlet } from "react-router-dom";

import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { LightTheme, BaseProvider } from 'baseui';
import { NavBar } from './components/NavBar';
import SideBar from './components/SideBar';

import Login from "./pages/Login.js";
import Home from "./pages/Home.js";
import MenuItems from "./pages/MenuItems";
import SetMeals from "./pages/SetMeals";
import EditCategories from "./pages/EditCategories";
import CustomerOrders from "./pages/CustomerOrders";
import NoMatch from "./pages/NoMatch";

import { ToasterContainer } from 'baseui/toast';
const engine = new Styletron();

function App() {
  return (
    <>
      <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>
      {/* Routes nest inside one another. Nested route paths build upon
            parent route paths, and nested route elements render inside
            parent route elements. See the note about <Outlet> below. */}
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomeLayout />}>
            <Route index element={<Home />} />
            <Route path="/menu-items" element={<MenuItems />}/>
            <Route path="/set-meals" element={<SetMeals />}/>
            <Route path="/edit-categories" element={<EditCategories />}/>
            <Route path="/customer-orders" element={<CustomerOrders />}/>
          </Route>

          {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
          <Route path="*" element={<NoMatch />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
      </BaseProvider>
      </StyletronProvider>
    </>
  );
}

function Layout() {
  return (
    <>
      <NavBar></NavBar>
      {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
      <Outlet />
      <ToasterContainer autoHideDuration={4000}></ToasterContainer>
    </>
  );
}

function HomeLayout() {
  return (
    <div className="home-container">
      <div className="home-layout">
        <div className="sidebar">
          <SideBar/>
        </div>
        <Outlet />
      </div>
    </div>
    
  );
}

export default App;
