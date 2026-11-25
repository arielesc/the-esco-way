# מדידה באתר The Esco Way

שלושת העמודים משתמשים בזרם האינטרנט הקיים של נכס GA4 מספר `565533502` ובמזהה `G-51PRRH8Y3M`. כל מסמך טוען את תג Google פעם אחת. קריאת `config` שולחת את הצפייה הראשונית. כתובת הכניסה נשמרת עם פרמטרי הקמפיין, והקישורים בין העמודים משתמשים בכתובות יחסיות ללא UTM. באתר מקומי הדיווח לשרת GA4 מושבת, ופקודות המדידה עדיין זמינות לבדיקה בדפדפן.

## אירועים

לכל אירוע מצורף `page_type` בערך `home` או `guide`. בדפי המדריכים מצורף גם `guide_id` בערך `japan` או `croatia_slovenia`. בעמוד הבית לחיצה על מדריך נושאת את המזהה של היעד שנבחר.

| אירוע | מתי נשלח | פרמטר נוסף |
|---|---|---|
| `page_view` | בכניסה לכל מסמך | כתובת העמוד והמפנה נאספים על ידי תג Google |
| `guide_card_click` | לחיצה על קישור למדריך בכרטיס בעמוד הבית | `guide_id`, `button_location` |
| `scroll_depth` | כאשר תחתית חלון התצוגה מגיעה ל־25%, 50%, 75% ו־90% מגובה המסמך, פעם אחת לסף בטעינה | `scroll_percentage` |
| `purchase_click` | לחיצה על כפתור שפותח את טופס הרכישה | `button_location` |
| `purchase_modal_open` | כאשר חלון הרכישה עובר מסגור לפתוח | `button_location` |
| `form_start` | בעריכה הראשונה, או בשליחת טופס שמולא מראש, פעם אחת לטופס בטעינה | `button_location` |
| `purchase_lead_submitted` | פעם אחת אחרי תשובת HTTP מוצלחת מ־Formspree | `button_location` |
| `instagram_click` | לחיצה על קישור לאינסטגרם | `button_location` |
| `faq_open` | בעת פתיחת שאלה | `question` |

המיקומים הם `hero`, `middle`, `footer`. הגרסה שומרת גם את שמות הלחיצות הוותיקים המוגדרים בשדה `data-event` ב־HTML. בחישוב לחיצות הרכישה משתמשים ב־`purchase_click` בלבד. פרטי הקשר נשלחים ל־Formspree. המדידה מקבלת רק את מזהה המדריך, מיקום הפעולה ושדות ההקשר המפורטים כאן.

## הגדרות מנהל לפני פרסום

1. בחרו בנכס הקיים. ב־Admin → Data streams בחרו בזרם האינטרנט הקיים, פתחו את גלגל השיניים ליד Enhanced measurement וכבו **Form interactions**. אחרת איסוף אוטומטי עלול לשלוח `form_start` נוסף. תחת Page views → Show advanced settings כבו **Page changes based on browser history events** אם מופעל, כדי שמעבר לעוגן באותו המסמך לא ייספר כעמוד נוסף. אפשר להשאיר את איסוף אירוע `scroll` המובנה ב־90% אם משתמשים בו בדוחות היסטוריים. סננו ל־`scroll_depth` בדוח הספים החדש. [תיעוד Google](https://support.google.com/analytics/answer/9216061)
2. ב־Admin → Data display → Custom definitions → Create custom dimension הגדירו Scope מסוג **Event** ופעם אחת כל אחד מהפרמטרים `guide_id`, `page_type`, `button_location`, `scroll_percentage`. אפשר להוסיף גם `question` כדי להשוות בין שאלות. שמות הפרמטרים רגישים לאותיות גדולות וקטנות. הופעת הנתונים בדוחות יכולה להימשך 24–48 שעות. [תיעוד Google](https://support.google.com/analytics/answer/14240153)
3. ב־Admin → Data display → Events סמנו את הכוכב של `purchase_lead_submitted`. אם טרם התקבל, השתמשו ב־Create event, הזינו את השם המדויק ובחרו Mark as key event. המדד מייצג פנייה להשלמת תשלום. בדיווח הכנסות משתמשים ברישומי תשלום שאושרו בנפרד. [תיעוד Google](https://support.google.com/analytics/answer/13128484)
4. אחרי אישור הפרסום, חברו את Tag Assistant לאתר ובחרו את המכשיר ב־Admin → Data display → DebugView. פתחו את עמוד הבית עם קמפיין בדיקה מזוהה, היכנסו לכל אחד מהמדריכים, גללו קדימה ואחורה, פתחו שאלה ואת הטופס ומלאו אותו. ודאו צפייה אחת לכל מסמך, אירוע אחד לכל סף, התחלה אחת לכל טופס ומזהה מדריך תקין. בתיאום עם בעל הטופס שלחו פנייה מסומנת כבדיקה ואמתו התאמה בין האישור בטופס, הפנייה ב־Formspree ואירוע ההמרה. [תיעוד Google](https://support.google.com/analytics/answer/7201382)

## קריאת התוצאות

- **כניסות ומקורות.** בדוח Landing page הציגו Sessions ו־Total users עם Session source / medium. נתיב הנחיתה מבחין בין כניסה ישירה לעמוד מדריך לבין התחלה בעמוד הבית, גם כשמקור התנועה הוא רשת חברתית.
- **מעבר למדריך.** ב־Explore → Funnel exploration הגדירו שלב ראשון `page_view` עם `page_type=home`, ושלב שני `guide_card_click` עם מזהה המדריך שנבדק. שיעור ההתקדמות מחושב מתוך משתמשי עמוד הבית.
- **עומק ועניין.** השתמשו ב־Total users לכל מדריך וסף, ובחנו את השלבים `page_view` → `purchase_click` → `form_start` → `purchase_lead_submitted`. לשיעור פנייה לכל מדריך חלקו את מספר המשתמשים ששלחו פנייה במספר המשתמשים שצפו באותו מדריך.
- **איכות הפניות.** GA4 מאפשר להשוות את שיעור הפניות לפי מקור. כדי לקבוע אילו פניות הובילו לתשלום נדרש מעקב המשך אחר התוצאה העסקית.
