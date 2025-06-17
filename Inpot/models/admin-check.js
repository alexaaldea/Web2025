fetch('../config/check_admin.php')
    .then(res => {
        if (!res.ok) throw new Error("Not authorized");
        return res.json();
    })
    .then(data => {
        window.isAdmin = !!data.is_admin; 

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
        }
    })
    .catch(err => {
        window.isAdmin = false;
        console.error('Admin check failed:', err.message);
    });
