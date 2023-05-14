import './App.css';
import { Routes, Route, Outlet } from "react-router-dom";
import Login from "./pages/Login.js";
import Home from "./pages/Home.js";
import NoMatch from "./pages/NoMatch";
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { LightTheme, BaseProvider } from 'baseui';
import { NavBar } from './components/NavBar';
const engine = new Styletron();

function App() {
  return (
    <div>
      <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}></BaseProvider>
      {/* Routes nest inside one another. Nested route paths build upon
            parent route paths, and nested route elements render inside
            parent route elements. See the note about <Outlet> below. */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
          <Route path="*" element={<NoMatch />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
      </StyletronProvider>
    </div>
  );
}

function Layout() {
  return (
    <div>
      <NavBar></NavBar>

      {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
      <Outlet />
    </div>
  );
}

export default App;
