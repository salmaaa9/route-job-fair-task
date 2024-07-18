import { customers, transactions } from './data.js';
var tableContent = $('#table');
var searchInput = $('#search');
var graphInput = $('#graph');
let myChart;


const customersNo = document.getElementById('customersNo');
customersNo.textContent = 'Enter an id of customers from 1 to ' + customers.length;

$( "tbody" ).on( "click", "tr", function() {
    var customerId = $(this)[0].id;
    console.log(customerId);
    customerId++;
    displayGraph(customerId)
});
graphInput.on('keyup',function(){
    var id = graphInput.val();
    console.log(id);
    displayGraph(id)
});


function fetchAndDisplayData() {
    var string = '';
  // Simulate API call by using local data
  for(let i = 0;i < transactions.length; i++)
  {
    var customerId = transactions[i].customer_id -1;
    var customerName = customers[customerId].name;
     string += `
     <tr id = "${customerId}">
     <td>${transactions[i].id}</td>
     <td>${customerName}</td>
     <td>${transactions[i].date}</td>
     <td>${transactions[i].amount}</td>
     </tr>
    `
  }
  tableContent.html(string); 
}

function displayGraph(id){
    console.log(id);
    if (myChart) {
        myChart.destroy(); // Destroy the previous chart instance
      }
    // Filter transactions for the selected customer
    const selectedCustomerTransactions = transactions.filter(transaction => transaction.customer_id == id);
    
    // Group transactions by date and calculate total amount per day
    const transactionsByDay = selectedCustomerTransactions.reduce((acc, transaction) => {
      const date = transaction.date.slice(0, 10); // Extract date only
      acc[date] = (acc[date] || 0) + transaction.amount;
      return acc;
    }, {});
    
    // Create chart data
    const labels = Object.keys(transactionsByDay);
    const data = Object.values(transactionsByDay);
    
    // Use Chart.js to create the chart
    const ctx = document.getElementById('transactionChart').getContext('2d');
    myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: `Total Transaction Amount of ${customers[id-1].name}`,
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'x',
        scales: {
        //   y: {
        //     beginAtZero: true
        //   },
          x: {
            stacked: true,
            barPercentage: 1, // Set to 1 to fill the category width
            categoryPercentage: 0.25 // Set to 25% of the category width
          }
        }
      }
    });
}

searchInput.on('keyup',function(){
    var searchValue = $(this).val();
    console.log(searchValue);
    if(searchValue == ''){
        fetchAndDisplayData();
    }else{
        var string = '';
        for(let i = 0; i < transactions.length; i++)
            {
                var customerId = transactions[i].customer_id -1;
                var customerName = customers[customerId].name;
                if(customerName.toLowerCase().includes(searchValue.toLowerCase()))
                    {
                        string += `
                        <tr>
                        <td>${transactions[i].id}</td>
                        <td>${customerName}</td>
                        <td>${transactions[i].date}</td>
                        <td>${transactions[i].amount}</td>
                        </tr>
                        `
                }
                if(transactions[i].amount.toString().includes(searchValue))
                    {
                        string += `
                        <tr>
                        <td>${transactions[i].id}</td>
                        <td>${customerName}</td>
                        <td>${transactions[i].date}</td>
                        <td>${transactions[i].amount}</td>
                        </tr>
                        `
                }
            }
        tableContent.html(string);
    }
  
});

fetchAndDisplayData();
displayGraph(1)