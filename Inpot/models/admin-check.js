
    console.log("Admin check script started");

    fetch('../config/check_admin.php')
        .then(res => {
            console.log("Response status:", res.status);
            if (!res.ok) throw new Error("Not authorized");
            return res.json();
        })
        .then(data => {
            console.log("Admin check response data:", data);
            if (data.is_admin) {
                const sidebar = document.querySelector('.sidebar ul');
                if (!sidebar) {
                    console.error("Sidebar ul not found");
                    return;
                }

                const adminLi = document.createElement('li');
                adminLi.innerHTML = `
                    <a onclick="mainController.showContainer('admin')">
                        <i class="fas fa-user-shield"></i> Admin Panel
                    </a>`;

                sidebar.appendChild(adminLi); 
                console.log("Admin button added");
            } else {
                console.log("User is NOT admin");
            }
        })
        .catch(err => {
            console.error('Admin check failed:', err.message);
        });