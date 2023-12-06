// server.js
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const PDFDocument = require('pdfkit');
const fs = require('fs');

const socketIo = require('socket.io');
const http = require('http');



const app = express();
const PORT = process.env.PORT || 3000;


const server = http.createServer(app);
const io = socketIo(server);


io.on('connection', (socket) => {
  console.log('Un client s\'est connecté');

  socket.on('update', (nouvellesDonnees) => {
    console.log('Mise à jour reçue :', nouvellesDonnees);
    // Émettre les données mises à jour à tous les clients connectés
    io.emit('update', nouvellesDonnees);
  });
});

app.use(express.json());
app.use(cors());
const db = mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"",
  database:"stage"
})



app.get('/' , (req , res)=>{
  return res.json({Status:"succes"})
})










io.on('connection', (socket) => {
  console.log('Un client s\'est connecté');

  // Vous pouvez émettre des événements spécifiques à ce client si nécessaire
  // socket.emit('message', 'Bienvenue sur le serveur!');

  // Vous pouvez écouter des événements spécifiques à partir de ce client
  socket.on('message', (data) => {
    console.log('Message reçu du client:', data);
  });

  // Vous pouvez également émettre des événements à tous les clients connectés
  // io.emit('update', 'Données mises à jour pour tous les clients');

  socket.on('disconnect', () => {
    console.log('Un client s\'est déconnecté');
  });
});


















app.post('/Login', (req, res) => {
  const im = req.body.im;
  const password = req.body.password;
  const sql = "SELECT * FROM login WHERE im=? AND password=?"


  db.query(sql, [im, password], (err, data) => {
    if (err) return res.json("Error");
    if (data.length > 0) {

      const sqlDivision = "SELECT division FROM login WHERE im = ?";
      db.query(sqlDivision, [im], (err, divisionData) => {
        if (err) return res.json("Error");

        if (divisionData.length > 0) {
          const division = divisionData[0].division;


          if (division === 'DBRFM') {
            return res.json({ Status: "succes_dbrfm" });
          } else if (division === 'CIR') {
            return res.json({ Status: "succes_cir" });
          } else if (division === 'DPE') {
            return res.json({ Status: "succes_dpe" });
          } else if (division === 'EPN') {
            return res.json({ Status: "succes_epn" });
          } else if (division === 'cordo') {
            return res.json({ Status: "succes_cordo" });
          } else if (division === 'admin') {
            return res.json({ Status: "succes_admin" });
          } else {
            return res.json({ Message: "Veuillez vérifier votre numéro ou votre mot de passe" });
          }
        } else {
          return res.json({ Message: "Veuillez vérifier votre numéro ou votre mot de passe" });
        }
      });



    } else {
      return res.json({ Message: "Veuillez verifier votre numéro ou votre mot de passe" })
    }
  })
})





app.post('/inscription', (req, res) => {
  const sql = 'INSERT INTO login (im,nom,prenoms,email,password,division) VALUES (?,?,?,?,?,?)';
  db.query(sql, [req.body.im, req.body.nom, req.body.prenoms,req.body.adresse,req.body.password,req.body.division],(err, data)=>{
    if (err) {
      console.error(err);
      return res.json({Status:"duplicate"})
      
   
    
    } else {
      
      return res.json({Status:"succes"})
     
    }
  } )
});

// ACCUEIL CORDO

app.get('/nbr_cir', (req, res) => {
  const query = 'select count(*) as nbr from rapport where  section="cir"';
  db.query(query, (err, results) => {
    res.json(results);
  });
});
app.get('/nbr_dbrfm', (req, res) => {
  const query = 'select count(*) as nbr from rapport where  section="dbrfm" ';
  db.query(query, (err, results) => {
    res.json(results);
  });
});
app.get('/nbr_epn', (req, res) => {
  const query = 'select count(*) as nbr from rapport where section="epn" ';
  db.query(query, (err, results) => {
    res.json(results);
  });
});
app.get('/nbr_dpe', (req, res) => {
  const query = 'select count(*) as nbr from rapport where section="dpe" ';
  db.query(query, (err, results) => {
    res.json(results);
  });
});



// Tableau C  I  R  CIR

app.get('/cir', (req, res) => {
  const query = 'SELECT * FROM  rapport where section="cir"';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data from MySQL: ' + err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});


// Tableau D B R F M   DBRFM
app.get('/dbrfm', (req, res) => {
  const query = 'SELECT * FROM  rapport  where section="dbrfm" ORDER BY id ASC ';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data from MySQL: ' + err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});

// Tableau  DPE

app.get('/dpe', (req, res) => {
  const query = 'SELECT * FROM  rapport  where section="dpe" ORDER BY id ASC ';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data from MySQL: ' + err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});


// Tableau     EPN

app.get('/epn', (req, res) => {
  const query = 'SELECT * FROM  rapport  where section="epn" ORDER BY id ASC ';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data from MySQL: ' + err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});








// Ajouter Rapport CIR

app.post('/new_rapport_cir', (req, res) => {
  const sql = 'INSERT INTO rapport (produit,Mois,division,probleme,solution,section) VALUES (?,?,?,?,?,"cir")';
  db.query(sql, [req.body.produit, req.body.mois,req.body.division,req.body.probleme,req.body.solution],(err, data)=>{
    if (err) {
      console.error(err);
    return  res.status(500).json({ message: 'Data failed' });
   
    
    } else {
      
      return res.json({Status:"succes"})
     
    }
  } )
});

// Ajouter Rapport DBRFM

app.post('/new_rapport_dbrfm', (req, res) => {
  const sql = 'INSERT INTO  rapport  (produit,Mois,division,probleme,solution,section) VALUES (?,?,?,?,?,"dbrfm")';
  db.query(sql, [req.body.produit, req.body.mois,req.body.division,req.body.probleme,req.body.solution],(err, data)=>{
    if (err) {
      console.error(err);
    return  res.status(500).json({ message: 'Data failed' });
    } else {
      return res.json({Status:"succes"})
    }
  } )
});

// Ajouter Rapport EPN

app.post('/new_rapport_epn', (req, res) => {
  const sql = 'INSERT INTO  rapport  (produit,Mois,division,probleme,solution,section) VALUES (?,?,?,?,?,"epn")';
  db.query(sql, [req.body.produit, req.body.mois,req.body.division,req.body.probleme,req.body.solution],(err, data)=>{
    if (err) {
      console.error(err);
    return  res.status(500).json({ message: 'Data failed' });
    } else {
      return res.json({Status:"succes"})
    }
  } )
});

// Ajouter Rapport DPE

app.post('/new_rapport_dpe', (req, res) => {
  const sql = 'INSERT INTO  rapport  (produit,Mois,division,probleme,solution,section) VALUES (?,?,?,?,?,"dpe")';
  db.query(sql, [req.body.produit, req.body.mois,req.body.division,req.body.probleme,req.body.solution],(err, data)=>{
    if (err) {
      console.error(err);
    return  res.status(500).json({ message: 'Data failed' });
    } else {
      return res.json({Status:"succes"})
    }
  } )
});






// Recuperer les Donnees CIR DBRFM EPN DPE

app.get('/edit_rapport_dbrfm/:iddbrfm', (req, res) => {
  const iddbrfm = req.params.iddbrfm;
  const sql = "SELECT * FROM  rapport  WHERE id = ?";

  db.query(sql, [iddbrfm], (err, data) => {
    if (err) {
      console.error('Erreur lors de la récupération des données du rapport : ' + err);
      return res.status(500).json({ message: 'Erreur serveur interne' });
    } else {
      if (data.length > 0) {
        const rapportData = data[0]; // Première ligne de résultat (s'il y en a)
        return res.json({ Status: "succes", Rapport: rapportData });
      } else {
        return res.status(404).json({ Message: "Rapport non trouvé" });
      }
    }
  });
});















//Modifier  rapport CIR

app.put('/edit_rapport_cir/:idcir', (req, res) => {
  const values=[
    req.body.produit,
     req.body.mois,
     req.body.division,
     req.body.probleme,
     req.body.solution
  ]
  const sql = 'UPDATE  rapport  SET produit=?, mois=? ,division=?, probleme=? ,solution=? WHERE id=?';
  const idcir=req.params.idcir; 
  db.query(sql, [...values,idcir],(err, data)=>{
    if (err) {
      return res.status(500).json({ message: 'Data failed' });


    } else {

      return res.json({ Status: "succes" })

    }
  })
});

//Modifier  rapport DBRFM

app.put('/edit_rapport_dbrfm/:iddbrfm', (req, res) => {
  const values=[
    req.body.produit,
     req.body.mois,
     req.body.division,
     req.body.probleme,
     req.body.solution
  ]
  const sql = 'UPDATE  rapport  SET produit=?, mois=? ,division=?, probleme=? ,solution=? WHERE id=?';
  const iddbrfm=req.params.iddbrfm; 
  db.query(sql, [...values,iddbrfm],(err, data)=>{
    if (err) {
      return res.status(500).json({ message: 'Data failed' });


    } else {

      return res.json({ Status: "succes" })

    }
  })
});
//Modifier  rapport EPN

app.put('/edit_rapport_epn/:iddbrfm', (req, res) => {
  const values=[
    req.body.produit,
     req.body.mois,
     req.body.division,
     req.body.probleme,
     req.body.solution
  ]
  const sql = 'UPDATE  rapport  SET produit=?, mois=? ,division=?, probleme=? ,solution=? WHERE id=?';
  const iddbrfm=req.params.iddbrfm; 
  db.query(sql, [...values,iddbrfm],(err, data)=>{
    if (err) {
      return res.status(500).json({ message: 'Data failed' });


    } else {

      return res.json({ Status: "succes" })

    }
  })
});
//Modifier  rapport DPE

app.put('/edit_rapport_dpe/:iddbrfm', (req, res) => {
  const values=[
    req.body.produit,
     req.body.mois,
     req.body.division,
     req.body.probleme,
     req.body.solution
  ]
  const sql = 'UPDATE  rapport  SET produit=?, mois=? ,division=?, probleme=? ,solution=? WHERE id=?';
  const iddbrfm=req.params.iddbrfm; 
  db.query(sql, [...values,iddbrfm],(err, data)=>{
    if (err) {
      return res.status(500).json({ message: 'Data failed' });


    } else {

      return res.json({ Status: "succes" })

    }
  })
});









//EFFACER RAPPORT   C I R 

app.delete('/delrapport/:idcir', (req, res) => {

  const sql = 'DELETE FROM  rapport  WHERE id=?';
  const idcir=req.params.idcir;
  db.query(sql, [idcir],(err, data)=>{
    if (err) {
      console.error(err);
    return  res.status(500).json({ message: 'Data failed' });
   
    
    } else {
      
      return res.json({Status:"succes"})
     
    }
  } )
});

//EFFACER RAPPORT  D B R F M       
//EFFACER RAPPORT  E P N       
//EFFACER RAPPORT  D P E      

app.delete('/delrapportdbrfm/:iddbrfm', (req, res) => {

  const sql = 'DELETE FROM  rapport  WHERE id=?';
  const idcir=req.params.iddbrfm;
  db.query(sql, [idcir],(err, data)=>{
    if (err) {
      console.error(err);
    return  res.status(500).json({ message: 'Data failed' });
   
    
    } else {
      
      return res.json({Status:"succes"})
     
    }
  } )
});









app.post('/list_pers', (req, res) => {
  const query = 'SELECT * FROM login';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data from MySQL: ' + err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});


app.put('/edit_pers/:im', (req, res) => {
  const sql = 'update login set `im` = ? , `nom` = ? ,`prenoms` = ? , `email` = ? , `password` = ? , `division` = ?  where `im` = ? ';

  const valeur = [
    req.body.im,
    req.body.nom,
    req.body.prenoms,
    req.body.email,
    req.body.password,
    req.body.division
  ]

  const im = req.body.im;

  db.query(sql, [...valeur, im], (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Data failed' });


    } else {

      return res.json({ Status: "succes" })

    }
  })
});


// Recuperer les donnees du Pers

app.get('/edit_pers/:im', (req, res) => {
  const im = req.params.im; // Récupérer l'IM depuis les paramètres de la route
  const sql = "SELECT * FROM login WHERE im = ?";

  db.query(sql, [im], (err, data) => {
    if (err) {
      console.error('Erreur lors de la récupération des données du personnel : ' + err);
      return res.status(500).json({ message: 'Erreur serveur interne' });
    } else {
      if (data.length > 0) {
        const personnelData = data[0]; // Première ligne de résultat (s'il y en a)
        return res.json({ Status: "succes", Personnel: personnelData });
      } else {
        return res.json({ Message: "Personnel non trouvé" });
      }
    }
  });
});



app.delete('/list_pers/:im', (req, res) => {
  const im = req.params.im; // Utilisez `req.params` pour récupérer l'ID depuis la route, pas `req.body`
  const sql = "DELETE FROM login WHERE im = ?";

  db.query(sql, [im], (err, data) => {
    if (err) {
      console.error('Erreur lors de la suppression : ' + err);
      return res.status(500).json({ message: 'Erreur serveur interne' });
    } else {
      return res.json({ Status: "succes" });
    }
  });
});












// oui    non   CIR

app.post('/fin_cir', (req, res) => {
  const sql = 'update statutrapport set statut=? WHERE division="cir" ';
  db.query(sql, [("OUI")], (err, data) => {
      return res.json({ Status: "success" });
  });
});

app.post('/nonfin_cir', (req, res) => {
  const sql = 'update statutrapport set statut=? WHERE division="cir" ';
  db.query(sql, [("NON")], (err, data) => {
      return res.json({ Status: "success" });
  });
});

// oui    non   DBRFM

app.post('/fin_dbrfm', (req, res) => {
  const sql = 'update statutrapport set statut=? WHERE division="dbrfm" ';
  db.query(sql, [("OUI")], (err, data) => {
    if (err) {
      console.error(err);
      return res.json({ Status: "duplicate" });
    } else {
      return res.json({ Status: "success" });
    }  
  });
});

app.post('/nonfin_dbrfm', (req, res) => {
  const sql = 'update statutrapport set statut=? WHERE division="dbrfm" ';
  db.query(sql, [("NON")], (err, data) => {
    if (err) {
      console.error(err);
      return res.json({ Status: "duplicate" });
    } else {
      return res.json({ Status: "success" });
    }
  });
});

// oui    non   EPN

app.post('/fin_epn', (req, res) => {
  const sql = 'update statutrapport set statut=? WHERE division="epn" ';
  db.query(sql, [("OUI")], (err, data) => {
    if (err) {
      console.error(err);
      return res.json({ Status: "duplicate" });
    } else {
      return res.json({ Status: "success" });
    }  
  });
});

app.post('/nonfin_epn', (req, res) => {
  const sql = 'update statutrapport set statut=? WHERE division="epn" ';
  db.query(sql, [("NON")], (err, data) => {
    if (err) {
      console.error(err);
      return res.json({ Status: "duplicate" });
    } else {
      return res.json({ Status: "success" });
    }
  });
});

// oui    non   DPE

app.post('/fin_dpe', (req, res) => {
  const sql = 'update statutrapport set statut=? WHERE division="dpe" ';
  db.query(sql, [("OUI")], (err, data) => {
    if (err) {
      console.error(err);
      return res.json({ Status: "duplicate" });
    } else {
      return res.json({ Status: "success" });
    }  
  });
});

app.post('/nonfin_dpe', (req, res) => {
  const sql = 'update statutrapport set statut=? WHERE division="dpe" ';
  db.query(sql, [("NON")], (err, data) => {
    if (err) {
      console.error(err);
      return res.json({ Status: "duplicate" });
    } else {
      return res.json({ Status: "success" });
    }
  });
});






// RECUPERER LE STATUT CIR

app.get('/statutrapport_cir', (req, res) => {
  const query = 'SELECT statut FROM statutrapport where division="cir" ';
  db.query(query, (err, results) => {
    res.json(results);
  });
});

// RECUPERER LE STATUT DBRFM

app.get('/statutrapport', (req, res) => {
  const query = 'SELECT statut FROM statutrapport where division="dbrfm" ';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data from MySQL: ' + err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});

app.get('/statutrapport_dbrfm', (req, res) => {
  const query = 'SELECT statut FROM statutrapport where division="dbrfm" ';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data from MySQL: ' + err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});

// RECUPERER LE STATUT EPN

app.get('/statutrapport_epn', (req, res) => {
  const query = 'SELECT statut FROM statutrapport where division="epn" ';
  db.query(query, (err, results) => {
    res.json(results);
  });
});

// RECUPERER LE STATUT DPE

app.get('/statutrapport_dpe', (req, res) => {
  const query = 'SELECT statut FROM statutrapport where division="dpe" ';
  db.query(query, (err, results) => {
    res.json(results);
  });
});















app.get('/api/:idcir', (req, res) => {
  const query = 'SELECT * FROM   rapport  where section="cir" ';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data from MySQL: ' + err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});



app.delete('/cir/:im', (req, res) => {
  const im = req.params.im; // Utilisez `req.params` pour récupérer l'ID depuis la route, pas `req.body`
  const sql = "DELETE FROM login WHERE im = ?";

  db.query(sql, [im], (err, data) => {
    if (err) {
      console.error('Erreur lors de la suppression : ' + err);
      return res.status(500).json({ message: 'Erreur serveur interne' });
    } else {
      return res.json({ Status: "succes" });
    }
  });
});








app.delete('/dbrfm/:iddbrfm', (req, res) => {
  const iddbrfm = req.params.iddbrfm; // Utilisez `req.params` pour récupérer l'ID depuis la route, pas `req.body`
  const sql = "DELETE FROM rapport WHERE id = ?";

  db.query(sql, [iddbrfm], (err, data) => {
    if (err) {
      console.error('Erreur lors de la suppression : ' + err);
      return res.status(500).json({ message: 'Erreur serveur interne' });
    } else {
      return res.json({ Status: "succes" });
    }
  });
});




app.get('/edit_pers/:iddbrfm', (req, res) => {
  const iddbrfm = req.params.iddbrfm; // Récupérer l'IM depuis les paramètres de la route
  const sql = "SELECT * FROM rapport WHERE id = ?";

  db.query(sql, [iddbrfm], (err, data) => {
    if (err) {
      console.error('Erreur lors de la récupération des données du personnel : ' + err);
      return res.status(500).json({ message: 'Erreur serveur interne' });
    } else {
      if (data.length > 0) {
        const personnelData = data[0]; // Première ligne de résultat (s'il y en a)
        return res.json({ Status: "succes", Personnel: personnelData });
      } else {
        return res.json({ Message: "Personnel non trouvé" });
      }
    }
  });
});






app.get('/cir/:idcir', (req, res) => {
  const idcir = req.params.idcir; // Récupérer l'IM depuis les paramètres de la route
  const sql = "SELECT * FROM rapport WHERE id = ?";

  db.query(sql, [idcir], (err, data) => {
    if (err) {
      console.error('Erreur lors de la récupération des données du personnel : ' + err);
      return res.status(500).json({ message: 'Erreur serveur interne' });
    } else {
      if (data.length > 0) {
        const personnelData = data[0]; // Première ligne de résultat (s'il y en a)
        return res.json({ Status: "succes", Personnel: personnelData });
      } else {
        return res.json({ Message: "Personnel non trouvé" });
      }
    }
  });
});






/*******     MESSAGE      *******/

// CIR >>>>>>> Cordo
app.post('/discussion_cir_cordo', (req, res) => {
  const { message } = req.body;
  const query = `INSERT INTO discussion (envoyeur, recepteur, message) VALUES ("cir","cordo_cir", "${message}")`;

  db.query(query, (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'insertion du message :', err);
      res.status(500).send('Erreur lors de l\'insertion du message');
    } else {
      console.log('Message envoyé avec succès');
      res.status(201).send('Message inséré avec succès');
    }
  });
});
// DBRFM >>>>>>> Cordo
app.post('/discussion_dbrfm_cordo', (req, res) => {
  const { message } = req.body;
  const query = `INSERT INTO discussion (envoyeur, recepteur, message) VALUES ("dbrfm","cordo_dbrfm", "${message}")`;

  db.query(query, (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'insertion du message :', err);
      res.status(500).send('Erreur lors de l\'insertion du message');
    } else {
      console.log('Message envoyé avec succès');
      res.status(201).send('Message inséré avec succès');
    }
  });
});


//  Cordo >>>>>>> CIR
app.post('/discussion_cordo_cir', (req, res) => {
  const { message } = req.body;
  const query = `INSERT INTO discussion (envoyeur, recepteur, message) VALUES ("cordo_cir","cir", "${message}")`;

  db.query(query, (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'insertion du message :', err);
      res.status(500).send('Erreur lors de l\'insertion du message');
    } else {
      console.log('Message envoyé avec succès');
      res.status(201).send('Message inséré avec succès');
    }
  });
});
//  Cordo >>>>>>>DBRFM
app.post('/discussion_cordo_dbrfm', (req, res) => {
  const { message } = req.body;
  const query = `INSERT INTO discussion (envoyeur, recepteur, message) VALUES ("cordo_dbrfm","dbrfm", "${message}")`;

  db.query(query, (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'insertion du message :', err);
      res.status(500).send('Erreur lors de l\'insertion du message');
    } else {
      console.log('Message envoyé avec succès');
      res.status(201).send('Message inséré avec succès');
    }
  });
});











// affiche DBRFM >>>>>> CORDO

app.get('/message_dbrfm', (req, res) => {
  const query = 'SELECT * from discussion where envoyeur="dbrfm" or recepteur = "dbrfm"    order by date asc';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data from MySQL: ' + err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});

// affiche cir >>>>>> CORDO

app.get('/message_cir', (req, res) => {
  const query = 'SELECT * from discussion where envoyeur="cir" or recepteur = "cir"  order by date asc';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data from MySQL: ' + err);
      res.status(500).json({ error: 'Internal Server Error' }); 
      return;
    }
    res.json(results);
  });
});
























  app.listen(8081, () =>{
    console.log("Serveur en ecoute...");
})