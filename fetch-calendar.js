// Fetch and parse iCal data from Google Calendar
// This runs in GitHub Actions to avoid CORS issues

const https = require('https');
const fs = require('fs');

const icalUrl = process.env.ICAL_URL;

if (!icalUrl) {
    console.error('ICAL_URL environment variable not set');
    process.exit(1);
}

// Fetch the iCal data
https.get(icalUrl, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const events = parseICalendar(data);
            const output = {
                updated: new Date().toISOString(),
                events: events
            };

            fs.writeFileSync('calendar.json', JSON.stringify(output, null, 2));
            console.log(`Parsed ${events.length} events`);
        } catch (error) {
            console.error('Error parsing calendar:', error);
            process.exit(1);
        }
    });
}).on('error', (error) => {
    console.error('Error fetching calendar:', error);
    process.exit(1);
});

// Simple iCal parser for VEVENT
function parseICalendar(icalText) {
    const events = [];
    const lines = icalText.split(/\r?\n/);
    let currentEvent = null;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();

        // Handle line folding (lines starting with space/tab)
        while (i + 1 < lines.length && /^[ \t]/.test(lines[i + 1])) {
            i++;
            line += lines[i].trim();
        }

        if (line === 'BEGIN:VEVENT') {
            currentEvent = {};
        } else if (line === 'END:VEVENT' && currentEvent) {
            if (currentEvent.summary && currentEvent.dtstart) {
                events.push(currentEvent);
            }
            currentEvent = null;
        } else if (currentEvent) {
            const colonIndex = line.indexOf(':');
            if (colonIndex > 0) {
                const key = line.substring(0, colonIndex);
                const value = line.substring(colonIndex + 1);

                // Handle DTSTART
                if (key.startsWith('DTSTART')) {
                    currentEvent.dtstart = parseICalDate(value);
                } else if (key.startsWith('DTEND')) {
                    currentEvent.dtend = parseICalDate(value);
                } else if (key === 'SUMMARY') {
                    currentEvent.summary = value;
                }
            }
        }
    }

    return events;
}

function parseICalDate(dateStr) {
    // Handle both DATE (YYYYMMDD) and DATETIME (YYYYMMDDTHHmmss) formats
    dateStr = dateStr.replace(/[TZ]/g, '');

    if (dateStr.length >= 8) {
        const year = parseInt(dateStr.substring(0, 4));
        const month = parseInt(dateStr.substring(4, 6)) - 1;
        const day = parseInt(dateStr.substring(6, 8));
        const date = new Date(year, month, day);
        return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
    }
    return null;
}
