// ***************ACTIVITIES TO CHECK WHILE GRADING BEGIN*******************
//
// 1.	LEDs blink 2,9,3,10,4,11,5,12,6,13,7,14,8,15 repeated four times
// 2.	Should pause for 4 seconds with all LEDS OFF and then repeat the sequence again
// 3.	Verify that nested for loops are used
// 4.	Verify that some sort of math like otherLedNum=ledNum+7; is being used to turn on the second LED.
// 5.	Verify that variables are used in the delays. For example: delay(waitTime);  instead of delay(100);
//
// ***************ACTIVITIES TO CHECK WHILE GRADING END*********************

void setup()
{
int ledNumber;
for(ledNumber = 2; ledNumber <= 15; ledNumber++)
{ pinMode(ledNumber, OUTPUT);  // Enable pins connected to LEDs 2-15 to be outputs
}
}
void loop()
{
int count;
int ledNumber;
int otherLedNum;
int delayTime;
delayTime=100;
for(count = 1; count <= 5; count++) // this repeats the sequence five times
{
  for(ledNumber = 2; ledNumber <= 8; ledNumber++) //LEDs blink in the following order 2,9,3,10,4,11,5,12,6,13,7,14,8,15.
    {
      otherLedNum=ledNumber+7;
      digitalWrite(ledNumber, HIGH);  // Turns on LED2, then 3, then 4, 5, 6, 7, 8
      delay(delayTime);
      digitalWrite(ledNumber, LOW);  // Turns off LED2, then 3, then 4, 5, 6, 7, 8
      delay(delayTime);
      digitalWrite(otherLedNum,HIGH); // Turns on LED9, then 10, then 11, 12, 13, 14, 15
      delay(delayTime);
      digitalWrite(otherLedNum,LOW); // Turns off LED9, then 10, then 11, 12, 13, 14, 15
      delay(delayTime);
     }
  }
  delay(delayTime*40);
}

