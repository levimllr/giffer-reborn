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
  Serial.println("End setup()"); // Send to Serial port for debug
}

void loop()
{
  Serial.println("Begin loop()");

  int ledNumber;
  for (ledNumber = 2; ledNumber <= 15; ledNumber++)
  {
    if (ledNumber==2)
    {
        Serial.println("Entering for loop with ledNumber == 2");
    }
    digitalWrite(ledNumber, HIGH);
    Serial.print("The value of ledNumber is: "); // print a string of characters
    Serial.println(ledNumber); // print a variable
    delay(200);
    digitalWrite(ledNumber, LOW);
    delay(200);
    if (ledNumber==15)
    {
        Serial.println("Finishing for loop with ledNumber == 15");
    }
  }
  Serial.println("Done with loop()");
  delay(2000);
}

