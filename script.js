
document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const billInput = document.getElementById('bill-input');
  const customTipInput = document.getElementById('custom-tip-input');
  const peopleInput = document.getElementById('people-input');
  const tipButtons = document.querySelectorAll('.tip-btn');
  const resetBtn = document.getElementById('reset-btn');

  // Error Elements
  const billError = document.getElementById('bill-error');
  const tipError = document.getElementById('tip-error');
  const peopleError = document.getElementById('people-error');

  // Displays
  const totalTipDisplay = document.getElementById('total-tip-display');
  const grandTotalDisplay = document.getElementById('grand-total-display');
  const perPersonDisplay = document.getElementById('per-person-display');

  // State
  let currentTipPercent = null;

  // Validation Boundaries
  const MAX_BILL = 10000000; 
  const MAX_TIP = 1000;      
  const MAX_PEOPLE = 10000;  

  init();

  function init() {
    // Sanitize keyboard keystrokes instantly to block '+', '-', and 'e'
    [billInput, customTipInput, peopleInput].forEach(input => {
      input.addEventListener('keydown', (e) => {
        if (['+', '-', 'e', 'E'].includes(e.key)) {
          e.preventDefault(); // Blocks the key from even appearing in the box
        }
      });
    });

    // Input Event Listeners for seamless live calculation
    billInput.addEventListener('input', handleLiveUpdate);
    customTipInput.addEventListener('input', () => {
      clearActivePreset();
      currentTipPercent = null;
      handleLiveUpdate();
    });
    peopleInput.addEventListener('input', handleLiveUpdate);

    // Preset Button Listeners
    tipButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('active')) {
          btn.classList.remove('active');
          currentTipPercent = null;
        } else {
          clearActivePreset();
          btn.classList.add('active');
          currentTipPercent = parseFloat(btn.dataset.percent);
          customTipInput.value = ''; 
        }
        hideError(tipError, 'group-tip');
        handleLiveUpdate();
      });
    });

    resetBtn.addEventListener('click', resetApp);
  }

  function handleLiveUpdate() {
    validateAndCalculate();
  }

  function clearActivePreset() {
    tipButtons.forEach(b => b.classList.remove('active'));
  }

  function showError(element, groupId, message) {
    element.textContent = message;
    element.classList.add('visible');
    document.getElementById(groupId).classList.add('invalid');
  }

  function hideError(element, groupId) {
    element.textContent = '';
    element.classList.remove('visible');
    document.getElementById(groupId).classList.remove('invalid');
  }

  function validateAndCalculate() {
    let isValid = true;

    // 1. Validate Bill Amount
    const billRaw = billInput.value;
    let billVal = parseFloat(billRaw);
    
    if (billRaw !== '') {
      if (isNaN(billVal) || billVal < 0) {
        showError(billError, 'group-bill', "Can't be negative");
        isValid = false;
      } else if (billVal === 0) {
        showError(billError, 'group-bill', "Can't be zero");
        isValid = false;
      } else if (billVal > MAX_BILL) {
        showError(billError, 'group-bill', "Too large");
        isValid = false;
      } else {
        hideError(billError, 'group-bill');
      }
    } else {
      hideError(billError, 'group-bill');
      billVal = 0;
    }

    // 2. Validate Tip Percent
    let tipPercent = 0;
    if (currentTipPercent !== null) {
      tipPercent = currentTipPercent;
    } else if (customTipInput.value !== '') {
      const customVal = parseFloat(customTipInput.value);
      if (isNaN(customVal) || customVal < 0) {
        showError(tipError, 'group-tip', "Can't be negative");
        isValid = false;
      } else if (customVal > MAX_TIP) {
        showError(tipError, 'group-tip', `Max ${MAX_TIP}%`);
        isValid = false;
      } else {
        hideError(tipError, 'group-tip');
        tipPercent = customVal;
      }
    } else {
      hideError(tipError, 'group-tip');
    }

    // 3. Validate Number of People
    const peopleRaw = peopleInput.value;
    let peopleVal = parseInt(peopleRaw, 10);

    if (peopleRaw !== '') {
      if (isNaN(peopleVal) || peopleVal < 1) {
        showError(peopleError, 'group-people', "Must be 1 or more");
        isValid = false;
      } else if (parseFloat(peopleRaw) % 1 !== 0) {
        showError(peopleError, 'group-people', "Must be a whole number");
        isValid = false;
      } else if (peopleVal > MAX_PEOPLE) {
        showError(peopleError, 'group-people', "Too large");
        isValid = false;
      } else {
        hideError(peopleError, 'group-people');
      }
    } else {
      hideError(peopleError, 'group-people');
      peopleVal = 1; // Safeguard fallback split
    }

    // Reset Button State
    if (billRaw !== '' || customTipInput.value !== '' || peopleRaw !== '' || currentTipPercent !== null) {
      resetBtn.removeAttribute('disabled');
    } else {
      resetBtn.setAttribute('disabled', 'true');
    }

    // Calculate ONLY if the bill is positive and inputs are fully valid
    if (isValid && billVal > 0) {
      calculateValues(billVal, tipPercent, peopleVal);
    } else {
      clearDisplays();
    }
  }

  function calculateValues(bill, tipPercent, people) {
    const totalTip = bill * (tipPercent / 100);
    const grandTotal = bill + totalTip;
    
    // Group-fair ceiling rounding policy
    const rawPerPerson = grandTotal / people;
    const perPerson = Math.ceil(rawPerPerson * 100) / 100;

    totalTipDisplay.textContent = formatCurrency(totalTip);
    grandTotalDisplay.textContent = formatCurrency(grandTotal);
    perPersonDisplay.textContent = formatCurrency(perPerson);
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }

  function clearDisplays() {
    totalTipDisplay.textContent = '$0.00';
    grandTotalDisplay.textContent = '$0.00';
    perPersonDisplay.textContent = '$0.00';
  }

  function resetApp() {
    billInput.value = '';
    customTipInput.value = '';
    peopleInput.value = '';
    currentTipPercent = null;
    clearActivePreset();
    
    hideError(billError, 'group-bill');
    hideError(tipError, 'group-tip');
    hideError(peopleError, 'group-people');
    
    clearDisplays();
    resetBtn.setAttribute('disabled', 'true');
  }
});