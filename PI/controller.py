from gpiozero import Button
from subprocess import Popen
from subprocess import call
from time import sleep

button = Button(2)
index = 0
commands = [
	"poll.py",
	"move.py",
	"lines.py",
	"rainbow.py",
	"off.py"
]

call(["python3", "startup.py"])
p = Popen(["python3", commands[index]])

while True:
	try:
		button.wait_for_press()
		p.terminate()
		index = index + 1
		if index >= len(commands):
			index = 0
		print('Switching to ' + commands[index])
		p = Popen(["python3", commands[index]])
		sleep(0.5)
	except Exception as exc:
		print('[!!!] {err}'.format(err=exc))
		#action to perform: Nothing in my case
