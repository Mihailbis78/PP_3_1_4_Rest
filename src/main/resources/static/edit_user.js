const modal = document.getElementById('actionsModal');
const modalForm = document.getElementById('modalWindowAction');
const submitButton = document.getElementById('submitButton');
const removeButton = document.getElementById('removeButton');

async function fillModalWindow(userId) {
    try {
        const response = await fetch(`/admin/users/${userId}`);
        if (!response.ok) {
            throw new Error(`Error receiving data`);
        }
        const userData = await response.json();
        console.log(userData.firstName);
        console.log(userData.email);

        modalForm.querySelector('input[name="id"]').value = userData.id;
        modalForm.querySelector('#editName').value = userData.name;
        modalForm.querySelector('#editAge').value = userData.age;
        modalForm.querySelector('#editEmail').value = userData.email;

        const rolesSelect = modalForm.querySelector('#editRolesSelect');
        const allRoles = ['USER', 'ADMIN'];

        rolesSelect.innerHTML = '';

        allRoles.forEach(roleName => {
            const option = document.createElement('option');
            option.value = roleName;
            option.text = roleName;
            option.selected = userData.roles.includes(roleName);
            rolesSelect.appendChild(option);
        });

        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
    } catch (error) {
        console.error('Error receiving data:', error);

    }
}

async function sendEditDataToServer(data) {
    try {
        const response = await fetch('/admin/save_edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const result = await response.json();
        console.log('Saved:', result);
    } catch (error) {
        console.error('Error saving:', error);
    }
}

function setupEditModal(userId) {
    fillModalWindow(userId);
    modal.querySelector('.modal-title').textContent = 'Edit user';
    submitButton.textContent = 'SUBMIT';
    submitButton.style.display = 'inline-block';
    removeButton.style.display = 'none';
    toggleFields(true);

    submitButton.removeEventListener('click', handleSave);

    submitButton.addEventListener('click', handleSave);

    async function handleSave(event) {
        event.preventDefault();

        const formData = new FormData(modalForm);
        const data = Object.fromEntries(formData.entries());

        data.id = parseInt(data.id, 10);
        data.age = parseInt(data.age, 10);

        delete data.roles;
        const rolesSelect = modalForm.querySelector('#editRolesSelect');
        data.roles = Array.from(rolesSelect.selectedOptions)
            .map(option => option.value);

        if (data.password !== data.passwordConfirm) {
            alert('Passwords dont match!');
            return;
        }

        if (!data.password || data.password.trim() === '') {
            delete data.password;
            delete data.passwordConfirm;
        } else if (data.password.length < 8) {
            alert('Minimum 8 char');
            return;
        }

        console.log("Data sent:", data);
        const jsonData = JSON.stringify(data);
        console.log("JSON sent:", jsonData);

        try {
            const modalInstance = bootstrap.Modal.getInstance(modal);

            await sendEditDataToServer(data);
            modalInstance.hide();
            updateTableRow(data);
            showUserInfo();

        } catch (error) {
            console.error('Error saving:', error);
        }
    }
}

async function editUser(userId) {
    await setupEditModal(userId);
}

function toggleFields(editable) {
    const fields = modalForm.querySelectorAll('input, select');
    fields.forEach(field => {
        if (editable) {
            field.removeAttribute('readonly');
        } else {
            field.setAttribute('readonly', true);
        }
    })
}

function updateTableRow(updatedUser) {
    const row = document.querySelector(`#tableUsers tr[data-id="${updatedUser.id}"]`);
    if (row) {
        row.innerHTML = `
            <td>${updatedUser.id}</td>
            <td>${updatedUser.name}</td>
            <td>${updatedUser.email}</td>
            <td>${updatedUser.age}</td>
            <td>${updatedUser.roles.join(', ')}</td>
            <td>
                <button class="btn btn-info" onclick="editUser(${updatedUser.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteUser(${updatedUser.id})">Delete</button>
            </td>
        `;
    }
}