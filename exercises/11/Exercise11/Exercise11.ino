// ***************ACTIVITIES TO CHECK WHILE GRADING BEGIN*******************
//
// 1.	LED 2,4,6,8,10,12,14 should turn on and off with a 200ms delay between
// 2.	Should pause for 4 seconds with all LEDS OFF and then repeat the sequence again
// 3.	Verify that for the while loop within loop() ledNumber = ledNumber + 2;  
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
  while(ledNumber <= 15) // this while loop will repeat seven times
  {                                     // this will turn on and off LED 2,4,6,8,10,12,14 with a 200ms delay between each
    digitalWrite(ledNumber, HIGH);
    delay(200);
    digitalWrite(ledNumber, LOW);
    ledNumber = ledNumber + 2;    
  }
  
  delay(4000); // waits four seconds before repeating everything in loop() over and over again indefinately 
}

