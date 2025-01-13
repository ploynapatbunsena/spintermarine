/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // สำหรับไฟล์ HTML หลัก
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js" 
  ],
  // ใช้เพิ่มค่าที่ต้องการขยาย เช่น สี, ฟอนต์, หรือขนาด
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide"),
    require('flowbite/plugin')
  ],
}

