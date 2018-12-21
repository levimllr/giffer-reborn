//**************ACTIVITES TO CHECK WHILE GRADING**********BEGIN*********
//
// 1.	Verify that LEDs blink in this order 15, 8, 7, 14, 13, 6, 5, 12, 11, 4, 3, 10, 9, 2
// 2.	Should pause for 4 seconds with all LEDS OFF and then repeat the sequence again
// 3.	Verify that only one for loop is used in loop()
// 4.	Verify that delay(waitTime) is used
// 5.	Verify that delay(waitTime*something) is used
//
// ***************ACTIVITIES TO CHECK WHILE GRADING END*********************

void setup()
{
  int ledNumber;
  for(ledNumber=2; ledNumber<=15; ledNumber++)
  {
    pinMode(ledNumber,OUTPUT); // Enable pins connected to LEDs 2-15 to be outputs
  }
}

void loop()
{
  int count;
  int waitTime=100;
  for(count =1; count<=15; count ++)  // This will repeat 15 times
  {
    digitalWrite(15, HIGH);   // This turns on the LEDs in a downward snakinng pattern
    delay(waitTime);
    digitalWrite(15, LOW);
    digitalWrite(8, HIGH);
    delay(waitTime);
    digitalWrite(8, LOW);
    digitalWrite(7, HIGH);
    delay(waitTime);
    digitalWrite(7, LOW);
    digitalWrite(14, HIGH);
    delay(waitTime);
    digitalWrite(14, LOW);
    digitalWrite(13, HIGH);
    delay(waitTime);
    digitalWrite(13, LOW);
    digitalWrite(6, HIGH);
    delay(waitTime);
    digitalWrite(6, LOW);
    digitalWrite(5, HIGH);
    delay(waitTime);
    digitalWrite(5, LOW);
    digitalWrite(12, HIGH);
    delay(waitTime);
    digitalWrite(12, LOW);
    digitalWrite(11, HIGH);
    delay(waitTime);
    digitalWrite(11, LOW);
    digitalWrite(4, HIGH);
    delay(waitTime);
    digitalWrite(4, LOW);
    digitalWrite(3, HIGH);
    delay(waitTime);
    digitalWrite(3, LOW);
    digitalWrite(10, HIGH);
    delay(waitTime);
    digitalWrite(10, LOW);
    digitalWrite(9, HIGH);
    delay(waitTime);
    digitalWrite(9, LOW);
    digitalWrite(2, HIGH);
    delay(waitTime);
    digitalWrite(2, LOW);
  }
  delay(waitTime*40);  // Wait 4 seconds with all LED's off before repeating loop()
}

