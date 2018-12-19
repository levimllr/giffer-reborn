// ***************ACTIVITIES TO CHECK WHILE GRADING BEGIN*******************
//
// 1.	LED 2,3,4 should blink on and off 12 times with a 200ms delay between.
// 2.	Should pause for 4 seconds with all LEDS OFF and then repeat the sequence again
// 3.	Verify that they have used a for loop and:
//          Modified the counter to count 12 times
//
// ***************ACTIVITIES TO CHECK WHILE GRADING END*********************


void setup()
{
  pinMode(2, OUTPUT);
  pinMode(3, OUTPUT);
  pinMode(4, OUTPUT);
}


void loop()
{
  int waitTime;
  int count;

  waitTime = 200;

  for(count = 1; count <= 12; count++)  // This for loop will repeat 12 times time
  { 				            // LED 2,3,4 will blink on / off each time the loop repeats
    digitalWrite(2, HIGH);
    delay(waitTime);
    digitalWrite(2, LOW);
    delay(waitTime);
    digitalWrite(3, HIGH);
    delay(waitTime);
    digitalWrite(3, LOW);
    delay(waitTime);
    digitalWrite(4, HIGH);
    delay(waitTime);
    digitalWrite(4, LOW);
    delay(waitTime);

  }

  delay(waitTime*20);
}

