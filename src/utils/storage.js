import AsyncStorage from "@react-native-async-storage/async-storage";

const CONTACTS_KEY = "caller_app_contacts";
const GRID_KEY = "caller_app_grid";
const AVATAR_KEY = "caller_app_avatar_size";

// ---- Contacts ----
export async function loadContacts() {
  try {
    const data = await AsyncStorage.getItem(CONTACTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function saveContacts(contacts) {
  await AsyncStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
}

// ---- Grid Layout ----
export async function loadGridCols() {
  try {
    const data = await AsyncStorage.getItem(GRID_KEY);
    return data ? parseInt(data, 10) : 3;
  } catch {
    return 3;
  }
}

export async function saveGridCols(cols) {
  await AsyncStorage.setItem(GRID_KEY, String(cols));
}

// ---- Avatar Size ----
export async function loadAvatarSize() {
  try {
    const data = await AsyncStorage.getItem(AVATAR_KEY);
    return data ? parseInt(data, 10) : 80;
  } catch {
    return 80;
  }
}

export async function saveAvatarSize(size) {
  await AsyncStorage.setItem(AVATAR_KEY, String(size));
}

// ---- Generate ID ----
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
