document.addEventListener("DOMContentLoaded", async () => {
    await fetchYears();

    document.getElementById("monthSelect").addEventListener("change", () => {
        updateData();
    });

    document.getElementById("yearSelect").addEventListener("change", async (event) => {
        const year = event.target.value;
        await fetchMonth(year);
        updateData();
    });

    const initialYear = document.getElementById("yearSelect").value;
    if (initialYear) {
        await fetchMonth(initialYear);
        updateData();
    }
});

let all_users = null;
let all_avg = null;
let count = null;

async function updateData() {
    try {
        await GetUsers();
        await GetAvg();
        await GetCount();

        CreateTableHeader();
        CreateTableBody();
    } catch (error) {
        console.error("Error updating data:", error);
    }
}

async function GetUsers() {
    const month = document.getElementById("monthSelect").value;
    const year = document.getElementById("yearSelect").value;

    try {
        const url = "http://localhost:3000/review/getUsers";
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({month: month, year: year}),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reply = await response.json();
        all_users = reply.users || [];
    } catch (error) {
        console.error("Error fetching users:", error);
        all_users = [];
    }
}

async function GetAvg() {
    const month = document.getElementById("monthSelect").value;
    const year = document.getElementById("yearSelect").value;

    try {
        const url = "http://localhost:3000/review/getAvg";
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({month: month, year: year}),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reply = await response.json();
        all_avg = reply || [];
    } catch (error) {
        console.error("Error fetching averages:", error);
        all_avg = [];
    }
}

async function GetCount() {
    const month = document.getElementById("monthSelect").value;
    const year = document.getElementById("yearSelect").value;

    try {
        const url = "http://localhost:3000/review/getcount";
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({month: month, year: year}),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reply = await response.json();
        count = reply || [];

    } catch (error) {
        console.error("Error fetching count:", error);
        count = [];
    }
}

async function fetchYears() {
    try {
        const response = await fetch('http://localhost:3000/review/getYears');
        if (!response.ok) {
            throw new Error('Error retrieving years');
        }

        const data = await response.json();
        YearSelect(data.years || []);
    } catch (error) {
        console.error('Error connecting to server:', error);
        YearSelect([]);
    }
}

function YearSelect(years) {
    let s = "";
    years.forEach(year => {
        s += "<option value='" + year + "'>" + year + "</option>";
    });
    document.getElementById('yearSelect').innerHTML = s;

    const initialYear = document.getElementById("yearSelect").value;
    if (initialYear) {
        fetchMonth(initialYear);
    }
}

async function fetchMonth(year) {
    try {
        const response = await fetch('http://localhost:3000/review/getMonths', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({year: year})
        });

        if (!response.ok) {
            throw new Error('Error retrieving months');
        }

        const data = await response.json();
        monthsSelect(data.months || []);
    } catch (error) {
        console.error('Error connecting to server:', error);
        monthsSelect([]);
    }
}

function monthsSelect(months) {
    for (let i = 0; i < months.length; i++) {
        for (let j = 0; j < months.length - i - 1; j++) {
            if (months[j] > months[j + 1]) {
                let temp = months[j];
                months[j] = months[j + 1];
                months[j + 1] = temp;
            }
        }
    }

    let s = "";
    months.forEach(month => {
        s += "<option value='" + month + "'>" + month + "</option>";
    });
    document.getElementById('monthSelect').innerHTML = s;
}

function CreateTableHeader() {
    let s = "";
    s += "<tr>";
    s += "<th>Full name</th>";
    s += "<th>Diastolic</th>";
    s += "<th>Systolic</th>";
    s += "<th>Pulse</th>";
    s += "<th>Abnormal measurements</th>";
    s += "</tr>";
    document.getElementById("mainHeader").innerHTML = s;
}

function CreateTableBody() {
    let s = "";

    const usersArray = all_users || [];
    const avgArray = all_avg || [];
    const countArray = count || [];

    usersArray.forEach(user => {
        let Avg = null;
        let cnt = null;

        for (let avg of avgArray) {
            if (avg && avg.userId === user.id) {
                Avg = avg;
                break;
            }
        }

        for (let item of countArray) {
            if (item && item.userId == user.id) {
                cnt = item;
                break;
            }
        }

        if (Avg) {
            s += "<tr>";
            s += `<td>${user.full_name}</td>`;
            s += `<td>${Avg.avgLow}</td>`;
            s += `<td>${Avg.avgHigh}</td>`;
            s += `<td>${Avg.avgPulse}</td>`;
            s += `<td>${cnt ? cnt.exceptions : 0}</td>`;
            s += "</tr>";
        }
    });

    document.getElementById("mainTableData").innerHTML = s;
}