// ***************ACTIVITIES TO CHECK WHILE GRADING BEGIN*******************
//
// 1.	LED4, LED3, LED2, should light up in descending order with a 250ms delay between them 
// 2.	Check to make sure that they have modified the delay time between the digital writes (1000 => 250)
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
  digitalWrite(4, HIGH); // Tells Arduino to send enough power to make LED attached to pin 4 turn on
  delay(250);   // waits 250ms or 1/4 second before moving on to next line
  
  digitalWrite(3, HIGH); // Tells Arduino to send enough power to make LED attached to pin 3 turn on
  delay(250);   // waits 250ms or 1/4 second before moving on to next line
  
  digitalWrite(2, HIGH); // Tells Arduino to send enough power to make LED attached to pin 2 turn on
  delay(250);   // waits 250ms or 1/4 second before moving on to next line
 
   delay(5000);  // wait 5000ms or 5 seconds before going to the next line
}

