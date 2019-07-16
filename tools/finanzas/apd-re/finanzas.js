var app = angular.module('finanzas', []);


app.controller('Analytics', ['$scope', '$http', function ($scope,$http) {
	var lc = [
		{
			index:0,
			id: 1675,
			name: 'Nordeste',
			n_re: 0,
			s_re: 0,
			n_fi: 0,
			n_co: 0,
			c_fifi: 0,
			c_filco: 0,
			c_finco: 0
		},
		{
			index:1,
			id: 1249,
			name: 'Córdoba',
			n_re: 0,
			s_re: 0,
			n_fi: 0,
			n_co: 0,
			c_fifi: 0,
			c_filco: 0,
			c_finco: 0
		},
		{
			index:2,
			id: 847,
			name: 'Buenos Aires',
			n_re: 0,
			s_re: 0,
			n_fi: 0,
			n_co: 0,
			c_fifi: 0,
			c_filco: 0,
			c_finco: 0
		},
		{
			index:3,
			id: 278,
			name: 'La Plata',
			n_re: 0,
			s_re: 0,
			n_fi: 0,
			n_co: 0,
			c_fifi: 0,
			c_filco: 0,
			c_finco: 0
		},
		{
			index:4,
			id: 1761,
			name: 'Tucumán',
			n_re: 0,
			s_re: 0,
			n_fi: 0,
			n_co: 0,
			c_fifi: 0,
			c_filco: 0,
			c_finco: 0
		},
		{
			index:5,
			id: 27,
			name: 'Buenos Aires UBA FCE',
			n_re: 0,
			s_re: 0,
			n_fi: 0,
			n_co: 0,
			c_fifi: 0,
			c_filco: 0,
			c_finco: 0
		},
		{
			index:6,
			id: 1678,
			name: 'Neuquén',
			n_re: 0,
			s_re: 0,
			n_fi: 0,
			n_co: 0,
			c_fifi: 0,
			c_filco: 0,
			c_finco: 0
		},
		{
			index:7,
			id: 223,
			name: 'Buenos Aires USAL',
			n_re: 0,
			s_re: 0,
			n_fi: 0,
			n_co: 0,
			c_fifi: 0,
			c_filco: 0,
			c_finco: 0
		},
		{
			index:8,
			id: 1759,
			name: 'San Juan Argentina',
			n_re: 0,
			s_re: 0,
			n_fi: 0,
			n_co: 0,
			c_fifi: 0,
			c_filco: 0,
			c_finco: 0
		},
		{
			index:9,
			id: 873,
			name: 'Mendoza',
			n_re: 0,
			s_re: 0,
			n_fi: 0,
			n_co: 0,
			c_fifi: 0,
			c_filco: 0,
			c_finco: 0
		},
		{
			index:10,
			id: 1677,
			name: 'Salta',
			n_re: 0,
			s_re: 0,
			n_fi: 0,
			n_co: 0,
			c_fifi: 0,
			c_filco: 0,
			c_finco: 0
		},
		{
			index:11,
			id: 1067,
			name: 'Rosario (Argentina)',
			n_re: 0,
			s_re: 0,
			n_fi: 0,
			n_co: 0,
			c_fifi: 0,
			c_filco: 0,
			c_finco: 0
		},
		{
			index:12,
			id: 1760,
			name: 'Santa Fe',
			n_re: 0,
			s_re: 0,
			n_fi: 0,
			n_co: 0,
			c_fifi: 0,
			c_filco: 0,
			c_finco: 0
		},
		{
			index:13,
			id: 2290,
			name: 'LaM',
			n_re: 0,
			s_re: 0,
			n_fi: 0,
			n_co: 0,
			c_fifi: 0,
			c_filco: 0,
			c_finco: 0
		},
		{
			index:14,
			id: 2233,
			name: 'Misiones',
			n_re: 0,
			s_re: 0,
			n_fi: 0,
			n_co: 0,
			c_fifi: 0,
			c_filco: 0,
			c_finco: 0
		},
		{
			index:15,
			id: 2405,
			name: 'Entre Ríos',
			n_re: 0,
			s_re: 0,
			n_fi: 0,
			n_co: 0,
			c_fifi: 0,
			c_filco: 0,
			c_finco: 0
		},
		{
			index:16,
			id: 2227,
			name: 'Santiago del Estero',
			n_re: 0,
			s_re: 0,
			n_fi: 0,
			n_co: 0,
			c_fifi: 0,
			c_filco: 0,
			c_finco: 0
		},
		{
			index:17,
			id: 2406,
			name: 'Río Cuarto',
			n_re: 0,
			s_re: 0,
			n_fi: 0,
			n_co: 0,
			c_fifi: 0,
			c_filco: 0,
			c_finco: 0
		},
		{
			index:18,
			id: 2478,
			name: 'Bahía Blanca',
			n_re: 0,
			s_re: 0,
			n_fi: 0,
			n_co: 0,
			c_fifi: 0,
			c_filco: 0,
			c_finco: 0
		},
	]


	$scope.go = async function() {
		var loading = {
			total_items: 1,
			actual_item: 0,
			porcentaje: function(actual_item,total_items){
				return (actual_item/total_items);
			}
		};
		document.getElementById('loading-txt').innerHTML = `<div align="center"> <p style="font-size:40px; font-weight:bold">Loading Data ${(loading.porcentaje(loading.actual_item,loading.total_items))*100}%</p></div>`
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
					"date_approved":{
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

		{
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
		}
		//filtering LC
		function filterLC(array,lc,programa){
			array_result = []
			if (programa == 1 || programa == 2 || programa == 3) {
				array_result = array.filter((e) =>{
					return e.home_lc == lc
				})
			}
			if (programa == 4 || programa == 5 || programa == 6) {
				array_result = array.filter((e) =>{
					return e.host_lc == lc
				})
			}
			return array_result		
		}
		//getting #APD
		function getAPD(array){
			return array.length
		}
		//getting #RE
		function getRE(array){
			array_result = array.filter((e)=>{
				return e.experience_start_date != null
			}) 
			return array_result.length
		}

		//getting #FIN
		function getFIN(array){
			array_result = array.filter((e)=>{
				var fecha_fi = new Date(e.experience_end_date)
				var today = new Date();
				today = new Date(today.getFullYear() + '-'+ String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0'))

				return fecha_fi.getTime() < today.getTime()
			}) 
			return array_result.length
		}
		//getting #CO
		function getCO(array){
			array_result = array.filter((e)=>{
				var fecha_fi = new Date(e.experience_end_date)
				var today = new Date();
				today = new Date(today.getFullYear() + '-'+ String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0'))

				return fecha_fi.getTime() < today.getTime()
			})
			array_result = array_result.filter((e)=>{
				return e.status == "completed"
			})
			return array_result.length
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
						"experience_start_date": e.experience_start_date === null ? null : e.experience_start_date.substring(0,10),
						"experience_end_date": e.experience_end_date === null ? null : e.experience_end_date.substring(0,10),
						
														
					});
					document.getElementById('loading-txt').innerHTML = `<div align="center"><p style="font-size:40px; font-weight:bold">Loading Data ${((loading.porcentaje(loading.actual_item,loading.total_items))*100).toFixed(0)}%</p></div>`
					
				})
				
			}
			return people_expa;
		}	
		function notZero(n) {
			 if (n==0) { n=+1 }
			return n;
		  }
		people_expa = await exec_q(access_token,start_date,end_date,programa_gql)
		document.getElementById('loading-txt').innerHTML = `<div align="center"> <p style="font-size:40px; font-weight:bold">Analyzing...</p></div>`
		lc.forEach((e)=>{
			
			array_lc = filterLC(people_expa,e.name,programa)
			e.n_apd = getAPD(array_lc)
			e.n_re = getRE(array_lc)
			e.n_fi = getFIN(array_lc)
			e.n_co = getCO(array_lc)
			e.c_apdre = ((e.n_re/notZero(e.n_apd))*100).toFixed(2)
			e.c_finco = ((e.n_co/notZero(e.n_fi))*100).toFixed(2)
		})


		$scope.people = lc
		$scope.$apply()
						
		spinner.stop()
		if (!$.fn.DataTable.isDataTable('#table_apd')){

		$('#table_apd').DataTable({
			"paging": false
		})}
		document.getElementById('loading-txt').innerHTML = ''
		

	}
	
}])
