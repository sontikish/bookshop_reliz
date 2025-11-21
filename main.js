// Функція для отримання значення кукі за ім'ям
function getCookieValue(cookieName) {
  // Розділяємо всі куки на окремі частини
  const cookies = document.cookie.split(";");

  // Шукаємо куки з вказаним ім'ям
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim(); // Видаляємо зайві пробіли

    // Перевіряємо, чи починається поточне кукі з шуканого імені
    if (cookie.startsWith(cookieName + "=")) {
      // Якщо так, повертаємо значення кукі
      return cookie.substring(cookieName.length + 1); // +1 для пропуску символу "="
    }
  }
  // Якщо кукі з вказаним іменем не знайдено, повертаємо порожній рядок або можна повернути null
  return "";
}

// Оголошуємо асинхронну функцію для отримання продуктів з сервера
async function getProducts() {
  // Виконуємо запит до файлу "store_db.json" та очікуємо на відповідь
  let response = await fetch("store.json");
  // Очікуємо на отримання та розпакування JSON-даних з відповіді
  let products = await response.json();
  // Повертаємо отримані продукти
  return products;
}
function getCardHTML(product) {
  return `<div class="card" style="width: 18rem;">
  <img src="${product.image}" class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">${product.title}</h5>
    <p class="card-text">${product.price}</p>
    <a href="#" class="btn btn-primary" data-product='${JSON.stringify(
      product
    )}'>В КОШИК</a>
  </div>
</div>`;
}

// Відображаємо товари на сторінці
getProducts().then(function (products) {
  let productsList = document.querySelector(".products-list");
  if (productsList) {
    products.forEach(function (product) {
      productsList.innerHTML += getCardHTML(product);
    });
  }

  // Отримуємо всі кнопки "Купити" на сторінці
  let buyButtons = document.querySelectorAll(".products-list .btn-primary");
  // Навішуємо обробник подій на кожну кнопку "Купити"
  if (buyButtons) {
    buyButtons.forEach(function (button) {
      button.addEventListener("click", addToCart);
    });
  }
});

// Створення класу кошика
class ShoppingCart {
  constructor() {
    this.items = {};
    this.loadCartFromCookies(); // завантажуємо з кукі-файлів раніше додані в кошик товари
  }

  // Додавання товару до кошика
  addItem(item) {
    if (this.items[item.title]) {
      this.items[item.title].quantity += 1; // Якщо товар вже є, збільшуємо його кількість на одиницю
    } else {
      this.items[item.title] = item; // Якщо товару немає в кошику, додаємо його
      this.items[item.title].quantity = 1;
    }
    this.saveCartToCookies();
  }

  // Зберігання кошика в кукі
  saveCartToCookies() {
    let cartJSON = JSON.stringify(this.items);
    document.cookie = `cart=${cartJSON}; max-age=${60 * 60 * 24 * 7}; path=/`;
  }

  // Завантаження кошика з кукі
  loadCartFromCookies() {
    let cartCookie = getCookieValue("cart");
    if (cartCookie && cartCookie !== "") {
      this.items = JSON.parse(cartCookie);
    }
  }
  // Обчислення загальної вартості товарів у кошику
  calculateTotal() {
    let total = 0;
    for (let key in this.items) {
      // проходимося по всіх ключах об'єкта this.items
      total += this.items[key].price * this.items[key].quantity; // рахуємо вартість усіх товарів
    }
    return total;
  }

  clearCart() {
    this.items = {}; // очищаємо об'єкт кошика
    document.cookie = "cart=; max-age=0; path=/"; // видаляємо кукі
  }
}

// Створення об'єкта кошика
let cart = new ShoppingCart();

// Функція для додавання товару до кошика при кліку на кнопку "Купити"
function addToCart(event) {
  // Отримуємо дані про товар з data-атрибута кнопки
  const productData = event.target.getAttribute("data-product");
  const product = JSON.parse(productData);
  event.preventDefault();
  // Додаємо товар до кошика
  cart.addItem(product);
  console.log(cart);
}

//Корзина
let cart_list = document.querySelector(".cart-items-list");
let cart_total = document.querySelector(".cart-total");
let orderBtn = document.querySelector("#orderBtn");
let deleteBtn = document.querySelector("#deleteBtn");
let orderSection = document.querySelector(".order");
let orderForm = document.querySelector(".order-form");
let confirmBtn = document.querySelector(".confirm-order-btn");
function get_item(item) {
  return `<div  class="card mb-3" style="max-width: 540px;">
  <div class="row g-0">
    <div class="col-md-4">
      <img src="${item.image}" class="img-fluid rounded-start" alt="...">
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h5 class="card-title">${item.title}</h5>
          <div class="cart-item-quantity">Кількість: ${item.quantity}</div>
                <div class="cart-item-price" data-price="${item.price}">${
    item.price * item.quantity
  } грн</div>
      </div>
    </div>
  </div>
</div>`;
}

function showCartList() {
  cart_list.innerHTML = "";
  for (let key in cart.items) {
    // проходимося по всіх ключах об'єкта cart.items
    cart_list.innerHTML += get_item(cart.items[key]);
  }
  cart_total.innerHTML = cart.calculateTotal();
}

showCartList();

orderBtn.addEventListener("click", function (event) {
  orderBtn.style.display = "none";
  orderSection.style.display = "block";
});

confirmBtn.addEventListener("click", function () {
  if (orderForm.checkValidity()) {
    alert("Ваше замовлення успішно оформлено!");
    orderForm.reset();
  } else {
    orderForm.reportValidity();
  }
});

deleteBtn.addEventListener("click", function () {
  document.cookie = "cart=; max-age=0; path=/";
  location.reload();
});
