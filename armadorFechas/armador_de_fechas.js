/*Este script en JS toma una cadena de caracteres ingresada por el usuario y la convierte según distintos patrones a una fecha en formato AAAA-MM-DD.
 Fue un script que servía para que cuando el bot preguntaba al usuario en qué fecha quería ser contactado, este tome el input y al transformarlo, 
 agende directamente la fecha en la que era preciso contactarlo.*/

function horarios(userInput){

    var dias = ["domingo","lunes", "martes", "miercoles", "jueves", "viernes","sabado"];
  
    var meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto",
      "septiembre","octubre","noviembre","diciembre"];
  
    var lista_tiempo = ["noche","tarde","mediodia","pm"];
  
    var numeros = ["0","1","2","3","4","5","6","7","8","9"];
  
  
  
    // Busca ":" en el string y lo reemplaza por " : "
    token1 = userInput.replace(":"," : ");
  
    // Busca "hs" en el string y lo reemplaza por " hs "
    token2 = token1.replace("hs"," hs ");
    token3 = token2.replace("am"," am ");
    token4 = token3.replace("pm"," pm ");
  
    // separa palabras de la frase y se asigna a una lista
    var palabraPorPalabra = token2.split(" ");
  
    //Obtener fecha actual
  
    hoy = new Date();
    var fecha_reunion="";
    var horario_consulta = "";
    var minuto_reunion="";
    var anio_hoy=hoy.getFullYear();
    var mes_hoy=hoy.getMonth()+1;
    var dia_hoy=hoy.getDate();
    var dia_semana=hoy.getDay();
    var hora_hoy=hoy.getHours();
    var minuto_hoy=hoy.getMinutes();
  
    var dia_reunion;
    var mes_reunion;
    var dias_faltantes;
    var mes_encontrado=false;
    var temprano=false;
    var tarde=false;
    var noche=false;
    var horario = false;
    var flag = true;
    var dia_ok=false
    var llamar_maniana=false;
  
    // busca según el día de la semana que aclaro el usuario. Diferencia entre si pidio por la mañana o mañana
  
    for (let i = 0; i < palabraPorPalabra.length; i++) {
      for (let x = 0; x < dias.length; x++) {
        if(palabraPorPalabra[i] == dias[x] && !dia_ok) {
          dia_reunion=x
          dia_ok=true
        }if(palabraPorPalabra[i] == "hoy"){
            dia_reunion=dia_semana
            var llamar_hoy = true
          }
        else if(palabraPorPalabra[i] == "mañana" && palabraPorPalabra[i-1] != "la" && llamar_maniana == false){
            dia_hoy++;
            llamar_maniana=true
          }else if (palabraPorPalabra[i] == "mañana"){
            temprano=true
          }
      } // Chequea si el usuario especifico por la tarde o noche
      for (let x = 0; x < lista_tiempo.length; x++){
        if(palabraPorPalabra[i] == lista_tiempo[0]){noche = true}
      else if(palabraPorPalabra[i] == lista_tiempo[x]){
        tarde=true
        }
      }
      // Chequea si el usuario especifico un mes
      for (let x = 0; x < meses.length; x++){
        if (palabraPorPalabra[i] == meses[x]){
          mes_reunion=x+1
          dia_hoy=1
          mes_encontrado = true
        }else if (!mes_encontrado){mes_reunion=mes_hoy}
      }
      // Chequea si el el usuario especifico horario
      
    var palabra=palabraPorPalabra[i].split("")
    for(let j=0; j<palabra.length;j++){
        for(let k=0; k<numeros.length;k++)
        if(palabra[j] == numeros[k] && flag && horario_consulta.length <2){
            horario_consulta=horario_consulta+palabra[j]
            horario=true
        }else if(palabra[j]==':'){
            flag=false
        }else if(palabra[j]==numeros[k] && flag==false && minuto_reunion.length <2){
            minuto_reunion= minuto_reunion+palabra[j]
        }
    }
      
    
    }
    //si el usuario no especifico horario pero sí momento del dia. si tampoco especifico momento del dia: 9 AM
    if (!horario){
      minuto_reunion="00"
      if (temprano && !tarde && !noche){
        horario_consulta="09"
      }else if(!temprano && tarde && !noche){
        horario_consulta="15"
        tarde=false
      }else if(!temprano && !tarde && noche){
        horario_consulta="19"
      }else{
        horario_consulta="09"
      }
    }
    if(tarde){
      horario_consulta=parseInt(horario_consulta)+12
      horario_consulta=horario_consulta.toString();
    }
    
  
    // Rango horario (si especificó un rango horario, agenda el horario mas temprano)
   
   
    if(horario_consulta.length <2){
        horario_consulta = "0"+horario_consulta
    }
    if(minuto_reunion == ''){
        minuto_reunion="00"
    }
    
  
    //Hace el cálculo de cuantos dias faltan para la llamada
  
    if(dia_reunion - dia_semana > 0){
      dias_faltantes = dia_reunion - dia_semana
    }else if(dia_reunion - dia_semana < 0){
      dias_faltantes= 7+dia_reunion-dia_semana
    }else if (llamar_hoy){ 
        dias_faltantes=0
    }else if (dia_reunion - dia_semana == 0){
      dias_faltantes=7
    }else{dias_faltantes=0}


//si el horario ya pasó, que lo agende para mañana
    if (mes_reunion == mes_hoy){
        if(dia_hoy==dia_hoy+dias_faltantes && horario_consulta<= hora_hoy && minuto_reunion<=minuto_hoy && llamar_maniana==false){
        dia_hoy++;
        }
    }
    if (dia_hoy>31){dia_hoy=1}
    
  
    // convierte al formato adecuado
  
    fecha_reunion = anio_hoy + "-" + mes_reunion + "-" + (dia_hoy + dias_faltantes)
  
    if (minuto_reunion == ""){minuto_reunion = "00"}
    fecha_reunion = fecha_reunion + " " + horario_consulta+':'+minuto_reunion;
   
    return(fecha_reunion)
    
  }

  var texto = [
    "llamame el miercoles",
    "llamame el mes que viene",
    "el mes de diciembre",
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
      "de lunes a viernes de 15:00 a 18:00", 
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
      console.log(texto[i]+": "+horarios(texto[i]))}