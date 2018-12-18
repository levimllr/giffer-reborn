// ***************ACTIVITIES TO CHECK WHILE GRADING BEGIN*******************
//
// 1.	LED9 should blink ON for 200ms and OFF for 200ms FOUR times
// 2.	Then LED2 OFF for 5 seconds and then repeat
// 3.	Change name of variable from t => waitTime
// 4.	Change value of variable waitTime = 200; 
// 5.	Final delay in loop() should be something like delay(waitTime*20);
//
// ***************ACTIVITIES TO CHECK WHILE GRADING END*********************

void setup()
{
  pinMode(9, OUTPUT); // Enables pin 9 on the Arduino to Send enough power to turn on a LED
}


void loop()
{
  int waitTime;		// creates an integer waitTime
  waitTime = 200;           // puts the value 200 in the Arduinos waitTime memory location

  digitalWrite(9, HIGH); // Tells Arduino to send enough power to turn on LED 9
  delay(waitTime);         // wait waitTime before going to the next line
  digitalWrite(9, LOW);   // Tells Arduino to turn OFF LED 9
  delay(waitTime);

  digitalWrite(9, HIGH);
  delay(waitTime);
  digitalWrite(9, LOW);
  delay(waitTime);

  digitalWrite(9, HIGH);
  delay(waitTime);
  digitalWrite(9, LOW);
  delay(waitTime);

  digitalWrite(9, HIGH);
  delay(waitTime);
  digitalWrite(9, LOW);

  delay(waitTime*20);  // wait waitTime x 20 milliseconds before going to the next line
}

