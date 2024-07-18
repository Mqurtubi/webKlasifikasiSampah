import Alamat from "../../../public/alamat/alamat_tpa";
const Tpa = {
    async render() {
        return `
        <h1 class="h1-tpa">TEMPAT PEMBUANGAN AKHIR</h1>
            <div id="container-tpa">
                
            </div>
        `
    },
    async afterRender() {
        const container = document.getElementById("container-tpa");
        container.innerHTML = Alamat.map((alamat) => {
            console.log(alamat.image)
            return `
            <div class="container-tpa">
                <div class="tpa-image">
                    ${alamat.image}
                </div>
            <div class="alamat-tpa">
                <a href="${alamat.link}">${alamat.alamat}</a>
            </div>
        </div>
            `
        }).join('');
    }
}
export default Tpa;