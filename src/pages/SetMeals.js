import "../assets/menu-items.css";

import * as React from 'react';
import { ButtonGroup, SHAPE } from "baseui/button-group";
import {
  TableBuilder,
  TableBuilderColumn,
} from 'baseui/table-semantic';
import {Avatar} from 'baseui/avatar';
import {Button, KIND, SIZE} from 'baseui/button';
import {useStyletron} from 'baseui';
import { 
    getSetmealPage, addSetmeal, deleteSetmeal
    , setmealStatusByStatus, querySetmealById
    , editSetmeal } from "../api/setMeals";
import {
  imageUpload
} from "../api/common";
import {
  getCategoryList, queryDishList
} from "../api/menuItems";
import {Checkbox, STYLE_TYPE} from 'baseui/checkbox';
import { Select } from "baseui/select";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton
} from 'baseui/modal';
import { FileUploader } from "baseui/file-uploader";
import { Input } from 'baseui/input';
import { Textarea } from "baseui/textarea";
import { FormControl } from 'baseui/form-control';
import TagInput from "../components/TagInput";
import { Plus, Delete } from "baseui/icon";
import { formatImageLink } from "../common/utils";
import {Tabs, Tab, ORIENTATION, FILL} from 'baseui/tabs-motion';
import {
  ListItem,
  ListItemLabel
} from "baseui/list";
import { toaster } from "baseui/toast";
import { checkNotLogin } from '../common/utils';
import { useNavigate } from 'react-router-dom';

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

function ButtonsCell({data={'id': 0}, editCallback=()=>{}, deleteCallback=()=>{}}) {
  const [css, theme] = useStyletron();

  return (
    <div className={css({display: 'flex', alignItems: 'center'})}>
          <Button
            
            size={SIZE.mini}
            overrides={{
              BaseButton: {
                style: {
                  marginLeft: 0,
                },
              },
            }}
            onClick={() => editCallback(data.id)}
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
            onClick={() => deleteCallback(data.id, 'single')}
          >
            Delete
          </Button>
    </div>
  );
}

function StatusCell({id, status, reloadCallback=()=>{}, navigate}) {
  return (
    <Checkbox
        checked={status === 1}
        onChange={e => {
          const val = e.currentTarget.checked;
          const newStatus = val === true ? 1 : 0;
          setmealStatusByStatus({id: id, status: newStatus})
            .then((res)=> {
              checkNotLogin(res, navigate);
              if (res.code === 1) {
                toaster.positive('status change success');
                reloadCallback();
              }
              else {
                toaster.warning(res.msg || "Action failed");
              }
            }).catch(err => {
              toaster.negative('request error:' + err);
            })
          reloadCallback();
        }}
        checkmarkType={STYLE_TYPE.toggle_round}
      />
  );
}


function SetMealTable({data, editCallback = () => {}, deleteCallback = () => {}, reloadCallback = () => {}, navigate}) {
  return (
    <TableBuilder
      overrides={{Root: {style: {maxHeight: '600px'}}}}
      data={data}
    >
      <TableBuilderColumn header="Set Meal">
        {row => (
          <SetItemContentCell
            src={formatImageLink(row.image)}
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
        {row => <SetPriceCell value={row.price/100} />}
      </TableBuilderColumn>

      <TableBuilderColumn header="Last Edited">
        {row => <LastEditedDateCell date={row.updateTime} />}
      </TableBuilderColumn>

      <TableBuilderColumn header="Status">
        {row => <StatusCell id={row.id} status={row.status} reloadCallback={reloadCallback} navigate={navigate}/>}
      </TableBuilderColumn>

      <TableBuilderColumn header="Actions">
        {row => <ButtonsCell data={row} editCallback={editCallback} deleteCallback={deleteCallback} />}
      </TableBuilderColumn>
    </TableBuilder>
  );
}

export default function SetMeals() {
  const [css, theme] = useStyletron();
  const [data, setData] = React.useState([]);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // set modal
  const [isOpen, setIsOpen] = React.useState(false);
  const [modalAction, setModalAction] = React.useState('add'); // add and new
  const [mealName, setMealName] = React.useState("");
  const [mealPrice, setMealPrice] = React.useState("");
  const [mealDescription, setMealDescription] = React.useState("");
  const [selectValue, setSelectValue] = React.useState([]);
  const [selectSetCategories, setSelectSetCategories] = React.useState([{"id": 1, "name": "placeholder1"}, {"id": 2, "name": "placeholder2"}]);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [isUploading, setIsUploading] = React.useState(false);
  const [mealId, setMealId] = React.useState('');
  // select dish modal
  const [isDishModalOpen, setIsDishModalOpen] = React.useState(false);
  const [activeItemCategory, setActiveItemCategory] = React.useState(0);
  const [itemCategories, setItemCategories] = React.useState([]);
  const [isTabLoaded, setIsTabLoaded] = React.useState(false);
  const [itemsData, setItemsData] = React.useState([]);
  const [modalSelectedItems, setModalSelectedItems] = React.useState([]);

  // file upload
  const [fileUploaded, setFileUploaded] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState("");
  const [imageUploadUrl, setImageUploadUrl] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [deleteList, setDeleteList] = React.useState([]);

  // NOT LOGIN
  const navigate = useNavigate();
  
  React.useEffect(() => {
    initPage()
  }, []);

  // Modal imageURL hack
  React.useEffect(() => {
    if (imageUrl !== "") {
      setIsUploading(false);
      setFileUploaded(true);
    }
  },[imageUrl]);

  React.useEffect(() => {
    if(activeItemCategory !== 0) {
      setIsTabLoaded(false);
      queryDishList({categoryId: activeItemCategory})
        .then(res=> {
          checkNotLogin(res, navigate);
          if (String(res.code) === '1') {
            // if item in selectedList, make it tick
            setItemsData(res.data.map((item) => ({...item, selected: modalSelectedItems.some((it)=>(it.id === item.id))})));
            setIsTabLoaded(true);
          } else {
            toaster.warning(res.msg || 'Action failed')
          }
        }).catch(err => {
          toaster.negative('Error occured.')
          console.log(err)
        })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeItemCategory]);

  React.useEffect(() => {
    const selectedItemsData = itemsData
                                .filter((item) => (item.selected))
                                .map((item)=>({'name': item.name, 'id': item.id, 'price': item.price, 'copies': 1}));

    setModalSelectedItems((items)=>
                                // select unique
                                // the first filter removes items if not selected in current list
                                [...items.filter((prevSelected)=>(!itemsData.some(item=>(item.id===prevSelected.id && !item.selected)))), ...selectedItemsData]
                                  .filter((item, index, self)=>(
                                    index === self.findIndex(it=>item.id === it.id)
                                  )));
  }, [itemsData]);


  function initPage() {
    setIsLoaded(false)
    getSetmealPage({'page': 1, 'pageSize': 100}).then(res => {
      checkNotLogin(res, navigate);
      if (String(res.code) === '1') {
        setData(res.data.records)
        setIsLoaded(true)
      } else {
        toaster.warning(res.msg || 'Action failed')
      }
    }).catch(err => {
      toaster.negative('Error occured.' + err)
      console.log(err)
    })
    fetchSetCategoryList();
  }

  // modal functions
  function openModal() {
    setErrorMessage("");
    setIsOpen(true);
  }

  function openDishModal() {
    fetchItemCategoryList();
    setIsDishModalOpen(true);
  }

  function resetForm() {
    setFileUploaded(false);
    setImageUrl("");
    setImageUploadUrl("");
    setErrorMessage("");
    setSelectValue([]);
    setSelectedItems([]);
    setMealName("");
    setMealPrice("");
    setMealDescription("");
    setModalAction('add');
  }

  function close() {
    setIsOpen(false);
    resetForm();
  }

  function closeDishModal() {
    setIsDishModalOpen(false);
    setModalSelectedItems([]);
    setActiveItemCategory(0);
  }

  function fetchSetCategoryList() {
    getCategoryList({ 'type': 2 }).then(res => {
      checkNotLogin(res, navigate);
      if (res.code === 1) {
        setSelectSetCategories(res.data)
      } else {
        toaster.warning(res.msg || 'action failed.')
        console.error(res.msg || 'action failed.')
      }
    })
  }

  function fetchItemCategoryList() {
    getCategoryList({ 'type': 1 }).then(res => {
      checkNotLogin(res, navigate);
      if (res.code === 1) {
        setItemCategories(res.data);
        setActiveItemCategory(res.data[0].id);
      } else {
        toaster.warning(res.msg || 'action failed.')
        console.error(res.msg || 'action failed.')
      }
    })
  }

  function resetUpload() {
    setIsUploading(false);
    setFileUploaded(false);
    setErrorMessage("");
  }

  // startProgress is only illustrative. Use the progress info returned
  // from your upload endpoint. This example shows how the file-uploader operates
  // if there is no progress info available.
  function startProgress() {
    setIsUploading(true);
  }

  function handleImageUpload(file) {
    startProgress();
    imageUpload(file[0])
      .then(res => {
        checkNotLogin(res, navigate);
        // handleImageUploadSuccess(res);
         if (res.code === 0 && res.msg === '未登录')
          toaster.negative("not login!");
        else if (res.code === 0){
          toaster.warning("upload error: handleImageUpload failed");
        }
        else {
          // console.log('response is:', res.data);
          const path = formatImageLink(res.data);
          setImageUrl(path);
          setImageUploadUrl(res.data);
        }
        // fix: use useEffect hack, find solution later
        // setIsUploading(false);
        // setFileUploaded(true);
      })
      .catch(err => {
        setErrorMessage("File upload failed.");
        toaster.negative('Error occured.' + err);
        console.log(err);
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    let reqBody = {
      'name': mealName,
      'price': mealPrice * 100,
      'image': imageUploadUrl,
      'description': mealDescription,
      'code': '',
      'categoryId': selectValue[0].id,
      'setmealDishes': selectedItems.map((menuItem)=>
        ({'name': menuItem.name, 'price': menuItem.price, 'dishId': menuItem.id, 'copies': menuItem.copies})
      )
    };
    if (modalAction === 'add') {
      reqBody['status'] = 1; // set activated if add
      addSetmeal(reqBody).then(res => {
        checkNotLogin(res, navigate);
        console.log(res)
        if (res.code === 1) {
          toaster.positive('add success!')
          initPage()
          close()
        } else {
          toaster.warning(res.msg || 'action failed')
          console.log(res.msg || 'action failed')
        }
      }).catch(err => {
        toaster.negative('request error: ' + err)
        console.log('request error: ' + err)
      })
    }
    // else {
    //   reqBody['id'] = mealId;
    //   editSetmeal(reqBody).then(res => {
    //     console.log(res)
    //     if (res.code === 1) {
    //       alert('edit success!')
    //       initPage()
    //       close()
    //     } else {
    //       alert('edit error')
    //       console.log(res.msg || 'action failed')
    //     }
    //   }).catch(err => {
    //     alert('request error')
    //     console.log('request error: ' + err)
    //   })
    // }
    
  }

  function handleDelete(deleteId, mode = 'single') {
    deleteSetmeal(mode === 'batch' ? deleteList.join(',') : deleteId).then(res => {
      checkNotLogin(res, navigate);
      if (res.code === 1) {
        toaster.positive('delete success!')
        initPage()
      } else {
        toaster.warning(res.msg || 'action failed')
        console.error(res.msg || 'al')
      }
    }).catch(err => {
      toaster.negative('request error:' + err)
      console.error('request error: ' + err)
    })
  }

  // Modal select dish
  const itemsHasAny = Boolean(itemsData.length);
  const itemsHasAll = itemsHasAny && itemsData.every((x) => x.selected);
  const itemsHasSome = itemsHasAny && itemsData.some((x) => x.selected);

  function itemsToggleAll() {
    setItemsData((itemsData) =>
      itemsData.map((row) => ({
        ...row,
        selected: !itemsHasAll,
      })),
    );
  }
  function itemsToggle(event) {
    const {name, checked} = event.currentTarget; // name is id
    setItemsData((itemsData) =>
      itemsData.map((row) => ({
        ...row,
        selected: String(row.id) === name ? checked : row.selected,
      })),
    );
  }

  function removeModalItem(itemId) {
    setItemsData((itemsData) =>
      itemsData.map((row) => ({
        ...row,
        selected: row.id === itemId ? false : row.selected,
      })),
    );
    setModalSelectedItems((modalSelectedItems)=>(
      modalSelectedItems.filter((row) => (row.id !== itemId))
    ));
  }

  function removeSelectedItem(itemId) {
    setSelectedItems((selectedItems)=>(
      selectedItems.filter((row) => (row.id !== itemId))
    ));
  }

  function saveItemSelection() {
    setSelectedItems(modalSelectedItems);
  }

  function setEditModal(itemId) {
    setModalAction('edit');
    querySetmealById(itemId)
      .then((res)=>{
        checkNotLogin(res, navigate);
        if(res.code === 1) {
          const {id, name, price, image, description, setmealDishes, categoryId } = res.data;
          setMealId(id);
          setFileUploaded(true);
          setImageUrl(formatImageLink(image));
          setImageUploadUrl(image);
          setErrorMessage("");
          setSelectValue(selectSetCategories.filter((cat)=>(cat.id === categoryId))); // set category
          setSelectedItems(setmealDishes.map((menuItem) =>
            ({'name': menuItem.name, 'price': menuItem.price, 'id': menuItem.dishId, 'copies': menuItem.copies})));
          setMealName(name);
          setMealPrice(price/100); // divide by 100
          setMealDescription(description);
          setModalAction('edit');
          openModal();
        }
        else {
          toaster.warning(res.msg || 'Action failed');
        }
      })
      .catch(err => {
        toaster.negative('request error:' + err);
      })
  }
  
  return (
    <div className="menu-items-container">
        <h1>Set Meals Management</h1>
        <ButtonGroup shape={SHAPE.pill}>
        <Button onClick={() => {openModal();}}>+ New</Button>
        </ButtonGroup>
        {/* SetMeal Table */}
        {isLoaded ? <SetMealTable data={data} editCallback={setEditModal} deleteCallback={handleDelete} reloadCallback={initPage} navigate={navigate}/> : <div>Loading...</div>}


        {/* Add New Item Modal */}
        <Modal 
          onClose={close} isOpen={isOpen}
          overrides={{
          Dialog: {
            style: {
              width: '80vw',
              minHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
            },
          },
          }}
        >
          <ModalHeader>{modalAction === 'add' ? 'Add New Set' : 'Edit Set'}</ModalHeader>
            <form style={{flex: '1 1', display: "flex", flexDirection: "column"}} onSubmit={handleSubmit}>
              <ModalBody style={{flex: '1 1 0'}}>
                <div style={{display: "flex"}}>
                  <div style={{flex: "3"}}>
                    <FormControl
                      label={() => "Set Name"}
                    >
                      <Input
                        value={mealName}
                        onChange={e => setMealName(e.target.value)}
                      />
                    </FormControl>
                  </div>
                  <div style={{flex: "2", marginLeft: theme.sizing.scale1200}}>
                    <FormControl
                      label={() => "Set Category"}
                    >
                      <Select
                        options={selectSetCategories}
                        labelKey="name"
                        valueKey="id"
                        onChange={({value}) => {console.log(value); setSelectValue(value)}}
                        value={selectValue}
                      />
                    </FormControl>
                  </div>
                </div>
                
                <div style={{width: '20rem'}}>
                  <FormControl
                    label={() => "Set Price"}
                  >
                    <Input
                      startEnhancer="€"
                      value={mealPrice}
                      onChange={e => setMealPrice(e.target.value)}
                      type="number"
                    />
                  </FormControl>
                </div>

                <div>
                  <FormControl
                    label={() => "Set Items"}
                    caption={() => "Select menu items that belong to this set."}
                  >
                    <>
                      <ul  className={css({
                        paddingLeft: 0,
                        paddingRight: 0,
                      })}>
                        {selectedItems.map((item)=>(
                          <ListItem
                            shape={SHAPE.ROUND}
                            endEnhancer={()=>(
                            <Button size="compact" kind="secondary" shape="round" type="button"
                              onClick={
                                () => {
                                  removeSelectedItem(item.id)
                                }
                              } ><Delete /></Button>
                          )}
                          >
                            <ListItemLabel
                              description={new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'EUR',
                                  }).format(item.price/100)}
                            >
                              {item.name}
                            </ListItemLabel>
                          </ListItem>
                        ))}
                      </ul>
                      
                      <Button
                        size={SIZE.compact}
                        kind={KIND.secondary}
                        type="button"
                        onClick={(event)=>{
                          event.preventDefault();
                          setModalSelectedItems(selectedItems);
                          openDishModal();
                        }}
                        startEnhancer={()=> <Plus size={18} />}
                      >
                        Add Item
                      </Button>
                    </>
                  </FormControl>
                </div>

                <div>
                  <FormControl
                    label={() => "Set Image"}
                    caption={() => "Only files with extension .png and .jpg can be uploaded."}
                    >
                    { fileUploaded === true ?
                       <Avatar
                          overrides={{
                            Avatar: {
                              style: ({$theme}) => ({
                                borderTopLeftRadius: $theme.borders.radius100,
                                borderTopRightRadius: $theme.borders.radius100,
                                borderBottomRightRadius: $theme.borders.radius100,
                                borderBottomLeftRadius: $theme.borders.radius100,
                              }),
                            },
                            Root: {
                              style: ({$theme}) => ({
                                borderTopLeftRadius: $theme.borders.radius100,
                                borderTopRightRadius: $theme.borders.radius100,
                                borderBottomRightRadius: $theme.borders.radius100,
                                borderBottomLeftRadius: $theme.borders.radius100,
                              }),
                            },
                          }}
                          name="upload image"
                          size="scale4800"
                          src={imageUrl}
                        />
                      :
                      <FileUploader
                      onCancel={resetUpload}
                      accept="image/*"
                      onDrop={(acceptedFile, rejectedFiles) => {
                        // handle file upload...
                        console.log("Upload file...", acceptedFile);
                        handleImageUpload(acceptedFile);
                      }}
                      onRetry={resetUpload}
                      progressMessage={
                        isUploading ? `Uploading... hang tight.` : ''
                      }
                      errorMessage={errorMessage}
                    /> 
                    }
                  </FormControl>
                </div>
                <FormControl
                      label={() => "Set Description"}
                    >
                    <Textarea
                      value={mealDescription}
                      onChange={e => setMealDescription(e.target.value)}
                      size={SIZE.mini}
                      placeholder="Enter set description... (At most 200 characters)"
                      clearOnEscape
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
        <Modal
            onClose={closeDishModal}
            isOpen={isDishModalOpen}
            overrides={{
              Dialog: {
                style: {
                  width: '70vw',
                  minHeight: '75vh',
                  display: 'flex',
                  flexDirection: 'column'
                },
              },
            }}
          >
            <ModalHeader>Add Item</ModalHeader>
            <ModalBody style={{display: "flex"}}>
              <>
                {/* {selectCategories.map((category)=>(<div>{category.name}</div>))} */}
                <Tabs
                  activeKey={activeItemCategory}
                  onChange={({activeKey}) => {setActiveItemCategory(activeKey)}}
                  orientation={ORIENTATION.vertical}
                  // fill={FILL.fixed}
                  overrides={{
                    Root: {
                      style: ({ $theme }) => ({
                        flex: "2"
                      })
                    }
                  }}
                >
                  {itemCategories.map((category)=>(
                    <Tab key={category.id} title={category.name}>
                      {
                        // itemsData.map((item)=>(item.name))
                        (<TableBuilder data={itemsData} compact
                          isLoading={!isTabLoaded}
                          overrides={{
                            Root: {
                              style: {
                              },
                            },

                          }}>
                          <TableBuilderColumn
                            overrides={{
                              TableHeadCell: {style: {width: '1%'}},
                              TableBodyCell: {style: {width: '1%'}},
                            }}
                            header={
                              <Checkbox
                                checked={itemsHasAll}
                                isIndeterminate={!itemsHasAll && itemsHasSome}
                                onChange={itemsToggleAll}
                              />
                            }
                          >
                            {(row) => (
                              <Checkbox
                                name={'' + row.id}
                                checked={row.selected}
                                onChange={itemsToggle}
                              />
                            )}
                          </TableBuilderColumn>

                          <TableBuilderColumn header="Item Name">
                            {(row) => (<div>{row.name}</div>)}
                          </TableBuilderColumn>
                          <TableBuilderColumn header="Price" numeric>
                            {(row) => (<div>{new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'EUR',
                              }).format(row.price/100)}</div>)}
                          </TableBuilderColumn>
                        </TableBuilder>)
                      }
                    </Tab>
                  ))}
                </Tabs>
                <div style={{flex: "1", margin: theme.sizing.scale550}}>
                  Selected Items:
                  <ul  className={css({
                    paddingLeft: 0,
                    paddingRight: 0,
                  })}>
                    {modalSelectedItems.map((item)=>(
                      <ListItem
                        shape={SHAPE.ROUND}
                        endEnhancer={()=>(
                          <Button size="compact" kind="secondary" shape="round" type="button"
                            onClick={
                              () => {
                                removeModalItem(item.id)
                                console.log(item.id)
                              }
                            } ><Delete /></Button>
                        )}
                      >
                        <ListItemLabel
                          description={new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'EUR',
                              }).format(item.price/100)}
                        >
                          {item.name}
                        </ListItemLabel>
                      </ListItem>
                    ))}
                  </ul>
                </div>
              </>
            </ModalBody>
            <ModalFooter>
              <ModalButton
                kind="tertiary"
                onClick={() => {
                  closeDishModal();
                }}
              >
                Cancel
              </ModalButton>
              <ModalButton
                onClick={() => {
                  saveItemSelection();
                  closeDishModal();
                }}
              >
                Save
              </ModalButton>
            </ModalFooter>
          </Modal>
    </div>
  );
}