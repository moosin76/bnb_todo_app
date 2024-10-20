const fs = require('fs');
const sharp = require('sharp');

module.exports = async (uploadPath, filename, width, height) => {

	// 캐쉬 폴더를 없으면 생성
	const cachePath = uploadPath + '/cache';
	if (!fs.existsSync(cachePath)) {
		fs.mkdirSync(cachePath, { recursive: true });
	}

	const ext = filename.substr(filename.lastIndexOf('.'));
	let destFilename = filename.substr(0, filename.lastIndexOf('.'))
	console.log(destFilename, ext, width, height);
	destFilename += width ? `_w${width}` : '';
	destFilename += height ? `_h${height}` : "";
	destFilename += ext;
	console.log("destFilename", destFilename);
	const destPath = cachePath + '/' + destFilename;
	console.log("destpath", destPath);

	// 파일 있으면 이넘의 패스 넘기면 되고
	if (fs.existsSync(destPath)) {
		return destPath;
	} else {// 없으면 만들어서 넘기면 됩니다.
		const srcPath = uploadPath + '/' + filename;
		await sharp(srcPath).resize(width || null, height || null).toFile(destPath);
		return destPath;
	}
}