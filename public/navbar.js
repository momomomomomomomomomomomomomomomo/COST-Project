function rbacNavBar() {

    const user = localStorage.getItem('userToken');

  
    const navbarContainer = document.getElementById('navbar-container');
    
    if (user) {

        navbarContainer.innerHTML = `
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <a class="navbar-brand" href="index.html">
                    <img src="Gridly-Logo.png" width="150" height="50" alt="Logo">
                </a>
                <div class="navbar-nav ml-auto">
                    <a class="nav-item nav-link" href="pricing.html">Pricing</a>
                    <a class="nav-item nav-link" href="order.html">Order</a>
                    <a class="nav-item nav-link" href="account.html">Account</a>
                    <a class="nav-item nav-link" onclick="SignOut()">Logout</a>
                </div>
            </nav>
        `;
    } else {

        navbarContainer.innerHTML = `
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <a class="navbar-brand" href="index.html">
                    <img src="Gridly-Logo.png" width="150" height="50" alt="Logo">
                </a>
                <div class="navbar-nav ml-auto">
                    <a class="nav-item nav-link" href="login.html">Login</a>
                    <a class="nav-item nav-link" href="signup.html">Sign Up</a>
                </div>
            </nav>
        `;
    }
}


rbacNavBar();

document.addEventListener("scroll", function () {
    const aimSection = document.querySelector(".aim-section");
    const sectionPosition = aimSection.getBoundingClientRect().top;
    const screenHeight = window.innerHeight;

    if (sectionPosition < screenHeight - 100) {
        aimSection.classList.add("visible");
    }
});

 fetch('sidenav.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('nav-container').innerHTML = data;
        })
        .catch(error => console.error('Error loading navigation:', error));