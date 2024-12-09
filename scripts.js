
document.addEventListener('DOMContentLoaded', () => {
    loadCustomers();
    loadCustomerNamesForSales();
    loadSales();
    addCustomerEventListeners();
});

function showTab(tabName) {
    let tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.style.display = 'none';
    });
    document.getElementById(tabName).style.display = 'block';
}

// new addcutomer
function addCustomer() {
    let customers = JSON.parse(localStorage.getItem('customers')) || [];
    let customer = {
        customerNumber: customers.length + 1,
        customerName: document.getElementById('customerName').value,
        category: document.getElementById('category').value,
        contactPerson: document.getElementById('contactPerson').value,
        tinNumber: document.getElementById('tinNumber').value,
        street: document.getElementById('street').value,
        barangay: document.getElementById('barangay').value,
        city: document.getElementById('city').value,
        email: document.getElementById('email').value,
        contactNumber: document.getElementById('contactNumber').value,
        pricePerBottle: document.getElementById('pricePerBottle').value,
        status: document.getElementById('status').value
    };

  // Add customer to the list and save to localStorage
  customers.push(customer);
  localStorage.setItem('customers', JSON.stringify(customers));

  // Clear the form after adding the customer
    clearCustomerForm();
   
  // Reload the customers in the report
    loadCustomers();
 
  // **Call the function to refresh salesCustomerName in the Sales Form**
     loadCustomerNamesForSales(); // Ensure the salesCustomerName dropdown is updated

    alert('Customer added successfully!');
}

function clearCustomerForm() {
    document.getElementById('customerFormElement').reset();
}

function loadCustomers() {
    let customers = JSON.parse(localStorage.getItem('customers')) || [];
    let customerTableBody = document.querySelector('#customerTable tbody');
    customerTableBody.innerHTML = '';
    customers.forEach(customer => {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.customerNumber}</td>
            <td>${customer.customerName}</td>
            <td>${customer.category}</td>
            <td>${customer.contactPerson || ''}</td>
            <td>${customer.tinNumber}</td>
            <td>${customer.street}</td>
            <td>${customer.barangay}</td>
            <td>${customer.city}</td>
            <td>${customer.email}</td>
            <td>${customer.contactNumber}</td>
            <td>${customer.pricePerBottle}</td>
            <td class="${customer.status === 'Non-Active' ? 'non-active' : ''}">${customer.status}</td>
            <td class="no-print">
                <button onclick="deleteCustomer(${customer.customerNumber})">Delete</button>
                <button onclick="showMap('${customer.street}', '${customer.barangay}', '${customer.city}')">Show Map</button>
            </td>
        `;
        customerTableBody.appendChild(row);
    });
}

function deleteCustomer(customerNumber) {
    let customers = JSON.parse(localStorage.getItem('customers')) || [];
    customers = customers.filter(customer => customer.customerNumber !== customerNumber);
    localStorage.setItem('customers', JSON.stringify(customers));
    loadCustomers();
}

function showMap(street, barangay, city) {
    let address = `${street}, ${barangay}, ${city}`;
    let mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(mapUrl, '_blank');
}

function addCustomerEventListeners() {
    document.getElementById('category').addEventListener('change', function() {
        let contactPersonDiv = document.getElementById('contactPersonDiv');
        if (this.value === 'Commercial' || this.value === 'Industrial' || this.value === 'Government') {
            contactPersonDiv.style.display = 'block';
        } else {
            contactPersonDiv.style.display = 'none';
        }
    });
}

function loadCustomerNamesForSales() {
    let customers = JSON.parse(localStorage.getItem('customers')) || [];
    let salesCustomerName = document.getElementById('salesCustomerName');
    salesCustomerName.innerHTML = '<option value="">Select Customer</option>';
    customers.forEach(customer => {
        let option = document.createElement('option');
        option.value = customer.customerName;
        option.textContent = customer.customerName;
        salesCustomerName.appendChild(option);
    });
}
function addSales() {
    let sales = JSON.parse(localStorage.getItem('sales')) || [];
    let sale = {
        date: document.getElementById('salesDate').value,
        orderSlip: document.getElementById('orderSlip').value,
        salesInvoice: document.getElementById('salesInvoice').value,
        orNumber: document.getElementById('orNumber').value,
        drNumber: document.getElementById('drNumber').value,
        // qrCode: document.getElementById('qrCode').value,
        customerName: document.getElementById('salesCustomerName').value,
        pricePerBottle: document.getElementById('salesPricePerBottle').value, 
        slim: document.getElementById('slim').value,
        round: document.getElementById('round').value,
        otherItems: document.getElementById('otherItems').value,
        myQRcode: document.getElementById('myQRcode').value,
        cashSales: document.getElementById('cashSales').value,
        accountReceivable: document.getElementById('accountReceivable').value,
        totalSales: document.getElementById('totalSales').value,
        batchno: document.getElementById('batchno').value,
        carno: document.getElementById('carno').value,
        timedept: document.getElementById('timedept').value,
        remarks: document.getElementById('remarks').value,
        fuel: document.getElementById('Fuel').value,
        labTest: document.getElementById('labTest').value,
        supplies: document.getElementById('supplies').value,
        othersmisc: document.getElementById('othersmisc').value
    };
    sales.push(sale);
    localStorage.setItem('sales', JSON.stringify(sales));
    clearSalesForm();
    loadSales();
    alert('Sales added successfully!');
    location.reload(); // Refresh page after adding sales
}

// Function to set today's date as the default value for the salesDate input
function setDefaultDate() {
    const salesDateInput = document.getElementById("salesDate");
    const today = new Date();

    // Format the date to YYYY-MM-DD for input type="date"
    const formattedDate = today.toISOString().split("T")[0];

    // Set the default value
    salesDateInput.value = formattedDate;
}

// Call the function on page load
document.addEventListener("DOMContentLoaded", setDefaultDate);


   // Initialize the autonumber counter for the Order Slip
// Load counters from localStorage or initialize them
let counters = JSON.parse(localStorage.getItem('counters')) || {
    orderSlip: 1,
    salesInvoice: 1,
    orNumber: 1,
    drNumber: 1
};

// Function to save counters to localStorage
function saveCounters() {
    localStorage.setItem('counters', JSON.stringify(counters));
}

// Format a number to 5 digits with leading zeros
function formatNumber(num) {
    return num.toString().padStart(5, '0');
}

// Utility function to handle toggle switches
function setupToggle(toggleId, inputId, counterKey) {
    const toggle = document.getElementById(toggleId);
    const input = document.getElementById(inputId);

    toggle.addEventListener('change', () => {
        if (toggle.checked) {
            // When toggle is ON, show the current counter value and increment it
            input.value = formatNumber(counters[counterKey]++);
            saveCounters(); // Save updated counters to localStorage
        } else {
            // When toggle is OFF, clear the input field
            input.value = "";
        }
    });

    // Initialize the input field to be empty by default (hidden value)
    input.value = "";
}

// Setup toggle switches for all fields
setupToggle('toggleOrderSlip', 'orderSlip', 'orderSlip');
setupToggle('toggleSalesInvoice', 'salesInvoice', 'salesInvoice');
setupToggle('toggleOR', 'orNumber', 'orNumber');
setupToggle('toggleDR', 'drNumber', 'drNumber');

// calculate sales
function calculateSales() {
    // Price calculation for bottles
    let pricePerBottleText = document.getElementById('salesPricePerBottle').value;
    let pricePerBottle = (pricePerBottleText === "3/100") ? 100 : parseFloat(pricePerBottleText);
    let slim = parseFloat(document.getElementById('slim').value) || 0;
    let round = parseFloat(document.getElementById('round').value) || 0;
    let otherItems = parseFloat(document.getElementById('otherItems').value) || 0;
    
    let totalBottles = slim + round + otherItems;
    let cashSales;
    
    if (pricePerBottleText === "3/100") {
        cashSales = Math.floor(totalBottles / 3) * 100 + (totalBottles % 3) * (pricePerBottle / 3);
    } else {
        cashSales = pricePerBottle * totalBottles;
    }

    // Calculate total sales without expenses
    document.getElementById('cashSales').value = cashSales.toFixed(2);
    let accountReceivable = parseFloat(document.getElementById('accountReceivable').value) || 0;
    let totalSales = (cashSales + accountReceivable).toFixed(2);

    // Add expenses deduction logic
    let fuel = parseFloat(document.getElementById('Fuel').value) || 0;
    let labTest = parseFloat(document.getElementById('labTest').value) || 0;
    let supplies = parseFloat(document.getElementById('supplies').value) || 0;
    let others = parseFloat(document.getElementById('othersmisc').value) || 0;

    // Deduct expenses from total sales
    let totalExpenses = fuel + labTest + supplies + others;
    let remainingSales = totalSales - totalExpenses;

    // Display the final remaining sales
    document.getElementById('totalSales').value = remainingSales.toFixed(2);
}

// calculate sales fin
function clearSalesForm() {
    document.getElementById('salesFormElement').reset();
}

// new load sales
function loadSales() {
    let sales = JSON.parse(localStorage.getItem('sales')) || [];
    
    // Sort sales in descending order by date
    sales.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let salesTableBody = document.querySelector('#salesTable tbody');
    salesTableBody.innerHTML = '';
    
    sales.forEach(sale => {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.date}</td>
            <td>${sale.orderSlip}</td>
            <td>${sale.salesInvoice}</td>
            <td>${sale.orNumber}</td>
            <td>${sale.drNumber}</td>
            <td>${sale.myQRcode}</td>
            <td>${sale.customerName}</td>
            <td>${sale.pricePerBottle}</td>
            <td>${sale.slim}</td>
            <td>${sale.round}</td>
            <td>${sale.otherItems}</td>
            <td>${sale.cashSales}</td>
            <td>${sale.accountReceivable}</td>
            <td>${sale.totalSales}</td>
            <td>${sale.remarks}</td>
            <td>${sale.fuel}</td>
            <td>${sale.labTest}</td>
            <td>${sale.supplies}</td>
            <td>${sale.othersmisc}</td>
            <td class="no-print">
                <button onclick="deleteSales('${sale.date}', '${sale.customerName}')">Delete</button>
            </td>
        `;
        salesTableBody.appendChild(row);
    });
}

function deleteSales(date, customerName) {
    let sales = JSON.parse(localStorage.getItem('sales')) || [];
    sales = sales.filter(sale => sale.date !== date || sale.customerName !== customerName);
    localStorage.setItem('sales', JSON.stringify(sales));
    loadSales();
}

function printCustomerReport() {
    window.print();
}

function printSalesReport() {
    window.print();
}

// add costumer 
document.getElementById('salesCustomerName').addEventListener('change', (event) => {
    let customerName = event.target.value;
    let customers = JSON.parse(localStorage.getItem('customers')) || [];
    let customer = customers.find(c => c.customerName === customerName);
    document.getElementById('salesPricePerBottle').value = customer.pricePerBottle;
    calculateSales(); // Recalculate sales when customer changes
});

['slim', 'round', 'otherItems', 'accountReceivable'].forEach(id => {
    document.getElementById(id).addEventListener('input', calculateSales);
});

// validate customer name
if (customer) {
    document.getElementById('salesPricePerBottle').value = customer.pricePerBottle;
    calculateSales(); // Recalculate sales when customer changes
} else {
    alert('Customer not found. Please select a valid customer.');
    document.getElementById('salesPricePerBottle').value = '';
}


// new qr
document.getElementById('myQRcode').addEventListener('input', function (event) {
    let inputField = event.target;
    let value = inputField.value.replace(/,\s*$/, ""); // Remove any trailing comma

    // Split the existing value by comma and check the last entry
    let codes = value.split(", ");
    let lastCode = codes[codes.length - 1];

    // If the last entry is exactly 10 digits, add a comma after it
    if (lastCode.length === 10 && !value.endsWith(", ")) {
        inputField.value = value + ", ";
    }
});

// Export Customer Report to Excel
function exportCustomerReport() {
    let customers = JSON.parse(localStorage.getItem('customers')) || [];
    if (customers.length === 0) {
        alert("No customer data to export!");
        return;
    }

    // Create a new workbook
    let wb = XLSX.utils.book_new();
    
    // Convert customer data to worksheet
    let ws = XLSX.utils.json_to_sheet(customers);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Customer Report");

    // Export the workbook
    XLSX.writeFile(wb, "Customer_Report.xlsx");
}

// Export Sales Report to Excel
function exportSalesReport() {
    let sales = JSON.parse(localStorage.getItem('sales')) || [];
    if (sales.length === 0) {
        alert("No sales data to export!");
        return;
    }

    // Create a new workbook
    let wb = XLSX.utils.book_new();

    // Convert sales data to worksheet
    let ws = XLSX.utils.json_to_sheet(sales);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Sales Report");

    // Export the workbook
    XLSX.writeFile(wb, "Sales_Report.xlsx");
}

function validateEmail() {
    let emailField = document.getElementById('email');
    let email = emailField.value;
    let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        emailField.focus();
        return false;
    }
    return true;
}

// Add this function call when submitting the form
document.getElementById('customerFormElement').addEventListener('submit', function(event) {
    if (!validateEmail()) {
        event.preventDefault();  // Prevent form submission if the email is invalid
    }
});

// dropdown
function showTab(tabName) {
    // Hide all sections
    let tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.style.display = 'none';
    });

    // Show the selected tab
    document.getElementById(tabName).style.display = 'block';
}

// chart
function generateCustomerCategoryDonutChart() {
    // Assume this data is retrieved from localStorage or another source
    let customers = JSON.parse(localStorage.getItem('customers')) || [];

    // Count customers in each category
    let categoryCounts = {
        Residential: 0,
        Commercial: 0,
        Industrial: 0,
        Government: 0
    };

    customers.forEach(customer => {
        if (categoryCounts[customer.category]) {
            categoryCounts[customer.category]++;
        }
    });

    // Prepare data for the chart
    let data = [
        categoryCounts.Residential,
        categoryCounts.Commercial,
        categoryCounts.Industrial,
        categoryCounts.Government
    ];

    // Create the donut chart
    let ctx = document.getElementById('customerCategoryChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Residential', 'Commercial', 'Industrial', 'Government'],
            datasets: [{
                label: 'Customers by Category',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',  // Residential
                    'rgba(54, 162, 235, 0.6)',  // Commercial
                    'rgba(255, 206, 86, 0.6)',  // Industrial
                    'rgba(75, 192, 192, 0.6)'   // Government
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
}

// monthly report
function generateMonthlySalesReport() {
    // Get the selected month and year from the dropdown
    let month = parseInt(document.getElementById('monthSelect').value);
    let year = parseInt(document.getElementById('yearSelect').value);

    // Get the filtered sales data for the selected month and year
    let monthlySales = getMonthlySales(month, year);

    // Initialize total sales and total bottles
    let totalSales = 0;
    let totalSlim = 0;
    let totalRound = 0;
    let totalOtherItems = 0;

    // Prepare HTML to display the transactions in a table
    let transactionsHtml = '<table border="1"><tr><th>Date</th><th>Slim Bottles</th><th>Round Bottles</th><th>Other Items</th><th>Total Sales</th></tr>';

    // Check if there are any sales for the selected month
    if (monthlySales.length === 0) {
        transactionsHtml += `
            <tr>
                <td colspan="5">No sales available for ${getMonthName(month)} ${year}</td>
            </tr>
        `;
    } else {
        // Loop through each sale and accumulate totals for sales and bottles
        monthlySales.forEach(sale => {
            totalSales += parseFloat(sale.totalSales) || 0;  // Accumulate total sales
            totalSlim += parseInt(sale.slim) || 0;  // Accumulate total slim bottles
            totalRound += parseInt(sale.round) || 0;  // Accumulate total round bottles
            totalOtherItems += parseInt(sale.otherItems) || 0;  // Accumulate total other items

            // Append each transaction to the table
            transactionsHtml += `
                <tr>
                    <td>${sale.date}</td>
                    <td>${sale.slim}</td>
                    <td>${sale.round}</td>
                    <td>${sale.otherItems}</td>
                    <td>${sale.totalSales.toFixed(2)}</td>
                </tr>
            `;
        });
    }

    // Close the table
    transactionsHtml += '</table>';

    // Display the transactions and the totals (bottles and sales)
    document.getElementById('monthlySalesResults').innerHTML = `
        ${transactionsHtml}
        <p><strong>Total Slim Bottles:</strong> ${totalSlim}</p>
        <p><strong>Total Round Bottles:</strong> ${totalRound}</p>
        <p><strong>Total Other Items:</strong> ${totalOtherItems}</p>
        <p><strong>Total Sales for ${getMonthName(month)} ${year}:</strong> ${totalSales.toFixed(2)}</p>
    `;
}


// exportexcel
function exportToExcel(data, fileName) {
    // Create a new workbook and worksheet
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(data);
    
    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    
    // Generate the Excel file and download it
    XLSX.writeFile(wb, fileName + ".xlsx");
}

function prepareMonthlySalesData(month, year) {
    let monthlySales = getMonthlySales(month, year);  // Fetch sales data for the month
    let data = [];

    // Loop through the sales and format the data for export
    monthlySales.forEach(sale => {
        data.push({
            Date: sale.date,
            TotalSales: sale.totalSales
        });
    });

    return data;
}

// new sales
let sale = {
    date: '2024-09-01',  // Ensure the date is in a valid format
    totalSales: 100.00,
    // other fields...
};

console.log(JSON.parse(localStorage.getItem('sales')));

function getMonthlySales(month, year) {
    let sales = JSON.parse(localStorage.getItem('sales')) || [];

    // Filter sales by the given month and year
    return sales.filter(sale => {
        let saleDate = new Date(sale.date);
        return saleDate.getMonth() + 1 === month && saleDate.getFullYear() === year;
    });
}

function generateMonthlySalesReport() {
    let month = parseInt(document.getElementById('monthSelect').value);
    let year = parseInt(document.getElementById('yearSelect').value);

    // Get the filtered sales data
    let monthlySales = getMonthlySales(month, year);
    
    // Calculate total sales for the month
    let totalSales = 0;
    monthlySales.forEach(sale => {
        totalSales += parseFloat(sale.totalSales) || 0;
    });

    // Display the result
    document.getElementById('monthlySalesResults').innerHTML = `
        <p>Total Sales for ${month}/${year}: ${totalSales.toFixed(2)}</p>
    `;
}

// tin number
document.getElementById('tinNumber').addEventListener('input', function (event) {
    let input = event.target.value;
    
    // Remove all non-numeric characters except for hyphens
    input = input.replace(/\D/g, '');

    // Apply formatting as 123-456-789-000
    if (input.length > 3) {
        input = input.substring(0, 3) + '-' + input.substring(3);
    }
    if (input.length > 7) {
        input = input.substring(0, 7) + '-' + input.substring(7);
    }
    if (input.length > 11) {
        input = input.substring(0, 11) + '-' + input.substring(11);
    }

    // Limit the input to 15 characters (12 digits + 3 hyphens)
    if (input.length > 15) {
        input = input.substring(0, 15);
    }

    event.target.value = input;
});

// Function to toggle the menu for mobile
function toggleMenu() {
    const navbar = document.querySelector('.navbar');
    navbar.classList.toggle('active');
}

// batchno
// Example batch numbers (you can retrieve these from a database or local storage)
const batchNumbers = ['001', '002', '003', '004', '005'];

// Function to populate the batch number dropdown
function populateBatchDropdown() {
    const batchDropdown = document.getElementById('batchnoDropdown');
    batchDropdown.innerHTML = ''; // Clear any existing options

    // Add each batch number as an option
    batchNumbers.forEach(batch => {
        const option = document.createElement('option');
        option.value = batch;
        option.text = `Batch No: ${batch}`;
        batchDropdown.appendChild(option);
    });
}

// Call the function to populate dropdown when the page loads
window.onload = function() {
    populateBatchDropdown();
};

function processForm() {
    const selectedBatch = document.getElementById('batchnoDropdown').value;
    const carNo = document.getElementById('carno').value;
    const timeDept = document.getElementById('timedept').value;
    const remarks = document.getElementById('remarks').value;

    // Process the form data
    console.log(`Processing Batch: ${selectedBatch}, Car No: ${carNo}, Time Departure: ${timeDept}, Remarks: ${remarks}`);

    // Add further form processing logic here (e.g., saving data or updating the UI)
}

// navbar vertical
function openNav() {
    document.getElementById("myNavbar").classList.add('navbar-open');
}

function closeNav() {
    document.getElementById("myNavbar").classList.remove('navbar-open');
}

function toggleNav() {
    var navbar = document.getElementById("myNavbar");
    var toggleBtn = document.getElementById("toggle-btn");
    
    // Check if the navbar is already open
    if (navbar.classList.contains('navbar-open')) {
        // Close the navbar
        navbar.classList.remove('navbar-open');
        toggleBtn.innerHTML = "&#9776; ALWAYS"; // Change button text back to "ALWAYS"
    } else {
        // Open the navbar
        navbar.classList.add('navbar-open');
        toggleBtn.innerHTML = "&#10006; CLOSE"; // Change button text to "CLOSE"
    }
}

//retrieve form the local storage
let customerData = JSON.parse(localStorage.getItem('customerData')) || [];

//to the local server
function sendDataToServer() {
    let customerData = JSON.parse(localStorage.getItem('customerData')) || [];

    fetch('http://localhost:3000/saveCustomerData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),  // Send localStorage data as JSON
    })
    .then(response => response.json())
    .then(data => {
        console.log('Data successfully sent to the server:', data);
    })
    .catch(error => {
        console.error('Error sending data to the server:', error);
    });
}

// fetch
    // Fetch and display customer report
    fetch('customerReport.json')
    .then(response => response.json())
    .then(data => {
        const customerReportDiv = document.getElementById('customerReport');
        data.forEach(customer => {
            customerReportDiv.innerHTML += `
                <p><strong>Customer:</strong> ${customer.customerName}</p>
                <p><strong>Contact:</strong> ${customer.contactNumber}</p>
                <p><strong>Email:</strong> ${customer.email}</p>
                <p><strong>Address:</strong> ${customer.address}</p><hr>`;
        });
    })
    .catch(error => console.error('Error loading customer report:', error));

// Fetch and display sales report
fetch('salesReport.json')
    .then(response => response.json())
    .then(data => {
        const salesReportDiv = document.getElementById('salesReport');
        data.forEach(sale => {
            salesReportDiv.innerHTML += `
                <p><strong>Sale ID:</strong> ${sale.saleId}</p>
                <p><strong>Customer:</strong> ${sale.customer}</p>
                <p><strong>Date:</strong> ${sale.date}</p>
                <p><strong>Total Sale:</strong> $${sale.totalSale}</p><hr>`;
        });
    })
    .catch(error => console.error('Error loading sales report:', error));

// productionForm
document.addEventListener("DOMContentLoaded", function () {
    const productionTableBody = document.getElementById("productionTableBody");

    // Sample data structures for customerRecord and salesRecord
    const customerRecord = [
        { customerName: "John Doe", myQRcode: "1234567890", barangay: "Barangay 1", city: "Batangas City" },
        { customerName: "Jane Smith", myQRcode: "0987654321", barangay: "Barangay 2", city: "Batangas City" }
    ];

    const salesRecord = [
        { customerName: "John Doe", myQRcode: "1234567890" },
        { customerName: "Jane Smith", myQRcode: "0987654321" }
    ];

    // Combine records based on `myQRcode`
    const combinedData = customerRecord.map(customer => {
        const salesData = salesRecord.find(sale => sale.myQRcode === customer.myQRcode);
        return salesData ? { ...customer, ...salesData } : null;
    }).filter(data => data);

    // Display combined data in the table
    combinedData.forEach(record => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${record.customerName}</td>
            <td>${record.myQRcode}</td>
            <td>${record.barangay}</td>
            <td>${record.city}</td>
            <td><button onclick="showMap('${record.barangay}', '${record.city}')">Show Map</button></td>
        `;

        productionTableBody.appendChild(row);
    });
});

function showMap(barangay, city) {
    const query = `${barangay}, ${city}`;
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(mapUrl, "_blank");
}

// map enhancement
function addMarkerFromAddress(street, barangay, city) {
    const geocoder = new google.maps.Geocoder();
    const address = `${street}, ${barangay}, ${city}`;
    geocoder.geocode({ address }, (results, status) => {
        if (status === "OK") {
            const marker = new google.maps.Marker({
                map,
                position: results[0].geometry.location,
            });
            map.setCenter(results[0].geometry.location);
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}
