import board
import neopixel
from time import sleep
from data.variables import colorOrder, colorMap, legendLights

duration = 1
brightness = 0.1
length = 200
delay = 0.02

pixels = neopixel.NeoPixel(board.D18, length, brightness=brightness)

for i in range(length):
	pixels[i] = colorMap[colorOrder[i]]
	# sleep(delay)

for i in range(length):
	pixels[i] = (0,0,0)

pixels.show()

