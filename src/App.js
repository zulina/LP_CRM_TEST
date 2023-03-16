import React from 'react';
import Select from 'react-select'
import './App.css';
import './Switch.css';

let newItem = false;
let deleteItem = false;
let counter = 3;

const data = [
  {pos: 1, status: false, product: 'XXXX-', id: '1', name: 'blue', key: 1, active: false},
  {pos: 2, status: true, product: 'XXXX-', id: '2', name: 'red', key: 2, active: false},
  {pos: 3, status: false, product: 'XXXX-', id: '3', name: 'green', key: 3, active: false}
];

let nameOptionsDone = false;
let nameOptions = [];

let filterOptions = [];

const getItemById = (id) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].id === id) {
      return data[i];
    }
  }
  return undefined;
}

const getItemByPos = (pos) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].pos === pos) {
      return data[i];
    }
  }
  return undefined;
}

const getItemIndex = (pos) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].pos === pos) {
      return i;
    }
  }
  return undefined;
}

function ImgOption(name) {
  return (
    <div>
      <img src={require(`./images/${name}.jpg`)} alt={name} />
    </div>
  );
}

const imgOptions = [];
let num = 0;
while (num < 5) {
  num++;
  let name = `img${num < 10 ? "0" + num : num}`;
  imgOptions.push({ value: name, label: ImgOption(name) });
}

function TableItem({pos, status, product, id, name}) {

  const [state, setState] = React.useState({
    itemStatus: status,
    itemClassName: 'item',
    focusId: !id,
    focusName: false
  });

  const onClickStatus = (event) => {
    getItemByPos(pos).status = !state.itemStatus;
    setState((prevState) => ({
      ...prevState,
      itemStatus: !state.itemStatus
    }));
  };

  const onChangeId = (event) => {
    if (event.key === "Enter") {
      onSubmitId(event);
    } else if (state.itemStatus) {
      event.preventDefault();
    }
  }

  const onChangeName = (event) => {
    if (event.key === "Enter") {
      onSubmitName(event);
    } else if (state.itemStatus) {
      event.preventDefault();
    }
  }

  const onChangeImg = (event) => {
    if (state.itemStatus) {
      event.preventDefault();
    }
  }

  const onClickItem = (e) => {
    if (e.target && ((typeof(e.target.className) !== 'string') || (e.target.tagName === 'DIV') || (e.target.tagName === 'IMG') ||
      e.target.className.includes('item_input') || e.target.className.includes('item_delete') || (e.target.type === "checkbox") ||
      e.target.className.includes('react-switch-label') || e.target.className.includes('react-switch-button'))) {
        return null;
    }
    console.log('onClickItem');
    if (state.itemClassName.includes('item_active')) {
      getItemByPos(pos).active = false;
      setState((prevState) => ({
        ...prevState,
        itemClassName: state.itemClassName.replace(' item_active', '')
      }));
    } else {
      getItemByPos(pos).active = true;
      setState((prevState) => ({
        ...prevState,
        itemClassName: state.itemClassName + ' item_active'
      }));
    }
  }

  const onMouseOverDelete = () => {
    // data.forEach(item => { console.log(item); });
    if (!state.itemClassName.includes('item_delete_active')) {
      setState((prevState) => ({
        ...prevState,
        itemClassName: state.itemClassName + ' item_delete_active'
      }));
    }
  }
  
  const onMouseOutDelete = () => {
    if (state.itemClassName.includes('item_delete_active')) {
      setState((prevState) => ({
        ...prevState,
        itemClassName: state.itemClassName.replace(' item_delete_active', '')
      }));
    }
  }

  const onSubmitId = (e) => {
    // если это новая строка
    if (newItem) {
      // если айди введён и такого айди ещё нет
      if (e.target.value && !getItemById(e.target.value)) {
        if (state.focusId) {
          setState((prevState) => ({
            ...prevState,
            focusId: false,
            focusName: true
          }));
        }
        // переходим на название
        document.getElementById('name').focus();
      } else {
        e.target.focus();
      }
    } else {
      if (e.target.value && (!getItemById(e.target.value) || getItemByPos(pos).id === e.target.value)) {
        getItemByPos(pos).id = e.target.value;
      } else {
        e.target.focus();
      }
    }
  }

  const onSubmitName = (e) => {
    // если этой новая строка
    if (newItem) {
      newItem = false;

      // добавление новой строки
      counter++;
      data.unshift({
        pos: pos,
        status: state.itemStatus, 
        product: 'XXXX-', 
        id: document.getElementById('id').value, 
        name: document.getElementById('name').value, 
        key: counter, 
        active: state.itemClassName.includes('item_active')});    

      if (state.focusName) {
        setState((prevState) => ({
          ...prevState,
          focusName: false
        }));
      }
    } else {
      getItemByPos(pos).name = e.target.value;
    }

    e.target.blur();
  }

  const onClickDelete = () => {
    // удаление элемента массива
    deleteItem = true;
    data.splice(getItemIndex(pos), 1);
    // data.forEach(item => { console.log(item); });
  }

  // <input type="checkbox" value={state.itemStatus} name="status" onClick={onClickStatus} />
  return (
    <tr className={state.itemClassName} onClick={onClickItem}>
      <td>
          <input
            className="react-switch-checkbox"
            id={`react-switch-${pos}`}
            type="checkbox"
            value={state.itemStatus}
            defaultChecked={status}
            onClick={onClickStatus}
          />
          <label
            className="react-switch-label"
            htmlFor={`react-switch-${pos}`}
          >
            <span className="react-switch-button" />
          </label>
      </td> 
      <td>{product}</td>
      <td><input className='item_input' type="text" maxLength='3' defaultValue={id} 
        onKeyDown={onChangeId} autoFocus={state.focusId} onBlur={onSubmitId} id='id' /></td>
      <td>
        <Select className='item_input' id="img" placeholder='' options={imgOptions} onChange={onChangeImg} isDisabled={state.itemStatus} />
        <input className='item_input' type="text" defaultValue={name} 
        onKeyDown={onChangeName} autoFocus={state.focusName} onBlur={onSubmitName} id='name' />
      </td>
      <td><button className='item_delete' title='Удалить строку' onMouseOver={onMouseOverDelete} onMouseOut={onMouseOutDelete}
        onClick={onClickDelete}>x</button></td>
    </tr>
  );
}

function App() {

  const [state, setState] = React.useState({
    btnClassName: 'btn_delete_selected',
    addItem: newItem,
    delItem: deleteItem,
    filterOn: false
  });

  let items = [];
  if (state.filterOn) {

    const dataFilter = data.filter(item => {      
      for (let i = 0; i < filterOptions.length; i++) {
        if (item.name === filterOptions[i]) {
          return true;
        }       
      }
      return false;
    });

    items = dataFilter.map(item => {
      return (
          <TableItem {...item} />
      )
    });

  } else {

    items = data.map(item => {
      return (
          <TableItem {...item} />
      )
    });

  }

  if (newItem) {
    const item = {pos: counter + 1, status: false, product: 'XXXX-', id: '', name: '', key: counter + 1, active: false};
    items.unshift( <TableItem {...item} /> );
  }

  const onClickTable = (event) => {
    if (deleteItem) {
      setState((prevState) => ({
        ...prevState,
        delItem: deleteItem
      }));
      deleteItem = false;
      setState((prevState) => ({
        ...prevState,
        delItem: deleteItem
      }));
    } else {
      // data.forEach(item => { console.log(item); });
      if (data.some(item => item.active)) {
        if (!state.btnClassName.includes('btn_delete_selected_active')) {
          setState((prevState) => ({
            ...prevState,
            btnClassName: 'btn_delete_selected_active'
          }))
        }
      } else {
        if (state.btnClassName.includes('btn_delete_selected_active')) {
          setState((prevState) => ({
            ...prevState,
            btnClassName: 'btn_delete_selected'
          }))
        }
      }
    }
  }

  const onClickAdd = () => {
    if (!newItem) {
      newItem = true;
      setState((prevState) => ({
        ...prevState,
        addItem: newItem
      }));
    }
  }

  const onMouseOverSelectName = () => {
    if (!nameOptionsDone) {    
      // перезаполняем опции
      nameOptions = [{value: 'All', label: 'Все'}];
      data.forEach(item => {
        if (!nameOptions.some(op => (op.value === item.name))) {
          nameOptions.push({value: item.name, label: item.name});
        }
      });
      setState((prevState) => ({
        ...prevState
      }));
      nameOptionsDone = true;
    }
    //document.getElementById('select_name').click();
  }

  const onMouseLeaveSelectName = () => {
    nameOptionsDone = false;
  }

  const onChangeSelectName = (selectedOptions) => {
    filterOptions = [];
    // если не выбрано Все
    if ((selectedOptions.length > 0) && !selectedOptions.some(item => (item.value === nameOptions[0].value))) {
      selectedOptions.forEach(item => { filterOptions.push(item.value) });
      setState((prevState) => ({
        ...prevState,
        filterOn: true  
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        filterOn: false
      }));
    }
  }

  const onClickDeleteSelected = () => {

    // удаление элементов массива
    let length = data.length;
    for (let index=0; index<length; index++) {
      if (data[index].active) {
        data.splice(index, 1);
        index--;
        length--;
      }
    }
  
    setState((prevState) => ({
      ...prevState,
      btnClassName: 'btn_delete_selected'
    }));
  }

  return (
    <div className="App">
      <table className='table' id='table' onClick={onClickTable}>
        <thead>
          <tr>
            <th>Статус</th>
            <th>Товар</th>
            <th>ID</th>
            <th>Название</th>
            <th><button onClick={onClickAdd}>+</button></th>
          </tr>
          <tr>
            <th><Select placeholder='' /></th>
            <th><Select placeholder='' /></th>
            <th><Select placeholder='' /></th>
            <th><div onMouseOver={onMouseOverSelectName} onMouseLeave={onMouseLeaveSelectName}>
              <Select placeholder='' name="select_name" id="select_name" className="select_name" 
              options={nameOptions} isMulti hideSelectedOptions={false} onChange={onChangeSelectName}></Select>
            </div></th>
            <th><button className={state.btnClassName} id='delete_selected' onClick={onClickDeleteSelected}>x</button></th>
          </tr>
        </thead>
        <tbody>
          {items}
        </tbody>
      </table>
    </div>
  );
}

export default App;
