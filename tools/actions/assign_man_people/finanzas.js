var app = angular.module('finanzas', []);


app.controller('Analytics', ['$scope', '$http', function ($scope,$http) {
	

	$scope.go = async function() {
		
		//graphql
		function query_assing_man_people(access_token,id_ep,man_id){
			var url_graphql = "https://gis-api.aiesec.org/graphql?access_token=" + access_token
			var manid = parseInt(man_id)

			var query = `mutation UpdatePersonMutation(
				$id: ID!
				$person: PersonInput
			  ) {
				updatePerson(id: $id, person: $person) {
				  managers {
					id
					full_name
					profile_photo
				  }
				  contacted_at
				  contacted_by {
					full_name
					id
				  }
				  follow_up {
					id
					name
				  }
				  id
				}
			  }`
			
			  
			var variables_query = {
				"id": id_ep.toString(),
				"person": {
					"manager_ids": [
						manid
					]
				}
			}

			var jsondata = {
				'query':query,
				'variables':variables_query
			}

			return new Promise((resolve,reject) => {
				console.log(url_graphql)
				console.log(jsondata)

				$http.post(url_graphql,jsondata).success( (res) => {
					try{
						resolve(res)
						console.log(res)
					} catch(e){
						reject(e)
					}					
				})
			})

		}

		var access_token = document.getElementById("access_token").value;
		var ep_id = document.getElementById("ep_id").value;
		var man_id = document.getElementById("man_id").value;

	

		//MC ECO

		

		//setting paginations and variables
		try {
			await query_assing_man_people(access_token,ep_id,man_id)
			document.getElementById('loading-txt').innerHTML = `
		<div align="center"> 
		<p style="font-size:60px; font-weight:bold">DONE!</p>
		<p style="font-size:30px; ">You've assigned ${man_id} as manager to the EP ${ep_id}</p>
		</div>`

		}
		catch(e){
			document.getElementById('loading-txt').innerHTML = `
		<div align="center"> 
		<p style="font-size:60px; font-weight:bold">Error</p>
		<p style="font-size:30px; ">${e}</p>
		</div>`

		}
		
		
		
		
		

	}
	
}])
