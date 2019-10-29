export default {
  companyId: 1,
  admin: {
    name: 'admin',
    email: 'admin@email.com',
    authId: 'admin@email.com',
    companyId: 1,
    mobile: '23453453245',
    payrollId: '234',
    supervisor: null,
    mobileNotifications: false,
    emailNotifications: false,
    isEnabled: false,
    isWorker: false,
    isSupervisor: false,
    isAdministrator: true,
    deviceId: null,
    base64Image: null,
    isSuperAdministrator: false,
  },
  supervisor: {
    name: 'supervisor',
    email: 'supervisor@email.com',
    authId: 'supervisor@email.com',
    companyId: 1,
    mobile: '',
    payrollId: '',
    supervisor: null,
    mobileNotifications: true,
    emailNotifications: true,
    isEnabled: true,
    isWorker: false,
    isSupervisor: true,
    isAdministrator: false,
    deviceId: null,
    base64Image: null,
    isSuperAdministrator: false,
  },
  worker: {
    name: 'worker',
    email: 'worker@email.com',
    authId: 'worker@email.com',
    companyId: 1,
    mobile: '',
    payrollId: '',
    supervisor: 2,
    mobileNotifications: true,
    emailNotifications: true,
    isEnabled: true,
    isWorker: true,
    isSupervisor: false,
    isAdministrator: false,
    deviceId: '32q453453145345',
    base64Image: null,
    isSuperAdministrator: false,
  },
  worker2: {
    name: 'worker2',
    email: 'worker2@email.com',
    authId: 'worker2@email.com',
    companyId: 1,
    mobile: '',
    payrollId: '2',
    supervisor: 2,
    mobileNotifications: true,
    emailNotifications: true,
    isEnabled: true,
    isWorker: true,
    isSupervisor: false,
    isAdministrator: false,
    deviceId: '00000053145345',
    base64Image: null,
    isSuperAdministrator: false,
  },
  company: {
    name: 'test company 1',
    workingDayDefaultFinish: '17:00',
    workingDayLatestFinish: '18:30',
    workingDayDefaultStart: '07:00',
    workingDayEarliestStart: '06:30',
  },
  device: {
    deviceId: '32q453453145345',
  },
  device2: {
    deviceId: '00000053145345',
  },
  timesheet: {
    startDateTime: new Date(2019, 8, 25, 24, 0),
    finishDateTime: new Date(2019, 9, 1, 12, 0),
    status: 1,
  },
  timesheetEntries: [
    {
      startDateTime: new Date(2019, 8, 26, 4, 32),
      finishDateTime: new Date(2019, 8, 26, 6, 0),
      description: 'Calculated from GPS',
    },
    {
      startDateTime: new Date(2019, 8, 30, 7, 11),
      finishDateTime: new Date(2019, 8, 30, 9, 31),
      description: 'Calculated from GPS',
    },
    {
      startDateTime: new Date(2019, 8, 30, 9, 31),
      finishDateTime: new Date(2019, 8, 30, 10, 28),
      description: 'Calculated from GPS',
    },
  ],
  site: {
    name: 'Test Site',
    companyId: 1,
    sitePayrollId: '23462346246',
    active: true,
    geom: {
      type: 'Polygon',
      coordinates:  [
        [
          [
            172.63907468368518,
            -43.5332059704003,
          ],
          [
            172.63905322601306,
            -43.53345487040692,
          ],
          [
            172.63946092178332,
            -43.53349376094017,
          ],
          [
            172.63950383712756,
            -43.533167079681476,
          ],
          [
            172.63907468368518,
            -43.5332059704003,
          ],
        ],
      ],
    },
  },
  nearOrbicaPoints: [
    [
      172.6392570738982,
      -43.53334597678043,
    ],
    [
      172.63952529479968,
      -43.53285595302797,
    ],
    [
      172.63990080406177,
      -43.53321374854106,
    ],
    [
      172.63884937812793,
      -43.533275973631,
    ],
  ],
};