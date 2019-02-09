//**************ACTIVITES TO CHECK WHILE GRADING**********BEGIN*********
//
// 1.	Make sure that an array named LEDsInAZigZagGoingDown has been created and used
// 2.	Ensure that a function has been created named ArraysSequenceLEDsInAZigZagGoingUp
// 3.	The order of the LED’s should be 15, 8, 14, 7, 13, 6, 12, 5, 11, 4, 10, 3, 9, 2     
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
  ArraysSequenceLEDsInAZigZagGoingDown(100,100, 3);
}

void ArraysSequenceLEDsInAZigZagGoingDown(int onTime,int offTime, int repeatCount)
{
  int LEDsInAZigZagGoingDown[14] = {
    15,8,14,7,13,6,12,5,11,4,18,3,9,2    };
  int index;
  int count;

  for (count = 1; count <= repeatCount; count++)
  {
    for (index = 0; index <= 13; index++)
    {
      digitalWrite(LEDsInAZigZagGoingDown[index], HIGH);
      delay(onTime);
      digitalWrite(LEDsInAZigZagGoingDown[index], LOW);
      delay(offTime);
    }
  }
}


