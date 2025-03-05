document.addEventListener("DOMContentLoaded", () => {
    const selectElement = document.querySelector(".user-select");
    if (selectElement) {
        usersSelect();
    } else {
        console.error("Element with class 'user-select' not found.");
    }
});

function validateDate(dateStr) {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(dateStr)) {
        alert("Please enter a valid date format (YYYY-MM-DD)");
        return false;
    }

    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    if (`${year}-${month}-${day}` !== dateStr) {
        alert("Invalid date entered");
        return false;
    }

    if (year < 2000) {
        alert("Date cannot be earlier than year 2000");
        return false;
    }

    const dateFormatted = `${year}-${month}-${day}`;

    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = String(today.getMonth() + 1).padStart(2, '0');
    const todayDay = String(today.getDate()).padStart(2, '0');
    const todayFormatted = `${todayYear}-${todayMonth}-${todayDay}`;

    if (dateFormatted > todayFormatted) {
        alert("Date cannot be in the future");
        return false;
    }

    return true;
}

async function addMadadim() {
    const userId = document.querySelector(".user-select").value;
    const date = document.getElementById("date").value;
    const high = document.getElementById("high-saturation").value;
    const low = document.getElementById("low-saturation").value;
    const pulse = document.getElementById("pulse").value;

    if (!userId) {
        alert("Please select a user");
        return;
    }
    if (!date) {
        alert("Please enter a date");
        return;
    }
    if (!validateDate(date)) {
        return;
    }
    const isNumber = (value) => /^\d+$/.test(String(value));
    if (!low || !isNumber(low) || parseInt(low) <= 0) {
        alert("Please enter a valid diastolic value");
        return;
    }
    if (!high || !isNumber(high) || parseInt(high) <= 0) {
        alert("Please enter a valid systolic value");
        return;
    }
    if (!pulse || !isNumber(pulse) || parseInt(pulse) <= 0) {
        alert("Please enter a valid pulse value");
        return;
    }

    try {
        let url = "http://localhost:3000/madadim/createMadadim";

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ user: userId, date: date, high: high, low: low, pulse: pulse }),
        });

        if (response.ok) {
            const reply = await response.json();
            console.log("Measurements added successfully:", reply);
            document.getElementById("date").value = "";
            document.getElementById("high-saturation").value = "";
            document.getElementById("low-saturation").value = "";
            document.getElementById("pulse").value = "";
            alert("Measurements added successfully!");
        } else {
            const errorText = await response.text();
            console.error("Server error:", errorText);
            alert("Error adding measurements.");
        }
    } catch (error) {
        console.error("Error connecting to server:", error);
        alert("Error connecting to server.");
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