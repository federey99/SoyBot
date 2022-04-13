#Este programa testea la actividad de un chatbot en una cierta página. Si el bot se encuentra funcionando correctamente, mostrará un mensaje por pantalla que lo certifique. Por otra parte, si el chat bot no contesta, el programa enviará automáticamente un mail y un sms a los destinatarios solicitados, informando sobre la falla técnica del chatbot.
#Corre en linux y windows.

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options

import time
import requests

from email.mime.text import MIMEText
import time
import json
import smtplib
from colorama import init, Fore
init()

import os
import glob
import shutil


#Envía un mail cuando se cae el bot
def mandarmail(URL):

    with open("credenciales.json") as file:
        data=json.load(file)

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls() # protocolo TLS
        server.login(data["SENDER_MAIL"],data["MAIL_PASSWORD"])

        body="El bot no responde"
        body2="Testeado en la pagina: " + URL
        fecha=time.strftime("%d/%m/%y")
        hora=time.strftime("%H:%M:%S")

        msg = MIMEText(f"{body}\n{body2}\n{fecha}\n{hora}")
        sender = data["SENDER_MAIL"]
        recipients = data["REC_MAIL"],data["REC_MAIL2"]
        msg['Subject'] = "SE CAYO EL CHAT EN LA PAGINA " + URL
        msg['From'] = sender
        msg['To'] = ", ".join(recipients) # de esta forma el mail se envía de forma cc y no cco

        server.sendmail(sender, recipients, msg.as_string())

        print(Fore.LIGHTGREEN_EX+"Correo enviado exitosamente."+Fore.RESET)
    except Exception as mensaje:
        print(Fore.LIGHTRED_EX+"SELENIUM -- Ha ocurrido el siguiente error al querer enviar el correo:"+Fore.RESET)
        print("\n"+mensaje)

#Envía un SMS cuando se cae el bot
def send_sms_post(URL):

    with open('JSON_APIKEY.json') as file: # Aca va el PATH donde está guardado el JSON con las credenciales.
        data=json.load(file)

    Usuario=data["Usuario"]
    Clave=data["Clave"]
    Codigo=data["Codigo"]
    Numero=data["Numero"]
    Mensaje=data["Mensaje"]+URL

    URLSMS = 'web page for sms automatic send'
    ERROR_API = "Error during API call"
    final_url = URLSMS
    
    for i in Numero:
        payload = {
            'Usuario': Usuario,
            'Clave': Clave,
            'Codigo': Codigo,
            'Numero': i,
            'Mensaje': Mensaje,
            'RegistroNoLlame':False
        }
        r = requests.post(final_url, data=payload)
    
    if not r:
        print(ERROR_API)
        print(Fore.LIGHTRED_EX+"SELENIUM -- Type Error: "+Fore.RESET,r)
    else:
        print(Fore.LIGHTGREEN_EX+"SMS enviado."+Fore.RESET)



while True:
    respuesta=False

    chromeOptions = Options()
    chromeOptions.headless = True
    driver = webdriver.Chrome(executable_path="./drivers/chromedriver", options=chromeOptions)

    URL="www.example.com" #página donde se testea el bot

    driver.get(URL)

    time.sleep(30)
    
    try:
        link = driver.find_element_by_class_name("olark-button-text")
        link.click()
        time.sleep(10)
        link = driver.find_element_by_class_name("olark-button olark-survey-form-submit")
        link.click()
    except:
        time.sleep(15)

    try:
        search = driver.find_element_by_name("olark-message-textarea")
        search.click()
        search.send_keys("Hola")
        search.send_keys(Keys.RETURN)
        time.sleep(60)
        print(Fore.LIGHTGREEN_EX+time.strftime("%H:%M:%S:")+" Pagina funcionando correctamente."+Fore.RESET)
        respuesta = True # si respondió, la variable respuesta = True
    except:
        print(Fore.LIGHTRED_EX+"SELENIUM -- No hubo respuesta."+Fore.RESET) # si no respondió luego de 30 segundos,
        #imprime por consola que no hubo respuesta.
        mandarmail(URL)
        send_sms_post(URL)
    finally:
        driver.close()
        time.sleep(5)
        driver.quit()

    # -------------- Borrar directorios basura de /tmp/ --------------------------
    #como este programa utiliza un Chrome driver que genera constantemente archivos temp en linux, es necesario borrarlos para no saturar el disco.

    
    
    tmp_directories = glob.glob('/tmp/.com.google.Chrome.*')
    
    #Borra todos los directorios no vacios que coincidan con el pattern.
    
    for directory in tmp_directories:
        try:
            os.rmdir(directory)
        except OSError as e:
            shutil.rmtree(directory)
        print(Fore.LIGHTGREEN_EX+"directorios eliminados."+Fore.RESET)


    time.sleep(60*40) #este programa se ejecutará constantemente, cada 40 minutos.




