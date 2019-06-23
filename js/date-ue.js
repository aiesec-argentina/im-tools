/**
 * Similar to the Date (dd/mm/YY) data sorting plug-in, this plug-in offers 
 * additional  flexibility with support for spaces between the values and
 * either . or / notation for the separators.
 *
 * Please note that this plug-in is **deprecated*. The
 * [datetime](//datatables.net/blog/2014-12-18) plug-in provides enhanced
 * functionality and flexibility.

 *  @example
 *    $('#example').dataTable( {
 *       columnDefs: [
 *         { type: 'date-eu', targets: 0 }
 *       ]
 *    } );
 */

//Siempre esperando el formato de fecha en string "dd/MM/yyyy hh:ss x.m."
jQuery.extend(jQuery.fn.dataTableExt.oSort, {
    "date-eu-pre": function (date) {
        if (!date) {
            return 0;
        }
        var concatenacion = "";
        $.each(date.split(/[\u0020\.\-\/\:\s]/), function (index, value) {
            if (index >= 6) {
                return;
            }
            if (index > 2) {
                concatenacion += value;
            }
            else {
                switch (index) {
                    case 0:
                        if(value < 10){
                            value = "0" + value;
                        }
                        concatenacion += value;
                        break;
                    case 1:
                        if (value < 10) {
                            value = "0" + value;
                        }
                        concatenacion = value + concatenacion;
                        break;
                    case 2:
                        concatenacion = value + concatenacion;
                        break;
                }
            }
            console.log(value);
        })
        return concatenacion;
    },

    "date-eu-asc": function (a, b) {
        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    },

    "date-eu-desc": function (a, b) {
        return ((a < b) ? 1 : ((a > b) ? -1 : 0));
    }
});

var euDate;