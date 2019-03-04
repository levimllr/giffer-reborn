//**************ACTIVITIES TO CHECK WHILE GRADING**********BEGIN*********
//
// 1.	Giffer checks all aspects of this exercise.
// 2.   If Giffer says CORRECT it is good to go
//
// ***************ACTIVITIES TO CHECK WHILE GRADING END*********************

void setup()
{
  Serial.begin(9600); // Setup the serial port speed
  Serial.println("Begin setup()"); // Send to Serial port for debug
  Serial.println("Make pins 2-15 outputs"); // Send to Serial port for debug
  for(int  ledNumber = 2; ledNumber <= 15; ledNumber ++)
  {
    pinMode(ledNumber, OUTPUT);
  }
  Serial.println("Pins 2-15 are outputs"); // Send to Serial port for debug
  Serial.println("Finished setup()"); // Send to Serial port for debug
}


void loop()
{
  Serial.println("Begin loop()"); // Send to Serial port for debug
  int ledNumber;
  int delayTime = 200;
  Serial.println("Begin turning LED's 2-15 on / off"); // Send to Serial port for debug
  for (ledNumber = 2; ledNumber <= 15; ledNumber++) // Blink LED 2 - 15 ON / OFF
  {
    Serial.print("Turn on ledNumber "); // Send to Serial port for debug
    Serial.println(ledNumber); // print the variable & finish printing the line
    digitalWrite(ledNumber, HIGH);
    delay(delayTime);
    Serial.print("Turn off ledNumber "); // Send to Serial port for debug
    Serial.println(ledNumber); // print a variable & finish printing the line
    digitalWrite(ledNumber, LOW);
  }
  Serial.println("Done turning LED's 2-15 on / off"); // Send to Serial port for debug
  Serial.println("delay 5 seconds"); // Send to Serial port for debug
  delay(5000);
  Serial.println("Finished loop()"); // Send to Serial port for debug
}


/*Serial Output
Begin setup()
Make pins 2-15 outputs
Pins 2-15 are outputs
Finished setup()
Begin loop()
Begin turning LED's 2-15 on / off
Turn on ledNumber 2
Turn off ledNumber 2
Turn on ledNumber 3
Turn off ledNumber 3
Turn on ledNumber 4
Turn off ledNumber 4
Turn on ledNumber 5
Turn off ledNumber 5
Turn on ledNumber 6
Turn off ledNumber 6
Turn on ledNumber 7
Turn off ledNumber 7
Turn on ledNumber 8
Turn off ledNumber 8
Turn on ledNumber 9
Turn off ledNumber 9
Turn on ledNumber 10
Turn off ledNumber 10
Turn on ledNumber 11
Turn off ledNumber 11
Turn on ledNumber 12
Turn off ledNumber 12
Turn on ledNumber 13
Turn off ledNumber 13
Turn on ledNumber 14
Turn off ledNumber 14
Turn on ledNumber 15
Turn off ledNumber 15
Done turning LED's 2-15 on / off
delay 5 seconds
Finished loop()
*/
