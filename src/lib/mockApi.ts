export interface TrashLocation {
  id: string;
  lat: number;
  lng: number;
  name: string;
  beach: string;
  types: string[];
  address: string;
}

const STORAGE_KEY = "ecopraia:trashes";

function load(): TrashLocation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as TrashLocation[];
  } catch (err) {
    console.error("mockApi load error", err);
    return [];
  }
}

function save(items: TrashLocation[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("mockApi save error", err);
  }
}

export async function getAllTrashes(): Promise<TrashLocation[]> {
  // simulate network latency
  await new Promise((r) => setTimeout(r, 250));
  return load();
}

export async function addTrash(t: Omit<TrashLocation, "id">): Promise<TrashLocation> {
  await new Promise((r) => setTimeout(r, 250));
  const items = load();
  const newItem: TrashLocation = { ...t, id: String(Date.now()) };
  items.push(newItem);
  save(items);
  return newItem;
}

export async function clearAll(): Promise<void> {
  await new Promise((r) => setTimeout(r, 50));
  save([]);
}

export default { getAllTrashes, addTrash, clearAll };
