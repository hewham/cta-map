import requests
import board
import neopixel
from time import sleep
from data.variables import stations, stopToStationMap, colorOrder, colorMap

duration = 1
brightness = 0.1
length = 200
delay = 0
interval = 10

pixels = neopixel.NeoPixel(board.D18, length, brightness=brightness)

# res = requests.get("https://api.anonacy.com/v1/f/cta/data");

j = 1;
old = []
while True:
  print("polling " + str(j))
  res = requests.get("https://ada8-2601-40e-8100-25d1-e10f-a25a-94d3-afe7.ngrok.io/v1/f/cta/data?req_src=hewmap");
  trains = res.json()
  # print(trains)

  lights = []
  for i in range( len(trains) ):
    if trains[i]['number'] not in lights: # check to remove duplicates
      lights.append( trains[i]['number'] )
      print(trains[i]['line'] + ": " + str(trains[i]['number']) + ": " + trains[i]['station'] + ": " + trains[i]['name'])

  off = []
  for i in range( len(old) ):
    if old[i] not in lights:
      off.append(old[i])

  # print(lights)
  # print ("turning off: ")
  # print(off)

  for i in range( len(off) ):
    pixels[off[i] - 1] = (0, 0, 0)

  for i in range( len(lights) ):
    pixels[lights[i] - 1] = colorMap[colorOrder[lights[i] - 1]]
  
  pixels.show()
  old = lights
  j = j + 1
  sleep(interval)