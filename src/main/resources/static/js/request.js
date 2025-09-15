(function () {
    const headquarterInput = document.getElementById('headquarter');
    const form = document.getElementById('requestForm');
    const branchMessage = document.getElementById('msg_branch');
    const institutionWrapper = document.getElementById('div_institution');
    const institutionSelect = document.getElementById('institution');
    const alertBox = document.getElementById('formAlert');

    const acronymInput = document.getElementById('acronym');
    const nameInput = document.getElementById('name');
    const typeSelect = document.getElementById('type');
    const countrySelect = document.getElementById('country');
    const cityInput = document.getElementById('city');
    const websiteInput = document.getElementById('website');

    function toggleAlert(message) {
        if (message) {
            alertBox.textContent = message;
            alertBox.style.display = 'block';
        } else {
            alertBox.textContent = '';
            alertBox.style.display = 'none';
        }
    }

    function show(element) {
        element.style.display = 'inline';
    }

    function hide(element) {
        element.style.display = 'none';
    }

    function setBranchButtons(isBranch) {
        const yesButton = document.getElementById('buttonOK');
        const noButton = document.getElementById('buttonKO');
        if (isBranch) {
            yesButton.classList.remove('btn-default');
            yesButton.classList.add('btn-success');
            noButton.classList.remove('btn-success');
            noButton.classList.add('btn-default');
            institutionWrapper.style.display = 'block';
            headquarterInput.value = 'No';
            hide(branchMessage);
        } else {
            noButton.classList.remove('btn-default');
            noButton.classList.add('btn-success');
            yesButton.classList.remove('btn-success');
            yesButton.classList.add('btn-default');
            institutionWrapper.style.display = 'none';
            institutionSelect.value = '';
            headquarterInput.value = 'Yes';
            hide(branchMessage);
        }
    }

    function populateSelect(select, values, useMapValueForOptionValue) {
        select.innerHTML = '';
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select an option...';
        select.appendChild(defaultOption);
        Object.keys(values).forEach(function (key) {
            const option = document.createElement('option');
            const mapValue = values[key];
            option.value = useMapValueForOptionValue ? mapValue : key;
            option.textContent = mapValue;
            select.appendChild(option);
        });
    }

    function fetchInstitutions() {
        fetch('/api/requests/names')
            .then(handleJson)
            .then(function (data) {
                if (data && data.mapInstitutions) {
                    populateSelect(institutionSelect, data.mapInstitutions, true);
                }
            })
            .catch(function () {
                // Ignore errors, select will remain empty
            });
    }

    function fetchCountries() {
        fetch('/api/countries')
            .then(handleJson)
            .then(function (data) {
                if (data && data.mapCountries) {
                    populateSelect(countrySelect, data.mapCountries, true);
                }
            })
            .catch(function () {
                // Ignore errors, select will remain empty
            });
    }

    function handleJson(response) {
        if (!response.ok) {
            return response.json().then(function (body) {
                const message = body && body.message ? body.message : 'Unexpected error';
                throw new Error(message);
            });
        }
        return response.json();
    }

    function validateHeadquarter() {
        if (!headquarterInput.value) {
            show(branchMessage);
            return false;
        }
        hide(branchMessage);
        return true;
    }

    function validateInstitution() {
        const message = document.getElementById('msg_institution');
        if (headquarterInput.value === 'No' && !institutionSelect.value) {
            show(message);
            return false;
        }
        hide(message);
        return true;
    }

    function validateAcronym() {
        const message = document.getElementById('msg_acronym');
        const value = acronymInput.value.trim();
        if (value.length > 10) {
            show(message);
            return false;
        }
        hide(message);
        return true;
    }

    function validateName() {
        const message = document.getElementById('msg_name');
        const value = nameInput.value.trim();
        if (value.length === 0 || value.split(/\s+/).length > 10) {
            show(message);
            return false;
        }
        hide(message);
        return true;
    }

    function validateType() {
        const message = document.getElementById('msg_type');
        if (!typeSelect.value) {
            show(message);
            return false;
        }
        hide(message);
        return true;
    }

    function validateCountry() {
        const message = document.getElementById('msg_country');
        if (!countrySelect.value) {
            show(message);
            return false;
        }
        hide(message);
        return true;
    }

    function validateCity() {
        const message = document.getElementById('msg_city');
        const value = cityInput.value.trim();
        if (value.length === 0) {
            show(message);
            return false;
        }
        hide(message);
        return true;
    }

    function validateWebsite() {
        const message = document.getElementById('msg_website');
        const value = websiteInput.value.trim();
        if (value.length > 0 && !/^https?:\/\/.+/i.test(value)) {
            show(message);
            return false;
        }
        hide(message);
        return true;
    }

    function registerValidationHandlers() {
        institutionSelect.addEventListener('change', validateInstitution);
        acronymInput.addEventListener('change', validateAcronym);
        nameInput.addEventListener('change', validateName);
        typeSelect.addEventListener('change', validateType);
        countrySelect.addEventListener('change', validateCountry);
        cityInput.addEventListener('change', validateCity);
        websiteInput.addEventListener('change', validateWebsite);
    }

    document.getElementById('buttonOK').addEventListener('click', function (event) {
        event.preventDefault();
        setBranchButtons(true);
    });

    document.getElementById('buttonKO').addEventListener('click', function (event) {
        event.preventDefault();
        setBranchButtons(false);
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        toggleAlert(null);

        if (!validateHeadquarter()) {
            return;
        }
        if (headquarterInput.value === 'No' && !validateInstitution()) {
            return;
        }
        if (!validateAcronym() || !validateName() || !validateType() || !validateCountry() || !validateCity() || !validateWebsite()) {
            return;
        }

        const payload = {
            headquarter: headquarterInput.value,
            institution: institutionSelect.value,
            acronym: acronymInput.value.trim(),
            name: nameInput.value.trim(),
            type: typeSelect.value,
            country: countrySelect.value,
            city: cityInput.value.trim(),
            website: websiteInput.value.trim()
        };

        fetch('/api/requests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then(function (response) {
            if (response.status === 201) {
                window.location.href = '/listrequest';
                return null;
            }
            return response.json().then(function (body) {
                const message = body && body.message ? body.message : 'Error saving request';
                throw new Error(message);
            });
        }).catch(function (error) {
            toggleAlert(error.message);
        });
    });

    registerValidationHandlers();
    fetchInstitutions();
    fetchCountries();
})();
