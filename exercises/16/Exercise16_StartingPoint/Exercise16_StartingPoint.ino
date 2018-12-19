// ***************ACTIVITIES TO CHECK WHILE GRADING BEGIN*******************
//
// 1.	LED 2&9,3&10,4&11,5&12,6&13,7&14,8&15 should turn on and off with a 200ms delay between.
// 2.	Should pause for 4 seconds with all LEDS OFF and then repeat the sequence again
// 3.	Verify that they have used one while loop and:
//          otherLedNum = ledNumber +7;
//          digitalWrite(ledNumber, HIGH);
//          digitalWrite(otherLedNum, HIGH);
//
// ***************ACTIVITIES TO CHECK WHILE GRADING END*********************

void setup()
{
  int ledNumber; ; // creates an integer ledNumber
  ledNumber = 2; // sets the value stored in ledNumber
  while (ledNumber <= 15) // this while loop will repeat fourteen times
  { // Enables pin 2 – 15 on the Arduino to Send enough power to turn on a LED
    pinMode(ledNumber, OUTPUT);
    ledNumber = ledNumber + 1;
  }
}

void loop()
{
  int ledNumber; // creates an integer ledNumber
  int otherLedNum; // creates an integer otherLedNum
  ledNumber = 2; // sets the value stored in ledNumber
  while (ledNumber <= 8) // this while loop will repeat seven times
  { // this will turn on and off LED 2&9, 3&10... 8&15 with a 200ms delay between each
    otherLedNum = ledNumber + 7;
    digitalWrite(ledNumber, HIGH);
    digitalWrite(otherLedNum, HIGH);
    delay(200);
    digitalWrite(ledNumber, LOW);
    digitalWrite(otherLedNum, LOW);
    ledNumber = ledNumber + 1;
  }
  delay(4000); // waits four seconds before repeating everything in loop() over and over again indefinitely
}

