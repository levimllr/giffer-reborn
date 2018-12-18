// ***************ACTIVITIES TO CHECK WHILE GRADING BEGIN*******************
//
// 1.	LED2, LED3, LED4, should light up instantly and stay on 
//
// ***************ACTIVITIES TO CHECK WHILE GRADING END*********************

void setup()
{
  pinMode(2, OUTPUT); // Enables pin 2 on the Arduino to Send enough power to turn on a LED
  pinMode(3, OUTPUT); // Enables pin 3 on the Arduino to Send enough power to turn on a LED
  pinMode(4, OUTPUT); // Enables pin 4 on the Arduino to Send enough power to turn on a LED

}

void loop()
{
  digitalWrite(2, HIGH); // Tells Arduino to send enough power to make LED 2 turn on
  digitalWrite(3, HIGH); // Tells Arduino to send enough power to make LED 3 turn on
  digitalWrite(4, HIGH); // Tells Arduino to send enough power to make LED 4 turn on
  delay(5000);  // wait 5000ms or 5 seconds before going to the next line
}

