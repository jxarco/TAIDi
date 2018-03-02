// Header
(function(global){

/**
 * Main namespace
 * @namespace TD
 */

/**
 * the global namespace, access it using TD.
 * @class .
 */

var TD = global.TD = {
	version: 1.0
};

TD.Task = 001;
TD.Item = 002;
TD.PreloadTimeOut = 1750;
    
TD.ONCE = 003;
TD.ON = 004;
    
TD.LastCardID = 0;

TD.Setup = function(callback)
{
    
}

/**
* @class User
* @methods
*/

function User(o)
{
    if(this.constructor !== TD.User)
		throw("You must use new to create TD.User");
	this._ctor();
	if(o)
		this.configure( o );
}

TD.User = User;

User.prototype._ctor = function()
{
    this.uid = null;
    this.name = "Unnamed";
    this.email = "No mail";
    // list of connected groups (only its uid)
    this.gs = [];

    this.storage = {};
}

User.prototype.configure = function(o)
{
    //copy to attributes
	for(var i in o)
	{
		switch( i )
		{
			case "storage": //special case
				continue;
		};

		//default
		var v = this[i];
		if(v === undefined)
			continue;

		if( v && v.constructor === Float32Array )
			v.set( o[i] );
		else
			this[i] = o[i];
	}
}

User.prototype.getUid = function()
{
    return this.uid ? this.uid : undefined;
}

User.prototype.setGroups = function(groups)
{
    if(groups.length)
        {
            this.groups = groups;
            console.log("Groups added to current user");
        }
}

User.prototype.addGroup = function(params)
{

}

/**
* @class Set
* @methods
*/

function Group(o)
{
    if(this.constructor !== TD.Group)
		throw("You must use new to create TD.Group");
	this._ctor();
	if(o)
		this.configure( o );
}

TD.Group = Group;

Group.prototype._ctor = function()
{
    this.uid = null;
    this.share_id = null;
    this.name = "Unnamed";
    // list of users (only its uid)
    this.members = [];
    // list of tasks
    this.tasks = [];
    // shopping list
    this.items = [];
}

Group.prototype.configure = function(o)
{
    //copy to attributes
	for(var i in o)
	{
		switch( i )
		{
			case "special_case": //special case
				continue;
		};

		//default
		var v = this[i];
		if(v === undefined)
			continue;

		if( v && v.constructor === Float32Array )
			v.set( o[i] );
		else
			this[i] = o[i];
	}
}

Group.prototype.addTask = function(o)
{
    var unit = "groups";
    // it's the last task added so the identifier
    // will be: tasks size
    var taskId = this.tasks.length;
    var groupId = this.uid.slice(2, this.uid.length);
    var fullPath = groupId + "/tasks/" + taskId;
    
	writeToDB(unit, fullPath, o);
    globals.db.refresh();
}

Group.prototype.removeTask = function( cardNumber )
{
	var unit = "groups";
    var groupId = this.uid.slice(2, this.uid.length);
    var fullPath = groupId + "/tasks/" + cardNumber;
    
    console.log(unit + "/" + fullPath);
    
	deleteFromDB(unit, fullPath);
    globals.db.refresh();
}

Group.prototype.completeTask = function( cardNumber )
{
	var unit = "groups";
	var task = this.tasks[cardNumber];
    var groupId = this.uid.slice(2, this.uid.length);
    var fullPathToDelete = groupId + "/tasks/" + cardNumber;
	var fullPathToInsert = groupId + "/log/";
    
    console.log(unit + "/" + fullPathToDelete);
    
	deleteFromDB(unit, fullPathToDelete);
	writeToDB(unit, fullPathToInsert, task, function() { UI.refreshMain(); })
    globals.db.refresh();
}

Group.prototype.addItem = function(item)
{
	var unit = "groups";
    // it's the last item added so the identifier
    // will be: list size
    var itemId = this.items.length;
    var groupId = this.uid.slice(2, this.uid.length);
    var fullPath = groupId + "/items/" + itemId;
    
	writeToDB(unit, fullPath, item);
    globals.db.refresh();
}

Group.prototype.removeItem = function( cardNumber )
{
	var unit = "groups";
    var groupId = this.uid.slice(2, this.uid.length);
    var fullPath = groupId + "/items/" + cardNumber;
    
    console.log(unit + "/" + fullPath);
    
	deleteFromDB(unit, fullPath);
    globals.db.refresh();
}

/**
* @class DataBase
* @methods
*/

function DataBase(o)
{
    if(this.constructor !== TD.DataBase)
		throw("You must use new to create TD.DataBase");
	this._ctor();
	if(o)
		this.configure( o );
}

TD.DataBase = DataBase;

DataBase.prototype._ctor = function()
{
    this.n_groups = 0;
    this.groups = [];
}

DataBase.prototype.configure = function(o)
{
    //copy to attributes
	for(var i in o)
	{
		switch( i )
		{
			case "special_case": //special case
				continue;
		};

		//default
		var v = this[i];
		if(v === undefined)
			continue;

		if( v && v.constructor === Float32Array )
			v.set( o[i] );
		else
			this[i] = o[i];
	}
}

DataBase.prototype.init = function(callback)
{
    console.warn("Filling DataBase, please wait");
    var that = this;

    getFromDB(TD.ONCE, "groups", "/", function(data){
        that.groups = data;
        getFromDB(TD.ONCE, "n_groups", "/", function(data){
            that.n_groups = data;
            // console.log( that );
            console.warn("DataBase loaded successfully");

            if(callback)
              	callback();
        });
    }, function(error){
        console.error(error);
    });
}

DataBase.prototype.update = function(callback)
{
    console.warn("Refilling DataBase, please wait");
    var that = this, read_mode = TD.ONCE;

    if(globals.auto_refresh)
        read_mode = TD.ON;
    
    getFromDB(read_mode, "groups", "/", function(data){
        that.groups = data;		
        getFromDB(read_mode, "n_groups", "/", function(data){
            that.n_groups = data;
            // console.log( that );
            console.warn("DataBase reloaded successfully");

            if(callback)
              	callback();
        });
    }, function(error){
        console.error(error);
    });
}

DataBase.prototype.updateGroups = function()
{
    if(!globals.user)
        throw( "No user connected" );
    
    var currentUID = globals.user.currentGroup.uid;
    var gr = globals.db.groups;
    
    for(var i = 0; i < gr.length; i++)
        if(gr[i].uid === currentUID) globals.user.currentGroup = new TD.Group(gr[i]);
}

DataBase.prototype.refresh = function()
{
    this.n_groups = null;
    this.groups = null;
    var that = this;

    this.update(function(){
            that.updateGroups();
			UI.refreshMain();
            ptr_done();
		});
}

// Footer
})( typeof(window) != "undefined" ? window : (typeof(self) != "undefined" ? self : global ) );
