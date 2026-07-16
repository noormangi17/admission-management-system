require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");

const User = require("../models/User");
const Course = require("../models/Course");
const Application = require("../models/Application");
const Settings = require("../models/Settings");

const statuses = [
  "pending",
  "under_review",
  "approved",
  "rejected",
];

const run = async () => {
  await connectDB();

  console.log("Clearing existing data...");

  await Promise.all([
    User.deleteMany({}),
    Course.deleteMany({}),
    Application.deleteMany({}),
    Settings.deleteMany({}),
  ]);

  console.log("Creating users...");

  const superAdmin = await User.create({
    name: "Super Admin",
    email: "superadmin@college.com",
    password: "Admin@123",
    role: "superadmin",
    phone: "03000000001",
  });

  const officer = await User.create({
    name: "Admission Officer",
    email: "officer@college.com",
    password: "Officer@123",
    role: "officer",
    phone: "03000000002",
  });

  const student = await User.create({
    name: "Demo Student",
    email: "student@gmail.com",
    password: "Student@123",
    role: "student",
    phone: "03000000003",
  });

  console.log("Creating courses...");

  const courseData = [
    {
      courseName: "BS Computer Science",
      duration: "4 Years",
      totalSeats: 60,
      eligibility:
        "Intermediate (ICS, FSc Pre-Engineering, FSc Pre-Medical, or equivalent) with at least 50% marks",
      fee: 400000,
      description: "Bachelor of Science in Computer Science",
    },
    {
      courseName: "BS Software Engineering",
      duration: "4 Years",
      totalSeats: 60,
      eligibility:
        "Intermediate (ICS, FSc Pre-Engineering, FSc Pre-Medical, or equivalent) with at least 50% marks",
      fee: 420000,
      description: "Bachelor of Science in Software Engineering",
    },
    {
      courseName: "BS Artificial Intelligence",
      duration: "4 Years",
      totalSeats: 50,
      eligibility:
        "Intermediate (ICS, FSc Pre-Engineering, FSc Pre-Medical, or equivalent) with at least 50% marks",
      fee: 430000,
      description: "Bachelor of Science in Artificial Intelligence",
    },
    {
      courseName: "Bachelor of Business Administration (BBA)",
      duration: "4 Years",
      totalSeats: 80,
      eligibility:
        "Intermediate (FA, FSc, ICS, ICom or equivalent) with at least 45% marks",
      fee: 250000,
      description: "Bachelor of Business Administration",
    },
    {
      courseName: "Bachelor of Education (B.Ed)",
      duration: "4 Years",
      totalSeats: 40,
      eligibility:
        "Intermediate (FA, FSc, ICS, ICom or equivalent) with at least 45% marks",
      fee: 180000,
      description: "Bachelor of Education",
    },
  ];

  const courses = await Course.insertMany(
    courseData.map((course) => ({
      ...course,
      availableSeats: course.totalSeats,
    }))
  );

  console.log("Users and Courses created successfully.");
    console.log("Creating sample applications...");

  const students = [
    ["Ali Raza", "Ahmed Raza", "Shazia Ahmed"],
    ["Ayesha Khan", "Imran Khan", "Sadia Khan"],
    ["Muhammad Hamza", "Naveed Ahmed", "Samina Ahmed"],
    ["Fatima Noor", "Aslam Sheikh", "Nazia Sheikh"],
    ["Abdullah Tariq", "Tariq Mehmood", "Rukhsana Tariq"],
    ["Zain Ali", "Javed Ali", "Farzana Ali"],
    ["Hira Malik", "Rashid Malik", "Saba Malik"],
    ["Usman Shah", "Nisar Shah", "Shabana Shah"],
    ["Iqra Javed", "Javed Iqbal", "Khalida Javed"],
    ["Hasan Raza", "Akhtar Raza", "Noreen Raza"],
  ];

  for (let i = 0; i < 10; i++) {

    const [fullName, fatherName, motherName] = students[i];

    const application = new Application({
      studentId: student._id,

      personalInfo: {
        fullName,
        fatherName,
        motherName,
        dob: new Date(2004, i % 12, (i % 28) + 1),
        gender: i % 2 === 0 ? "male" : "female",
        email: `student${i + 1}@gmail.com`,
        phone: `03001234${String(i).padStart(3, "0")}`,
        address: `House ${i + 1}, Sukkur, Sindh, Pakistan`,
      },

      academicInfo: {
        previousQualification: "Intermediate",
        percentage: 65 + i,
        passingYear: 2024,
        instituteName: "Government Degree College",
      },

      courseApplied: courses[i % courses.length]._id,

      status: statuses[i % statuses.length],
    });

    await application.save();

    if (application.status !== "pending") {
      application.statusHistory.push({
        status: application.status,
        remark: `Application marked as ${application.status}`,
        changedBy: officer._id,
      });

      await application.save();
    }
  }

  console.log("Applications Created.");

  await Settings.create({
    admissionOpen: true,

    currentSession: "2026-2027",

    collegeDetails: {
      name: "Sukkur IBA University",
      address: "Airport Road, Sukkur, Sindh, Pakistan",
      contact: "+92-71-5644000",
    },
  });

  console.log("");
  console.log("=======================================");
  console.log("DATABASE SEEDED SUCCESSFULLY");
  console.log("=======================================");
  console.log("");
  console.log("Super Admin");
  console.log("Email : superadmin@college.com");
  console.log("Password : Admin@123");
  console.log("");
  console.log("Admission Officer");
  console.log("Email : officer@college.com");
  console.log("Password : Officer@123");
  console.log("");
  console.log("Student");
  console.log("Email : student@gmail.com");
  console.log("Password : Student@123");
  console.log("");
  console.log("=======================================");

  await mongoose.connection.close();

  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});