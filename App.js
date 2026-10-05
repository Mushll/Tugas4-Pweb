// ===== DATA AWAL =====
const defaultStudents = [
    { nim: "231001", nama: "Andi Pratama",  jurusan: "Informatika",      email: "andi@mail.com" },
    { nim: "231002", nama: "Siti Aisyah",   jurusan: "Sistem Informasi", email: "siti@mail.com" },
    { nim: "231003", nama: "Budi Santoso",  jurusan: "Teknik Komputer",  email: "budi@mail.com" },
    { nim: "231004", nama: "Nina Marlina",  jurusan: "Manajemen",        email: "nina@mail.com" },
    { nim: "231005", nama: "Rizky Pratama", jurusan: "Informatika",      email: "rizky@mail.com" }
];

const PAGE_SIZE = 5;
let students = JSON.parse(localStorage.getItem("students")) || defaultStudents;
let editingNim = null;   // null = mode tambah, berisi NIM = mode edit
let currentPage = 1;
let keyword = "";

// ===== ELEMEN =====
const form       = document.getElementById("studentForm");
const inputNim   = document.getElementById("nim");
const inputNama  = document.getElementById("nama");
const inputJur   = document.getElementById("jurusan");
const inputEmail = document.getElementById("email");
const message    = document.getElementById("message");
const saveLabel  = document.getElementById("saveLabel");
const btnCancel  = document.getElementById("btnCancel");
const tbody      = document.getElementById("studentBody");
const pagination = document.getElementById("pagination");
const searchInput = document.getElementById("searchInput");
const searchBtn   = document.getElementById("searchBtn");

// ===== UTIL =====
function save() {
    localStorage.setItem("students", JSON.stringify(students));
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function showMessage(text, type) {
    message.textContent = text;
    message.className = "message " + type;
}

function getFiltered() {
    const k = keyword.toLowerCase();
    return students.filter(s =>
        Object.values(s).some(v => v.toLowerCase().includes(k))
    );
}

// ===== RENDER TABEL =====
function renderTable() {
    const data = getFiltered();
    const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * PAGE_SIZE;
    const pageData = data.slice(start, start + PAGE_SIZE);

    if (pageData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="empty">Data tidak ditemukan</td></tr>`;
    } else {
        tbody.innerHTML = pageData.map((s, i) => `
            <tr>
                <td>${start + i + 1}</td>
                <td>${escapeHtml(s.nim)}</td>
                <td>${escapeHtml(s.nama)}</td>
                <td>${escapeHtml(s.jurusan)}</td>
                <td>${escapeHtml(s.email)}</td>
                <td>
                    <div class="actions">
                        <button class="action edit" data-nim="${escapeHtml(s.nim)}" title="Edit"><svg class="icon" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25zM20.7 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
                        <button class="action delete" data-nim="${escapeHtml(s.nim)}" title="Hapus"><svg class="icon" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg></button>
                    </div>
                </td>
            </tr>
        `).join("");
    }

    renderPagination(totalPages);
}

// ===== RENDER PAGINATION =====
function renderPagination(totalPages) {
    let html = `<button data-page="1">«</button>`;
    for (let p = 1; p <= totalPages; p++) {
        html += `<button data-page="${p}" class="${p === currentPage ? "active" : ""}">${p}</button>`;
    }
    html += `<button data-page="${Math.min(currentPage + 1, totalPages)}">›</button>`;
    html += `<button data-page="${totalPages}">»</button>`;
    pagination.innerHTML = html;
}

pagination.addEventListener("click", e => {
    const btn = e.target.closest("button");
    if (!btn) return;
    currentPage = Number(btn.dataset.page);
    renderTable();
});

// ===== FORM: TAMBAH / UBAH =====
function resetForm() {
    form.reset();
    editingNim = null;
    inputNim.disabled = false;
    saveLabel.textContent = "Simpan";
    message.className = "message";
    message.textContent = "";
}

form.addEventListener("submit", e => {
    e.preventDefault();

    const student = {
        nim: inputNim.value.trim(),
        nama: inputNama.value.trim(),
        jurusan: inputJur.value,
        email: inputEmail.value.trim()
    };

    if (!student.nim || !student.nama || !student.jurusan || !student.email) {
        showMessage("Semua kolom wajib diisi.", "error");
        return;
    }

    if (editingNim === null) {
        if (students.some(s => s.nim === student.nim)) {
            showMessage("NIM sudah terdaftar.", "error");
            return;
        }
        students.push(student);
        showMessage("Data berhasil ditambahkan.", "success");
        currentPage = Math.ceil(students.length / PAGE_SIZE);
    } else {
        const index = students.findIndex(s => s.nim === editingNim);
        students[index] = student;
        showMessage("Data berhasil diperbarui.", "success");
    }

    save();
    const note = message.textContent, type = message.className;
    resetForm();
    message.textContent = note;
    message.className = type;
    renderTable();
});

btnCancel.addEventListener("click", resetForm);
form.addEventListener("reset", () => setTimeout(resetForm, 0));

// ===== EDIT & HAPUS (event delegation) =====
tbody.addEventListener("click", e => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const nim = btn.dataset.nim;

    if (btn.classList.contains("edit")) {
        const s = students.find(x => x.nim === nim);
        inputNim.value = s.nim;
        inputNama.value = s.nama;
        inputJur.value = s.jurusan;
        inputEmail.value = s.email;
        inputNim.disabled = true;
        editingNim = nim;
        saveLabel.textContent = "Update";
        showMessage("Mode edit: ubah data lalu klik Update.", "info");
        inputNama.focus();
    }

    if (btn.classList.contains("delete")) {
        const s = students.find(x => x.nim === nim);
        if (confirm(`Hapus data ${s.nama}?`)) {
            students = students.filter(x => x.nim !== nim);
            save();
            if (editingNim === nim) resetForm();
            renderTable();
        }
    }
});

// ===== SEARCH =====
function doSearch() {
    keyword = searchInput.value.trim();
    currentPage = 1;
    renderTable();
}

searchInput.addEventListener("input", doSearch);
searchBtn.addEventListener("click", doSearch);

// ===== JALANKAN =====
renderTable();
