import { signOut } from "../api/userAPI";

export const getRoleFromToken = (token, role) => {
  const payload = JSON.parse(atob(token.split(".")[1]));
  const isRole = payload.signInfo.role.some((value) => value === role);
  if (isRole) {
    return true;
  } else {
    return false;
  }
};
export const handleSignOut = async () => {
  const userId = localStorage.getItem("userId");
  localStorage.removeItem("userName");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("userDisplayName");
  localStorage.removeItem("isSignIn");
  localStorage.removeItem("email");
  await signOut(userId);
};
