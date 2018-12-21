// ***************ACTIVITIES TO CHECK WHILE GRADING BEGIN*******************
//
// 1.	LED 8-2 should turn on and off with a 100ms delay between ten times
// 2.	Should pause for 4 seconds with all LEDS OFF and then repeat the sequence again
// 3.	Verify that nested for loops are used
// 4.	Verify that delay(waitTime) is used
// 5.	Verify that delay(waitTime*something) is used
//
// ***************ACTIVITIES TO CHECK WHILE GRADING END*********************

void setup()
{
  int ledNumber;  
  for(ledNumber = 2; ledNumber <= 15; ledNumber ++)
  { 
    pinMode(ledNumber, OUTPUT);
  }
}

void loop()
{
  int ledNumber;
  int count;
  int delayTime=100;
  for(count = 1; count <= 10; count++)
  {  
    for(ledNumber = 8; ledNumber >= 2; ledNumber--)
    { 
      digitalWrite(ledNumber, HIGH);
      delay(delayTime);
      digitalWrite(ledNumber, LOW);
    }  
  }
    delay(delayTime*40);
}

