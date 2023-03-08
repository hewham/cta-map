import board
import neopixel
from time import sleep
from data.variables import colorOrder, colorMap, legendLights, global_brightness

duration = 1
brightness = global_brightness
length = 200
delay = 0.02

pixels = neopixel.NeoPixel(board.D18, length, brightness=brightness)

for i in range(length):
	pixels[i] = colorMap[colorOrder[i]]
	# sleep(delay)

pixels.show()

