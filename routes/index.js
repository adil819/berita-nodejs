var express = require('express');
var router = express.Router();

const db = require('../models');
const Berita = db.beritas;
const Komentar = db.komentars;
const Op = db.Sequelize.Op;

// tambahan upload image
var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
// tambahan show image
const Express = require('express');
const komentar = require('../models/komentar');
const app = new Express();
app.use(Express.static(__dirname+'/public'));

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/berita', function(req, res, next) {  

  Berita.findAll({ where: { deleted: 0} })
    .then(berita => {
      res.render('berita', {
        title: 'Daftar berita',
        berita: berita
      });
    })
    .catch(err => {
      res.render('berita', {
        title: 'Daftar Berita',
        berita: []
      });
    });

});
router.get('/beritadetail', function (req, res, next) {

  var id = parseInt(req.query.id);
  
  Berita.findByPk(id)
    .then(detailberita => {
      if (!detailberita) {
        //http 404 not found
        res.render('beritadetail', {
          title: 'Detail Beritaa',
          berita: {}
        });
      } 
      
      // res.render('beritadetail', {
      //   title: 'Detail Berita',
      //   berita: detailberita
      // });

      Komentar.findAll({ where: { id_berita: id } })
      .then(komentar => {
        res.render('beritadetail', {
          title: 'Detail Berita',
          berita: detailberita,
          komentar: komentar
        });
      })
      .catch(err => {
        res.render('komentar', {
          title: 'Daftar komentar',
          komentar: {}
        });
      });

    })
    .catch(err => {
      res.render('beritadetail', {
        title: 'Detail Berit',
        berita: {}
      });
    });
});

// router.get('/beritadetail', function (req, res, next) {

//   var id = parseInt(req.query.id);
  
//   Berita.findByPk(id)
//     .then(detailberita => {
//       if (detailberita) {
//         res.render('beritadetail', {
//           title: 'Detail Berita',
//           berita: detailberita
//         });
//       } else {
//         //http 404 not found
//         res.render('beritadetail', {
//           title: 'Detail Berita',
//           berita: {}
//         });
//       }
//     })
//     .catch(err => {
//       res.render('beritadetail', {
//         title: 'Detail Berita',
//         berita: {}
//       });
//     });
// });


router.get('/detail/:id', function (req, res, next) {
  var id = parseInt(req.params.id);
  // query ke database
  // select * from berita where id=id
  Berita.findByPk(id)
    .then(detailberita => {
      if (detailberita) {
        res.render('beritadetail', {
          title: 'Detail Berita',
          berita: detailberita
        });
      } else {
        //http 404 not found
        res.render('beritadetail', {
          title: 'Detail Berita',
          berita: {}
        });
      }
    })
    .catch(err => {
      res.render('beritadetail', {
        title: 'Detail Berita',
        berita: {}
      });
    });
});
router.get('/addberita', function (req, res, next) {
  res.render('addberita', { title: 'Add berita' });
});


router.post('/addberita', function (req, res) {

  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    var oldpath = files.filetoupload.filepath;
    var newpath = 'C:/Users/ahmad/Documents/Proyekmandiri1-main/pm2/public/images/' + files.filetoupload.originalFilename;
    var berita = {
      nama: fields.nama,
      isi:fields.isi,
      gambar:files.filetoupload.originalFilename,
      deleted:0
    }
    fs.rename(oldpath, newpath, function (err) {
      if (err) throw err;
      Berita.create(berita).
      then(data => {
        res.redirect('/berita');
      })
      .catch(err => {
        res.render('addberita', {
          title: 'Add Berita',
        });
      });
      res.redirect('/berita');
    });
  });
});


// router.post('/addberita', function (req, res, next) {

//   var berita = {
//     nama: req.body.nama,
//     isi:req.body.isi,
//     gambar:req.body.gambar
    
//   }
//   Berita.create(berita).
//     then(data => {
//       res.redirect('/berita');
//     })
//     .catch(err => {
//       res.render('addberita', {
//         title: 'Add Berita',
//       });
//     });
// });


router.post('/komen', function (req, res, next) {
  var komentar = {
    id_berita: req.body.id_berita,
    komentar:req.body.komentar
  }
  Komentar.create(komentar).
    then(data => {
      res.redirect('/beritadetail?id='+req.body.id_berita);
    })
    .catch(err => {
      res.render('berita', {
        title: 'Salah Berita',
      });
    });
});

router.get('/deleteberita/:id', function (req, res, next) {
  var id = parseInt(req.params.id);
  Berita.update({deleted:1}, {
    where: { id: id }
  })
    .then(num => {
      res.redirect('/berita');
    })
    .catch(err => {
      res.json({
        info: "Eror",
        message: err.message
      });
    });
});

// router.get('/deleteberita/:id', function (req, res, next) {
//   var id = parseInt(req.params.id);
//   Berita.destroy({
//     where: { id: id }
//   })
//     .then(num => {
//       res.redirect('/berita');
//     })
//     .catch(err => {
//       res.json({
//         info: "Eror",
//         message: err.message
//       });
//     });
// });

router.get('/editberita/:id', function (req, res, next) {
  var id = parseInt(req.params.id);
  Berita.findByPk(id)
    .then(detailberita => {
      if (detailberita) {
        res.render('editberita', {
          title: 'Edit Berita',
          id: detailberita.id,
          nama: detailberita.nama,
          isi: detailberita.isi,
          gambar: detailberita.gambar

        });
      } else {
        //http 404 not found
        res.redirect('/berita');
      }

    })
    .catch(err => {
      res.redirect('/berita');
    });

});
router.post('/editberita/:id', function (req, res, next) {
  var id = parseInt(req.params.id); // /detail/2, /detail/3

  Berita.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      res.redirect('/berita');

    })
    .catch(err => {
      res.json({
        info: "Error",
        message: err.message
      });
    });

});



module.exports = router;
