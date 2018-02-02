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
    this.name = "Unnamed";
    // list of users (only its uid)
    this.members = [];
    // list of tasks
    this.ht = {};
    // shopping list
    this.sh = {};
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

Group.prototype.addTask = function(params)
{

}

Group.prototype.addItem = function(params)
{

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
    var that = this;

    getFromDB(TD.ON, "groups", "/", function(data){
        that.groups = data;
        getFromDB(TD.ON, "n_groups", "/", function(data){
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
        if(gr[i].uid === currentUID) globals.user.currentGroup = gr[i];
}

DataBase.prototype.refresh = function()
{
    this.n_groups = null;
    this.groups = null;
    var that = this;

    this.update(function(){
            that.updateGroups();
			UI.refreshMain();
			fw7.ptr.done();
		});
}

// Footer
})( typeof(window) != "undefined" ? window : (typeof(self) != "undefined" ? self : global ) );