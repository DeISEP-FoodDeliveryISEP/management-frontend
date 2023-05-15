import { Link } from "react-router-dom";
export default function Home() {
  return (
    <div>
      <h1>Portal</h1>
      <ul>
        <li><Link to="/menu-items">Menu Items</Link></li>
        <li><Link to="/menu-items">Set Meals</Link></li>
        <li><Link to="/menu-items">Edit Categories</Link></li>
        <li><Link to="/menu-items">Customer Orders</Link></li>
      </ul>
    </div>
  );
}