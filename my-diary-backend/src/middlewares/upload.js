const multer = require('multer');

// Object Storage에 업로드하기 위해 파일을 서버 디스크가 아니라 메모리에 잠시 보관합니다.
// req.file.buffer 안에 업로드된 파일 데이터가 들어갑니다.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

module.exports = upload;
