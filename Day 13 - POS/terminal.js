const productList = document.querySelector('#productList');
const search = document.querySelector('#search');
const tbody = document.querySelector('#tbody');

var allProducts = JSON.parse(localStorage.getItem('products')) || [];
var currentInvoice = JSON.parse(localStorage.getItem('currentInvoice')) || [];

function printAllProducts(){
    productList.innerHTML = ''
    let __allProducts = allProducts.reverse();
    __allProducts.forEach(product => {
        const newItem = createCard(product);
        productList.innerHTML += newItem;
    })
}

printAllProducts();

function createCard(product){
    return `<div class="col-lg-3 col-md-6 my-2">
    <div class="card">
        <img src="${product.photo}" class="card-img-top" alt="..."
            height="150">
        <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">Rs. ${product.price}</p>
            <a href="#" class="btn btn-primary" onclick="addToInvoice('${product.id}')">Add to Invoice</a>
        </div>
    </div>
</div>`
}

function createInvoiceCard(product){
    return `<tr>
    <td>${product.name}</td>
    <td>${product.price}</td>
    <td>
        <input type="number" class="form-control w-100" value="${product.count}">
    </td>
    <td>${product.price * product.count}</td>
    <td>
        <button type="button" class="btn btn-danger">
            <i class="fas fa-trash"></i>
        </button>
    </td>
</tr>`
}

function addToInvoice(id){
    const product = allProducts.find(product => product.id === id);
    product.count = 1;
    if(!currentInvoice.find(product => product.id === id)){
        currentInvoice.push(product);
    }
    localStorage.setItem('currentInvoice', JSON.stringify(currentInvoice));
    printInvoice();
}

function printInvoice(){
    const invoice = JSON.parse(localStorage.getItem('currentInvoice')) || [];
    tbody.innerHTML = '';
    invoice.forEach(product => {
        const newItem = createInvoiceCard(product);
        tbody.innerHTML += newItem;
    })
}