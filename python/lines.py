import board
import neopixel
from time import sleep

duration = 1
brightness = 0.3
length = 150

pixels = neopixel.NeoPixel(board.D18, length, brightness=brightness)

colorOrder = ['r','r','r','r','r','g','g','o','o','o','o','o','o','o','r','r','r','r','g','g','g','g','g','g','g','g','g','o','g','r','r','b','b','b','pk','pk','pk','pk','pk','pk','pk','pk','pk','pk','pk','b','b','b','b','b','b','b','b','b','pk','pk','pk','g','g','g','g','g','g','g','g','g','g','g','g','g','g','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','br','br','br','br','br','br','br','br','br','br','br','br','br','br','br','br','r','br','p','r','r','r','br','p','p','p','r','p','p','p','r','r','r','r','p','r','r','r','r','r','r','r','r','s','x','s','s','s','s','r','r','p','y','y','y','p','p','p','p','p','p','p','p','br','p','o','pk','r','b','b','br','p','o','pk','br','p','o','pk','b','pk','o','p','br','b','pk','g','o','p','br','p','br','br','p','o','g','pk','b','r','br','p','o','g','pk','r','pk','g','o','p','br','x','x','x','x']

colorMap = {
        r: (255,0,0)
}
