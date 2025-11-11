const BASE_URL = "https://rickandmortyapi.com/api/character";
const output = document.getElementById("output");
const allBtn = document.getElementById("allBtn");
const filterBtn = document.getElementById("filterBtn");
const clearBtn = document.getElementById("clearBtn");

function renderCharacters(characters) {
  output.innerHTML = "";
  if (!characters || characters.length === 0) {
    output.innerHTML = `<div id="error">No se encontraron personajes</div>`;
    return;
  }

  characters.forEach(char => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${char.image}" alt="${char.name}">
      <h3>${char.name}</h3>
      <p><strong>Estado:</strong> ${char.status}</p>
      <p><strong>Especie:</strong> ${char.species}</p>
      <p><strong>Género:</strong> ${char.gender}</p>
    `;
    output.appendChild(card);
  });
}

function showError(message) {
  output.innerHTML = `<div id="error">❌ ${message}</div>`;
}

async function getAllCharacters() {
  try {
    output.innerHTML = `<p>Cargando personajes...</p>`;
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Error al obtener personajes");
    const data = await res.json();
    renderCharacters(data.results);
  } catch (err) {
    showError(err.message);
    console.error(err);
  }
}

async function getFilteredCharacters() {
  const name = document.getElementById("name").value.trim();
  const status = document.getElementById("status").value.trim();
  const species = document.getElementById("species").value.trim();
  const type = document.getElementById("type").value.trim();
  const gender = document.getElementById("gender").value.trim();

  const params = new URLSearchParams();
  if (name) params.append("name", name);
  if (status) params.append("status", status);
  if (species) params.append("species", species);
  if (type) params.append("type", type);
  if (gender) params.append("gender", gender);

  try {
    output.innerHTML = `<p>Buscando...</p>`;
    const url = params.toString() ? `${BASE_URL}/?${params.toString()}` : BASE_URL;
    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 404) throw new Error("No se encontraron personajes con esos filtros");
      throw new Error("Error en la solicitud");
    }
    const data = await res.json();
    renderCharacters(data.results);
  } catch (err) {
    showError(err.message);
    console.error(err);
  }
}

function clearFilters() {
  document.getElementById("name").value = "";
  document.getElementById("status").value = "";
  document.getElementById("species").value = "";
  document.getElementById("type").value = "";
  document.getElementById("gender").value = "";
  output.innerHTML = "";
}

allBtn.addEventListener("click", getAllCharacters);
filterBtn.addEventListener("click", getFilteredCharacters);
clearBtn.addEventListener("click", clearFilters);