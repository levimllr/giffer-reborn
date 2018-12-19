// ***************ACTIVITIES TO CHECK WHILE GRADING BEGIN*******************
//
// 1.	LED 2,3,4,5,6,7,8 should turn on and off with a 200ms delay between
// 2.	Then LED 9,10,11,12,13,14,15 should turn on and off with a 200ms delay between
// 3.	Should pause for 4 seconds with all LEDS OFF and then repeat the sequence again
// 4.	Verify that they have used TWO while loops one for 2-8 and another for 9-15
//
// ***************ACTIVITIES TO CHECK WHILE GRADING END*********************

void setup()
{
  int ledNumber; ; // creates an integer ledNumber
  
  ledNumber = 2; // sets the value stored in ledNumber
  while(ledNumber <= 15) // this while loop will repeat fourteen times
  {                                      // Enables pin 2 – 15 on the Arduino to Send enough power to turn on a LED
    pinMode(ledNumber, OUTPUT);  
    ledNumber = ledNumber + 1;    

  }
}

void loop()
{
  int ledNumber; // creates an integer ledNumber
  
  ledNumber = 2; // sets the value stored in ledNumber
  while(ledNumber <= 8) // this while loop will repeat seven times
  {                                     // this will turn on and off LED 2 – 8 with a 200ms delay between each
    digitalWrite(ledNumber, HIGH);
    delay(200);
    digitalWrite(ledNumber, LOW);
    ledNumber = ledNumber + 1;    
  }
 
   ledNumber = 9; // sets the value stored in ledNumber
  while(ledNumber <= 15) // this while loop will repeat seven times
  {                                     // this will turn on and off LED 9-15 with a 200ms delay between each
    digitalWrite(ledNumber, HIGH);
    delay(200);
    digitalWrite(ledNumber, LOW);
    ledNumber = ledNumber +1;    
  }
 
  delay(4000); // waits four seconds before repeating everything in loop() over and over again indefinitely 
}

