// Mock Data Engine for instant evaluation and zero-failure demonstration

export const mockUsers = {
  student: {
    id: 10,
    email: 'student@campus.edu',
    fullName: 'Alex Johnson',
    role: 'ROLE_STUDENT',
    phoneNumber: '+1 (555) 012-3456',
    departmentName: 'Computer Science & Engineering',
    departmentId: 1,
    rollNumber: 'CS2024001',
    semester: 'Semester 6',
    batch: '2023-2027',
    token: 'mock-jwt-token-student'
  },
  faculty: {
    id: 20,
    email: 'faculty@campus.edu',
    fullName: 'Dr. Alan Turing',
    role: 'ROLE_FACULTY',
    phoneNumber: '+1 (555) 014-9921',
    departmentName: 'Computer Science & Engineering',
    departmentId: 1,
    employeeCode: 'FAC-CSE-001',
    designation: 'Associate Professor',
    token: 'mock-jwt-token-faculty'
  },
  admin: {
    id: 30,
    email: 'admin@campus.edu',
    fullName: 'Campus Administrator',
    role: 'ROLE_ADMIN',
    phoneNumber: '+1 (555) 019-2831',
    departmentName: 'Computer Science & Engineering',
    departmentId: 1,
    token: 'mock-jwt-token-admin'
  }
};

export const mockAttendanceSummary = [
  { subject: 'Cloud Computing & DevOps', totalClasses: 28, attendedClasses: 26, absentClasses: 1, lateClasses: 1, percentage: 96.43 },
  { subject: 'Distributed Systems', totalClasses: 24, attendedClasses: 20, absentClasses: 3, lateClasses: 1, percentage: 87.50 },
  { subject: 'Database Management Systems', totalClasses: 30, attendedClasses: 28, absentClasses: 1, lateClasses: 1, percentage: 96.67 },
  { subject: 'Machine Learning & AI', totalClasses: 26, attendedClasses: 24, absentClasses: 2, lateClasses: 0, percentage: 92.31 }
];

export const mockAttendanceHistory = [
  { id: 1, attendanceDate: '2026-08-14', subject: 'Cloud Computing & DevOps', status: 'PRESENT', remarks: 'AWS ECS hands-on lab' },
  { id: 2, attendanceDate: '2026-08-13', subject: 'Distributed Systems', status: 'PRESENT', remarks: 'Consensus algorithms' },
  { id: 3, attendanceDate: '2026-08-12', subject: 'Database Management Systems', status: 'PRESENT', remarks: 'Indexing & query optimization' },
  { id: 4, attendanceDate: '2026-08-11', subject: 'Machine Learning & AI', status: 'PRESENT', remarks: 'Transformer models' },
  { id: 5, attendanceDate: '2026-08-10', subject: 'Distributed Systems', status: 'ABSENT', remarks: 'Medical leave submitted' },
  { id: 6, attendanceDate: '2026-08-08', subject: 'Database Management Systems', status: 'LATE', remarks: '10 min late' }
];

export const mockComplaints = [
  {
    id: 101,
    complaintCode: 'CMP-2026-8801',
    title: 'Wi-Fi Connectivity issues in Library 2nd Floor',
    category: 'INTERNET',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    location: 'Central Library - 2nd Floor East',
    description: 'High packet loss and intermittent disconnects near the study desks on 2nd floor east wing.',
    resolutionRemarks: 'IT Infrastructure team is inspecting the Cisco Access Point switch.',
    createdAt: '2026-08-14T10:30:00'
  },
  {
    id: 102,
    complaintCode: 'CMP-2026-8802',
    title: 'Projector HDMI Port malfunctioning in Hall 302',
    category: 'CLASSROOM',
    priority: 'MEDIUM',
    status: 'UNDER_REVIEW',
    location: 'Block A - Room 302',
    description: 'HDMI cable port displays pink tint on screen during presentations.',
    resolutionRemarks: null,
    createdAt: '2026-08-13T14:15:00'
  },
  {
    id: 103,
    complaintCode: 'CMP-2026-8803',
    title: 'Water cooler tap leaking on Ground Floor',
    category: 'WATER',
    priority: 'LOW',
    status: 'RESOLVED',
    location: 'Block B Ground Floor Lobby',
    description: 'Continuous drip from the cold water dispensing tap causing water accumulation.',
    resolutionRemarks: 'Valve gasket replaced by campus maintenance team.',
    createdAt: '2026-08-11T09:00:00'
  }
];

export const mockLeaveRequests = [
  {
    id: 201,
    startDate: '2026-08-20',
    endDate: '2026-08-22',
    reason: 'Attending National Inter-College Hackathon at Tech Institute.',
    status: 'APPROVED',
    facultyRemarks: 'Approved. Representing college in national hackathon.',
    createdAt: '2026-08-14T11:00:00'
  },
  {
    id: 202,
    startDate: '2026-08-28',
    endDate: '2026-08-30',
    reason: 'Family medical emergency and urgent travel.',
    status: 'PENDING',
    facultyRemarks: null,
    createdAt: '2026-08-15T16:20:00'
  }
];

export const mockAnnouncements = [
  {
    id: 301,
    title: 'Mid-Term Examination Schedule Released',
    description: 'The tentative schedule for Mid-Term 2026 examinations has been published on the student portal. Review dates and report discrepancies to department office.',
    priority: 'HIGH',
    department: { name: 'Computer Science & Engineering' },
    createdAt: '2026-08-14T09:00:00'
  },
  {
    id: 302,
    title: 'Campus Cloud Computing & Kubernetes Workshop',
    description: 'Join us this Friday in Seminar Hall B for a hands-on workshop on AWS ECS and Spring Boot microservices deployment.',
    priority: 'MEDIUM',
    department: { name: 'Computer Science & Engineering' },
    createdAt: '2026-08-13T15:30:00'
  },
  {
    id: 303,
    title: 'Library Extended Hours for Finals Week',
    description: 'Central Library will remain open until 11:00 PM starting next Monday through final examination week.',
    priority: 'LOW',
    department: null,
    createdAt: '2026-08-12T11:00:00'
  }
];

export const mockEvents = [
  {
    id: 401,
    eventName: 'Smart Campus Hackathon 2026',
    description: '24-hour national hackathon focused on AI, Cloud, and IoT smart campus solutions. Cash prizes & internship tracks.',
    eventDate: '2026-08-25',
    time: '09:00 AM - 09:00 AM (Next Day)',
    venue: 'Innovation & Incubation Center',
    organizer: 'CSE Student Council',
    maxParticipants: 150,
    registeredCount: 98
  },
  {
    id: 402,
    eventName: 'Cloud Architecture & DevOps Symposium',
    description: 'Guest lectures by industry architects on AWS CDK, Terraform, and Kubernetes orchestration.',
    eventDate: '2026-09-02',
    time: '10:00 AM - 04:30 PM',
    venue: 'Main Auditorium Hall A',
    organizer: 'Department of Computer Science',
    maxParticipants: 250,
    registeredCount: 184
  },
  {
    id: 403,
    eventName: 'Annual Sports & Cultural Gala',
    description: 'Inter-department football, basketball, robotics war, and music competitions.',
    eventDate: '2026-09-15',
    time: '08:30 AM - 07:00 PM',
    venue: 'Campus Sports Complex',
    organizer: 'Student Affairs Committee',
    maxParticipants: 500,
    registeredCount: 320
  }
];

export const mockResources = [
  { id: 501, resourceName: 'Cloud & High-Performance Computing Lab 401', resourceType: 'Computer Lab', location: 'Block A, 4th Floor', capacity: 60, status: 'AVAILABLE', bookedBy: null },
  { id: 502, resourceName: 'Smart Seminar Hall B', resourceType: 'Auditorium', location: 'Block A, Ground Floor', capacity: 120, status: 'OCCUPIED', bookedBy: { fullName: 'Dr. Alan Turing' }, bookingPurpose: 'Cloud Computing Guest Lecture' },
  { id: 503, resourceName: 'Embedded Systems & IoT Lab 202', resourceType: 'Electronics Lab', location: 'Block B, 2nd Floor', capacity: 45, status: 'AVAILABLE', bookedBy: null },
  { id: 504, resourceName: 'Main Conference & Syndicate Room', resourceType: 'Meeting Room', location: 'Administrative Block, Level 1', capacity: 25, status: 'AVAILABLE', bookedBy: null },
  { id: 505, resourceName: 'Robotics & Prototyping Workshop', resourceType: 'Makerspace', location: 'Block C, Workshop Complex', capacity: 40, status: 'MAINTENANCE', bookedBy: null }
];

export const mockStudentsList = [
  { id: 1, rollNumber: 'CS2024001', admissionNumber: 'ADM-2024-001', semester: 'Semester 6', batch: '2023-2027', cgpa: 8.85, guardianName: 'Robert Johnson', guardianContact: '+1 (555) 019-3322', user: { id: 10, fullName: 'Alex Johnson', email: 'student@campus.edu', phoneNumber: '+1 (555) 012-3456', active: true, department: { name: 'Computer Science & Engineering', code: 'CSE' } } },
  { id: 2, rollNumber: 'CS2024002', admissionNumber: 'ADM-2024-002', semester: 'Semester 6', batch: '2023-2027', cgpa: 9.12, guardianName: 'Arthur Doe', guardianContact: '+1 (555) 019-4455', user: { id: 11, fullName: 'Jane Doe', email: 'jane.doe@campus.edu', phoneNumber: '+1 (555) 012-9876', active: true, department: { name: 'Computer Science & Engineering', code: 'CSE' } } },
  { id: 3, rollNumber: 'EC2024015', admissionNumber: 'ADM-2024-015', semester: 'Semester 4', batch: '2024-2028', cgpa: 7.90, guardianName: 'David Smith', guardianContact: '+1 (555) 019-5566', user: { id: 12, fullName: 'Mark Smith', email: 'mark.smith@campus.edu', phoneNumber: '+1 (555) 012-7711', active: true, department: { name: 'Electronics & Communication', code: 'ECE' } } }
];

export const mockFacultyList = [
  { id: 1, employeeCode: 'FAC-CSE-001', designation: 'Associate Professor', qualification: 'Ph.D. in Computer Science', specialization: 'Distributed Systems & Cloud Security', user: { id: 20, fullName: 'Dr. Alan Turing', email: 'faculty@campus.edu', phoneNumber: '+1 (555) 014-9921', active: true, department: { name: 'Computer Science & Engineering', code: 'CSE' } } },
  { id: 2, employeeCode: 'FAC-ECE-002', designation: 'Assistant Professor', qualification: 'M.Tech in VLSI', specialization: 'Embedded IoT Systems', user: { id: 21, fullName: 'Prof. Sarah Connor', email: 'prof.sarah@campus.edu', phoneNumber: '+1 (555) 018-7744', active: true, department: { name: 'Electronics & Communication', code: 'ECE' } } }
];

export const mockNotifications = [
  { id: 1, title: 'Leave Request Approved', message: 'Your leave application for upcoming hackathon was approved by Dr. Alan Turing.', type: 'LEAVE_STATUS', read: false, createdAt: '2026-08-14T12:00:00' },
  { id: 2, title: 'Complaint In Progress', message: 'Complaint CMP-2026-8801 status changed to IN PROGRESS.', type: 'COMPLAINT_UPDATE', read: false, createdAt: '2026-08-14T11:00:00' },
  { id: 3, title: 'New Announcement: Mid-Term Schedule', message: 'Mid-term examination schedule has been released.', type: 'ANNOUNCEMENT', read: true, createdAt: '2026-08-14T09:00:00' }
];

export const mockActivityLogs = [
  { id: 1, userEmail: 'admin@campus.edu', action: 'SYSTEM_INIT', entityName: 'Database', entityId: 'ALL', details: 'Initial college departments and sample users generated', ipAddress: '127.0.0.1', timestamp: '2026-08-16T10:00:00' },
  { id: 2, userEmail: 'faculty@campus.edu', action: 'MARK_ATTENDANCE', entityName: 'Attendance', entityId: 'Cloud Computing & DevOps', details: 'Marked 8 sessions of attendance for CSE Semester 6', ipAddress: '192.168.1.50', timestamp: '2026-08-16T09:30:00' },
  { id: 3, userEmail: 'student@campus.edu', action: 'SUBMIT_COMPLAINT', entityName: 'Complaint', entityId: 'CMP-2026-8801', details: 'Submitted Wi-Fi connectivity issue in Library', ipAddress: '192.168.1.102', timestamp: '2026-08-15T14:20:00' }
];
