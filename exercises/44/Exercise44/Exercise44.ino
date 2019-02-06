//**************ACTIVITES TO CHECK WHILE GRADING**********BEGIN*********
//
// 1.	Make sure that an array named LEDsCounterClockwise has been created and used
// 2.	Ensure that a function has been created named ArraysSequenceLEDsCounterClockwiseStartAt2
// 3.	The order of the LED’s should be 2,3,4,5,6,7,8,15,14,13,12,11,10,9
// 4.	Make sure that function uses three parameters (example – but not required - ledOnTime, ledOffTime, and repeatCount)
//
// ***************ACTIVITIES TO CHECK WHILE GRADING END*********************

void setup()
{
  int LEDNum;

  for(LEDNum = 2; LEDNum <= 15; LEDNum++)
  {
    pinMode(LEDNum, OUTPUT);
  }
}

void loop()
{
  ArraysSequenceLEDsCounterClockwiseStartAt2(100,100, 3);
}

void ArraysSequenceLEDsCounterClockwiseStartAt2(int ledOnTime,int ledOffTime, int repeatCount)// Exercise 24
{
  int LEDsCounterClockwise[14] = { 
    2, 3, 4, 5, 6, 7, 8, 15, 14, 13, 12, 11, 10, 9      };
  int index;
  int count;

  for (count = 1; count <= repeatCount; count++)
  {
    for (index = 0; index <= 13; index++)
    {
      digitalWrite(LEDsCounterClockwise[index], HIGH);
      delay(ledOnTime);
      digitalWrite(LEDsCounterClockwise[index], LOW);
      delay(ledOffTime);
    }
  }
}
