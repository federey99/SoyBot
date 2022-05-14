function horarios(userInput){

  var dias = ["domingo","lunes", "martes", "miercoles", "jueves", "viernes","sabado"];

  var meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto",
    "septiembre","octubre","noviembre","diciembre"];

  var lista_tiempo = ["noche","tarde","mediodia","pm"];


  var siguiente = ["siguiente","proximo","proxima","viene"]

  var ahora = ["hoy","ahora"]


  //validaciones-excepciones

//  if (userInput == "cualquier dia" || userInput == "todos los dias")

  // Busca ":" en el string y lo reemplaza por " : "
  token1 = userInput.replace(":"," : ");

  // Busca "hs" en el string y lo reemplaza por " hs "
  token2 = token1.replace("hs"," hs ");
  token3 = token2.replace("am"," am ");
  token4 = token3.replace("pm"," pm ");
  token5 = token4.replace("primero"," 1 ")
  token6 = token5.replace("segundo"," 2 ")
  token7 = token6.replace(" y las ",":")


  // separa palabras de la frase y se asigna a una lista
  var palabras = token4.split(" ");

  //Obtener fecha actual y crear fecha de reunion

  var fecha_reunion= new Date();
  var base_case = new Date(); // si luego de todo el proceso, fecha_reunion sigue siendo la misma, se retorna null (quiere decir que el input no era preciso)

  var fecha_con_formato = "";
  var dia_reunion;
  var inputUsuario = userInput; //esto es solo para ver en el log lo que se ingresó, no va en el script final.
  var flagMes=false; //esta variable sirve para saber si aclaró un mes. Si en el input hay números y no aclaró un mes, quiere decir que está especificando
                //un horario y no un día del mes.
  var contadorDia = 0 // contador para saber si especifica más de un día de la semana.
  var validarDia = false;
  var tarde = false;

// DIAS

for (let i = 0; i < palabras.length; i++) { 
    if (ahora.includes(palabras[i])){
      if (fecha_reunion.getHours() + 2 < 19){
        fecha_reunion.setHours((fecha_reunion.getHours()+2))} //si es hoy, agenda para dentro de 2 horas (no esta sumando las 2 hs)
        else if (fecha_reunion.getHours() + 2 >= 19){ // si dentro de 2 hs pasan las 20 hs, que agende para mañana.
          fecha_reunion.setDate(fecha_reunion.getDate()+1)
          fecha_reunion.setHours(10)
        } 
    
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
        }catch{
          fecha_reunion.setDate(1) //si no especificó día, establece el 1 de ese mes.
        }
        try{
          if (regex.length>1)fecha_reunion.setHours(regex[1]) //si también especificó un horario
        //si no especificó, queda hora actual para ese día.
        }catch{fecha_reunion.setHours(10,10)}

      }
      })

    if(!flagMes){
      var regex = userInput.match(/(?<=las )(?=.+)\d{1,2}/g) //machea cualquier número despues de la palabra "las"
      try{
        if (regex.length == 2){
          fecha_reunion.setHours(regex[0],regex[1])
        }else if(regex.length = 1){fecha_reunion.setHours(regex[0],10)}
        }catch{}
      }

    if (palabras[i] == "pm")//si el horario es pm (no esta funcionando)
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
      }
    }else{
      var dias_faltantesFlag = dias_faltantes
      fecha_reunion.setDate((fecha_reunion.getDate()+dias_faltantes))
    }
    validarDia=false;
    
  }
} // fin bucle for

if (tarde){fecha_reunion.setHours(fecha_reunion.getHours()+12)}

  //Armado de la fecha
  var mes = fecha_reunion.getMonth();
  var hora = fecha_reunion.getHours();
  var minuto = fecha_reunion.getMinutes();

  if (mes == 0)mes=12;

  if(mes.length = 1){mes="0"+mes}
  if(hora.length = 1){hora="0"+hora}
  if(minuto.length = 1){minuto="0"+minuto}

  //si la fecha final es exactamente igual que la fecha actual, quiere decir que el input no fue preciso/es erróneo.

  if (fecha_reunion.getDate() == base_case.getDate() && fecha_reunion.getMonth() == base_case.getMonth()&& fecha_reunion.getFullYear()== base_case.getFullYear() && fecha_reunion.getHours() == base_case.getHours() && fecha_reunion.getMinutes() == base_case.getMinutes()){
    return 0;  //pueden haber tambien exepciones con muy baja probabilidad que devuelva 0, por ejemplo si dijo una reunión a la tarde y son las 17:10 (linea 72)
  }else{


  //armado de fecha en formato adecuado
  fecha_con_formato = fecha_reunion.getFullYear() + "/" + (fecha_reunion.getMonth()+1)+"/"+fecha_reunion.getDate()+" "+fecha_reunion.getHours()+":"+fecha_reunion.getMinutes()
  
  // buscar la forma (si es necesario) de que si la fecha es parecida, pero no igual, comparar a ver si el horario ya pasó <<<----
  return fecha_con_formato
  }
}

var texto = [
  
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
  "prueba", //este debería devolver 0 ya que no especifica ninguna fecha

  "el mes de diciembre",
  "mañana a las 11 pm",
  "hoy a las 10 am",
  "los martes a las 19hs",
  "martes entre las 15 y las 16",
  "llamenme hoy", //
  "estare disponible mañana",
  "si puede ser mañana temprano",
  "los martes a la mañana", //chequear horario
  "jueves a las 18:30 hs",
  "los martes a las 17 hs",
  "todos los dias a partir de las 15:00",
  "de lunes a viernes de 15:00 a 18:00", // -------lo deja para la semana que viene (hoy siendo lunes)
  "los lunes y viernes de 15:30 a 18:45",
  "jueves de 15 a 18hs",
  "hoy a las 9 am",
  "hoy por la tarde",
  "pasado mañana",
  "la semana que viene",
  "el mes que viene",
  "el proximo mes",
  "el lunes proximo",
  "hoy a partir de las 10"
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