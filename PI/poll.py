import requests
import board
import neopixel
from time import sleep
from data.variables import colorOrder, colorMap, legendLights, global_brightness

duration = 1
brightness = global_brightness
length = 200
interval = 30
legend = True

pixels = neopixel.NeoPixel(board.D18, length, brightness=brightness)


j = 1;
old = []
while True:
  print("poll " + str(j))
  res = requests.get("https://api.anonacy.com/v1/f/cta/data?req_src=hewmap");
  trains = res.json()
  # print(trains)

  lights = []
  for i in range( len(trains) ):
    if 'number' in trains[i]: # check to remove duplicates
      if trains[i]['number'] not in lights: # check to remove duplicates
        lights.append( trains[i]['number'] )
        # print(trains[i]['line'] + ": " + str(trains[i]['number']) + ": " + trains[i]['station'] + ": " + trains[i]['name'])

  if legend: # turn on legend lights
    for i in legendLights:
      lights.append(i)

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

