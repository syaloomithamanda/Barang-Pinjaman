const canvas = document.getElementById("signature-pad");
const ctx = canvas.getContext("2d");

let drawing = false;

// Event listeners untuk mouse
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseleave", stopDrawing);

// Event listeners untuk sentuhan (mobile)
canvas.addEventListener("touchstart", startDrawingTouch);
canvas.addEventListener("touchend", stopDrawing);
canvas.addEventListener("touchmove", drawTouch);

// Fungsi memulai gambar (mouse)
function startDrawing(event) {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);
}

// Fungsi memulai gambar (touch)
function startDrawingTouch(event) {
    event.preventDefault();
    drawing = true;
    const { x, y } = getTouchPos(event);
    ctx.beginPath();
    ctx.moveTo(x, y);
}

// Fungsi menggambar (mouse)
function draw(event) {
    if (!drawing) return;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
}

// Fungsi menggambar (touch)
function drawTouch(event) {
    event.preventDefault();
    if (!drawing) return;
    const { x, y } = getTouchPos(event);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctx.lineTo(x, y);
    ctx.stroke();
}

// Fungsi berhenti menggambar
function stopDrawing() {
    drawing = false;
    ctx.beginPath();
}

// Fungsi mendapatkan koordinat sentuhan yang benar
function getTouchPos(event) {
    const rect = canvas.getBoundingClientRect();
    const touch = event.touches[0]; // Ambil sentuhan pertama
    return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
    };
}

// Fungsi menghapus tanda tangan
function clearSignature() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
}

// Fungsi mengonversi canvas ke gambar (JPEG)
function convertCanvasToImage() {
    let tempCanvas = document.createElement("canvas");
    let tempCtx = tempCanvas.getContext("2d");

    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    // Set background putih
    tempCtx.fillStyle = "white";
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Salin gambar dari canvas asli ke tempCanvas
    tempCtx.drawImage(canvas, 0, 0);

    return tempCanvas.toDataURL("image/jpeg"); // Konversi ke format JPEG
}



document.getElementById("peminjamanForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let dataURL = convertCanvasToImage(); // Gunakan fungsi baru

    let formData = {
                Nama: document.getElementById("nama").value,
                NIP: document.getElementById("nip").value,
                Alamat: document.getElementById("alamat").value,
                JenisBarang: document.getElementById("jenisBarang").value,
                JumlahBarang: document.getElementById("jumlahBarang").value,
                KodeBarang: document.getElementById("kodeBarang").value,
                KondisiBarang: document.getElementById("kondisiBarang").value,
                Kelengkapan: document.getElementById("kelengkapan").value,
                Status: document.getElementById("statusPeminjaman").value,
                TujuanPeminjaman: document.getElementById("tujuanPeminjaman").value,
                TanggalPinjam: document.getElementById("tanggalPinjam").value,
                TanggalKembali: document.getElementById("tanggalKembali").value,
                Tanda_tangan: dataURL
    };

    fetch("https://script.google.com/macros/s/AKfycbxnZAWYqnIgUOauh9G6NtJlwGgHwNxv287_jMDH0-fdEB6Bm6VIE9WMA7OY8RcCqbHV/exec", {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    })
    .then(response => response.text())
    .then(text => {
        console.log("Raw response:", text);
        
    })
    .then(data => {
        
        document.getElementById("success-message").style.display = "block";

        alert(data.message);
        document.getElementById("peminjamanForm").reset();
        clearSignature();
    })
    .catch(error => {
        console.error("Fetch error:", error);
    });
});



function ubahJumlah(n) {
    let input = document.getElementById("jumlahBarang");
    let nilai = parseInt(input.value) || 0;
    nilai += n;
    if (nilai < 1) nilai = 1;
    input.value = nilai;
}

function closeAndReload() {
    document.getElementById("success-message").style.display = "none";  
    location.reload(); // Reload halaman setelah ditutup
}
