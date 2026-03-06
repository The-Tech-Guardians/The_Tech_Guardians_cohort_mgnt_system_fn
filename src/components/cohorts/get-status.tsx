export default function getStatus(cohort) {
  const now   = new Date();
  const open  = new Date(cohort.enrollment_open_date);
  const close = new Date(cohort.enrollment_close_date);
  const start = new Date(cohort.start_date);
  const end   = new Date(cohort.end_date);
  const ext   = new Date(cohort.extension_date);

  if (!cohort.is_active && now > ext) return "completed";
  if (now >= start && now <= end)     return "active";
  if (now < open)                     return "upcoming";
  if (now >= open && now <= close)    return "enrolling";
  if (now > close && now < start)     return "enrolling"; // still before start
  return "upcoming";
}