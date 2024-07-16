export const removeCookies = (res) => {
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
};
