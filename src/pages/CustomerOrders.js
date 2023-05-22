import "../assets/menu-items.css";
import { ButtonGroup, SHAPE } from "baseui/button-group";
import {
  TableBuilder,
  TableBuilderColumn,
} from 'baseui/table-semantic';
import {useStyletron} from 'baseui';
import { Input } from "baseui/input";
import * as React from "react";
import {DatePicker} from 'baseui/datepicker';
import {addDays} from 'date-fns';
import { Button } from "baseui/button";

const ORDER = {
  "address": "21 Rue de Vanves, PARIS 75012",
  "addressBookId": 0,
  "amount": 16.5,
  "checkoutTime": "2023-05-10 13:59:59",
  "consignee": "",
  "id": 0,
  "number": "12345678",
  "orderDetail": [
    {
      "amount": 0,
      "dishFlavor": "",
      "dishId": 0,
      "id": 0,
      "image": "",
      "name": "",
      "number": 0,
      "orderId": 0,
      "setmealId": 0
    }
  ],
  "orderTime": "2023-05-10 13:59:59",
  "payMethod": 0,
  "phone": "07 12 34 56 78",
  "remark": "",
  "status": 2,
  "userId": 0,
  "userName": "davidwu123"
};

// MOCK DATA
const ORDERDATA = Array.from(new Array(5)).fill(ORDER);

function OrderNumberCell({orderNumber}) {
  const [css, theme] = useStyletron();
  return (
    <div className={css({display: 'flex', alignItems: 'center'})}>
      <span
        className={css({...theme.typography.ParagraphSmall})}
      >
        {orderNumber}
      </span>
    </div>
  );
}

function OrderStatusCell({orderStatus}) {
  const [css, theme] = useStyletron();
  let resultString = "Undefined Status"
  // 1待付款，2待派送，3已派送，4已完成，5已取消
  if (orderStatus === 1)  {
    resultString = "Payment pending"
  }
  else if (orderStatus === 2) {
    resultString = "To be delivered"
  }
  else if (orderStatus === 3) {
    resultString = "Delivered"
  }
  else if (orderStatus === 4) {
    resultString = "Order completed"
  }
  else if (orderStatus === 5) {
    resultString = "Order canceled"
  }

  return (
    <div className={css({display: 'flex', alignItems: 'center'})}>
      <span
        className={css({...theme.typography.ParagraphSmall})}
      >
        {resultString}
      </span>
    </div>
  );
}

function UserCell({username}) {
  const [css, theme] = useStyletron();
  return (
    <div className={css({display: 'flex', alignItems: 'center'})}>
      <span
        className={css({...theme.typography.ParagraphSmall})}
      >
        {username}
      </span>
    </div>
  );
}

function PhoneCell({phoneNumber}) {
  const [css, theme] = useStyletron();
  return (
    <div className={css({display: 'flex', alignItems: 'center'})}>
      <span
        className={css({...theme.typography.ParagraphSmall})}
      >
        {phoneNumber}
      </span>
    </div>
  );
}

function AddressCell({address}) {
  const [css, theme] = useStyletron();
  return (
    <div className={css({display: 'flex', alignItems: 'center'})}>
      <span
        className={css({...theme.typography.ParagraphSmall})}
      >
        {address}
      </span>
    </div>
  );
}

function OrderTimeCell({orderTime}) {
  const [css, theme] = useStyletron();
  return (
    <div className={css({display: 'flex', alignItems: 'center'})}>
      <span
        className={css({...theme.typography.ParagraphSmall})}
      >
        {orderTime}
      </span>
    </div>
  );
}

function ReceivedAmountCell({receivedAmount}) {
  const [css, theme] = useStyletron();
  return (
     <div className={css({display: 'flex', alignItems: 'center'})}>
      <span
        className={css({...theme.typography.MonoParagraphSmall})}
      >
        {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'EUR',
        }).format(receivedAmount)}
      </span>
    </div>
  );
}

function CustomerOrdersTable() {
  return (
    <TableBuilder
      overrides={{Root: {style: {maxHeight: '600px'}}}}
      data={ORDERDATA}
    >

      <TableBuilderColumn header="Order Number">
        {row => (
          <OrderNumberCell
            orderNumber={row.number}
          />
        )}
      </TableBuilderColumn>

      <TableBuilderColumn header="Order Status">
        {row => (
          <OrderStatusCell
            orderStatus={row.status}
          />
        )}
      </TableBuilderColumn>

      <TableBuilderColumn header="Username">
        {row => (
          <UserCell
            username={row.userName}
          />
        )}
      </TableBuilderColumn>

      <TableBuilderColumn header="Phone">
        {row => (
          <PhoneCell
            phoneNumber={row.phone}
          />
        )}
      </TableBuilderColumn>

      <TableBuilderColumn header="Address">
        {row => (
          <AddressCell
            address={row.address}
          />
        )}
      </TableBuilderColumn>

      <TableBuilderColumn header="Order Time">
        {row => (
          <OrderTimeCell
            orderTime={row.orderTime}
          />
        )}
      </TableBuilderColumn>

      <TableBuilderColumn header="Received Amount">
        {row => (
          <ReceivedAmountCell
            receivedAmount={row.amount}
          />
        )}
      </TableBuilderColumn>

    </TableBuilder>
  );
}


export default function CustomerOrders() {
  const [css] = useStyletron();
  const [value, setValue] = React.useState("");
  const [rangeDate, setRangeDate] = React.useState([
    new Date(),
    addDays(new Date(), 4),
  ]);

  return (
    <div className="menu-items-container">
        <h1>Customer Orders</h1>
        <div className={css({
          display: 'flex',
          gap: '12px',
        })}>
          <Input
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="Search order number..."
            clearOnEscape
            className={css({
              flexGrow: "1"
            })}
          />
          <DatePicker
            range
            value={rangeDate}
            onChange={({date}) => setRangeDate(date)}
            placeholder="YYYY/MM/DD – YYYY/MM/DD"
            className={css({
              flexGrow: "2"
            })}
          />
          <Button onClick={() => alert("click")}>Search</Button>
        </div>
        <CustomerOrdersTable />
    </div>
  );
}