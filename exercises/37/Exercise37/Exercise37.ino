//**************ACTIVITIES TO CHECK WHILE GRADING**********BEGIN*********
//
// 1. Make sure that function uses the parameters LEDOnTime, LEDOffTime, and repeatCount
// 2. Ensure that the function is named LEDsInAZigZagMovingUp and it is using two for loops
// 3. Make sure that the for loop includes the math some sort of math like otherLEDNum = ledNumber +7
//
//**************ACTIVITIES TO CHECK WHILE GRADING**********END*********

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
  int count;

  for(count=1; count<=3; count++)
  {
    LEDsInAZigZagMovingUp (200, 200, 1);
  }
  delay(3000);
}

void LEDsInAZigZagMovingUp (int LEDOnTime, int LEDOffTime, int RepeatCount)
{
  int count;
  int ledNumber;
  int otherLedNum;

  for (count=1; count<= RepeatCount; count++)
  {
    for (ledNumber=2; ledNumber<=8; ledNumber++)
    {
      otherLedNum= ledNumber+7;
      digitalWrite (ledNumber, HIGH);
      delay (LEDOnTime);
      digitalWrite (ledNumber, LOW);
      delay (LEDOnTime);
      digitalWrite (otherLedNum, HIGH);
      delay (LEDOnTime);
      digitalWrite (otherLedNum, LOW);
      delay (LEDOffTime);   
    }
  }
}