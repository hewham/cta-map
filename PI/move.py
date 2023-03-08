import board
import neopixel
from time import sleep
from data.variables import colorOrder, colorMap, orders, global_brightness

duration = 1
brightness = global_brightness + 0.05
length = 200
delay = 0.02
size = 8

pixels = neopixel.NeoPixel(board.D18, length, brightness=brightness)


while True:
	pixels.fill((0,0,0))
	on = []
	i = 0
	for color in orders['order']:
		for light in orders[color]:
			pixels[light - 1] = colorMap[colorOrder[light - 1]]
			on.append(light)
			i = i + 1

			if i > size - 1:
				pixels[on[i-size] - 1] = (0,0,0)
			
			sleep(delay)

pixels.show()

