document.addEventListener("DOMContentLoaded", () => {
    usersSelect();

    document.querySelector("form").addEventListener("submit", (event) => {
        event.preventDefault();
        getHistory();
    });
});

let all_users = null;
let medidot = null;

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
        all_users = data.users;
        console.log(all_users);
        let s = "";
        for (let user of all_users) {
            s += `<option value="${user.id}">${user.full_name}</option>`;
        }
        document.querySelector(".user-select").innerHTML = s;

    } catch (error) {
        console.error("Error fetching users:", error);
    }
}


async function getHistory() {
    const userId = document.querySelector(".user-select").value;
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;

    if (!userId || !startDate || !endDate) {
        alert("נא למלא את כל השדות");
        return;
    }

    try {
        const url = "http://localhost:3000/history/getHistory";
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: userId,
                startDate: startDate,
                endDate: endDate
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        medidot = data.medidot;

        CreateTableHeader();
        CreateTableBody();
    } catch (error) {
        console.error("Error fetching history:", error);
    }
}

function CreateTableHeader() {
    let s = "";
    s += "<tr>";
    s += "<th>תאריך</th>";
    s += "<th>סיטורציה נמוכה</th>";
    s += "<th>סיטורציה גבוהה</th>";
    s += "<th>דופק</th>";
    s += "</tr>";
    document.getElementById("mainHeader").innerHTML = s;
}

function CreateTableBody() {
    let s = "";

    if (medidot && medidot.length > 0) {
        for (let medida of medidot) {
            const date = new Date(medida.date);
            const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

            s += "<tr>";
            s += `<td>${formattedDate}</td>`;
            s += `<td>${medida.low}</td>`;
            s += `<td>${medida.high}</td>`;
            s += `<td>${medida.pulse}</td>`;
            s += "</tr>";
        }
    } else {
        s += "<tr><td colspan='5'>אין נתונים להצגה</td></tr>";
    }

    document.getElementById("mainTableData").innerHTML = s;
}