import * as tf from "@tensorflow/tfjs";
import { async } from "regenerator-runtime";

const Klasifikasi = {
  async render() {
    return `
    <div id="deskripsi">
        <h2>KLASIFIKASIKAN</h2>
    </div>
    <div id="container">
        <div id="containerFile">
            <div id="file">
                <div id="imagePreview"></div>
                <label for="" id="logoFile">
                    <img src="./public/images/logoFile.png" alt=""/>
                </label>
                <input type="file" id="imageUpload" accept="image/*" />
                <label for="" id="labelFile">Unggah Gambar</label>
            </div>
            <button id="buttonKlasifikasi">Pilih Gambar</button>
        </div>

        <div id="containerHasil"></div>
    </div>
    `;
  },

  async afterRender() {
    let model, maxPredictions;
    const imageInput = document.getElementById("imageUpload");
    const buttonKlasifikasi = document.getElementById("buttonKlasifikasi");
    const containerHasil = document.getElementById("containerHasil");
    const file = document.getElementById("file");

    async function init() {
      const URL = "/public/model/";
      const modelURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";
      model = await tmImage.load(modelURL, metadataURL);
      maxPredictions = model.getTotalClasses();

      for (let i = 0; i < maxPredictions; i++) {
        containerHasil.appendChild(document.createElement("div"));
      }
    }

    async function predict(imageElement) {
      const prediction = await model.predict(imageElement);
      let progressBar = require("progressbar.js");
      let maxProbability = 0;
      let predictedClass = "";
      let kategori = "";
      let penjelasan = "";
      let penanggulangan = "";
      let color = "";
      for (let i = 0; i < maxPredictions; i++) if (prediction[i].probability > maxProbability) {
        maxProbability = prediction[i].probability;
        predictedClass = prediction[i].className;
        if (predictedClass === "Biologis") {
          kategori = "Organik";
          color = "#3E9900";
          penjelasan = "Sampah yang kategori organik biasanya terdiri dari sisa makanan dan daun-daunan yang dapat terurai secara alami.";
          penanggulangan = `<ul>
          <li>Pemisahan di Sumber: Pastikan untuk memisahkan sampah organik dari anorganik ketika membuang sampah. Gunakan tempat sampah terpisah atau wadah yang berbeda untuk masing-masing jenis sampah ini.</li>
          <li>Pengomposan: Sampah organik dapat diolah melalui pengomposan. Anda dapat menggunakan komposter untuk mengurai sisa-sisa makanan, daun, dan bahan organik lainnya menjadi kompos yang berguna untuk tanaman.</li>
          <li>Penggunaan sebagai Pupuk Kompos: Sampah organik dapat diolah menjadi pupuk kompos yang berguna untuk tanaman. Hal ini dapat dilakukan dengan memasukkan tanah secukupnya ke wadah yang telah diisi sampah organik, lalu disiram dengan air dan diisi dengan arang.</li>
          </ul>`
        } else if (predictedClass === "Kaca" || predictedClass === "Baterai" || predictedClass === "Sampah") {
          kategori = "Berbahaya";
          color = "#CD000E";
          penjelasan = "Sampah yang kategori sampah berbahaya mencakup bahan-bahan yang dapat membahayakan lingkungan atau kesehatan manusia, seperti baterai, limbah biologis, dan beberapa jenis kaca yang mengandung zat berbahaya."
          penanggulangan = `<ul>
          <li>Pemisahan di Sumber: Sampah berbahaya seperti kaca, kemasan detergen, atau pembasmi serangga harus dipisahkan secara khusus dalam satu wadah untuk meminimalisasi dampak yang mungkin ditimbulkan</li>
          <li>Pengelolaan yang Tepat: Sampah berbahaya harus dikelola dengan tepat untuk mengurangi dampak negatifnya pada lingkungan. Contohnya, kaca dapat didaur ulang menjadi produk lain, sedangkan kemasan detergen dapat didaur ulang menjadi produk lain yang lebih ramah lingkungan</li>
          </ul>`;
        } else {
          kategori = "Anorganik";
          penjelasan = "Sampah yang kategori anorganik meliputi bahan-bahan seperti logam, plastik, kaca, dan kertas yang tidak dapat terurai secara alami dan membutuhkan pengolahan khusus.";
          color = "#ECB500";
          penanggulangan = `<ul>
          <li>Pemisahan di Sumber: Memisahkan sampah anorganik dari organik ketika membuang sampah juga sangat penting. Gunakan tempat sampah terpisah atau wadah yang berbeda untuk masing-masing jenis sampah ini.</li>
          <li>Daur Ulang: Sampah anorganik dapat diolah melalui proses daur ulang yang sesuai dengan jenisnya. Contohnya, kertas dapat didaur ulang menjadi kertas yang baru, sedangkan plastik dapat didaur ulang menjadi produk lain.</li>
          <li>Penggunaan sebagai Kerajinan Daur Ulang: Sampah anorganik dapat diolah menjadi kerajinan daur ulang yang berguna, seperti produk kerajinan dari kertas, kaleng, atau plastik</li>
          </ul>`;
        }
      }
      containerHasil.innerHTML = `
  <div id="headHasil">
          <div class="hasilKlasifikasi">
            <button id="hasilKlasifikasi">Hasil</button>
          </div>
          <div class="penagulangan">
            <button id="penagulangan">Penanggulangan</button>
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
          <th>: ${predictedClass}</th>
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
      const containerElement = document.getElementById("progresBar");
      let bar = new progressBar.Line(containerElement, {
        strokeWidth: 4,
        easing: "easeInOut",
        duration: 1400,
        color: `${color}`,
        trailColor: "#afabab",
        trailWidth: 1,
        svgStyle: { width: "90%", height: "13px" },
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
        <h2>Cara Penanggulangan Sampah ${kategori}</h2>
        </div>
    <hr />
    ${penanggulangan}
    
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
      <th>: ${predictedClass}</th>
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
          svgStyle: { width: "90%", height: "13px" },
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
        window.addEventListener("resize", () => updateTextPosition(bar));
        updateTextPosition(bar);
        bar.animate(maxProbability);
      });
      window.addEventListener("resize", () => updateTextPosition(bar));
      updateTextPosition(bar);
      bar.animate(maxProbability);
    }
    function updateTextPosition(bar) {
      if (window.innerWidth <= 600) {
        bar.text.style.left = "95px"; // Adjust as needed for mobile
        bar.text.style.fontSize = "14px";
        bar.text.style.top = "7.5px";
      } else {
        bar.text.style.left = "150px"; // Default value for desktop
      }
    }
    init();

    let uploadedImage = null;
    file.addEventListener("click", () => {
      imageInput.click();
    });

    buttonKlasifikasi.addEventListener("click", () => {
      if (uploadedImage) {
        buttonKlasifikasi.classList.add("button-loading");
        buttonKlasifikasi.textContent = "Loading ...";
        setTimeout(async () => {
          await predict(uploadedImage);
          buttonKlasifikasi.textContent = "Klasifikasi";
          buttonKlasifikasi.classList.remove("button-loading");
        }, 1000);
      } else {
        console.error("No image uploaded.");
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

          previewContainer.innerHTML = "";
          previewContainer.appendChild(previewImage);
          previewContainer.appendChild(createButton);

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
              containerHasil.innerHTML = "";
            });
          };
        };
        reader.readAsDataURL(getFile);
      }
    });
  }
};

export default Klasifikasi;
