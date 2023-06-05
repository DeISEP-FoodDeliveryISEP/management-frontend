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
    getDishPage, addDish, deleteDish, getCategoryList
    , dishStatusByStatus, queryDishById
    , editDish } from "../api/menuItems";
import {
  imageUpload
} from '../api/common';
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
import { Plus } from "baseui/icon";
import { formatImageLink } from "../common/utils";

function DishContentCell({src, title, description}) {
  const [css, theme] = useStyletron();
  return (
    <div className={css({display: 'flex', alignItems: 'center'})}>
      <Avatar 
        size="48px" src={src}
        name={`item`}
      />
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
          {description.slice(0,15)}
          {description.length > 15 ? "..." : ""}
        </p>
      </div>
    </div>
  );
}

function PriceCell({value, delta}) {
  const [css, theme] = useStyletron();
  return (
    <div className={css({display: 'flex', alignItems: 'center'})}>
      <span
        className={css({...theme.typography.MonoParagraphSmall})}
      >
        {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'EUR',
        }).format(value/100)}
      </span>
    </div>
  );
}

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

function ButtonsCell({data, editCallback, deleteCallback}) {
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

function StatusCell({id, status, reloadCallback}) {
  const [localStatus, setLocalStatus] = React.useState(status);

  return (
    <Checkbox
        checked={localStatus}
        onChange={e => {
          const val = e.currentTarget.checked;
          setLocalStatus(val);
          const newStatus = val === true ? 1 : 0;
          dishStatusByStatus({id: id, status: newStatus})
            .then((res)=> {
              if (res.code === 1) {
                alert('status change success');
                reloadCallback();
              }
              else {
                alert('server side error');
                console.error(res.msg);
              }
            }).catch(err => {
              alert('request error:' + err)
            })
          reloadCallback();
        }}
        checkmarkType={STYLE_TYPE.toggle_round}
      />
  );
}


function MenuItemTable({data, editCallback = () => {}, deleteCallback = () => {}, reloadCallback = () => {}}) {
  return (
    <TableBuilder
      overrides={{Root: {style: {maxHeight: '600px'}}}}
      data={data}
    >
      <TableBuilderColumn header="Item">
        {row => (
          <DishContentCell
            src={formatImageLink(row.image)}
            title={row.name}
            description={row.description}
          />
        )}
      </TableBuilderColumn>

      <TableBuilderColumn header="Category">
        {row => (
          <CategoryCell
            category={row.categoryName}
          />
        )}
      </TableBuilderColumn>

      <TableBuilderColumn header="Price">
        {row => <PriceCell value={row.price} />}
      </TableBuilderColumn>


      <TableBuilderColumn header="Last Edited">
        {row => <LastEditedDateCell date={row.updateTime} />}
      </TableBuilderColumn>

      <TableBuilderColumn header="Status">
        {row => <StatusCell id={row.id} status={row.status} reloadCallback={reloadCallback} />}
      </TableBuilderColumn>

      <TableBuilderColumn header="Actions">
        {row => <ButtonsCell data={row} editCallback={editCallback} deleteCallback={deleteCallback} />}
      </TableBuilderColumn>

    </TableBuilder>
  );
}

function FlavorInput({flavorName, flavorTags, deleteFlavorCallback, setNameCallback, setTagsCallback}) {
  const [css, theme] = useStyletron();
  return (<div style={{display: "flex", marginBottom: theme.sizing.scale400}}>
    <div style={{flex: "2"}}>
      <Input
        value={flavorName}
        onChange={e => {setNameCallback(e.target.value)}}
        placeholder="Flavor name"
        
      />
    </div>
    <div style={{flex: "7", marginLeft: theme.sizing.scale400, marginRight: theme.sizing.scale400}}>
      <TagInput
        placeholder="Enter an attribute..."
        setTagsCallback={setTagsCallback}
        tags={flavorTags}
      >
      </TagInput>
    </div>
      
      <Button size={SIZE.compact} kind={KIND.tertiary}
        onClick={(event)=> {
          event.preventDefault();
          deleteFlavorCallback();
        }}
        type="button"
        style={{flex: "1"}}
        overrides={{
         BaseButton: {
          style: ({ $theme }) => ({
            color: $theme.colors.negative
         })}
        }}
      >
        Delete
      </Button>
  </div>);
}


export default function MenuItems() {
  const [css, theme] = useStyletron();
  const [data, setData] = React.useState([]);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // modal
  const [isOpen, setIsOpen] = React.useState(false);
  const [modalAction, setModalAction] = React.useState('add'); // add and new
  const [itemName, setItemName] = React.useState("");
  const [itemPrice, setItemPrice] = React.useState("");
  const [itemDescription, setItemDescription] = React.useState("");
  const [flavorList, setFlavorList] = React.useState([]);
  const [selectValue, setSelectValue] = React.useState([]);
  const [selectOptions, setSelectOptions] = React.useState([{"id": 1, "name": "placeholder1"}, {"id": 2, "name": "placeholder2"}]);
  const [isUploading, setIsUploading] = React.useState(false);
  const [itemId, setItemId] = React.useState('');
  // file upload
  const [fileUploaded, setFileUploaded] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState("");
  const [imageUploadUrl, setImageUploadUrl] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [deleteList, setDeleteList] = React.useState([]);


  React.useEffect(() => {
     initPage()
  }, [])

  // Modal imageURL hack
  React.useEffect(() => {
    if (imageUrl !== "") {
      setIsUploading(false);
      setFileUploaded(true);
    }
  },[imageUrl]);

  function initPage() {
    getDishPage({'page': 1, 'pageSize': 100}).then(res => {
      if (String(res.code) === '1') {
        setData(res.data.records)
        setIsLoaded(true)
      } else {
        alert(res.msg || 'Action failed')
      }
    }).catch(err => {
      alert('Error occured.')
      console.log(err)
    })
  }

  // modal functions
  function openModal() {
    fetchCategoryList();
    setErrorMessage("");
    setIsOpen(true);
  }

  function resetForm() {
    setFileUploaded(false);
    setImageUrl("");
    setErrorMessage("");
    setSelectValue([]);
    setItemName("");
    setItemPrice("");
    setItemDescription("");
    setFlavorList([]);
    setModalAction('add');
  }

  function close() {
    setIsOpen(false);
    resetForm();
  }

  function fetchCategoryList() {
    getCategoryList({ 'type': 1 }).then(res => {
      if (res.code === 1) {
        setSelectOptions(res.data)
      } else {
        alert("fetch category list error")
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
        // handleImageUploadSuccess(res);
         if (res.code === 0 && res.msg === '未登录')
          alert("not login!");
        else if (res.code === 0){
          alert("upload error: handleImageUpload failed");
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
        alert('Error occured.');
        console.log(err);
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    let reqBody = {
      'name': itemName,
      'price': itemPrice * 100,
      'image': imageUploadUrl,
      'description': itemDescription,
      'code': '',
      'flavors': flavorList.filter(flavor => flavor.name !== '').map(obj => ({ ...obj, value: JSON.stringify(obj.value) })),
      'categoryId': selectValue[0].id
    };
    if (modalAction === 'add') {
      reqBody['status'] = 1; // set activated if add
      addDish(reqBody).then(res => {
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
    else {
      reqBody['id'] = itemId;
      editDish(reqBody).then(res => {
        console.log(res)
        if (res.code === 1) {
          alert('edit success!')
          initPage()
          close()
        } else {
          alert('edit error')
          console.log(res.msg || 'action failed')
        }
      }).catch(err => {
        alert('request error')
        console.log('request error: ' + err)
      })
    }
    
  }

  function handleDelete(deleteId, mode = 'single') {
    deleteDish(mode === 'batch' ? deleteList.join(',') : deleteId).then(res => {
      if (res.code === 1) {
        alert('delete success!')
        initPage()
      } else {
        alert('delete failed.')
        console.error(res.msg || 'al')
      }
    }).catch(err => {
      console.error('request error: ' + err)
    })
  }

  function addFlavor() {
    setFlavorList([...flavorList, {'name': '', 'value': []}]);
  }

  function deleteFlavor(flavorIndex) {
    setFlavorList(flavorList.filter((flavor, id) => id !== flavorIndex));
  }

  function setFlavorNameByIndex(flavorIndex, flavorName) {
    setFlavorList(flavorList.map((flavor, id) => {
      if (id !== flavorIndex) return flavor;
      else return {  ...flavor, 'name': flavorName};
    }));
  }

  function setFlavorValueByIndex(flavorIndex, flavorValueList) {
    setFlavorList(flavorList.map((flavor, id) => {
      if (id !== flavorIndex) return flavor;
      else return {  ...flavor, 'value': flavorValueList};
    }));
  }

  function setEditModal(itemId) {
    setModalAction('edit');
    queryDishById(itemId)
      .then((res)=>{
        if(res.code === 1) {
          const {id, name, price, image, description, flavors, categoryId } = res.data;
          setFileUploaded(true);
          setImageUploadUrl(image);
          setImageUrl(formatImageLink(image));
          setErrorMessage("");
          setSelectValue([{id: categoryId}]);
          setItemId(id);
          setItemName(name);
          setItemPrice(price/100);
          setItemDescription(description);
          setFlavorList(flavors.map(obj =>
            ({ ...obj, value: JSON.parse(obj.value) })
          ));
          openModal();
        }
        else {
          alert(res.msg || 'Action failed');
        }
      })
      .catch(err => {
        alert('request error:' + err);
      })
  }

  return (
    <div className="menu-items-container">
        <h1>Menu Items Management</h1>
        <ButtonGroup shape={SHAPE.pill}>
        <Button onClick={() => {openModal();}}>+ New Menu Item</Button>
        {/* <Button>Edit</Button>
        <Button>Delete</Button> */}
        </ButtonGroup>
        {isLoaded ? <MenuItemTable data={data} editCallback={setEditModal} deleteCallback={handleDelete} reloadCallback={initPage} /> : <div>Loading...</div>}

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
          <ModalHeader>{modalAction === 'add' ? 'Add New Menu Item' : 'Edit Menu Item'}</ModalHeader>
            <form style={{flex: '1 1', display: "flex", flexDirection: "column"}} onSubmit={handleSubmit}>
              <ModalBody style={{flex: '1 1 0'}}>
                <div style={{display: "flex"}}>
                  <div style={{flex: "3"}}>
                    <FormControl
                      label={() => "Item Name"}
                    >
                      <Input
                        value={itemName}
                        onChange={e => setItemName(e.target.value)}
                      />
                    </FormControl>
                  </div>
                  <div style={{flex: "2", marginLeft: theme.sizing.scale1200}}>
                    <FormControl
                      label={() => "Menu Item Category"}
                    >
                      <Select
                        options={selectOptions}
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
                    label={() => "Item Price"}
                  >
                    <Input
                      startEnhancer="€"
                      value={itemPrice}
                      onChange={e => setItemPrice(e.target.value)}
                      type="number"
                    />
                  </FormControl>
                </div>

                <div>
                  <FormControl
                    label={() => "Item Flavors"}
                    caption={() => "Add flavor and enter attributes"}
                  >
                    <>
                      {flavorList.map((flavor, currentIndex)=>
                        (
                          <FlavorInput
                            flavorName={flavor['name']}
                            flavorTags={flavor['value']}
                            deleteFlavorCallback={()=> {
                              deleteFlavor(currentIndex);
                            }}
                            setNameCallback={(name)=>{
                              setFlavorNameByIndex(currentIndex, name);
                            }}
                            setTagsCallback={(value)=>{
                              setFlavorValueByIndex(currentIndex, value);
                            }}
                            key={currentIndex}
                          />
                        )
                      )}
                      
                      <Button
                        size={SIZE.compact}
                        kind={KIND.secondary}
                        type="button"
                        onClick={(event)=>{
                          event.preventDefault();
                          addFlavor();
                        }}
                        startEnhancer={()=> <Plus size={18} />}
                      >
                        Add New Flavor
                      </Button>
                    </>
                  </FormControl>
                </div>

                <div>
                  <FormControl
                    label={() => "Item Image"}
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
                      label={() => "Item Description"}
                    >
                    <Textarea
                      value={itemDescription}
                      onChange={e => setItemDescription(e.target.value)}
                      size={SIZE.mini}
                      placeholder="Enter item description... (At most 200 characters)"
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
    </div>
  );
}