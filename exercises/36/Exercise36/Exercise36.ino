//**************ACTIVITES TO CHECK WHILE GRADING**********BEGIN*********
//
//1.	Verify that LEDs blink in the order 2, 3, 4, 5, 6, 7, 8, 15, 14, 13, 12, 11, 10, 9
//2.	Check to make sure sequenceLEDsCounterClockwise repeats RepeatCount amount of times.
//3.	Verify that they use parameters LEDOntime, LEDOffTime, and RepeatCount
//4.	Verify that there are THREE for loops 
//
// ***************ACTIVITIES TO CHECK WHILE GRADING END*********************

void setup()
{ 
  int pinNumber;

  for(pinNumber = 2; pinNumber <= 15; pinNumber++)
  { 
    pinMode(pinNumber, OUTPUT);
  }
}

void loop ()
{
	sequenceLEDsCounterClockwise(150, 150, 3);
	delay(5000);
}
void sequenceLEDsCounterClockwise(int LEDOnTime, int LEDOffTime, int RepeatCount)
{ 
  int count;
  int ledNumber;

  for(count = 	1; count <= RepeatCount; count++)
  {
    for(ledNumber = 2; ledNumber <= 8; ledNumber++)
    { 
      digitalWrite(ledNumber, HIGH);
      delay(LEDOnTime);
      digitalWrite(ledNumber, LOW);
      delay(LEDOffTime);
    }
    for(ledNumber = 15; ledNumber >= 9; ledNumber--)
    {
      digitalWrite(ledNumber, HIGH);
      delay(LEDOnTime);
      digitalWrite(ledNumber, LOW);
      delay(LEDOffTime);
    }
  }
}


