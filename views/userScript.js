document.addEventListener("DOMContentLoaded", () => {
    const selectElement = document.querySelector(".user-select");
    if (selectElement) {
        usersSelect();
    } else {
        console.error("Element with class 'user-select' not found.");
    }
});


//הצגת רשימת המשתמשים
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


async function createUser() {
    const newUserName = document.getElementById("newUserName").value;

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
        }else {
            document.getElementById("newUserName").value = "";
        }
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}





//מחיקת משתמש
async function deleteUser() {
    const userId = document.querySelector(".user-select").value;

    try {
        const response = await fetch("http://localhost:3000/Users/deleteUser", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: userId })
        });

    } catch (error) {
        console.error("Error deleting user:", error);
        alert("שגיאה בחיבור לשרת");
    }
}


async function updateUser() {
    const userId = document.querySelector(".user-select").value;
    const newName  = document.getElementById("newName").value;

    if (!userId || !newName) {
        alert("יש למלא את כל השדות!");
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
            alert("עודכן בהצלחה!");
        } else {
            const errorText = await response.text();
            console.error("שגיאה מהשרת:", errorText);
            alert("שגיאה בהוספת המדדים.");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("שגיאה בחיבור לשרת");
    }
}



document.getElementById("deleteButton").addEventListener("click", () => {
    document.getElementById("newName").disabled = true;
    document.getElementById("newName").value = "";
});

document.getElementById("updateButton").addEventListener("click", () => {
    document.getElementById("newName").disabled = false;
});


