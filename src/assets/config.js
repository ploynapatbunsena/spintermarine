export const color = {
  primary: "#007BFF", // Login & Save button , Standby/Maintenance
  dark_blue: "#080F25", // bg side & nav bar
  blue: "#223368", // search button
  white: "#FFFFFF",
  background: "#F7F9FC",
  dark_red: "#E62020", // clear & cancel button
  light_red: "#FFDADA", // bg_danger
  red: "#DC2B2B", // danger
  yellow: "#FAC12A", // warning
  light_green: "#8DEB51", // Running/Maintenance
  dark_green: "#28A745", // Running
  gray: "#9F9F9F", // Offline
  dark_gray: "#4B4B4B",
  light_gray: "#F4F4F4",
  black: "#000000", // Maintenance, Down
  sky: "#00B8F2", //Standby
  light_sky: "#EAF4FF",
  dark_sky: "#2297F2",
  soline_tank: "linear-gradient(90deg, #FEE114 0%, #FFF6DE 100%);",
  bg_soline: "#F0F0F0",
  border_gen: "#D6E6F2",
  neutral_300: "#E9EAF3",

  // Generator
  bg_green: "#E5FFEA",
  symbol_green: "#13A570",
  bg_blue: "#E2F3FF",
  symbol_blue: "#1570EF",
  bg_sky: "#DBE7FF",
  symbol_sky: "#2D94FB",
  bg_purple: "#ECE9FF",
  symbol_purple: "#AF52DE",
  bg_yellow: "#FFF9CE",
  symbol_yellow: "#FFBA03",
  bg_lightsky: "#E8F9FF",
  symbol_lightsky: "#01C2FF",
  bg_mint: "#DFFFE7",
  symbol_mint: "#00C7BE",
  bg_red: "#FFD5D5",
  symbol_red: "#DC2B2B",
  bg_wind: "#96D2FF",

  // Gen Image
  bg_gen: "#073E28",
  text_gen: "#64DD17",

  // Status in Table
  bg_running: "#CDF3E1",
  text_running: "#14CA74",
  bg_warning: "#FFF5AD",
  text_warning: "#FFBF14",
  bg_danger: "#FFCCCC",
  bg_standby: "#BCEFFF",
  text_standby: "#00A9DF",
  bg_s_m: "#C6DEFF",
  text_s_m: "#1570EF",

  bg_edit: "#E3F2FD",
  text_edit: "#1570EF",

  // Row color
  bg_row: "#F9F9FA",
  stroke: "#F4F4F5",

  // Tugboat
  normal_tugboat: "#009688",
  bg_light_tugboat: "#E7F1FF",
  text_light_tugboat: "#2563EB",
  bg_heavy_tugboat: "#FFFAE6",
  text_heavy_tugboat: "#FAAA2A",
}

import barge_icon from "../assets/Icons/barg_icon_menu.svg";

const menubar = [
  {
    title: "Barge",
    icon: barge_icon,
    data: [
      {
        name: "Supharat",
        device: [
          "Gen No.106 CUMMINS K 38 M 1310KVA",
          "Gen No.107 CUMMINS K 38-D(M1) 1310KVA",
          "Gen No.104 CUMMINS - KTA38 1000KVA",
          "Gen No.127 WEICHAI 6M21G385 400KVA",
          "Gen No.124 YUCHAI 380KVA",
          "Gen No.134 YUCHAI 100KVA",
          "Gen No.150 YUCHAI 100KVA",
          "Gen No.119 WEICHAI 37KVA",
          "Gen No.120 WEICHAI 37KVA"
        ],
      },
      {
        name: "Ladawan",
        device: [
          "Gen No.125 CUMMINS K 50 1500KVA",
          "Gen No.108 CUMMINS K 38-D(M1) 1300KVA",
          "Gen No.53 CAT3412 850KVA",
          "Gen No.153 YUCHAI375 375KVA",
          "Gen No.154 YUCHAI375 375KVA",
          "Gen No.136 YUCHAI 100KVA",
          "Gen No.151 YUCHAI 100KVA",
          "Gen No.137 YUCHAI 38KVA",
          "Gen No.111 WEICHAI 37KVA",
        ],
      },
      {
        name: "Kaentawan",
        device: [
          "Gen No.99 CUMMINS - KTA38 900KVA",
          "Gen No.51 CAT3412 STA 850KVA",
          "Gen No.52 CAT3412 STA 850KVA",
          "Gen No.91 CUMMINS NTA855 470KVA",
          "Gen No.92 CUMMINS BIGCAM 470KVA",
          "Gen No.135 YUCHAI 100KVA",
          "Gen No.148 YUCHAI 100KVA",
          "Gen No.117 WEICHAI 37KVA",
          "Gen No.118 WEICHAI 37KVA",
        ]
      },
      {
        name: "Thongarun",
        device: [
          "Gen No.139 YUCHAI 1500KVA",
          "Gen No.140 WEICHAI 1500KVA",
          "Gen No.141 YUCHAI 1000KVA",
          "Gen No.142 CUMMINS 1000 KVA",
          "Gen No.143 YUCHAI 450 KVA",
          "Gen No.144 YUCHAI 450KVA",
          "Gen No.131 YUCHAI 100KVA",
          "Gen No.152 YUCHAI 100KVA",
          "Gen No.145 WEICHAI 40KVA",
          "Gen No.146 WEICHAI 40KVA",
        ]
      },
      {
        name: "Karaked",
        device: [
          "Gen No.128 CUMMINS K 50 1500KVA",
          "Gen No.67 CAT3412 STA 850KVA",
          "Gen No.69 CAT3412 STA 850KVA",
          "Gen No.70 CAT3412 STA 850KVA",
          "Gen No.109 YUCHAI 400KVA",
          "Gen No.123 YUCHAI 400KVA",
          "Gen No.132 YUCHAI 100KVA",
          "Gen No.147 YUCHAI 100KVA",
          "Gen No.115 WEICHAI 37KVA",
          "Gen No.116 WEICHAI 37KVA",
        ]
      },
      {
        name: "Chamchuri",
        device: [
          "Gen No.32 CAT3412 850KVA",
          "Gen No.16 CUMMIN K19 550KVA",
          "Gen No.29 CAT3306B 350KVA",
          "Gen No.129 YUCHAI 100KVA",
          "Gen No.130 WEICHAI 100KVA",
          "Gen No.112 WEICHAI 37KVA",
          "Gen No.113 WEICHAI 37KVA",
          "Gen No.114 WEICHAI 37KVA",
        ]
      },
      {
        name: "Bunga",
        device: [
          "Gen No.102 CUMMINS - KTA38 1310KVA",
          "Gen No.103 CUMMINS - KTA38 1310KVA",
          "Gen No.105 CUMMINS - KTA38 1000KVA",
          "Gen No.68 CAT3412STA 850KVA",
          "Gen No.34 CUMMINK19 550KVA",
          "Gen No.110 YUCHAI 380KVA",
          "Gen No.133 YUCHAI 100KVA",
          "Gen No.149 YUCHAI 100KVA",
          "Gen No.121 WEICHAI 37KVA",
          "Gen No.122 WEICHAI 37KVA",
        ]
      }
    ],
  },
  {
    title: "Tugboat",
    data: [
      {
        category: "River Going",
        device: [
          "Ketsarin01",
          "Ketsarin02",
          "Ketsarin04",
          "Ketsarin05",
          "Ketsarin06",
          "Ketsarin08",
          "Ketsarin10",
          "Ketsarin11",
          "Ketsarin17",
          "Ketsarin18",
        ]
      },
      {
        category: "Sea Going",
        device: [
          "Ketsarin09",
          "Ketsarin12",
          "Ketsarin13",
          "Ketsarin14",
          "Ketsarin15",
          "Ketsarin16",
          "Watthana01",
          "Watthana02",
          "Watthana03",
          "Watthana04",
          "Watthana05",
          "Watthana06",
          "Watthana07",
          "Watthana10",
          "Buachompoo",
        ]
      }
    ]
  },
  {
    title: "Report",
    name: [
      "Notification Report",
      "Report Chart Historical",
      "Report on RPM and Speed and %Throttle Affected by Wind Speed of Tugboat",
      "Report on Tugboats Encountering Storms",
      "Report on Fuel Rate per RPM for Evaluating Engine Efficiency of Motor Barge",
      "Report on %Throttle vs. RPM vs. Fuel Rate",
      "Report on Daily Fuel Consumption for the Barge",
      "Report on Barge Tilt ",
    ]
  },
  {
    title: "GPS Tracker",
  },
  {
    title: "Management"
  }
];

module.exports = {
  menubar,
  color
}