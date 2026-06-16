const crypto = require('crypto');
const path = require('path');
const {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand
} = require('@aws-sdk/client-s3');
const s3 = require('../config/objectStorage');

function normalizeFileName(fileName) {
  if (!fileName) return null;

  const decodedFileName = Buffer.from(fileName, 'latin1').toString('utf8');

  // 변환 결과가 깨졌다면 원래 값을 그대로 사용합니다.
  if (decodedFileName.includes('�')) {
    return fileName;
  }

  return decodedFileName;
}

function createObjectKey(originalName) {
  const safeName = normalizeFileName(originalName) || 'upload-file';
  const ext = path.extname(safeName);
  const today = new Date().toISOString().slice(0, 10).replaceAll('-', '/');

  // 예: diaries/2026/06/15/uuid.png
  return `diaries/${today}/${crypto.randomUUID()}${ext}`;
}

async function uploadFileToObjectStorage(file) {
  if (!file) return null;

  const originalFileName = normalizeFileName(file.originalname);
  const objectKey = createObjectKey(file.originalname);

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.NCP_BUCKET,
      Key: objectKey,
      Body: file.buffer,
      ContentType: file.mimetype
    })
  );

  return {
    storedFileName: objectKey,
    originalFileName,
    fileSize: file.size
  };
}

async function getFileFromObjectStorage(objectKey) {
  return s3.send(
    new GetObjectCommand({
      Bucket: process.env.NCP_BUCKET,
      Key: objectKey
    })
  );
}

async function deleteFileFromObjectStorage(objectKey) {
  if (!objectKey) return;

  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.NCP_BUCKET,
      Key: objectKey
    })
  );
}

module.exports = {
  uploadFileToObjectStorage,
  getFileFromObjectStorage,
  deleteFileFromObjectStorage
};
