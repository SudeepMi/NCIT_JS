const editProductBtn = document.querySelector('#editProductBtn');
const productName = document.querySelector('#itemName');
const productPrice = document.querySelector('#itemPrice');
const productQuantity = document.querySelector('#itemQuantity');
const productPhoto = document.querySelector('#itemPhoto');
const itemPhotoPreview = document.querySelector('#itemPhotoPreview');
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

// get id from url
const url = new URL(window.location.href);
const id = url.searchParams.get('id');

// filter product by id
var selectedProduct = allProducts.filter(product => product.id === id);

// insert old values to inputs
productName.value = selectedProduct[0].name;
productPrice.value = selectedProduct[0].price;
productQuantity.value = selectedProduct[0].quantity;
itemPhotoPreview.src = selectedProduct[0].photo;

productPhoto.addEventListener('change', (e) => {
    const file = e.target.files[0];
    product.photo = "./img/products/"+file.name;
    itemPhotoPreview.src = product.photo;
})

editProductBtn.addEventListener('click', () => {
    selectedProduct[0].name = productName.value;
    selectedProduct[0].price = productPrice.value;
    selectedProduct[0].quantity = productQuantity.value;
    selectedProduct[0].photo = itemPhotoPreview.src;
    localStorage.setItem('products', JSON.stringify(allProducts));
    resetInputs();
    location.replace('index.html');
})

function resetInputs(){
    productName.value = '';
    productPrice.value = '';
    productQuantity.value = '';
    productPhoto.value = '';
}

