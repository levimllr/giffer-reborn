void setup()
{
  Serial.begin(9600); // Setup the serial port speed
  Serial.println("Begin setup()"); // Send to Serial port for debug
  Serial.println("Make pins 2-15 outputs"); // Send to Serial port for debug
  for(int  ledNumber = 2; ledNumber <= 15; ledNumber ++)
  {
    pinMode(ledNumber, OUTPUT);
  }
  Serial.println("Pins 2-15 are outputs"); // Send to Serial port for debug
  Serial.println("Finished setup()"); // Send to Serial port for debug
}

void loop()
{
  Serial.println("Begin loop()"); // Send to Serial port for debug
  Serial.println("Begin turning LED's 2-15 on / off"); // Send to Serial port for debug
  int ledNumber;
  int delayTime = 200;
  for (ledNumber = 2; ledNumber <= 15; ledNumber++)
  {
    Serial.print("Turn on ledNumber "); // Send to Serial port for debug
    Serial.println(ledNumber); // print a variable & finish printing the line
    digitalWrite(ledNumber, HIGH);
    delay(delayTime);
    digitalWrite(ledNumber, LOW);
    Serial.print("Turn off ledNumber "); // Send to Serial port for debug
    Serial.println(ledNumber); // print a variable & finish printing the line
  }
  Serial.println("Done turning LED's 2-15 on / off"); // Send to Serial port for debug
  Serial.println("delay 5 seconds"); // print a variable & finish printing the line
  Serial.println("Finished loop()"); // Send to Serial port for debug
  delay(5000);
}