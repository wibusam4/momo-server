export const showInternal = (res, error) => {
  console.error(error);
  return res.status(500).json({ success: false, message: error });
};

export const showNotFound = (res, message) => {
  return res.status(404).json({ success: false, message });
};

export const showMissing = (res, message) => {
  return res.status(400).json({ success: false, message });
};

export const showSuccess = (res, message) => {
  return res.status(200).json({ success: true, message });
};
