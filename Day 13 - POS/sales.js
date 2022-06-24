const salesList = document.querySelector('#salesList');
const filter = document.querySelector('#filter');
const today = document.querySelector('#today');
const yesterday = document.querySelector('#yesterday');
const thisWeek = document.querySelector('#thisWeek');
const thisMonth = document.querySelector('#thisMonth');
const cash = document.querySelector('#cash');
const esewa = document.querySelector('#esewa');

const allSales = JSON.parse(localStorage.getItem('allInvoice')) || [];

filter.addEventListener('change', filterSales);

// filter sales
function filterSales(e){
    const text = e.target.value.toLowerCase();
    switch (text) {
        case 'all':
            showSales(allSales);
            break;
        case 'cash':
            showSales(allSales.filter(sale => sale.payment === 'cash'));
            break;
        case 'esewa':
            showSales(allSales.filter(sale => sale.payment === 'esewa'));
            break;
        case 'yesterday':
            showSales(allSales.filter(sale => sale.date === getYesterday()));
            break;
        case 'today':
            showSales(allSales.filter(sale => sale.date === getToday()));
            break;
        case 'thisweek':
            showSales(allSales.filter(sale => {
              
                const date = new Date(sale.date);
                const day = date.getDay();
                const diff = date.getDate() - day + (day === 0 ? -6:1); // adjust when day is sunday
                return diff >= getThisWeek();
            }));
            break;
        case 'thismonth':
            showSales(allSales.filter(sale => {
                const date = new Date(sale.date);
                return date.getMonth() === new Date().getMonth();
            }));
            break;
        default:
            showSales(allSales);
            break;
    }

}
const createSaleCard = (sale) => {
    const {invoiceNumber, date, payment, total, customer, invoice} = sale;
    // insert rows into table
    const newItem = `
    <tr>
        <th scope="row">${invoiceNumber}</th>
        <td>${customer ? customer.name : ''}</td>
        <td>${total}</td>
        <td>${date}</td>
        <td>${payment}</td>
        <td>
        <a href="#" class="btn btn-primary" onclick="printInvoice('${invoiceNumber}')">
            <i class="fas fa-print"></i>
        </a>
        <a href="#" class="btn btn-warning" onclick="showInvoice('${invoiceNumber}')">
        <i class="fas fa-eye"></i>
    </a>
    </td>
    </tr>
    `;
    return newItem;
}

function showSales(sales){
    salesList.innerHTML = '';
    sales.forEach(sale => {
        const newItem = createSaleCard(sale);
        salesList.innerHTML += newItem;
    })
}
showSales(allSales);

const getYesterday = () => {
    const date = new Date();
    const _ = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + (date.getDate() - 1);
    return _;
}

const getToday = () => {
    const date = new Date();
    return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + (date.getDate());
}

const getThisWeek = () => {
    const date = new Date();
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6:1); // adjust when day is sunday
    return diff;
}

function printTotal(){
    const sales = {
        total: 0,
        cash: 0,
        esewa: 0,
        today: 0,
        yesterday: 0,
        thisWeek: 0,
        thisMonth: 0
    }
    
    allSales.forEach(sale => {
   
  
        const date = new Date(sale.date);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6:1); // adjust when day is sunday
     
        sales.total += sale.total;
        if(sale.payment === 'cash'){
            sales.cash += sale.total;
        }
        if(sale.payment === 'esewa'){
            sales.esewa += sale.total;
        }
        if(sale.date === getToday()){
            sales.today += sale.total;
        }
        if(sale.date === getYesterday()){
            sales.yesterday += sale.total;
        }
        if(diff >= getThisWeek()){
           
            sales.thisWeek += sale.total;
        }
        if(date.getMonth() === new Date().getMonth()){
            sales.thisMonth += sale.total;
        }
    })

    today.innerHTML = "Rs. " + sales.today;
    yesterday.innerHTML = "Rs. " + sales.yesterday;
    thisWeek.innerHTML = "Rs. " + sales.thisWeek;
    thisMonth.innerHTML = "Rs. " + sales.thisMonth;
    cash.innerHTML = "Rs. " + sales.cash;
    esewa.innerHTML = "Rs. " + sales.esewa;
}
printTotal(allSales);

function createReceiptCard(product){
    return `<tr>
    <td>${product.name}</td>
    <td>${product.price}</td>
    <td>${product.count}</td>
    <td>${product.price * product.count}</td>
    </tr>`
}

function makeRecipt(invoiceNumber){
    const invoice = allSales.find(sale => sale.invoiceNumber === invoiceNumber);
    console.log(invoice)
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
            <h5>Invoice Number : <span class="text-bold">#${invoice.invoiceNumber}<span></h5>
        </div>
        <div class="col-md-6">
            <h5>Date : ${invoice.date}</h5>
        </div>
    </div>
    <div class="row">
        <div class="col-md-6">
            <h5>Time: ${invoice.time}</h5>
        </div>
        <div class="col-md-6">
            <h5>Total: ${invoice.total}</h5>
        </div>
    </div>
    <hr />
    <h5>Customer Details</h5>
    <div class="row">
        <div class="col-md-4">
            <h5>Name: ${String(invoice.customer.name).toUpperCase()}</h5>
        </div>
        <div class="col-md-4">
            <h5>Phone: ${invoice.customer.phone}</h5>
        </div>
        <div class="col-md-4">
            <h5>Payment: ${invoice.payment}</h5>
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
        ${invoice.invoice.map(product => createReceiptCard(product)).join('')}
    </tbody>
    <tfoot>
        <tr style="padding: 10px;background: burlywood;font-size: 25px;" rowspan="3">
            <td colspan="3">Total</td>
            <td >${invoice.total}</td>
        </tr>
    </tfoot>
    </table>
    </body>
    </html>`;

    return receipt;
}

function printInvoice(invoiceNumber){
    const newRecipt = makeRecipt(invoiceNumber);
    const printWindow = window.open('','','width=800,height=600');
    printWindow.document.write(newRecipt);
    printWindow.print();
    printWindow.document.close();
}
function showInvoice(invoiceNumber){
    const newRecipt = makeRecipt(invoiceNumber);
    const printWindow = window.open('','','width=800,height=600');
    printWindow.document.write(newRecipt);
}