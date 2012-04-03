// Import the Express web framework.
var express = require('express');

// Import a library for accessing couchdb.
var cradle = require('cradle');

function initializeWebApp() {
  // Create and configure a new web application.
  var app = express.createServer();
  // Configure the Express web framework.
  app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
  });
  return app;
}
exports.initializeWebApp = initializeWebApp;

function connectToDatabase(host, name) {
  var hosturi = 'https://' + host;
  var port = 443;
  return new (
    function(db) {
      this.getSome = function(item_type, query, callback) {
        if (! item_type) { callback('No item type was specified'); }
        query.type = item_type;
        db.all({ include_docs: true }, function(err, rows) {
          if (err) { return callback(err); }
          var results = [];
          rows.forEach(function(row) {
            for (prop in query) {
              if (prop in row.doc) {
                if (typeof(query[prop]) == 'string') {
                  if (row.doc[prop].indexOf(query[prop]) > 0) {
                    results.push(row.doc);
                  }
                } else {
                  if (row.doc[prop] === query[prop]) {
                    results.push(row.doc);
                  }
                }
              }
            }
          });
          return callback(null, results);
        });
      };
      this.getAll = function(item_type, callback) {
        this.getSome(item_type, {}, callback);
      };
      this.getOne = function(item_type, item_id, callback) {
        db.get(item_id, function(err, doc) {
          if (err) { return callback(err); }
          if (doc.type !== item_type) {
            return callback({ 
                error: 'not found', 
                reason: 'item ' + item_id + ' is not of type ' + item_type });
          }
          return callback(null, doc);
        });
      };
    })(new(cradle.Connection)(hosturi, port).database(name));
}
exports.connectToDatabase = connectToDatabase;

// Authenticate a user using the HTTP Basic Authentication protocol.
function authenticateUser(db, req, res, next) {

  var parts, auth, scheme, credentials; 
  var view, options;
  
  // handle auth stuff
  auth = req.headers["authorization"];
  if (!auth){
    return authRequired(res, 'Microblog');
  }  
  
  parts = auth.split(' ');
  scheme = parts[0];
  credentials = new Buffer(parts[1], 'base64').toString().split(':');
  
  if ('Basic' != scheme) {
    return res.send('Unsupported authorization scheme', 400);
  } 
  req.credentials = credentials;

  // ok, let's look this user up
  view = 'microblog/users_by_id';
  
  options = {};
  options.descending='true';
  options.key=req.credentials[0];
  
  db.view(view, options, function(err, doc) {
    try {
      if(doc[0].value.password===req.credentials[1]) {
        next(req,res);
      }
      else {
        throw new Error('Invalid User');
      } 
    }
    catch (ex) {
      return authRequired(res, 'Microblog');
    }
  });
}
exports.authenticateUser = authenticateUser;

// 'Negotiate' content type; i.e. send them what they requested.
function negotiateContentType(req) {
  switch(req.headers['accept']) {
    case 'text/xml':
      return 'text/xml';
    case 'application/xml':
      return 'application/xml';
    case 'application/xhtml+xml':
      return 'application/xhtml+xml';
    default:
      return 'text/html';
  }
}
exports.negotiateContentType = negotiateContentType;

// Get today's date as a y-m-d string.
function today() {

  var y, m, d, dt;
  
  dt = new Date();

  y = String(dt.getFullYear());
  
  m = String(dt.getMonth()+1);
  if(m.length===1) {
    m = '0'+m;
  }

  d = String(dt.getDate());
  if(d.length===1) {
    d = '0'+d.toString();
  }

  return y+'-'+m+'-'+d;
}
exports.today = today;

// Get the current date and time as a string.
function now() {
  var y, m, d, h, i, s, dt;
  
  dt = new Date();
  
  y = String(dt.getFullYear());
  
  m = String(dt.getMonth()+1);
  if(m.length===1) {
    m = '0'+m;
  }

  d = String(dt.getDate());
  if(d.length===1) {
    d = '0'+d.toString();
  }
  
  h = String(dt.getHours()+1);
  if(h.length===1) {
    h = '0'+h;
  }
  
  i = String(dt.getMinutes()+1);
  if(i.length===1) {
    i = '0'+i;
  }
  
  s = String(dt.getSeconds()+1);
  if(s.length===1) {
    s = '0'+s;
  }
  return y+'-'+m+'-'+d+' '+h+':'+i+':'+s;
}
exports.now = now;

// Return standard 'auth required' response.
function authRequired(res,realm) {
  var realm = (realm || 'Authentication Required');
  res.send('Unauthorized', 
    { 'WWW-Authenticate': 'Basic realm="' + realm + '"' }, 401);
}


