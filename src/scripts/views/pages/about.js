const About = {
    async render() {
        return `
            <div id="container-about">
                <div id="container-kontributor">
                    <h1>KONTRIBUTOR</h1>
                    <img src="./public/images/profile.jpeg">
                    <h2>Muhammad Qurtubi</h2>
                </div>
                <div id="container-visimisi">
                    <div class="visi">
                        <h3>VISI</h3>
                        <div><p>Membangun sebuah website yang inovatif dan mudah digunakan untuk membantu masyarakat dalam mengenali dan mengklasifikasikan jenis-jenis sampah, sehingga dapat mendukung upaya pelestarian lingkungan dan pengelolaan sampah yang lebih efektif.</p></div>
                    </div>
                    <div class="misi">
                        <h3>MISI</h3>
                        <div><p>Menyediakan informasi yang lengkap dan akurat mengenai berbagai jenis sampah dan cara pengelolaannya yang tepat, guna meningkatkan kesadaran masyarakat tentang pentingnya pengelolaan sampah yang baik.</p></div>
                    </div>
                </div>
                <div id="container-teknologi">
                        <h1>TEKNOLOGI</h1>
                        <div class="image">
                        <div><img src="./public/images/logo-html.png" class="img-html"></div>
                        <div><img src="./public/images/logo-css.png"></div>
                        <div><img src="./public/images/logo-js.png" class="img-js"></div>
                        <div><img src="./public/images/logo-tf.png"></div>
                        <div><img src="./public/images/logo-tm.png" class="img-tm"></div>
                        <div><img src="./public/images/logo-kaggle.png"></div>
                        </div>
                </div>
            </div>
        `
    },
    async afterRender() {

    },
}
export default About;
