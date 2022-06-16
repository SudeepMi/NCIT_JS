const addProductBtn = document.querySelector('#addProductBtn');
const productList = document.querySelector('#productList');
const productName = document.querySelector('#itemName');
const productPrice = document.querySelector('#itemPrice');
const productQuantity = document.querySelector('#itemQuantity');
const productPhoto = document.querySelector('#itemPhoto');
const search = document.querySelector('#search');

const product = {
    id:'',
    name:'',
    price:'',
    quantity:'',
    photo:'',
    reset : function(){
        this.id = '';
        this.name = '';
        this.price = '';
        this.quantity = '';
        this.photo = '';
        return this;
    }
}

var allProducts = JSON.parse(localStorage.getItem('products')) || [];


productPhoto.addEventListener('change', (e) => {
    const file = e.target.files[0];
    product.photo = "./img/products/"+file.name;
})

addProductBtn.addEventListener('click', () => {
    product.name = productName.value;
    product.price = productPrice.value;
    product.quantity = productQuantity.value;
    product.id = Math.random().toString(36).substring(2,7);
    allProducts.reverse().push(product);
    localStorage.setItem('products', JSON.stringify(allProducts));
    printAllProducts();
    product.reset();
    resetInputs();
    location.reload();
})


function printAllProducts(){
    productList.innerHTML = '';
    let __allProducts = allProducts.reverse();
    __allProducts.forEach(product => {
        const newItem = createCard(product);
        productList.innerHTML += newItem;
    })
}

function createCard(product){
    return `<div class="product-card">
    <div class="product-image">
      <img
        src="${product.photo}"
        alt="${product.name}"
      />
    </div>
    <div class="product-info">
      <h5>
        ${product.name}
      </h5>
      <p>Rs. ${product.price}</p>
      <p class="text-muted">${product.quantity} in stock</p>
      <span>
          <button type="button" class="btn btn-success" onclick="editItem('${product.id}')" >
            <i class="fas fa-pen"></i>
          </button>
            <button type="button" class="btn btn-danger" onclick="deleteItem('${product.id}')">
                <i class="fas fa-trash"></i>
            </button>
      </span>
    </div>
  </div>`

}

printAllProducts();

function resetInputs(){
    productName.value = '';
    productPrice.value = '';
    productQuantity.value = '';
    productPhoto.value = '';
}

function deleteItem(id){
    allProducts = allProducts.filter(product => product.id !== id);
    localStorage.setItem('products', JSON.stringify(allProducts.reverse()));
    printAllProducts();
}

function editItem(id){
    return location.replace("editproduct.html?id="+id);
}

search.addEventListener('input', (e) => {
    const searchValue = e.target.value;
    const filteredProducts = allProducts.filter(product => product.name.toLowerCase().includes(searchValue.toLowerCase()));
    productList.innerHTML = '';
    filteredProducts.forEach(product => {
        const newItem = createCard(product);
        productList.innerHTML += newItem;
    })                           
})
