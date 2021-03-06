const express = require('express');
const pool = require('../modules/pool.js');
const router = express.Router();
let debug = false;

router.post('/', (request, response) => {
  if(debug){console.log('in post', request.body);}
  pool.query('INSERT INTO properties (property_name, property_picture, property_location, property_state, owner_id) VALUES ($1, $2, $3, $4,$5);',
    [request.body.nickname, request.body.itemUrl, request.body.address, request.body.state,
     request.body.userObject.id])
      .then((result) => {
        if(debug){console.log('registed new property');}
        response.sendStatus(201);
      })
      .catch((err) => {
        if(debug){console.log('error in property post', err);}
        response.sendStatus(500);
      })
});
//end POST new property

router.get('/:id', (request, response) => {
  if(debug){console.log('in get all', request.params.id);}
  pool.query('SELECT * FROM properties WHERE owner_id = $1 ORDER BY id;', [request.user.id])
  .then((result) => {
    if(debug){console.log('success in get', result);}
    response.send(result);
  })
  .catch((err) => {
    if(debug){console.log('error in get', err);}
    response.sendStatus(500);
  })
});
//end getCabins

router.get('/display/:id', (request, response) => {
  if(debug){console.log('in get single', request.params.id);}
  pool.query('SELECT * FROM properties WHERE id = $1;', [request.params.id])
  .then((result) => {
    if(debug){console.log('success in get', result);}
    response.send(result);
  })
  .catch((err) => {
    if(debug){console.log('error in get', err);}
    response.sendStatus(500);
  })
});
//end getCabin for display

router.delete('/:id', (request, response) => {
  if(debug){console.log('in delete cabin route', request.params.id);}
  if(request.isAuthenticated()){
    pool.query('DELETE FROM properties WHERE id = $1;', [request.params.id])
    .then((result) => {
      if(debug){console.log('success in delete', result);}
      response.sendStatus(200)
    })
    .catch((err) => {
      if(debug){console.log('error in delete', err);}
      response.sendStatus(500);
    })
  }//end if
else{
  res.sendStatus(403);
}
});
//end deleteCabin

router.put('/showEdit/:id', (request, response) => {
  let is_edit = '';
  if (request.body.edit == true){
    is_edit = false;
  } else {
    is_edit = true;
  }
  pool.query('UPDATE properties SET is_edit = $1 WHERE id = $2;', [is_edit, request.params.id])
  .then((result) => {
    if(debug){console.log('success in showEdit', result);}
    response.sendStatus(200);
  })
  .catch ((err) => {
    if(debug){console.log('error in showEdit', err);}
    response.sendStatus(500);
  })
})
// end showEdit

router.put('/edit/:id', (request, response) => {
  if(debug){console.log('in edit route', request.body);}
  pool.query('UPDATE properties SET property_name = $1, property_location = $2, property_state = $3 WHERE id = $4;',
              [request.body.property_name, request.body.property_location,
              request.body.property_state, request.body.id])
  .then((result) => {
    if(debug){console.log('success in edit', result);}
    response.sendStatus(200);
  })
  .catch ((err) => {
    if(debug){console.log('error in edit', err);}
    response.sendStatus(500);
  })
})
//end edit

router.put('/toggle/:id', (request, response) => {
  if(debug){console.log('in toggle op_cl', request.params.id, request.body);}
  let op_cl = ''
  if (request.body.data == 'close'){
    op_cl = 'open'
  } else {
    op_cl = 'close'
  }
  pool.query('UPDATE properties SET op_cl = $1 WHERE id = $2', [op_cl, request.params.id])
  .then((result) => {
    if(debug){console.log('success in toggle', result);}
    response.sendStatus(200);
  })
  .catch ((err) => {
    if(debug){console.log('error in toggle', err);}
    response.sendStatus(500);
  })
})
//end toggle

module.exports = router;
