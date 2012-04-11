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
    app.set('view options', { layout: false });
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
  });
  return app;
}
exports.initializeWebApp = initializeWebApp;

function connectToDatabase(name) {
  if (! name) { throw Error('Must specify database name'); }
  var host = 'https://sils-webinfo.iriscouch.com/';
  var port = 443;
  return new (
    function(db) {
      db.exists(function (err, exists) {
        if (err) { console.log('error', err); } 
        else if (! exists) {
          db.create();
          console.log('Created new database.');
        }      
      });
      this.save = function() { 
        var args = arguments;
        db.save.apply(db, args); 
      };
      this.filterDocs = function (accept, callback) {
        var that = this;
        db.all({ include_docs: true }, function(err, rows) {
          if (err) { return that.handleErr(err, callback); }
          var results = [];
          for (var i = 0; i < rows.length; i++) {
            var doc = rows[i].doc;
            if (accept(doc)) {
              results.push(doc); 
            }
          }
          return callback(null, results);
        });
      };
      this.getSome = function(item_type, query, callback) {
        if (! item_type) { callback('No item type was specified'); }
        this.filterDocs(function (doc) {
          if (doc.type !== item_type ) { return false; }
          for (var prop in query) {
            if (prop in doc) {
              if (typeof(query[prop]) == 'string') {
                if (doc[prop].toLowerCase().indexOf(query[prop].toLowerCase()) < 0) {
                  return false;
                } 
              } else {
                if (doc.doc[prop] !== query[prop]) {
                  return false;
                }
              }
            }
          }
          return true;
        }, callback);
      };
      this.getAll = function(item_type, callback) {
        if (! item_type) { callback('No item type was specified'); }
        this.filterDocs(function (doc) { 
          return doc.type === item_type; 
        }, callback);
      };
      this.getOne = function(item_type, item_id, callback) {
        var that = this;
        db.get(item_id, function(err, doc) {
          if (err) { return that.handleErr(err, callback); }
          if (doc.type !== item_type) {
            return callback({ 
                error: 'not found', 
                reason: 'item ' + item_id + ' is not of type ' + item_type });
          }
          return callback(null, doc);
        });
      };
      this.handleErr = function(err, callback) {
        console.trace();
        console.error(err);
        callback(err); 
      };
    })(new(cradle.Connection)(host, port).database(name));
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


