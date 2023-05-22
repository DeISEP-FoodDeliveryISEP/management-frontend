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

const DATA1 = {
  "createTime": "2023-05-10 13:59:59",
  "createUser": 0,
  "id": 0,
  "name": "East Asian",
  "sort": 1,
  "type": 1,
  "updateTime": "2023-05-17 13:59:59",
  "updateUser": 0
};

const DATA2 = {
  "createTime": "2023-05-10 13:59:59",
  "createUser": 0,
  "id": 1,
  "name": "South Asian",
  "sort": 2,
  "type": 2,
  "updateTime": "2023-05-17 13:59:59",
  "updateUser": 0
};

// MOCK DATA
const DISHDATA = Array.from(new Array(5)).fill(DATA1);
DISHDATA.push(DATA2);

function CategoryCell({category}) {
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

function CategoryTypeCell({categoryType}) {
  const [css, theme] = useStyletron();
  return (
    <div className={css({display: 'flex', alignItems: 'center'})}>
      <span
        className={css({...theme.typography.ParagraphSmall})}
      >
        {categoryType}
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

function DisplayOrderCell({displayOrder}) {
  const [css, theme] = useStyletron();
  return (
    <div className={css({display: 'flex', alignItems: 'center'})}>
      <span
        className={css({...theme.typography.ParagraphSmall})}
      >
        {displayOrder}
      </span>
    </div>
  );
}

function CategoryTable() {
  return (
    <TableBuilder
      overrides={{Root: {style: {maxHeight: '600px'}}}}
      data={DISHDATA}
    >

      <TableBuilderColumn header="Category Name">
        {row => (
          <CategoryCell
            category={row.name}
          />
        )}
      </TableBuilderColumn>

      <TableBuilderColumn header="Category Type">
        {row => (
          <CategoryTypeCell
            categoryType={row.type === 1 ? "Menu Item" : "Set Menu"}
          />
        )}
      </TableBuilderColumn>

      <TableBuilderColumn header="Last Edited">
        {row => <LastEditedDateCell date={row.updateTime} />}
      </TableBuilderColumn>

      <TableBuilderColumn header="Display Order">
        {row => <DisplayOrderCell displayOrder={row.sort} />}
      </TableBuilderColumn>

    </TableBuilder>
  );
}


export default function EditCategories() {
  return (
    <div className="menu-items-container">
        <h1>Categories Management</h1>
        <ButtonGroup shape={SHAPE.pill}>
        <Button>+ New Menu Item Category</Button>
        <Button>+ New Set Menu Category</Button>
        </ButtonGroup>
        <CategoryTable />
    </div>
  );
}