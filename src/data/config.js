export const barges = [
  {
    id: 'Supharat',
    name: 'Supharat',
    nameThai: 'ทุ่นศุภราช',
    image: require('@/assets/Images/overview_barge.jpg'),
    standby: 9,
    running: 4,
    offline: 1,
    maintenance: 3,
    items: [
      { id: 'gen-106', 
        title: 'Gen No.106 CUMMINS K 38 M',
        status: "running-maintenance",
        measurements: {
          a_xis_x: -5,
          a_xis_y: 3,
          oilPressure: 4,
          waterTemperature: 88,
          rpm: 1950,
          battery: 32,
        }
      },
      { id: 'gen-107', 
        title: 'Gen No.107 CUMMINS K 38 M', 
        status: "warning",
        measurements: {
          a_xis_x: -5,
          a_xis_y: 3,
          oilPressure: 6,
          waterTemperature: 88,
          rpm: 1950,
          battery: 32,
        }
       },
      { id: 'gen-104', 
        title: 'Gen No.104 CUMMINS KTA38', 
        status: "danger",
        measurements: {
          a_xis_x: -5,
          a_xis_y: 3,
          oilPressure: 6,
          waterTemperature: 88,
          rpm: 1950,
          battery: 32,
        }
      },
      { id: 'gen-127', 
        title: 'Gen No.127 WEICHAI BM21G385',
        status: "down",
        measurements: {
          a_xis_x: -5,
          a_xis_y: 3,
          oilPressure: 6,
          waterTemperature: 67,
          rpm: 2000,
          battery: 40,
        }
      },
      { id: 'gen-124', 
        title: 'Gen No.124 YUCHAI 380KVA', 
        status: "running",
        measurements: {
          a_xis_x: 0,
          a_xis_y: 0,
          oilPressure: 6,
          waterTemperature: 88,
          rpm: 1000,
          battery: 24,
        }
      },
      { id: 'gen-109', 
        title: 'Gen No.109 YUCHAI 100KVA', 
        status: "standby",
        measurements: {
          a_xis_x: 5,
          a_xis_y: 5,
          oilPressure: 6,
          waterTemperature: 100,
          rpm: 1065,
          battery: 12,
        }
      },
      { id: 'gen-130', 
        title: 'Gen No.130 YUCHAI 100KVA', 
        status: "standby-maintenance",
        measurements: [
          { id: 'axis-x', title: 'Axis - X', value: '0' },
          { id: 'axis-y', title: 'Axis - Y', value: '0' },
          { id: 'oil-pressure', title: 'Oil Pressure', value: '0' },
          { id: 'water-temp', title: 'Water Temperature', values: '0' },
          { id: 'rpm', title: 'RPM', values: '0' },
          { id: 'battery', title: 'battery', values: '0' },
        ]
      },
      { id: 'gen-119', 
        title: 'Gen No.119 WEICHAI 37KVA', 
        status: "warning",
        measurements: [
          { id: 'axis-x', title: 'Axis - X', value: '0' },
          { id: 'axis-y', title: 'Axis - Y', value: '0' },
          { id: 'oil-pressure', title: 'Oil Pressure', value: '0' },
          { id: 'water-temp', title: 'Water Temperature', values: '0' },
          { id: 'rpm', title: 'RPM', values: '0' },
          { id: 'battery', title: 'battery', values: '0' },
        ]
      },
      { id: 'gen-120',
        title: 'Gen No.120 WEICHAI 37KVA',
        status: "running-maintenance",
        measurements: [
          { id: 'axis-x', title: 'Axis - X', value: '0' },
          { id: 'axis-y', title: 'Axis - Y', value: '0' },
          { id: 'oil-pressure', title: 'Oil Pressure', value: '0' },
          { id: 'water-temp', title: 'Water Temperature', values: '0' },
          { id: 'rpm', title: 'RPM', values: '0' },
          { id: 'battery', title: 'battery', values: '0' },
        ]
      }
    ],
    cranes: [
      { id: "crane-01", title: "Crane No. 1", status: "standby" },
      { id: "crane-02", title: "Crane No. 2", status: "running" },
      { id: "crane-03", title: "Crane No. 3", status: "maintenance" },
    ]
  },
  {
    id: 'Ladawan',
    name: 'Ladawan',
    nameThai: 'ทุ่นลดาวัลย์',
    image: require('@/assets/Images/overview_barge.jpg'),
    standby: 9,
    running: 4,
    offline: 1,
    maintenance: 3,
    items: [
      { id: 'gen-125', title: 'Gen No.125 CUMMINS K 50', status: "running-maintenance" },
      { id: 'gen-108', title: 'Gen No.108 CUMMINS K 38 DMT', status: "running-maintenance" },
      { id: 'gen-53', title: 'Gen No.53 CAT3412 850KVA', status: "down" },
      { id: 'gen-153', title: 'Gen No.153 YUCHAI375 375KVA', status: "warning" },
      { id: 'gen-154', title: 'Gen No.154 YUCHAI375 375KVA', status: "standby-maintenance" },
      { id: 'gen-136', title: 'Gen No.136 YUCHAI 100KVA', status: "running-maintenance" },
      { id: 'gen-110', title: 'Gen No.110 YUCHAI 100KVA', status: "running" },
      { id: 'gen-137', title: 'Gen No.137 YUCHAI 38KVA', status: "running" },
      { id: 'gen-111', title: 'Gen No.111 WEICHAI 37KVA', status: "danger" }
    ],
    cranes: [
      { id: "crane-01", title: "Crane No. 1", status: "standby" },
      { id: "crane-02", title: "Crane No. 2", status: "running" },
      { id: "crane-03", title: "Crane No. 3", status: "maintenance" },
    ]
  },
  {
    id: 'Kaentawan',
    name: 'Kaentawan',
    nameThai: 'ทุ่นแก่นตะวัน',
    image: require('@/assets/Images/overview_barge.jpg'),
    standby: 9,
    running: 4,
    offline: 1,
    maintenance: 3,
    items: [
      { id: "gen-99", title: "Gen No.99 CUMMINS - KTA38 900KVA", status: "running-maintenance" },
      { id: "gen-51", title: "Gen No.51 CAT3412 STA 850KVA", status: "warning" },
      { id: "gen-52", title: "Gen No.52 CAT3412 STA 850KVA", status: "danger" },
      { id: "gen-91", title: "Gen No.91 CUMMINS NTA855 470KVA", status: "down" },
      { id: "gen-92", title: "Gen No.92 CUMMINS BIGCAM 470KVA", status: "running" },
      { id: "gen-135", title: "Gen No.135 YUCHAI 100KVA", status: "standby" },
      { id: "gen-148", title: "Gen No.148 YUCHAI 100KVA", status: "standby-maintenance" },
      { id: "gen-117", title: "Gen No.117 WEICHAI 37KVA", status: "warning" },
      { id: "gen-118", title: "Gen No.118 WEICHAI 37KVA", status: "running-maintenance" }
    ],
    cranes: [
      { id: "crane-01", title: "Crane No. 1", status: "standby" },
      { id: "crane-02", title: "Crane No. 2", status: "running" },
      { id: "crane-03", title: "Crane No. 3", status: "maintenance" },
    ]
  },
  {
    id: 'Thongarun',
    name: 'Thongarun',
    nameThai: 'ทุ่นทองอรุณ',
    image: require('@/assets/Images/overview_barge.jpg'),
    standby: 9,
    running: 4,
    offline: 1,
    maintenance: 3,
    items: [
      { id: "gen-139", title: "Gen No.139 YUCHAI 1500KVA", status: "running-maintenance" },
      { id: "gen-140", title: "Gen No.140 WEICHAI 1500KVA", status: "running" },
      { id: "gen-141", title: "Gen No.141 YUCHAI 1000KVA", status: "running" },
      { id: "gen-142", title: "Gen No.142 CUMMINS 1000 KVA", status: "running" },
      { id: "gen-143", title: "Gen No.143 YUCHAI 450 KVA", status: "standby-maintenance" },
      { id: "gen-144", title: "Gen No.144 YUCHAI 450KVA", status: "standby-maintenance" },
      { id: "gen-131", title: "Gen No.131 YUCHAI 100KVA", status: "standby" },
      { id: "gen-152", title: "Gen No.152 YUCHAI 100KVA", status: "danger" },
      { id: "gen-145", title: "Gen No.145 WEICHAI 40KVA", status: "warning" },
      { id: "gen-146", title: "Gen No.146 WEICHAI 40KVA", status: "down" }
    ],
    cranes: [
      { id: "crane-01", title: "Crane No. 1", status: "standby" },
      { id: "crane-02", title: "Crane No. 2", status: "running" },
      { id: "crane-03", title: "Crane No. 3", status: "maintenance" },
    ]
  },
  {
    id: 'Karaket',
    name: 'Karaket',
    nameThai: 'ทุ่นการะเกด',
    image: require('@/assets/Images/overview_barge.jpg'),
    standby: 9,
    running: 4,
    offline: 1,
    maintenance: 3,
    items: [
      { id: "gen-128", title: "Gen No.128 CUMMINS K 50 1500KVA", status: "standby" },
      { id: "gen-67", title: "Gen No.67 CAT3412 STA 850KVA", status: "standby" },
      { id: "gen-69", title: "Gen No.69 CAT3412 STA 850KVA", status: "standby" },
      { id: "gen-70", title: "Gen No.70 CAT3412 STA 850KVA", status: "standby" },
      { id: "gen-109", title: "Gen No.109 YUCHAI 400KVA", status: "standby" },
      { id: "gen-123", title: "Gen No.123 YUCHAI 400KVA", status: "standby" },
      { id: "gen-132", title: "Gen No.132 YUCHAI 100KVA", status: "standby" },
      { id: "gen-147", title: "Gen No.147 YUCHAI 100KVA", status: "standby" },
      { id: "gen-115", title: "Gen No.115 WEICHAI 37KVA", status: "standby" },
      { id: "gen-116", title: "Gen No.116 WEICHAI 37KVA", status: "standby" }
    ],
    cranes: [
      { id: "crane-01", title: "Crane No. 1", status: "standby" },
      { id: "crane-02", title: "Crane No. 2", status: "running" },
      { id: "crane-03", title: "Crane No. 3", status: "maintenance" },
    ]
  },
  {
    id: 'Chamchuri',
    name: 'Chamchuri',
    nameThai: 'ทุ่นจามจุรี',
    image: require('@/assets/Images/overview_barge.jpg'),
    standby: 9,
    running: 4,
    offline: 1,
    maintenance: 3,
    items: [
      { id: "gen-32", title: "Gen No.32 CAT3412 850KVA", status: "standby" },
      { id: "gen-16", title: "Gen No.16 CUMMIN K19 550KVA", status: "running" },
      { id: "gen-29", title: "Gen No.29 CAT3306B 350KVA", status: "running" },
      { id: "gen-129", title: "Gen No.129 YUCHAI 100KVA", status: "running-maintenance" },
      { id: "gen-130", title: "Gen No.130 WEICHAI 100KVA", status: "down" },
      { id: "gen-112", title: "Gen No.112 WEICHAI 37KVA", status: "danger" },
      { id: "gen-113", title: "Gen No.113 WEICHAI 37KVA", status: "warning" },
      { id: "gen-114", title: "Gen No.114 WEICHAI 37KVA", status: "standby-maintenance" }
    ],
    cranes: [
      { id: "crane-01", title: "Crane No. 1", status: "standby" },
      { id: "crane-02", title: "Crane No. 2", status: "running" },
      { id: "crane-03", title: "Crane No. 3", status: "maintenance" },
    ]
  },
  {
    id: 'Bunga',
    name: 'Bunga',
    nameThai: 'ทุ่นบุหงา',
    image: require('@/assets/Images/overview_barge.jpg'),
    standby: 9,
    running: 4,
    offline: 1,
    maintenance: 3,
    items: [
      { id: "gen-102", title: "Gen No.102 CUMMINS - KTA38 1310KVA", status: "standby" },
      { id: "gen-103", title: "Gen No.103 CUMMINS - KTA38 1310KVA", status: "running" },
      { id: "gen-105", title: "Gen No.105 CUMMINS - KTA38 1000KVA", status: "running" },
      { id: "gen-68", title: "Gen No.68 CAT3412STA 850KVA", status: "running-maintenance" },
      { id: "gen-34", title: "Gen No.34 CUMMINK19 550KVA", status: "down" },
      { id: "gen-110", title: "Gen No.110 YUCHAI 380KVA", status: "danger" },
      { id: "gen-133", title: "Gen No.133 YUCHAI 100KVA", status: "danger" },
      { id: "gen-149", title: "Gen No.149 YUCHAI 100KVA", status: "warning" },
      { id: "gen-121", title: "Gen No.121 WEICHAI 37KVA", status: "standby" },
      { id: "gen-122", title: "Gen No.122 WEICHAI 37KVA", status: "standby-maintenance" }
    ],
    cranes: [
      { id: "crane-01", title: "Crane No. 1", status: "standby" },
      { id: "crane-02", title: "Crane No. 2", status: "running" },
      { id: "crane-03", title: "Crane No. 3", status: "maintenance" },
    ]
  }
];

export const tugboats = [
  {
    id: 'ket01',
    name: 'Ketsarin01',
    nameThai: 'เรือ เกศริน01',
    image: require('@/assets/Images/overview_barge.jpg'),
    status: "Running",
    date: "",
    category: "River",
    measurements: {
      oilPressure: 6,
      waterTemperature: 88,
      rpm: 1950,
      windSpeed: 20,
      battery: 32,
    },
    data: [
      {
        bargeName: 'SPI56',
        origin: 'Koh Sichang',
        destination: 'Laem Chabang',
        vessel: 'MV. SMOOTH SEA',
        jobOrder: 'RTM241067-1',
        cargo: 'กากถั่ว',
        eta: '12/01/2568 08:00',
      },
      {
        bargeName: 'SPI56',
        origin: 'Koh Sichang',
        destination: 'Laem Chabang',
        vessel: 'MV. SMOOTH SEA',
        jobOrder: 'RTM241067-1',
        cargo: 'กากถั่ว',
        eta: '12/01/2568 08:00',
      },
      {
        bargeName: 'SPI56',
        origin: 'Koh Sichang',
        destination: 'Laem Chabang',
        vessel: 'MV. VENETIA',
        jobOrder: 'RTM241067-1',
        cargo: 'กากถั่ว',
        eta: '12/01/2568 08:00',
      }
    ]
  },
  {
    id: 'ket02',
    name: 'Ketsarin02',
    nameThai: 'เรือ เกศริน02',
    image: require('@/assets/Images/overview_barge.jpg'),
    status: "Maintenance",
    date: "12/01/2568",
    category: "River",
    measurements: {
      oilPressure: 3.2,
      waterTemperature: 96,
      rpm: 1901,
      windSpeed: 12,
      battery: 22
    },
    data: [
      {
        bargeName: 'SPI56',
        origin: 'Koh Sichang',
        destination: 'Laem Chabang',
        vessel: 'MV. GOLDEN FLAVOR GROUP',
        jobOrder: 'RTM241067-1',
        cargo: 'กากถั่ว',
        eta: '12/01/2568 08:00',
      },
      {
        bargeName: 'SPI56',
        origin: 'Koh Sichang',
        destination: 'Laem Chabang',
        vessel: 'MV. GOLDEN FLAVOR GROUP',
        jobOrder: 'RTM241067-1',
        cargo: 'กากถั่ว',
        eta: '12/01/2568 08:00',
      },
      {
        bargeName: 'SPI56',
        origin: 'Koh Sichang',
        destination: 'Laem Chabang',
        vessel: 'MV. ALIKI FORCE',
        jobOrder: 'RTM241067-1',
        cargo: 'กากถั่ว',
        eta: '12/01/2568 08:00',
      }
    ]
  },
  {
    id: 'ket04',
    name: 'Ketsarin04',
    nameThai: 'เรือ เกศริน04',
    image: require('@/assets/Images/overview_barge.jpg'),
    status: "Pending",
    date: "12/01/2568",
    category: "River",
    measurements: {
      oilPressure: 2.1,
      waterTemperature: 85,
      rpm: 1600,
      windSpeed: 7,
      battery: 26
    },
    data: [
      {
        bargeName: 'SPI56',
        origin: 'Koh Sichang',
        destination: 'Laem Chabang',
        vessel: 'MV. VENETIA',
        jobOrder: 'RTM241067-1',
        cargo: 'กากถั่ว',
        eta: '12/01/2568 08:00',
      },
      {
        bargeName: 'SPI56',
        origin: 'Koh Sichang',
        destination: 'Laem Chabang',
        vessel: 'MV. GOLDEN FLAVOR GROUP',
        jobOrder: 'RTM241067-1',
        cargo: 'กากถั่ว',
        eta: '12/01/2568 08:00',
      }
      ,
      {
        bargeName: 'SPI56',
        origin: 'Koh Sichang',
        destination: 'Laem Chabang',
        vessel: 'MV. ALIKI FORCE',
        jobOrder: 'RTM241067-1',
        cargo: 'กากถั่ว',
        eta: '12/01/2568 08:00',
      }
    ]
  },
  {
    id: 'ket05',
    name: 'Ketsarin05',
    nameThai: 'เรือ เกศริน05',
    image: require('@/assets/Images/overview_barge.jpg'),
    status: "Maintenance",
    date: "12/01/2568",
    category: "River",
    measurements: {
      oilPressure: 2.1,
      waterTemperature: 85,
      rpm: 1600,
      windSpeed: 7,
      battery: 26
    },
    data: [
      {
        bargeName: 'SPI56',
        origin: 'Koh Sichang',
        destination: 'Laem Chabang',
        vessel: 'MV. VENETIA',
        jobOrder: 'RTM241067-1',
        cargo: 'กากถั่ว',
        eta: '12/01/2568 08:00',
      },
      {
        bargeName: 'SPI56',
        origin: 'Koh Sichang',
        destination: 'Laem Chabang',
        vessel: 'MV. GOLDEN FLAVOR GROUP',
        jobOrder: 'RTM241067-1',
        cargo: 'กากถั่ว',
        eta: '12/01/2568 08:00',
      },
      {
        bargeName: 'SPI56',
        origin: 'Koh Sichang',
        destination: 'Laem Chabang',
        vessel: 'MV. ALIKI FORCE',
        jobOrder: 'RTM241067-1',
        cargo: 'กากถั่ว',
        eta: '12/01/2568 08:00',
      },
      {
        bargeName: 'SPI56',
        origin: 'Koh Sichang',
        destination: 'Laem Chabang',
        vessel: 'MV. SMOOTH SEA',
        jobOrder: 'RTM241067-1',
        cargo: 'กากถั่ว',
        eta: '12/01/2568 08:00',
      },
      {
        bargeName: 'SPI56',
        origin: 'Koh Sichang',
        destination: 'Laem Chabang',
        vessel: 'MV. SMOOTH SEA',
        jobOrder: 'RTM241067-1',
        cargo: 'กากถั่ว',
        eta: '12/01/2568 08:00',
      },
    ]
  },
  {
    id: 'ket06',
    name: 'Ketsarin06',
    nameThai: 'เรือ เกศริน06',
    image: require('@/assets/Images/overview_barge.jpg'),
    status: "Maintenance",
    date: "12/01/2568",
    category: "River Going",
  },
  {
    id: 'ket08',
    name: 'Ketsarin08',
    nameThai: 'เรือ เกศริน08',
    image: require('@/assets/Images/overview_barge.jpg'),
    status: "Running",
    date: "",
    category: "River Going",
  },
  {
    id: 'ket10',
    name: 'Ketsarin10',
    nameThai: 'เรือ เกศริน10',
    image: require('@/assets/Images/overview_barge.jpg'),
    status: "Maintenance",
    date: "12/01/2568",
    category: "River Going",
    measurements: {
      oilPressure: 2.1,
      waterTemperature: 85,
      rpm: 1600,
      windSpeed: 7,
      battery: 26
    },
    data: [
      {
        bargeName: 'SPI56',
        origin: 'Koh Sichang',
        destination: 'Laem Chabang',
        vessel: 'MV. VENETIA',
        jobOrder: 'RTM241067-1',
        cargo: 'กากถั่ว',
        eta: '12/01/2568 08:00',
      },
      {
        bargeName: 'SPI56',
        origin: 'Koh Sichang',
        destination: 'Laem Chabang',
        vessel: 'MV. GOLDEN FLAVOR GROUP',
        jobOrder: 'RTM241067-1',
        cargo: 'กากถั่ว',
        eta: '12/01/2568 08:00',
      },
      {
        bargeName: 'SPI56',
        origin: 'Koh Sichang',
        destination: 'Laem Chabang',
        vessel: 'MV. ALIKI FORCE',
        jobOrder: 'RTM241067-1',
        cargo: 'กากถั่ว',
        eta: '12/01/2568 08:00',
      },
      {
        bargeName: 'SPI56',
        origin: 'Koh Sichang',
        destination: 'Laem Chabang',
        vessel: 'MV. SMOOTH SEA',
        jobOrder: 'RTM241067-1',
        cargo: 'กากถั่ว',
        eta: '12/01/2568 08:00',
      },
    ]
  },
  {
    id: 'ket11',
    name: 'Ketsarin11',
    nameThai: 'เรือ เกศริน11',
    image: require('@/assets/Images/overview_barge.jpg'),
    status: "Running",
    date: "",
    category: "River",
  },
  {
    id: 'ket17',
    name: 'Ketsarin17',
    nameThai: 'เรือ เกศริน17',
    image: require('@/assets/Images/overview_barge.jpg'),
    status: "Maintenance",
    date: "12/01/2568",
    category: "River",
  },
  {
    id: 'ket18',
    name: 'Ketsarin18',
    nameThai: 'เรือ เกศริน18',
    image: require('@/assets/Images/overview_barge.jpg'),
    status: "Maintenance",
    date: "12/01/2568",
    category: "River",
  },
  
  // Sea Going
  {
    id: 'ket09',
    name: 'Ketsarin09',
    nameThai: 'เรือ เกศริน09',
    image: require('@/assets/Images/overview_barge.jpg'),
    status: "Running",
    date: "",
    category: "Sea",
    measurements: {
      oilPressure: 2.1,
      waterTemperature: 85,
      rpm: 1600,
      windSpeed: 7,
      battery: 26
    },
    data: [
      {
        bargeName: 'SPI56',
        origin: 'Koh Sichang',
        destination: 'Laem Chabang',
        vessel: 'MV. VENETIA',
        jobOrder: 'RTM241067-1',
        cargo: 'กากถั่ว',
        eta: '12/01/2568 08:00',
      },
      {
        bargeName: 'SPI56',
        origin: 'Koh Sichang',
        destination: 'Laem Chabang',
        vessel: 'MV. GOLDEN FLAVOR GROUP',
        jobOrder: 'RTM241067-1',
        cargo: 'กากถั่ว',
        eta: '12/01/2568 08:00',
      },
      {
        bargeName: 'SPI56',
        origin: 'Koh Sichang',
        destination: 'Laem Chabang',
        vessel: 'MV. ALIKI FORCE',
        jobOrder: 'RTM241067-1',
        cargo: 'กากถั่ว',
        eta: '12/01/2568 08:00',
      },
      {
        bargeName: 'SPI56',
        origin: 'Koh Sichang',
        destination: 'Laem Chabang',
        vessel: 'MV. SMOOTH SEA',
        jobOrder: 'RTM241067-1',
        cargo: 'กากถั่ว',
        eta: '12/01/2568 08:00',
      },
    ]
  },
  {
    id: 'ket12',
    name: 'Ketsarin12',
    nameThai: 'เรือ เกศริน12',
    image: require('@/assets/Images/overview_barge.jpg'),
    status: "Maintenance",
    date: "12/01/2568",
    category: "Sea",
  },
  {
    id: 'ket13',
    name: 'Ketsarin13',
    nameThai: 'เรือ เกศริน13',
    image: require('@/assets/Images/overview_barge.jpg'),
    status: "Pending",
    date: "12/01/2568",
    category: "Sea",
  },
  {
    id: 'ket14',
    name: 'Ketsarin14',
    nameThai: 'เรือ เกศริน14',
    image: require('@/assets/Images/overview_barge.jpg'),
    status: "Maintenance",
    date: "12/01/2568",
    category: "Sea",
  },
  {
    id: 'ket15',
    name: 'Ketsarin15',
    nameThai: 'เรือ เกศริน15',
    image: require('@/assets/Images/overview_barge.jpg'),
    status: "Maintenance",
    date: "12/01/2568",
    category: "Sea",
  },
  {
    id: 'ket16',
    name: 'Ketsarin16',
    nameThai: 'เรือ เกศริน16',
    image: require('@/assets/Images/overview_barge.jpg'),
    status: "Running",
    date: "",
    category: "Sea",
  },
  {
    id: 'buachompoo',
    name: 'Buachompoo',
    nameThai: 'เรือ บัวชมพู',
    image: require('@/assets/Images/overview_barge.jpg'),
    status: "Maintenance",
    date: "12/01/2568",
    category: "Sea",measurements: {
      oilPressure: 2.1,
      waterTemperature: 85,
      rpm: 1600,
      windSpeed: 7,
      battery: 26
    },
    data: [
      {
        bargeName: 'SPI61',
        origin: 'Koh Sichang',
        destination: 'Laem Chabang',
        vessel: 'MV. SMOOTH SEA',
        jobOrder: 'RTM241067-1',
        cargo: 'กากถั่ว',
        eta: '12/01/2568 08:00',
      },
      {
        bargeName: 'SPI56',
        origin: 'Koh Sichang',
        destination: 'Laem Chabang',
        vessel: 'MV. GOLDEN FLAVOR GROUP',
        jobOrder: 'RTM241067-1',
        cargo: 'กากถั่ว',
        eta: '12/01/2568 08:00',
      },
      {
        bargeName: 'J33',
        origin: 'Koh Sichang',
        destination: 'Laem Chabang',
        vessel: 'MV. VENETIA',
        jobOrder: 'RTM241067-1',
        cargo: 'กากถั่ว',
        eta: '12/01/2568 08:00',
      },
    ]
  },
  {
    id: 'wat01',
    name: 'Watthana01',
    nameThai: 'เรือ วัฒนา01',
    image: require('@/assets/Images/overview_barge.jpg'),
    status: "Running",
    date: "",
    category: "Sea",
  },
  {
    id: 'wat02',
    name: 'Watthana02',
    nameThai: 'เรือ วัฒนา02',
    image: require('@/assets/Images/overview_barge.jpg'),
    status: "Maintenance",
    date: "12/01/2568",
    category: "Sea",
  },
  {
    id: 'wat03',
    name: 'Watthana03',
    nameThai: 'เรือ วัฒนา03',
    image: require('@/assets/Images/overview_barge.jpg'),
    status: "Maintenance",
    date: "12/01/2568",
    category: "Sea",
  },
  {
    id: 'wat04',
    name: 'Watthana04',
    nameThai: 'เรือ วัฒนา04',
    image: require('@/assets/Images/overview_barge.jpg'),
    status: "Running",
    date: "",
    category: "Sea",
    measurements: {
      oilPressure: 2.1,
      waterTemperature: 85,
      rpm: 1600,
      windSpeed: 7,
      battery: 26
    },
    data: [
      {
        bargeName: 'SPI56',
        origin: 'Koh Sichang',
        destination: 'Laem Chabang',
        vessel: 'MV. GOLDEN FLAVOR GROUP',
        jobOrder: 'RTM241067-1',
        cargo: 'กากถั่ว',
        eta: '12/01/2568 08:00',
      },
      {
        bargeName: 'SPI56',
        origin: 'Koh Sichang',
        destination: 'Laem Chabang',
        vessel: 'MV. ALIKI FORCE',
        jobOrder: 'RTM241067-1',
        cargo: 'กากถั่ว',
        eta: '12/01/2568 08:00',
      },
      {
        bargeName: 'SPI56',
        origin: 'Koh Sichang',
        destination: 'Laem Chabang',
        vessel: 'MV. VENETIA',
        jobOrder: 'RTM241067-1',
        cargo: 'กากถั่ว',
        eta: '12/01/2568 08:00',
      },
    ]
  },
  {
    id: 'wat05',
    name: 'Watthana05',
    nameThai: 'เรือ วัฒนา05',
    image: require('@/assets/Images/overview_barge.jpg'),
    status: "Maintenance",
    date: "12/01/2568",
    category: "Sea",
  },
  {
    id: 'wat06',
    name: 'Watthana06',
    nameThai: 'เรือ วัฒนา06',
    image: require('@/assets/Images/overview_barge.jpg'),
    status: "Running",
    date: "",
    category: "Sea",
  },
  {
    id: 'wat07',
    name: 'Watthana07',
    nameThai: 'เรือ วัฒนา07',
    image: require('@/assets/Images/overview_barge.jpg'),
    status: "Maintenance",
    date: "12/01/2568",
    category: "Sea",
  },
  {
    id: 'wat10',
    name: 'Watthana10',
    nameThai: 'เรือ วัฒนา10',
    image: require('@/assets/Images/overview_barge.jpg'),
    status: "Maintenance",
    date: "12/01/2568",
    category: "Sea",
    measurements: {
      oilPressure: 2.1,
      waterTemperature: 85,
      rpm: 1600,
      windSpeed: 7,
      battery: 26
    },
    data: [
      {
        bargeName: 'SPI56',
        origin: 'Koh Sichang',
        destination: 'Laem Chabang',
        vessel: 'MV. SMOOTH SEA',
        jobOrder: 'RTM241067-1',
        cargo: 'กากถั่ว',
        eta: '12/01/2568 08:00',
      },
      {
        bargeName: 'SPI56',
        origin: 'Koh Sichang',
        destination: 'Laem Chabang',
        vessel: 'MV. GOLDEN FLAVOR GROUP',
        jobOrder: 'RTM241067-1',
        cargo: 'กากถั่ว',
        eta: '12/01/2568 08:00',
      },
      {
        bargeName: 'SPI56',
        origin: 'Koh Sichang',
        destination: 'Laem Chabang',
        vessel: 'MV. ALIKI FORCE',
        jobOrder: 'RTM241067-1',
        cargo: 'กากถั่ว',
        eta: '12/01/2568 08:00',
      },
      {
        bargeName: 'SPI56',
        origin: 'Koh Sichang',
        destination: 'Laem Chabang',
        vessel: 'MV. VENETIA',
        jobOrder: 'RTM241067-1',
        cargo: 'กากถั่ว',
        eta: '12/01/2568 08:00',
      },
    ]
  },
]

export const reports = [
  {
    id: 'report01',
    name: 'Notification Report',
    nameThai: 'รายงานการแจ้งเตือน',
  },
  {
    id: 'report02',
    name: 'Report Historical Chart',
    nameThai: 'รายงานข้อมูลย้อนหลังแบบกราฟ',
  },
  {
    id: 'report03',
    name: 'Report on RPM and Speed and %Throttle Affected by Wind Speed of Tugboat',
    nameThai: 'รายงาน RPM และ ความเร็ว และ %คันเร่ง ที่ถูกกระทบด้วยความเร็วลมของเรือยนต์ ',
  },
  {
    id: 'report04',
    name: 'Report on Tugboats Encountering Storms',
    nameThai: 'รายงานเรือยนต์ที่เจอพายุ',
  },
  {
    id: 'report05',
    name: 'Report on Fuel Rate per RPM for Evaluating Engine Efficiency of Motor Barge',
    nameThai: 'รายงานอัตราการใช้ชื้อเพลิง ต่อ RPM เพื่อดูประสิทธิภาพเครื่องยนต์ของทุ่น',
  },
  {
    id: 'report06',
    name: 'Report on %Throttle vs. RPM vs. Fuel Rate',
    nameThai: 'รายงาน %คันเร่ง ต่อ RPM ต่อ อัตราการใช้ชื้อเพลิง สำหรับเรือยนต์',
  },
  {
    id: 'report07',
    name: 'Report on Daily Fuel Consumption for the Barge',
    nameThai: 'รายงานการบริโภคน้ำมันรายวันของทุ่น',
  },
  {
    id: 'report08',
    name: 'Report on Barge Tilt ',
    nameThai: 'รายงานความเอียงทุ่น (แนวแกน X)',
  }
]

export const measurementLimits_B = {
  axisX: {
    warning: { min: -3, max: 3, unit: 'degree'},
    danger: { min: -5, max: 5, unit: 'degree'}
  },
  axisY: {
    warning: { min: -3, max: 3, unit: 'degree'},
    danger: { min: -5, max: 5, unit: 'degree'}
  },
  oilPressure: {
    warning: { min: 1, max: 5, unit: 'bar' },
    danger: { min: 0.5, max: 6, unit: 'bar' }
  },
  waterTemperature: {
    warning: { min: 90, max: 95, unit: 'degree' },
    danger: { min: 96, max: 100, unit: 'degree' }
  },
  rpm: {
    warning: { min: 1800, max: 1850, unit: 'rpm' },
    danger: { min: 1851, max: 1950, unit: 'rpm' }
  },
  battery: {
    warning: { min: 20, max: 30, unit: 'volt' },
    danger: { min: 18, max: 32, unit: 'volt' }
  }
};

export const measurementLimits_T = {
  oilPressure: {
    warning: { min: 1, max: 5, unit: 'bar' },
    danger: { min: 0.5, max: 6, unit: 'bar' }
  },
  waterTemperature: {
    warning: { min: 90, max: 95, unit: 'degree' },
    danger: { min: 96, max: 100, unit: 'degree' }
  },
  rpm: {
    warning: { min: 1800, max: 1850, unit: 'rpm' },
    danger: { min: 1851, max: 1950, unit: 'rpm' }
  },
  windSpeed: {
    warning: { min: 10, max: 15, unit: 'm/s' },
    danger: { min: 16, max: 20, unit: 'm/s' }
  },
  battery: {
    warning: { min: 20, max: 30, unit: 'volt' },
    danger: { min: 18, max: 32, unit: 'volt' }
  }
};