"use strict"

// Main elements
const addItem = document.querySelector('.add__item');
const inputItem = document.querySelector('#inputItem');
const addBtn = document.querySelector('.add__item__btn');

// Load list with loading page
window.addEventListener('load', () => {
    const items = storageParse();
    
    if (items) {
        for (let el in items) {
            createItem(items, el);
            i++;
        }
    }

    createNavigataion();
});

// Events for add item
let i = 0;

const inputCheck = () => {
    if (inputItem.value.length <= 3) {
        alert('Minimum 3 characters');
    } else {
        createItem(false, false);
        i++;
    }
}

inputItem.addEventListener('keyup', e => {if (e.code == 'Enter') inputCheck()});
addBtn.addEventListener('click', inputCheck);


/* ===== Creating Items ===== */

// List from localstorage
const storageParse = () => {
    let items = localStorage.getItem('toDoItems');
    if (items === {}) {
        localStorage.removeItem('toDoItems');
        return false;
    }
    else if (items && items[2] == ' ') {
        items = items.slice(0, items.indexOf(' ') - 1) + items.slice(items.indexOf(' ') + 1, items.length);
    }
    items = JSON.parse(items);

    return items;
}

const createItem = (items, el) => {
    // Create main items
    const item = document.createElement('div');
    item.className = 'item';
    item.id = items ? el : `name-${i}`;
    if (items) {
        let tempItem = items[el];

        delete items[el];
        items[item.id] = tempItem;

        items = JSON.stringify(items);
        localStorage.removeItem('toDoItems');
        localStorage.setItem('toDoItems', items);

        items = JSON.parse(items);
    }


    const itemCheck = document.createElement('div');
    const itemCheckIcon = document.createElement('i');
    itemCheck.className = 'item__check';
    itemCheckIcon.className = 'fa-solid fa-check';
    itemCheck.appendChild(itemCheckIcon);
    item.appendChild(itemCheck);

    const itemName = document.createElement('div');
    itemName.className = 'item__name';
    itemName.innerHTML = items ? items[item.id].name : inputItem.value;
    inputItem.value = '';
    item.appendChild(itemName);

    const itemDel = document.createElement('div');
    itemDel.className = 'item__del';
    itemDel.innerText = 'x';
    item.appendChild(itemDel);

    // Style checked elements
    let isChecked = items ? items[item.id].isChecked : false;
    const checIsChecked = (a) => {
        if (a) {
            itemCheck.classList.add('active');
        } else {
            itemCheck.classList.remove('active');
        }
    }
    checIsChecked(isChecked);
    
    // Process localStorage
    const itemInfo = {};
    itemInfo[item.id] = {
        'name': itemName.textContent,
        'isChecked': isChecked,
    }
    let info = JSON.stringify(itemInfo);

    items = storageParse();
    if (!items || items === {}) localStorage.setItem('toDoItems', info);
    else {
        info = `${localStorage.getItem('toDoItems').slice(0, -1)}, ${info.slice(1, info.length)}`;
        localStorage.removeItem('toDoItems');
        localStorage.setItem('toDoItems', info);
    }
    
    addItem.after(item);
    countItems();
    visibleItems();

    // Event click for check elements
    itemCheck.addEventListener('click', () => {
        isChecked = !isChecked;
        checIsChecked(isChecked);

        let temp = storageParse();
        temp[item.id].isChecked = isChecked;
        temp = JSON.stringify(temp);
        localStorage.removeItem('toDoItems');
        localStorage.setItem('toDoItems', temp);

        countItems();
        visibleItems();
    });

    // Delete element on click 'x'
    itemDel.addEventListener('click', () => {
        item.remove();

        let temp = storageParse();
        delete temp[item.id];
        temp = JSON.stringify(temp);
        localStorage.removeItem('toDoItems');
        localStorage.setItem('toDoItems', temp);
        
        countItems();
        visibleItems();
    });
}

// Navigatio bar
const countItems = () => {
    const navigationCount = document.querySelector('.navigation__count');

    const items = storageParse();
    let i = 0;

    for (let el in items) {
        if (navigationActive() == 'all') i++;
        else if(navigationActive() == 'active') {
            if (items[el].isChecked == false) i++;
        }
        else if(navigationActive() == 'completed') {
            if (items[el].isChecked == true) i++;
        }
    }
    navigationCount.textContent = `${i} items`;
}

const createNavigataion = () =>  {
    const navigationBarAll = document.querySelector('.navigation__bar__all');
    navigationBarAll.classList.add('active');
    const navigationBarActive = document.querySelector('.navigation__bar__active');
    const navigationBarCompleted = document.querySelector('.navigation__bar__completed');
    const navigationClear = document.querySelector('.navigation__clear'); 

    countItems();

    navigationBarAll.addEventListener(('click'), () => {
        navigationBarAll.classList.add('active');
        navigationBarActive.classList.remove('active');
        navigationBarCompleted.classList.remove('active');
        countItems();
        visibleItems();
    });
    navigationBarActive.addEventListener(('click'), () => {
        navigationBarAll.classList.remove('active');
        navigationBarActive.classList.add('active');
        navigationBarCompleted.classList.remove('active');
        countItems();
        visibleItems();
    });
    navigationBarCompleted.addEventListener(('click'), () => {
        navigationBarAll.classList.remove('active');
        navigationBarActive.classList.remove('active');
        navigationBarCompleted.classList.add('active');
        countItems();
        visibleItems();
    });

    navigationClear.addEventListener('click', () => {
        const items = storageParse();

        for (let el in items) {
            if (items[el].isChecked == true) {
                document.querySelector(`#${el}`).remove();

                let temp = storageParse();
                delete temp[el];
                temp = JSON.stringify(temp);
                localStorage.removeItem('toDoItems');
                localStorage.setItem('toDoItems', temp);
            }
        }

        countItems();
        visibleItems();
    });
}

const navigationActive = () => {
    const navigationBarAll = document.querySelector('.navigation__bar__all');
    const navigationBarActive = document.querySelector('.navigation__bar__active');
    const navigationBarCompleted = document.querySelector('.navigation__bar__completed');
    const navigationBarList = [navigationBarAll, navigationBarActive, navigationBarCompleted];

    let a;

    navigationBarList.forEach(el => {
        if (el.classList.contains('active')) {
            if (el == navigationBarAll) a = 'all';
            else if (el == navigationBarActive) a = 'active';
            else a = 'completed';
        }
    });

    return a;
}

const visibleItems = () => {
    const items = storageParse();
    const visibleItem = navigationActive();

    for (let el in items) {
        const selectedItem = document.querySelector(`#${el}`);

        if (visibleItem == 'all') selectedItem.style.display = 'flex';
        else if(visibleItem == 'active') {
            if (items[el].isChecked == false) selectedItem.style.display = 'flex';
            else selectedItem.style.display = 'none';
        }
        else if(visibleItem == 'completed') {
            if (items[el].isChecked == true) selectedItem.style.display = 'flex';
            else selectedItem.style.display = 'none';
        }
    }
}

