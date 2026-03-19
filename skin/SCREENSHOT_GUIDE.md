# Screenshot Capture Guide

## How to Capture Clean Screenshots for README Images (10-15)

### Quick Steps:

1. **Open the helper file**
   - Double-click `screenshot_helper.html` in your project folder
   - OR right-click → Open with → Your Browser

2. **Capture Screenshots**
   - Click "Hide Controls (Start Capturing)" button
   - The page will show Section 1 (Landing Page)
   - Press `Win + Shift + S` (Windows) or use Snipping Tool
   - Capture the entire visible section
   - Save as `10.png`

3. **Navigate to Next Section**
   - Press `H` key to show controls again
   - Click button for next section (e.g., "Go to Section 2")
   - Click "Hide Controls" again
   - Take screenshot
   - Save as `11.png`

4. **Repeat for all 6 sections:**
   - Section 1 → Save as `10.png`
   - Section 2 → Save as `11.png`
   - Section 3 → Save as `12.png`
   - Section 4 → Save as `13.png`
   - Section 5 → Save as `14.png`
   - Section 6 → Save as `15.png`

5. **Replace old images**
   - Go to `readme_images` folder
   - Replace the old 10.png, 11.png, 12.png, 13.png, 14.png, 15.png with your new screenshots

### Tips:
- Use F11 for fullscreen mode (cleaner screenshots)
- Make sure your browser window is maximized
- Press ESC to exit fullscreen after capturing
- Press 'H' key anytime to toggle the control panel

### Alternative Method (Manual):
If you prefer, you can also:
1. Open http://localhost:5000
2. Open browser DevTools (F12)
3. In Console, type: `document.querySelector('.navbar').style.display = 'none'`
4. Scroll to each section and take screenshots
5. To show navbar again: `document.querySelector('.navbar').style.display = 'flex'`

---

All screenshots should be **without the navigation bar** at the top, showing only the pure section content.
