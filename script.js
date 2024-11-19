

const swiper = new Swiper('.swiper', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,

    autoplay: {
        delay: 2000,  // Set delay to 1 second (1000 milliseconds)

        disableOnInteraction: false
    },

    speed: 1000,

    // If we need pagination
    pagination: {
        el: '.swiper-pagination',
    },

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    // And if we need scrollbar
    scrollbar: {
        el: '.swiper-scrollbar',
    },
});

// Get the hamburger and close icon
const hamburger = document.getElementById('hamburg');
const closeBtn = document.getElementById('close-btn');

// Get the inside-hamburg section
const insideHamburg = document.querySelector('.inside-hamburg');

// Add an event listener for the hamburger icon to toggle the menu visibility
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('fa-bars');
    hamburger.classList.toggle('fa-times');
    insideHamburg.classList.toggle('show');
});

// Add an event listener for the close icon to close the menu
closeBtn.addEventListener('click', () => {
    hamburger.classList.toggle('fa-bars');
    hamburger.classList.toggle('fa-times');
    insideHamburg.classList.remove('show');  // Close the menu
});



const buyNowButtons = document.querySelectorAll('.btn.btn-success');
const itemImg = document.querySelectorAll('.card-img-top');
const itemNames = document.querySelectorAll('.item-name');
const itemPrices = document.querySelectorAll('.price');

let itemMap = new Map(); // Use a Map to store unique items

function initBuy() {
    buyNowButtons.forEach((element, index) => {
        // Get data for each item
        const name = itemNames[index]?.innerText.trim();
        const price = itemPrices[index]?.innerText.trim();
        const image = itemImg[index]?.src;
        const btn = 'buy-' + (index + 1);
        element.id = btn;

        // Only add the item if the name is not already in the Map (no duplicates)
        if (!itemMap.has(name)) {
            itemMap.set(btn, { name, price, image });
        }
    });

    // Log the entire Map (itemMap)
    let itemObj = Object.fromEntries(itemMap);
    let jsonItem = JSON.stringify(itemObj, null, 4);
}

let noRepeat = new Set();
const cartCounter = document.getElementById('cart-counter');

// Function to update the cart counter
function updateCartCounter(event) {
    const btnId = event.target.id;
    noRepeat.add(btnId);

    cartCounter.innerText = noRepeat.size;

    // Show the cart counter when a product is added
    cartCounter.style.display = 'inline-block';

    // alert('Add item successfully!');
}

// Attach event listeners to all "Buy Now" buttons
buyNowButtons.forEach(button => {
    button.addEventListener('click', updateCartCounter);
});

// Reset the cart counter on page refresh
window.onload = function () {
    cartCounter.innerText = '0';
    itemMap.clear();
    noRepeat.clear();
    initBuy();
};



// Select the cart container and the cancel button
const cartContainer = document.getElementById('cart-container');
const cancelButton = document.getElementById('cancel');


// close cart
cartContainer.addEventListener('click', (event) => {
    if (event.target === cartContainer || event.target === cancelButton) {
        cartContainer.style.display = 'none';
    }
});

let selectedItem = new Map();
const cartItem = document.querySelector('.cart-items');


// get item selected
function getItems() {
    noRepeat.forEach((item) => {
        let itemDetails = itemMap.get(item);
        let noBuy = item.split('-')[1];
        if (selectedItem.has(noBuy)) {
            itemDetails.amount = selectedItem.get(noBuy).amount;
        }
        else {
            itemDetails.amount = 1;
        }
        selectedItem.set(noBuy, itemDetails);
    });
}


let total;
const totalPrice = document.querySelector('.total-price');

function printTotal() {
    total = 0.00;
    selectedItem.forEach((item) => {
        let price = parseFloat(item.price.replace(/[$,]/g, ''));
        total = total + price * item.amount;
    });

    totalPrice.innerText += total.toLocaleString();
}

function updatePrice(id) {
    const priceId = document.getElementById('p-' + id);
    let thisId = selectedItem.get(id);
    let price = thisId.price;

    priceId.innerText = `price : ${price} * ${thisId.amount}`;
}


// Unified input handler
function handleInput(element, id) {
    id = String(id);
    let thisId = selectedItem.get(id);

    if (thisId) {
        thisId.amount = element.value;

        totalPrice.innerHTML = `Total =&nbsp;`;
        updatePrice(id);
        printTotal();
    } else {
        console.error(`Item with id ${id} not found in selectedItem.`);
    }
}

// Keydown specifically for Enter
function handleEnter(event, element, id) {
    if (event.key === "Enter") {
        handleInput(element, id);
    }
}


function deleteItem(id) {
    id = String(id)

    selectedItem.delete(id);
    noRepeat.delete('buy-' + id);

    clearCart();
    printItems();
    printTotal();

    cartCounter.innerText = noRepeat.size;
}

function blockInvalidInput(event) {
    const invalidKeys = ['.', '-', '+', 'e']; // Add keys you want to block

    if (invalidKeys.includes(event.key)) {
        event.preventDefault(); // Prevent the input of these keys
    }
}


function printItems() {
    let counter = 1;
    selectedItem.forEach((item, id) => {
        cartItem.innerHTML += `
            <div class="itemName">
                <h5>` + counter + `. ` + item.name + `</h5>
                <i onclick="deleteItem(${id})" class=" fas fa-trash trashIcon"></i>
            </div>
            
        <div class="itemDec">
            <center>
                <p>amount : 
                <input oninput="handleInput(this, ${id})" step="1" onkeydown="blockInvalidInput(event)" value ="${item.amount}" class="itemInput" type="number" min="1"/></p>
                <img src="` + item.image + `" class="itemImg">
                <p id="p-${id}" style="font-size:1.5vi;" class="text-center">price : ` + item.price + ` * ` + item.amount + `</p>
            </center>
        </div>
        `;
        counter++;
    });
}



function clearCart() {
    cartItem.innerHTML = ``;
    if (noRepeat.size === 0) {
        cartItem.innerHTML = `<p>no items to show here.</p>`;
    }
    totalPrice.innerHTML = `Total =&nbsp;`;
}


// open cart
const cartSection = document.querySelector('.cart');
cartSection.addEventListener('click', () => {
    cartContainer.style.display = 'flex';
    getItems();
    clearCart();
    printItems();
    printTotal();
});


// ------------section id link---------------------------
function handleScroll(sectionId) {
    const section = document.getElementById(sectionId);

    section.addEventListener('click', (e) => {
        e.preventDefault();

        const offset = (window.innerWidth < 769) ? 200 : 100;

        window.scrollTo({
            behavior: 'smooth',
            top: section.offsetTop - offset,
        });
    });
}

handleScroll('road-b');
handleScroll('mountain-b');
// ---------------------------------------------------