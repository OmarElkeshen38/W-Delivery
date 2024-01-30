var orderFromInput = document.getElementById('from');
var orderToInput = document.getElementById('to');
var orderProductsInput = document.getElementById('products');
var orderFareInput = document.getElementById('fare');
var confirmBtn = document.getElementById('confirmBtn');
var inputs = document.querySelectorAll('.login-content input');
var orders=[];
var users=[];
var userLogedIn=[];
var currentIndex=0;


if(JSON.parse(localStorage.getItem('ordersList'))!=null) {
    orders=JSON.parse(localStorage.getItem('ordersList'));
    displayOrder();
}

function makeOrder() {
    var order = {
        from: orderFromInput.value,
        to: orderToInput.value,
        products: orderProductsInput.value,
        fare: orderFareInput.value,
    };
    orders.push(order);
    localStorage.setItem('ordersList', JSON.stringify(orders));
    resetForm();
    displayOrder();
    confirmBtn.setAttribute("href", "Orders.html");
}


function resetForm() {
    for (var i=0; i<inputs.length; i++) {
        inputs[i].value = '';
    }
}


function displayOrder() {
    var cartona = '';
    for (var i = 0; i < orders.length; i++) {
        cartona += `
            <div class="order"> 
                <div class="order-content">
                    
                    <div class="order-info">
                        <h2>Products:</h2>
                        <h4>${orders[i].from}</h4>
                    </div>
                    <div class="order-info">
                        <h2>Deliver From:</h2>
                        <h4>${orders[i].to}</h4>
                    </div>
                    <div class="order-info">
                        <h2>Deliver To:</h2>
                        <h4>${orders[i].products}</h4>
                    </div>
                    <div class="order-info">
                        <h2>Fare:</h2>
                        <h4>${orders[i].fare}</h4>
                    </div>
                    <div class="order-control">
                        <button onclick="deleteOrder()">Delete</button>
                    </div>
                </div>
            </div>
        `.trim();
    }
    document.getElementById('orderDisplay').innerHTML = cartona;
}


function deleteOrder(index) {
    orders.splice(index,1);
    displayOrder();
    localStorage.setItem('ordersList', JSON.stringify(orders));
}



// --------------Sign Up


document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("signupForm").addEventListener("submit", function (e) {
      e.preventDefault();
      submitFormData();
    });
  });
  
  function submitFormData() {
    let baseUrl = 'https://ecommerce.routemisr.com/';
    let user = {
      name: document.getElementById("name").value,
      phone: document.getElementById("phone").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    };
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
  
    let errorMsg = "";
    let errorsList = [];
    let loading = false;
  
    function goToHome() {
      window.location.href = 'login.html';
    }
  
    function validateForm() {
        let isValid = true;
        errorsList = [];
        const errorMessagesElement = document.getElementById("errorMessages");
        errorMessagesElement.innerHTML = "";
    
        // Validate name
        if (user.name.length < 3 || user.name.length > 30) {
            isValid = false;
            errorsList.push({ message: "Name must be between 3 and 30 characters" });
        }
    
        // Validate phone
        if (!/^[0-9]{11}$/.test(user.phone)) {
            isValid = false;
            errorsList.push({ message: "Phone must be 11 digits numeric" });
        }
    
        // Validate email
        if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email) ||
            !["com", "net", "org"].includes(user.email.split(".")[1])
        ) {
            isValid = false;
            errorsList.push({ message: "Invalid email format" });
        }
    
        // Validate password 
        if (user.password.length === 0) {
            isValid = false;
            errorsList.push({ message: "Password is required" });
        }
    
        // Display error messages on the page
        if (!isValid) {
            errorMessagesElement.innerHTML = errorsList.map(error => error.message).join("<br>");
        }
    
        return isValid;
    }
  
    async function submitForm() {
        try {
          let isValid = validateForm();
          if (!isValid) {
            // Handle validation errors
            console.log(errorsList);
            return;
          }
      
          let response = await fetch("https://noxe-api.onrender.com/api/v1/users", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
          });
      
          let data = await response.json();
          localStorage.setItem('user', JSON.stringify(data));
      
          // Log the response for debugging
          console.log(data);
      
          if (data.data && data.data.token) {
            localStorage.setItem("userToken", data.data.token);
            goToHome();
          } else {
            errorMsg = data.message || "Unexpected error occurred";
          }
        } catch (error) {
          console.error('Error submitting form data:', error);
          errorMsg = 'An error occurred while submitting the form.';
        } finally {
          loading = false;
        }
      }
  
    submitForm();
  }
  


// ------------------------Login

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("loginForm").addEventListener("submit", function (e) {
        e.preventDefault();
        submitLogin();
    });
});

function submitLogin() {
    let user = {
        email: document.getElementById("loginEmail").value,
        password: document.getElementById("loginPassword").value,
    };
    userLogedIn.push(user);
    localStorage.setItem('userLogedIn', JSON.stringify(userLogedIn));
    goToHome();

    async function submitLoginForm() {
        try {
            let response = await fetch("https://noxe-api.onrender.com/api/v1/users/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            let data = await response.json();

            // Log the response for debugging
            console.log(data);

            if (response.ok) {
                // Successful login
                localStorage.setItem("userToken", data.data.token);
                goToHome();
            } else {
                // Unsuccessful login
                displayError(data.errors);
            }
        } catch (error) {
            console.error('Error submitting login data:', error);
            displayError('An error occurred while submitting the login form.');
        }
    }

    function displayError(errors) {
        const loginErrorMessagesElement = document.getElementById("loginErrorMessages");
        loginErrorMessagesElement.innerHTML = errors.map(error => error.msg).join("<br>");
    }

    submitLoginForm();
}

function goToHome() {
    window.location.href = 'index.html';
}