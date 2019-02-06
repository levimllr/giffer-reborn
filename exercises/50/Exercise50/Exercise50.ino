//**************ACTIVITES TO CHECK WHILE GRADING**********BEGIN*********
//
// 1.	Make sure that an array named LEDsYellowRedOrangeGreenBlue has been created and used
// 2.	Ensure that a function has been created named ArraysSequenceShowAlltheColors
// 3.	The order of the LED’s should be (15,14) , (15, 14) , (15, 14), (2,4,6,8), (2,4,6,8), (11,10,9), (11,10,9), (11,10,9) (3,5,7), (3,5,7), (3,5,7), (12,13), (12,13), (12,13)
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
  ArraysSequenceShowAllTheColors(100,100, 3);
}

void ArraysSequenceShowAllTheColors (int LedOnTime, int LedOffTime, int RepeatCount)
{
  int count;
  int ledNumber;
  int index;

  char color [14] = {
    'R', 'G', 'R', 'G', 'R', 'G', 'R', 'O', 'O', 'O', 'B', 'B', 'Y', 'Y'              };

  for (count=1; count <=RepeatCount; count++)
  {
    for (index=0; index<=13; index++)
    {
      if (color[index] ='Y')
      {
        for (count=1; count<=3; count++)
        {
          digitalWrite (15, HIGH);
          digitalWrite (14, HIGH);
          delay (LedOnTime);
          digitalWrite (15, LOW);
          digitalWrite (14, LOW);
          delay (LedOffTime);
        }
      }

      if (color [index]= 'R')
      {
        for (count =1; count<=3; count++)
        {
          digitalWrite (2, HIGH);
          digitalWrite (4, HIGH);
          digitalWrite (6, HIGH);
          digitalWrite (8, HIGH);
          delay (LedOnTime);
          digitalWrite (2, LOW);
          digitalWrite (4, LOW);
          digitalWrite (6, LOW);
          digitalWrite (8, LOW);
          delay (LedOffTime);
        }
      }

      if (color [index] ='O')
      {
        for (count =1; count<=3; count++)
        {
          digitalWrite (9, HIGH);
          digitalWrite(10, HIGH);
          digitalWrite (11, HIGH);
          delay (LedOnTime);
          digitalWrite (9, LOW);
          digitalWrite(10, LOW);
          digitalWrite (11, LOW);
          delay (LedOffTime);
        }
      }
      if (color [index] ='G')
      {
        for (count=1; count<=3; count++)
        {
          digitalWrite (3, HIGH);
          digitalWrite(5, HIGH);
          digitalWrite (7, HIGH);
          delay (LedOnTime);
          digitalWrite (3, LOW);
          digitalWrite(5, LOW);
          digitalWrite (7, LOW);
          delay (LedOffTime);
        }
      }

      if (color [index] ='B')
      {
        for (count=1; count<=3; count++)
        {
          digitalWrite (12, HIGH);
          digitalWrite(13, HIGH);
          delay (LedOnTime);
          digitalWrite (12, LOW);
          digitalWrite(13, LOW);
          delay (LedOffTime);
        }
      }
    } // end of Index loop
  } // end of RepeatCount loop
}




