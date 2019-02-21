//**************ACTIVITIES TO CHECK WHILE GRADING**********BEGIN*********
//
// 1.	Ensure that the function is named sequenceLEDsRedsThenGreens and it is using ONE for loop, with the variable count
// 2.	Verify that LEDs blink Reds (2,4,6,8) then Greens (3,5,7)
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
  sequenceLEDsRedsThenGreens(100,0,3);    
  delay(3000);  
}

void sequenceLEDsRedsThenGreens(int onTime, int offTime, int repeatCount)// Exercise20()
{
  int count;
  for (count = 1; count <= repeatCount; count++)
  {
    digitalWrite(2, HIGH);
    digitalWrite(4, HIGH);
    digitalWrite(6, HIGH); //REDS
    digitalWrite(8, HIGH);
    delay(onTime);
    digitalWrite(2, LOW);
    digitalWrite(4, LOW);
    digitalWrite(6, LOW);
    digitalWrite(8, LOW);
    delay(offTime);

    digitalWrite(3, HIGH);
    digitalWrite(5, HIGH);
    digitalWrite(7, HIGH);  // GREENS
    delay(onTime);
    digitalWrite(3, LOW);
    digitalWrite(5, LOW);
    digitalWrite(7, LOW);
    delay(offTime);
  }
}