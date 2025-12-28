# Kids Calendar

A single-file HTML calendar viewer that displays Google Calendar events filtered by name and color-coded. Uses GitHub Actions to automatically sync calendar data every hour while keeping your calendar fully private.

## What it does

- Automatically fetches events from your Google Calendar (via private iCal URL)
- Filters for events titled "b kids" (blue) or "s kids" (green)
- Displays a monthly calendar grid with colored days
- Updates automatically every hour via GitHub Actions

## Setup

### 1. Get your Google Calendar iCal URL

1. Open [Google Calendar](https://calendar.google.com)
2. Click the three dots next to your calendar → Settings and sharing
3. Scroll down to "Integrate calendar"
4. Copy the **Secret address in iCal format** URL (looks like `https://calendar.google.com/calendar/ical/.../basic.ics`)

### 2. Create GitHub Repository

1. Create a new repository on GitHub (can be private or public)
2. Push this code to the repository:
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

### 3. Add iCal URL to GitHub Secrets

1. Go to your repo on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `ICAL_URL`
5. Value: Paste your iCal URL from step 1
6. Click **Add secret**

### 4. Enable GitHub Pages

1. Go to **Settings** → **Pages**
2. Under "Source", select **Deploy from a branch**
3. Select branch: **main**, folder: **/ (root)**
4. Click **Save**

### 5. Trigger First Run

1. Go to **Actions** tab
2. Click on "Update Calendar Data" workflow
3. Click **Run workflow** → **Run workflow**
4. Wait for it to complete (creates `calendar.json`)

### 6. Visit Your Calendar

After the action completes, visit:
```
https://YOUR_USERNAME.github.io/YOUR_REPO/
```

Bookmark this URL for easy access!

## How It Works

1. **GitHub Action** runs every hour (and on every push)
2. Fetches your calendar data using the secret iCal URL
3. Parses events and saves them to `calendar.json`
4. Commits the updated JSON back to the repo
5. GitHub Pages serves the updated calendar

## Usage

- **Navigate months**: Use the ← Previous / Next → buttons
- **Auto-updates**: Calendar data refreshes every hour automatically
- **Manual refresh**: Go to Actions tab and manually run the workflow for immediate updates

## Privacy & Security

- ✅ **Calendar stays private** - Your iCal URL is stored securely in GitHub Secrets
- ✅ **No browser CORS issues** - Fetching happens server-side in GitHub Actions
- ✅ **Fully automated** - No manual downloads or updates needed
- ⚠️  **calendar.json is public** - If using a public repo, the parsed event data (titles and dates) will be visible in the repo

## Customization

To modify which events are displayed or their colors, edit the `getEventType()` function in `index.html`:

```javascript
function getEventType(summary) {
    const lower = summary.toLowerCase().trim();
    if (lower === 'b kids') return 'b-kids';
    if (lower === 's kids') return 's-kids';
    return null;
}
```

To change colors, edit the CSS:

```css
.day-cell.b-kids {
    background: #5B7FC6;  /* Change this color */
}

.day-cell.s-kids {
    background: #7EAE5B;  /* Change this color */
}
```
