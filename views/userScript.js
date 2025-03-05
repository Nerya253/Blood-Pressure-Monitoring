document.addEventListener("DOMContentLoaded", () => {
    const selectElement = document.querySelector(".user-select");
    if (selectElement) {
        usersSelect();
    } else {
        console.error("Element with class 'user-select' not found.");
    }
});

// Display list of users
async function usersSelect() {
    let url = "http://localhost:3000/Users/getUsers";
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let data = await response.json();
        let users = data.users;
        let s = "";

        for (let user of users) {
            s += `<option value="${user.id}">${user.full_name}</option>`;
        }

        document.querySelector(".user-select").innerHTML = s;

    } catch (error) {
        console.error("Error fetching users:", error);
    }
}

// Add new user
async function createUser(event) {
    if (event) event.preventDefault();

    const newUserName = document.getElementById("newUserName").value;

    if (!newUserName) {
        alert("Please enter a username");
        return;
    }

    if (newUserName.trim() === "") {
        alert("Please enter a name");
        return;
    }

    let url = "http://localhost:3000/Users/createUser";
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ newUserName: newUserName })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            document.getElementById("newUserName").value = "";
            alert("User successfully created");
            usersSelect();
        }
    } catch (error) {
        console.error("Error creating user:", error);
        alert("Error connecting to server");
    }
}

// Delete user
async function deleteUser(event) {
    if (event) event.preventDefault();

    document.getElementById("newName").value = "";

    const userSelect = document.querySelector(".user-select");
    const userId = userSelect.value;
    const userName = userSelect.options[userSelect.selectedIndex].text;

    const isConfirmed = confirm(`Are you sure you want to delete the user "${userName}"? This action cannot be undone.`);

    if (isConfirmed) {
        try {
            const response = await fetch("http://localhost:3000/Users/deleteUser", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: userId })
            });

            if (response.ok) {
                alert("User successfully deleted");

                await usersSelect();
            } else {
                throw new Error("Failed to delete user");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error deleting user");
        }
    }
}

// Update user
async function updateUser(event) {
    if (event) event.preventDefault();

    const userId = document.querySelector(".user-select").value;
    const newName = document.getElementById("newName").value;

    if (!userId || !newName) {
        alert("Please fill in all fields!");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/Users/updateUser", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: userId, newName: newName })
        });

        if (response.ok) {
            alert("Updated successfully!");
            document.getElementById("newName").value = "";

            await usersSelect();
        } else {
            const errorText = await response.text();
            console.error("Server error:", errorText);
            alert("Error updating user.");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Error connecting to server");
    }
}