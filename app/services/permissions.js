
let validatePermissions = (uPermissions, permissions) => {

	return new Promise((resolve, reject) => {

	  	if (permissions.length && uPermissions){

	  		if (!uPermissions.admin) {

		  		for (var i = permissions.length - 1; i >= 0; i--) {

		  			let tempPermission = uPermissions

		  			let permission = permissions[i]

		  			let parts = permission.split('.')

		  			let totalParts = parts.length


		  			for (var l = 0; l < totalParts; l++) {

		  				tempPermission = tempPermission[parts[l]]

		  				if (!tempPermission){
		  					reject( { message: 'Unauthorized', denied: true } )
		  					break
		  					break
		  				}


		  			};

		  		};
		  		
		  		resolve()
	  		}
	  		else
	  			resolve()

		}
		else
			reject( { message: 'Not permissions', denied: true } )

	});
	
}

export { validatePermissions as Permissions }