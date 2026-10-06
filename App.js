let students = [
  { nim: "231001", nama: "Andi Pratama", jurusan: "Informatika", email: "andi@mail.com" },
  { nim: "231002", nama: "Siti Aisyah", jurusan: "Sistem Informasi", email: "siti@mail.com" },
  { nim: "231003", nama: "Budi Santoso", jurusan: "Teknik Komputer", email: "budi@mail.com" },
  { nim: "231004", nama: "Nina Marlina", jurusan: "Manajemen", email: "nina@mail.com" },
  { nim: "231005", nama: "Rizky Pratama", jurusan: "Informatika", email: "ricky@mail.com" },
  { nim: "231006", nama: "Dewi Lestari", jurusan: "Sistem Informasi", email: "dewi@mail.com" },
  { nim: "231007", nama: "Fajar Nugroho", jurusan: "Teknik Komputer", email: "fajar@mail.com" },
  { nim: "231008", nama: "Maya Putri", jurusan: "Manajemen", email: "maya@mail.com" },
  { nim: "231009", nama: "Hendra Wijaya", jurusan: "Informatika", email: "hendra@mail.com" },
  { nim: "231010", nama: "Laila Zahra", jurusan: "Sistem Informasi", email: "laila@mail.com" },
  { nim: "231011", nama: "Oka Saputra", jurusan: "Teknik Komputer", email: "oka@mail.com" },
  { nim: "231012", nama: "Putri Ayu", jurusan: "Manajemen", email: "putri@mail.com" },
  { nim: "231013", nama: "Rama Dhani", jurusan: "Informatika", email: "rama@mail.com" },
  { nim: "231014", nama: "Sari Wulandari", jurusan: "Sistem Informasi", email: "sari@mail.com" },
  { nim: "231015", nama: "Tono Hartono", jurusan: "Teknik Komputer", email: "tono@mail.com" }
];

const PER_PAGE = 5;
let page = 1;
let editingNim = null;

const $ = (id) => document.getElementById(id);
const form = $("form");
const pad = (n) => String(n).padStart(2, "0");

function filtered() {
  const q = $("search").value.trim().toLowerCase();
  return students.filter((s) => s.nama.toLowerCase().includes(q) || s.nim.includes(q));
}

function render() {
  const data = filtered();
  const pages = Math.max(1, Math.ceil(data.length / PER_PAGE));
  page = Math.min(page, pages);
  const start = (page - 1) * PER_PAGE;
  const rows = data.slice(start, start + PER_PAGE);

  $("tbody").innerHTML = rows.length
    ? rows.map((s, i) => `
      <tr>
        <td class="no">${pad(start + i + 1)}</td>
        <td>${s.nim}</td>
        <td class="nama">${s.nama}</td>
        <td><span class="badge">${s.jurusan}</span></td>
        <td>${s.email}</td>
        <td><div class="actions">
          <button class="action edit" data-edit="${s.nim}">Edit</button>
          <button class="action delete" data-del="${s.nim}">Hapus</button>
        </div></td>
      </tr>`).join("")
    : `<tr><td colspan="6" class="empty">Tidak ada data yang cocok. Coba kata kunci lain.</td></tr>`;

  $("count").textContent = `${pad(data.length)} data`;
  $("info").innerHTML = data.length
    ? `Menampilkan <b>${start + 1}–${start + rows.length}</b> dari <b>${data.length}</b> mahasiswa`
    : "Tidak ada mahasiswa";

  let btns = `<button ${page === 1 ? "disabled" : ""} data-page="${page - 1}">&lsaquo;</button>`;
  for (let p = 1; p <= pages; p++) {
    btns += `<button class="${p === page ? "active" : ""}" data-page="${p}">${p}</button>`;
  }
  btns += `<button ${page === pages ? "disabled" : ""} data-page="${page + 1}">&rsaquo;</button>`;
  $("pagination").innerHTML = btns;
}

function resetForm() {
  form.reset();
  editingNim = null;
  $("nim").readOnly = false;
  $("btn-simpan").textContent = "Simpan data";
  document.querySelector("#form").closest(".card").querySelector("h2").textContent = "Tambah mahasiswa";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const item = {
    nim: $("nim").value.trim(),
    nama: $("nama").value.trim(),
    jurusan: $("jurusan").value,
    email: $("email").value.trim()
  };
  if (editingNim) {
    students = students.map((s) => (s.nim === editingNim ? item : s));
  } else {
    if (students.some((s) => s.nim === item.nim)) {
      alert("NIM sudah terdaftar. Gunakan NIM lain.");
      return;
    }
    students.push(item);
    page = Math.ceil(students.length / PER_PAGE);
  }
  resetForm();
  render();
});

$("btn-batal").addEventListener("click", resetForm);
$("btn-kosong").addEventListener("click", resetForm);
$("search").addEventListener("input", () => { page = 1; render(); });

$("tbody").addEventListener("click", (e) => {
  const edit = e.target.dataset.edit;
  const del = e.target.dataset.del;
  if (edit) {
    const s = students.find((x) => x.nim === edit);
    $("nim").value = s.nim; $("nim").readOnly = true;
    $("nama").value = s.nama;
    $("jurusan").value = s.jurusan;
    $("email").value = s.email;
    editingNim = s.nim;
    $("btn-simpan").textContent = "Perbarui data";
    form.closest(".card").querySelector("h2").textContent = "Ubah mahasiswa";
    $("nama").focus();
  }
  if (del && confirm("Hapus data mahasiswa ini?")) {
    students = students.filter((s) => s.nim !== del);
    render();
  }
});

$("pagination").addEventListener("click", (e) => {
  const p = e.target.dataset.page;
  if (p) { page = Number(p); render(); }
});

render();
