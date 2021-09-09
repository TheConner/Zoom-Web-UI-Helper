/**
 * Zoom web UI helper content-script
 * 
 * Determines if the current page is a zoom meeting landing page, and passes off to the zoom web client to bypass the bloated desktop app
 */

(() => {

    // Regex for parsing zoom meeting links. This does not handle extracting the password yet
    // Examples:
    // https://zoom.us/j/12345678910
    // |---------------------------|
    //            Group 1
    // |----------------|----------|
    //      Group 2       Group 3
    function getMeetingRegex() {
        // Returns a new global regex object... This is because global regexes are stateful, and should only be used once
        return /(.*zoom.us\/[j,s]\/)(.+?\b)/g;
    }

    /**
     * Determines if the path supplied is a meeting URL
     * @param {URL} path Some URL string, i.e https://zoom.us/j/12345678910
     * @returns true if this is a valid zoom meeting invite, false otherwise
     */
    function isMeetingURL(path) {
        return getMeetingRegex().test(path);
    }

    /**
     * Transforms a given URL into the zoom web client URL
     * @param {URL} path Some URL string, i.e https://zoom.us/j/12345678910
     * @param {UrlSearchparams} search Query string 
     * @returns an augmented URL for use with the zoom web client, such as https://zoom.us/wc/join/1234567890
     */
    function getWebClientMeetingURL(path, search) {
        const meetingPath = /\/[j,s]\//g;

        // Get the patterns that we care about
        let matches = [...path.matchAll(getMeetingRegex())][0];
        console.log(matches);
        
        // Group 2 needs to be augmented to go from /j/ to /wc/join
        matches[1] = matches[1].replace(meetingPath, '/wc/join/');

        // Group 3 appends to group 2, preserve query params
        return matches[1] + matches[2] + search;
    }

    // Determine if we can execute
    function execute() {
        if (isMeetingURL(window.location.href)) {
            // This URL matched our criteria, extract it 
            const newUrl = getWebClientMeetingURL(window.location.href, window.location.search);
            window.location = newUrl;
        }
    }

    
    function restoreSettings() {
        const enabledSettingKey = "enabled";
    
        function setEnabled(result) {
            if (result['enabled'] === true) {
                execute();
            }
        }
    
        function onError(err) {
            console.error("Got error when reading settings");
            console.error(err);
        }

        browser.storage.sync.get(enabledSettingKey)
        .then(setEnabled, onError);
    }

    restoreSettings();

})();