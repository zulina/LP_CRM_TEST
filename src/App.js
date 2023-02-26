import React from 'react';
import Select from 'react-select'
import './App.css';

const data = [
  {pos: 1, status: false, product: 'XXXX-', id: '1', name: 'blue', key: 1, active: false},
  {pos: 2, status: false, product: 'XXXX-', id: '2', name: 'red', key: 2, active: false},
  {pos: 3, status: false, product: 'XXXX-', id: '3', name: 'green', key: 3, active: false}
];

const nameOptions = [
  {value: 'blue', label: 'blue'},
  {value: 'red', label: 'red'},
  {value: 'green', label: 'green'}
];

let filterOptions = [];

const getItemById = (id) => {
  let foundItem = undefined;
  data.forEach(item => {
    if (item.id === id) {
      foundItem = item;
    }
  });
  return foundItem;
}

const getItemByPos = (pos) => {
  let foundItem = undefined;
  data.forEach(item => {
    if (item.pos === pos) {
      foundItem = item;
    }
  });
  return foundItem;
}

let newItem = false;

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

function TableItem({pos, status, product, id, name, active}) {

  const [state, setState] = React.useState({
    itemStatus: status,
    itemClassName: 'item',
    focusId: !id,
    focusName: false
  });

  const onClickStatus = (event) => {
    data.forEach((item) => {
      if (item.id === id) {
        item.status = !item.status;
      }
    });
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
    // console.log(typeof(e.target.className));
    // console.log(e.target.className);
    // console.log(e.target.tagName);
    if (e.target && ((typeof(e.target.className) !== 'string') || (e.target.tagName === 'DIV') || (e.target.tagName === 'IMG') ||
      e.target.className.includes('item_input') || (e.target.type === "checkbox"))) {
        return null;
    }
    data.forEach((item) => {
      if (item.id === id) {
        item.active = !item.active;
      }
    });
    if (state.itemClassName.includes('item_active')) {
      setState((prevState) => ({
        ...prevState,
        itemClassName: state.itemClassName.replace(' item_active', '')
      }));
    } else {
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

      data.unshift({
        pos: pos,
        status: state.itemStatus, 
        product: 'XXXX-', 
        id: document.getElementById('id').value, 
        name: document.getElementById('name').value, 
        key: data.length + 1, 
        active: state.itemClassName.includes('item_active')});
      nameOptions.unshift({value: document.getElementById('name').value, label: document.getElementById('name').value});
      // console.log(data[0]);

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

  return (
    <tr className={state.itemClassName} onClick={onClickItem}>
      <td><input type="checkbox" value={state.itemStatus} name="status" onClick={onClickStatus} /></td>
      <td>{product}</td>
      <td><input className='item_input' type="text" maxLength='3' defaultValue={id} 
        onKeyDown={onChangeId} autoFocus={state.focusId} onBlur={onSubmitId} id='id' /></td>
      <td>
        <Select className='item_input' id="img" placeholder='' options={imgOptions} onChange={onChangeImg} isDisabled={state.itemStatus} />
        <input className='item_input' type="text" defaultValue={name} 
        onKeyDown={onChangeName} autoFocus={state.focusName} onBlur={onSubmitName} id='name' />
      </td>
      <td><button className='item_delete' title='Удалить строку' onMouseOver={onMouseOverDelete} onMouseOut={onMouseOutDelete}>x</button></td>
    </tr>
  );
}

function App() {

  const [state, setState] = React.useState({
    btnClassName: 'btn_delete_all',
    addItem: newItem,
    filterOn: false
  });

  let items = [];
  if (state.filterOn) {
    const dataFilter = data.filter(item => {
      let i = 0;
      while (i < filterOptions.length) {
        if (item.name === filterOptions[i].value) {
          return true;
        }
        i++;
      }
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
    const item = {pos: data.length + 1, status: false, product: 'XXXX-', id: '', name: '', key: data.length + 1, active: false};
    items.unshift( <TableItem {...item} /> );
  }

  const onChangeTable = () => {
    // data.forEach(item => { console.log(item); });
    if (data.some((item) => item.active)) {
      if (!state.btnClassName.includes('btn_delete_all_active')) {
        setState((prevState) => ({
          ...prevState,
          btnClassName: 'btn_delete_all_active',
          addItem: newItem
        }))
      }
    } else {
      if (state.btnClassName.includes('btn_delete_all_active')) {
        setState((prevState) => ({
          ...prevState,
          btnClassName: 'btn_delete_all',
          addItem: newItem
        }))
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

  const onMouseOverSelectName = (event) => {
    document.getElementById('selectName').click();
  }

  const onChangeSelectName = (selectedOptions) => {
    // console.log(selectedOptions);
    filterOptions = selectedOptions;
    if (selectedOptions.length > 0) {
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

  return (
    <div className="App">
      <table className='table' onClick={onChangeTable}>
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
            <th><div onMouseOver={onMouseOverSelectName}><Select placeholder='' name="selectName" id="selectName" 
              className="select_name" options={nameOptions} isMulti onChange={onChangeSelectName}></Select></div></th>
            <th><button className={state.btnClassName}>x</button></th>
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
