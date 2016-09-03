var Components = function(){

	this.components = [],

	this.add = function(id, component){

		if(this.get(id) === false){
			this.components.push({id:id, component:component});
		}else{
			throw 'COMPONENT MANAGER: Already exists a component with this ID. Please rename.';
		}

	},

	this.get = function(id){

		var compLength = this.components.length;

		for (var i = 0; i < compLength; i++) {
			if(this.components[i].id == id){
				return this.components[i];
			}
		};

		return false;

	}

};

var components = new Components();
