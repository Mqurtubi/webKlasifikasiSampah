import "regenerator-runtime";
import "../styles/style.css";
import "../styles/responsive.css";
import * as tf from "@tensorflow/tfjs";

let uploadedImage = null;
let progressBar = require("progressbar.js");
console.log(progressBar);
const imageInput = document.getElementById("imageUpload");
const buttonKlasifikasi = document.getElementById("buttonKlasifikasi");
const containerHasil = document.getElementById("containerHasil");
const logoFile = document.getElementById("logoFile");
const labelFile = document.getElementById("labelFile");
const file = document.getElementById("file");
buttonKlasifikasi.addEventListener("click", () => {
  if (uploadedImage) {
    classifyModel(uploadedImage, displayResults);
    console.log(containerHasil.hasChildNodes());
  } else {
    console.error("No image uploaded.");
  }
  if (containerHasil.hasChildNodes()) {
    containerHasil.removeChild(containerHasil.lastChild);
  }
});
// logoFile.addEventListener("click", () => {
//   imageInput.click();
// });
file.addEventListener("click", () => {
  imageInput.click();
});
// labelFile.addEventListener("click", () => {
//   imageInput.click();
// });

buttonKlasifikasi.addEventListener("click", () => {
  if (buttonKlasifikasi.textContent === "Pilih Gambar") {
    imageInput.click();
  }
});

imageInput.addEventListener("change", (event) => {
  const getFile = event.target.files[0];

  if (getFile) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const previewContainer = document.getElementById("imagePreview");
      const previewImage = document.createElement("img");
      const createButton = document.createElement("button");
      const labelImg = document.getElementById("logoFile");
      const labelFile = document.getElementById("labelFile");

      labelFile.style.display = "none";
      labelImg.style.display = "none";
      buttonKlasifikasi.textContent = "Klasifikasikan";
      buttonKlasifikasi.style.backgroundColor = "#FFC849";

      previewImage.src = e.target.result;
      createButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
      createButton.setAttribute("id", "buttonExit");
      previewImage.setAttribute("width", file.clientWidth);
      previewImage.setAttribute("height", file.clientHeight);
      previewImage.style.borderRadius = "25px";

      // Clear the preview container and add the new image
      previewContainer.innerHTML = "";
      previewContainer.appendChild(previewImage);
      previewContainer.appendChild(createButton);

      // Store the uploaded image
      uploadedImage = new Image();
      uploadedImage.src = e.target.result;
      uploadedImage.onload = () => {
        createButton.addEventListener("click", (e) => {
          e.stopPropagation();
          previewContainer.innerHTML = "<span></span>";
          buttonKlasifikasi.style.backgroundColor = "#ad9866";
          imageInput.value = "";
          labelFile.style.display = "block";
          labelImg.style.display = "block";
          buttonKlasifikasi.textContent = "Pilih Gambar";
          uploadedImage = null;
          console.log(containerHasil.lastChild);
          containerHasil.innerHTML = "";
        });
      };
    };

    reader.readAsDataURL(getFile);
  }
});

async function loadModel() {
  const model = tf.loadGraphModel("/public/model/model.json");

  // Cek model
  try {
    await model;
  } catch (error) {
    throw new Error("Model tidak ditemukan");
  }
  return model;
}

function imageClasses() {
  return {
    0: "Baterai", // 'Battery',
    1: "Biologis", // 'Biological',
    2: "Kaca Coklat", // 'Brown Glass',
    3: "Kardus", // 'Cardboard',
    4: "Pakaian", // 'Clothes',
    5: "Kaca Hijau", // 'Green Glass',
    6: "Logam", // 'Metal',
    7: "Kertas", // 'Paper',
    8: "Plastik", // 'Plastic',
    9: "Sepatu", // 'Shoes',
    10: "Sampah", // 'Trash',
    11: "Kaca Putih", // 'White Glass',
  };
}

function displayResults(results) {
  // Display results in console
  let nilai = 0;
  let classNama;
  for (let i = 0; i < results.length; i++) {
    console.log(results);
    if (nilai < results[i].probability) {
      nilai = results[i].probability;
      classNama = results[i].className;
    }
  }
  const hasil = {
    className: classNama,
    probability: parseInt(nilai * 100),
  };
  return hasil;
}

async function classifyModel(image, setResults) {
  const model = await loadModel();
  const IMAGE_CLASSES = imageClasses();

  const tensorImg = tf.browser
    .fromPixels(image)
    .resizeNearestNeighbor([224, 224])
    .toFloat()
    .expandDims();

  const prediction = await model.predict(tensorImg).data();
  const results = Array.from(prediction)
    .map((probability, index) => {
      return {
        probability: probability,
        className: IMAGE_CLASSES[index],
      };
    })
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 3);
  let kategori = "";
  let penjelasan = "";
  let color = "";
  let penagulangan = "";
  if (setResults(results).className === "Biologis") {
    kategori = "Organik";
    penjelasan =
      "Sampah yang kategori organik biasanya terdiri dari sisa makanan dan daun-daunan yang dapat terurai secara alami.";
    color = "#3E9900";
    penagulangan = `<ul>
    <li>Pemisahan di Sumber: Pastikan untuk memisahkan sampah organik dari anorganik ketika membuang sampah. Gunakan tempat sampah terpisah atau wadah yang berbeda untuk masing-masing jenis sampah ini.</li>
    <li>Pengomposan: Sampah organik dapat diolah melalui pengomposan. Anda dapat menggunakan komposter untuk mengurai sisa-sisa makanan, daun, dan bahan organik lainnya menjadi kompos yang berguna untuk tanaman.</li>
    <li>Penggunaan sebagai Pupuk Kompos: Sampah organik dapat diolah menjadi pupuk kompos yang berguna untuk tanaman. Hal ini dapat dilakukan dengan memasukkan tanah secukupnya ke wadah yang telah diisi sampah organik, lalu disiram dengan air dan diisi dengan arang.</li>
    </ul>`;
  } else if (
    setResults(results).className === "Baterai" ||
    setResults(results).className === "Sampah" ||
    setResults(results).className === "Kaca Coklat"
  ) {
    kategori = "Sampah Berbahaya";
    penjelasan =
      "Sampah yang kategori anorganik meliputi bahan-bahan seperti logam, plastik, kaca, dan kertas yang tidak dapat terurai secara alami dan membutuhkan pengolahan khusus.";
    color = "#CD000E";
    penagulangan = `<ul>
        <li>Pemisahan di Sumber: Memisahkan sampah anorganik dari organik ketika membuang sampah juga sangat penting. Gunakan tempat sampah terpisah atau wadah yang berbeda untuk masing-masing jenis sampah ini.</li>
        <li>Pengomposan: Sampah organik dapat diolah melalui pengomposan. Anda dapat menggunakan komposter untuk mengurai sisa-sisa makanan, daun, dan bahan organik lainnya menjadi kompos yang berguna untuk tanaman.</li>
        <li>Penggunaan sebagai Pupuk Kompos: Sampah organik dapat diolah menjadi pupuk kompos yang berguna untuk tanaman. Hal ini dapat dilakukan dengan memasukkan tanah secukupnya ke wadah yang telah diisi sampah organik, lalu disiram dengan air dan diisi dengan arang.</li>
        </ul>`;
  } else {
    kategori = "Anorganik";
    penjelasan =
      "Sampah yang kategori sampah berbahaya mencakup bahan-bahan yang dapat membahayakan lingkungan atau kesehatan manusia, seperti baterai, limbah biologis, dan beberapa jenis kaca yang mengandung zat berbahaya.";
    color = "#ECB500";
    penagulangan = `<ul>
    <li>Pemisahan di Sumber: Memisahkan sampah anorganik dari organik ketika membuang sampah juga sangat penting. Gunakan tempat sampah terpisah atau wadah yang berbeda untuk masing-masing jenis sampah ini.</li>
    <li>Daur Ulang: Sampah anorganik dapat diolah melalui proses daur ulang yang sesuai dengan jenisnya. Contohnya, kertas dapat didaur ulang menjadi kertas yang baru, sedangkan plastik dapat didaur ulang menjadi produk lain.</li>
    <li>Penggunaan sebagai Kerajinan Daur Ulang: Sampah anorganik dapat diolah menjadi kerajinan daur ulang yang berguna, seperti produk kerajinan dari kertas, kaleng, atau plastik</li>
    </ul>`;
  }
  containerHasil.innerHTML = `
  <div id="headHasil">
          <div class="hasilKlasifikasi">
            <button id="hasilKlasifikasi">Hasil</button>
          </div>
          <div class="penagulangan">
            <button id="penagulangan">Penagulangan</button>
          </div>
        </div>
        <div id="hasil">
            <div class="hasil" style="background-color : ${color}; border-radius:25px 25px 0 0; color:white">
            <h2>Hasil Klasifikasi</h2>
            </div>
        <hr />
        <table>
        <tr>
          <th>Kategori</th>
          <th>: ${kategori}</th>
        </tr>
        <tr>
          <th>Jenis</th>
          <th>: ${setResults(results).className}</th>
        </tr>
        <tr>
          <th>Kecocokan</th>
          <th id="progresBar">: </th>
        </tr>
        </table>
        <hr/>
        <p>
        ${penjelasan}
        </p>
        </div>
  `;
  // <h3>Kategori <span>${kategori}</span></h3>
  // <h3>Jenis <span>${setResults(results).className}</span></h3>
  // <h3>Tingkat Kecocokan</h3>
  // <div id="progresBar"></div>
  // <p>
  //   ${penjelasan}
  // </p>

  const containerElement = document.getElementById("progresBar");
  let bar = new progressBar.Line(containerElement, {
    strokeWidth: 4,
    easing: "easeInOut",
    duration: 1400,
    color: `${color}`,
    trailColor: "#afabab",
    trailWidth: 1,
    svgStyle: { width: "80%", height: "13px" },
    text: {
      style: {
        // Warna teks
        // Default: sama dengan warna garis (options.color)
        color: "white",
        backgroundColor: "transparent",
        position: "absolute",
        left: "150px",
        top: "15px",
        fontSize: "17px",
        padding: 0,
        margin: 0,
        transform: null,
      },
      autoStyleContainer: false,
    },
    from: { color: "#FFEA82" },
    to: { color: "#ED6A5A" },
    step: (state, bar) => {
      bar.setText(Math.round(bar.value() * 100) + " %");
    },
  });

  const buttonPenagulangan = document.getElementById("penagulangan");
  const hasil = document.getElementById("hasil");
  buttonPenagulangan.addEventListener("click", () => {
    hasil.innerHTML = `
    <div class="hasil" style="background-color : ${color}; border-radius:25px 25px 0 0; color:white">
            <h2>Cara Penagulangan</h2>
            </div>
        <hr />
        ${penagulangan}
        
    `;
  });
  const buttonHasil = document.getElementById("hasilKlasifikasi");
  buttonHasil.addEventListener("click", () => {
    hasil.innerHTML = `
    <div class="hasil" style="background-color : ${color}; border-radius:25px 25px 0 0; color:white">
            <h2>Hasil Klasifikasi</h2>
            </div>
        <hr />
        <table>
        <tr>
          <th>Kategori</th>
          <th>: ${kategori}</th>
        </tr>
        <tr>
          <th>Jenis</th>
          <th>: ${setResults(results).className}</th>
        </tr>
        <tr>
          <th>Kecocokan</th>
          <th id="progresBar2">: </th>
        </tr>
        </table>
        <hr/>
        <p>
        ${penjelasan}
        </p>
    `;
    const containerElement = document.getElementById("progresBar2");
    let bar = new progressBar.Line(containerElement, {
      strokeWidth: 4,
      easing: "easeInOut",
      duration: 1400,
      color: `${color}`,
      trailColor: "#afabab",
      trailWidth: 1,
      svgStyle: { width: "80%", height: "13px" },
      text: {
        style: {
          // Warna teks
          // Default: sama dengan warna garis (options.color)
          color: "white",
          backgroundColor: "transparent",
          position: "absolute",
          left: "150px",
          top: "15px",
          fontSize: "17px",
          padding: 0,
          margin: 0,
          transform: null,
        },
        autoStyleContainer: false,
      },
      from: { color: "#FFEA82" },
      to: { color: "#ED6A5A" },
      step: (state, bar) => {
        bar.setText(Math.round(bar.value() * 100) + " %");
      },
    });
    bar.animate(setResults(results).probability / 100);
  });
  bar.animate(setResults(results).probability / 100);
}

loadModel();
