async function fetchAndDisplay(n) {
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = '';

    for (let i = 1; i <= n; i++) {
        await fetch('https://api.prod.jcloudify.com/whoami');
        outputDiv.innerHTML += `${i}. Forbidden<br>`; 
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}