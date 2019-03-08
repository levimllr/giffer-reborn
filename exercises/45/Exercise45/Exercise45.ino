//**************ACTIVITIES TO CHECK WHILE GRADING**********BEGIN*********
//
// 1.	Make sure that an array named TwoLEDsUpDownTogether has been created and used
// 2.	Ensure that a function has been created named ArraysSequenceTwoLEDsUpAndDownTogether
// 3.	The order of the LED’s should be 2&9, 3&10, 4&11,5&12, 6&13,7&14, 8&15, then 7&14, 6&13, 5&12, 4&11, 3&10, 2&9
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
  ArraysSequenceTwoLEDsUpAndDownTogether(100,100, 3);
}

void ArraysSequenceTwoLEDsUpAndDownTogether(int ledOnTime, int ledOffTime, int repeatCount)
{
  int TwoLEDsUpDownTogether[26] = {
    2, 9, 3, 10, 4, 11, 5, 12, 6, 13, 7, 14, 8, 15, 7, 14, 6, 13, 5, 12, 4, 11, 3, 10, 2, 9    };
  int index;
  int count;

  for (count = 1; count <= repeatCount; count++)
  {
    for (index = 0; index <= 25; index=index+2)
    {
      digitalWrite(TwoLEDsUpDownTogether[index], HIGH);
      digitalWrite(TwoLEDsUpDownTogether[index+1], HIGH);
      delay(ledOnTime);
      digitalWrite(TwoLEDsUpDownTogether[index], LOW);
      digitalWrite(TwoLEDsUpDownTogether[index+1], LOW);
      delay(ledOffTime);
    }
  }
}

