// detect backend host automatically
const API_BASE = "http://localhost:5000";

async function loadItems(filter = "all", search = "") {
  const res = await fetch(`${API_BASE}/api/items`);
  let items = await res.json();

  // Apply filter + search
  items = items.filter(item =>
    (filter === "all" || item.status === filter) &&
    (item.name.toLowerCase().includes(search.toLowerCase()) ||
     (item.description && item.description.toLowerCase().includes(search.toLowerCase())))
  );

  const list = document.getElementById("itemsList");
  list.innerHTML = "";

  if (items.length === 0) {
    list.innerHTML = `<p class="text-center text-muted">No items found.</p>`;
    return;
  }

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "col-md-4 mb-4";

    card.innerHTML = `
      <div class="card item-card shadow-sm h-100">
        <img src="${item.image ? API_BASE + item.image : 'https://via.placeholder.com/300'}" 
             class="card-img-top item-img" alt="Item Image">
        <div class="card-body">
          <h5 class="card-title">${item.name}</h5>
          <p class="card-text">${item.description || "No description"}</p>
          <p><small>📍 ${item.location} | 📅 ${item.date}</small></p>
          <span class="badge bg-${item.status === "lost" ? "danger" : "success"}">${item.status.toUpperCase()}</span>
        </div>
        <div class="card-footer text-center">
          <a href="mailto:${item.contact}" class="btn btn-outline-primary btn-sm">Contact</a>
        </div>
      </div>
    `;
    list.appendChild(card);
  });
}

// Submit form
document.getElementById("itemForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  await fetch(`${API_BASE}/api/items`, {
    method: "POST",
    body: formData
  });

  e.target.reset();
  loadItems();

  // Close modal
  const modal = bootstrap.Modal.getInstance(document.getElementById("reportModal"));
  modal.hide();
});

// Filter dropdown
document.getElementById("filterStatus").addEventListener("change", (e) => {
  loadItems(e.target.value, document.getElementById("searchBar").value);
});

// Search bar
document.getElementById("searchBar").addEventListener("input", (e) => {
  loadItems(document.getElementById("filterStatus").value, e.target.value);
});

// Initial load
loadItems();
