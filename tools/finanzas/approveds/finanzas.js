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

function loadTableDataOnFirstRequest($scope, data, rowIndex, programa) {

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

		$('#table_apd').DataTable().row.add([
			rowIndex.index,
			elem.person.full_name === null ? '' : elem.person.full_name,
			elem.person.email === null ? '' : elem.person.email,
			//elem.person.home_lc.name === null ? '' : elem.person.home_lc.name,								
			elem.opportunity.id === null ? '' : elem.opportunity.id,
			elem.opportunity.title === null ? '' : elem.opportunity.title,
			lc === null ? '' : lc,
			elem.opportunity.office === undefined ? '' : elem.opportunity.office.name,
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
		function testgraphql(access_token, date_in, date_out, programa, rowIndex, pagesHandler) {
			var url_graphql = "https://gis-api.aiesec.org/graphql?access_token=" + access_token;

			var query = `
			query ApplicationIndexQuery(
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

			var variables_query = {
				"page": pagesHandler == undefined ? 1 : pagesHandler.current_page,
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

			$http.post(url_graphql, jsondata)
				.success(function (res) {

					loadTableDataOnFirstRequest($scope, res.data.allOpportunityApplication.data, rowIndex, programa);

					if (pagesHandler == null) {
						pagesHandler = res.data.allOpportunityApplication.paging;
						// for (pagesHandler.current_page; pagesHandler.current_page < pagesHandler.total_pages; pagesHandler.current_page++) {						
						// 	testgraphql(access_token, date_in, date_out, programa, rowIndex, pagesHandler);		
						// }
					}
					if (pagesHandler.current_page <= pagesHandler.total_pages) {
						pagesHandler.current_page++;
						for (pagesHandler.current_page; pagesHandler.current_page <= pagesHandler.total_pages; pagesHandler.current_page++) {
							jsondata.variables.page = pagesHandler.current_page;
							$http.post(url_graphql, jsondata).success(function (result) {
								loadTableDataOnFirstRequest($scope, result.data.allOpportunityApplication.data, rowIndex, programa);
							});
						}
						//testgraphql(access_token, date_in, date_out, programa, rowIndex, pagesHandler);
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

		// getPagesCount(access_token,start_date,end_date,programa_gql)
		// .success(function(data) {
		// 	$('#table_apd').DataTable().clear().draw();
		// 	testgraphql(access_token,start_date,end_date,programa_gql, paging, 0)			
		// });

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
		buttons: ['copy', 'excel', 'pdf', 'colvis']
	});
})