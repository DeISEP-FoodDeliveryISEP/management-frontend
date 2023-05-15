import { Link } from "react-router-dom";
import "../assets/layout.css";

import * as React from "react";
import {
  Card,
  StyledBody,
  StyledAction,
  StyledThumbnail
} from "baseui/card";
import { Button } from "baseui/button";


function PortalCard({title, thumbnail, description, buttonText, buttonLink}) {
  return (<Card
      title={title}
    >
      <StyledThumbnail
        src={'https://source.unsplash.com/user/erondu/300x300'}
      />
      <StyledBody>
        {description}
      </StyledBody>
      <StyledAction>
        <Link to={buttonLink}>
        <Button overrides={{BaseButton: {style: {width: '100%'}}}}>
            {buttonText}
        </Button>
        </Link>
      </StyledAction>
    </Card>);
}

export default function Home() {
  return (
    <div className="content-container">
      <h1>Portal</h1>
      <div
        style={{marginBottom: "2rem"}}
      >This is the DeISEP management system portal. Here, you can customize, edit menu items, and also manage customer orders.</div>
      <div className="card-container">
        <PortalCard
          title="Menu Items"
          buttonLink="menu-items"
          description="Add, edit, or delete items (dishes) of the menu."
          buttonText="Go"
          >
        </PortalCard>
        <PortalCard
          title="Set Meals"
          buttonLink="set-meals"
          description="Set meals are menu item sets that can group different menu items. Add, edit or delete set meals."
          buttonText="Go"
          >
        </PortalCard>
        <PortalCard
          title="Category Management"
          buttonLink="edit-categories"
          description="Edit and add categories for menu items."
          buttonText="Go"
          >
        </PortalCard>
        <PortalCard
          title="Customer Orders"
          buttonLink="customer-orders"
          description="View customer orders and change status."
          buttonText="Go"
          >
        </PortalCard>
      </div>
    </div>
  );
}