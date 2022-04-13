from typing import final
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
 
import time
 
from colorama import init, Back, Style, Fore
init()
 
user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64;\
       x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36"# el user agent se busca en google (googlear my user agent)
       #Sin el user agent, en algunas páginas puede dar un error al usar selenium por no estar autorizados
 
 
 
options = Options()
options.headless = True
options.add_argument(f'user-agent={user_agent}')
options.add_argument("--window-size=1920,1080")
options.add_argument('--ignore-certificate-errors')
options.add_argument('--allow-running-insecure-content')
options.add_argument("--disable-extensions")
options.add_argument("--proxy-server='direct://'")
options.add_argument("--proxy-bypass-list=*")
options.add_argument("--start-maximized")
options.add_argument('--disable-gpu')
options.add_argument('--headless')
options.add_argument('--disable-dev-shm-usage')
options.add_argument('--no-sandbox')
options.add_argument('--disable-software-rasterizer')
 
driver = webdriver.Chrome(executable_path="./drivers/chromedriver", options=options)
 
URL="www.example.com/" #url a la cual quiere realizarse la prueba de stress

driver.get(URL)
 
file=open('log.txt','a') #se abre el archivo log

# ------------------ Parte de selenium ---------------------
 
time.sleep(6)
link = driver.find_element_by_class_name("olark-button-text")
link.click()
time.sleep(25)
 
try:
   print("comienzo prueba: ",time.strftime("%H:%M:%S")) #Muestra el inicio del programa, imprime por consola.
   search = driver.find_element_by_name("olark-message-textarea")
   time.sleep(10)

   for i in range(6): # manda 6 mensajes hola
       search.click()
       search.send_keys("Hola") #mensaje que se envía al chat
       search.send_keys(Keys.RETURN)
 
       mensaje = driver.find_elements_by_class_name("olark-operator-message") #aca se almacena lo que el bot contestó cada vuelta
       #print(Fore.CYAN+mensaje[i].text+Fore.RESET+"\n") # se imprime la respuesta del bot por la consola
       time.sleep(15)

except KeyboardInterrupt:
   print(Fore.LIGHTRED_EX+"Se detuvo el proceso de ejecucion"+Fore.RESET) # por si se quiere detener el programa, con ctrl c    
except:
   print(Fore.LIGHTRED_EX+"\nEl bot no respondio"+Fore.RESET) # en caso de que no se haya caído el bot, guarda un "1" en el archivo log.txt
   #respuesta=False
   file.write("1 ") #cantidad de errores / veces que el chat bot no respondió
finally:
   driver.close()
   driver.quit()
   file.close()
print("fin prueba: ",time.strftime("%H:%M:%S")) #Muestra el fin del programa, por consola.
 
"""
if respuesta:
   hora=time.strftime("%H:%M:%S")
   print(Fore.LIGHTGREEN_EX+"\nPrueba de stress finalizada correctamente a las: ",hora+Fore.RESET)
else:
   print(Fore.LIGHTRED_EX+"\nEl bot no respondio"+Fore.RESET)"""
 
 
 
