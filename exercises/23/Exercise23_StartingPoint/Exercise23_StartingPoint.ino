void setup()
{
  int ledNumber;
  for (ledNumber = 2; ledNumber <= 15; ledNumber ++)
  {
    pinMode(ledNumber, OUTPUT);
  }
}

void loop()
{
  int ledNumber;
  int count;
  int waitTime;
  waitTime = 100;
  for (count = 1; count <= 10; count++)
  {
    for (ledNumber = 2; ledNumber <= 8; ledNumber++)
    {
      digitalWrite(ledNumber, HIGH);
      delay(waitTime);
      digitalWrite(ledNumber, LOW);
    }
    for (ledNumber = 15; ledNumber >= 9; ledNumber--)
    {
      digitalWrite(ledNumber, HIGH);
      delay(waitTime);
      digitalWrite(ledNumber, LOW);
    }
  }
  delay(waitTime * 40);
}
