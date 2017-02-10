var firebase = require('firebase');

module.exports = {
	crud: {
		crudKey: 0,

		getChildKey: function(ref, order, chk){
			ref
				.orderByChild(order)
				.equalTo(chk)
				.on('child_added', function(snapshot){
					crudKey = snapshot.val();
				});
		},

		operation: function(operation){
			console.log("Perform the "+operation+" operation on "+crudKey);
		}
	}
}