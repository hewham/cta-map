import board
import neopixel
from time import sleep

duration = 1
brightness = 0.3

pixels = neopixel.NeoPixel(board.D18, 200, brightness=brightness)

while True:
	pixels.fill((255,0,0))
	pixels.show()
	sleep(duration)
	
	pixels.fill((0,255,0))
	pixels.show()
	sleep(duration)
	
	pixels.fill((0,0,255))
	pixels.show()
	sleep(duration)
	
	pixels.fill((255,255,0))
	pixels.show()
	sleep(duration)
	
	pixels.fill((255,0,255))
	pixels.show()
	sleep(duration)
	
	pixels.fill((0,255,255))
	pixels.show()
	sleep(duration)
	
	pixels.fill((255,255,255))
	pixels.show()
	sleep(duration)
