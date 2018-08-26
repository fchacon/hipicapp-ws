require("source-map-support/register"),module.exports=function(modules){function __webpack_require__(moduleId){if(installedModules[moduleId])return installedModules[moduleId].exports;var module=installedModules[moduleId]={i:moduleId,l:!1,exports:{}};return modules[moduleId].call(module.exports,module,module.exports,__webpack_require__),module.l=!0,module.exports}var installedModules={};return __webpack_require__.m=modules,__webpack_require__.c=installedModules,__webpack_require__.d=function(exports,name,getter){__webpack_require__.o(exports,name)||Object.defineProperty(exports,name,{configurable:!1,enumerable:!0,get:getter})},__webpack_require__.n=function(module){var getter=module&&module.__esModule?function(){return module.default}:function(){return module};return __webpack_require__.d(getter,"a",getter),getter},__webpack_require__.o=function(object,property){return Object.prototype.hasOwnProperty.call(object,property)},__webpack_require__.p="/",__webpack_require__(__webpack_require__.s=8)}([function(module,exports,__webpack_require__){"use strict";function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),_=__webpack_require__(1),envConfig=__webpack_require__(14),expressConfig=__webpack_require__(17),RouteConfig=__webpack_require__(24),DSConfig=__webpack_require__(25),i18nConfig=__webpack_require__(29),ApiConfig=function(){function ApiConfig(){_classCallCheck(this,ApiConfig)}return _createClass(ApiConfig,null,[{key:"init",value:function(application){expressConfig.init(application),RouteConfig.init(application),DSConfig.initMongoDB(this.getEnv().DB_MONGO_DEFAULT_HOST),i18nConfig.init(application)}},{key:"getEnv",value:function(){return envConfig||{}}},{key:"getAllConstants",value:function(){var globalConst=__webpack_require__(31),otherConst={};return _.merge(globalConst,otherConst)}}]),ApiConfig}();module.exports=ApiConfig},function(module,exports){module.exports=require("lodash")},function(module,exports){module.exports=require("mongoose")},function(module,exports){module.exports=require("express")},function(module,exports){module.exports=require("bluebird")},function(module,exports,__webpack_require__){"use strict";function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}var _mongoose=__webpack_require__(2),_mongoose2=_interopRequireDefault(_mongoose),_bluebird=__webpack_require__(4),_bluebird2=_interopRequireDefault(_bluebird),_userModel=__webpack_require__(40),_userModel2=_interopRequireDefault(_userModel),_lodash=__webpack_require__(1),_lodash2=_interopRequireDefault(_lodash);_userModel2.default.statics.findByEmail=function(email){return new _bluebird2.default(function(resolve,reject){var _query={email:email};User.findOne(_query).exec(function(err,users){err?reject(err):resolve(users)})})},_userModel2.default.statics.getAll=function(){return new _bluebird2.default(function(resolve,reject){var _query={};User.find(_query).exec(function(err,users){err?reject(err):resolve(users)})})},_userModel2.default.statics.getById=function(id){return new _bluebird2.default(function(resolve,reject){if(!id)return reject(new TypeError("Id is not defined."));User.findById(id).lean().exec(function(err,user){err?reject(err):resolve(user)})})},_userModel2.default.statics.createUser=function(user){return new _bluebird2.default(function(resolve,reject){if(!_lodash2.default.isObject(user))return reject(new TypeError("User is not a valid object."));new User(user).save(function(err,saved){err?reject(err):resolve(saved)})})},_userModel2.default.statics.updateUser=function(userId,object){return new _bluebird2.default(function(resolve,reject){return _lodash2.default.isObject(object)?User.findByIdAndUpdate(userId,object,{new:!0}).exec(function(err,newUser){err?reject(err):resolve(newUser)}):reject(new TypeError("User is not a valid object."))})},_userModel2.default.statics.deleteUser=function(id){return new _bluebird2.default(function(resolve,reject){if(!_lodash2.default.isString(id))return reject(new TypeError("Id is not a valid string."));User.findByIdAndRemove(id).exec(function(err,deleted){err?reject(err):resolve()})})};var User=_mongoose2.default.model("User",_userModel2.default);module.exports=User},function(module,exports,__webpack_require__){"use strict";function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function isAuthenticated(){var access_token=null;return(0,_composableMiddleware2.default)().use(function(req,res,next){req.query&&req.query.hasOwnProperty("access_token")&&(req.headers.authorization="Bearer "+req.query.access_token,access_token=req.query.access_token),validateJwt(req,res,next)}).use(function(req,res,next){_userDao2.default.getById(req.user._id).then(function(user){return user?(req.user=user,req.user.access_token=access_token,next(),null):res.status(401).end()}).catch(function(err){return next(err)})}).use(function(err,req,res,next){res.status(err.status).json({error:err.name,message:err.message,code:err.code})})}function hasRole(roleRequired){if(!roleRequired)throw new Error("Required role needs to be set");return(0,_composableMiddleware2.default)().use(isAuthenticated()).use(function(req,res,next){return _config2.default.getEnv().userRoles.indexOf(req.user.role)>=_config2.default.getEnv().userRoles.indexOf(roleRequired)?next():res.status(403).send("Forbidden")})}function signToken(id,role){return _jsonwebtoken2.default.sign({_id:id,role:role},_config2.default.getEnv().session.secret,{expiresIn:300})}function setTokenCookie(req,res){if(!req.user)return res.status(404).send("It looks like you aren't logged in, please try again.");var token=signToken(req.user._id,req.user.role);res.cookie("token",token),res.redirect("/")}Object.defineProperty(exports,"__esModule",{value:!0}),exports.isAuthenticated=isAuthenticated,exports.hasRole=hasRole,exports.signToken=signToken,exports.setTokenCookie=setTokenCookie;var _jsonwebtoken=__webpack_require__(42),_jsonwebtoken2=_interopRequireDefault(_jsonwebtoken),_expressJwt=__webpack_require__(43),_expressJwt2=_interopRequireDefault(_expressJwt),_composableMiddleware=__webpack_require__(44),_composableMiddleware2=_interopRequireDefault(_composableMiddleware),_userDao=__webpack_require__(5),_userDao2=_interopRequireDefault(_userDao),_config=__webpack_require__(0),_config2=_interopRequireDefault(_config),validateJwt=(0,_expressJwt2.default)({secret:_config2.default.getEnv().session.secret})},function(module,exports){module.exports=require("passport")},function(module,exports,__webpack_require__){"use strict";__webpack_require__(10).config(),__webpack_require__(11)},function(module,exports){module.exports=require("babel-register")},function(module,exports){module.exports=require("dotenv")},function(module,exports,__webpack_require__){"use strict";var os=(process.env.PORT,__webpack_require__(12)),http=__webpack_require__(13),express=__webpack_require__(3),ApiConfig=__webpack_require__(0),Routes=__webpack_require__(32),app=express();ApiConfig.init(app),Routes.init(app,express.Router()),http.createServer(app).listen(ApiConfig.getEnv().PORT,function(){console.log("up and running @: "+os.hostname()+" on port: "+ApiConfig.getEnv().PORT),console.log("environment: "+ApiConfig.getEnv().NODE_ENV)})},function(module,exports){module.exports=require("os")},function(module,exports){module.exports=require("http")},function(module,exports,__webpack_require__){"use strict";var _=__webpack_require__(1),sharedVars=__webpack_require__(15),envVars=process.env||{},vars=_.merge(sharedVars,envVars);module.exports=vars},function(module,exports,__webpack_require__){"use strict";var vars={session:{secret:"shhhhhhared-secret"},userRoles:["guest","user","admin"]};module.exports=vars},function(module,exports,__webpack_require__){"use strict";var vars={NODE_ENV:"development",PORT:8080,DB_MONGO_DEFAULT_HOST:"mongodb://192.168.1.122/Node-Base",DB_MONGO_DEFAULT_PORT:27017,DB_MYSQL_DEFAULT_HOST:null,DB_MYSQL_DEFAULT_PORT:null,MEMCACHE_SESSION_HOST:"192.168.1.224",MEMCACHE_SESSION_PORT:11211,MEMCACHE_DATA_HOST:"192.168.1.224",MEMCACHE_DATA_PORT:11211};module.exports=vars},function(module,exports,__webpack_require__){"use strict";function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),morgan=__webpack_require__(18),bodyParser=__webpack_require__(19),contentLength=__webpack_require__(20),helmet=__webpack_require__(21),express=__webpack_require__(3),compression=__webpack_require__(22),zlib=__webpack_require__(23),expressConfig=function(){function expressConfig(){_classCallCheck(this,expressConfig)}return _createClass(expressConfig,null,[{key:"init",value:function(application){var _root=process.cwd();application.use(compression({level:zlib.Z_BEST_COMPRESSION,threshold:"1kb"})),application.use(express.static(_root+"/node_modules/")),application.use(express.static(_root+"/jspm_packages/")),application.use(express.static(_root+"/client/dist/")),application.use(bodyParser.json({limit:"50mb",type:"application/json"})),application.use(bodyParser.urlencoded({extended:!0,limit:"50mb"})),application.use(morgan("dev")),application.use(contentLength.validateMax({max:1e4})),application.use(helmet())}}]),expressConfig}();module.exports=expressConfig},function(module,exports){module.exports=require("morgan")},function(module,exports){module.exports=require("body-parser")},function(module,exports){module.exports=require("express-content-length-validator")},function(module,exports){module.exports=require("helmet")},function(module,exports){module.exports=require("compression")},function(module,exports){module.exports=require("zlib")},function(module,exports,__webpack_require__){"use strict";function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),RouteConfig=function(){function RouteConfig(){_classCallCheck(this,RouteConfig)}return _createClass(RouteConfig,null,[{key:"init",value:function(application){}}]),RouteConfig}();module.exports=RouteConfig},function(module,exports,__webpack_require__){"use strict";function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),mongoConfig=__webpack_require__(26),mysqlConfig=__webpack_require__(27),DSConfig=(__webpack_require__(28),function(){function DSConfig(){_classCallCheck(this,DSConfig)}return _createClass(DSConfig,null,[{key:"initMongoDB",value:function(initParams){mongoConfig.init(initParams)}},{key:"initMysql",value:function(initParams){mysqlConfig.init()}},{key:"initSqlServer",value:function(initParams){}}]),DSConfig}());module.exports=DSConfig},function(module,exports,__webpack_require__){"use strict";function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),mongoose=__webpack_require__(2),Promise=__webpack_require__(4),MongoConf=function(){function MongoConf(){_classCallCheck(this,MongoConf)}return _createClass(MongoConf,null,[{key:"init",value:function(connectionUrl){mongoose.Promise=Promise,mongoose.connect(connectionUrl,{useMongoClient:!0}),mongoose.connection.on("error",console.error.bind(console,"An error ocurred with the DB connection: "))}}]),MongoConf}();module.exports=MongoConf},function(module,exports,__webpack_require__){"use strict";function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),MysqlConf=function(){function MysqlConf(){_classCallCheck(this,MysqlConf)}return _createClass(MysqlConf,null,[{key:"init",value:function(connectionUrl){}}]),MysqlConf}();module.exports=MysqlConf},function(module,exports,__webpack_require__){"use strict";function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),SqlServerConf=function(){function SqlServerConf(){_classCallCheck(this,SqlServerConf)}return _createClass(SqlServerConf,null,[{key:"init",value:function(connectionUrl){}}]),SqlServerConf}();module.exports=SqlServerConf},function(module,exports,__webpack_require__){"use strict";(function(__dirname){function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),i18n=__webpack_require__(30),i18nConfig=function(){function i18nConfig(){_classCallCheck(this,i18nConfig)}return _createClass(i18nConfig,null,[{key:"init",value:function(application){i18n.configure({locales:["es","en"],directory:__dirname+"/locales",defaultLocale:"es",api:{__:"t",__n:"tn"},register:global}),application.use(i18n.init)}}]),i18nConfig}();module.exports=i18nConfig}).call(exports,"server/config")},function(module,exports){module.exports=require("i18n")},function(module,exports){module.exports={}},function(module,exports,__webpack_require__){"use strict";function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),TodoRoutes=__webpack_require__(33),UserRoutes=__webpack_require__(38),Routes=function(){function Routes(){_classCallCheck(this,Routes)}return _createClass(Routes,null,[{key:"init",value:function(app,router){TodoRoutes.init(router),UserRoutes.init(router),app.use("/",router),app.use("/auth",__webpack_require__(45).default)}}]),Routes}();module.exports=Routes},function(module,exports,__webpack_require__){"use strict";function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),TodoController=__webpack_require__(34),TodoMiddleware=__webpack_require__(37),TodoRoutes=function(){function TodoRoutes(){_classCallCheck(this,TodoRoutes)}return _createClass(TodoRoutes,null,[{key:"init",value:function(router){router.route("/api/todos").get(TodoMiddleware.checkParams,TodoController.getAll).post(TodoController.createTodo),router.route("/api/todos/:id").delete(TodoController.deleteTodo)}}]),TodoRoutes}();module.exports=TodoRoutes},function(module,exports,__webpack_require__){"use strict";function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),TodoDAO=__webpack_require__(35),TodoController=(__webpack_require__(0),function(){function TodoController(){_classCallCheck(this,TodoController)}return _createClass(TodoController,null,[{key:"getAll",value:function(req,res){TodoDAO.getAll().then(function(todos){return res.status(200).json(todos)}).catch(function(error){return res.status(400).json(error)})}},{key:"getById",value:function(req,res){TodoDAO.getById(req.params.id).then(function(todo){return res.status(200).json(todo)}).catch(function(error){return res.status(400).json(error)})}},{key:"createTodo",value:function(req,res){var _todo=req.body;TodoDAO.createTodo(_todo).then(function(todo){return res.status(201).json(todo)}).catch(function(error){return res.status(400).json(error)})}},{key:"deleteTodo",value:function(req,res){var _id=req.params.id;TodoDAO.deleteTodo(_id).then(function(){return res.status(200).end()}).catch(function(error){return res.status(400).json(error)})}}]),TodoController}());module.exports=TodoController},function(module,exports,__webpack_require__){"use strict";var _=__webpack_require__(1),mongoose=__webpack_require__(2),Promise=__webpack_require__(4),todoSchema=__webpack_require__(36);__webpack_require__(0);todoSchema.statics.getAll=function(){return new Promise(function(resolve,reject){var _query={};Todo.find(_query).exec(function(err,todos){err?reject(err):resolve(todos)})})},todoSchema.statics.getById=function(id){return new Promise(function(resolve,reject){if(!id)return reject(new TypeError("Id is not defined."));Todo.findById(id).exec(function(err,todo){err?reject(err):resolve(todo)})})},todoSchema.statics.createTodo=function(todo){return new Promise(function(resolve,reject){if(!_.isObject(todo))return reject(new TypeError("Todo is not a valid object."));new Todo(todo).save(function(err,saved){err?reject(err):resolve(saved)})})},todoSchema.statics.deleteTodo=function(id){return new Promise(function(resolve,reject){if(!_.isString(id))return reject(new TypeError("Id is not a valid string."));Todo.findByIdAndRemove(id).exec(function(err,deleted){err?reject(err):resolve()})})};var Todo=mongoose.model("Todo",todoSchema);module.exports=Todo},function(module,exports,__webpack_require__){"use strict";var mongoose=__webpack_require__(2),_todoSchema=(__webpack_require__(0),{todoMessage:{type:String,required:!0,trim:!0},createdAt:{type:Date,default:Date.now}});module.exports=mongoose.Schema(_todoSchema,{pluralization:!1,retainKeyOrder:!0})},function(module,exports,__webpack_require__){"use strict";function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),TodoMiddleware=(__webpack_require__(0),function(){function TodoMiddleware(){_classCallCheck(this,TodoMiddleware)}return _createClass(TodoMiddleware,null,[{key:"checkParams",value:function(req,res,next){next()}}]),TodoMiddleware}());module.exports=TodoMiddleware},function(module,exports,__webpack_require__){"use strict";function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),_userController=__webpack_require__(39),_userController2=function(obj){return obj&&obj.__esModule?obj:{default:obj}}(_userController),_auth=__webpack_require__(6),Auth=function(obj){if(obj&&obj.__esModule)return obj;var newObj={};if(null!=obj)for(var key in obj)Object.prototype.hasOwnProperty.call(obj,key)&&(newObj[key]=obj[key]);return newObj.default=obj,newObj}(_auth);module.exports=function(){function UserRoutes(){_classCallCheck(this,UserRoutes)}return _createClass(UserRoutes,null,[{key:"init",value:function(router){router.route("/api/users").get(Auth.isAuthenticated(),_userController2.default.getAll).post(_userController2.default.createUser),router.route("/api/users/:_id").post(Auth.isAuthenticated(),_userController2.default.updateUser)}}]),UserRoutes}()},function(module,exports,__webpack_require__){"use strict";function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),_userDao=__webpack_require__(5),_userDao2=_interopRequireDefault(_userDao),_lodash=__webpack_require__(1),_lodash2=_interopRequireDefault(_lodash);module.exports=function(){function UserController(){_classCallCheck(this,UserController)}return _createClass(UserController,null,[{key:"getAll",value:function(req,res){_userDao2.default.getAll().then(function(users){return res.status(200).json(users)}).catch(function(error){return res.status(400).json(error)})}},{key:"getById",value:function(req,res){_userDao2.default.getById(req.params.id).then(function(user){return res.status(200).json(user)}).catch(function(error){return res.status(400).json(error)})}},{key:"createUser",value:function(req,res){var _user=req.body;_userDao2.default.createUser(_user).then(function(user){return res.status(201).json(user)}).catch(function(error){return res.status(400).json(error)})}},{key:"updateUser",value:function(req,res){var _user=req.body,_userId=req.params._id;_lodash2.default.unset(_user,"_id"),_userDao2.default.updateUser(_userId,_user).then(function(user){return res.status(201).json(user)}).catch(function(error){return res.status(400).json(error)})}},{key:"deleteUser",value:function(req,res){var _id=req.params.id;_userDao2.default.deleteUser(_id).then(function(){return res.status(200).end()}).catch(function(error){return res.status(400).json(error)})}}]),UserController}()},function(module,exports,__webpack_require__){"use strict";function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}var _mongoose=__webpack_require__(2),_mongoose2=_interopRequireDefault(_mongoose),_crypto=__webpack_require__(41),_crypto2=_interopRequireDefault(_crypto),_lodash=__webpack_require__(1),User=(_interopRequireDefault(_lodash),new _mongoose2.default.Schema({name:{type:String,required:!1,trim:!0},email:{type:String,required:!0,trim:!0},password:{type:String,required:!0},provider:String,salt:String},{timestamps:!0})),validatePresenceOf=function(value){return value&&value.length};User.pre("save",function(next){var _this=this;return console.log("isModified",this.isModified("password")),this.isModified("password")?validatePresenceOf(this.password)?void this.makeSalt(function(saltErr,salt){if(saltErr)return next(saltErr);_this.salt=salt,_this.encryptPassword(_this.password,function(encryptErr,hashedPassword){return encryptErr?next(encryptErr):(_this.password=hashedPassword,next())})}):-1===authTypes.indexOf(this.provider)?next(new Error("Invalid password")):next():next()}),User.methods={authenticate:function(password,callback){var _this2=this;if(!callback)return this.password===this.encryptPassword(password);this.encryptPassword(password,function(err,pwdGen){return err?callback(err):_this2.password===pwdGen?callback(null,!0):callback(null,!1)})},makeSalt:function(byteSize,callback){if("function"==typeof arguments[0])callback=arguments[0],byteSize=16;else{if("function"!=typeof arguments[1])throw new Error("Missing Callback");callback=arguments[1]}return byteSize||(byteSize=16),_crypto2.default.randomBytes(byteSize,function(err,salt){return err?callback(err):callback(null,salt.toString("base64"))})},encryptPassword:function(password,callback){if(!password||!this.salt)return callback?callback("Missing password or salt"):null;var salt=new Buffer(this.salt,"base64");return callback?_crypto2.default.pbkdf2(password,salt,1e4,64,"sha512",function(err,key){return err?callback(err):callback(null,key.toString("base64"))}):_crypto2.default.pbkdf2Sync(password,salt,1e4,64,"sha512").toString("base64")}},module.exports=User},function(module,exports){module.exports=require("crypto")},function(module,exports){module.exports=require("jsonwebtoken")},function(module,exports){module.exports=require("express-jwt")},function(module,exports){module.exports=require("composable-middleware")},function(module,exports,__webpack_require__){"use strict";function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}Object.defineProperty(exports,"__esModule",{value:!0});var _userDao=__webpack_require__(5),_userDao2=_interopRequireDefault(_userDao),_express=__webpack_require__(3),_express2=_interopRequireDefault(_express);__webpack_require__(46).setup(_userDao2.default);var router=_express2.default.Router();router.use("/local",__webpack_require__(48).default),exports.default=router},function(module,exports,__webpack_require__){"use strict";function localAuthenticate(User,email,password,done){User.findByEmail(email.toLowerCase()).then(function(user){if(!user)return done(null,!1,{message:"This email is not registered."});user.authenticate(password,function(authError,authenticated){return authError?done(authError):authenticated?done(null,user):done(null,!1,{message:"This password is not correct."})})}).catch(function(err){return done(err)})}function setup(User){_passport2.default.use(new _passportLocal.Strategy({usernameField:"email",passwordField:"password"},function(email,password,done){return localAuthenticate(User,email,password,done)}))}Object.defineProperty(exports,"__esModule",{value:!0}),exports.setup=setup;var _passport=__webpack_require__(7),_passport2=function(obj){return obj&&obj.__esModule?obj:{default:obj}}(_passport),_passportLocal=__webpack_require__(47)},function(module,exports){module.exports=require("passport-local")},function(module,exports,__webpack_require__){"use strict";function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}Object.defineProperty(exports,"__esModule",{value:!0});var _express=__webpack_require__(3),_express2=_interopRequireDefault(_express),_passport=__webpack_require__(7),_passport2=_interopRequireDefault(_passport),_auth=__webpack_require__(6),router=_express2.default.Router();router.post("/",function(req,res,next){_passport2.default.authenticate("local",function(err,user,info){var error=err||info;if(error)return res.status(401).json(error);if(!user)return res.status(404).json({message:"Something went wrong, please try again."});var token=(0,_auth.signToken)(user._id,user.role);res.json({token:token})})(req,res,next)}),exports.default=router}]);