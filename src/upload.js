import multer from "multer";

// Maximum file sizes
const IMAGE_LIMIT = 1 * 1024 * 1024; // 1 MB
const PDF_LIMIT = 2 * 1024 * 1024; // 2 MB

// Store uploaded files temporarily in memory.
const upload = multer({
  storage: multer.memoryStorage(),

  // Maximum size Multer accepts for any single file.
  limits: {
    fileSize: PDF_LIMIT,
    files: 1,
    fields: 2,
  },

  // Allow only images and PDFs.
  fileFilter(_req, file, callback) {
    const isImage = file.mimetype.startsWith("image/");
    const isPDF = file.mimetype === "application/pdf";

    if (!isImage && !isPDF) {
      const error = new Error("Only images and PDFs are allowed.");
      error.status = 400;
      return callback(error);
    }

    callback(null, true);
  },
});

// Accept one image or one PDF.
export const uploadFiles = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "pdf", maxCount: 1 },
]);

// Validate uploaded files before sending them to Gemini.
export function validateUploads(req, res, next) {
  const image = req.files?.image?.[0];
  const pdf = req.files?.pdf?.[0];

  // Do not allow an image and PDF in the same request.
  if (image && pdf) {
    return res
      .status(400)
      .type("text")
      .send("Please attach either an image or a PDF, not both.");
  }

  // Images must be 2 MB or smaller.
  if (image && image.size > IMAGE_LIMIT) {
    return res.status(413).type("text").send("Images must be 2 MB or smaller.");
  }

  // PDFs must be 5 MB or smaller.
  if (pdf && pdf.size > PDF_LIMIT) {
    return res.status(413).type("text").send("PDFs must be 5 MB or smaller.");
  }

  next();
}
