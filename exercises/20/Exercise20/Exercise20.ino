// ***************ACTIVITIES TO CHECK WHILE GRADING BEGIN*******************
//
// 1.	LED 15,13,11,9,7,5,3 should turn on and off with a 200ms delay between
// 2.	Should pause for 4 seconds with all LEDS OFF and then repeat the sequence again
// 3.	Verify that a for loop is used
// 4.	Verify that for the for loop within loop() ledNumber = ledNumber - 2;
// 5.	Verify that delay(waitTime) is used
// 6.	Verify that delay(waitTime*something) is used
//
// ***************ACTIVITIES TO CHECK WHILE GRADING END*********************

void setup()
{
  int ledNumber;
  for(ledNumber=2;ledNumber<=15;ledNumber++) //Make pins 2-15 outputs
  {
    pinMode(ledNumber,OUTPUT);
  }
}

void loop()
{
  int waitTime;
  int ledNumber;
  waitTime=200;
  for(ledNumber=15;ledNumber>=3;ledNumber=ledNumber-2)//For loop: ledNumber starts at 15 and counts down
  {
    digitalWrite(ledNumber,HIGH);
    delay(waitTime);
    digitalWrite(ledNumber,LOW);
  }
  delay(waitTime*20);
}

