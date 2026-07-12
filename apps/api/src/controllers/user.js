function getProfile(req, res) {
  return res.status(200).json({ success: true, message: "You are logged in" });
}

export { getProfile };
