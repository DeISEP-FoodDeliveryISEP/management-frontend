import * as React from 'react';
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
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
} from 'baseui/modal';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { getCategoryPage } from '../api/category';

// temp data
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

function CategoryTable({data}) {
  return (
    <TableBuilder
      overrides={{Root: {style: {maxHeight: '600px'}}}}
      data={data}
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
  const [isOpen, setIsOpen] = React.useState(false);
  const [categoryName, setCategoryName] = React.useState("");
  const [order, setOrder] = React.useState("");
  const [modalTitle, setModalTitle] = React.useState("");
  const [newCatType, setNewCatType] = React.useState("1");
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [data, setData] = React.useState(Array.from(new Array(5)).fill(DATA1));
  
  React.useEffect(() => {
     getCategoryPage({'page': 1, 'pageSize': 100}).then(res => {
        if (String(res.code) === '1') {
          setData(res.data.records)
          setIsLoaded(true)
          // this.counts = Number(res.data.total)
        } else {
          alert(res.msg || 'Action failed')
        }
      }).catch(err => {
        alert('Error occured.')
        console.log(err)
      })
  }, [])
  
  function close() {
    setIsOpen(false);
    setCategoryName("");
    setOrder("");
  }

  function openModal(mode = "menu-item") {
    setIsOpen(true);
    if (mode === "menu-item") {
      setNewCatType("1");
      setModalTitle("New Menu Item Category");
    }
    else {
      setNewCatType("2");
      setModalTitle("New Set Meal Category");
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const reqBody = {'name': categoryName,'type': newCatType, 'sort': order};
    alert("Sent request:" + JSON.stringify(reqBody));
    close();
  }

  return (
    <div className="menu-items-container">
        <h1>Categories Management</h1>
        <ButtonGroup shape={SHAPE.pill}>
          <Button onClick={() => {openModal("menu-item");}}>+ New Menu Item Category</Button>
          <Button onClick={() => {openModal("set-meals");}}>+ New Set Meals Category</Button>
        </ButtonGroup>
        <CategoryTable data={data}/>

        {/* Modal */}
        <Modal onClose={close} isOpen={isOpen}>
          <ModalHeader>{modalTitle}</ModalHeader>
          <form onSubmit={handleSubmit}>
            <ModalBody>
            <FormControl
              label={() => "Category Name"}
            >
              <Input
                value={categoryName}
                onChange={e => setCategoryName(e.target.value)}
              />
            </FormControl>
            <FormControl
              label={() => "Order"}
            >
              <Input
                value={order}
                onChange={e => setOrder(e.target.value)}
              />
            </FormControl>
            </ModalBody>
            <ModalFooter>
              <ModalButton kind="tertiary" onClick={close} type="button">
                Cancel
              </ModalButton>
              <ModalButton type="submit">
                Save
              </ModalButton>
            </ModalFooter>
          </form>
        </Modal>
    </div>
  );
}