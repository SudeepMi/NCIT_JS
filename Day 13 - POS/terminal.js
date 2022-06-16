const productList = document.querySelector('#productList');
const search = document.querySelector('#search');
const tbody = document.querySelector('#tbody');

var allProducts = JSON.parse(localStorage.getItem('products')) || [];
var currentInvoice = JSON.parse(localStorage.getItem('currentInvoice')) || [];

function printAllProducts(){
    productList.innerHTML = '';
    let __allProducts = allProducts.reverse();
    __allProducts.forEach(product => {
        const newItem = createCard(product);
        productList.innerHTML += newItem;
    })
}

function createCard(product){
    return `<div class="col-lg-3 col-md-6 my-2">
    <div class="card">
        <img src="${product.photo}" class="card-img-top" alt="..." height="150">
        <div class="card-body">
            <h6 class="card-title">${product.name}</h6>
            <p class="card-text">Rs. ${product.price}</p>
            <button class="btn btn-primary" onclick="addToInvoice('${product.id}')">
            <i class="fas fa-cart-plus mx-2"></i>
            Add</button>
        </div>
    </div>
</div>`
}

printAllProducts();
printInvoice();

search.addEventListener('input', (e) => {
    const searchValue = e.target.value;
    const filteredProducts = allProducts.filter(product => product.name.toLowerCase().includes(searchValue.toLowerCase()));
    productList.innerHTML = '';
    filteredProducts.forEach(product => {
        const newItem = createCard(product);
        productList.innerHTML += newItem;
    })                           
})

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

function createInvoiceCard(product){
    return `<tr>
    <td>${product.name}</td>
    <td>${product.price}</td>
    <td>
        <input type="number" value="${product.count}" onchange="updateInvoice('${product.id}', this.value)" class="form-control w-100" auto-focus>
    </td>
    <td>${product.price * product.count}</td>
    <td>
        <button type="button" class="btn btn-danger" onclick="deleteInvoiceItem('${product.id}')">
            <i class="fas fa-trash"></i>
        </button>
    </td>
</tr>`
}

function deleteInvoiceItem(id){
    currentInvoice = currentInvoice.filter(product => product.id !== id);
    localStorage.setItem('currentInvoice', JSON.stringify(currentInvoice));
    printInvoice();
}

function payAndPrint(){
    const invoice = JSON.parse(localStorage.getItem('currentInvoice')) || [];
    if(invoice.length === 0){
        return alert('Please add products to invoice');
    }
    const total = invoice.reduce((acc, product) => {
        return acc + product.price * product.count;
    },
    0);
    const receipt = `<h3 style="text-align:center;font-size:30px">Receipt</h3>
    <table class="table table-bordered" style="width: 100%; font-size: 25px; text-align: center;">
    <thead>
        <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
        </tr>
    </thead>
    <tbody>
        ${invoice.map(product => createReceiptCard(product)).join('')}
    </tbody>
    <tfoot>
        <tr style="padding: 10px;background: burlywood;font-size: 25px;" rowspan="3">
            <td colspan="3">Total</td>
            <td >${total}</td>
        </tr>
    </tfoot>
    </table>`;
    const printWindow = window.open('', '', 'height=400,width=600');
    printWindow.document.write(receipt);
    printWindow.print();
    printWindow.document.close();
    localStorage.removeItem('currentInvoice');
    printInvoice();
}

function createReceiptCard(product){
    return `<tr>
    <td style="padding: 5px 20px;">${product.name}</td>
    <td style="padding: 5px 20px;">${product.price}</td>
    <td style="padding: 5px 20px;">${product.count}</td>
    <td style="padding: 5px 20px;">${product.price * product.count}</td>
</tr>`
}

function updateInvoice(id, quantity){
    currentInvoice.forEach(product => {
        if(product.id == id){
            product.count = quantity;
        }
    })
    localStorage.setItem('currentInvoice', JSON.stringify(currentInvoice));
    printInvoice();
}

function clearInvoice(){
    localStorage.removeItem('currentInvoice');
    printInvoice();
}
