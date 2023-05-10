import express, { Application, Request, Response } from "express";
import multer from "multer";
import fs, { promises } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const app: Application = express();
const port: number = 5000;

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public");
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

let upload = multer({ storage });

async function getImages() {
  const files = await promises.readdir("public");
  const images = files.map((img) => {
    return {
      id: uuidv4(),
      imgUrl: img,
    };
  });
  return images;
}

app.use(express.static("public"));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS,POST,GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/get-images", async (req: Request, res: Response) => {
  try {
    const files = await getImages();
    res.status(200).send(files);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.post(
  "/upload-images",
  upload.array("images"),
  (req: Request, res: Response) => {}
);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
