import "../assets/menu-items.css";
import MenuItemTable from "../components/MenuItemsTable";
import { ButtonGroup, SHAPE } from "baseui/button-group";
import { Button } from "baseui/button";

export default function MenuItems() {
  return (
    <div className="menu-items-container">
        <h1>Menu Items Management</h1>
        <ButtonGroup shape={SHAPE.pill}>
        <Button>+ New</Button>
        <Button>Edit</Button>
        <Button>Delete</Button>
        </ButtonGroup>
        <MenuItemTable />
    </div>
  );
}