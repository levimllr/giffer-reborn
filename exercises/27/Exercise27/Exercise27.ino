// ***************ACTIVITIES TO CHECK WHILE GRADING BEGIN*******************
//
// 1.	All red LEDs and then all green LEDs blink repeated ten times
// 2.	Should pause for 4 seconds with all LEDS OFF and then repeat the sequence again
// 3.	Verify that one for loop is used
// 4.	Verify that variables are used in the delays. For example: delay(waitTime);  instead of delay(100);
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
  int delayTime=100;
  for (count=1;count<=10;count++) // repeat the entire sequence 10 times
  {
    digitalWrite(2,HIGH); // These are the RED LED’s
    digitalWrite(4,HIGH);
    digitalWrite(6,HIGH); // Turn them ON
    digitalWrite(8,HIGH);
    delay(delayTime);
    digitalWrite(2,LOW);
    digitalWrite(4,LOW);  
    digitalWrite(6,LOW);  // TURN RED OFF
    digitalWrite(8,LOW);
    delay(delayTime);
    digitalWrite(3,HIGH); // These are the GREEN LED’s
    digitalWrite(5,HIGH);
    digitalWrite(7,HIGH); // TURN them ON
    delay(delayTime);
    digitalWrite(3,LOW);
    digitalWrite(5,LOW); // TURN GREEN OFF
    digitalWrite(7,LOW);
    delay(delayTime);
  }
  delay(delayTime*40);
}

