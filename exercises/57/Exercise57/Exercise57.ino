void setup()
{
  Serial.begin(9600); // Setup the serial port speed
}

void loop()
{
  Serial.print("Hello World!");
  Serial.println("");
  delay(500);
  Serial.print("Good Bye World!!");
  Serial.println("");
  delay(5000);
}