const { Readable } = require('stream');
const diaryService = require('../services/diaryService');

async function list(req, res, next) {
  try {
    const page = req.query.page ?? 0;
    const size = req.query.size ?? 10;
    res.json(await diaryService.getDiaries(page, size));
  } catch (err) {
    next(err);
  }
}

async function detail(req, res, next) {
  try {
    const diary = await diaryService.getDiaryById(req.params.id);
    if (!diary) return res.status(404).json({ message: '다이어리를 찾을 수 없습니다.' });
    res.json(diary);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const diary = await diaryService.createDiary(req.body, req.file);
    res.status(201).json(diary);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const diary = await diaryService.updateDiary(req.params.id, req.body, req.file);
    if (!diary) return res.status(404).json({ message: '다이어리를 찾을 수 없습니다.' });
    res.json(diary);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const ok = await diaryService.deleteDiary(req.params.id);
    if (!ok) return res.status(404).json({ message: '다이어리를 찾을 수 없습니다.' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function download(req, res, next) {
  try {
    const info = await diaryService.getDownloadInfo(req.params.id);
    if (!info) return res.status(404).json({ message: '파일을 찾을 수 없습니다.' });

    const encodedFileName = encodeURIComponent(info.originalFileName);

    res.setHeader('Content-Type', info.contentType);
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodedFileName}`);

    if (info.body.pipe) {
      info.body.pipe(res);
      return;
    }

    // 일부 런타임에서 Web Stream으로 반환될 때 대비합니다.
    Readable.fromWeb(info.body).pipe(res);
  } catch (err) {
    next(err);
  }
}

module.exports = { list, detail, create, update, remove, download };
