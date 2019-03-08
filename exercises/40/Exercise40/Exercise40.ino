//**************ACTIVITIES TO CHECK WHILE GRADING**********BEGIN*********
//
// 1.	Ensure that the function is named sequenceLEDsShowingAllColors and it is using ONE for loop, with the variable count
// 2.	Verify that LEDs blink in the order 14 and 15, then 2, 4, 6, 8 then 9, 10, 11 then 3, 5, 7 then 12 and 13
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
  sequenceLEDsShowingAllColors(100,0,3);    
  delay(3000);  
}

void sequenceLEDsShowingAllColors(int onTime, int offTime, int repeatCount)
{
  digitalWrite(15, HIGH);
  digitalWrite(14, HIGH);
  delay(onTime);
  digitalWrite(15, LOW);
  digitalWrite(14, LOW);
  delay(offTime);
  digitalWrite(2, HIGH);
  digitalWrite(4, HIGH);
  digitalWrite(6, HIGH);
  digitalWrite(8, HIGH);
  delay(onTime);
  digitalWrite(2, LOW);
  digitalWrite(4, LOW);
  digitalWrite(6, LOW);
  digitalWrite(8, LOW);
  delay(offTime);
  digitalWrite(9, HIGH);
  digitalWrite(10, HIGH);
  digitalWrite(11, HIGH);
  delay(onTime);
  digitalWrite(9, LOW);
  digitalWrite(10, LOW);
  digitalWrite(11, LOW);
  delay(offTime);
  digitalWrite(3, HIGH);
  digitalWrite(5, HIGH);
  digitalWrite(7, HIGH);
  delay(onTime);
  digitalWrite(3, LOW);
  digitalWrite(5, LOW);
  digitalWrite(7, LOW);
  delay(offTime);
  digitalWrite(12, HIGH);
  digitalWrite(13, HIGH);
  delay(onTime);
  digitalWrite(12, LOW);
  digitalWrite(13, LOW);
  delay(offTime);
}



