document.querySelector('#createUserForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('http://localhost:3000/Users/createUser', {
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