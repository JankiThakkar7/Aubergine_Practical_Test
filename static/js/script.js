document.addEventListener('DOMContentLoaded', (event) => {
    const searchButton = document.getElementById('search-btn');
    const countryInput = document.getElementById('country-input');
    const stateSelect = document.getElementById('state-select');
    
    // Here is the function through search will be performed
    function performSearch() {
        const country = countryInput.value.trim();
        const stateProvince = stateSelect.value;

        if (country) {
            fetch(`/search?country=${country}&state_province=${stateProvince}`)
                .then(response => response.json())
                .then(data => {
                    // The state dropdown is handled over here
                    stateSelect.innerHTML = '<option value="">Select State</option>';
                    data.provinces.forEach(province => {
                        const option = document.createElement('option');
                        option.value = province;
                        option.textContent = province;
                        stateSelect.appendChild(option);
                    });
                    stateSelect.disabled = data.provinces.length === 0;

                    // Render university cards
                    const cardsContainer = document.getElementById('university-cards');
                    cardsContainer.innerHTML = '';
                    data.universities.forEach(uni => {
                        const card = document.createElement('div');
                        card.className = 'col-md-4 mb-4';
                        card.innerHTML = `
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">${uni.name}</h5>
                                    <a href="${uni.web_pages[0]}" target="_blank">${uni.web_pages[0]}</a>
                                    <button class="btn btn-primary download-btn mt-2" onclick="downloadCard('${uni.name}', '${uni.web_pages[0]}')">Download as JPEG</button>
                                </div>
                            </div>
                        `;
                        cardsContainer.appendChild(card);
                    });
                });
        }
    }

    // Search on button click
    searchButton.addEventListener('click', performSearch);

    // Search on Enter key press
    countryInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission if inside a form
            performSearch();
        }
    });
});

function downloadCard(name, website) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    
    const canvasWidth = 400; 
    const canvasHeight = 250; 
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#333';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    const lineHeight = 24;
    const margin = 20;

    function wrapText(text, x, y, maxWidth) {
        const words = text.split(' ');
        let line = '';
        let testLine = '';

        for (let i = 0; i < words.length; i++) {
            testLine += words[i] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;

            if (testWidth > maxWidth) {
                ctx.fillText(line, x, y);
                line = words[i] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, y);
    }

    // Draw university name and website
    wrapText(name, margin, margin, canvasWidth - 2 * margin);
    wrapText(website, margin, margin + lineHeight * 1.5, canvasWidth - 2 * margin);

    // Download the image
    const link = document.createElement('a');
    link.download = `${name}.jpeg`;
    link.href = canvas.toDataURL('image/jpeg');
    link.click();
}
