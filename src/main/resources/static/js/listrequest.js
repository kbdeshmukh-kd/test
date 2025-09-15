(function () {
    const tableBody = document.querySelector('#requestsTable tbody');
    const messageBox = document.getElementById('messageBox');

    function showMessage(text, type) {
        if (!text) {
            messageBox.style.display = 'none';
            messageBox.textContent = '';
            messageBox.className = 'alert';
            return;
        }
        messageBox.textContent = text;
        messageBox.className = 'alert ' + type;
        messageBox.style.display = 'block';
    }

    function populateTable(requests) {
        tableBody.innerHTML = '';
        requests.forEach(function (request) {
            const row = document.createElement('tr');
            row.innerHTML =
                '<td>' + (request.headquarter || '') + '</td>' +
                '<td>' + (request.acronym || '') + '</td>' +
                '<td>' + (request.name || '') + '</td>' +
                '<td>' + (request.city || '') + '</td>' +
                '<td>' + (request.country || '') + '</td>';
            tableBody.appendChild(row);
        });
    }

    fetch('/api/requests')
        .then(function (response) {
            if (!response.ok) {
                return response.json().then(function (body) {
                    const message = body && body.message ? body.message : 'Unable to load requests';
                    throw new Error(message);
                });
            }
            return response.json();
        })
        .then(function (data) {
            const requests = data && Array.isArray(data.listRequest) ? data.listRequest : [];
            if (requests.length === 0) {
                showMessage('There are no stored institutions yet.', 'alert-info');
            } else {
                showMessage(null);
                populateTable(requests);
            }
        })
        .catch(function (error) {
            showMessage(error.message, 'alert-danger');
        });
})();
