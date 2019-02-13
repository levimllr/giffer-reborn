void setup()
{
  int pinNumber;

  for (pinNumber = 2; pinNumber <= 15; pinNumber++)
  {
    pinMode(pinNumber, OUTPUT);
  }
}

void loop ()
{
  int count;

  for (count = 1; count <= 3; count++)
  {
    yourCustomFunction();
  }
  delay(3000);
}

void yourCustomFunction()
{
  delay(100);
}
