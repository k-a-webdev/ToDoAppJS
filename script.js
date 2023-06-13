"use strict"

const addItem = document.querySelector('.add__item');
const inputItem = document.querySelector('#inputItem');
const addBtn = document.querySelector('.add__item__btn');

let i = 0;

addBtn.addEventListener('click', () => {
    createItem(false, false);
    i++;
});

const safeParseItems = () => {
    let items = localStorage.getItem('toDoItems');
    if (items[2] == ' ') {
        items = items.slice(0, items.indexOf(' ') - 1) + items.slice(items.indexOf(' ') + 1, items.length);
    }
    items = JSON.parse(items);

    return items;
}

window.addEventListener('load', () => {
    const items = safeParseItems();
    for (let el in items) {
        createItem(items, el);
        i++;
    }

    createNavigataion();
});

// Creating Items
const createItem = (items, el) => {
    const item = document.createElement('div');
    item.classList.add('item');
    item.id = items ? el : `name-${i}`;

    const itemCheck = document.createElement('div');
    const itemCheckIcon = document.createElement('i')
    itemCheck.classList.add('item__check');
    itemCheckIcon.classList.add('fa-solid', 'fa-check');
    itemCheck.appendChild(itemCheckIcon);
    item.appendChild(itemCheck);

    const itemName = document.createElement('div');
    itemName.classList.add('item__name');
    itemName.innerHTML = items ? items[el].name : inputItem.value;
    inputItem.value = '';
    item.appendChild(itemName);

    const itemDel = document.createElement('div');
    itemDel.className = 'item__del';
    itemDel.innerText = '+';
    item.appendChild(itemDel);

    let isChecked = items ? items[el].isChecked : false;
    const checIsChecked = (a) => {
        if (a) {
            itemCheck.classList.add('active');
            itemName.style.textDecoration = 'line-through';
            itemName.style.opacity = 0.7;
        } else {
            itemCheck.classList.remove('active');
            itemName.style.textDecoration = 'none';
            itemName.style.opacity = 1;
        }
    }
    checIsChecked(isChecked);
    itemCheck.addEventListener('click', () => {
        isChecked = !isChecked;
        checIsChecked(isChecked);

        let temp = safeParseItems();
        temp[item.id].isChecked = isChecked;
        temp = JSON.stringify(temp);
        localStorage.removeItem('toDoItems');
        localStorage.setItem('toDoItems', temp);
    });
    

    if (!items) {
        const itemInfo = {};
        itemInfo[item.id] = {
            'name': itemName.textContent,
            'isChecked': isChecked,
        }
        const itemsInfo = () => {
            let info = JSON.stringify(itemInfo);
            if (localStorage.getItem('toDoItems') === null) {
                localStorage.setItem('toDoItems', info);
            } else {
                info = `${localStorage.getItem('toDoItems').slice(0, -1)}, ${info.slice(1, info.length)}`;
                localStorage.removeItem('toDoItems');
                localStorage.setItem('toDoItems', info);
            }
        }
        
        itemsInfo();
    }
    
    addItem.after(item);
    countItems();


    itemDel.addEventListener('click', () => {
        item.remove();

        let temp = safeParseItems();
        delete temp[item.id];
        temp = JSON.stringify(temp);
        localStorage.removeItem('toDoItems');
        localStorage.setItem('toDoItems', temp);
        
        countItems();
    });
}

// Navigatio bar
const countItems = () => {
    const navigationCount = document.querySelector('.navigation__count');
    const navigationBarAll = document.querySelector('.navigation__bar__all');
    const navigationBarActive = document.querySelector('.navigation__bar__active');
    const navigationBarCompleted = document.querySelector('.navigation__bar__completed');
    const navigationBarList = [navigationBarAll, navigationBarActive, navigationBarCompleted];

    const navigationActive = () => {
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
    const items = safeParseItems();
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
    const navigationCount = document.querySelector('.navigation__count');
    const navigationBarAll = document.querySelector('.navigation__bar__all');
    navigationBarAll.classList.add('active');
    const navigationBarActive = document.querySelector('.navigation__bar__active');
    const navigationBarCompleted = document.querySelector('.navigation__bar__completed');
    const navigationClear = document.querySelector('.navigation__clear');

    const items = safeParseItems();
    let navigationActive = 'all';

    countItems();

    const visibleItems = (visibleItem) => {
        for (let el in items) {
            const selectedItem = document.querySelector(`#${el}`)
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

    navigationBarAll.addEventListener(('click'), () => {
        navigationActive ='all';
        navigationBarAll.classList.add('active');
        navigationBarActive.classList.remove('active');
        navigationBarCompleted.classList.remove('active');
        countItems();
        visibleItems(navigationActive);
    });
    navigationBarActive.addEventListener(('click'), () => {
        navigationActive ='active';
        navigationBarAll.classList.remove('active');
        navigationBarActive.classList.add('active');
        navigationBarCompleted.classList.remove('active');
        countItems();
        visibleItems(navigationActive);
    });
    navigationBarCompleted.addEventListener(('click'), () => {
        navigationActive ='completed';
        navigationBarAll.classList.remove('active');
        navigationBarActive.classList.remove('active');
        navigationBarCompleted.classList.add('active');
        countItems();
        visibleItems(navigationActive);
    });

    navigationClear.addEventListener('click', () => {
        const items = safeParseItems();

        for (let el in items) {
            if (items[el].isChecked == true) {
                document.querySelector(`#${el}`).remove();

                let temp = safeParseItems();
                delete temp[el];
                temp = JSON.stringify(temp);
                localStorage.removeItem('toDoItems');
                localStorage.setItem('toDoItems', temp);
            }
        }

        countItems();
    });
}

