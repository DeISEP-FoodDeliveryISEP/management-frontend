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
  ROLE
} from 'baseui/modal';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { deleCategory, getCategoryPage, addCategory, editCategory } from '../api/category';

const ADD = 1;
const EDIT = 2;

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

function ButtonsCell({data, editCallback, deleteCallback}) {
  const [css, theme] = useStyletron();

  return (
    <div className={css({display: 'flex', alignItems: 'center'})}>
          <Button
            kind={KIND.secondary}
            size={SIZE.mini}
            overrides={{
              BaseButton: {
                style: {
                  marginLeft: 0,
                },
              },
            }}
            onClick={() => editCallback(data)}
          >
            Edit
          </Button>
          <Button
            kind={KIND.secondary}
            size={SIZE.mini}
            overrides={{
              BaseButton: {
                style: {
                  marginLeft: theme.sizing.scale100,
                },
              },
            }}
            onClick={() => deleteCallback(data)}
          >
            Delete
          </Button>
    </div>
  );
}

function CategoryTable({data, editCallback, deleteCallback}) {
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

      <TableBuilderColumn header="Actions">
        {row => <ButtonsCell data={row} editCallback={editCallback} deleteCallback={deleteCallback} />}
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
  const [addOrEdit, setAddOrEdit] = React.useState(ADD); // 1 for add, 2 for edit
  const [editID, setEditID] = React.useState(0);
  
  React.useEffect(() => {
     initPage()
  }, [])
  
  function close() {
    setIsOpen(false);
    setCategoryName("");
    setOrder("");
  }

  function initPage() {
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
  }

  function openModal(mode) {
    if (mode === "menu-item") {
      setNewCatType("1");
      setModalTitle("New Menu Item Category");
    }
    else if (mode === "set-meals"){
      setNewCatType("2");
      setModalTitle("New Set Meal Category");
    }
    else {
      setModalTitle("Edit Category");
    }
    setIsOpen(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (addOrEdit === ADD) {
      const reqBody = {'name': categoryName,'type': newCatType, 'sort': order};
      addCategory(reqBody).then(res => {
        console.log(res)
        if (res.code === 1) {
          alert('add success!')
          initPage()
          close()
        } else {
          alert('add error')
          console.log(res.msg || 'action failed')
        }
      }).catch(err => {
        alert('request error')
        console.log('request error: ' + err)
      })
    }
    else if (addOrEdit === EDIT) {
      const reqBody = {'id': editID, 'name': categoryName, 'sort': order};
      editCategory(reqBody).then(res => {
        if (res.code === 1) {
          alert('edit success!')
          close()
          initPage()
        } else {
          alert('add error')
          console.log(res.msg || 'action failed')
        }
      }).catch(err => {
        alert('request error')
        console.log('request error: ' + err)
      });
    }
  }

  function handleDelete(data) {
    const deleteId = data.id;
    if (window.confirm("This action deletes the category, proceed?")) {
      deleCategory(deleteId).then(res => {
        if (res.code === 1) {
          alert('Delete success!')
          initPage()
        } else {
          alert("delete failed, message: " + res.msg)
        }
      }).catch(err => {
        alert('Request failed: ' + err)
      })
    }
  }
  
  function handleEdit(data) {
    console.log('edit:', data);
    setAddOrEdit(() => EDIT);
    setEditID(data.id);
    setCategoryName(data.name);
    setOrder(data.sort);
    openModal();
  }

  return (
    <div className="menu-items-container">
        <h1>Categories Management</h1>
        <ButtonGroup shape={SHAPE.pill}>
          <Button onClick={() => {setAddOrEdit(() => ADD); openModal("menu-item");}}>+ New Menu Item Category</Button>
          <Button onClick={() => {setAddOrEdit(() => ADD); openModal("set-meals");}}>+ New Set Meals Category</Button>
        </ButtonGroup>
        <CategoryTable data={data} editCallback={handleEdit} deleteCallback={handleDelete}/>

        {/* Add New Category Modal */}
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