var app = angular.module('finanzas', []);


app.controller('Analytics', ['$scope', '$http', function ($scope,$http) {
	$scope.go = function() {
		

		//graphql
		function testgraphql(access_token){
			var url_graphql = "https://gis-api.aiesec.org/graphql?access_token=" + access_token
			console.log(access_token + " dentro da função query")
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
				"page": 1,
				"perPage": 100,
				"filters": {
					"programmes": 1,
					"for": "people",
					"status": "realized"
				},
				  "sort":""
			}

			var jsondata = {
				'query':query,
				'variables':variables_query
			}

			$http.post(url_graphql,jsondata).success( function(res){
				console.log(res)
			})



		}

		var access_token = $scope.access_token;
		var start_date = document.getElementById("fecha_in").value;
		var end_date = document.getElementById("fecha_out").value;
		var programa = document.getElementById("programa").value;
		testgraphql(access_token)
		console.log(access_token + " depois de pegar no html")
		spinner_up();

		//MC ECO
		if(!start_date && !end_date){
			start_date = '2018-08-01'; //AÑO-MES-DÍA
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth()+1; //January is 0!
			var yyyy = today.getFullYear();

			if(dd<10) {
	    		dd = '0' + dd
			} 

			if(mm<10) {
	    		mm = '0' + mm
			}
			end_date = yyyy+'-'+mm+'-'+dd; //HOY
		}

		//Por defecto oGV
		var options = {
			uri_base: 'https://gis-api.aiesec.org/v2/',
			uri_point: 'applications.json?access_token=',		
			filters: '&filters%5Bdate_approved%5Bfrom%5D%5D=' + start_date + '&filters%5Bdate_approved%5Bto%5D%5D=' + end_date +'&filters%5B_committee%5D=1535&filters%5Bprogrammes%5D%5B%5D=1&per_page=200',
			sub_filter: '&page='
		};		

		//oGV
 		if(programa == '1'){
			options.filters = '&filters%5Bdate_approved%5Bfrom%5D%5D=' + start_date + '&filters%5Bdate_approved%5Bto%5D%5D='+ end_date + '&filters%5Bperson_committee%5D=1535&filters%5Bprogrammes%5D%5B%5D=1&per_page=200'
		}//oGT
		else if(programa == '2'){
			options.filters = '&filters%5Bdate_approved%5Bfrom%5D%5D=' + start_date + '&filters%5Bdate_approved%5Bto%5D%5D='+ end_date + '&filters%5Bperson_committee%5D=1535&filters%5Bprogrammes%5D%5B%5D=2&per_page=200'	//OGT
		}//oGE
		else if(programa == '3'){
			options.filters = '&filters%5Bdate_approved%5Bfrom%5D%5D=' + start_date + '&filters%5Bdate_approved%5Bto%5D%5D='+ end_date + '&filters%5Bperson_committee%5D=1535&filters%5Bprogrammes%5D%5B%5D=5&per_page=200'	//OGE
		}//iGV
		else if(programa == '4'){
			options.filters = '&filters%5Bdate_approved%5Bfrom%5D%5D=' + start_date + '&filters%5Bdate_approved%5Bto%5D%5D='+ end_date + '&filters%5Bopportunity_committee%5D=1535&filters%5Bprogrammes%5D%5B%5D=1&per_page=200'	//iGV
		}//iGT
		else if(programa == '5'){
			options.filters = '&filters%5Bdate_approved%5Bfrom%5D%5D=' + start_date + '&filters%5Bdate_approved%5Bto%5D%5D='+ end_date + '&filters%5Bopportunity_committee%5D=1535&filters%5Bprogrammes%5D%5B%5D=2&per_page=200'	//iGV
		}//iGE
		else{
			options.filters = '&filters%5Bdate_approved%5Bfrom%5D%5D=' + start_date + '&filters%5Bdate_approved%5Bto%5D%5D='+ end_date + '&filters%5Bopportunity_committee%5D=1535&filters%5Bprogrammes%5D%5B%5D=5&per_page=200'	//iGT
		}

		var people_expa = [];
		var name_ = "";

		$http.get(options.uri_base + options.uri_point + access_token + options.filters).
		success(function (res) {
			add(res.paging.total_pages);
		}).error(
			function (error) {
				console.log("Error!!");
		});

		function add (pag) {
			for (var i = 0; i <= pag - 1; i++) {
				$http.get(options.uri_base + options.uri_point + access_token + options.filters + options.sub_filter + (i+1) ).
	    			success(function(res) {
						for (var j =  0; j <= res.data.length - 1; j++) {
							var lc;
							var country;
							if(programa == '1' || programa == '2' || programa == '3'){
								$scope.host = '';
								country_label = true;
								lc = res.data[j].person.home_lc.name; //SOLO PARA oGX
								country = res.data[j].opportunity.office === null ? '' : res.data[j].opportunity.office.country;
							} else {
								$scope.home = '';
								lc = res.data[j].person.home_lc.name;
								country = res.data[j].person.home_lc.country; //SOLO PARA iCX
							}
							
							
							

							people_expa.push({
								//"name": res.data[j].first_name,
								"name": res.data[j].person.first_name === null ? '' : res.data[j].person.first_name ,
								"last_name": res.data[j].person.last_name === null ? '' : res.data[j].person.last_name,
								"email": res.data[j].person.email === null ? '':res.data[j].person.email,
								"home_lc": res.data[j].person.home_lc.name === null ? '' : res.data[j].person.home_lc.name,								
								"tn_id": res.data[j].opportunity.id === null ? '' : res.data[j].opportunity.id,
								"tn_name": res.data[j].opportunity.title === null ? '' : res.data[j].opportunity.title,
								"home_lc": lc === null ? '': lc,
								"lc": res.data[j].opportunity.office === null ? '': res.data[j].opportunity.office.name,
								"country": country,
								"expa_link": 'https://experience.aiesec.org/#/people/' + res.data[j].person.id,
								"status": res.data[j].status === null ? '' : res.data[j].status,								
							});
						};

						if(programa == '1' || programa == '2' || programa == '3'){
							name_ = 'Host Country';
						} else {
							name_ = 'Home Country';
						}

						$scope.name =  { "name": name_ };
						$scope.people = people_expa;
						spinner();
	    			}).
	    			error(
	    				function (error) {
							spinner();
							console.log("Error!!");
						}
					);
			};
		}

		function spinner () {
			$('#status').fadeOut(); // will first fade out the loading animation
			$('#preloader').delay(300).fadeOut('slow'); // will fade out the white DIV that covers the website.
			$('body').delay(300).css({'overflow':'visible'});
		}

		function spinner_up () {
			$('#status').fadeIn(); // will first fade out the loading animation
			$('#preloader').delay(300).fadeIn('slow'); // will fade out the white DIV that covers the website.
			$('body').delay(300).css({'overflow':'hidden'});
		}
		

	}
}])
