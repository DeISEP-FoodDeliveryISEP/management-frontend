import * as React from 'react';
import "../assets/menu-items.css";
import { ButtonGroup, SHAPE } from "baseui/button-group";
import {
  TableBuilder,
  TableBuilderColumn,
} from 'baseui/table-semantic';
import {Button, KIND, SIZE} from 'baseui/button';
import {useStyletron} from 'baseui';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton
} from 'baseui/modal';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { toaster } from "baseui/toast";
import { checkNotLogin } from '../common/utils';
import { useNavigate } from 'react-router-dom';
import { addEmployee, editEmployee, enableOrDisableEmployee, getMemberList } from '../api/member';
const ADD = 1;
const EDIT = 2;

function TextCell({text}) {
  const [css, theme] = useStyletron();
  return (
    <div className={css({display: 'flex', alignItems: 'center'})}>
      <span
        className={css({...theme.typography.ParagraphSmall})}
      >
        {text}
      </span>
    </div>
  );
}

function ButtonsCell({data, editCallback, deleteCallback, isAdmin}) {
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
          {isAdmin ? <Button
            kind={KIND.secondary}
            size={SIZE.mini}
            overrides={{
              BaseButton: {
                style: {
                  marginLeft: theme.sizing.scale100,
                  color: data.status === 1 ? "red" : "green"
                },
              },
            }}
            onClick={() => deleteCallback(data)}
          >
            {data.status === 1 ? "Disable" : "Enable"}
          </Button>
          : ""}
          
    </div>
  );
}

function CategoryTable({data, editCallback, deleteCallback, isAdmin}) {
  return (
    <TableBuilder
      overrides={{Root: {style: {maxHeight: '600px'}}}}
      data={data}
    >

      <TableBuilderColumn header="Account Name">
        {row => (
          <TextCell
            text={row.name}
          />
        )}
      </TableBuilderColumn>

      <TableBuilderColumn header="Account Username">
        {row => (
          <TextCell
            text={row.username}
          />
        )}
      </TableBuilderColumn>

      <TableBuilderColumn header="Number">
        {row => (
          <TextCell
            text={row.phone}
          />
        )}
      </TableBuilderColumn>

      <TableBuilderColumn header="Status">
        {row => (
          <TextCell
            text={row.status === 1 ? "Enabled" : "Disabled"}
          />
        )}
      </TableBuilderColumn>

      <TableBuilderColumn header="Actions">
        {row => <ButtonsCell isAdmin={isAdmin} data={row} editCallback={editCallback} deleteCallback={deleteCallback} />}
      </TableBuilderColumn>
    </TableBuilder>
  );
}


export default function Member() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [modalTitle, setModalTitle] = React.useState("");
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [addOrEdit, setAddOrEdit] = React.useState(ADD); // 1 for add, 2 for edit
  const [editID, setEditID] = React.useState(0);
  //
  const [username, setUsername] = React.useState("");
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const currentUser = JSON.parse(localStorage.getItem("userInfo"))['username'];
  const navigate = useNavigate();
  
  React.useEffect(() => {
     initPage();
  }, []);

  function close() {
    setIsOpen(false);
    setName("");
    setUsername("");
    setPhone("");
  }

  function initPage() {
    setIsLoaded(false);
    getMemberList({'page': 1, 'pageSize': 100}).then(res => {
      checkNotLogin(res, navigate);
      if (String(res.code) === '1') {
        setData(res.data.records)
        setIsLoaded(true)
      } else {
        toaster.warning(<>Error: {res.msg || 'Action failed.'}</>);
      }
    }).catch(err => {
      toaster.negative(<>{'Error occured:' + err}</>)
      console.error(err)
    })
  }

  function openModal(mode) {
    if (mode === "new-user") {
      setModalTitle("Add New User");
    }
    else {
      setModalTitle("Edit User");
    }
    setIsOpen(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (addOrEdit === ADD) {
      const reqBody = {'name': name,'username': username, 'phone': phone, 'sex': 1, 'idNumber': 0};
      addEmployee(reqBody).then(res => {
        checkNotLogin(res, navigate);
        if (res.code === 1) {
          toaster.positive(<>add success!</>)
          initPage()
          close()
        } else {
          toaster.warning(<>{res.msg || 'action failed.'}</>)
          console.error(res.msg || 'action failed')
        }
      }).catch(err => {
        toaster.negative(<>{'Error occured:' + err}</>)
        console.log('request error: ' + err)
      })
    }
    else if (addOrEdit === EDIT) {
      const reqBody = {'id': editID, 'name': name, 'username': username, 'phone': phone};
      editEmployee(reqBody).then(res => {
        checkNotLogin(res, navigate);
        if (res.code === 1) {
          toaster.positive(<>edit success!</>)
          close()
          initPage()
        } else {
          toaster.warning(<>{res.msg || 'action failed'}</>)
          console.log(res.msg || 'action failed')
        }
      }).catch(err => {
        toaster.negative(<>{'Error occured:' + err}</>)
        console.log('request error: ' + err)
      });
    }
  }

  function handleBan(data) {
    // const banId = data.id;
    if (data.status === 1) {
      if (window.confirm("This action bans the user, proceed?")) {
        enableOrDisableEmployee({id: data.id, status: 0}).then(res => {
          checkNotLogin(res, navigate);
          if (res.code === 1) {
            toaster.positive(<>Ban success!</>)
            initPage()
          } else {
            toaster.warning(<>{"ban failed, message: " + res.msg}</>)
          }
        }).catch(err => {
          toaster.negative(<>{'Error occured:' + err}</>)
          console.error('Error occured:' + err)
        })
      }
    }
    else {
      enableOrDisableEmployee({id: data.id, status: 1}).then(res => {
          checkNotLogin(res, navigate);
          if (res.code === 1) {
            toaster.positive(<>Activate success!</>)
            initPage()
          } else {
            toaster.warning(<>{"Activate failed, message: " + res.msg}</>)
          }
        }).catch(err => {
          toaster.negative(<>{'Error occured:' + err}</>)
          console.error('Error occured:' + err)
        })
    }
   
  }
  
  function handleEdit(data) {
    console.log('edit:', data);
    setAddOrEdit(() => EDIT);
    setEditID(data.id);
    setName(data.name);
    setUsername(data.username);
    setPhone(data.phone);
    openModal();
  }

  return (
    <div className="menu-items-container">
        <h1>System Accounts Management</h1>
        <ButtonGroup shape={SHAPE.pill}>
          <Button onClick={() => {setAddOrEdit(() => ADD); openModal("new-user");}}>+ Add New User</Button>
          {/* <Button onClick={() => {setAddOrEdit(() => ADD); openModal("set-meals");}}>+ New Set Meals Category</Button> */}
        </ButtonGroup>
        { isLoaded ? <CategoryTable data={data} editCallback={handleEdit} deleteCallback={handleBan} isAdmin={currentUser === "admin"}/> : 'Loading...'}
        

        {/* Add New Category Modal */}
        <Modal onClose={close} isOpen={isOpen}>
          <ModalHeader>{modalTitle}</ModalHeader>
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <FormControl
                label={() => "Account username"}
                caption={() => "login username"}
              >
                <Input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </FormControl>
              <FormControl
                label={() => "Account Name"}
                caption={() => "The user's name"}
              >
                <Input
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </FormControl>
              <FormControl
                label={() => "Phone Number"}
              >
                <Input
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
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