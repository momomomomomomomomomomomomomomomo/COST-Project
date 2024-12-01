function rbacPricingButton() {

    const user = localStorage.getItem('userToken');
    const role = localStorage.getItem('userRoleToken');

  
    const pricingButton = document.getElementById('pricing-crud-button-container');
    
    if (user && role === "Admin" ) {

        pricingButton.innerHTML = `
        <button class="add-price" onclick="window.location.href='add-price.html'">Add Location</button>
        <button class="update-price" onclick="window.location.href='update-price.html'">Update Location</button>
        <button class="delete-price" onclick="window.location.href='delete-price.html'">Delete Location</button>
        `;
    } else {

        pricingButton.innerHTML = ``;
    }
}

function rbacAccountButton() {

    const user = localStorage.getItem('userToken');
    const role = localStorage.getItem('userRoleToken');

  
    const accountButton = document.getElementById('account-crud-button-container');
    
    if (user && role) {

        accountButton.innerHTML = `
        <button class="update-password" onclick="window.location.href='change-password.html'">Change Password</button>
        <button class="edit-details" onclick="window.location.href='edit-details.html'">Edit Details</button>
        `;
    }else {

        orderButton.innerHTML = ``;
    }
}

function GetPricingData() {
    fetch('/get/pricing')
        .then(response => response.json())  
        .then(data => {
            const table = document.getElementById('pricing');
            if (data && data.length > 0) {
                let tableHTML = '<table class="pricing-table">';
                tableHTML += '<thead><tr><th>ID</th><th>Location</th><th>Price per kWh ($)</th><th>Total Amount Earned</th><th>Total Electricity Expended</th></tr></thead><tbody>';
                
                data.forEach(item => {
                    tableHTML += `<tr>
                        <td>${item.PricingID}</td>
                        <td>${item.Location}</td>
                        <td>${item.PricePerkWH}</td>
                        <td>${item.TotalAmountEarned}</td>
                        <td>${item.TotalElectricityExpended}</td>
                    </tr>`;
                });
                
                tableHTML += '</tbody></table>';
                table.innerHTML = tableHTML; 
            } else {
                table.innerHTML = '<p>No pricing data available.</p>';
            }
        })
        .catch(error => {
            alert('Error displaying pricing entry.');
        });
}

function CreatePricingForm(event) {
    event.preventDefault();
    const user = localStorage.getItem('userToken');
    const role = localStorage.getItem('userRoleToken');

    
    if (user && role === "Admin" ) {

        const Location = document.getElementById('Location').value;
        const PricePerkWH = parseFloat(document.getElementById('PricePerkWH').value);
        const TotalAmountEarned = parseFloat(document.getElementById('TotalAmountEarned').value) || 0.00;
        const TotalElectricityExpended = parseFloat(document.getElementById('TotalElectricityExpended').value) || 0.00;
        
        const userData = {
            Location,
            PricePerkWH,
            TotalAmountEarned,
            TotalElectricityExpended
        };
        fetch('/add/pricing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.affectedRows > 0) { 
                alert('Pricing entry added successfully');
                window.location.href = 'pricing.html';  
            } else {
                alert('Failed to add pricing entry.');
            }
        })
        .catch(error => {
            alert('Error adding pricing entry.');
        });
    }else{
        alert('Warning! Unauthorized Access, Page is Forbidden')
    }
}

function UpdatePricingForm(event) {
    event.preventDefault();
    const user = localStorage.getItem('userToken');
    const role = localStorage.getItem('userRoleToken');

    
    if (user && role === "Admin" ) {
        
        const CurrentLocation = document.getElementById('CurrentLocation').value
        const Location = document.getElementById('Location').value;
        const PricePerkWH = parseFloat(document.getElementById('PricePerkWH').value);
        
        const userData = {
            CurrentLocation,
            Location,
            PricePerkWH
        };
        fetch('/update/pricing', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.affectedRows > 0) { 
                alert('Pricing entry updated successfully');
                window.location.href = 'pricing.html';  
            } else {
                alert('Failed to update pricing entry.');
            }
        })
        .catch(error => {
            alert('Error updating pricing entry.');
        });
    }else{
        alert('Warning! Unauthorized Access, Page is Forbidden')
    }
}

function DeletePricingForm(event) {
    event.preventDefault();
    const user = localStorage.getItem('userToken');
    const role = localStorage.getItem('userRoleToken');

    
    if (user && role === "Admin" ) {
        
        const Location = document.getElementById('Location').value
        
        const userData = {
            Location,
        };
        fetch('/delete/pricing', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.affectedRows > 0) { 
                alert('Pricing entry deleted successfully');
                window.location.href = 'pricing.html';  
            } else {
                alert('Failed to delete pricing entry.');
            }
        })
        .catch(error => {
            alert('Error deleting pricing entry.');
        });
    }else{
        alert('Warning! Unauthorized Access, Page is Forbidden')
    }
}

function CreateUser(event) {
    event.preventDefault();  

    const Name = document.getElementById('Name').value;
    const Password = document.getElementById('Password').value
    const Birthdate = document.getElementById('Birthdate').value;
    const Sex = document.getElementById('Sex').value;
    const VehiclePlateNumber = document.getElementById('VehiclePlateNumber').value;
    const VehicleModel = document.getElementById('VehicleModel').value;

     const userData = {
        Name,
        Password,
        Birthdate,
        Sex,
        VehiclePlateNumber,
        VehicleModel
    };

    fetch('/add/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.affectedRows > 0) {
            alert('Customer signup successful, Please login.')
            window.location.href = 'login.html';  
            
        } else {
            alert('Signup failed: ' + data.error);
        }
    })
    .catch(error => {
        alert('Signup failed due to an error: ' + error);
    });
}

function LoginUser(event) {
    event.preventDefault();  
    
    const user = localStorage.getItem('userToken');
    const role = localStorage.getItem('userRoleToken');
    
    if (!user || !role) {
        const Name = document.getElementById('Name').value;
        const Password = document.getElementById('Password').value
    
         const userData = {
            Name,
            Password
        };
    
        fetch('/login/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        })
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                alert('Valid credentials provided, logging you in now.')
                localStorage.setItem('userToken', data[0].Name);  
                localStorage.setItem('userRoleToken', data[0].ProfileType);  
                window.location.href = 'index.html';  
                
            } else {
                alert('Login failed: ' + data.error);
            }
        })
        .catch(error => {
            alert('Login failed due to an error: ' + error);
        });
    }else{
        alert('Currently Already Logged In')
    }
}

async function RequestElectricData(topic) {
    const user = localStorage.getItem('userToken');
    const role = localStorage.getItem('userRoleToken');
    
    if (user && role) {
        try {
            console.log(`Requesting data for topic: ${topic}`);
    
            const response = await fetch('/request-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({"topic": topic}), 
            });
    
            const data = await response.json();
            //console.log(data)
            localStorage.setItem('ElectricCheck', data.sensorData);
            // alert(`Request Status: ${data.statusMsg} Received data: ${data.sensorData}`);
        } catch (error) {
            console.error('Error:', error);
        }
    }else{
        alert('Warning! Unauthorized Access, Page is Forbidden');
    }
}

async function RequestRfidData(topic) {
    const user = localStorage.getItem('userToken');
    const role = localStorage.getItem('userRoleToken');
    if (user && role) {
        try {
            console.log(`Requesting data for topic: ${topic}`);
            const response = await fetch('/request-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({"topic": topic,"user": user}), 
            });
    
            const data = await response.json();
            //console.log(data)
            localStorage.setItem('RfidCheck', data.sensorData);
            // alert(`Request Status: ${data.statusMsg} Received data: ${data.sensorData}`);
        } catch (error) {
            console.error('Error:', error);
        }
    }else{
        alert('Warning! Unauthorized Access, Page is Forbidden');
    }
}

async function RequestLocationData(topic) {
    const user = localStorage.getItem('userToken');
    const role = localStorage.getItem('userRoleToken');
    
    if (user && role) {
        try {
            console.log(`Requesting data for topic: ${topic}`);
    
            const response = await fetch('/request-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({"topic": topic}), 
            });
    
            const data = await response.json();
            //console.log(data)
            localStorage.setItem('LocationCheck', data.sensorData);
            // alert(`Request Status: ${data.statusMsg} Received data: ${data.sensorData}`);
        } catch (error) {
            console.error('Error:', error);
        }
    }else{
        alert('Warning! Unauthorized Access, Page is Forbidden');
    }
}

async function getLocationPricing(Location, Hours) {
    try {
        // Wait for the fetch call to resolve
        const response = await fetch('/get/locationPricing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Location })
        });

        // Wait for the response data to be parsed
        const data = await response.json();
        
        console.log(data);
        // Calculate the OrderPrice
        const LocationPricing = data[0].PricePerkWH;
        const OrderPrice = (Hours * LocationPricing).toFixed(2);

        // Return the OrderPrice
        return OrderPrice;
    } catch (error) {
        throw new Error('Error getting Location Pricing: ' + error);
    }
}

async function AddOrderData(event) {
    event.preventDefault();

    const user = localStorage.getItem('userToken');
    const role = localStorage.getItem('userRoleToken');
    const Electric = localStorage.getItem('ElectricCheck');
    const Rfid = localStorage.getItem('RfidCheck');
    const Location = localStorage.getItem('LocationCheck');
    
    console.log(Electric);
    console.log(Rfid);
    console.log(Location);
    
    if (user && role) {
        if (Electric && Rfid && Location) {
            const ElectricData = JSON.parse(Electric);
            const RfidData = JSON.parse(Rfid);
            const LocationData = JSON.parse(Location);

            // Get elec sensor data
            const kW = ElectricData.kW;
            const ChargingStart = ElectricData.chargingStart;
            const ChargingEnd = ElectricData.chargingEnd;
            const Start = new Date(ChargingStart);
            const End = new Date(ChargingEnd);
            const Hours = (End - Start) /3600000;
            

            // Get Rfid sensor data
            const CardOwner = RfidData.cardOwner;
            const ServiceCode = RfidData.serviceCode;
            const PanCode = RfidData.panCode;
            const ExpiryDate = RfidData.expiryDate;

            // Get Location sensor data
            const LocationName = LocationData.pricedLocation;

            // If we can get all info, means order is successful
            const PaymentStatus = "Successful";

            try {
                // Get OrderPrice from the location pricing
                const OrderPrice = await getLocationPricing(LocationName, Hours);
                // Add order
                await fetch('/add/order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "Name": user,
                        "Location": LocationName,
                        "ElectricityUsedkW": kW,
                        "ChargingStart": ChargingStart,
                        "ChargingEnd": ChargingEnd,
                        "PaymentStatus": PaymentStatus,
                        "OrderPrice": OrderPrice
                    })
                });

                // Add card to card DB
                await fetch('/add/card', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "Name": user,
                        "CardOwner": CardOwner,
                        "CardPan": PanCode,
                        "ServiceCode": ServiceCode,
                        "ExpiryDate": ExpiryDate
                    })
                });

                // Update pricing table with totalAmountEarned value and totalElectricityExpended
                await fetch('/update/totalAmountandElec', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "OrderPrice": OrderPrice,
                        "kW" : kW,
                        "Location": LocationName
                    })
                });
                
            } catch (error) {
                alert('Error during the process: ' + error.message);
            } finally {
                localStorage.removeItem('ElectricCheck');
                localStorage.removeItem('RfidCheck');
                localStorage.removeItem('LocationCheck');
            }
        } else {
            alert('User has not received sensor data yet');
        }
    } else {
        alert('Warning! Unauthorized Access, Page is Forbidden');
    }
}

function GetOrderData() {
    const user = localStorage.getItem('userToken');
    const role = localStorage.getItem('userRoleToken');
    
    const userData = { user };
    
    if (role === "Customer"){
        fetch('/get/customerorder', {
        method: 'POST',
        headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        })
        
        .then(response => response.json())  
        .then(data => {
            const table = document.getElementById('order');
            if (data && data.length > 0) {
                let tableHTML = '<table class="order-table">';
                tableHTML += tableHTML += '<thead><tr><th>No.</th><th>PricingID</th><th>ElectricityUsed(kW)</th><th>Charging Start</th><th>Charging End</th><th>Payment Status</th><th>Order Price</th></tr></thead><tbody>';
                
                data.forEach(item => {
                    tableHTML += `<tr>
                        <td>${item.OrderID}</td>
                        
                        <td>${item.PricingID}</td>  
                        <td>${item.ElectricityUsedkW}</td>
                        <td>${item.ChargingStart}</td>
                        <td>${item.ChargingEnd}</td>
                        <td>${item.PaymentStatus}</td>
                        <td>${item.OrderPrice}</td>
                    </tr>`;
                });
                
                tableHTML += '</tbody></table>';
                table.innerHTML = tableHTML; 
            } else {
                table.innerHTML = '<p>No Order data available.</p>';
            }
        })
        .catch(error => {
            alert('Error displaying Order entry.');
        });
        
    }else if (role === "Admin"){
        fetch('/get/order')
        .then(response => response.json())  
        .then(data => {
            const table = document.getElementById('order');
            if (data && data.length > 0) {
                let tableHTML = '<table class="order-table">';
                tableHTML += tableHTML += '<thead><tr><th>OrderID</th><th>UserID</th><th>PricingID</th><th>ElectricityUsed(kW)</th><th>Charging Start</th><th>Charging End</th><th>Payment Status</th><th>Order Price</th></tr></thead><tbody>';

                
                data.forEach(item => {
                    tableHTML += `<tr>
                        <td>${item.OrderID}</td>
                        <td>${item.UserID}</td>
                        <td>${item.PricingID}</td>  
                        <td>${item.ElectricityUsedkW}</td>
                        <td>${item.ChargingStart}</td>
                        <td>${item.ChargingEnd}</td>
                        <td>${item.PaymentStatus}</td>
                        <td>${item.OrderPrice}</td>
                    </tr>`;
                });
                
                tableHTML += '</tbody></table>';
                table.innerHTML = tableHTML; 
            } else {
                table.innerHTML = '<p>No Order data available.</p>';
            }
        })
        .catch(error => {
            alert('Error displaying Order entry.');
        });
        
    }else{
        alert('Warning! Unauthorized Access, Page is Forbidden');
    }
    
}

function GetAccountData(){
    const user = localStorage.getItem('userToken');
    const role = localStorage.getItem('userRoleToken');
    
    if (user && role){
        const userData = { user };
        fetch('/get/account', {
        method: 'POST',
        headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        })
        
        .then(response => response.json())  
        .then(data => {
            const container = document.getElementById('account');
            if (data && data.length > 0) {
                let containerHTML = '';
                containerHTML += `
                    <div class="account-card">
                    <h3> Account Details </h3>
                    <div class="acc-details">
                    <div class="columns">
                        <p><strong>Name: </strong><br> ${data[0].Name}</p>
                        <p><strong>Birthdate : </strong><br> ${data[0].Birthdate.split('T')[0]}</p>
                        </div>
                    <div class="columns">
                        <p><strong>Sex: </strong><br> ${data[0].Sex}</p>
                        <p><strong>Vehicle Plate Number: </strong><br> ${data[0].VehiclePlateNumber}</p>
                        <p><strong>Vehicle Model: </strong><br> ${data[0].VehicleModel}</p>
                    </div></div></div>
                    `;
                    
                container.innerHTML = containerHTML; 
            } else {
                container.innerHTML = '<p>No Account data available.</p>';
            }
        })
        .catch(error => {
            alert('Error displaying User Data.' + error);
        });
    }else{
        alert('Warning! Unauthorized Access, Page is Forbidden');
    }
}

function LoadAccountDetails() {
    const user = localStorage.getItem('userToken'); 
    const container = document.getElementById('editAccountForm');

    if (user) {
        const userData = { user }; 
        fetch('/get/account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                document.getElementById('UpdatedName').value = data[0].Name;
                document.getElementById('Birthdate').value = data[0].Birthdate.split('T')[0];
                document.getElementById('Sex').value = data[0].Sex;
                document.getElementById('VehiclePlateNumber').value = data[0].VehiclePlateNumber;
                document.getElementById('VehicleModel').value = data[0].VehicleModel;
            } else {
                alert('Error: No account data found.');
            }
        })
        .catch(error => {
            alert('Error fetching account data: ' + error);
        });
    } else {
        alert('Warning! Unauthorized Access');
    }
}

function UpdateAccountDetails(event) {
    event.preventDefault();

    const Name = localStorage.getItem('userToken'); 
    const role = localStorage.getItem('userRoleToken'); 

    if (Name && role) {
        const UpdatedName = document.getElementById('UpdatedName').value;
        const Birthdate = document.getElementById('Birthdate').value;
        const Sex = document.getElementById('Sex').value;
        const VehiclePlateNumber = document.getElementById('VehiclePlateNumber').value;
        const VehicleModel = document.getElementById('VehicleModel').value;
        
        const updatedData = {
            Name,
            UpdatedName,
            Birthdate,
            Sex,
            VehiclePlateNumber,
            VehicleModel
        };
        fetch('/update/details', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.affectedRows > 0) {
                localStorage.setItem('userToken', UpdatedName); 
                alert('Account details updated successfully!');
                window.location.href = 'account.html'; 
            } else {
                alert('Error updating account details.');
            }
        })
        .catch(error => {
            alert('Error updating account details: ' + error);
        });
    } else {
        alert('Warning! Unauthorized Access');
    }
}

function ChangePassword(event) {
    event.preventDefault();
    
    const Name = localStorage.getItem('userToken');
    const role = localStorage.getItem('userRoleToken');
    
    if (Name && role) {
        const Password = document.getElementById('CurrentPassword').value;
        const userData = { Name, Password };
    
        fetch('/login/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        })
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const newPassword = document.getElementById('NewPassword').value;
                const confirmPassword = document.getElementById('ConfirmPassword').value;
                
                if (newPassword === confirmPassword) {
                    let userData = { Name, newPassword };
                    fetch('/update/password', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(userData)
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.affectedRows > 0) {
                            alert('Password was updated successfully, Logging you out');
                            localStorage.removeItem('userToken');
                            localStorage.removeItem('userRoleToken');
                            window.location.href = 'index.html';  
                        } else {
                            alert('Password update failed: ' + data.error);
                        }
                    })
                    .catch(error => {
                        alert('Password update failed due to an error: ' + error);
                    });
                } else {
                    alert('New Password and Confirm Password are not the same, try again');
                }
            } else {
                alert('Wrong Current Password, Try again.');
            }
        })
        .catch(error => {
            alert('Error Changing User Password: ' + error);
        });
    } else {
        alert('Warning! Unauthorized Access, Page is Forbidden');
    }
}

function startChargingDirect() {
    const user = localStorage.getItem('userToken');
    const startCharging = document.getElementById('startcharging');
    
    if (user) {
        startCharging.innerHTML = `
            <a> <button id="button3">START CHARGING</button></a>
        `;
        document.getElementById('button3').addEventListener('click', function(event) {
         try {
                RequestElectricData('Electric');
                RequestRfidData('RFID');
                RequestLocationData('Location');
                //alert("Data received");
                setTimeout(() => { window.location.href = "charging.html"; }, 1000);
                //setTimeout(AddOrderData(event), 4000);
                
            } catch (error) {
            console.error("An error occurred while processing the requests:", error);
            }
        });
    } else {
        startCharging.innerHTML = `
            <a href="login.html"> <button id="button3">START CHARGING</button></a>
        `;
    }
}

function startCharging() {
    AddOrderData(event)
    const randomTime = Math.floor(Math.random() * (30 - 5 + 1)) + 5;
    const progressBar = document.getElementById('progressBar');
    let width = 0;
    const interval = randomTime * 1000 / 100;
    const chargingInterval = setInterval(() => {
        if (width >= 100) {
            clearInterval(chargingInterval);
            
            window.location.href = 'transaction.html'
        } else {
            width++;
            progressBar.style.width = width + '%';
            progressBar.innerHTML = width + '%';
        }
    }, interval);
}

function SignOut(){
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRoleToken');
    window.location.href = 'index.html'; 
}

function GetLocationData() {
    fetch('/get/pricing')
        .then(response => response.json())
        .then(data => {
            const locationSelect = document.getElementById('CurrentLocation');
            const uniqueLocations = new Set(); 
            if (data && data.length > 0) {
                data.forEach(item => {
                    uniqueLocations.add(item.Location);
                });

                uniqueLocations.forEach(location => {
                    const option = document.createElement('option');
                    option.value = location; 
                    option.textContent = location;
                    locationSelect.appendChild(option);
                });
            } else {
                locationSelect.innerHTML = '<option value=""disabled selected>No locations available</option>';
            }
        })
        .catch(error => {
            alert('Error fetching pricing data.');
        });
}

function rbacFileLinks() {
    const userToken = localStorage.getItem('userToken');
    const userRole = localStorage.getItem('userRoleToken');

    const publicPages = ['signup.html', 'login.html', 'index.html','functions.js','navbar.js'];
    const customerPages = [
        'index.html',
        'charging.html',
        'account.html',
        'edit-details.html',
        'change-password.html',
        'order.html',
        'sidenav.html',
        'pricing.html',
        'transaction.html'
    ];

    const currentPage = window.location.pathname.split('/').pop();
    console.log('Current Page:', currentPage);
    console.log('User  Token:', userToken);
    console.log('User  Role:', userRole);

    if (!userToken) {
        if (!publicPages.includes(currentPage)) {
            console.log('No user token and not a public page. Redirecting to index.html');
            window.location.href = 'index.html';
        }
    } else {
        if (userRole === 'Customer') {
            if (!customerPages.includes(currentPage)) {
                console.log('Customer role detected and not on a customer page. Redirecting to index.html');
                window.location.href = 'index.html';
            } else {
                console.log('Access granted for customer to:', currentPage);
                
            }
        }
    }
}

function GetLastOrderData() {
    const user = localStorage.getItem('userToken');
    const role = localStorage.getItem('userRoleToken');

    const userData = { user };

    if (role === "Customer") {
        fetch('/get/customerorder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        })
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById('lastOrderData');
            if (data && data.length > 0) {
                const lastItem = data[data.length - 1]; // Get the last item
                let tableHTML = '<table class="transaction-table">';
                tableHTML += '<thead><tr></tr></thead><tbody>';

tableHTML += `<tr>
    <td>No.</td>
    <td>${lastItem.OrderID}</td>
</tr>`;
tableHTML += `<tr>
    <td>Pricing ID</td>
    <td>${lastItem.PricingID}</td>  
</tr>`;
tableHTML += `<tr>
    <td>Electricity Used (kW)</td>
    <td>${lastItem.ElectricityUsedkW}</td>
</tr>`;
tableHTML += `<tr>
    <td>Charging Start</td>
    <td>${lastItem.ChargingStart}</td>
</tr>`;
tableHTML += `<tr>
    <td>Charging End</td>
    <td>${lastItem.ChargingEnd}</td>
</tr>`;
tableHTML += `<tr>
    <td>Payment Status</td>
    <td>${lastItem.PaymentStatus}</td>
</tr>`;
tableHTML += `<tr>
    <td>Order Price</td>
    <td>${lastItem.OrderPrice}</td>
</tr>`;
                
                tableHTML += '</tbody></table>';
                   setTimeout(() => {
                    SignOut();
                }, 5000);
                table.innerHTML = tableHTML; 
            } else {
                table.innerHTML = '<p>No Order data available.</p>';
            }
        })
        .catch(error => {
            alert('Error displaying Last Order entry.');
        });
        
    } else if (role === "Admin") {
        fetch('/get/order')
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById('lastOrderData');
            if (data && data.length > 0) {
                const lastItem = data[data.length - 1]; // Get the last item
                let tableHTML = '<table class="transaction-table">';
                tableHTML += '<thead><tr></tr></thead><tbody>';

tableHTML += `<tr>
    <td>No.</td>
    <td>${lastItem.OrderID}</td>
</tr>`;
tableHTML += `<tr>
    <td>Pricing ID</td>
    <td>${lastItem.PricingID}</td>  
</tr>`;
tableHTML += `<tr>
    <td>Electricity Used (kW)</td>
    <td>${lastItem.ElectricityUsedkW}</td>
</tr>`;
tableHTML += `<tr>
    <td>Charging Start</td>
    <td>${lastItem.ChargingStart}</td>
</tr>`;
tableHTML += `<tr>
    <td>Charging End</td>
    <td>${lastItem.ChargingEnd}</td>
</tr>`;
tableHTML += `<tr>
    <td>Payment Status</td>
    <td>${lastItem.PaymentStatus}</td>
</tr>`;
tableHTML += `<tr>
    <td>Order Price</td>
    <td>${lastItem.OrderPrice}</td>
</tr>`;
                
                tableHTML += '</tbody></table>';
                   setTimeout(() => {
                    SignOut();
                }, 5000);
                table.innerHTML = tableHTML; 
            } else {
                table.innerHTML = '<p>No Order data available.</p>';
            }
        })
        .catch(error => {
            alert('Error displaying Last Order entry.');
        });
        
    } else {
        alert('Warning! Unauthorized Access, Page is Forbidden');
    }
}

// function rbacOrderButton() {

//     const user = localStorage.getItem('userToken');
//     const role = localStorage.getItem('userRoleToken');

  
//     const orderButton = document.getElementById('order-crud-button-container');
    
//     if (user && role === "Admin" ) {

//         orderButton.innerHTML = `
//         <button class="add-order" onclick="window.location.href='add-order.html'">Add Order</button>
//         <button class="update-order" onclick="window.location.href='update-order.html'">Update Order</button>
//         <button class="delete-order" onclick="window.location.href='delete-order.html'">Delete Order</button>
//         `;
//     } else if (user && role === "Customer" ) {
//         orderButton.innerHTML = `
//         <button class="add-order" onclick="window.location.href='add-order.html'">Add Order</button>
//         `;
//     }else {

//         orderButton.innerHTML = ``;
//     }
// }