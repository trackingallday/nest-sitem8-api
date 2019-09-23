


//CONTROLLER METHOD
/*
public int AddCompanyAdministrator(Worker newCompanyAdmin)
        {
            newCompanyAdmin.MobileNotifications = true;
            newCompanyAdmin.EmailNotifications = true;
            newCompanyAdmin.DeviceId = "";
            newCompanyAdmin.PayrollId = "administrator";
            newCompanyAdmin.IsAdministrator = true;
            newCompanyAdmin.IsEnabled = true;
            newCompanyAdmin.IsSupervisor = false;
            newCompanyAdmin.IsSuperAdministrator = false;
            newCompanyAdmin.IsWorker = false;
            using (SiteM8Context entity = new SiteM8Context())
            {
                entity.Worker.Add(newCompanyAdmin);
                entity.SaveChanges();
                return newCompanyAdmin.WorkerId;
            }
        }
//CONTROLLER METHOD
ClearExistingWorkerWithSameDeviceId(entity, worker.DeviceId, worker.WorkerId);

 public List<SiteAssignment> GetSiteAssignments()
        {
            MustBeAdministratorOrSupervisor();
            return siteAssignmentService.GetActiveSiteAssignments();
        }

        //must be an admin or supervior user to add a site assignment
        //throws error if sites or workers affected don't belong to the company
        public SiteAssignment AddSiteAssignment(List<WorkerAssignment> workerAssignments,
            List<DayOfWeekTimeSetting> dayOfWeekTimeSettings, SiteAssignment siteAssignment)
        {
            MustBeAdministratorOrSupervisor();
            siteAssignmentService.ValidateSiteAssignment(workerAssignments, siteAssignment);
            return siteAssignmentService.AddSiteAssignment(workerAssignments, dayOfWeekTimeSettings, siteAssignment);
        }

         public void ValidateSiteAssignment(List<WorkerAssignment> workerAssignments, SiteAssignment siteAssignment)
        {
            List<int> workerIds = workerAssignments.Select(w => w.WorkerId).ToList();
            int siteId = siteAssignment.SiteId;
            using (SiteM8Context entity = new SiteM8Context())
            {
                var site = entity.Site.Single(s => s.SiteId == siteAssignment.SiteId);
                var workers = entity.Worker.Where(w => workerIds.Contains(w.WorkerId));
                if (workers.Any(w => w.CompanyId != companyId) || site.CompanyId != companyId)
                {
                    throw new InvalidOperationException("Illegal site assignment");
                }
            }
        }

        public SiteAssignment AddSiteAssignment(List<WorkerAssignment> workerAssignments,
            List<DayOfWeekTimeSetting> dayOfWeekTimeSettings, SiteAssignment siteAssignment)
        {
            using (SiteM8Context entity = new SiteM8Context())
            {
                // do it inside a transaction so we don't have location timestamp
                // added between archiving and adding site assignments
                using (var transaction = entity.Database.BeginTransaction())
                {
                    entity.SiteAssignment.Where(
                        s => s.SiteId == siteAssignment.SiteId && s.Archived == false).ToList().ForEach(
                        s => s.Archived = true);
                    siteAssignment.CreatedAt = DateTime.Now;
                    entity.SiteAssignment.Add(siteAssignment);
                    entity.SaveChanges();
                    entity.Entry<SiteAssignment>(siteAssignment).Reload();
                    workerAssignments.ForEach(wa => wa.SiteAssignment = siteAssignment);
                    dayOfWeekTimeSettings.ForEach(dts => dts.SiteAssignment = siteAssignment);
                    entity.WorkerAssignment.AddRange(workerAssignments);
                    entity.DayOfWeekTimeSetting.AddRange(dayOfWeekTimeSettings);
                    entity.SaveChanges();
                    transaction.Commit();
                }
                return siteAssignment;
            }
        }

        public List<int> GetBlockedSiteIdsByWorkerId(int workerId)
        {
            using (SiteM8Context entity = new SiteM8Context())
            {
                List<int> siteIds = entity.SiteAssignment.Where(
                    //the company has an active active assignment record
                    x => (x.Site.CompanyId == companyId && x.Archived == false) &&
                    //that has a blocked worker assignment
                    (x.WorkerAssignments.Exists(
                            w => w.WorkerId == workerId && w.AssignedStatus == WorkerAssignmentStatus.Blocked)
                    //or has no worker assignment record for the worker and it can not unassigned add workers
                    || !(x.WorkerAssignments.Exists(w => w.WorkerId == workerId) && x.CanAddWorkerFromLocationTimestamp == false)
                    //grab the site ids from any matching assignments
                        )).Select(a => a.SiteId).ToList();
                return siteIds;
            }
        }

        public List<SiteAssignment> GetActiveSiteAssignments()
        {
            using (SiteM8Context entity = new SiteM8Context())
            {
                var siteIds = entity.Site.Where(s => s.CompanyId == companyId && s.Active == true).Select(s => s.SiteId);
                var items = entity.SiteAssignment.Where(
                    s => s.Archived == false && siteIds.Contains(s.SiteId)).ToList();
                items.ForEach(sa => {
                    sa.WorkerAssignments = entity.WorkerAssignment.Where(
                        wa => wa.SiteAssignmentId == sa.SiteAssignmentId).ToList();
                    sa.DayOfWeekTimeSettings = entity.DayOfWeekTimeSetting.Where(
                        ds => ds.SiteAssignmentId == sa.SiteAssignmentId).ToList();
                });
                return items;
            }
        }

        public SiteAssignment GetActiveSiteAssignment(int siteId)
        {
            using (SiteM8Context entity = new SiteM8Context())
            {
                var sa = entity.SiteAssignment.Where(
                    s => s.Archived == false && s.SiteId == siteId).FirstOrDefault();
                if(sa != null)
                {
                    sa.WorkerAssignments = entity.WorkerAssignment.Where(
                        wa => wa.SiteAssignmentId == sa.SiteAssignmentId).ToList();
                    sa.DayOfWeekTimeSettings = entity.DayOfWeekTimeSetting.Where(
                        ds => ds.SiteAssignmentId == sa.SiteAssignmentId).ToList();
                }
                return sa;
            }
        }

        public SiteAssignment GetSiteAssignmentById(int siteAssignmentId)
        {
            using (SiteM8Context entity = new SiteM8Context())
            {
               var sa = entity.SiteAssignment.Where(s => s.SiteAssignmentId == siteAssignmentId).FirstOrDefault();
                if (sa != null)
                {
                    sa.WorkerAssignments = entity.WorkerAssignment.Where(
                        wa => wa.SiteAssignmentId == sa.SiteAssignmentId).ToList();
                    sa.DayOfWeekTimeSettings = entity.DayOfWeekTimeSetting.Where(
                        ds => ds.SiteAssignmentId == sa.SiteAssignmentId).ToList();
                }
                return sa;
            }
        }
*/

