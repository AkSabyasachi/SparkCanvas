import multer from "multer";

const storage = multer.discStorage({});

export const upload = multer({storage})