// Utility functions
export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function saveLS(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

export function getLS(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Config
const USE_MOCK = true;
const BASE_URL = "http://localhost:4000";

// Mock API
const mockApi = {
  async getRoom(roomId) {
    const db = getLS("mb_rooms", {});
    if (!db[roomId]) {
      db[roomId] = {
        id: roomId,
        createdAt: Date.now(),
        memes: [],
        votingOpen: false,
        votingClosed: false,
      };
      saveLS("mb_rooms", db);
    }
    return structuredClone(db[roomId]);
  },
  async upload({ roomId, playerName, fileDataUrl }) {
    const db = getLS("mb_rooms", {});
    if (!db[roomId]) throw new Error("Room not found");
    const existingIdx = db[roomId].memes.findIndex(m => m.playerName === playerName);
    const meme = {
      id: existingIdx >= 0 ? db[roomId].memes[existingIdx].id : uid("meme"),
      playerName,
      imageUrl: fileDataUrl,
      votes: db[roomId].memes[existingIdx]?.votes ?? 0,
    };
    if (existingIdx >= 0) db[roomId].memes[existingIdx] = meme;
    else db[roomId].memes.push(meme);
    if (db[roomId].memes.length >= 2) db[roomId].votingOpen = true;
    saveLS("mb_rooms", db);
    return structuredClone(meme);
  },
  async vote({ roomId, memeId, voterId }) {
    const db = getLS("mb_rooms", {});
    if (!db[roomId]) throw new Error("Room not found");
    const room = db[roomId];
    if (!room.votingOpen || room.votingClosed) throw new Error("Voting not active");
    const votesDb = getLS("mb_votes", {});
    const key = `${roomId}:${voterId}`;
    if (votesDb[key]) throw new Error("You have already voted in this battle!");
    const meme = room.memes.find(m => m.id === memeId);
    if (!meme) throw new Error("Meme not found");
    meme.votes += 1;
    votesDb[key] = memeId;
    saveLS("mb_rooms", db);
    saveLS("mb_votes", votesDb);
    return { ok: true };
  },
};

// Real API Fetch
async function realFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
    ...options,
  });
  if (!res.ok) throw new Error((await res.text()) || `Request failed: ${res.status}`);
  const ct = res.headers.get("content-type");
  if (ct && ct.includes("application/json")) return res.json();
  return res.text();
}

// Main API object
export const api = {
  async getRoom(roomId) {
    if (USE_MOCK) return mockApi.getRoom(roomId);
    return realFetch(`/room/${roomId}`);
  },
  async upload({ roomId, playerName, file }) {
    if (USE_MOCK) {
      const fileDataUrl = await fileToDataUrl(file);
      return mockApi.upload({ roomId, playerName, fileDataUrl });
    }
    const fd = new FormData();
    fd.append("roomId", roomId);
    fd.append("playerName", playerName);
    fd.append("file", file);
    return realFetch(`/upload`, { method: "POST", body: fd });
  },
  async vote({ roomId, memeId, voterId }) {
    if (USE_MOCK) return mockApi.vote({ roomId, memeId, voterId });
    return realFetch(`/vote`, {
      method: "POST",
      body: JSON.stringify({ roomId, memeId, voterId }),
    });
  },
};
