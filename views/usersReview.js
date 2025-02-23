let all_users = [];

async function GetUsers() {
    try {
        const url = "http://localhost:3000/Users/getUsers";
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reply = await response.json();
        console.log("Reply from server:", reply);

        all_users = reply.users || reply.data || [];
        console.log("Parsed Users:", all_users);

        CreateTableHeader();
        CreateTableBody();
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}

function CreateTableHeader() {
    let s = "";
    s += "<tr>";
    s += "<th>שם מלא</th>";
    s += "<th>סטורציה נמוכה</th>";
    s += "<th>סטורציה גבוהה</th>";
    s += "<th>דופק</th>";
    s += "<th>עריכה</th>";
    s += "<th>מחיקה</th>";
    s += "</tr>";
    document.getElementById("mainHeader").innerHTML = s;
}

function CreateTableBody() {
    let s = "";
    for (let user of all_users) {
        s += "<tr>";
        s += `<td>${user.full_name}</td>`;
        s += `<td>${user.low_saturation}</td>`;
        s += `<td>${user.high_saturation}</td>`;
        s += `<td>${user.pulse}</td>`;
        s += `<td><button onclick="editUser(${user.id})">ערוך</button></td>`;
        s += `<td><button onclick="deleteUser(${user.id})">מחק</button></td>`;
        s += "</tr>";
    }
    document.getElementById("mainTableData").innerHTML = s;
}

function editUser(userId) {
    alert(`עריכת משתמש ${userId} לא ממומשת עדיין.`);
    // כאן תוכל להוסיף קוד לעריכת משתמש
}

async function deleteUser(userId) {
    if (!confirm("האם אתה בטוח שברצונך למחוק משתמש זה?")) return;

    try {
        const response = await fetch(`http://localhost:3000/Users/deleteUser`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: userId }),
        });

        if (response.ok) {
            alert("המשתמש נמחק בהצלחה.");
            GetUsers(); // רענון הטבלה לאחר מחיקה
        } else {
            alert("שגיאה במחיקת המשתמש.");
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        alert("שגיאה בחיבור לשרת.");
    }
}

document.addEventListener("DOMContentLoaded", GetUsers);
