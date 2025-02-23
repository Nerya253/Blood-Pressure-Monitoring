document.addEventListener("DOMContentLoaded", () => {
    const selectElement = document.querySelector(".user-select");
    if (selectElement) {
        usersSelect();
    } else {
        console.error("Element with class 'user-select' not found.");
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#createMadadimForm');
    if (!form) {
        console.error("Element with id 'createMadadimForm' not found.");
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('http://localhost:3000/madadim/createMadadim', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                alert('המדדים נקלטו בהצלחה!');
                form.reset();
            } else {
                alert('שגיאה בהכנסת המדדים');
            }
        } catch (error) {
            console.error('שגיאה בחיבור לשרת:', error);
            alert('שגיאה בחיבור לשרת');
        }
    });
});


async function addMadadim() {
    const userId = document.getElementById("user-select").value;

    if (!userId) {
        alert("בחר משתמש");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/Users/deleteUser", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: userId })  // שולח את ה-ID של המשתמש שנבחר למחיקה
        });

    } catch (error) {
        console.error("Error deleting user:", error);
        alert("שגיאה בחיבור לשרת");
    }
}


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