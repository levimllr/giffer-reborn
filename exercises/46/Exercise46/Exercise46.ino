//**************ACTIVITES TO CHECK WHILE GRADING**********BEGIN*********
//
// 1.	Make sure that an array named LEDsInAZigZagGoingUp has been created and used
// 2.	Ensure that a function has been created named ArraysSequenceLEDsInAZigZagGoingUp
// 3.	The order of the LED’s should be 2,9,3,10,4,11,5,12,6,19,7,14,8,15
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
  ArraysSequenceLEDsInAZigZagGoingUp(100,100, 3);
}

void ArraysSequenceLEDsInAZigZagGoingUp(int onTime,int offTime, int repeatCount)
{
  int LEDsInAZigZagGoingUp[14] = {
    2, 9, 3, 10, 4, 11, 5, 12, 6, 13, 7, 14, 8, 15    };
  int index;
  int count;

  for (count = 1; count <= repeatCount; count++)
  {
    for (index = 0; index <= 13; index++)
    {
      digitalWrite(LEDsInAZigZagGoingUp[index], HIGH);
      delay(onTime);
      digitalWrite(LEDsInAZigZagGoingUp[index], LOW);
      delay(offTime);
    }
  }
}
