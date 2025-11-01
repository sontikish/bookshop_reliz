// Оголошуємо асинхронну функцію для отримання продуктів з сервера
async function getProducts() {
    // Виконуємо запит до файлу "store_db.json" та очікуємо на відповідь
    let response = await fetch("store.json")
    // Очікуємо на отримання та розпакування JSON-даних з відповіді
    let products = await response.json()
    // Повертаємо отримані продукти
    return products
};
function getCardHTML(product) {
    return `<div class="card" style="width: 18rem;">
  <img src="${product.image}" class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">${product.title}</h5>
    <p class="card-text">${product.price}</p>
    <a href="#" class="btn btn-primary" data-product='${JSON.stringify(product)}'>В КОРЗИНУ</a>
  </div>
</div>`
}

class ShoppingCart {
    constructor() {
        this.items = {} // об’єкт з товарами у кошику
        this.total = 0  // загальна вартість замовлення
    }

    addItem(item) { // Додавання товару до кошика 
        if(this.items[item.title]){
            this.items[item.title].quantity += 1
        }  else{
            this.items[item.title]=item
            this.items[item.title].quantity = 1
        }
    }  
    	
    saveCartToCookies() { // збереження кошика у кукі
        let cartJSON = JSON.stringify(this.items);
        document.cookie = `cart=${cartJSON}; max-age=${60 * 60 * 24 * 7}; path=/`;
    }

    loadCartFromCookies() { // Завантаження кошика з кукі
                let cartCookie = getCookieValue('cart');
        if (cartCookie && cartCookie !== '') {
            this.items = JSON.parse(cartCookie);
    }
}
}

let cart = new ShoppingCart() // Створення об'єкта кошика

function addToCard(event) {
    // Отримуємо дані про товар з data-атрибута кнопки
    const productData = event.target.getAttribute('data-product')
    const product = JSON.parse(productData) // перетворюємо JSON у об’єкт 
    // Тут будемо додавати товар до кошика
    cart.addItem(product);
}

// Викликаємо асинхронну функцію та очікуємо на отримання продуктів
getProducts().then(function (products) {
    let productsList = document.querySelector('.products-list')
    if (productsList) {
        products.forEach(function (product) {
// Відображаємо товари на сторінці
            productsList.innerHTML += getCardHTML(product)
        })
    }


    // Отримуємо всі кнопки "Купити" на сторінці
    let buyButtons = document.querySelectorAll('.products-list .cart-btn');
    // Навішуємо обробник подій на кожну кнопку "Купити"
    if (buyButtons) {
        buyButtons.forEach(function (button) {
            button.addEventListener('click', addToCart)
        });
    }
})





