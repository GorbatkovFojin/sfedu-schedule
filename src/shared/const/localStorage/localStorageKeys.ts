export const USER_GROUP = "USER_GROUP";
export const USER_FAVORITE_SEARCH = "USER_FAVORITE_SEARCH";
export const IS_BUTTONS_BLOCKED = "IS_BUTTONS_BLOCKED";
export const SAVED_SCHEDULE = "SAVED_SCHEDULE";
export const USER_VPK = "USER_VPK";

export const VPK_FROM_LOCALSTORAGE = JSON.parse(
  localStorage.getItem(USER_VPK) ||
    JSON.stringify({
      group: "",
      name: "",
      id: "",
    }),
);
