document.addEventListener('DOMContentLoaded', () => {
    // Set default dates
    const today = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1);

    const formatDate = (date) => date.toISOString().split('T')[0];

    document.getElementById('start_date').value = formatDate(today);
    document.getElementById('end_date').value = formatDate(nextYear);

    const form = document.getElementById('valuation-form');
    const calcBtn = document.getElementById('calc-btn');
    const errorMsg = document.getElementById('error-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Add loading state
        calcBtn.style.opacity = '0.7';
        calcBtn.querySelector('span').textContent = 'Calculating...';
        errorMsg.textContent = '';

        const formData = new FormData(form);
        const principal = parseFloat(formData.get('principal'));
        const startDate = new Date(formData.get('start_date'));
        const endDate = new Date(formData.get('end_date'));
        const fixedRate = parseFloat(formData.get('fixed_rate')) / 100;
        const jibarRate = parseFloat(formData.get('jibar_rate')) / 100;
        const zaroniaSpread = parseFloat(formData.get('zaronia_spread')) / 10000;

        // Validation
        if (endDate <= startDate) {
            errorMsg.textContent = 'End date must be after start date.';
            calcBtn.style.opacity = '1';
            calcBtn.querySelector('span').textContent = 'Calculate Valuation';
            return;
        }

        // Simulate calculation time
        await new Promise(r => setTimeout(r, 800));

        // Simplified Logic for Demo
        const days = (endDate - startDate) / (1000 * 60 * 60 * 24);
        const yearFraction = days / 365;

        const fixedInterest = principal * fixedRate * yearFraction;
        const jibarInterest = principal * jibarRate * yearFraction;

        // Simulate ZARONIA (slightly lower usually, spread adds to it)
        // Mocking a realistic differential
        const baseZaronia = jibarRate - 0.0015; // 15 bps lower base
        const effectiveZaronia = baseZaronia + zaroniaSpread;
        // Compound effect simulation (simplified)
        const zaroniaInterest = principal * (Math.pow(1 + effectiveZaronia / 365, days) - 1);

        const difference = jibarInterest - zaroniaInterest;
        const impact = difference > 0 ? "Positive Savings (JIBAR Payers Benefit)" : "Negative Impact (ZARONIA Higher)";

        const formattedResults = {
            'Fixed Leg Interest': fixedInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            'JIBAR Floating Interest': jibarInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            'ZARONIA Floating Interest': zaroniaInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            'Difference (JIBAR - ZARONIA)': difference.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            'Financial Impact': impact
        };

        updateUI(formattedResults);

        // Restore button state
        calcBtn.style.opacity = '1';
        calcBtn.querySelector('span').textContent = 'Calculate Valuation';
    });

    function updateUI(data) {
        document.getElementById('res-fixed').textContent = 'R ' + data['Fixed Leg Interest'];
        document.getElementById('res-jibar').textContent = 'R ' + data['JIBAR Floating Interest'];
        document.getElementById('res-zaronia').textContent = 'R ' + data['ZARONIA Floating Interest'];

        const diffEl = document.getElementById('res-diff');
        diffEl.textContent = 'R ' + data['Difference (JIBAR - ZARONIA)'];

        document.getElementById('res-impact').textContent = data['Financial Impact'];
    }

    const downloadBtn = document.getElementById('download-btn');
    downloadBtn.addEventListener('click', () => {
        alert("This feature requires the backend server (Python). \n\nIn this static demo, reports cannot be generated dynamically.");
    });
});
