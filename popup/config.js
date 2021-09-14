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
    refreshSettings();
}

function refreshSettings() {
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
    const refreshButt = document.getElementById("refreshButt");
    const refreshContainer = document.getElementById("refresh");

    refreshButt.addEventListener("click", function(event) {
        const tab = browser.tabs.getCurrent();
        browser.tabs.reload(tab.id);
        refreshContainer.style.display = "hidden";
    })

    toggleButt.addEventListener("click", function(event) {
        saveOptions();

        // On change, we want to show the refresh form to notify users they can refresh to trigger the ext
        refreshContainer.style.display = "block";
    })

    function setEnabled(result) {
        if ('enabled' in result) {
            toggleButt.checked = result["enabled"]
        }

        refreshSettings();
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