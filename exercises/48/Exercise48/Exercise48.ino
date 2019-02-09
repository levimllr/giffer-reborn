//**************ACTIVITES TO CHECK WHILE GRADING**********BEGIN*********
//
// 1.	Make sure that an array named LEDsClockwiseStartAt8 has been created and used
// 2.	Ensure that a function has been created named ArraysSequenceLEDsClockwiseStartAt8
// 3.	The order of the LED’s should be 8,7,6,5,4,3,2,9,10,11,12,13,14,15
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
  ArraysSequenceLEDsClockwiseStartAt8(100,100, 3);
}

void ArraysSequenceLEDsClockwiseStartAt8(int onTime, int offTime, int repeatCount)
{
  int LEDsClockwiseStartAt8[14] = {
    8, 7, 6, 5, 4, 3, 2, 9, 10, 11, 12, 13, 14, 15    };
  int index;
  int count;

  for (count = 1; count <= repeatCount; count++)
  {
    for (index = 0; index <= 14; index++)
    {
      digitalWrite(LEDsClockwiseStartAt8[index], HIGH);
      delay(onTime);
      digitalWrite(LEDsClockwiseStartAt8[index], LOW);
      delay(offTime);
    }
  }
}

