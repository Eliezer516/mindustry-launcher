const $ = (id) => document.getElementById(id);
const STORAGE_KEY = "mindustry-launcher.game-executable";
const bannerImages = [
  "https://mindustrygame.github.io/3.88567664.webp",
  "https://mindustrygame.github.io/2.0d4f9a35.webp",
  "https://mindustrygame.github.io/1.d25af17a.webp",
];

let bannerIndex = 0;

function updateBanner() {
  $("banner-image").src = bannerImages[bannerIndex];
  bannerIndex = (bannerIndex + 1) % bannerImages.length;
}

function getStoredGamePath() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function setStoredGamePath(path) {
  if (!path) return;

  try {
    localStorage.setItem(STORAGE_KEY, path);
  } catch (err) {
    console.error("No se pudo guardar la ruta del ejecutable:", err);
  }
}

async function pickGameExecutable() {
  const gamePath = await tiny.dialog.openFile({ types: ["exe"] });

  if (!gamePath) {
    return null;
  }

  setStoredGamePath(gamePath);
  return gamePath;
}

async function ensureGameExecutable() {
  const savedPath = getStoredGamePath();

  if (savedPath) {
    return savedPath;
  }

  return pickGameExecutable();
}

async function launchGame() {
  const gamePath = await ensureGameExecutable();

  if (!gamePath) {
    return;
  }

  await tiny.api.call("openGame", { path: gamePath });
}

async function init() {
  await tiny.api.call("ping");
  await ensureGameExecutable();
  updateBanner();
  setInterval(updateBanner, 4200);
}

$("open-game").addEventListener("click", () =>
  launchGame().catch((e) => console.error(e)),
);
$("select-game").addEventListener("click", () =>
  pickGameExecutable().catch((e) => console.error(e)),
);

init().catch((e) => {
  console.error(e);
});
