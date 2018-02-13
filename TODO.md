Refactor Exercises/FrameManagers:

#Exercise
- Board
- Array of Simulations to run
- Starting code (contains directions, description, etc.)

#Simulation (basically frame manager, but supporting inputs varying throughout)
- List of input pin initial states, and changes in input pin values as simulation progresses
	- Example: button starts up; wait; is pressed; wait; is released; wait
- List of pin states on each frame
- Serial stuff for each frame

#Boards:
- Backdrop picture
- Array of Components and locations to draw them

#Components have:
- List of pins used for input from component to program
- List of pins used for output from program to component
- Method for drawing based on pin values, and change in time from last draw
- Other properties (an LED's color, motor position)

