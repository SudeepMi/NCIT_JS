const addProductBtn = document.querySelector('#addProductBtn');
const productList = document.querySelector('#productList');
const productName = document.querySelector('#itemName');
const productPrice = document.querySelector('#itemPrice');
const productQuantity = document.querySelector('#itemQuantity');
const productPhoto = document.querySelector('#itemPhoto');

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
    }
}

const allProducts = [];


productPhoto.addEventListener('change', (e) => {
    const file = e.target.files[0];
    product.photo = "./img/products/"+file.name;
})

addProductBtn.addEventListener('click', () => {
    product.name = productName.value;
    product.price = productPrice.value;
    product.quantity = productQuantity.value;
    product.id = allProducts.length + 1;
    allProducts.push(product);
    localStorage.setItem('products', JSON.stringify(allProducts));

    // printAllProducts();
    // product.reset();
    // resetInputs();
})
