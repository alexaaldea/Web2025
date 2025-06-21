window.adminPanel = {
    loadUsers: function () {

    fetch('/Web2025/Inpot/config/get_users.php')
        .then(res => {
            return res.json();
        })
        .then(users => {
            const container = document.getElementById('user-list');

            if (!Array.isArray(users)) {
                container.innerHTML = `<p>Error: ${users.error || 'Unauthorized access'}</p>`;
                return;
            }

            if (!container) {
                console.error('user-list container not found');
                return;
            }

            container.innerHTML = ''; 

            users.forEach(user => {
                const userDiv = document.createElement('div');
                userDiv.innerHTML = `
                    <span>${user.email} (${user.role})</span>
                    ${user.role !== 'admin' ? `<button onclick="adminPanel.deleteUser('${user.email}')">Delete</button>` : ''}
                `;
                container.appendChild(userDiv);
            });
        })
        .catch(err => {
            const container = document.getElementById('user-list');
            if (container) {
                container.innerHTML = `<p>Error loading users: ${err.message}</p>`;
            }
        });
},
    deleteUser: function (email) {
        if (!confirm(`Are you sure you want to delete ${email}?`)) return;

        fetch('../config/delete_user.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        })
        .then(res => {
            if (!res.ok) throw new Error('Failed to delete user');
            adminPanel.loadUsers();
        })
        .catch(err => {
            alert('Error deleting user: ' + err.message);
        });
    }
};
