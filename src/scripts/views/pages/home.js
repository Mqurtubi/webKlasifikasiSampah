const Home = {
  async render() {
    return `
    <div id="containerHome">
        <div class="intro">
        <img src="./public/images/R_Kuning.png" id="kuning">
        <img src="./public/images/R_Biru.png" id="biru">
        <h1>KLASIFIKASI SAMPAH</h1>
        <p>Website ini menggunakan teknologi machine learning untuk membantu Anda mengklasifikasikan sampah yang ingin dibuang menjadi tiga kategori: organik, anorganik, dan sampah berbahaya. Dengan ini, kami berharap dapat mempermudah Anda dalam memilah sampah dengan benar dan mendukung upaya menjaga lingkungan</p>
        <button id="btnMulai"><a href="#/klasifikasi">MULAI</a></button>
        </div>
        <div class="bckGroundHome">
        <img src="./public/images/bg-1.png" alt="Garbage Separation Background">
        </div>
    </div>
    `;
  },
  async afterRender() {},
};
export default Home;
