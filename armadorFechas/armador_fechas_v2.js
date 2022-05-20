function horarios(userInput){

  function formatoFecha(fecha_reunion,base_case){

      //si la fecha final es exactamente igual que la fecha actual, quiere decir que el input no fue preciso/es erróneo.

  if (fecha_reunion.getDate() == base_case.getDate() && fecha_reunion.getMonth() == base_case.getMonth()&& fecha_reunion.getFullYear()== base_case.getFullYear() && fecha_reunion.getHours() == base_case.getHours() && fecha_reunion.getMinutes() == base_case.getMinutes()){
    return 0;  //pueden haber tambien exepciones con muy baja probabilidad que devuelva 0, por ejemplo si dijo una reunión a la tarde y son las 17:00 (linea 72)
  } // para evitar a toda costa que por un error, la fecha quede agendada en un tiempo pasado:
  else if(fecha_reunion<base_case){
    fecha_reunion.setDate(base_case.getDate()+1)
    fecha_reunion.setHours(10,0)
  }
  

  //armado de fecha en formato adecuado
  var hora = fecha_reunion.getHours();
  var minuto = fecha_reunion.getMinutes();
  
  if(hora.toString().length == 1){hora="0"+hora.toString()}
  if(minuto.toString().length == 1){minuto="0"+minuto.toString()}


  fecha_con_formato = fecha_reunion.getFullYear() + "/" + (fecha_reunion.getMonth()+1)+"/"+fecha_reunion.getDate()+" "+hora+":"+minuto;
  
  // buscar la forma (si es necesario) de que si la fecha es parecida, pero no igual, comparar a ver si el horario ya pasó <<<----
  return fecha_con_formato
  }

  function HOY(fecha_reunion){
    if (fecha_reunion.getHours() + 2 < 19){
      fecha_reunion.setHours((fecha_reunion.getHours()+2),0)} //si es hoy, agenda para dentro de 2 horas (no esta sumando las 2 hs)
      else if (fecha_reunion.getHours() + 2 >= 19){ // si dentro de 2 hs pasan las 20 hs, que agende para mañana.
        fecha_reunion.setDate(fecha_reunion.getDate()+1)
        fecha_reunion.setHours(10,0)
      }
  }
  var dias = ["domingo","lunes", "martes", "miercoles", "jueves", "viernes","sabado"];

  var meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto",
    "septiembre","octubre","noviembre","diciembre"];


  var ahora = ["hoy","ahora"]

  var frasesAhora = ["cualquier dia","todos los dias","esta semana","en cualquier momento","cuando puedan","en un rato","a cualquier hora"]


  // Busca ":" en el string y lo reemplaza por " : "
  token1 = userInput.replace(":"," : ");

  // Busca "hs" en el string y lo reemplaza por " hs "
  token2 = token1.replace("hs"," hs ");
  token3 = token2.replace("am"," am ");
  token4 = token3.replace("pm"," pm ");
  token5 = token4.replace("primero"," 1 ")
  token6 = token5.replace("segundo"," 2 ")
  token7 = token6.replace(" y las ",":")

  userInput = token7;


  // separa palabras de la frase y se asigna a una lista
  var palabras = userInput.split(" ");

  //Obtener fecha actual y crear fecha de reunion

  var fecha_reunion= new Date();
  var base_case = new Date(); // si luego de todo el proceso, fecha_reunion sigue siendo la misma, se retorna null (quiere decir que el input no era preciso)

  var fecha_con_formato = "";
  var dia_reunion;
  var inputUsuario = userInput; //esto es solo para ver en el log lo que se ingresó, no va en el script final.
  var flagMes=false; //esta variable sirve para saber si aclaró un mes. Si en el input hay números y no aclaró un mes, quiere decir que está especificando
                //un horario y no un día del mes.
  var contadorDia = 0 // contador para saber si especifica más de un día de la semana.
  var validarDia = false; //variable para saber si hay que hacer validación por día de semana
  var tarde = false; // si pidió que lo contacten por la tarde.


//                                        ------------------ inicio  --------------------------

 //validaciones-excepciones para HOY

 if (frasesAhora.includes(userInput)){
  HOY(fecha_reunion)
} 
// DIAS

for (let i = 0; i < palabras.length; i++) { 
    if (ahora.includes(palabras[i])){
      HOY(fecha_reunion)    
      //validación para mañana y pasado mañana
      }else if (palabras[i] == "mañana" && palabras[i-1] != "pasado" && palabras[i-1] != "la"){//si es mañana (falta diferenciar de "a la mañana")
        fecha_reunion.setDate(fecha_reunion.getDate()+1)
        fecha_reunion.setHours(10)
      } 
    else if(palabras[i] == "mañana" && palabras[i-1] == "pasado"){// si es pasado mañana
      fecha_reunion.setDate(fecha_reunion.getDate()+2)
      fecha_reunion.setHours(10)
    }else if(palabras[i] == "mañana" && palabras[i-1] == "pasado" && palabras[i-1]=="la"){
      fecha_reunion.setHours(10)
    }

    if(palabras[i]=="tarde"){fecha_reunion.setHours(17,10)} //si especifica por la tarde
    
    
  
    dias.forEach(function(dia,ind){
      if(palabras[i] == dia){
        validarDia = true;
        dia_reunion=ind //almacena en dia_reunion el numero de dia de la semana para validarlo luego
        contadorDia++;
      }
      })

  //MESES  

    meses.forEach(function(mes,ind){
      if(palabras[i] == mes){
        var regex = userInput.match(/\b[0-9]{1,2}\b/g)
        flagMes=true;
        fecha_reunion.setMonth(ind) //si especificó el mes, lo establece.
        try{
          fecha_reunion.setDate(regex[0]) // por si además de un mes, especificó un día.
          fecha_reunion.setHours(10,0)
        }catch{
          fecha_reunion.setDate(1) //si no especificó día, establece el 1 de ese mes.
          fecha_reunion.setHours(10,0)
        }
        try{
          if (regex.length>1)fecha_reunion.setHours(regex[1]) //si también especificó un horario
        //si no especificó, el horario es a las 10:10 para ese día.
        }catch{fecha_reunion.setHours(10,0)}

      }
      })

    if (palabras[i] == "pm" || palabras[i] == "tarde" || palabras[i] == "noche" )//si el horario es pm
    {tarde = true;}

  // validación para el día de la semana
  if (validarDia){
    var dia_semana = fecha_reunion.getDay()
    var dias_faltantes;

    if(dia_reunion - dia_semana > 0){ 
      dias_faltantes = dia_reunion - dia_semana
    }else if(dia_reunion - dia_semana < 0){
      dias_faltantes= 7+dia_reunion-dia_semana
    }else if (dia_reunion - dia_semana == 0){
      dias_faltantes=7}
    else{dias_faltantes=0}
    

    if (contadorDia >1){//si aclaró mas de 1 dia de la semana para contactarlo, que se quede con el día mas cercano
      if (dias_faltantes < dias_faltantesFlag){
        fecha_reunion.setDate((fecha_reunion.getDate()+dias_faltantes))
        fecha_reunion.setHours(10,0)
      }
    }else{
      var dias_faltantesFlag = dias_faltantes
      fecha_reunion.setDate((fecha_reunion.getDate()+dias_faltantes))
      fecha_reunion.setHours(10,0)
    }
    validarDia=false;
    
  }
} // fin bucle for

if(palabras.includes("semana") && palabras.includes("viene")){fecha_reunion.setDate(fecha_reunion.getDate()+7)}

if(!flagMes){
  if (userInput.includes("las")){
  try{
    var regex = userInput.match(/\b[0-9]{1,2}\b/g) //machea cualquier número despues de la palabra "las" (/(?<=las )(?=.+)\d{1,2}/g)
    if (regex.length == 2){
      fecha_reunion.setHours(regex[0],regex[1])
    }else if(regex.length = 1){fecha_reunion.setHours(regex[0],0)}
  }catch{fecha_reunion.setHours(10,0)}
  }else{
    try{// si en el userInput no hay un "las", puede haber un rango horario (de H:mm a H:mm)
    var regex = userInput.match(/\b[0-9]{1,2}\b/g)
    if (regex.length == 1){
        var hora = parseInt(regex[0])
        if(hora < 12)hora=(hora+12);
        fecha_reunion.setHours(hora)
    }else if (regex.length == 2 && userInput.includes("de")){
      fecha_reunion.setHours(regex[0]);
    }else if(regex.length >= 2){fecha_reunion.setHours(regex[0],regex[1])}
    

    }catch{}
  }
}

if (tarde){fecha_reunion.setHours(fecha_reunion.getHours()+12,0)}

  //Armado de la fecha

  return formatoFecha(fecha_reunion,base_case)

  }


var texto = [
  "de 15 a 16",
  "tipo 6 hs",
  "a cualquier hora",
  "el martes a las 11",
  "el miercoles a la tarde",
  "por las 15",
  "llamame mañana a las 2 de la tarde"
 ]
for (let i = 0; i < texto.length; i++){
  console.log("")
  console.log("input:"+texto[i])
  console.log(horarios(texto[i]))}

  /*

 falta:

  "el año que viene",
  "dentro de 10 dias",
  "los jueves antes de las 18 hs",
  "en una hora",
  "en 2 horas"


   */

  /*
  
  "la semana que viene",
  "mañana a las 5pm"
  "mañana a las 15:30",
  "el 20/5 a las 6 pm", //ahora guarda a las 18 pero no el 20/5 //ahora nada
  "a partir del 7 de agosto a las",
  "a partir del 5 de junio", 
  "de lunes a viernes", 
  "hoy",
  "ahora mismo",
  "mañana",
  "pasado mañana",
  "cualquier dia",
  "todos los dias",
  "el martes",
  "los jueves",
  "en 2 dias", //no
  "en diciembre",
  "el miercoles",
  "llamenme hoy",
  "el proximo jueves a las 15",
  "el martes entre las 19 y las 20",
  "mañana a la mañana",
  "hoy a la tarde",
  "prueba", //este debería devolver 0 ya que no especifica ninguna fecha
  "mañana a las 11 pm",
  "hoy a las 10 am",
  "los martes a las 19hs",
  "martes entre las 15 y las 16",
  "llamenme hoy", 
  "estare disponible mañana",
  "si puede ser mañana temprano",
  "los martes a la mañana", 
  "jueves a las 18:30 hs",
  "los martes a las 17 hs",
  "todos los dias a partir de las 15:00",
  "hoy a las 9 am", 
  "hoy por la tarde",
  "el lunes proximo",
  "hoy a partir de las 10",
  "martes 20 de julio a las 18 hs",//<--
  "de lunes a viernes de 15:00 a 18:00", // -------lo deja para la semana que viene (hoy siendo lunes)
  "los lunes y viernes de 15:30 a 18:45",
  "jueves de 15 a 18hs", 
  
  "el 20/5 a las 6 pm", //porque carajo no guarda la hora como 18 ¿¿??
  "a partir del 7 de agosto a las",
  "a partir del 5 de junio", //chequear -- resuelto
  "de lunes a viernes", //chequear -- resuelto
  "hoy",
  "el 20 de mayo a las 18",
  "ahora mismo",
  "mañana",
  "pasado mañana",
  "cualquier dia",
  "todos los dias",
  "el martes",
  "los jueves",
  "en 2 dias",
  "la semana que viene",
  "en diciembre",
  "el miercoles",
  "llamenme hoy",
  "martes 20 de abril a las 18 hs",
  "el proximo jueves a las 15",
  "el martes entre las 19 y las 20",
  "mañana a las 15:30", //chequear
  "mañana a la mañana",
  "hoy a la tarde",
  "prueba" //este debería devolver 0 ya que no especifica ninguna fecha

  */