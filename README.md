# scarlettchen09.github.io
Step Sequencer/Music Sequencer Project for Computer Music Programming 

Program Manual

Overview: A basic step sequencer program built using Tone.js, Javascript, HTML, and CSS with customizable settings for the sequencer as well as the synth sound.

Main Grid/Step Sequencer: 
This is where the main action happens and allows the user to be able to compose their own music. 
The grid is composed of 10 rows and 16 columns of buttons, where each row represents a music note/pitch in the frequency domain and each column represents an eighth note to be played in the time domain. The user can toggle each button on and off, causing the note associated to also be turned on or off when the step sequencer is being played. A button/note that is off will be white and a button/note that is on will be aqua. Each button is labeled with the associated note to help the user understand what is being played, and the labels also serve as a good way of learning basic music theory. 
When the step sequencer is playing, one column will be played per eighth note interval before the sequencer moves onto the next column.
The step sequencer can begin and stop playing using the play/stop button, located below the grid in the rightmost position. It is green when the music is stopped and red when the music is playing. 

Playback Settings:
The playback settings are located in the leftmost yellow box below the main grid. This allows the user to manipulate how the step sequencer moves across columns and plays the grid. 
The first two inputs and button in the playback settings box are labeled start column and end column that allows the user to specify 0 indexed values for the range of columns that should be played. The default values are 0 for the start column and 15 for the end column, which makes the entire grid be played. he user can input numbers between 0-15, and if an invalid value is encountered (where the numbers are greater than the specified range or when the end column is less than the start column), the program will attempt to return to the default values. One example of valid numbers the user could change the start and end column to could be 4 and 7, which would cause the program to loop only between columns 4 through 7. In order for the changes the user makes in these input boxes to be applied, the "change playing columns" button must be pressed.
The final element in the playback settings box is a dropdown list of 3 items. These options allow the user to change how the step sequencer moves across the columns. The default option is that the step sequencer moves forward, playing a column and moving to the one immediately after it, and looping back to the beginning when all the columns have been played. However, the user can also select reverse, which behaves in a manner similar to forward except the sequencer moves to the column immediately before and loops around to the end. Finally, the forward and reverse option allows the step sequencer to move both forwards and backwards across columns, scrubbing back and forth. It does this by reversing directions when it reaches the end or beginning of the buttons grid.

Scale Settings and BPM:
The next orange box adjacent to playback settings contains the scale settings and BPM settings. Both are relatively straightforward.
The scale settings consists of a dropdown menu where the user can select between the major, minor, and pentatonic scales. Selecting a different scale causes the notes of the step sequencer to be changed, as well as the labels on the buttons.

The BPM settings is a range slider. The minimum and maximum of the slider is 60bpm and 240bpm, and the user is free to choose between integer BPMs between those two values. 

Synth Settings:
The next box adjacent is the synth settings box, and it is pink. It consists of an interface to allow the user to modify the ADSR envelope and a checkbox for one effect to be applied to the synth.
The ADSR envelope settings include 4 sliders, where the user can specify what they want the attack, decay, sustain, and release of the synth sound to be. 
The one effect setting is for a ping pong delay effect to be applied to the synth, which creates interest in the sound. More overlap between sounds occurs when the sustain is higher, but a shorter sustain produces an interesting effect.

Overall, this program allows the user to experiment with various musical settings, create and listen to music in a unique way using the visual component of the sequencer grid. The user could try drawing pictures like a smiley face in the grid, and get to experience what it sounds like.

