#Este programa obtiene los datos de un catálogo en formato JSON y los actualiza a un archivo en formato xml automáticamente.
#para ello era necesario obtener los catálogos de los planes, marcas y modelos de distintos autos, y así poder relacionarlos y 
#actualizarlos en el nuevo catálogo categóricamente.
#Este procedimiento es realizado una vez por mes.


import requests
from bs4 import BeautifulSoup 

import json
from os import name
import xml.etree.cElementTree as ET
from requests.models import HTTPError

from datetime import datetime
import time
from colorama import init, Back, Style, Fore
init()

dia=9 #Modificar el número para que se ejecute el programa el día del mes que se quiera.
check=False


def tipo_error(error,dia):
    print(Fore.LIGHTRED_EX+"JSON_A_XML -- A ocurrido el siguiente error: ",error,f"\n{fecha}\n{hora}"+Fore.RESET+"\n")
    if hoy.day + 1 > 28:
        dia=1
    else:
        dia+=1
    return dia


while True:
    
    fecha=time.strftime("%d/%m/%y")
    hora=time.strftime("%H:%M:%S")
    hoy=datetime.now()

    if hoy.day == dia and check == False:

        #ninguna de las url que aparecen aquí son reales, por motivos obvios, fue necesario removerlas.
        
        print(Fore.CYAN+"\nRealizando filtrado..."+Fore.RESET)
        try:

            # ---- Obtengo Plan List API y queda en formato JSON ----

            url_page  = 'www.paginadecatalogo1/plans/format=json' # url de la página donde se encuentran los planes del catálogo
            page = requests.get(url_page)
            soup = BeautifulSoup(page.text, 'lxml')
            text_json = json.loads(soup.text)

            # ---- Obtengo modelos de pagina web y quedan en formato JSON -----
            url_models  = 'www.paginadecatalogo1/models/format=json' #  url de la página donde se encuentran los modelos del catálogo
            page2 = requests.get(url_models)
            soup2 = BeautifulSoup(page2.text, 'lxml')
            text_json_models = json.loads(soup2.text)

            # ---- Obtengo las marcas de la web y quedan en JSON ----

            url_marcas  = 'www.paginadecatalogo1/brands/format=json' #url de la página donde se encuentran las marcas del catálogo
            page3 = requests.get(url_marcas)
            soup3 = BeautifulSoup(page3.text, 'lxml')
            text_json_marcas = json.loads(soup3.text)

            filtrado = dict()
            for d in text_json:
                if d.get('published') == True and d.get('finalized') == False:
                    for m in text_json_models:
                        if d.get('model') == m.get('id'):
                            for i in text_json_marcas:
                                if i.get('id') == m.get('brand'):
                                    filtrado[d.get('id')] = {'name': d.get('name'), 'marca': i.get('name'), 'install_price': d.get('install_price')}

            check=True
            dia=1

            # ---- Segunda parte - Agregado al XML ----

            archivo = "E_run0km_argentina.xml"
            doc_xml = ET.parse(archivo)
            raiz=doc_xml.getroot()

            esta=False
            ultimo_nodo=""

            # ---- Si no existe una etiqueta con una marca, la crea. ----

            for d in filtrado:
                for i in raiz.iter("marca"):
                    if filtrado.get(d).get("marca") == i.get("nombre"):
                        esta=True
                        break
                    else:
                        esta=False
                        nombre_marca=filtrado.get(d).get("marca")
                if esta==False:    
                    nueva_marca = ET.SubElement(raiz,"marca")
                    nueva_marca.set("nombre",nombre_marca)
                    nueva_marca.set("estado","activo")


            # ---- Recorre el diccionario ya filtrado con la info de la api y la carga en XML ----
            # ---- Agrega los modelos correspondientes a cada marca ----

            for i in raiz.iter("marca"):
                for d in filtrado:
                    if i.get("nombre") == filtrado.get(d).get("marca"):
                        nuevo_modelo = ET.SubElement(i,'modelo')
                        nuevo_modelo.set('enLista',"activo")
                        nuevo_modelo.set('id',str(d))
                        nuevo_modelo.set('display',filtrado.get(d).get('name'))
                        nuevo_modelo.set('estado','activo')
                        nuevo_modelo.set('grupos','')
                        #nuevo_modelo.set('precio',filtrado.get(d).get('install_price'))

            actualizado = f"XML actualizado. Fecha: {fecha} a las {hora}"
            print(Fore.CYAN+actualizado+Fore.RESET)

            # ---- Escribe lo que cargó en el archivo XML indicado. ----
            # ---- Si no existe el archivo, lo crea ----

            tree = ET.ElementTree(raiz)
            tree.write('editar.xml') # especificar bien en qué archivo cargar el xml actualizado, recomendable en uno nuevo
            tree.write("editar.xml",encoding="utf-8",xml_declaration=True)
            
            error = False

        except (ConnectionError, TimeoutError, HTTPError) as error:
            dia=tipo_error(error,dia)
        except Exception as error:
            dia=tipo_error(error,dia)
        
        
    elif hoy.day != dia and check:
        check=False
