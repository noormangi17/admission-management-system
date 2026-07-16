const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Upload folders
const folders = {
  profilePhoto: "uploads/photos",
  marksheet10: "uploads/marksheets",
  marksheet12: "uploads/marksheets",
  idProof: "uploads/idproofs",
};

// Create folders if they don't exist
Object.values(folders).forEach((folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
});

// Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = folders[file.fieldname] || "uploads";
    cb(null, folder);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, `${file.fieldname}-${uniqueName}`);
  },
});

// File Filter
const fileFilter = (req, file, cb) => {
  console.log("=================================");
  console.log("Field Name :", file.fieldname);
  console.log("Original Name :", file.originalname);
  console.log("Extension :", path.extname(file.originalname));
  console.log("Mime Type :", file.mimetype);
  console.log("=================================");

  const allowedExtensions = [".jpg", ".jpeg", ".png", ".pdf"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    return cb(null, true);
  }

  return cb(new Error("Only JPG, JPEG, PNG and PDF files are allowed"));
};
// Multer Upload
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

// Multiple files upload
exports.applicationUpload = upload.fields([
  {
    name: "profilePhoto",
    maxCount: 1,
  },
  {
    name: "marksheet10",
    maxCount: 1,
  },
  {
    name: "marksheet12",
    maxCount: 1,
  },
  {
    name: "idProof",
    maxCount: 1,
  },
]);

// Single file upload
exports.singleUpload = (fieldName) => upload.single(fieldName);