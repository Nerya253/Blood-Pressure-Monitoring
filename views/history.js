document.addEventListener("DOMContentLoaded", () => {
    usersSelect();

    document.querySelector("form").addEventListener("submit", (event) => {
        event.preventDefault();
        getHistory();
    });
});

let all_users = null;
let measurements = null;
let deviationIds = null

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
        alert("Please fill in all fields");
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
        measurements = data.measurements;
        deviationIds = data.deviationIds;

        CreateTableHeader();
        CreateTableBody();
    } catch (error) {
        console.error("Error fetching history:", error);
    }
}

function CreateTableHeader() {
    let s = "";
    s += "<tr>";
    s += "<th>Date</th>";
    s += "<th>Diastolic</th>";
    s += "<th>Systolic</th>";
    s += "<th>Pulse</th>";
    s += "</tr>";
    document.getElementById("mainHeader").innerHTML = s;
}


function CreateTableBody() {
    let s = "";

    if (measurements && measurements.length > 0) {
        for (let i = 0; i < measurements.length; i++) {

            const measurement = measurements[i];

            const date = new Date(measurement.date);
            const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

            console.log(deviationIds);
            let isDeviation = false;
            if (deviationIds && deviationIds.length > 0) {
                for (let j = 0; j < deviationIds.length; j++) {
                    if (deviationIds[j] === measurement.id) {
                        isDeviation = true;
                        break;
                    }
                }
            }

            if (isDeviation) {
                s += "<tr>";
                s += `<td class="isBold">${formattedDate}</td>`;
                s += `<td class="isBold">${measurement.low}</td>`;
                s += `<td class="isBold">${measurement.high}</td>`;
                s += `<td class="isBold">${measurement.pulse}</td>`;
                s += "</tr>";
            } else {
                s += "<tr>";
                s += `<td>${formattedDate}</td>`;
                s += `<td>${measurement.low}</td>`;
                s += `<td>${measurement.high}</td>`;
                s += `<td>${measurement.pulse}</td>`;
                s += "</tr>";
            }
        }
    } else {
        s += "<tr><td colspan='4'>No data to display</td></tr>";
    }

    document.getElementById("mainTableData").innerHTML = s;
}