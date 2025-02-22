
document.querySelector('#createMadadimForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('http://localhost:3000/madadim/createMadadim', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert('המשתמש נוצר בהצלחה!');
            form.reset();
        } else {
            alert('שגיאה ביצירת המשתמש');
        }
    } catch (error) {
        console.error('שגיאה בחיבור לשרת:', error);
        alert('שגיאה בחיבור לשרת');
    }
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