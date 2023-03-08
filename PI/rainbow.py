import board
import neopixel
from time import sleep

pixels = neopixel.NeoPixel(board.D18, 200, brightness =0.04)
pixels.fill((0,0,0))
sleep(0.1)
pixels.fill((40,255,0))
pixels.show()
