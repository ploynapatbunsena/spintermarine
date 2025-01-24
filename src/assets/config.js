export const color = {
  primary: "#007BFF", // Login & Save button , Standby/Maintenance
  dark_blue: "#080F25", // bg side & nav bar
  light_blue: "#223368", // search button
  blue: "#20263A",
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
import tugboat_icon from "../assets/Icons/direction_boat.svg";
import gps_icon from "../assets/Icons/location.svg";
import report_icon from "../assets/Icons/document.svg";
import management_icon from "../assets/Icons/manage_account.svg"

export const navigation_items = [
  {
    id: "barge",
    title: "Barge",
    icon: barge_icon,
    data: [
      {
        id: "supharat",
        title: "Supharat",
        icon: 'mdi-account',
        items: [
          { id: 'gen-106', title: 'Gen No.106 CUMMINS K 38 M' },
          { id: 'gen-107', title: 'Gen No.107 CUMMINS K 38 M' },
          { id: 'gen-104', title: 'Gen No.104 CUMMINS KTA38' },
          { id: 'gen-127', title: 'Gen No.127 WEICHAI BM21G385' },
          { id: 'gen-124', title: 'Gen No.124 YUCHAI 380KVA' },
          { id: 'gen-109', title: 'Gen No.109 YUCHAI 100KVA' },
          { id: 'gen-130', title: 'Gen No.130 YUCHAI 100KVA' },
          { id: 'gen-119', title: 'Gen No.119 WEICHAI 37KVA' },
          { id: 'gen-120', title: 'Gen No.120 WEICHAI 37KVA' }
        ]
      },
      {
        id: "ladawan",
        title: "Ladawan",
        icon: barge_icon,
        items: [
          { id: 'gen-125', title: 'Gen No.125 CUMMINS K 50' },
          { id: 'gen-108', title: 'Gen No.108 CUMMINS K 38 DMT)' },
          { id: 'gen-53', title: 'Gen No.53 CAT3412 850KVA' },
          { id: 'gen-153', title: 'Gen No.153 YUCHAI375 375KVA' },
          { id: 'gen-154', title: 'Gen No.154 YUCHAI375 375KVA' },
          { id: 'gen-136', title: 'Gen No.136 YUCHAI 100KVA' },
          { id: 'gen-110', title: 'Gen No.110 YUCHAI 100KVA' },
          { id: 'gen-137', title: 'Gen No.137 YUCHAI 38KVA' },
          { id: 'gen-111', title: 'Gen No.111 WEICHAI 37KVA' }
        ]
      },
      {
        id: "kaentawan",
        title: "Kaentawan",
        icon: barge_icon,
        items: [
          { id: "gen-99", title: "Gen No.99 CUMMINS - KTA38 900KVA" },
          { id: "gen-51", title: "Gen No.51 CAT3412 STA 850KVA" },
          { id: "gen-52", title: "Gen No.52 CAT3412 STA 850KVA" },
          { id: "gen-91", title: "Gen No.91 CUMMINS NTA855 470KVA" },
          { id: "gen-92", title: "Gen No.92 CUMMINS BIGCAM 470KVA" },
          { id: "gen-135", title: "Gen No.135 YUCHAI 100KVA" },
          { id: "gen-148", title: "Gen No.148 YUCHAI 100KVA" },
          { id: "gen-117", title: "Gen No.117 WEICHAI 37KVA" },
          { id: "gen-118", title: "Gen No.118 WEICHAI 37KVA" }
        ]
      },
      {
        id: "thongarun",
        title: "Thongarun",
        icon: barge_icon,
        items: [
          { id: "gen-139", title: "Gen No.139 YUCHAI 1500KVA" },
          { id: "gen-140", title: "Gen No.140 WEICHAI 1500KVA" },
          { id: "gen-141", title: "Gen No.141 YUCHAI 1000KVA" },
          { id: "gen-142", title: "Gen No.142 CUMMINS 1000 KVA" },
          { id: "gen-143", title: "Gen No.143 YUCHAI 450 KVA" },
          { id: "gen-144", title: "Gen No.144 YUCHAI 450KVA" },
          { id: "gen-131", title: "Gen No.131 YUCHAI 100KVA" },
          { id: "gen-152", title: "Gen No.152 YUCHAI 100KVA" },
          { id: "gen-145", title: "Gen No.145 WEICHAI 40KVA" },
          { id: "gen-146", title: "Gen No.146 WEICHAI 40KVA" }
        ]
      },
      {
        id: "karaked",
        title: "Karaked",
        icon: barge_icon,
        items: [
          { id: "gen-128", title: "Gen No.128 CUMMINS K 50 1500KVA" },
          { id: "gen-67", title: "Gen No.67 CAT3412 STA 850KVA" },
          { id: "gen-69", title: "Gen No.69 CAT3412 STA 850KVA" },
          { id: "gen-70", title: "Gen No.70 CAT3412 STA 850KVA" },
          { id: "gen-109", title: "Gen No.109 YUCHAI 400KVA" },
          { id: "gen-123", title: "Gen No.123 YUCHAI 400KVA" },
          { id: "gen-132", title: "Gen No.132 YUCHAI 100KVA" },
          { id: "gen-147", title: "Gen No.147 YUCHAI 100KVA" },
          { id: "gen-115", title: "Gen No.115 WEICHAI 37KVA" },
          { id: "gen-116", title: "Gen No.116 WEICHAI 37KVA" }
        ]
      },
      {
        id: "chamchuri",
        title: "Chamchuri",
        icon: barge_icon,
        items: [
          { id: "gen-32", title: "Gen No.32 CAT3412 850KVA" },
          { id: "gen-16", title: "Gen No.16 CUMMIN K19 550KVA" },
          { id: "gen-29", title: "Gen No.29 CAT3306B 350KVA" },
          { id: "gen-129", title: "Gen No.129 YUCHAI 100KVA" },
          { id: "gen-130", title: "Gen No.130 WEICHAI 100KVA" },
          { id: "gen-112", title: "Gen No.112 WEICHAI 37KVA" },
          { id: "gen-113", title: "Gen No.113 WEICHAI 37KVA" },
          { id: "gen-114", title: "Gen No.114 WEICHAI 37KVA" }
        ]
      },
      {
        id: "bunga",
        title: "Bunga",
        icon: barge_icon,
        items: [
          { id: "gen-102", title: "Gen No.102 CUMMINS - KTA38 1310KVA" },
          { id: "gen-103", title: "Gen No.103 CUMMINS - KTA38 1310KVA" },
          { id: "gen-105", title: "Gen No.105 CUMMINS - KTA38 1000KVA" },
          { id: "gen-68", title: "Gen No.68 CAT3412STA 850KVA" },
          { id: "gen-34", title: "Gen No.34 CUMMINK19 550KVA" },
          { id: "gen-110", title: "Gen No.110 YUCHAI 380KVA" },
          { id: "gen-133", title: "Gen No.133 YUCHAI 100KVA" },
          { id: "gen-149", title: "Gen No.149 YUCHAI 100KVA" },
          { id: "gen-121", title: "Gen No.121 WEICHAI 37KVA" },
          { id: "gen-122", title: "Gen No.122 WEICHAI 37KVA" }
        ]
      }
    ]
  },
  {
    id: "tugboat",
    title: "Tugboat",
    icon: tugboat_icon,
    data: [
      {
        id: "river-going",
        title: "River Going",
        icon: tugboat_icon,
        items: [
          { id: "ketsarin01", title: "Ketsarin01" },
          { id: "ketsarin02", title: "Ketsarin02" },
          { id: "ketsarin04", title: "Ketsarin04" },
          { id: "ketsarin05", title: "Ketsarin05" },
          { id: "ketsarin06", title: "Ketsarin06" },
          { id: "ketsarin08", title: "Ketsarin08" },
          { id: "ketsarin10", title: "Ketsarin10" },
          { id: "ketsarin11", title: "Ketsarin11" },
          { id: "ketsarin17", title: "Ketsarin17" },
          { id: "ketsarin18", title: "Ketsarin18" }
        ]
      },
      {
        id: "sea-going",
        title: "Sea Going",
        icon: tugboat_icon,
        items: [
          { id: "ketsarin09", title: "Ketsarin09" },
          { id: "ketsarin12", title: "Ketsarin12" },
          { id: "ketsarin13", title: "Ketsarin13" },
          { id: "ketsarin14", title: "Ketsarin14" },
          { id: "ketsarin15", title: "Ketsarin15" },
          { id: "ketsarin16", title: "Ketsarin16" },
          { id: "watthana01", title: "Watthana01" },
          { id: "watthana02", title: "Watthana02" },
          { id: "watthana03", title: "Watthana03" },
          { id: "watthana04", title: "Watthana04" },
          { id: "watthana05", title: "Watthana05" },
          { id: "watthana06", title: "Watthana06" },
          { id: "watthana07", title: "Watthana07" },
          { id: "watthana10", title: "Watthana10" },
          { id: "buachompoo", title: "Buachompoo" }
        ]
      }
    ]
  },
  {
    id: "report",
    title: "Report",
    icon: report_icon,
    items: [
      { id: "notification", title: "Notification Report" },
      { id: "historical", title: "Report Chart Historical" },
      { id: "rpm-speed", title: "Report on RPM and Speed and %Throttle Affected by Wind Speed of Tugboat" },
      { id: "storms", title: "Report on Tugboats Encountering Storms" },
      { id: "fuel-rate", title: "Report on Fuel Rate per RPM for Evaluating Engine Efficiency of Motor Barge" },
      { id: "throttle", title: "Report on %Throttle vs. RPM vs. Fuel Rate" },
      { id: "fuel-consumption", title: "Report on Daily Fuel Consumption for the Barge" },
      { id: "barge-tilt", title: "Report on Barge Tilt" }
    ]
  },
  {
    id: "gps-tracker",
    title: "GPS Tracker",
    icon: gps_icon,
  },
  {
    id: "management",
    title: "Management",
    icon: management_icon,
  }
];

export default navigation_items;