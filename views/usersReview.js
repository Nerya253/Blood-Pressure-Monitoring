let all_users = [];
let all_avg = [];

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

        all_users = reply.users || reply.data || [];

        CreateTableHeader();
        CreateTableBody();
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}

async function GetAvg() {
    try {
        const url = "http://localhost:3000/history/getMonthlySummary";
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reply = await response.json();

        all_avg = reply;

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
    s += "<th>כמות מדידיות חריגות</th>";
    s += "</tr>";
    document.getElementById("mainHeader").innerHTML = s;
}

function CreateTableBody() {
    let s = "";

    for (let user of all_users) {

        let avg = null;
        for (let i = 0; i < all_avg.length; i++) {
            if (all_avg[i].full_name === user.full_name) {
                avg = all_avg[i];
                break;
            }
        }

        if (avg) {
            s += "<tr>";
            s += `<td>${user.full_name}</td>`;
            s += `<td>${avg.low_saturation_avg}</td>`;
            s += `<td>${avg.high_saturation_avg}</td>`;
            s += `<td>${avg.pulse_avg}</td>`;
            s += `<td>${avg.abnormal_measurements_count || 0}</td>`;
            s += "</tr>";
        }
    }

    document.getElementById("mainTableData").innerHTML = s;
}

document.addEventListener("DOMContentLoaded", GetUsers);
document.addEventListener("DOMContentLoaded", GetAvg);
