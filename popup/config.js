/**
 * Zoom web UI helper settings page
 * 
 * TODO: clean up some JS nastiness
 */

function saveOptions() {
    browser.storage.sync.set({
        enabled: document.getElementById("toggleExtension").checked
    });

    // Refresh UI
    refresh();
}

function refresh() {
    const toggleButt = document.getElementById("toggleExtension");
    const disabledText = document.getElementById("extDisabled");
    const enabledText = document.getElementById("extEnabled");

    if (toggleButt.checked) {
        enabledText.style.display = "block";
        disabledText.style.display = "none";
    } else {
        enabledText.style.display = "none";
        disabledText.style.display = "block";
    }
}

function restoreSettings() {
    const enabledSettingKey = "enabled";
    const toggleButt = document.getElementById("toggleExtension");

    toggleButt.addEventListener("click", function(event) {
        saveOptions();
    })

    function setEnabled(result) {
        if ('enabled' in result) {
            toggleButt.checked = result["enabled"]
        }

        refresh();
    }

    function onError(err) {
        console.error("Got error");
        console.error(err);
    }

    browser.storage.sync.get(enabledSettingKey)
    .then(setEnabled, onError);
}

document.addEventListener("DOMContentLoaded", restoreSettings);
document.querySelector("form").addEventListener("submit", saveOptions);