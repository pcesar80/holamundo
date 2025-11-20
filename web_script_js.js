// CONFIGURAR ESTOS VALORES CUANDO TENGAS EL REPO
const GITHUB_USER = "pcesar80";
const GITHUB_REPO = "holamundo";
const FILE_PATH = "holamundo/data/data.json"; // ruta dentro del repo
const TOKEN = ""; // ← pega aquí tu token de GitHub

// URL RAW para leer el JSONunction getRawUrl() {
    return `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main/${FILE_PATH}`;
}

// URL API GitHub para escribir
function getApiUrl() {
    return `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${FILE_PATH}`;
}

// === Leer JSON del repo ===
async function loadData() {
    try {
        const res = await fetch(getRawUrl());
        if (!res.ok) throw new Error("No se pudo leer el JSON");
        const data = await res.json();
        document.getElementById("storedValue").textContent = `Dato guardado: ${data.valor}`;
    } catch (e) {
        document.getElementById("storedValue").textContent = "No hay datos aún";
    }
}

// === Guardar JSON en GitHub ===
async function saveData() {
    const value = document.getElementById("inputValue").value;
    if (!value) return alert("Ingrese un valor");

    const newContent = {
        valor: value,
        actualizado: new Date().toISOString()
    };

    // Obtener SHA si el archivo ya existe
    let sha = null;
    try {
        const res = await fetch(getApiUrl());
        if (res.ok) {
            const info = await res.json();
            sha = info.sha;
        }
    } catch {}

    const payload = {
        message: "Actualización desde web",
        content: btoa(JSON.stringify(newContent, null, 2)),
        sha: sha
    };

    const response = await fetch(getApiUrl(), {
        method: "PUT",
        headers: {
            "Authorization": `token ${TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    if (response.ok) {
        alert("Guardado en GitHub!");
        loadData();
    } else {
        alert("Error al guardar en GitHub");
    }
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", loadData);
