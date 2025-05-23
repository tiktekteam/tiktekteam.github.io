# פלטפורמת סימולציות (Simulation Platform)

פלטפורמת סימולציות היא אתר אינטרנטי המציג סימולציות אינטראקטיביות בתחומי מתמטיקה ומדעים. האתר מיועד לתלמידים, מורים וכל מי שמעוניין ללמוד באמצעות הדגמות ויזואליות.

Simulation Platform is a web-based platform that hosts interactive simulations in mathematics and science. The site is designed for students, teachers, and anyone interested in learning through visual demonstrations.

## תכונות (Features)

- **עיצוב רספונסיבי**: האתר מותאם לשימוש במחשבים, טאבלטים וטלפונים ניידים
- **תמיכה בשפה העברית**: ממשק משתמש מלא בעברית עם תמיכה בכיוון RTL
- **עבודה במצב לא מקוון**: באמצעות Service Worker, האתר יכול לעבוד גם ללא חיבור לאינטרנט
- **התעדכנות אוטומטית**: האתר מתעדכן אוטומטית כאשר סימולציות חדשות נוספות

- **Responsive Design**: The site is optimized for computers, tablets, and mobile phones
- **Hebrew Language Support**: Full Hebrew user interface with RTL support
- **Offline Functionality**: Using Service Worker, the site can work without an internet connection
- **Automatic Updates**: The site automatically updates when new simulations are added

## סימולציות זמינות (Available Simulations)

1. **פרבולה פוגשת ישרים שונים**: הדגמה גרפית של פתרון משוואות ריבועיות באמצעות מציאת נקודות חיתוך
2. **חיסור במספר שלילי**: הדגמה ויזואלית של חיסור מספרים שליליים על ציר המספרים

1. **Parabola Meets Different Lines**: Graphical demonstration of solving quadratic equations by finding intersection points
2. **Subtracting Negative Numbers**: Visual demonstration of subtracting negative numbers on a number line

## שימוש (Usage)

1. פתח את האתר בדפדפן
2. בחר סימולציה מהרשימה
3. עקוב אחר ההוראות המוצגות בסימולציה

1. Open the website in a browser
2. Choose a simulation from the list
3. Follow the instructions displayed in the simulation

## טכנולוגיות (Technologies)

- HTML5
- CSS3
- JavaScript
- Service Worker API
- Chart.js (לסימולציות גרפיות)

## פיתוח והוספת סימולציות חדשות (Development and Adding New Simulations)

להוספת סימולציה חדשה:

1. צור קובץ HTML חדש בתיקיית `simulations`
2. הקובץ צריך להיות עצמאי (standalone) ולכלול את כל הסגנונות והסקריפטים הנדרשים
3. הוסף כותרת מתאימה בתגית `<title>`
4. עדכן את קובץ `simulations.json` והוסף את הסימולציה החדשה לרשימה
5. דחוף את הקבצים למאגר GitHub

To add a new simulation:

1. Create a new HTML file in the `simulations` directory
2. The file should be standalone and include all required styles and scripts
3. Add an appropriate title in the `<title>` tag
4. Update the `simulations.json` file and add the new simulation to the list
5. Push the files to the GitHub repository

### מבנה קובץ ה-JSON (JSON File Structure)

קובץ `simulations.json` מכיל רשימה של כל הסימולציות הזמינות באתר. הוא מאורגן במבנה הבא:

```json
{
  "simulations": [
    {
      "path": "simulations/example.html",
      "title": "כותרת הסימולציה",
      "description": "תיאור קצר של הסימולציה"
    },
    ...
  ]
}
```

The `simulations.json` file contains a list of all available simulations on the site. It is organized in the following structure:

```json
{
  "simulations": [
    {
      "path": "simulations/example.html",
      "title": "Simulation Title",
      "description": "Brief description of the simulation"
    },
    ...
  ]
}
```

כאשר מוסיפים סימולציה חדשה, יש להוסיף אובייקט חדש למערך `simulations` עם המידע הרלוונטי.

When adding a new simulation, add a new object to the `simulations` array with the relevant information.

## רישיון (License)

פרויקט זה הוא קניין בלעדי של צוות TikTek. כל הזכויות שמורות. אין להשתמש, להעתיק, לשנות או להפיץ את התוכנה ללא אישור מפורש בכתב. ראה קובץ [LICENSE](LICENSE) לפרטים נוספים.

This project is the exclusive property of TikTek Team. All rights reserved. No use, copying, modification, or distribution is permitted without explicit written permission. See the [LICENSE](LICENSE) file for more details.
