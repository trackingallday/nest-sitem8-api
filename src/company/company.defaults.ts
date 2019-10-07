
export function companyDefaults() {
  return  {
    startDayOfWeek: 1, //0 = Sunday 1 = Monday 
    minimumWorkingDayDuration: '00:30:00',
    nextProcessingTime: new Date(),
    nextApprovalReminderTime: new Date(),
    workingDayEarliestStart: '06:00:00',
    workingDayDefaultStart: '06:00:00',
    workingDayLatestFinish: '20:00:00',
    workingDayDefaultFinish: '20:00:00',
    minimumLunchStart: '10:00:00',
    defaultLunchStart: '12:00:00',
    defaultLunchEnd: '12:30:00',
    maximumLunchEnd: '14:00:00',
    glitchRemovalPeriod: '00:10:00',
    minimumWorkingTimeToRemoveLunchBreak: '05:00:00',
    privateModeStart: '06:00:00',
    privateModeFinish: '20:00:00',
    dailyTimesheetProcessing: '21:00:00',
    dailyApprovalReminder: '08:30:00',
    demoCount: 0,
    customSettings: '{}',
  };
}
