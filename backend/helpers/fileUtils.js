var fs = require("fs");
const { extname } = require("path");
const Global = require("../Ressources/fr/Globals");

module.exports = {
  validateFile: (file, type, size) => {
    if (type(file.name)) {
      if (file.size <= size) {
        return true;
      } else {
        return Global.STRINGS.incorect_file_size;
      }
    } else {
      return Global.STRINGS.incorect_file_type;
    }
  },
  /**
   *deplacer les fichiers @param {compar} a property
   */
  File_Mover: (oldtpath, newpath) => {
    let dirpath = newpath.substring(0, newpath.lastIndexOf("/"));
    if (!fs.existsSync(dirpath)) {
      fs.mkdirSync(dirpath, { recursive: true });
    }
    fs.rename(oldtpath, newpath, function (err) {
      if (err) throw err;
      return 10;
    });
  },
  file_namefy: function (dir, filename) {
    return (
      dir +
      "/" +
      filename.split(".").slice(0, -1).join(".").replace(/\s+/g, "_") +
      "_" +
      Date.now() +
      extname(filename)
    );
  },
  isImage: (filename) => {
    var ext = extname(filename);
    switch (ext.toLowerCase()) {
      case ".jpg":
      case ".jpeg":
      case ".svg":
      case ".bmp":
      case ".png":
        return true;
    }
    return false;
  },
  isCv: (filename) => {
    var ext = extname(filename);
    switch (ext.toLowerCase()) {
      case ".jpg":
      case ".jpeg":
      case ".bmp":
      case ".png":
      case ".pdf":
      case ".word":
      case ".wordx":
      case ".txt":
        return true;
    }
    return false;
  },
  isVideo: (filename) => {
    var ext = extname(filename);
    switch (ext.toLowerCase()) {
      case ".m4v":
      case ".avi":
      case ".mpg":
      case ".mp4":
        return true;
    }
    return false;
  },
};
