// change if backend runs on different host/port
const API_BASE = "http://localhost:5000/api/v1";

const authView = document.getElementById("authView");
const dashboardView = document.getElementById("dashboardView");
const dashMsg = document.getElementById("dashMsg");
const userName = document.getElementById("userName");
const taskList = document.getElementById("taskList");

function getToken() {
  return localStorage.getItem("token");
}
function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
}
function setAuth(data) {
  if (data.token) localStorage.setItem("token", data.token);
  if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
}
function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

function showMsg(el, text, isError) {
  if (!el) return;
  el.textContent = text;
  el.className = "msg " + (isError ? "err" : "ok");
  el.classList.remove("hidden");
}

function showDashMsg(text, isError) {
  showMsg(dashMsg, text, isError);
}

function checkAuth() {
  if (getToken()) {
    authView.classList.add("hidden");
    dashboardView.classList.remove("hidden");
    const u = getUser();
    userName.textContent = u.username ? `Hi, ${u.username}` : "Dashboard";
    loadTasks();
  } else {
    authView.classList.remove("hidden");
    dashboardView.classList.add("hidden");
  }
}

async function api(path, options = {}) {
  const url = API_BASE + path;
  const headers = { "Content-Type": "application/json", ...options.headers };
  const token = getToken();
  if (token) headers["Authorization"] = "Bearer " + token;
  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

// Register
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const body = {
    username: form.username.value.trim(),
    email: form.email.value.trim(),
    password: form.password.value,
  };
  const { ok, data } = await api("/auth/register", { method: "POST", body: JSON.stringify(body) });
  if (ok) {
    setAuth(data);
    checkAuth();
  } else {
    const authMsg = document.getElementById("authMsg");
    showMsg(authMsg, data.message || "Register failed", true);
  }
});

// Login
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const body = { username: form.username.value.trim(), password: form.password.value };
  const { ok, data } = await api("/auth/login", { method: "POST", body: JSON.stringify(body) });
  if (ok) {
    setAuth(data);
    checkAuth();
  } else {
    const authMsg = document.getElementById("authMsg");
    showMsg(authMsg, data.message || "Login failed", true);
  }
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  clearAuth();
  checkAuth();
});

// Load tasks
async function loadTasks() {
  const user = getUser();
  const uid = user.id || "";
  const { ok, data } = await api("/tasks?user=" + encodeURIComponent(uid));
  if (!ok) {
    showDashMsg(data.message || "Failed to load tasks", true);
    return;
  }
  const tasks = data.tasks || [];
  taskList.innerHTML = tasks.length === 0 ? "<p>No tasks. Add one above.</p>" : tasks.map((t) => `
    <div class="card" data-id="${t._id}">
      <h3>${escapeHtml(t.title)}</h3>
      <p>${escapeHtml(t.description)}</p>
      <p><strong>Status:</strong> ${escapeHtml(t.status)}</p>
      <div class="card-actions">
        <button type="button" data-action="edit">Edit</button>
        <button type="button" data-action="delete">Delete</button>
      </div>
    </div>
  `).join("");
  taskList.querySelectorAll("[data-action=delete]").forEach((btn) => {
    btn.addEventListener("click", () => deleteTask(btn.closest(".card").dataset.id));
  });
  taskList.querySelectorAll("[data-action=edit]").forEach((btn) => {
    btn.addEventListener("click", () => editTask(btn.closest(".card")));
  });
}

function escapeHtml(s) {
  const div = document.createElement("div");
  div.textContent = s;
  return div.innerHTML;
}

// Add task
document.getElementById("taskForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const user = getUser();
  const body = {
    title: form.title.value.trim(),
    description: form.description.value.trim(),
    status: form.status.value,
    user: user.id,
  };
  const { ok, data } = await api("/tasks/add", { method: "POST", body: JSON.stringify(body) });
  if (ok) {
    showDashMsg(data.message || "Task created", false);
    form.reset();
    loadTasks();
  } else {
    showDashMsg(data.message || "Failed to add task", true);
  }
});

async function deleteTask(id) {
  const { ok, data } = await api("/tasks/delete", { method: "DELETE", body: JSON.stringify({ id }) });
  showDashMsg(ok ? data.message || "Deleted" : data.message || "Delete failed", !ok);
  if (ok) loadTasks();
}

function editTask(card) {
  const id = card.dataset.id;
  const title = card.querySelector("h3").textContent;
  const desc = card.querySelector("p").textContent;
  const statusLine = card.querySelectorAll("p")[1];
  const status = (statusLine?.textContent || "").replace(/^Status:\s*/i, "").trim() || "pending";
  const newTitle = prompt("Title", title);
  if (newTitle === null) return;
  const newDesc = prompt("Description", desc);
  if (newDesc === null) return;
  const newStatus = prompt("Status (pending / in-progress / completed)", status);
  if (newStatus === null) return;
  api("/tasks/update", {
    method: "PUT",
    body: JSON.stringify({ id, title: newTitle, description: newDesc, status: newStatus }),
  }).then(({ ok, data }) => {
    showDashMsg(ok ? data.message || "Updated" : data.message || "Update failed", !ok);
    if (ok) loadTasks();
  });
}

checkAuth();
