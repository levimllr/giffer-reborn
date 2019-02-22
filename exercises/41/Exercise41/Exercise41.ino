//**************ACTIVITIES TO CHECK WHILE GRADING**********BEGIN*********
//
// 1.	Ensure that the function is named sequenceAllLEDsForwardBlinkingOff and it is using FOUR for loops
// 2.	Verify that LEDs blink in the order 2 and 15 off / on 
// 3.	Make sure that function uses the parameters LEDOnTime, LEDOffTime, and repeatCount
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
  sequenceAllLEDsForwardBlinkingOff(100,0,3);    
  delay(3000);  
}

void sequenceAllLEDsForwardBlinkingOff(int onTime, int offTime, int repeatCount) 
{
  int count;
  int pinNumber;
  int off;

  for(count = 1; count <= repeatCount; count++)
  {
    for (pinNumber = 2; pinNumber <= 15; pinNumber++)
    {
      digitalWrite(pinNumber, HIGH);
      delay(offTime);
    }
    for (pinNumber = 2; pinNumber <= 15; pinNumber++)
    {
      digitalWrite(pinNumber, LOW);
      delay(onTime);
      digitalWrite(pinNumber, HIGH);
      delay(offTime);
    }
  }
  for (pinNumber = 2; pinNumber <= 15; pinNumber++)
  {
    digitalWrite(pinNumber, LOW);
    delay(offTime);
  }
}
