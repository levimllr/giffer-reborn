// ==============SOLVED EXERCISE ====END==========================
// ***************ACTIVITIES TO CHECK WHILE GRADING BEGIN*******************
//
// 1.	LED 2 should blink on and off 2 times with a 200ms delay between.
// 2.	LED 3 should blink on and off 3 times with a 200ms delay between.
// 3.	LED 4 should blink on and off 4 times with a 200ms delay between.
// 4.	Should pause for 8 seconds with all LEDS OFF and then repeat the sequence again
// 5.	Verify that they have used THREE for loops and:
//          Modified the counters to count 2, 3, 4 times
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


  for(count = 1; count <= 2; count++)  // This for loop will repeat 2 times time
  { 				            // LED 2 will blink on / off each time the loop repeats
    digitalWrite(2, HIGH);
    delay(waitTime);
    digitalWrite(2, LOW);
    delay(waitTime);
  }
  
  for(count = 1; count <= 3; count++)  // This for loop will repeat 3 times time
  { 				            // LED 3 will blink on / off each time the loop repeats
    digitalWrite(3, HIGH);
    delay(waitTime);
    digitalWrite(3, LOW);
    delay(waitTime);
  }

  for(count = 1; count <= 4; count++)  // This for loop will repeat 4 times time
  { 				            // LED 4 will blink on / off each time the loop repeats
    digitalWrite(4, HIGH);
    delay(waitTime);
    digitalWrite(4, LOW);
    delay(waitTime);
  }

  delay(waitTime*20);
}
