const productList = document.querySelector('#productList');
const search = document.querySelector('#search');
const tbody = document.querySelector('#tbody');
const inumber = document.querySelector('#inumber');
const ctotal = document.querySelector('#ctotal');
const cdate = document.querySelector('#cdate');
const ctime = document.querySelector('#ctime');
const cname = document.querySelector('#cname');
const cphone = document.querySelector('#cphone');
const cmode = document.querySelector('#cmode');

var allProducts = JSON.parse(localStorage.getItem('products')) || [];
var currentInvoice = JSON.parse(localStorage.getItem('currentInvoice')) || [];
var allInvoice = JSON.parse(localStorage.getItem('allInvoice')) || [];

window.scrollTo(0, document.body.scrollHeight);


// assign invoice number to current invoice
function assignInvoiceNumber(){
    if(allInvoice.length === 0){
        inumber.innerHTML = 'INV-1';
    }
    else{
        var lastInvoice = allInvoice[allInvoice.length - 1];
        var lastInvoiceNumber = lastInvoice.invoiceNumber;
        var lastInvoiceNumberSplit = lastInvoiceNumber.split('-');
        var lastInvoiceNumberNumber = parseInt(lastInvoiceNumberSplit[1]);
        var newInvoiceNumber = 'INV-' + (lastInvoiceNumberNumber + 1);
        inumber.innerHTML = newInvoiceNumber;
    }
}

assignInvoiceNumber();

function printAllProducts(){
    productList.innerHTML = ''
    let __allProducts = allProducts.reverse();
    __allProducts.forEach(product => {
        const newItem = createCard(product);
        productList.innerHTML += newItem;
    })
}

printAllProducts();
printInvoice();

function createCard(product){
    return `<div class="col-lg-3 col-md-6 my-2">
    <div class="card">
        <img src="${product.photo}" class="card-img-top" alt="..."
            height="150">
        <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">Rs. ${product.price}</p>
            <span class="text-small text-muted">${product.quantity} in stock</span>
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
        <input type="number" class="form-control w-100" value="${product.count}" onchange="updateInvoice('${product.id}',this.value)">
    </td>
    <td>${product.price * product.count}</td>
    <td>
        <button type="button" class="btn btn-danger" onclick="deleteInvoiceItem('${product.id}')">
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
    const d = new Date();

    const invoice = JSON.parse(localStorage.getItem('currentInvoice')) || [];
    tbody.innerHTML = '';
    invoice.forEach(product => {
        const newItem = createInvoiceCard(product);
        tbody.innerHTML += newItem;
    })
    ctotal.innerHTML = calculateTotal();
    cdate.innerHTML = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    ctime.innerHTML = d.getHours() + ':' + d.getMinutes();
}

function deleteInvoiceItem(id){
    currentInvoice = currentInvoice.filter(product => product.id !== id);
    localStorage.setItem('currentInvoice', JSON.stringify(currentInvoice));
    printInvoice();
}

function updateInvoice(id, count){
    if(count<0){
        count = 0;
        alert('Quantity cannot be negative');
        return;
    }
    currentInvoice.forEach(product => {
        if(product.id === id){
            if(count <= product.quantity){
                product.count = count;
            }else{
                return alert('Not enough quantity');
            }

        }
    })
    localStorage.setItem('currentInvoice', JSON.stringify(currentInvoice));
    printInvoice();
}

function clearInvoice(){
    currentInvoice = [];
    localStorage.setItem('currentInvoice', JSON.stringify(currentInvoice));
    printInvoice();
}

function payAndPrint(){
    const invoice = JSON.parse(localStorage.getItem('currentInvoice')) || [];
    if(invoice.length == 0){
        alert('No items in invoice');
        return;
    }

    const total = invoice.reduce((acc, product) => {
        return acc + (product.price * product.count);
    }, 0);

    // deduct from inventory
    invoice.forEach(product => {
        allProducts.forEach(p => {
            if(p.id === product.id){
                p.quantity -= product.count;
            }
        })
        // save
        localStorage.setItem('products', JSON.stringify(allProducts));
    })

    const receipt = `
    <html>
    <head>
        <title>Invoice</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    </head>
    <body>
    <h3 style="text-align:center;font-size:30px">Receipt</h3><hr />
    <div class="row">
        <div class="col-md-6">
            <h5>Invoice Number : <span class="text-bold">#${inumber.innerHTML}<span></h5>
        </div>
        <div class="col-md-6">
            <h5>Date : ${cdate.innerHTML}</h5>
        </div>
    </div>
    <div class="row">
        <div class="col-md-6">
            <h5>Time: ${ctime.innerHTML}</h5>
        </div>
        <div class="col-md-6">
            <h5>Total: ${total}</h5>
        </div>
    </div>
    <hr />
    <h5>Customer Details</h5>
    <div class="row">
        <div class="col-md-4">
            <h5>Name: ${String(cname.value).toUpperCase()}</h5>
        </div>
        <div class="col-md-4">
            <h5>Phone: ${cphone.value}</h5>
        </div>
        <div class="col-md-4">
            <h5>Payment: ${cmode.value}</h5>
            </div>
    </div>
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
    </table>
    </body>
    </html>`;

    const printWindow = window.open('','','width=800,height=600');
    printWindow.document.write(receipt);
    printWindow.print();
    printWindow.document.close();
    // add current invoice to invoice
    allInvoice.push({
        invoiceNumber: inumber.innerHTML,
        invoice: currentInvoice,
        total: total,
        date: cdate.innerHTML,
        time: ctime.innerHTML,
        customer: {
            name: cname.value,
            phone: cphone.value,
        },
        payment: cmode.value
    });
    localStorage.setItem('allInvoice', JSON.stringify(allInvoice));
    clearInvoice();

    // reset inputs
    cname.value = '';
    cphone.value = '';
    cmode.value = '';
}

function createReceiptCard(product){
    return `<tr>
    <td>${product.name}</td>
    <td>${product.price}</td>
    <td>${product.count}</td>
    <td>${product.price * product.count}</td>
    </tr>`
}

search.addEventListener('input', (e) => {
    const searchValue = e.target.value;
    const filteredProducts = allProducts
                                .filter(product => product.name.toLowerCase()
                                .includes(searchValue.toLowerCase()));
    productList.innerHTML = '';
    filteredProducts.forEach(product => {
        const newItem = createCard(product);
        productList.innerHTML += newItem;
    })
})

//calculate total
function calculateTotal(){
    const invoice = JSON.parse(localStorage.getItem('currentInvoice')) || [];
    const total = invoice.reduce((acc, product) => {
        return acc + (product.price * product.count);
    }, 0);
    return total;
}
