import "../assets/menu-items.css";
import { ButtonGroup, SHAPE } from "baseui/button-group";
import {
  TableBuilder,
  TableBuilderColumn,
} from 'baseui/table-semantic';
import {Avatar} from 'baseui/avatar';
import {Button, KIND, SIZE} from 'baseui/button';
import {Tag} from 'baseui/tag';
import {useStyletron} from 'baseui';

const SET = {
  "categoryId": 0,
  "categoryName": "EastAsian",
  "code": "",
  "createTime": "2023-05-10 13:59:59",
  "createUser": 0,
  "description": "This set contains a kebab and a drink.",
  "id": 0,
  "image": "https://media.istockphoto.com/id/851493796/fr/photo/gros-plan-du-sandwich-kebab.jpg?s=612x612&w=0&k=20&c=c7ONnq-rtvRlsb3dLmw8K8M9dsewME_XotYGSOzI2Bs=",
  "name": "Kebab Set",
  "price": 15.3,
  "setmealDishes": [
    {
      "copies": 0,
      "createTime": "",
      "createUser": 0,
      "dishId": 0,
      "id": 0,
      "isDeleted": 0,
      "name": "",
      "price": 0,
      "setmealId": 0,
      "sort": 0,
      "updateTime": "",
      "updateUser": 0
    }
  ],
  "status": 1,
  "updateTime": "2023-05-10 13:59:59",
  "updateUser": 0
}

const SETDATA = Array.from(new Array(20)).fill(SET);

function SetItemContentCell({src, title, description}) {
  const [css, theme] = useStyletron();
  return (
    <div className={css({display: 'flex', alignItems: 'center'})}>
      <Avatar size="48px" src={src} />
      <div
        className={css({
          paddingLeft: theme.sizing.scale550,
          whiteSpace: 'nowrap',
        })}
      >
        <p
          className={css({
            ...theme.typography.LabelSmall,
            margin: 0,
          })}
        >
          {title}
        </p>
        <p
          className={css({
            ...theme.typography.ParagraphSmall,
            marginBottom: 0,
            marginTop: '4px',
          })}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

function SetPriceCell({value, delta}) {
  const [css, theme] = useStyletron();
  return (
    <div className={css({display: 'flex', alignItems: 'center'})}>
      <span
        className={css({...theme.typography.MonoParagraphSmall})}
      >
        {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'EUR',
        }).format(value)}
      </span>
    </div>
  );
}

function SetCategoryCell({category}) {
  const [css, theme] = useStyletron();
  return (
    <div className={css({display: 'flex', alignItems: 'center'})}>
      <span
        className={css({...theme.typography.ParagraphSmall})}
      >
        {category}
      </span>
    </div>
  );
}

function LastEditedDateCell({date}) {
  const [css, theme] = useStyletron();
  return (
    <div className={css({display: 'flex', alignItems: 'center'})}>
      <span
        className={css({...theme.typography.MonoParagraphSmall})}
      >
        {date}
      </span>
    </div>
  );
}


function MenuItemTable() {
  return (
    <TableBuilder
      overrides={{Root: {style: {maxHeight: '600px'}}}}
      data={SETDATA}
    >
      <TableBuilderColumn header="Set Item">
        {row => (
          <SetItemContentCell
            src={row.image}
            title={row.name}
            description={row.description}
          />
        )}
      </TableBuilderColumn>

      <TableBuilderColumn header="Set Category">
        {row => (
          <SetCategoryCell
            category={row.categoryName}
          />
        )}
      </TableBuilderColumn>

      <TableBuilderColumn header="Set Price">
        {row => <SetPriceCell value={row.price} />}
      </TableBuilderColumn>

      <TableBuilderColumn header="Last Edited">
        {row => <LastEditedDateCell date={row.updateTime} />}
      </TableBuilderColumn>

      <TableBuilderColumn header="Status">
        {row => row.status ? "activated" : "deactivated"}
      </TableBuilderColumn>

      {/* <TableBuilderColumn header="Buttons">
        {row => <ButtonsCell labels={row.list} />}
      </TableBuilderColumn> */}
    </TableBuilder>
  );
}

export default function SetMeals() {
  return (
    <div className="menu-items-container">
        <h1>Set Meals Management</h1>
        <ButtonGroup shape={SHAPE.pill}>
        <Button>+ New</Button>
        <Button>Edit</Button>
        <Button>Delete</Button>
        </ButtonGroup>
        <MenuItemTable />
    </div>
  );
}