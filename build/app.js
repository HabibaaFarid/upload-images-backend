"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
require("dotenv").config();
const app = (0, express_1.default)();
let storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public");
    },
    filename: function (req, file, cb) {
        console.log(file);
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    },
});
let upload = (0, multer_1.default)({ storage });
function getImages() {
    return __awaiter(this, void 0, void 0, function* () {
        const files = yield fs_1.promises.readdir("public");
        const images = files.map((img) => {
            return {
                id: (0, uuid_1.v4)(),
                imgUrl: img,
            };
        });
        return images;
    });
}
app.use(express_1.default.static("public"));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS,POST,GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});
app.get("/get-images", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = yield getImages();
        res.status(200).send(files);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
app.post("/upload-images", upload.array("images"), (req, res) => { });
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});
