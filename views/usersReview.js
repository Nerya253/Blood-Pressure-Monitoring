document.addEventListener("DOMContentLoaded", async () => {
    await fetchYears();

    document.getElementById("monthSelect").addEventListener("change", () => {
        GetUsers();
        GetAvg();
        GetCount();
    });

    document.getElementById("yearSelect").addEventListener("change", async (event) => {
        const year = event.target.value;
        await fetchMonth(year);
        GetUsers();
        GetAvg();
        GetCount();
    });

    const initialYear = document.getElementById("yearSelect").value;
    if (initialYear) {
        await fetchMonth(initialYear);
        GetUsers();
        GetAvg();
        GetCount();
    }
});

let all_users = null;
let all_avg = null;
let count = null;

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

        CreateTableHeader();
        CreateTableBody();
    } catch (error) {
        console.error("Error fetching users:", error);
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
        all_avg = reply;

        CreateTableHeader();
        CreateTableBody();
    } catch (error) {
        console.error("Error fetching averages:", error);
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
        count = reply;

        CreateTableHeader();
        CreateTableBody();
    } catch (error) {
        console.error("Error fetching count:", error);
    }
}

async function fetchYears() {
    try {
        const response = await fetch('http://localhost:3000/review/getYears');
        if (!response.ok) {
            throw new Error('שגיאה בהבאת השנים');
        }

        const data = await response.json();
        YearSelect(data.years);
    } catch (error) {
        console.error('שגיאה בחיבור לשרת:', error);
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
        GetUsers();
        GetAvg();
        GetCount();
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
            throw new Error('שגיאה בהבאת חודשים');
        }

        const data = await response.json();
        monthsSelect(data.months);
    } catch (error) {
        console.error('שגיאה בחיבור לשרת:', error);
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
    s += "<th>שם מלא</th>";
    s += "<th>סטורציה נמוכה</th>";
    s += "<th>סטורציה גבוהה</th>";
    s += "<th>דופק</th>";
    s += "<th>כמות מדידות חריגות</th>";
    s += "</tr>";
    document.getElementById("mainHeader").innerHTML = s;
}

function CreateTableBody() {
    let s = "";

    all_users.forEach(user => {
        let Avg = null;
        let cnt = null;

        for (let avg of all_avg) {
            if (avg.userId === user.id) {
                Avg = avg;
                break;
            }
        }

        for (let item of count) {
            if (item.userId == user.id) {
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