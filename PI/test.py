import board
import neopixel
from time import sleep

pixels = neopixel.NeoPixel(board.D18, 200, brightness =0.5)
pixels.fill((0,0,0))
sleep(2)
pixels.fill((255,255,255))
pixels.show()
