# Dr.Assist · ตรวจสุขภาพปีใหม่ 2570 (Web App ต้นแบบ)

Web App 7 หน้าจอ ออกแบบสำหรับผู้สูงอายุ เป็นเว็บแบบ static ไม่ต้อง build

## การใช้งาน
- เปิดโดเมนหลัก `/` จะเข้า Web App ที่หน้าแรก (`/screens/Main.html`) ทันที
- มือถือ: เต็มจอเหมือนแอป · แท็บเล็ตและคอมพิวเตอร์: คอลัมน์แอปกว้าง 600px ตรงกลางจอ
- ติดตั้งเป็นแอปได้: Safari → แชร์ → "เพิ่มไปยังหน้าจอโฮม" / Chrome → "ติดตั้งแอป"
- หน้าภาพรวมสำหรับนำเสนอ: `/overview.html`
- ดูในกรอบ iPhone สำหรับนำเสนอ: เติม `?view=frame` ต่อท้ายลิงก์หน้าจอ

## โครงสร้าง
- `index.html` ส่งต่อไปหน้าแรกของแอป
- `overview.html` ภาพรวม 7 หน้าจอ
- `screens/*.html` หน้าจอแต่ละขั้น (Main → Register → Hospital → Confirm → Checkin → Results → Followup)
- `assets/dc-lite.js` ตัวแสดงผลหน้าจอและปุ่มที่กดได้
- `assets/screen.css` เลย์เอาต์ Web App และโหมดกรอบ iPhone
- `manifest.webmanifest`, `assets/icon-*.png` สำหรับติดตั้งเป็นแอป

## Deploy บน Vercel
1. อัปโหลดทั้งโฟลเดอร์ขึ้น GitHub repository
2. ที่ vercel.com เลือก Add New → Project → Import repository นั้น
3. Framework Preset เลือก **Other** ไม่ต้องตั้ง Build Command และ Output Directory
4. กด Deploy

ข้อมูลผู้ป่วย ค่าผลตรวจ โรงพยาบาล และ QR เป็นข้อมูลตัวอย่าง ใช้งานจริงไม่ได้
