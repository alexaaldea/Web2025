window.adminPanel = {
    loadUsers: function () {
        console.log("adminPanel.loadUsers() called ✅");
        fetch('../config/get_users.php')
            .then(res => {
                console.log('get_users.php response status:', res.status);
                return res.json();
            })
            .then(users => {
                console.log("Users loaded from backend:", users);
                const list = document.getElementById('user-list');
                console.log("user-list element:", list);
                list.innerHTML = '';

                users.forEach(user => {
                    const div = document.createElement('div');
                    div.innerHTML = `
                        <span>${user.email} (${user.role})</span>
                        <button onclick="adminPanel.deleteUser('${user.email}')">Delete</button>
                    `;
                    list.appendChild(div);
                });
            })
            .catch(err => {
                document.getElementById('user-list').textContent = 'Error: ' + err.message;
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
            adminPanel.loadUsers(); // refresh user list
        })
        .catch(err => {
            alert('Error deleting user: ' + err.message);
        });
    }
};
