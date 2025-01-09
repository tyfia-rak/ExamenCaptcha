async function fetchAndDisplay(n) {
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = '';

    for (let i = 1; i <= n; i++) {
        await fetch('https://api.prod.jcloudify.com/whoami');
        outputDiv.innerHTML += `${i}. Forbidden<br>`; 
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

function handleSubmit(event) {
    event.preventDefault();
    const n = parseInt(document.getElementById('numberInput').value);
    if (n >= 1 && n <= 1000) {
        fetchAndDisplay(n);
    } else {
        alert('Please enter a number between 1 and 1000.');
    }
}