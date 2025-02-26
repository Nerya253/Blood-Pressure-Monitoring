document.addEventListener("DOMContentLoaded", () => {
    const selectElement = document.querySelector(".user-select");
    if (selectElement) {
        usersSelect();
    } else {
        console.error("Element with class 'user-select' not found.");
    }
});


async function addMadadim() {
    const userId = document.querySelector(".user-select").value;
    const date = document.getElementById("date").value;
    const high = document.getElementById("high-saturation").value;
    const low = document.getElementById("low-saturation").value;
    const pulse = document.getElementById("pulse").value;
    console.log(userId, date, high, low, pulse);


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
            console.log("מדדים נוספו בהצלחה:", reply);
            document.getElementById("date").value = "";
            document.getElementById("high-saturation").value = "";
            document.getElementById("low-saturation").value = "";
            document.getElementById("pulse").value = "";
            alert("המדדים נוספו בהצלחה!");
        } else {
            const errorText = await response.text();
            console.error("שגיאה מהשרת:", errorText);
            alert("שגיאה בהוספת המדדים.");
        }
    } catch (error) {
        console.error("שגיאה בחיבור לשרת:", error);
        alert("שגיאה בחיבור לשרת.");
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
