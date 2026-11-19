# ตรวจสุขภาพปีใหม่ 2570 · Dr.Assist (ต้นแบบ)

หน้าจอมือถือ 7 ช่วงประสบการณ์ ออกแบบสำหรับผู้สูงอายุ เว็บแบบ static ไม่ต้อง build

## โครงสร้าง
- `index.html` หน้าภาพรวม 7 หน้าจอ
- `screens/*.html` หน้าจอแต่ละขั้น (Main → Register → Hospital → Confirm → Checkin → Results → Followup)
- `assets/dc-lite.js` ตัวแสดงผลหน้าจอและปุ่มที่กดได้
- `assets/screen.css` กรอบ iPhone (Mockup) ที่ย่อขยายตามจอ

## การแสดงผล
- ทุกอุปกรณ์แสดงในกรอบ iPhone 17 (Mockup) ย่อขยายตามจอ พร้อมแถบเลือกขั้น 1–7 ด้านล่าง
- จอเตี้ย เช่น มือถือแนวนอน: กรอบพอดีความกว้าง แล้วเลื่อนหน้าลงดูได้
- ต้องการเต็มจอแบบแอปจริง เติม `?view=app` ต่อท้ายลิงก์

## Deploy บน Vercel
1. อัปโหลดทั้งโฟลเดอร์ขึ้น GitHub repository ใหม่
2. ที่ vercel.com เลือก Add New → Project → Import repository นั้น
3. Framework Preset เลือก **Other** ไม่ต้องตั้ง Build Command และ Output Directory
4. กด Deploy

ข้อมูลผู้ป่วย ค่าผลตรวจ โรงพยาบาล และ QR เป็นข้อมูลตัวอย่าง ใช้งานจริงไม่ได้
