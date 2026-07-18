
const registerForm = document.getElementById("registerForm");

if(registerForm){
    registerForm.addEventListener("submit", function(e){
        e.preventDefault();

        const user = {
            fullname: document.getElementById("fullname").value,
            email: document.getElementById("email").value,
            mobile: document.getElementById("mobile").value,
            role: document.getElementById("role").value,
            password: document.getElementById("password").value
        };

        localStorage.setItem("gatepass_user", JSON.stringify(user));

        document.getElementById("msg").textContent = "Registered successfully! Redirecting to login...";
        document.getElementById("msg").className = "msg success";

        setTimeout(function(){
            window.location.href = "./";
        }, 1200);
    });
}

/* ===== LOGIN ===== */
const loginForm = document.getElementById("loginForm");

if(loginForm){
    loginForm.addEventListener("submit", function(e){
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const savedUser = JSON.parse(localStorage.getItem("gatepass_user"));

        if(savedUser && savedUser.email === email && savedUser.password === password){
            localStorage.setItem("gatepass_loggedin", "true");
            window.location.href = "./dashboard.html";
        } else {
            document.getElementById("msg").textContent = "Invalid email or password. Please register first.";
            document.getElementById("msg").className = "msg error";
        }
    });
}

/* ===== DASHBOARD ===== */
const gatePassForm = document.getElementById("gatePassForm");

if(gatePassForm){

    /* Protect dashboard - redirect to login if not logged in */
    const isLoggedIn = localStorage.getItem("gatepass_loggedin");
    if(isLoggedIn !== "true"){
        window.location.href = "./";
    }

    /* Show welcome message */
    const currentUser = JSON.parse(localStorage.getItem("gatepass_user"));
    if(currentUser){
        document.getElementById("welcomeUser").textContent = "Welcome, " + currentUser.fullname;
    }

    /* Load existing visitors on page load */
    loadVisitors();

    gatePassForm.addEventListener("submit", function(e){
        e.preventDefault();

        const visitor = {
            id: "GP-" + Date.now().toString().slice(-6),
            name: document.getElementById("vname").value,
            mobile: document.getElementById("vmobile").value,
            purpose: document.getElementById("vpurpose").value,
            meet: document.getElementById("vmeet").value,
            date: document.getElementById("vdate").value,
            time: document.getElementById("vtime").value
        };

        /* Save to localStorage list */
        let visitors = JSON.parse(localStorage.getItem("gatepass_visitors")) || [];
        visitors.push(visitor);
        localStorage.setItem("gatepass_visitors", JSON.stringify(visitors));

        /* Show pass preview */
        showPass(visitor);

        /* Refresh table */
        loadVisitors();

        /* Reset form */
        gatePassForm.reset();
    });
}

function showPass(visitor){
    document.getElementById("passId").textContent = visitor.id;
    document.getElementById("passName").textContent = visitor.name;
    document.getElementById("passMobile").textContent = visitor.mobile;
    document.getElementById("passPurpose").textContent = visitor.purpose;
    document.getElementById("passMeet").textContent = visitor.meet;
    document.getElementById("passDate").textContent = visitor.date;
    document.getElementById("passTime").textContent = visitor.time;

    document.getElementById("passPreview").classList.remove("hidden");
}

function loadVisitors(){
    const visitors = JSON.parse(localStorage.getItem("gatepass_visitors")) || [];
    const tbody = document.getElementById("visitorTableBody");
    const noDataMsg = document.getElementById("noVisitors");

    tbody.innerHTML = "";

    if(visitors.length === 0){
        noDataMsg.style.display = "block";
        return;
    }

    noDataMsg.style.display = "none";

    visitors.forEach(function(v){
        const row = document.createElement("tr");
        row.innerHTML =
            "<td>" + v.id + "</td>" +
            "<td>" + v.name + "</td>" +
            "<td>" + v.mobile + "</td>" +
            "<td>" + v.purpose + "</td>" +
            "<td>" + v.meet + "</td>" +
            "<td>" + v.date + "</td>" +
            "<td>" + v.time + "</td>";
        tbody.appendChild(row);
    });
}

/* ===== LOGOUT ===== */
const logoutBtn = document.getElementById("logoutBtn");

if(logoutBtn){
    logoutBtn.addEventListener("click", function(e){
        e.preventDefault();
        localStorage.removeItem("gatepass_loggedin");
        window.location.href = "./";
    });
}