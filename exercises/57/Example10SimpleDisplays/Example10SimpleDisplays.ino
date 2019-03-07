void setup()
{
  Serial.begin(9600);
  pinMode(5, INPUT);
  int pinNumber;
  for (pinNumber = 2; pinNumber <= 15; pinNumber++)
  {
    pinMode(pinNumber, OUTPUT);
  }
}

void loop()
{
  LEDsChasing(100, 100, 5);
  buildOnEachRow(100, 100, 5);
  LEDsSlideTogether(100, 0, 15);
  swoopUpThenDown(20, 100, 5);
  allLEDsBlink(100, 100, 5);
  inverseChasing(100, 100, 5);
  fourQuadrants(200, 200, 200, 5);
  LEDsOnOutwards(200, 100, 100, 5);
  LEDsOnInwards(100, 200, 200, 5);
  bounceUp(50, 100, 100, 5);
  bounceUpThenInverse(50, 100, 100, 5);
  zigZagAccross(300, 0, 5);
  groupOfThree(200, 0, 5);
  eachWaveOn(100, 100, 5);
  LEDsOnInwards(100, 200, 200, 5);
  delay(6000);
}

void LEDsChasing(int LEDOnTime, int LEDOffTime, int RepeatCount)
{
  Serial.print("LEDs Chasing");
  Serial.println("");
  int LEDNumber[7] = {
    2, 3, 4, 5, 6, 7, 8
  };
  int otherLEDNumber[7] = {
    15, 14, 13, 12, 11, 10, 9
  };
  int index;
  int repeat;
  for (repeat = 1; repeat <= RepeatCount; repeat++)
  {
    for (index = 0; index < 7; index++)
    {
      digitalWrite(LEDNumber[index], HIGH);
      digitalWrite(otherLEDNumber[index], HIGH);
      delay(LEDOnTime);
      digitalWrite(LEDNumber[index], LOW);
      digitalWrite(otherLEDNumber[index], LOW);
    }
  }
}

void buildOnEachRow(int LEDOnTime, int LEDStayOnTime, int RepeatCount)
{
  Serial.print("Build on Each Row");
  Serial.println("");
  int LEDNumber[7] = {
    2, 3, 4, 5, 6, 7, 8
  };
  int otherLEDNumber[7] = {
    15, 14, 13, 12, 11, 10, 9
  };
  int index;
  int repeat;
  int finalIndex = 6;

  for (repeat = 1; repeat <= RepeatCount; repeat++) //Loop that keeps track of repeats
  {
    finalIndex = 6;
    while (finalIndex >= 0) { //While the final Index is greater than 0
      for (index = 0; index <= finalIndex; index++) //Each individual Slide up, final index will decrease each time this completes
      {
        digitalWrite(LEDNumber[index], HIGH);
        digitalWrite(otherLEDNumber[index], HIGH);
        delay(LEDOnTime);
        if (index != finalIndex) //If the index is not equal to the final index than turn the LED off
        {
          digitalWrite(LEDNumber[index], LOW);
          digitalWrite(otherLEDNumber[index], LOW);
        }
        else { //If the index is equal, keep the final LED's on, decrease the final index and repeat the loop from the first for loop.
          finalIndex = finalIndex - 1;
        }
      }
    }
    delay(LEDStayOnTime); //Holds all LED's on once all are turned on
    for (index = 0 ; index <= 6; index++) // Turns off all led's in sequence they were turned on but backwards
    {
      delay(LEDOnTime);
      digitalWrite(LEDNumber[index], LOW);
      digitalWrite(otherLEDNumber[index], LOW);
    }
  }
}

void swoopUpThenDown(int delayIncrement, int ledOnTime, int RepeatCount)
{
  Serial.print("Swoop up then down");
  Serial.println("");
  int LEDNumberYellow[7] = {
    2, 3, 4, 5, 6, 7, 8
  };
  int LEDNumberBlue[7] = {
    15, 14, 13, 12, 11, 10, 9
  };
  int index;
  int repeat;
  int increasingDelay;

  for (repeat = 1; repeat <= RepeatCount; repeat++)
  {
    index = 0;
    while (index < 7)
    {
      for (increasingDelay = delayIncrement; increasingDelay <= delayIncrement * 7; increasingDelay = increasingDelay + delayIncrement)
      {
        digitalWrite(LEDNumberYellow[index], HIGH);
        digitalWrite(LEDNumberBlue[index], HIGH);
        delay(increasingDelay);
        digitalWrite(LEDNumberYellow[index], LOW);
        digitalWrite(LEDNumberBlue[index], LOW);
        index++;
      }
    }
    index = 6;
    while (index >= 0)
    {
      for (increasingDelay = delayIncrement * 7; increasingDelay >= delayIncrement; increasingDelay = increasingDelay - delayIncrement)
      {
        digitalWrite(LEDNumberYellow[index], HIGH);
        digitalWrite(LEDNumberBlue[index], HIGH);
        delay(increasingDelay);
        digitalWrite(LEDNumberYellow[index], LOW);
        digitalWrite(LEDNumberBlue[index], LOW);
        index--;
      }
    }
  }
}

void allLEDsBlink(int LEDOnTime, int LEDOffTime, int RepeatCount)
{
  Serial.print("All LED's Blink");
  Serial.println("");
  int repeat;
  int LEDNumber;
  for (repeat = 1; repeat <= RepeatCount; repeat++)
  {
    for (LEDNumber = 2; LEDNumber <= 15; LEDNumber ++)
    {
      digitalWrite(LEDNumber, HIGH);
    }
    delay(LEDOnTime);
    for (LEDNumber = 2; LEDNumber <= 15; LEDNumber ++)
    {
      digitalWrite(LEDNumber, LOW);
    }
    delay(LEDOffTime);
  }
}

void LEDsSlideTogether (int LEDOnTime, int LEDOffTime, int RepeatCount)
{
  Serial.print("LEDs Slide Together");
  Serial.println("");
  int repeat;
  int LEDNumberYellow[7] = {
    2, 3, 4, 5, 6, 7, 8
  };
  int LEDNumberBlue[7] = {
    9, 10, 11, 12, 13, 14, 15
  };
  int index;

  for (repeat = 1; repeat <= RepeatCount; repeat++)
  {
    for (index = 0; index <= 6; index++)
    {
      digitalWrite(LEDNumberYellow[index], HIGH);
      digitalWrite(LEDNumberBlue[index], HIGH);
      delay(LEDOnTime);
      digitalWrite(LEDNumberYellow[index], LOW);
      digitalWrite(LEDNumberBlue[index], LOW);
      delay(LEDOffTime);
    }
  }
}

void inverseChasing (int LEDOnTime, int LEDOffTime, int RepeatCount)
{
  Serial.print("Inverse Chasing");
  Serial.println("");
  int repeat;
  int LEDNumberYellow[7] = {
    2, 3, 4, 5, 6, 7, 8
  };
  int LEDNumberBlue[7] = {
    15, 14, 13, 12, 11, 10, 9
  };
  int index;
  for (repeat = 1; repeat <= RepeatCount; repeat++)
  {
    for (index = 0; index <= 6; index++)
    {
      digitalWrite(LEDNumberYellow[index], HIGH);
      digitalWrite(LEDNumberBlue[index], HIGH);
    }

    for (repeat = 1; repeat <= RepeatCount; repeat++)
    {
      for (index = 0; index <= 6; index++)
      {
        digitalWrite(LEDNumberYellow[index], LOW);
        digitalWrite(LEDNumberBlue[index], LOW);
        delay(LEDOnTime);
        digitalWrite(LEDNumberYellow[index], HIGH);
        digitalWrite(LEDNumberBlue[index], HIGH);
        delay(LEDOffTime);
      }
    }

    for (index = 0; index <= 6; index++)
    {
      digitalWrite(LEDNumberYellow[index], LOW);
      digitalWrite(LEDNumberBlue[index], LOW);
    }
  }
}

void fourQuadrants (int delayIncrement, int totalOnTime, int totalOffTime, int RepeatCount)
{
  Serial.print("Four Quadrants");
  Serial.println("");
  int repeat;
  int quadrant1[4] = {
    5, 6, 7, 8
  };
  int quadrant2[3] = {
    2, 3, 4
  };
  int quadrant3[4] = {
    9, 10, 11, 12
  };
  int quadrant4[3] = {
    13, 14, 15
  };

  int index;

  for (repeat = 1; repeat <= RepeatCount; repeat++)
  {
    for (index = 0; index < 4; index++)
    {
      digitalWrite(quadrant1[index], HIGH);
    }
    delay(delayIncrement);
    for (index = 0; index < 3; index++)
    {
      digitalWrite(quadrant2[index], HIGH);
    }
    delay(delayIncrement);
    for (index = 0; index < 4; index++)
    {
      digitalWrite(quadrant3[index], HIGH);
    }
    delay(delayIncrement);
    for (index = 0; index < 3; index++)
    {
      digitalWrite(quadrant4[index], HIGH);
    }
    delay(totalOnTime);
    for (index = 0; index < 4; index++)
    {
      digitalWrite(quadrant1[index], LOW);
    }
    delay(delayIncrement);
    for (index = 0; index < 3; index++)
    {
      digitalWrite(quadrant2[index], LOW);
    }
    delay(delayIncrement);
    for (index = 0; index < 4; index++)
    {
      digitalWrite(quadrant3[index], LOW);
    }
    delay(delayIncrement);
    for (index = 0; index < 3; index++)
    {
      digitalWrite(quadrant4[index], LOW);
    }
    delay(totalOffTime);
  }
}

void LEDsOnOutwards (int delayIncrement, int totalOnTime, int totalOffTime, int RepeatCount)
{
  Serial.print("LEDs On Outwards");
  Serial.println("");
  int repeat;
  int LEDsYellow[6] = {
    4, 6, 3, 7, 2, 8
  };
  int LEDsBlue[6] = {
    11, 13, 10, 14, 9, 15
  };
  int index;

  for (repeat = 1; repeat <= RepeatCount; repeat++)
  {
    digitalWrite(5, HIGH);
    digitalWrite(12, HIGH);
    delay(delayIncrement);
    for (index = 0; index < 6; index = index + 2)
    {
      digitalWrite(LEDsYellow[index], HIGH);
      digitalWrite(LEDsYellow[index + 1], HIGH);
      digitalWrite(LEDsBlue[index], HIGH);
      digitalWrite(LEDsBlue[index + 1], HIGH);
      delay(delayIncrement);
    }
    delay(totalOnTime);
    for (index = 5; index >= 0; index = index - 2)
    {
      digitalWrite(LEDsYellow[index], LOW);
      digitalWrite(LEDsYellow[index - 1], LOW);
      digitalWrite(LEDsBlue[index], LOW);
      digitalWrite(LEDsBlue[index - 1], LOW);
      delay(delayIncrement);
    }
    digitalWrite(5, LOW);
    digitalWrite(12, LOW);
    delay(totalOffTime);
  }
}

void bounceUp(int delayIncrement, int LEDOnTime, int LEDOffTime, int repeatCount)
{
  Serial.print("Bounce Up");
  Serial.println("");
  int yellowLEDs[7] = {2, 3, 4, 5, 6, 7, 8};
  int blueLEDs[7] = {9, 10, 11, 12, 13, 14, 15};
  int repeat;
  int index;
  for (repeat = 1; repeat <= repeatCount; repeat++)
  {
    for (index = 0; index < 7; index++)
    {
      digitalWrite(yellowLEDs[index], HIGH);
      digitalWrite(blueLEDs[index], HIGH);
      delay(delayIncrement);
    }
    delay(LEDOnTime);
    for (index = 6; index >= 0; index--)
    {
      digitalWrite(yellowLEDs[index], LOW);
      digitalWrite(blueLEDs[index], LOW);
      delay(delayIncrement);
    }
    delay(LEDOffTime);

  }
}

void bounceUpThenInverse(int delayIncrement, int LEDOnTime, int LEDOffTime, int repeatCount)
{
  Serial.print("Bounce Up Then Inverse");
  Serial.println("");
  int yellowLEDs[7] = {2, 3, 4, 5, 6, 7, 8};
  int blueLEDs[7] = {9, 10, 11, 12, 13, 14, 15};
  int repeat;
  int index;
  for (repeat = 1; repeat <= repeatCount; repeat++)
  {
    for (index = 0; index < 7; index++)
    {
      digitalWrite(yellowLEDs[index], HIGH);
      digitalWrite(blueLEDs[index], HIGH);
      delay(delayIncrement);
    }
    delay(LEDOnTime);
    for (index = 0; index < 7; index++)
    {
      digitalWrite(yellowLEDs[index], LOW);
      digitalWrite(blueLEDs[index], LOW);
      delay(delayIncrement);
    }
    delay(LEDOffTime);

  }
}

void zigZagAccross(int LEDOnTime, int LEDOffTime, int RepeatCount)
{
  Serial.print("LEDs Zig Zag");
  Serial.println("");
  int repeat;
  int LEDNumberSequence[7] = {9, 3, 11, 5, 13, 7, 15};
  int index;

  for (repeat = 1; repeat <= RepeatCount; repeat++)
  {
    for (index = 0; index < 7; index++)
    {
      digitalWrite(LEDNumberSequence[index], HIGH);
      delay(LEDOnTime);
      digitalWrite(LEDNumberSequence[index], LOW);
      delay(LEDOffTime);
    }
  }
}

void groupOfThree(int LEDOnTime, int LEDOffTime, int RepeatCount)
{
  Serial.print("Group of three");
  Serial.println("");
  int repeat;
  int LEDNumberSequence[14] = {2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15};
  int index;

  for (repeat = 1; repeat <= RepeatCount; repeat++)
  {
    for (index = -2; index < 14; index++)
    {
      digitalWrite(LEDNumberSequence[index], HIGH);
      digitalWrite(LEDNumberSequence[index + 1], HIGH);
      digitalWrite(LEDNumberSequence[index + 2], HIGH);
      delay(LEDOnTime);
      digitalWrite(LEDNumberSequence[index], LOW);
      if (index < 12)
      {
        digitalWrite(LEDNumberSequence[index + 1], LOW);
        digitalWrite(LEDNumberSequence[index + 2], LOW);
      }
      delay(LEDOffTime);
    }
  }
}

void eachWaveOn(int LEDOnTime, int LEDOffTime, int RepeatCount)
{
  Serial.print("Each Wave On");
  Serial.println("");
  int LEDNumber;
  int repeat;
  int index;

  for (repeat = 1; repeat <= RepeatCount; repeat++)
  {
    for (LEDNumber = 2; LEDNumber <= 8; LEDNumber++)
    {
      digitalWrite(LEDNumber, HIGH);
    }
    delay(LEDOnTime);
    for (LEDNumber = 2; LEDNumber <= 8; LEDNumber++)
    {
      digitalWrite(LEDNumber, LOW);
    }
    delay(LEDOffTime);
    for (LEDNumber = 9; LEDNumber <= 15; LEDNumber++)
    {
      digitalWrite(LEDNumber, HIGH);
    }
    delay(LEDOnTime);
    for (LEDNumber = 9; LEDNumber <= 15; LEDNumber++)
    {
      digitalWrite(LEDNumber, LOW);
    }
    delay(LEDOffTime);
  }
}

void LEDsOnInwards(int delayTime, int LEDOffTime, int LEDOnTime, int RepeatCount)
{
  Serial.print("On Inwards");
  Serial.println("");
  int LEDNumberSequence1[4] = {2, 9, 8, 15};
  int LEDNumberSequence2[4] = {3, 10, 7, 14};
  int LEDNumberSequence3[4] = {4, 11, 6, 13};

  int repeat;
  int index;

  for (repeat = 1; repeat <= RepeatCount; repeat++)
  {
    for (index = 0; index < 4; index++)
    {
      digitalWrite(LEDNumberSequence1[index], HIGH);
    }
    delay(delayTime);
    for (index = 0; index < 4; index++)
    {
      digitalWrite(LEDNumberSequence2[index], HIGH);
    }
    delay(delayTime);
    for (index = 0; index < 4; index++)
    {
      digitalWrite(LEDNumberSequence3[index], HIGH);
    }
    delay(delayTime);
    digitalWrite(5, HIGH);
    digitalWrite(12, HIGH);
    delay(LEDOnTime);
    digitalWrite(5, LOW);
    digitalWrite(12, LOW);
    delay(delayTime);
    for (index = 0; index < 4; index++)
    {
      digitalWrite(LEDNumberSequence3[index], LOW);
    }
    delay(delayTime);
    for (index = 0; index < 4; index++)
    {
      digitalWrite(LEDNumberSequence2[index], LOW);
    }
    delay(delayTime);
    for (index = 0; index < 4; index++)
    {
      digitalWrite(LEDNumberSequence1[index], LOW);
    }
    delay(LEDOffTime);
  }
}
