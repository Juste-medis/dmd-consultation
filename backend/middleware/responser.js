
module.exports = (res, data) => {
  if (data) {
    res.status(200).json(data);
  } else {
    res.status(200).json({ message: "no item" });
  }
};
