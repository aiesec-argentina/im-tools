var app = angular.module('finanzas', []);


app.controller('Analytics', ['$scope', '$http', function ($scope,$http) {
	$scope.go = async function() {
		var loading = {
			total_items: 1,
			actual_item: 0,
			porcentaje: function(actual_item,total_items){
				return (actual_item/total_items);
			}
		};
		document.getElementById('loading-txt').innerHTML = `<div align="center"> <p style="font-size:40px; font-weight:bold">Loading ${(loading.porcentaje(loading.actual_item,loading.total_items))*100}%</p></div>`
		var opts = {
			lines: 13, // The number of lines to draw
			length: 23, // The length of each line
			width: 15, // The line thickness
			radius: 33, // The radius of the inner circle
			scale: 1, // Scales overall size of the spinner
			corners: 1, // Corner roundness (0..1)
			color: '#36a69a', // CSS color or array of colors
			fadeColor: '', // CSS color or array of colors
			speed: 2.2, // Rounds per second
			rotate: 0, // The rotation offset
			animation: 'spinner-line-fade-more', // The CSS animation name for the lines
			direction: 1, // 1: clockwise, -1: counterclockwise
			zIndex: 2e9, // The z-index (defaults to 2000000000)
			className: 'spinner', // The CSS class to assign to the spinner
			top: '39%', // Top position relative to parent
			left: '50%', // Left position relative to parent
			shadow: 'black', // Box-shadow for the lines
			position: 'absolute' // Element positioning
			};

			var target = document.getElementById('spinnerContainer');
			var spinner = new Spinner(opts).spin(target)
		//graphql
		function querygraphql(access_token, date_in, date_out, programa, page){
			var url_graphql = "https://gis-api.aiesec.org/graphql?access_token=" + access_token

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
					standard_option{
						option
					}
					option
					  
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
				"page": page,
				"perPage": 100,
				"filters": {
					"experience_start_date":{
						"from":date_in,
						"to":date_out
					},
					"programmes": programa.id,
					"for": programa.area,
				},
				  "sort":""
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
					} catch(e){
						reject(e)
					}					
				})
			})

		}

		var access_token = document.getElementById("access_token").value;
		var start_date = document.getElementById("fecha_in").value;
		var end_date = document.getElementById("fecha_out").value;
		var programa = document.getElementById("programa").value;

		//oGV -GraphQL
		if(programa == '1'){
			programa_gql = {
				'id': 1,
				'area': "people",
				'shortname': "oGV"
			}
		}
		//oGT -GraphQL
		else if(programa == '2'){
			programa_gql = {
				'id': 2,
				'area': "people",
				'shortname': "oGT"
			}
		}
		//oGE -GraphQL
		else if(programa == '3'){
			programa_gql = {
				'id': 5,
				'area': "people",
				'shortname': "oGE"
			}
		}
		//iGV -GraphQL
		else if(programa == '4'){
			programa_gql = {
				'id': 1,
				'area': "opportunities",
				'shortname': "iGV"
			}
		}
		//iGT -GraphQL
		else if(programa == '5'){
			programa_gql = {
				'id': 2,
				'area': "opportunities",
				'shortname': "iGT"
			}
		}
		//iGE -GraphQL
		else {
			programa_gql = {
				'id': 5,
				'area': "opportunities",
				'shortname': "iGE"
			}
		}

		//count standards
		function count_standards(std, total){
			if(std.standard_option!=null){
				total = total + 1
			}
		}
		


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

		//def async function
		async function exec_q(access_token, start_date,end_date,programa_gql){

			//setting paginations and variables
			var first_response = await querygraphql(access_token,start_date,end_date,programa_gql,1)
			var last_page = first_response.data.allOpportunityApplication.paging.total_pages
			var people_expa = [];
			

			loading.total_items = first_response.data.allOpportunityApplication.paging.total_items

			//filling the array
			for(var i = 0; i < last_page; i++ ){
				var responses = await querygraphql(access_token,start_date,end_date,programa_gql,i+1)
				console.log(responses)
				responses.data.allOpportunityApplication.data.forEach((e)=>{
					loading.actual_item++;
					var std_answers = 0
					e.standards.forEach((std)=>{
						if(std.standard_option!=null){
							std_answers = std_answers + 1 
						}
					})
					people_expa.push({
						
						"status": e.status === null ? '' : e.status,	
						"ep_id": e.person.id === null ? '' : e.person.id,
						"name": e.person.full_name === null ? '' : e.person.full_name ,
						"email": e.person.email === null ? '': e.person.email,
						"home_lc": e.person.home_lc.name === null ? '' : e.person.home_lc.name,
						"home_mc": e.person.home_mc.name === null ? '' : e.person.home_mc.name,						
						"tn_id": e.opportunity.id === null ? '' : e.opportunity.id,
						"tn_name": e.opportunity.title === null ? '' : e.opportunity.title,
						"host_lc": e.opportunity.host_lc.name === null ? '' : e.opportunity.host_lc.name,
						"host_mc":  e.opportunity.home_mc.name === null ? '' : e.opportunity.home_mc.name,
						"experience_start_date": e.experience_start_date.substring(0,10),
						"experience_end_date": e.experience_end_date.substring(0,10),
						"standards_answers": std_answers,
						"personal_goal_setting": e.standards[0].standard_option === null ? 'null' : e.standards[0].standard_option.option,
						"outgoing_preparation": e.standards[1].standard_option === null ? 'null' : e.standards[1].standard_option.option,
						"expectation_setting": e.standards[2].standard_option === null ? 'null' : e.standards[2].standard_option.option,
						"insurance": e.standards[3].standard_option === null ? 'null' : e.standards[3].standard_option.option,
						"visa_and_work_permit": e.standards[4].standard_option === null ? 'null' : e.standards[4].standard_option.option ,
						"arrival_pickup": e.standards[5].standard_option === null ? 'null' : e.standards[5].standard_option.option,
						"accomodation": e.standards[6].standard_option === null ? 'null' : e.standards[6].standard_option.option,
						"incoming_preparation": e.standards[7].standard_option === null ? 'null' : e.standards[7].standard_option.option,
						"first_day_of_work": e.standards[8].standard_option === null ? 'null' : e.standards[8].standard_option.option,
						"alignment_spaces_with_opp_provider": e.standards[9].standard_option === null ? 'null' : e.standards[9].standard_option.option,
						"job_description": e.standards[10].standard_option === null ? 'null' :e.standards[10].standard_option.option ,
						"working_hours": e.standards[11].standard_option === null ? 'null' :e.standards[11].standard_option.option ,
						"duration": e.standards[12].standard_option === null ? 'null' :e.standards[12].standard_option.option ,
						"opportunity_benefits": e.standards[13].standard_option === null ? 'null' :e.standards[13].standard_option.option ,
						"departure_support": e.standards[14].standard_option === null ? 'null' :e.standards[14].standard_option.option ,
						"debrief_with_aiesec": e.standards[15].standard_option === null ? 'null' :e.standards[15].standard_option.option ,
														
					});
					document.getElementById('loading-txt').innerHTML = `<div align="center"><p style="font-size:40px; font-weight:bold">Loading ${((loading.porcentaje(loading.actual_item,loading.total_items))*100).toFixed(0)}%</p></div>`
					
				})
				
			}
			return people_expa;
		}	
		people_expa = await exec_q(access_token,start_date,end_date,programa_gql)
		$scope.people = people_expa
		$scope.$apply()
						
		spinner.stop()
		if (!$.fn.DataTable.isDataTable('#table_apd')){

			$('#table_apd').DataTable({
				"pageLength": 50
			})}
		document.getElementById('loading-txt').innerHTML = ''
		

	}
	
}])
