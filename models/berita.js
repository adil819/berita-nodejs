module.exports = (sequelize, Sequelize) => {
    const Berita = sequelize.define("berita", {
        nama: {
            type: Sequelize.STRING
        },
        isi: {
            type: Sequelize.STRING
        },
        gambar: {
            type: Sequelize.STRING
        }
});
    return Berita;
};