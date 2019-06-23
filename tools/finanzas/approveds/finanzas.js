var app = angular.module('finanzas', []);

function setProgramaGraphQL(programa) {
	switch (programa) {
		case "1":
			return {
				'id': 1,
				'area': "people",
				'application': "person_committee",
				'shortname': "oGV"
			}
			break;
		case "2":
			return {
				'id': 2,
				'area': "people",
				'application': "person_committee",
				'shortname': "oGT"
			}
			break;
		case "3":
			return {
				'id': 5,
				'area': "people",
				'application': "person_committee",
				'shortname': "oGE"
			}
			break;
		case "4":
			return {
				'id': 1,
				'area': "opportunities",
				'application': "opportunity_committee",
				'shortname': "iGV"
			}
			break;
		case "5":
			return {
				'id': 2,
				'area': "opportunities",
				'application': "opportunity_committee",
				'shortname': "iGT"
			}
			break;
		default:
			return {
				'id': 5,
				'area': "opportunities",
				'application': "opportunity_committee",
				'shortname': "iGE"
			}
			break;
	}
}

var requestKey;

var query = `query ApplicationIndexQuery(
				$page: Int
				$perPage: Int
				$filters: ApplicationFilter
				$sort: String
				
			  ) {
				allOpportunityApplication(page: $page, per_page: $perPage, filters: $filters, sort: $sort) {
				  ...ApplicationList_list
				}
			  }
			  
			  fragment ApplicationList_list on OpportunityApplicationList {
				data {
				  status    
				  date_realized
				  date_approved
				  date_matched 
				  opportunity {
					id
					title 
					programmes {
					  short_name_display
					  id
					}
					host_lc {
					  name 
					  id
					}
					home_mc {
					  name 
					  id
					}
				  }
				  person {
					id
					full_name 
					email
					phone 
					home_lc {
					  name 
					  id
					}
					home_mc {
					  name 
					  id
					}
				  }
				  id
				  standards{
					constant_name
					matching_with_opportunity
					  
				  }
				  
				  created_at 
				  experience_end_date
				  experience_start_date 
				}
				
				paging {
				  total_pages
				  current_page
				  total_items
				}
			}`

function loadTableDataOnFirstRequest($scope, data, rowIndex, programa, currentKey) {

	data.forEach(function (elem) {
		var lc;
		var country;
		if (programa.id >= '1' && programa.id <= '3') {
			$scope.host = '';
			country_label = true;
			lc = elem.person.home_lc.name; //SOLO PARA oGX
			country = elem.opportunity.office === undefined ? '' : elem.opportunity.office.country;
		}
		else {
			$scope.home = '';
			lc = elem.person.home_lc.name;
			country = elem.person.home_lc.country; //SOLO PARA iCX
		}

		rowIndex.index++;

		var apdDate = new Date(elem.date_approved);
		apdDate = apdDate.getDate() + '/' + apdDate.getMonth() + '/' + apdDate.getFullYear()

		$('#table_apd').DataTable().row.add([
			rowIndex.index,
			elem.person.full_name === null ? '' : elem.person.full_name,
			apdDate,
			elem.person.email === null ? '' : elem.person.email,
			elem.opportunity.id === null ? '' : elem.opportunity.id,
			elem.opportunity.title === null ? '' : elem.opportunity.title,
			lc === null ? '' : lc,
			elem.opportunity.home_mc.name,
			//elem.opportunity.office === undefined ? '' : elem.opportunity.office.name,
			country,
			'https://expa.aiesec.org/people/' + elem.person.id,
			elem.status === null ? '' : elem.status,
		]);
	});

	$('#table_apd').DataTable().draw();
}

app.controller('Analytics', ['$scope', '$http', function ($scope, $http) {
	$scope.go = function () {

		var access_token = document.getElementById("access_token").value;
		var start_date = document.getElementById("fecha_in").value;
		var end_date = document.getElementById("fecha_out").value;
		var programa = document.getElementById("programa").value;
		var programa_gql = setProgramaGraphQL(programa);

		//graphql
		function testgraphql(access_token, date_in, date_out, programa, rowIndex) {
			var url_graphql = "https://gis-api.aiesec.org/graphql?access_token=" + access_token;

			var variables_query = {
				"page": 1,
				"perPage": 100,
				"filters": {
					"date_approved": {
						"from": date_in,
						"to": date_out
					},
					"programmes": programa.id,
					"for": programa.area
				}
			}

			var jsondata = {
				'query': query,
				'variables': variables_query
			}

			requestKey = Math.random();
			var currentKey = requestKey;

			$http.post(url_graphql, jsondata)
				.success(function (res) {
					// Para que no se manden mas request en caso de que se invoque varias veces esta función.
					if (currentKey != requestKey) {
						return;
					}

					var data = res.data.allOpportunityApplication.data;
					var pagesHandler = res.data.allOpportunityApplication.paging;

					loadTableDataOnFirstRequest($scope, data, rowIndex, programa, currentKey);

					if (pagesHandler.total_pages > 1) {
						for (let i = 2; i <= pagesHandler.total_pages; i++) {
							jsondata.variables.page = i;
							$http.post(url_graphql, jsondata).success(function (result) {
								loadTableDataOnFirstRequest($scope, result.data.allOpportunityApplication.data, rowIndex, programa, currentKey);
							});
						}
					}

					if (programa.id >= '1' && programa.id <= '3') {
						name_ = 'Host Country';
					}
					else {
						name_ = 'Home Country';
					}

					//$scope.name =  { "name": name_ };
					//$scope.people = people_expa;
					spinner();
				});
		}

		$('#table_apd').DataTable().clear().draw();
		testgraphql(access_token, start_date, end_date, programa_gql, { index: 0 })

		spinner_up();

		function spinner() {
			$('#status').fadeOut(); // will first fade out the loading animation
			$('#preloader').delay(300).fadeOut('slow'); // will fade out the white DIV that covers the website.
			$('body').delay(300).css({ 'overflow': 'visible' });
		}

		function spinner_up() {
			$('#status').fadeIn(); // will first fade out the loading animation
			$('#preloader').delay(300).fadeIn('slow'); // will fade out the white DIV that covers the website.
			$('body').delay(300).css({ 'overflow': 'hidden' });
		}
	}
}])

$(document).ready(function () {
	$('#table_apd').DataTable({
		dom: 'Bfrtip',
		buttons: ['copy', 'excel', 'pdf', 'colvis'],
		columnDefs: [
			{
				targets: 0, visible: true, searchable: false, orderable: false, width: '1%'
			},  // Columna index.
			{
				targets: 1, visible: true, searchable: true, orderable: true, width: '1%'
			},  // Columna Nombre y apellido.
			{
				targets: 2, orderable: true, visible: true, width: '1%', type: 'date-eu-pre'
			},  // Columna Fecha APD.
			{
				targets: 3, orderable: true, visible: true, width: '1%'
			},  // Columna Email.
			{
				targets: 4, visible: true, width: '1%'
			},  // Columna OPP ID.
			{
				targets: 5, orderable: true, visible: true, width: '1%'
			},  // Columna OPP Nombres.
			{
				targets: 6, visible: false, width: '1%'
			},  // Columna Home LC.
			{
				targets: 5, orderable: true, visible: true, width: '1%'
			},  // Columna Country.
			{
				targets: 5, orderable: true, visible: true, width: '1%'
			},  // Columna Host LC.
			{
				targets: 5, orderable: true, visible: true, width: '1%'
			},  // Columna Perfil.
			{
				targets: 5, orderable: true, visible: true, width: '1%'
			},  // Columna Status.
		],
	});
})