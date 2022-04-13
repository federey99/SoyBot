#este es el main. Desde acá se establecen la cantidad de subprocesos que se ejecutarán en simultáneo, que son la cantidad de llamadas al chatbot que se realizarán para testearlo.

import subprocess
import time
import os
import glob
import shutil
from colorama import init, Back, Style, Fore
init()
 
fecha=time.strftime("%d/%m")
errores=0
 
 
with open('log.txt','w') as file: #abre el archivo log y inicia por guardar la fecha en que se ejecuto el programa
	file.write(fecha)
 
n=5 # CANTIDAD DE PRUEBAS QUE SE EJECUTARÁN EN SIMULTÁNEO

for i in range(n):
	process1 = subprocess.Popen(['python3','prueba_stress.py'])
	time.sleep(1) #1 Segundo entre proceso y proceso, para darle un respiro a la cpu
 
time.sleep(60*2) # tiempo estimado que durará ejecutar todos los procesos. (2 min)
file=open('log.txt','r')

for linea in file: # se busca la fecha de hoy en el log, y cuenta la cantidad de "1" que hay. Esa es la cantidad de procesos que produjeron error.
    palabra=linea.split(" ")
    if palabra[0] == fecha:
        for i in palabra:
            if i == "1":
            	errores+=1
 
# fin del programa: muestra cuántos programas se ejecutaron, cuantos exitosamente y cuantos fallaron.

exitos=n-errores
print(Fore.LIGHTYELLOW_EX+fecha+Fore.RESET+Fore.LIGHTGREEN_EX+" Se han ejecutado ",n," pruebas. Se ejecutaron ",exitos," con exito y se detectaron ",errores," fallas."+Fore.RESET)

tmp_directories = glob.glob('/home/federico/Documentos/temporary/.com.google.Chrome.*') #patron que se quiere encontrar para eliminar los archivos tmp
                                                                                        #que se crean al usar el chrome driver

#Borra todos los directorios basura que coincidan con el pattern.

for directory in tmp_directories:
    try:
        os.rmdir(directory) #borra directorios vacíos
    except OSError as e:
        shutil.rmtree(directory) #Si encuentra directorios no vacíos, lanza una excepción y los borra también
    print(Fore.LIGHTGREEN_EX+"directorios eliminados."+Fore.RESET)